/**
 * コーパス検証ハーネス。
 *
 * technological-book-corpus-ja（人間が書いた実際の技術書）に対して
 * このpresetを適用し、ルール別のヒット数とサンプル箇所を出力する。
 * 人間の技術書に対するヒット = 誤検知(false positive)の指標として使う。
 *
 * AIらしいサンプル(--ai-samples <dir>)を指定すると、そちらは
 * 検出率(true positive)の指標として別集計する。
 *
 * 使い方:
 *   npx ts-node scripts/corpus-check.ts --corpus /tmp/tech-corpus [--ai-samples scripts/ai-samples] [--samples 5]
 */
import { TextlintKernel } from "@textlint/kernel";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import { glob } from "node:fs/promises";
import fs from "node:fs/promises";
import path from "node:path";
import preset from "../src/index";

type Args = {
    corpus?: string;
    aiSamples?: string;
    samples: number;
};

const parseArgs = (argv: string[]): Args => {
    const args: Args = { samples: 5 };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--corpus") args.corpus = argv[++i];
        else if (arg === "--ai-samples") args.aiSamples = argv[++i];
        else if (arg === "--samples") args.samples = Number(argv[++i]);
    }
    return args;
};

// コーパス内の日本語ファイルだけを選ぶglobパターン
// (technological-book-corpus-ja の build.js のマッピングを再現したもの)
const CORPUS_GLOBS = [
    "js-primer/source/basic/**/*.md",
    "JavaScript-Plugin-Architecture/ja/**/*.md",
    "Introduction-to-Addon-Development-in-Blender-Web/src/2.7/markdown/**/*.md",
    "The-Little-Book-on-CoffeeScript/coffeescript/chapters/ja_JP/**/*.md",
    "progit/ja/**/*.md",
    "progit/ja/**/*.markdown",
    "what-is-maven/deploy/**/*.md",
    "what-is-maven/implement-plugin/**/*.md",
    "what-is-maven/module/**/*.md",
    "what-is-maven/primer/**/*.md",
    "Hatena-Textbook/**/*.md",
    "build-web-application-with-golang/ja/**/0*.md",
    "build-web-application-with-golang/ja/**/1*.md",
    "Go-SCP-jaJP/src/**/*.md"
];

const kernel = new TextlintKernel();

// presetのrules/rulesConfigをkernelのrule descriptorへ展開する
const ruleDescriptors = Object.entries(preset.rules).map(([ruleId, rule]) => {
    const config = (preset.rulesConfig as Record<string, unknown>)[ruleId];
    const options = typeof config === "object" && config !== null ? config : {};
    return { ruleId, rule, options };
});

type RuleStat = {
    count: number;
    fileSet: Set<string>;
    samples: { file: string; line: number; message: string }[];
};

const lintFile = async (filePath: string, stats: Map<string, RuleStat>, maxSamples: number) => {
    const text = await fs.readFile(filePath, "utf-8");
    const result = await kernel.lintText(text, {
        filePath,
        ext: ".md",
        plugins: [{ pluginId: "markdown", plugin: markdownPlugin }],
        rules: ruleDescriptors
    });
    for (const message of result.messages) {
        const ruleId = message.ruleId ?? "unknown";
        let stat = stats.get(ruleId);
        if (!stat) {
            stat = { count: 0, fileSet: new Set(), samples: [] };
            stats.set(ruleId, stat);
        }
        stat.count++;
        stat.fileSet.add(filePath);
        if (stat.samples.length < maxSamples) {
            stat.samples.push({
                file: filePath,
                line: message.line,
                message: message.message.split("\n")[0]
            });
        }
    }
};

const collectCorpusFiles = async (corpusRoot: string): Promise<string[]> => {
    const repoDir = path.join(corpusRoot, "repo");
    const files: string[] = [];
    for (const pattern of CORPUS_GLOBS) {
        for await (const entry of glob(pattern, { cwd: repoDir })) {
            files.push(path.join(repoDir, entry));
        }
    }
    return [...new Set(files)].sort();
};

const collectDirFiles = async (dir: string): Promise<string[]> => {
    const files: string[] = [];
    for await (const entry of glob("**/*.md", { cwd: dir })) {
        files.push(path.join(dir, entry));
    }
    return files.sort();
};

const runSet = async (label: string, files: string[], maxSamples: number) => {
    const stats = new Map<string, RuleStat>();
    let processed = 0;
    for (const file of files) {
        await lintFile(file, stats, maxSamples);
        processed++;
        if (processed % 100 === 0) process.stderr.write(`  ${label}: ${processed}/${files.length}\n`);
    }
    return stats;
};

const report = (label: string, files: string[], stats: Map<string, RuleStat>) => {
    console.log(`\n## ${label}`);
    console.log(`対象ファイル数: ${files.length}`);
    const rows = [...stats.entries()].sort((a, b) => b[1].count - a[1].count);
    if (rows.length === 0) {
        console.log("ヒットなし");
        return;
    }
    console.log("\n| ルール | ヒット数 | 出現ファイル数 | ファイルあたり |");
    console.log("| --- | ---: | ---: | ---: |");
    for (const [ruleId, stat] of rows) {
        const perFile = (stat.count / files.length).toFixed(3);
        console.log(`| ${ruleId} | ${stat.count} | ${stat.fileSet.size} | ${perFile} |`);
    }
    for (const [ruleId, stat] of rows) {
        console.log(`\n### ${ruleId} のサンプル`);
        for (const s of stat.samples) {
            console.log(`- ${path.relative(process.cwd(), s.file)}:${s.line} — ${s.message}`);
        }
    }
};

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    console.log(`# コーパス検証レポート`);
    console.log(`ルール: ${ruleDescriptors.map((r) => r.ruleId).join(", ")}`);

    if (args.corpus) {
        const files = await collectCorpusFiles(args.corpus);
        const stats = await runSet("corpus", files, args.samples);
        report("人間の技術書コーパス（誤検知メーター: 少ないほど良い）", files, stats);
    }
    if (args.aiSamples) {
        const files = await collectDirFiles(args.aiSamples);
        const stats = await runSet("ai", files, args.samples);
        report("AIらしいサンプル（検出メーター: 多いほど良い）", files, stats);
    }
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
