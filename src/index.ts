import type { TextlintRuleModule } from "@textlint/types";

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
    // Disable specific pattern checks
    disableBoldListItems?: boolean;
    disableEmojiListItems?: boolean;
}

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableBoldListItems = options.disableBoldListItems ?? false;
    const disableEmojiListItems = options.disableEmojiListItems ?? false;

    // AI-like emoji patterns commonly used in lists
    const emojiPatterns = [
        "✅",
        "❌",
        "⭐",
        "💡",
        "🔥",
        "📝",
        "⚡",
        "🎯",
        "🚀",
        "🎉",
        "📌",
        "🔍",
        "💰",
        "📊",
        "🔧",
        "⚠️",
        "❗",
        "💻",
        "📱",
        "🌟"
    ];

    return {
        [Syntax.ListItem](node) {
            const text = getSource(node);

            if (allows.some((allow) => text.includes(allow))) {
                return;
            }

            // Check for bold list item pattern: - **text**: description
            if (!disableBoldListItems) {
                const boldListPattern = /^[\s]*[-*+]\s+\*\*([^*]+)\*\*\s*:/;
                const boldMatch = text.match(boldListPattern);
                if (boldMatch) {
                    const matchStart = boldMatch.index ?? 0;
                    const matchEnd = matchStart + boldMatch[0].length;
                    const matchRange = [matchStart, matchEnd] as const;
                    const ruleError = new RuleError(
                        "リストアイテムで強調（**）とコロン（:）の組み合わせはAIっぽい記述です。より自然な表現を使用してください。",
                        {
                            padding: locator.range(matchRange)
                        }
                    );
                    report(node, ruleError);
                }
            }

            // Check for emoji list items
            if (!disableEmojiListItems) {
                for (const emoji of emojiPatterns) {
                    const emojiIndex = text.indexOf(emoji);
                    if (emojiIndex !== -1) {
                        const matchRange = [emojiIndex, emojiIndex + emoji.length] as const;
                        const ruleError = new RuleError(
                            `リストアイテムで絵文字「${emoji}」を使用するのはAIっぽい記述です。テキストベースの表現を使用してください。`,
                            {
                                padding: locator.range(matchRange)
                            }
                        );
                        report(node, ruleError);
                        break; // Only report the first emoji found in each list item
                    }
                }
            }
        }
    };
};

export default report;
