insightwatch（インサイトウオッチ）をご利用のお客様

お客様が実行したセキュリティチェック処理中にエラーが発生し、チェックが完了しませんでした。
チェックがエラーになった組織やプロジェクト、エラーの内容は下記の通りです。

組織名：{{organizationName}}
プロジェクト名：{{projectName}}
{%- if awsAccount %}
AWSアカウント : {{awsAccount}}
{%- endif %}
{%- if checkCodeItem %}
チェック項目コード : {{checkCodeItem}}
{%- endif %}
{%- if regionName %}
リージョン : {{regionName}}
{%- endif %}

{{contentMessage}}
