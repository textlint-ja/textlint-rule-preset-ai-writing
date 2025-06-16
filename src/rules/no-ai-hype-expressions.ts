import type { TextlintRuleModule } from "@textlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export interface Options {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
    // Disable specific categories of hype expressions
    disableAbsolutenessPatterns?: boolean;
    disableAbstractPatterns?: boolean;
    disabledPredictivePatterns?: boolean;
}

const rule: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableAbsolutenessPatterns = options.disableAbsolutenessPatterns ?? false;
    const disableAbstractPatterns = options.disableAbstractPatterns ?? false;
    const disabledPredictivePatterns = options.disabledPredictivePatterns ?? false;

    // 絶対性と完全性を演出するハイプ表現
    const absolutenessPatterns = [
        {
            pattern: /革命的な/g,
            message:
                "「革命的な」という表現は過度に誇張的である可能性があります。具体的な改善点を述べることを検討してください。"
        },
        {
            pattern: /ゲームチェンジャー/g,
            message:
                "「ゲームチェンジャー」という表現は機械的な印象を与える可能性があります。具体的な変化を説明することを検討してください。"
        },
        {
            pattern: /世界初の/g,
            message:
                "「世界初の」という表現は過度に強調的である可能性があります。事実に基づいた表現を検討してください。"
        },
        {
            pattern: /究極の/g,
            message: "「究極の」という表現は誇張的である可能性があります。より具体的で控えめな表現を検討してください。"
        },
        {
            pattern: /完全に/g,
            message:
                "「完全に」という絶対的な表現は過度に断定的である可能性があります。「多くの場合」などの表現を検討してください。"
        },
        {
            pattern: /すべて[をの]/g,
            message:
                "「すべて」という包括的な表現は過度に断定的である可能性があります。「多くの」や「主な」などの表現を検討してください。"
        },
        {
            pattern: /完璧な/g,
            message:
                "「完璧な」という表現は過度に理想化している可能性があります。具体的な利点を述べることを検討してください。"
        },
        {
            pattern: /最高の/g,
            message:
                "「最高の」という表現は主観的で誇張的である可能性があります。より客観的な評価を示すことを検討してください。"
        },
        {
            pattern: /最先端の/g,
            message:
                "「最先端の」という表現は定型的である可能性があります。具体的な技術的特徴を説明することを検討してください。"
        }
    ];

    // 抽象的・感覚的効果を演出するハイプ表現
    const abstractPatterns = [
        {
            pattern: /魔法のように/g,
            message:
                "「魔法のように」という比喩的表現は現実味に欠ける可能性があります。具体的な仕組みを説明することを検討してください。"
        },
        {
            pattern: /奇跡的な/g,
            message:
                "「奇跡的な」という表現は過度に感情的である可能性があります。具体的な成果を示すことを検討してください。"
        },
        {
            pattern: /驚異的な/g,
            message:
                "「驚異的な」という表現は誇張的である可能性があります。数値や事実に基づいた表現を検討してください。"
        },
        {
            pattern: /可能性を解き放つ/g,
            message:
                "「可能性を解き放つ」という抽象的な表現は曖昧である可能性があります。具体的な利益を説明することを検討してください。"
        },
        {
            pattern: /潜在能力を引き出す/g,
            message:
                "「潜在能力を引き出す」という表現は抽象的である可能性があります。具体的な効果を説明することを検討してください。"
        },
        {
            pattern: /民主化する/g,
            message:
                "「民主化する」という表現は技術文脈では曖昧である可能性があります。「利用しやすくする」などの具体的な表現を検討してください。"
        },
        {
            pattern: /スーパーチャージ/g,
            message:
                "「スーパーチャージ」という表現は機械的な印象を与える可能性があります。具体的な改善内容を説明することを検討してください。"
        },
        {
            pattern: /驚嘆させ/g,
            message:
                "「驚嘆させる」という表現は過度に感情的である可能性があります。客観的な評価を示すことを検討してください。"
        }
    ];

    // 権威的・予言的なハイプ表現
    const predictivePatterns = [
        {
            pattern: /業界を再定義/g,
            message:
                "「業界を再定義する」という表現は誇張的である可能性があります。具体的な変化を説明することを検討してください。"
        },
        {
            pattern: /未来を変える/g,
            message:
                "「未来を変える」という表現は大げさである可能性があります。具体的な改善点を述べることを検討してください。"
        },
        {
            pattern: /パラダイムシフト/g,
            message:
                "「パラダイムシフト」という表現は定型的である可能性があります。具体的な変化を説明することを検討してください。"
        },
        {
            pattern: /不可避の/g,
            message:
                "「不可避の」という表現は過度に断定的である可能性があります。「可能性が高い」などの表現を検討してください。"
        },
        {
            pattern: /新たな基準を設定/g,
            message:
                "「新たな基準を設定」という表現は誇張的である可能性があります。具体的な改善内容を説明することを検討してください。"
        },
        {
            pattern: /次世代の/g,
            message:
                "「次世代の」という表現は定型的である可能性があります。具体的な技術的進歩を説明することを検討してください。"
        },
        {
            pattern: /フロンティアを開拓/g,
            message:
                "「フロンティアを開拓」という比喩的表現は抽象的である可能性があります。具体的な取り組みを説明することを検討してください。"
        },
        {
            pattern: /根本的に変革/g,
            message:
                "「根本的に変革」という表現は誇張的である可能性があります。具体的な変化を説明することを検討してください。"
        }
    ];

    return {
        [Syntax.Str](node) {
            const text = getSource(node);

            // 許可パターンのチェック
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
            }

            // 各カテゴリのパターンをチェック
            const patterns = [
                ...(disableAbsolutenessPatterns ? [] : absolutenessPatterns),
                ...(disableAbstractPatterns ? [] : abstractPatterns),
                ...(disabledPredictivePatterns ? [] : predictivePatterns)
            ];

            for (const { pattern, message } of patterns) {
                const matches = text.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(message, {
                        padding: locator.range(matchRange)
                    });
                    report(node, ruleError);
                }
            }
        }
    };
};

export default rule;
