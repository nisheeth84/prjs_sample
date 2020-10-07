# cm-premembers-frontend

premembers フロントエンド実装

## ディレクトリ構造

```text
.
├── bs-config.json (ビルド用設定ファイル)
├── buildspec.yml (Code Buildのビルド定義)
├── package.json (nodejs 用ライブラリ定義ファイル )
├── public (S3に配置されるDocumentRootディレクトリ)
│   └── index.html 
├── shell (デプロイ時に用いるシェル群)
│   ├── build.sh
│   └── deploy.sh
├── source (ソースディレクトリ)
│   ├── images
│   ├── js
│   │   ├── language
│   │   │   ├── en
│   │   │   └── ja
│   │   ├── tags
│   │   │   ├── common
│   │   │   │   ├── component
│   │   │   │   └── container
│   │   │   ├── organization
│   │   │   │   ├── component
│   │   │   │   └── container
│   │   │   └── report
│   │   │       ├── component
│   │   │       └── container
│   │   ├── breakpoints.js
│   │   ├── config.js
│   │   ├── index.js
│   │   └── vendor.js
│   ├── scss
│   └── vendor
│       └── remark
│           └── src(以下Admin Tempalate側の内容のため省略)
└── webpack.config.js (Webpack定義)
```
