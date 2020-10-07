# Premembers Backend

Premembers のサーバーサイドの実装です。

## ファイル構造

```text
├── README.md (このファイルです。)
├── buildspec.yml (CodeBuild時に動く内容を記載しています。)
├── package-lock.json
├── package.json (Serverless Frameworkで用いるライブラリ群を管理します。)
├── requirements.txt (LambdaのPython関数内で用いるライブラリを記載します。)
├── premembers (lambda関数を配置します。)
│   ├── common
│   ├── exception
│   ├── organizations
│   │   └── handler
│   ├── repository
│   └── users
│       └── handler
├── tests (lambda関数のunittestを配置します。)
│   ├── common
│   ├── organizations
│   ├── repository
│   └── users
├── serverless.yml (Serverless Frameworkの定義です。)
└── shell (CodeBuildで用いるシェルを配置します。)

```