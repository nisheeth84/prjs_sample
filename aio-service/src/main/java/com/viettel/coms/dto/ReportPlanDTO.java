package com.viettel.coms.dto;

import java.util.List;

public class ReportPlanDTO extends YearPlanDetailDTO {

    private java.lang.Double currentQuantity;
    private java.lang.Double progressQuantity;
    private java.lang.Double progressComplete;
    private java.lang.Double currentComplete;
    private java.lang.Double currentRevenue;
    private java.lang.Double progressRevenue;
    private java.lang.String sysGroupName;
    private List<String> listYear;
    private String userName;
    private String sysName;
    private String progress;
    private java.lang.Double tiendo;
    private List<ReportPlanDTO> reportPlanList;
    private List<Long> listTotalMonthPlanId;
//    hoanm1_20181211_start
    private java.lang.Double completePlanMonth;
    private java.lang.Double progressCompletePlanMonth;
    private java.lang.Long countStationPlan;
    private java.lang.Long countStation;   
    private java.lang.Double completePlanTotal;
    private java.lang.Double progressCompletePlanTotal;
    private java.lang.Long countStationPlanTotal;
    private java.lang.Long countStationTotal;
    private java.lang.Double currentRevenueMonth;
    private java.lang.Double progressRevenueMonth;
    
    public java.lang.Double getCurrentRevenueMonth() {
		return currentRevenueMonth;
	}

	public void setCurrentRevenueMonth(java.lang.Double currentRevenueMonth) {
		this.currentRevenueMonth = currentRevenueMonth;
	}

	public java.lang.Double getProgressRevenueMonth() {
		return progressRevenueMonth;
	}

	public void setProgressRevenueMonth(java.lang.Double progressRevenueMonth) {
		this.progressRevenueMonth = progressRevenueMonth;
	}

	public java.lang.Double getCompletePlanMonth() {
		return completePlanMonth;
	}

	public void setCompletePlanMonth(java.lang.Double completePlanMonth) {
		this.completePlanMonth = completePlanMonth;
	}

	public java.lang.Double getProgressCompletePlanMonth() {
		return progressCompletePlanMonth;
	}

	public void setProgressCompletePlanMonth(
			java.lang.Double progressCompletePlanMonth) {
		this.progressCompletePlanMonth = progressCompletePlanMonth;
	}

	public java.lang.Double getCompletePlanTotal() {
		return completePlanTotal;
	}

	public void setCompletePlanTotal(java.lang.Double completePlanTotal) {
		this.completePlanTotal = completePlanTotal;
	}

	public java.lang.Double getProgressCompletePlanTotal() {
		return progressCompletePlanTotal;
	}

	public void setProgressCompletePlanTotal(
			java.lang.Double progressCompletePlanTotal) {
		this.progressCompletePlanTotal = progressCompletePlanTotal;
	}

	public java.lang.Long getCountStationPlanTotal() {
		return countStationPlanTotal;
	}

	public void setCountStationPlanTotal(java.lang.Long countStationPlanTotal) {
		this.countStationPlanTotal = countStationPlanTotal;
	}

	public java.lang.Long getCountStationTotal() {
		return countStationTotal;
	}

	public void setCountStationTotal(java.lang.Long countStationTotal) {
		this.countStationTotal = countStationTotal;
	}

	public java.lang.Long getCountStationPlan() {
		return countStationPlan;
	}

	public void setCountStationPlan(java.lang.Long countStationPlan) {
		this.countStationPlan = countStationPlan;
	}

	public java.lang.Long getCountStation() {
		return countStation;
	}

	public void setCountStation(java.lang.Long countStation) {
		this.countStation = countStation;
	}
//	hoanm1_20181211_end

	//hoanm1_20180922_start
    private java.lang.Double quantityTotal;
    private java.lang.Double currentQuantityTotal;
    private java.lang.Double completeTotal;
    private java.lang.Double currentCompleteTotal;
    private java.lang.Double revenueTotal;
    private java.lang.Double currentRevenueTotal;
    private java.lang.Double progressQuantityTotal;
    private java.lang.Double progressCompleteTotal;
    private java.lang.Double progressRevenueTotal;
    
    public java.lang.Double getProgressQuantityTotal() {
		return progressQuantityTotal;
	}

