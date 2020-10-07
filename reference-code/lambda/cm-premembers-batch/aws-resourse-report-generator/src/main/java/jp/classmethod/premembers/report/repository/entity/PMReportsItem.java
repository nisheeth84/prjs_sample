package jp.classmethod.premembers.report.repository.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "PM_Reports")
public class PMReportsItem extends PMReportsProjectIndexItem {
    private String htmlPath;
    private String excelPath;

    /**
     * Constructor
     */
    public PMReportsItem() {
    }

    public PMReportsItem(String reportId) {
        this.setReportId(reportId);
    }

    // Getter & Setter
    @DynamoDBAttribute(attributeName = "HTMLPath")
    public String getHtmlPath() {
        return htmlPath;
    }
    public void setHtmlPath(String htmlPath) {
        this.htmlPath = htmlPath;
    }
    @DynamoDBAttribute(attributeName = "ExcelPath")
    public String getExcelPath() {
        return excelPath;
    }

    public void setExcelPath(String excelPath) {
        this.excelPath = excelPath;
    }
}
