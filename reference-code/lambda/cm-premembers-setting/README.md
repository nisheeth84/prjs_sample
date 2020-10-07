# Premembers Setting

Premembers のサーバーサイドの実装です。

```text
.
├── Build_environment_container (ビルドに用いるコンテナの定義を配置します)
├── CloudFormation_template(環境構築に用いるCloudFormationのテンプレートを配置します)
├── README.md (このファイル)
├── SequenceDiagram (画面とAPIのシーケンス図を配置します)
├── dynamodb_ddl (DynamoDBのテーブル定義です)
├── github-to-create_CodePipeline (Featureブランチ作成・プルリクエストクローズに対応するCodePipelineの作成・削除を行うアプリケーションです)
└── dynamodb_local (ローカル環境にDynamoDB環境を構築スクリプトを配置します。)
```