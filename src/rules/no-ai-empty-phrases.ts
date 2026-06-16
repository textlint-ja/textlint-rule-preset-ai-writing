import { matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

type Options = {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
    // Disable specific categories of empty phrases
    disableFillerPatterns?: boolean;
    disableConclusionPatterns?: boolean;
    disableIntroductionPatterns?: boolean;
};

const rule: TextlintRuleModule<Options> = (context: TextlintRuleContext, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableFillerPatterns = options.disableFillerPatterns ?? false;
    const disableConclusionPatterns = options.disableConclusionPatterns ?? false;
    const disableIntroductionPatterns = options.disableIntroductionPatterns ?? false;

    // 中身のない空虚な定型句・動詞。
    // 何を説明しているか分からないまま体裁だけ整える、AI文章にありがちな表現。
    const fillerPatterns = [
        {
            pattern: /多角的に/g,
            message:
                "「多角的に」は具体性のない定型表現になりがちです。どの観点から述べるのかを具体的に書くことを検討してください。"
        },
        {
            pattern: /深く掘り下げ(?:て|ます|ました|る|よう)?/g,
            message:
                "「掘り下げる」は内容を説明しない空虚な動詞になりがちです。何をどこまで説明するのかを具体的に書くことを検討してください。"
        },
        {
            pattern: /(?<![一二三四五六七八九十数])奥が深い/g,
            message:
                "「奥が深い」は内容のない感想になりがちです。具体的にどの点が複雑なのかを書くことを検討してください。"
        },
        {
            pattern: /正面から(?:扱|向き合|取り組)/g,
            message:
                "「正面から扱う／向き合う」は中身のない型になりがちです。具体的に何をするのかを書くことを検討してください。"
        }
    ];

    // 機械的な結論段落。記事を締めくくるための定型句で、技術的な内容を持たない。
    const conclusionPatterns = [
        {
            pattern: /いかがでし(?:た|たでしょう)か/g,
            message:
                "「いかがでしたか」は内容のない定型的な結びです。本文で述べた要点をまとめることを検討してください。"
        },
        {
            pattern: /ぜひ[^。\n]{0,20}(?:試して|使って|活用して|導入して|チャレンジして)み(?:て|ましょう)/g,
            message:
                "「ぜひ〜してみてください」は定型的な締めの表現になりがちです。読み手が次に取れる具体的な行動を示すことを検討してください。"
        },
        {
            pattern: /参考になれば幸いです/g,
            message: "「参考になれば幸いです」は定型的な結びです。本文の要点を述べることを検討してください。"
        },
        {
            pattern: /最後までお読みいただき/g,
            message: "「最後までお読みいただき」は定型的な挨拶です。技術的な内容に集中することを検討してください。"
        }
    ];

    // 過剰な前置き構造。本論に入る前に置かれる、内容のない案内文。
    const introductionPatterns = [
        {
            pattern: /(?:本記事|この記事|本稿)では[^。\n]{0,30}(?:解説|紹介|説明)(?:して|し)(?:いき|まいり)ます/g,
            message:
                "「本記事では〜を解説していきます」は冗長な前置きになりがちです。前置きを省いて本題から書き始めることを検討してください。"
        },
        {
            pattern:
                /(?:について|を)(?:詳しく|順番に|一つずつ|ひとつずつ)(?:見て|解説して|説明して)い(?:き|こう)(?:ます|ましょう)/g,
            message:
                "「〜を詳しく見ていきましょう」は内容のない案内文になりがちです。前置きを省いて本題に入ることを検討してください。"
        }
    ];

    return {
        [Syntax.Str](node) {
            const text = getSource(node);

            // 許可パターンのチェック
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
            }

            // 各カテゴリのパターンをチェック
            const patterns = [
                ...(disableFillerPatterns ? [] : fillerPatterns),
                ...(disableConclusionPatterns ? [] : conclusionPatterns),
                ...(disableIntroductionPatterns ? [] : introductionPatterns)
            ];

            for (const { pattern, message } of patterns) {
                const matches = text.matchAll(pattern);
                for (const match of matches) {
                    const index: number = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(message, {
                        padding: locator.range(matchRange)
                    });
                    report(node, ruleError);
                }
            }
        }
    };
};

export default rule;
