
package com.viettel.aio.dto;

import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public abstract class ComsBaseFWDTO<Entity extends BaseFWModelImpl> extends BaseFWDTOImpl<Entity> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private Long id;
    private java.lang.Long page;
    private java.lang.Integer pageSize;
    private java.lang.Integer total;
    private String keySearch;
    private String text;
	private String customField;
    // chinhpxn 20180607 start
    private List<ExcelErrorDTO> errorList;
    private int messageColumn;
    private java.lang.String filePathError;
    // chinhpxn 20180607 end

    // chinhpxn 20180607 start
    @JsonProperty("errorList")
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

    public java.lang.String getFilePathError() {
        return filePathError;
    }

    public void setFilePathError(java.lang.String filePathError) {
        this.filePathError = filePathError;
    }

    // chinhpxn 20180607 end

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public java.lang.Long getPage() {
        return page;
    }

    public void setPage(java.lang.Long page) {
        this.page = page;
    }

    public java.lang.Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(java.lang.Integer pageSize) {
        this.pageSize = pageSize;
    }

    public java.lang.Integer getTotal() {
        return total;
    }

    public void setTotal(java.lang.Integer total) {
        this.total = total;
    }

    public String getKeySearch() {
        return keySearch;
    }

    public void setKeySearch(String keySearch) {
        this.keySearch = keySearch;
    }

    private java.lang.Integer totalRecord;

    public java.lang.Integer getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(java.lang.Integer totalRecord) {
        this.totalRecord = totalRecord;
    }

	public String getCustomField() {
		return customField;
	}

	public void setCustomField(String customField) {
		this.customField = customField;
	}

    //TrungPT add
    private boolean isSize;

    public boolean getIsSize() {
        return isSize;
    }

    public void setIsSize(boolean isSize) {
        this.isSize = isSize;
    }

}
