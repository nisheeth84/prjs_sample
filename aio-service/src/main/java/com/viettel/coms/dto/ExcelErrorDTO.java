package com.viettel.coms.dto;

//chinhpxn 20180607 start

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExcelErrorDTO {

    private String lineError;

    private String columnError;

    private String serial;

    private java.lang.String filePathError;

    private List<ExcelErrorDTO> errorList;

    private int messageColumn;

    private String DetailError;

    public String getLineError() {
        return lineError;
    }

    public void setLineError(String lineError) {
        this.lineError = lineError;
    }

    public String getColumnError() {
        return columnError;
    }

    public void setColumnError(String columnError) {
        this.columnError = columnError;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getDetailError() {
        return DetailError;
    }

    public void setDetailError(String detailError) {
        DetailError = detailError;
    }

    public java.lang.String getFilePathError() {
        return filePathError;
    }

    public void setFilePathError(java.lang.String filePathError) {
        this.filePathError = filePathError;
    }

    public List<ExcelErrorDTO> getErrorList() {
        return errorList;
    }

    public void setErrorList(List<ExcelErrorDTO> errorList) {
        this.errorList = errorList;
    }

    public int getMessageColumn() {
        return messageColumn;
    }

    public void setMessageColumn(int messageColumn) {
        this.messageColumn = messageColumn;
    }

}
//chinhpxn 20180607 end
