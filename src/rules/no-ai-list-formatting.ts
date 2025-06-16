import type { TextlintRuleModule } from "@textlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export interface Options {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
    // Disable specific pattern checks
    disableBoldListItems?: boolean;
    disableEmojiListItems?: boolean;
}

const rule: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableBoldListItems = options.disableBoldListItems ?? false;
    const disableEmojiListItems = options.disableEmojiListItems ?? false;

    // Pattern to detect "flashy" emojis commonly used in AI-generated content
    // Using explicit list of decorative emojis that give mechanical impression
    const flashyEmojis = [
        // Check marks and status indicators
        "✅",
        "❌",
        "⭐",
        "✨",
        "💯",
        // Warning and attention symbols
        "⚠️",
        "❗",
        "❓",
        "💥",
        // Energy and fire symbols
        "🔥",
        "⚡",
        "💪",
        "🚀",
        // Ideas and thinking
        "💡",
        "🤔",
        "💭",
        "🧠",
        // Targets and goals
        "🎯",
        "📈",
        "📊",
        "🏆",
        // Common decorative symbols
        "👍",
        "👎",
        "😊",
        "😎",
        "🎉",
        "🌟",
        // Work and productivity
        "📝",
        "📋",
        "✏️",
        "🖊️",
        "💼"
    ];

    // Create pattern from explicit emoji list
    // Need to escape special regex characters
    const escapedEmojis = flashyEmojis.map((emoji) => emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const flashyEmojiPattern = new RegExp(`(${escapedEmojis.join("|")})`);

    return {
        [Syntax.ListItem](node) {
            const text = getSource(node);

            // Check if text matches any allowed patterns
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
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
                        "リストアイテムで強調（**）とコロン（:）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
                        {
                            padding: locator.range(matchRange)
                        }
                    );
                    report(node, ruleError);
                }
            }

            // Check for emoji list items
            if (!disableEmojiListItems) {
                const emojiMatch = text.match(flashyEmojiPattern);
                if (emojiMatch) {
                    const emoji = emojiMatch[0];
                    const emojiIndex = emojiMatch.index ?? 0;
                    const matchRange = [emojiIndex, emojiIndex + emoji.length] as const;
                    const ruleError = new RuleError(
                        `リストアイテムでの絵文字「${emoji}」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。`,
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
