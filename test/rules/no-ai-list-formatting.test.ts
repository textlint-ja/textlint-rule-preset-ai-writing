import TextLintTester from "textlint-tester";
import noAiListFormatting from "../../src/rules/no-ai-list-formatting";

const tester = new TextLintTester();

tester.run("no-ai-list-formatting", noAiListFormatting, {
    valid: [
        // Normal list items
        "- 通常のリストアイテム",
        "- これは問題ない記述です",
        // Bold text not in list format
        "**強調テキスト**は問題ありません",
        // Allowed patterns (string)
        {
            text: "- **許可された**: 説明",
            options: {
                allows: ["許可された"]
            }
        },
        // Allowed patterns (RegExp-like string)
        {
            text: "- **重要事項**: これは重要な説明です",
            options: {
                allows: ["/重要.*/"]
            }
        },
        // Allowed patterns (case insensitive)
        {
            text: "- **IMPORTANT**: This is important",
            options: {
                allows: ["/important/i"]
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
        },
        // Non-flashy emojis that should NOT be detected
        "- 😀 普通の笑顔",
        "- 🍎 りんご",
        "- 🐱 猫",
        "- 🌸 桜",
        "- ❤️ ハート",
        // Non-flashy emojis that should NOT be detected
        "- 😀 普通の笑顔",
        "- 🍎 りんご",
        "- 🐱 猫",
        "- 🌸 桜",
        "- ❤️ ハート"
    ],
    invalid: [
        // Bold list item pattern
        {
            text: "- **重要**: これは重要な項目です",
            errors: [
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
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
                        "リストアイテムで強調（**）とコロン（:）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
                    range: [0, 10]
                },
                {
                    message:
                        "リストアイテムで強調（**）とコロン（:）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
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
                        "リストアイテムでの絵文字「✅」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 3]
                }
            ]
        },
        {
            text: "- ❌ 失敗した項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「❌」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 3]
                }
            ]
        },
        {
            text: "- 💡 アイデア項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「💡」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
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
                        "リストアイテムで強調（**）とコロン（:）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
                    range: [0, 9]
                },
                {
                    message:
                        "リストアイテムでの絵文字「🔥」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [18, 20]
                }
            ]
        },
        // Additional flashy emoji tests
        {
            text: "- 🚀 ロケット項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「🚀」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 4]
                }
            ]
        },
        {
            text: "- ⭐ 星印項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「⭐」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 3]
                }
            ]
        },
        {
            text: "- 🎯 ターゲット項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「🎯」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 4]
                }
            ]
        },
        {
            text: "- 📝 メモ項目",
            errors: [
                {
                    message:
                        "リストアイテムでの絵文字「📝」の使用は、読み手によっては機械的な印象を与える場合があります。テキストベースの表現も検討してみてください。",
                    range: [2, 4]
                }
            ]
        },
        // Full-width colon
        {
            text: "- **重要情報**：これは重要な項目です",
            errors: [
                {
                    message:
                        "リストアイテムで強調（**）とコロン（：）の組み合わせは機械的な印象を与える可能性があります。より自然な表現を検討してください。",
                    range: [0, 9]
                }
            ]
        }
    ]
});
