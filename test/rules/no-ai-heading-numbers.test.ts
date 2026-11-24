import TextLintTester from "textlint-tester";
import noAiHeadingNumbers from "../../src/rules/no-ai-heading-numbers";

const tester = new TextLintTester();

tester.run("no-ai-heading-numbers", noAiHeadingNumbers, {
    valid: [
        // Normal headings without numbering
        "# タイトル",
        "## セクション",
        "### サブセクション",
        "#### 詳細項目",
        "##### 更に詳細な項目",
        "###### 最小レベルの見出し",
        // Headings with text that happens to start with numbers (but no dot/paren)
        "# 2025年の振り返り",
        "## 3つのポイント",
        // Allowed patterns (string)
        {
            text: "# 1. イントロダクション",
            options: {
                allows: ["1. イントロダクション"]
            }
        },
        // Allowed patterns (RegExp-like string)
        {
            text: "## 2. 背景",
            options: {
                allows: ["/\\d+\\. .*/"]
            }
        },
        // Allowed patterns (case insensitive)
        {
            text: "### 3.1. サブセクション",
            options: {
                allows: ["/\\d+\\.\\d+\\. .*/i"]
            }
        }
    ],
    invalid: [
        // Simple numbering patterns
        {
            text: "# 1. タイトル",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 3]
                }
            ]
        },
        {
            text: "## 2. セクション",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 3]
                }
            ]
        },
        {
            text: "### 10. 10番目のアイテム",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 4]
                }
            ]
        },
        // Hierarchical numbering (1.1, 1.2, etc.)
        {
            text: "### 3.1. サブセクション",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 5]
                }
            ]
        },
        {
            text: "#### 1.2.3. 深い階層",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 7]
                }
            ]
        },
        // Parenthesis style numbering
        {
            text: "# 1) はじめに",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 3]
                }
            ]
        },
        {
            text: "## 2) 背景",
            errors: [
                {
                    message:
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                    range: [0, 3]
                }
            ]
        }
    ]
});
