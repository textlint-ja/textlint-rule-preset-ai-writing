import TextLintTester from "textlint-tester";
import noAiEmphasisPatterns from "../../src/rules/no-ai-emphasis-patterns";

const tester = new TextLintTester();

tester.run("no-ai-emphasis-patterns", noAiEmphasisPatterns, {
    valid: [
        // 絵文字のみ（太字なし）
        "ℹ️ これは情報です",
        "🔍 検索結果",
        "✅ 完了",

        // 太字のみ（絵文字なし）
        "**重要な項目**",
        "**注意事項**",

        // 自然な表現
        "重要な項目について説明します",
        "注意が必要な点をお伝えします",
        "次の手順で進めてください",

        // allowsオプションでのスキップ
        {
            text: "ℹ️ **注意**: この機能は重要です",
            options: {
                allows: ["/ℹ️.*注意/"]
            }
        },

        // 見出し内太字（通常のテキストとして）
        "# 通常の見出し",
        "## 太字なしの見出し",

        // 見出し内太字検出を無効化
        {
            text: "# **太字の見出し**",
            options: {
                disableHeadingEmphasisPatterns: true
            }
        },
        {
            text: "## これは**太字**を含む見出し",
            options: {
                disableHeadingEmphasisPatterns: true
            }
        }
    ],
    invalid: [
        // 絵文字 + 太字の組み合わせ
        {
            text: "ℹ️ **注意**: この機能は重要です",
            errors: [
                {
                    message:
                        "絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "🔍 **検出される例**: サンプルコード",
            errors: [
                {
                    message:
                        "絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "✅ **推奨される表現**: この書き方がおすすめです",
            errors: [
                {
                    message:
                        "絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },

        // 情報系プレフィックスの太字
        {
            text: "**注意**: この設定は重要です",
            errors: [
                {
                    message:
                        "「**注意**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "**重要**: 必ず確認してください",
            errors: [
                {
                    message:
                        "「**重要**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "**ポイント**: ここがキーになります",
            errors: [
                {
                    message:
                        "「**ポイント**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "**検出される例**: このパターンが問題です",
            errors: [
                {
                    message:
                        "「**検出される例**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },
        {
            text: "**推奨される表現**: このように書きましょう",
            errors: [
                {
                    message:
                        "「**推奨される表現**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },

        // リストアイテム内での検出
        {
            text: "- ℹ️ **注意**: リスト内でも検出されます",
            errors: [
                {
                    message:
                        "リストアイテムで絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },

        // コロン付きパターン
        {
            text: "**注意：** この機能は廃止予定です",
            errors: [
                {
                    message:
                        "「**注意**」のような太字の情報プレフィックスは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },

        // 複数パターンの組み合わせ
        {
            text: "🔥 **重要**: パフォーマンスが向上します",
            errors: [
                {
                    message:
                        "絵文字と太字の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。"
                }
            ]
        },

        // 見出し内の太字パターン
        {
            text: "# **hoge**",
            errors: [
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                }
            ]
        },
        {
            text: "## **重要な項目**について",
            errors: [
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                }
            ]
        },
        {
            text: "### この見出しには**太字**が含まれています",
            errors: [
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                }
            ]
        },
        {
            text: "# __アンダースコア__で囲まれた太字",
            errors: [
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                }
            ]
        },
        {
            text: "## 複数の**太字**と**強調**がある場合",
            errors: [
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                },
                {
                    message: "見出し内の太字は不要です。見出し自体が強調のため、追加の太字は冗長です。"
                }
            ]
        }
    ]
});