	public void setProgressQuantityTotal(java.lang.Double progressQuantityTotal) {
		this.progressQuantityTotal = progressQuantityTotal;
	}

	public java.lang.Double getProgressCompleteTotal() {
		return progressCompleteTotal;
	}

	public void setProgressCompleteTotal(java.lang.Double progressCompleteTotal) {
		this.progressCompleteTotal = progressCompleteTotal;
	}

	public java.lang.Double getProgressRevenueTotal() {
		return progressRevenueTotal;
	}

	public void setProgressRevenueTotal(java.lang.Double progressRevenueTotal) {
		this.progressRevenueTotal = progressRevenueTotal;
	}

	public java.lang.Double getQuantityTotal() {
		return quantityTotal;
	}

	public void setQuantityTotal(java.lang.Double quantityTotal) {
		this.quantityTotal = quantityTotal;
	}

	public java.lang.Double getCurrentQuantityTotal() {
		return currentQuantityTotal;
	}

	public void setCurrentQuantityTotal(java.lang.Double currentQuantityTotal) {
		this.currentQuantityTotal = currentQuantityTotal;
	}

	public java.lang.Double getCompleteTotal() {
		return completeTotal;
	}

	public void setCompleteTotal(java.lang.Double completeTotal) {
		this.completeTotal = completeTotal;
	}

	public java.lang.Double getCurrentCompleteTotal() {
		return currentCompleteTotal;
	}

	public void setCurrentCompleteTotal(java.lang.Double currentCompleteTotal) {
		this.currentCompleteTotal = currentCompleteTotal;
	}

	public java.lang.Double getRevenueTotal() {
		return revenueTotal;
	}

	public void setRevenueTotal(java.lang.Double revenueTotal) {
		this.revenueTotal = revenueTotal;
	}

	public java.lang.Double getCurrentRevenueTotal() {
		return currentRevenueTotal;
	}

	public void setCurrentRevenueTotal(java.lang.Double currentRevenueTotal) {
		this.currentRevenueTotal = currentRevenueTotal;
	}
//	hoanm1_20180922_end
	public List<Long> getListTotalMonthPlanId() {
        return listTotalMonthPlanId;
    }

    public void setListTotalMonthPlanId(List<Long> listTotalMonthPlanId) {
        this.listTotalMonthPlanId = listTotalMonthPlanId;
    }

    public List<ReportPlanDTO> getReportPlanList() {
        return reportPlanList;
    }

    public void setReportPlanList(List<ReportPlanDTO> reportPlanList) {
        this.reportPlanList = reportPlanList;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    private String tt;

    public String getTt() {
        return tt;
    }

    public void setTt(String tt) {
        this.tt = tt;

    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSysName() {
        return sysName;
    }

    public void setSysName(String sysName) {
        this.sysName = sysName;
    }

    public java.lang.Double getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(java.lang.Double currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public void setProgressQuantity(java.lang.Double progressQuantity) {
        this.progressQuantity = progressQuantity;
    }

    public java.lang.Double getProgressQuantity() {
        return progressQuantity;
    }

    public java.lang.Double getProgressComplete() {
        return progressComplete;
    }

    public void setProgressComplete(java.lang.Double progressComplete) {
        this.progressComplete = progressComplete;
    }

    public java.lang.Double getCurrentComplete() {
        return currentComplete;
    }

    public void setCurrentComplete(java.lang.Double currentComplete) {
        this.currentComplete = currentComplete;
    }

    public java.lang.Double getCurrentRevenue() {
        return currentRevenue;
    }

    public void setCurrentRevenue(java.lang.Double currentRevenue) {
        this.currentRevenue = currentRevenue;
    }

    public java.lang.Double getProgressRevenue() {
        return progressRevenue;
    }

    public void setProgressRevenue(java.lang.Double progressRevenue) {
        this.progressRevenue = progressRevenue;
    }

    public java.lang.String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(java.lang.String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public List<String> getListYear() {
        return listYear;
    }

    public void setListYear(List<String> listYear) {
        this.listYear = listYear;
    }

    public java.lang.Double getTiendo() {
        return tiendo;
    }

    public void setTiendo(java.lang.Double tiendo) {
        this.tiendo = tiendo;
    }

}
