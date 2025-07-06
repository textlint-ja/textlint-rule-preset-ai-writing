import { matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

type Options = {
    // 指定したパターンにマッチする場合、エラーを報告しません
    // 文字列または正規表現パターン ("/pattern/flags") で指定可能
    allows?: string[];
    // 絵文字と太字の組み合わせパターンの検出を無効にする
    disableEmojiEmphasisPatterns?: boolean;
    // 情報系プレフィックスパターンの検出を無効にする
    disableInfoPatterns?: boolean;
};

const rule: TextlintRuleModule<Options> = (context: TextlintRuleContext, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableEmojiEmphasisPatterns = options.disableEmojiEmphasisPatterns ?? false;
    const disableInfoPatterns = options.disableInfoPatterns ?? false;

    // 機械的な情報系プレフィックス
    const infoPatterns = [
        "注意",
        "重要",
        "ポイント",
        "メモ",
        "参考",
        "補足",
        "確認",
        "チェック",
        "推奨",
        "おすすめ",
        "検出される例",
        "推奨される表現",
        "良い例",
        "悪い例",
        "例",
        "サンプル",
        "使用例",
        "設定例"
    ];

    return {
        [Syntax.Paragraph](node) {
            const text = getSource(node);

            // allowsパターンにマッチする場合はスキップ
            if (allows.length > 0) {
                const matchedResults = matchPatterns(text, allows);
                if (matchedResults.length > 0) {
                    return;
                }
            }

            // リストアイテムの場合はListItemのハンドラーで処理するのでスキップ
            if (node.parent?.type === "ListItem") {
                return;
            }

            const emojiEmphasizeMatches: RegExpMatchArray[] = [];

            // 絵文字 + 太字の組み合わせパターンを検出
            if (!disableEmojiEmphasisPatterns) {
                // 絵文字の正規表現を修正（Unicodeフラグでサロゲートペア対応）
                const emojiEmphasizePattern =
                    /(ℹ️|🔍|✅|❌|⚠️|💡|📝|📋|📌|🔗|🎯|🚀|⭐|✨|💯|🔥|📊|📈)\s*\*\*([^*]+)\*\*/gu;

                for (const match of text.matchAll(emojiEmphasizePattern)) {
                    const matchStart = match.index ?? 0;
                    const matchEnd = matchStart + match[0].length;

                    emojiEmphasizeMatches.push(match);

                    report(
                        node,
                        new RuleError(
                            `絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。`,
                            {
                                padding: locator.range([matchStart, matchEnd])
                            }
                        )
                    );
                }
            }

            // 情報系プレフィックスの太字パターンを検出（絵文字+太字と重複しない場合のみ）
            if (!disableInfoPatterns) {
                const infoPrefixPattern = new RegExp(`\\*\\*(${infoPatterns.join("|")})([：:].*?)?\\*\\*`, "g");

                for (const match of text.matchAll(infoPrefixPattern)) {
                    const matchStart = match.index ?? 0;
                    const matchEnd = matchStart + match[0].length;
                    const prefixText = match[1];

                    // 絵文字+太字のマッチと重複していないかチェック
                    const isOverlapping = emojiEmphasizeMatches.some((emojiMatch) => {
                        const emojiStart = emojiMatch.index ?? 0;
                        const emojiEnd = emojiStart + emojiMatch[0].length;
                        return matchStart < emojiEnd && matchEnd > emojiStart;
                    });

                    if (!isOverlapping) {
                        report(
                            node,
                            new RuleError(
                                `「**${prefixText}**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。`,
                                {
                                    padding: locator.range([matchStart, matchEnd])
                                }
                            )
                        );
                    }
                }
            }
        },

        [Syntax.ListItem](node) {
            const text = getSource(node);

            // allowsパターンにマッチする場合はスキップ
            if (allows.length > 0) {
                const matchedResults = matchPatterns(text, allows);
                if (matchedResults.length > 0) {
                    return;
                }
            }

            const emojiEmphasizeMatches: RegExpMatchArray[] = [];

            // リストアイテム内での絵文字 + 太字パターンを検出
            if (!disableEmojiEmphasisPatterns) {
                const emojiEmphasizePattern =
                    /(ℹ️|🔍|✅|❌|⚠️|💡|📝|📋|📌|🔗|🎯|🚀|⭐|✨|💯|🔥|📊|📈)\s*\*\*([^*]+)\*\*/gu;

                for (const match of text.matchAll(emojiEmphasizePattern)) {
                    const matchStart = match.index ?? 0;
                    const matchEnd = matchStart + match[0].length;

                    emojiEmphasizeMatches.push(match);

                    report(
                        node,
                        new RuleError(
                            `リストアイテムで絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。`,
                            {
                                padding: locator.range([matchStart, matchEnd])
                            }
                        )
                    );
                }
            }

            // リストアイテム内での情報系プレフィックスの太字パターンを検出
            if (!disableInfoPatterns) {
                const infoPrefixPattern = new RegExp(`\\*\\*(${infoPatterns.join("|")})([：:].*?)?\\*\\*`, "g");

                for (const match of text.matchAll(infoPrefixPattern)) {
                    const matchStart = match.index ?? 0;
                    const matchEnd = matchStart + match[0].length;
                    const prefixText = match[1];

                    // 絵文字+太字のマッチと重複していないかチェック
                    const isOverlapping = emojiEmphasizeMatches.some((emojiMatch) => {
                        const emojiStart = emojiMatch.index ?? 0;
                        const emojiEnd = emojiStart + emojiMatch[0].length;
                        return matchStart < emojiEnd && matchEnd > emojiStart;
                    });

                    if (!isOverlapping) {
                        report(
                            node,
                            new RuleError(
                                `リストアイテムで「**${prefixText}**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。`,
                                {
                                    padding: locator.range([matchStart, matchEnd])
                                }
                            )
                        );
                    }
                }
            }
        }
    };
};

export default rule;
