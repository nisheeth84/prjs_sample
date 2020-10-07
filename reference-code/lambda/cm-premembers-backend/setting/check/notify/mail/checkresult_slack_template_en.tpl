We will inform you of the result of the security check.
For more information log in to insightwatch (https://insightwatch.io).

Organization name: {{organizationName}}
Project name: {{projectName}}
Report date and time: {{executedDateTime}} (UTC)

{% for checkResult in checkResults %}
{{checkResult.accountAWS}} : Managed({{checkResult.managedCount}}) / Normal({{checkResult.okCount}}) / Warning({{checkResult.ngCount}}) / Critical({{checkResult.criticalCount}}) / Error({{checkResult.errorCount}}){{'\t'}}{% endfor %}
