import aiTechWritingGuideline from "./rules/ai-tech-writing-guideline";
import noAiColonContinuation from "./rules/no-ai-colon-continuation";
import noAiEmphasisPatterns from "./rules/no-ai-emphasis-patterns";
import noAiEmptyPhrases from "./rules/no-ai-empty-phrases";
import noAiHypeExpressions from "./rules/no-ai-hype-expressions";
import noAiListFormatting from "./rules/no-ai-list-formatting";

const preset = {
    rules: {
        "no-ai-list-formatting": noAiListFormatting,
        "no-ai-hype-expressions": noAiHypeExpressions,
        "no-ai-emphasis-patterns": noAiEmphasisPatterns,
        "no-ai-empty-phrases": noAiEmptyPhrases,
        "ai-tech-writing-guideline": aiTechWritingGuideline,
        "no-ai-colon-continuation": noAiColonContinuation
    },
    rulesConfig: {
        "no-ai-list-formatting": true,
        "no-ai-hype-expressions": true,
        "no-ai-emphasis-patterns": true,
        "no-ai-empty-phrases": true,
        // ai-tech-writing-guideline は表現（冗長表現など）を縛る性質が強く、
        // 人間が書いた技術文書でも誤検知が多い（コーパス検証で 3.68 件/file）。
        // 「表現ではなく構造を縛る」というpresetの方針に合わせ、デフォルトでは無効にして opt-in とする。
        "ai-tech-writing-guideline": false,
        "no-ai-colon-continuation": true
    }
};

export default preset;
