import noAiListFormatting from "./rules/no-ai-list-formatting";
import noAiHypeExpressions from "./rules/no-ai-hype-expressions";
import noAiEmphasisPatterns from "./rules/no-ai-emphasis-patterns";

const preset = {
    rules: {
        "no-ai-list-formatting": noAiListFormatting,
        "no-ai-hype-expressions": noAiHypeExpressions,
        "no-ai-emphasis-patterns": noAiEmphasisPatterns
    },
    rulesConfig: {
        "no-ai-list-formatting": true,
        "no-ai-hype-expressions": true,
        "no-ai-emphasis-patterns": true
    }
};

export default preset;
