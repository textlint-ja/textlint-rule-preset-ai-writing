import noAiListFormatting from "./rules/no-ai-list-formatting";
import noAiFormalExpressions from "./rules/no-ai-formal-expressions";

const preset = {
    rules: {
        "no-ai-list-formatting": noAiListFormatting,
        "no-ai-formal-expressions": noAiFormalExpressions
    },
    rulesConfig: {
        "no-ai-list-formatting": true,
        "no-ai-formal-expressions": true
    }
};

export default preset;
