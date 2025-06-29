import noAiListFormatting from "./rules/no-ai-list-formatting";
import noAiHypeExpressions from "./rules/no-ai-hype-expressions";
import noAiEmphasisPatterns from "./rules/no-ai-emphasis-patterns";
import aiTechWritingGuideline from "./rules/ai-tech-writing-guideline";

const preset = {
    rules: {
        "no-ai-list-formatting": noAiListFormatting,
        "no-ai-hype-expressions": noAiHypeExpressions,
        "no-ai-emphasis-patterns": noAiEmphasisPatterns,
        "ai-tech-writing-guideline": aiTechWritingGuideline
    },
    rulesConfig: {
        "no-ai-list-formatting": true,
        "no-ai-hype-expressions": true,
        "no-ai-emphasis-patterns": true,
        "ai-tech-writing-guideline": {
            severity: "info"
        }
    }
};

export default preset;
