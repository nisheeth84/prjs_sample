package com.viettel.aio.dto;

import java.util.Date;

public class AIOContractServiceMobileDTO {
	// hoanm1_20190316_start
	private Long sumExcute;
	private Long sumNonExcute;
	private String workName;
	private Date startDate;
    private Date endDate;
    private String packageName;
    private Long status;
    private String customerPhone;
    private Long isMoney;

	public String getWorkName() {
		return workName;
	}

	public void setWorkName(String workName) {
		this.workName = workName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public Long getIsMoney() {
		return isMoney;
	}

	public void setIsMoney(Long isMoney) {
		this.isMoney = isMoney;
	}

	public Long getSumExcute() {
		return sumExcute;
	}

	public void setSumExcute(Long sumExcute) {
		this.sumExcute = sumExcute;
	}

	public Long getSumNonExcute() {
		return sumNonExcute;
	}

	public void setSumNonExcute(Long sumNonExcute) {
		this.sumNonExcute = sumNonExcute;
	}
	// hoanm1_20190316_end

}
