import noAiListFormatting from "./rules/no-ai-list-formatting";
import noAiFormalExpressions from "./rules/no-ai-formal-expressions";
import noAiHypeExpressions from "./rules/no-ai-hype-expressions";

const preset = {
    rules: {
        "no-ai-list-formatting": noAiListFormatting,
        "no-ai-formal-expressions": noAiFormalExpressions,
        "no-ai-hype-expressions": noAiHypeExpressions
    },
    rulesConfig: {
        "no-ai-list-formatting": true,
        "no-ai-formal-expressions": true,
        "no-ai-hype-expressions": true
    }
};

export default preset;
