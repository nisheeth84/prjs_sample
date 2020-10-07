insightwatch をご利用のお客様

{{organizationName}}:{{projectName}}
チェック実行日時: {{executedDateTime}}（日本時間）

セキュリティチェックの結果をお知らせします。
詳細はインサイトウォッチ （https://insightwatch.io） にログインし、ご確認ください。
{% for checkResult in checkResults %}
{{checkResult.accountAWS}} : マネージド({{checkResult.managedCount}}) / 正常({{checkResult.okCount}}) / 注意({{checkResult.ngCount}}) / 重要({{checkResult.criticalCount}}) / エラー({{checkResult.errorCount}}){% endfor %}

=====================================================================
【AWSのセキュリティリスクと一緒に「コスト」も下げたいお客さまへ】

クラスメソッドのAWS総合支援サービスは、AWS構築に関するコンサルティング、AWSインフラ運用、
24時間365日体制でのセキュリティ監視などをクラスメソッドが代行し、お客様がビジネスに注力する
ための様々なサポートやAWSのベストプラクティスを提供いたします。
そして、AWSの全サービス・全リージョンで利用料金が5%オフとなります。
ご利用開始にあたっては、申し込みフォームに必要な情報をご入力していただくだけです。

詳細: https://classmethod.jp/services/members/
=====================================================================

--
※本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。
お問い合わせは下記フォームからお送りください。
https://insightwatch.zendesk.com/hc/ja/requests/new
Classmethod, Inc.
