import { matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

type Options = {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
    // Disable specific pattern checks
    disableBoldListItems?: boolean;
    disableEmojiListItems?: boolean;
};

const rule: TextlintRuleModule<Options> = (context: TextlintRuleContext, options = {}) => {
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

            // Check for bold list item pattern: - **text**: description or - **text** - description
            if (!disableBoldListItems) {
                const boldListPattern = /^[\s]*(?:[-*+]|\d+[.)])\s+\*\*([^*]+)\*\*(?:\s*([:：])|\s+([-—–])(?=\s))/;
                const boldMatch: RegExpMatchArray | null = text.match(boldListPattern);
                if (boldMatch) {
                    const matchStart: number = boldMatch.index ?? 0;
                    const matchEnd = matchStart + boldMatch[0].length;
                    const matchRange = [matchStart, matchEnd] as const;
                    const separator = boldMatch[2] ?? boldMatch[3];
                    const separatorNames: Record<string, string> = {
                        ":": "コロン",
                        "：": "コロン",
                        "-": "ハイフン",
                        "—": "ダッシュ",
                        "–": "ダッシュ"
                    };
                    const separatorName = separatorNames[separator] ?? "区切り文字";
                    const ruleError = new RuleError(
                        `リストアイテムで強調（**）と${separatorName}（${separator}）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。`,
                        {
                            padding: locator.range(matchRange)
                        }
                    );
                    report(node, ruleError);
                } else {
                    // 区切り文字を使わず、太字の見出し語に主語・目的語の助詞（は/が/を）が続き、
                    // さらに説明文が続くパターン:
                    // - **内部変数**は推論に任せる / - **表示する状態**を先に名前づける
                    // 各項目の先頭語を機械的に太字化する、AI生成文章にありがちな構造。
                    // 「**重要な項目**です」のような語の強調や、「**Rejected**な〜」のような
                    // 用語の強調は対象外にするため、助詞を限定し、後続に2文字以上の説明を要求する。
                    const boldLeadPattern = /^[\s]*(?:[-*+]|\d+[.)])\s+\*\*([^*]+)\*\*([はがを])(?=.{2,})/;
                    const leadMatch: RegExpMatchArray | null = text.match(boldLeadPattern);
                    if (leadMatch) {
                        const matchStart: number = leadMatch.index ?? 0;
                        const matchEnd = matchStart + leadMatch[0].length;
                        const matchRange = [matchStart, matchEnd] as const;
                        const ruleError = new RuleError(
                            "リストアイテムの先頭を強調（**）で始める形式は、項目を機械的に列挙した印象を与える可能性があります。文章として説明することを検討してください。",
                            {
                                padding: locator.range(matchRange)
                            }
                        );
                        report(node, ruleError);
                    }
                }
            }

            // Check for emoji list items
            if (!disableEmojiListItems) {
                const emojiMatch: RegExpMatchArray | null = text.match(flashyEmojiPattern);
                if (emojiMatch) {
                    const emoji = emojiMatch[0];
                    const emojiIndex: number = emojiMatch.index ?? 0;
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
