package com.viettel.coms.dto;

public class GranttDTO {
    private String month;
    private String year;
    private String keySearch;
    private Long id;
    private Long status;
    private Long complete_state;
    private String catProvinceCode;
    //HuyPQ-20181018-start
    private java.lang.Long page;
    private java.lang.Integer pageSize;
    private java.lang.Integer total;
    private java.lang.Integer totalRecord;
    //HuyPQ-20181018-end

    public java.lang.Integer getTotalRecord() {
		return totalRecord;
	}

	public void setTotalRecord(java.lang.Integer totalRecord) {
		this.totalRecord = totalRecord;
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

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getKeySearch() {
        return keySearch;
    }

    public void setKeySearch(String keySearch) {
        this.keySearch = keySearch;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getComplete_state() {
        return complete_state;
    }

    public void setComplete_state(Long complete_state) {
        this.complete_state = complete_state;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

}
