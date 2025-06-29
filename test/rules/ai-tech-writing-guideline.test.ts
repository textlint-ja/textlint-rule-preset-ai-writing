import TextLintTester from "textlint-tester";
import rule from "../../src/rules/ai-tech-writing-guideline";

const tester = new TextLintTester();

tester.run("ai-tech-writing-guideline", rule, {
    valid: [
        // 良いテクニカルライティングの例
        {
            text: "ユーザーは設定を変更します。この操作により、アプリケーションのパフォーマンスが向上します。"
        },
        {
            text: "応答時間は50ms未満になります。処理速度は従来比200%向上しました。"
        },
        {
            text: "システムがデータを検証します。エラーが発生した場合、ログファイルに記録されます。"
        }
    ],
    invalid: [
        // 冗長性の問題
        {
            text: "まず最初に設定ファイルを開きます。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【簡潔性】冗長表現が検出されました。「まず最初に」→「まず」または「最初に」への簡潔化を検討してください。"
                }
            ]
        },
        {
            text: "この機能を使用することができます。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【簡潔性】冗長な助動詞表現が検出されました。「できます」または「します」への簡潔化を検討してください。"
                }
            ]
        },
        // 明確性の問題（能動態・動詞）
        {
            text: "データの変更を行います。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【明確性】名詞化された表現が検出されました。「を変更する」のような直接的な動詞表現を検討してください。"
                }
            ]
        },
        // 具体性の問題
        {
            text: "高速なパフォーマンスを実現します。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【具体性】抽象的な性能表現が検出されました。具体的な数値基準の提示を検討してください（例：「50ms未満の応答時間」）。"
                }
            ]
        },
        {
            text: "大幅に向上します。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【具体性】定量化されていない変化表現が検出されました。具体的な数値や割合の提示を検討してください。"
                }
            ]
        },
        // 一貫性の問題
        {
            text: "ユーザーがログインし、クライアントが設定を変更します。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【一貫性】同一対象を指す用語の混在が検出されました。文書全体で統一した用語の使用を検討してください。"
                }
            ]
        },
        {
            text: "設定画面を開き、設定ページでオプションを変更します。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【一貫性】機能名称の表記揺れが検出されました。プロジェクト内で統一した名称の使用を検討してください。"
                }
            ]
        },
        // 受動態の問題
        {
            text: "処理がシステムによって実行されます。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で1件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【明確性】受動態表現が検出されました。「システムが○○を実行する」のような能動態への変更を検討してください。"
                }
            ]
        },
        // 複数の問題が同時に存在する場合
        {
            text: "まず最初に高速なパフォーマンスの実装を実施することができます。",
            errors: [
                {
                    message:
                        "【テクニカルライティング品質分析】この文書で4件の改善提案が見つかりました。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md"
                },
                {
                    message:
                        "【簡潔性】冗長表現が検出されました。「まず最初に」→「まず」または「最初に」への簡潔化を検討してください。"
                },
                {
                    message:
                        "【具体性】抽象的な性能表現が検出されました。具体的な数値基準の提示を検討してください（例：「50ms未満の応答時間」）。"
                },
                {
                    message: "【明確性】二重の名詞化表現が検出されました。「を実装する」への簡潔化を検討してください。"
                },
                {
                    message:
                        "【簡潔性】冗長な助動詞表現が検出されました。「できます」または「します」への簡潔化を検討してください。"
                }
            ]
        }
    ]
});
