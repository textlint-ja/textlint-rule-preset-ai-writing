import TextLintTester from "textlint-tester";
import noAiFormalExpressions from "../../src/rules/no-ai-formal-expressions";

const tester = new TextLintTester();

tester.run("no-ai-formal-expressions", noAiFormalExpressions, {
    valid: [
        // Normal text
        "これは通常の文章です。",
        "問題のない表現を使用しています。",
        // Allowed patterns (string)
        {
            text: "以下のような形で進めます。",
            options: {
                allows: ["以下のような形で"]
            }
        },
        // Allowed patterns (RegExp-like string)
        {
            text: "次のような点について説明します。",
            options: {
                allows: ["/次のような.*/"]
            }
        }
    ],
    invalid: [
        // AI-like formal expressions
        {
            text: "以下のような手順で進めます。",
            errors: [
                {
                    message:
                        "「以下のような」のような定型的な表現は、読み手によっては機械的な印象を与える場合があります。より自然な表現も検討してみてください。",
                    range: [0, 6]
                }
            ]
        },
        {
            text: "次のような点に注意してください。",
            errors: [
                {
                    message:
                        "「次のような点」のような定型的な表現は、読み手によっては機械的な印象を与える場合があります。より自然な表現も検討してみてください。",
                    range: [0, 6]
                }
            ]
        },
        {
            text: "具体的には以下の通りです。詳細を確認しましょう。",
            errors: [
                {
                    message:
                        "「具体的には以下の通りです」のような定型的な表現は、読み手によっては機械的な印象を与える場合があります。より自然な表現も検討してみてください。",
                    range: [0, 12]
                }
            ]
        },
        {
            text: "重要なポイントは以下です。確認してください。",
            errors: [
                {
                    message:
                        "「重要なポイントは以下です」のような定型的な表現は、読み手によっては機械的な印象を与える場合があります。より自然な表現も検討してみてください。",
                    range: [0, 12]
                }
            ]
        }
    ]
});
