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
    // 見出し内の太字パターンの検出を無効にする
    disableHeadingEmphasisPatterns?: boolean;
};

const rule: TextlintRuleModule<Options> = (context: TextlintRuleContext, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator, fixer } = context;
    const allows = options.allows ?? [];
    const disableEmojiEmphasisPatterns = options.disableEmojiEmphasisPatterns ?? false;
    const disableInfoPatterns = options.disableInfoPatterns ?? false;
    const disableHeadingEmphasisPatterns = options.disableHeadingEmphasisPatterns ?? false;

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
        },

        [Syntax.Heading](node) {
            if (disableHeadingEmphasisPatterns) {
                return;
            }

            const text = getSource(node);

            // allowsパターンにマッチする場合はスキップ
            if (allows.length > 0) {
                const matchedResults = matchPatterns(text, allows);
                if (matchedResults.length > 0) {
                    return;
                }
            }

            // 見出し内の太字パターンを検出（**text** または __text__）
            const headingEmphasisPattern = /(\*\*|__)(.*?)\1/g;

            for (const match of text.matchAll(headingEmphasisPattern)) {
                const matchStart = match.index ?? 0;
                const matchEnd = matchStart + match[0].length;
                const emphasisMark = match[1];
                const innerText = match[2];

                report(
                    node,
                    new RuleError(
                        `見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。`,
                        {
                            padding: locator.range([matchStart, matchEnd]),
                            fix: fixer.replaceTextRange([matchStart, matchEnd], innerText)
                        }
                    )
                );
            }
        }
    };
};

export default rule;
