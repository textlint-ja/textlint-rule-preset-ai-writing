import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // Normal list items
        "- 通常のリストアイテム",
        "- これは問題ない記述です",
        // Bold text not in list format
        "**強調テキスト**は問題ありません",
        // Allowed patterns
        {
            text: "- **許可された**: 説明",
            options: {
                allows: ["許可された"]
            }
        },
        // Disabled bold list items
        {
            text: "- **強調**: 説明",
            options: {
                disableBoldListItems: true
            }
        },
        // Disabled emoji list items
        {
            text: "- ✅ チェック項目",
            options: {
                disableEmojiListItems: true
            }
        }
    ],
    invalid: [
        // Bold list item pattern
        {
            text: "- **重要**: これは重要な項目です",
            errors: [
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせはAIっぽい記述です。より自然な表現を使用してください。",
                    range: [0, 9]
                }
            ]
        },
        // Multiple bold list items
        {
            text: `- **項目1**: 説明1
- **項目2**: 説明2`,
            errors: [
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせはAIっぽい記述です。より自然な表現を使用してください。",
                    range: [0, 10]
                },
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせはAIっぽい記述です。より自然な表現を使用してください。",
                    range: [15, 25]
                }
            ]
        },
        // Emoji list items
        {
            text: "- ✅ 完了した項目",
            errors: [
                {
                    message:
                        "リストアイテムで絵文字「✅」を使用するのはAIっぽい記述です。テキストベースの表現を使用してください。",
                    range: [2, 3]
                }
            ]
        },
        {
            text: "- ❌ 失敗した項目",
            errors: [
                {
                    message:
                        "リストアイテムで絵文字「❌」を使用するのはAIっぽい記述です。テキストベースの表現を使用してください。",
                    range: [2, 3]
                }
            ]
        },
        {
            text: "- 💡 アイデア項目",
            errors: [
                {
                    message:
                        "リストアイテムで絵文字「💡」を使用するのはAIっぽい記述です。テキストベースの表現を使用してください。",
                    range: [2, 4]
                }
            ]
        },
        // Multiple different patterns
        {
            text: `- **注意**: 重要な情報
- 🔥 ホットな話題`,
            errors: [
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせはAIっぽい記述です。より自然な表現を使用してください。",
                    range: [0, 9]
                },
                {
                    message:
                        "リストアイテムで絵文字「🔥」を使用するのはAIっぽい記述です。テキストベースの表現を使用してください。",
                    range: [18, 20]
                }
            ]
        }
    ]
});
