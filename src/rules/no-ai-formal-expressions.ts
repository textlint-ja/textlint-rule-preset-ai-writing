import type { TextlintRuleModule } from "@textlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export interface Options {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
}

const rule: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];

    // AI-like formal expressions that sound robotic
    const formalPatterns = [
        /以下のような/g,
        /次のような点/g,
        /具体的には以下の通りです/g,
        /重要なポイントは以下です/g,
        /主な特徴として/g,
        /詳細については以下をご確認ください/g
    ];

    return {
        [Syntax.Str](node) {
            const text = getSource(node);

            // Check if text matches any allowed patterns
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
            }

            for (const pattern of formalPatterns) {
                const matches = text.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(
                        `「${match[0]}」のような定型的な表現は、読み手によっては機械的な印象を与える場合があります。より自然な表現も検討してみてください。`,
                        {
                            padding: locator.range(matchRange)
                        }
                    );
                    report(node, ruleError);
                }
            }
        }
    };
};

export default rule;
