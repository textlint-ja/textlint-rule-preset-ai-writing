import TextLintTester from "textlint-tester";
import noAiColonContinuation from "../../src/rules/no-ai-colon-continuation";

const tester = new TextLintTester();

tester.run("no-ai-colon-continuation", noAiColonContinuation, {
    valid: [
        // Normal text without colon-block patterns
        "これは通常のテキストです。",
        "コードの例:\nfunction test() { return true; }",

        // Valid noun + colon patterns (should NOT be detected)
        "使用方法:\n```bash\ncommand\n```",
        "API仕様:\n```javascript\napi.call()\n```",
        "手順:\n- ステップ1\n- ステップ2",
        "設定:\n> 重要な設定です",
        "データ:\n| 列1 | 列2 |\n|-----|-----|",

        // English text should be allowed
        "Install with npm:\n```bash\nnpm install\n```",
        "Install with [npm](https://www.npmjs.com/package/example):\n```bash\nnpm install\n```",
        "Run the test:\n```bash\nnpm test\n```",

        // Passive forms should be allowed (noun-like)
        "検出される例:\n```javascript\ncode\n```",
        "表示される結果:\n- 結果1\n- 結果2",
        "実行される手順:\n> 手順の説明",

        // Attributive forms + noun should be allowed (noun-like)
        "検出する例:\n```javascript\ncode\n```",
        "実行する方法:\n- 方法1\n- 方法2",
        "設定する手順:\n> 手順の説明",

        // Simple nouns should be allowed
        "使い方:\n```bash\ncommand\n```",
        "例:\n- 項目1\n- 項目2",
        "正解:\n> これが正解です",

        // Allowed patterns (string)
        {
            text: "これは使用します:\n```bash\ncommand\n```",
            options: {
                allows: ["使用します"]
            }
        },
        // Allowed patterns (RegExp-like string)
        {
            text: "実行します:\n```javascript\nrun()\n```",
            options: {
                allows: ["/実行.*/"]
            }
        },
        // Disabled code block check
        {
            text: "実行します:\n```bash\ncommand\n```",
            options: {
                disableCodeBlock: true
            }
        },
        // Disabled list check
        {
            text: "設定します:\n- ステップ1\n- ステップ2",
            options: {
                disableList: true
            }
        },
        // Disabled quote check
        {
            text: "説明します:\n> これは説明です",
            options: {
                disableQuote: true
            }
        },
        // Disabled table check
        {
            text: "表示します:\n| 列1 | 列2 |\n|-----|-----|",
            options: {
                disableTable: true
            }
        }
    ],
    invalid: [
        // Predicate + colon + block patterns that should be detected
        {
            text: "実行します:\n```bash\ncommand\n```",
            errors: [
                {
                    message:
                        "「実行します:」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        },
        {
            text: "説明します:\n- 項目1\n- 項目2",
            errors: [
                {
                    message:
                        "「説明します:」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        },
        {
            text: "使用します:\n> これは使用方法です",
            errors: [
                {
                    message:
                        "「使用します:」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        },
        {
            text: "表示します:\n| 列1 | 列2 |\n|-----|-----|",
            errors: [
                {
                    message:
                        "「表示します:」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        },

        // 元々 ai-tech-writing-guideline にあったテストケースの移植
        {
            text: "例えば:\n\n- refとreactiveの使い分けが最初は分からない。",
            errors: [
                {
                    message:
                        "「例えば:」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        },
        {
            text: "JSXはJavaScriptの中でUIを記述するため、プログラマーにとって理解しやすいです：\n\n- 条件分岐やループは通常のJavaScriptの記法",
            errors: [
                {
                    message:
                        "「JSXはJavaScriptの中でUIを記述するため、プログラマーにとって理解しやすいです：」のようなパターンは英語構文の直訳の可能性があります。より自然な日本語表現を検討してください。"
                }
            ]
        }
    ]
});
