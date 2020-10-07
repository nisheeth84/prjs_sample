セキュリティチェックの結果をお知らせします。
詳細はインサイトウォッチ （https://insightwatch.io） にログインし、ご確認ください。

組織名: {{organizationName}}
プロジェクト名: {{projectName}}
チェック実行日時: {{executedDateTime}}（日本時間）

{% for checkResult in checkResults %}
{{checkResult.accountAWS}} : マネージド({{checkResult.managedCount}}) / 正常({{checkResult.okCount}}) / 注意({{checkResult.ngCount}}) / 重要({{checkResult.criticalCount}}) / エラー({{checkResult.errorCount}}){% endfor %}
