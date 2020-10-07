/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionTaskBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;

import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONSTRUCTION_TASKBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionTaskDTO extends ComsBaseFWDTO<ConstructionTaskBO> {

    private java.lang.Double completePercent;
    private java.lang.String description;
    private java.lang.String status;
    private java.lang.String sourceType;
    private java.lang.String deployType;
    private java.lang.Double vat;
    private java.lang.String type;
    private java.lang.Long detailMonthPlanId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
//	hungdt_20181207_start
    private java.lang.String approveDescription;
    public java.lang.String getApproveDescription() {
		return approveDescription;
	}

	public void setApproveDescription(java.lang.String approveDescription) {
		this.approveDescription = approveDescription;
	}
	//	hungdt_20181207_end
//  hoanm1_20181229_start
	private String workItemNameHSHC;
	public String getWorkItemNameHSHC() {
		return workItemNameHSHC;
	}
	public void setWorkItemNameHSHC(String workItemNameHSHC) {
		this.workItemNameHSHC = workItemNameHSHC;
	}
//	hoanm1_20181229_end
	private java.lang.String completeState;
    private java.lang.Long performerWorkItemId;
    private java.lang.Double supervisorId;
    private java.lang.Double directorId;
    private java.lang.Long performerId;
    private java.lang.Double quantity;
    private java.lang.String quantityChart;
    private java.lang.String typeName;
    private java.lang.Long constructionTaskId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String taskName;
    private java.lang.String reasonStop;
    private java.lang.String constructionCode;
    private java.lang.String workItemName;
    private java.lang.String constructionName;
    private java.lang.String performerName;
    private java.lang.String quantityByDate;
    private java.lang.String startDateChart;
    private java.lang.String fullName;
    private java.lang.String contractCode;
    private java.lang.String provinceCode;
    private java.lang.String stationCode;
    private java.lang.String constructionTypeName;
    private java.lang.String TCTT;
    private java.lang.String giam_sat;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date ketthuc_trienkhai;
    private java.lang.String thicong_xong;
    private java.lang.String dang_thicong;
    private java.lang.String luy_ke;
    private java.lang.String vuong;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date batdau_thicong;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date ketthuc_thicong;
    private java.lang.Long workItemId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date ketthuc_trienkhai_tu;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date ketthuc_trienkhai_den;
    private java.lang.Long sysUserId;
    private java.lang.Long catConstructionTypeId;
    private java.lang.Long stationId;
    private java.lang.String chua_thicong;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date dateTo; 
    //tanqn 20181105 start
    private String approveCompleteDescription;
    //private String dateComplete;
    
    //end
    
    private String completeUpdatedDate;
    
    
//  hoanm1_20181015_start
    
    
    //Tungtt_2018/12/06 start
    private Long completeUserUpdate;
    
    
    public Long getCompleteUserUpdate() {
		return completeUserUpdate;
	}

	public void setCompleteUserUpdate(Long completeUserUpdate) {
		this.completeUserUpdate = completeUserUpdate;
	}
    //Tungtt_2018/12/06 end
	

	public String getApproveCompleteDescription() {
		return approveCompleteDescription;
	}

	public void setApproveCompleteDescription(String approveCompleteDescription) {
		this.approveCompleteDescription = approveCompleteDescription;
	}
	private String partnerName;

    
    public java.lang.String getQuantityChart() {
		return quantityChart;
	}

	public void setQuantityChart(java.lang.String quantityChart) {
		this.quantityChart = quantityChart;
	}

	public java.lang.String getTypeName() {
		return typeName;
	}

	public void setTypeName(java.lang.String typeName) {
		this.typeName = typeName;
	}

	public java.util.Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(java.util.Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public java.util.Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(java.util.Date dateTo) {
		this.dateTo = dateTo;
	}

	public java.lang.String getStartDateChart() {
		return startDateChart;
	}

	public void setStartDateChart(java.lang.String startDateChart) {
		this.startDateChart = startDateChart;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}
//	hoanm1_20181015_end
//    hoanm1_20180927_start
    private java.lang.String sysGroupName;
    
    public java.lang.String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(java.lang.String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}
//	hoanm1_20180927_end
	//	hoanm1_20180820_start
    private Long checkEntangle;

    public Long getCheckEntangle() {
        return checkEntangle;
    }

    public void setCheckEntangle(Long checkEntangle) {
        this.checkEntangle = checkEntangle;
    }

//	hoanm1_20180820_end
//  hoanm1_20180905_start
  private java.lang.String obstructedState;
  
	public java.lang.String getObstructedState() {
		return obstructedState;
	}

	public void setObstructedState(java.lang.String obstructedState) {
		this.obstructedState = obstructedState;
	}
 
//  hoanm1_20180905_end
    public java.lang.String getFullName() {
        return fullName;
    }

    public void setFullName(java.lang.String fullName) {
        this.fullName = fullName;
    }

    public java.lang.String getContractCode() {
        return contractCode;
    }

    public void setContractCode(java.lang.String contractCode) {
        this.contractCode = contractCode;
    }

    public java.lang.String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(java.lang.String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public java.lang.String getStationCode() {
        return stationCode;
    }

    public void setStationCode(java.lang.String stationCode) {
        this.stationCode = stationCode;
    }

    public java.lang.String getConstructionTypeName() {
        return constructionTypeName;
    }

    public void setConstructionTypeName(java.lang.String constructionTypeName) {
        this.constructionTypeName = constructionTypeName;
    }

    public java.lang.String getTCTT() {
        return TCTT;
    }

    public void setTCTT(java.lang.String tCTT) {
        TCTT = tCTT;
    }

    public java.lang.String getGiam_sat() {
        return giam_sat;
    }

    public void setGiam_sat(java.lang.String giam_sat) {
        this.giam_sat = giam_sat;
    }

    public java.util.Date getKetthuc_trienkhai() {
        return ketthuc_trienkhai;
    }

    public void setKetthuc_trienkhai(java.util.Date ketthuc_trienkhai) {
        this.ketthuc_trienkhai = ketthuc_trienkhai;
    }

    public java.lang.String getThicong_xong() {
        return thicong_xong;
    }

    public void setThicong_xong(java.lang.String thicong_xong) {
        this.thicong_xong = thicong_xong;
    }

    public java.lang.String getDang_thicong() {
        return dang_thicong;
    }

    public void setDang_thicong(java.lang.String dang_thicong) {
        this.dang_thicong = dang_thicong;
    }

    public java.lang.String getLuy_ke() {
        return luy_ke;
    }

    public void setLuy_ke(java.lang.String luy_ke) {
        this.luy_ke = luy_ke;
    }

    public java.lang.String getVuong() {
        return vuong;
    }

    public void setVuong(java.lang.String vuong) {
        this.vuong = vuong;
    }

    public java.util.Date getBatdau_thicong() {
        return batdau_thicong;
    }

    public void setBatdau_thicong(java.util.Date batdau_thicong) {
        this.batdau_thicong = batdau_thicong;
    }

    public java.util.Date getKetthuc_thicong() {
        return ketthuc_thicong;
    }

    public void setKetthuc_thicong(java.util.Date ketthuc_thicong) {
        this.ketthuc_thicong = ketthuc_thicong;
    }

    public java.lang.Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(java.lang.Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    public java.lang.Long getStationId() {
        return stationId;
    }

    public void setStationId(java.lang.Long stationId) {
        this.stationId = stationId;
    }

    public java.lang.String getChua_thicong() {
        return chua_thicong;
    }

    public void setChua_thicong(java.lang.String chua_thicong) {
        this.chua_thicong = chua_thicong;
    }

    private List<UtilAttachDocumentDTO> listImage;

    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
    }

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public java.util.Date getKetthuc_trienkhai_tu() {
        return ketthuc_trienkhai_tu;
    }

    public void setKetthuc_trienkhai_tu(java.util.Date ketthuc_trienkhai_tu) {
        this.ketthuc_trienkhai_tu = ketthuc_trienkhai_tu;
    }

    public java.util.Date getKetthuc_trienkhai_den() {
        return ketthuc_trienkhai_den;
    }

    public void setKetthuc_trienkhai_den(java.util.Date ketthuc_trienkhai_den) {
        this.ketthuc_trienkhai_den = ketthuc_trienkhai_den;
    }

    // chinhpxn20180718_start
    private Long oldPerformerId;

    public Long getOldPerformerId() {
        return oldPerformerId;
    }

    public void setOldPerformerId(Long oldPerformerId) {
        this.oldPerformerId = oldPerformerId;
    }
//chinhpxn20180718_end

    //hoanm1_20180628_start
    private java.lang.Double quantityRevenue;
    //phucvx_28/06
    private Double amount;
    private Double price;

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    //phuc_end
    public java.lang.Double getQuantityRevenue() {
        return quantityRevenue;
    }

    public void setQuantityRevenue(java.lang.Double quantityRevenue) {
        this.quantityRevenue = quantityRevenue;
    }

    //hoanm1_20180628_end
//chinhpxn20180621
    private String taskOrder;

    public String getTaskOrder() {
        return taskOrder;
    }

    public void setTaskOrder(String taskOrder) {
        this.taskOrder = taskOrder;
    }
//chinhpxn20180621

    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date endDate;
    private java.util.Date baselineStartDate;
    private java.util.Date baselineEndDate;
    private java.lang.Long constructionId;
    private java.lang.Long catTaskId;
    private java.lang.Long levelId;
    private java.lang.Long parentId;
    private java.lang.String path;

    @Override
    public ConstructionTaskBO toModel() {
        ConstructionTaskBO constructionTaskBO = new ConstructionTaskBO();
        constructionTaskBO.setCompletePercent(this.completePercent);
        constructionTaskBO.setDescription(this.description);
        constructionTaskBO.setStatus(this.status);
        constructionTaskBO.setSourceType(this.sourceType);
        constructionTaskBO.setDeployType(this.deployType);
        constructionTaskBO.setType(this.type);
        constructionTaskBO
                .setVat(Double.valueOf((this.vat != null ? this.vat.doubleValue() * 1000000 : 0)).doubleValue());
        constructionTaskBO.setDetailMonthPlanId(this.detailMonthPlanId);
        constructionTaskBO.setCreatedDate(this.createdDate);
        constructionTaskBO.setCreatedUserId(this.createdUserId);
        constructionTaskBO.setCreatedGroupId(this.createdGroupId);
        constructionTaskBO.setUpdatedDate(this.updatedDate);
        constructionTaskBO.setUpdatedUserId(this.updatedUserId);
        constructionTaskBO.setUpdatedGroupId(this.updatedGroupId);
        constructionTaskBO.setCompleteState(this.completeState);
        constructionTaskBO.setPerformerWorkItemId(this.performerWorkItemId);
        constructionTaskBO.setSupervisorId(this.supervisorId);
        constructionTaskBO.setDirectorId(this.directorId);
        constructionTaskBO.setPerformerId(this.performerId);
        constructionTaskBO.setQuantity(
                Double.valueOf((this.quantity != null ? this.quantity.doubleValue() * 1000000 : 0)).doubleValue());
        constructionTaskBO.setConstructionTaskId(this.constructionTaskId);
        constructionTaskBO.setSysGroupId(this.sysGroupId);
        constructionTaskBO.setMonth(this.month);
        constructionTaskBO.setYear(this.year);
        constructionTaskBO.setTaskName(this.taskName);
        constructionTaskBO.setStartDate(this.startDate);
        constructionTaskBO.setEndDate(this.endDate);
        constructionTaskBO.setBaselineStartDate(this.baselineStartDate);
        constructionTaskBO.setBaselineEndDate(this.baselineEndDate);
        constructionTaskBO.setConstructionId(this.constructionId);
        constructionTaskBO.setWorkItemId(this.workItemId);
        constructionTaskBO.setCatTaskId(this.catTaskId);
        constructionTaskBO.setLevelId(this.levelId);
        constructionTaskBO.setParentId(this.parentId);
        constructionTaskBO.setPath(this.path);
        constructionTaskBO.setReasonStop(this.reasonStop);
        constructionTaskBO.setTaskOrder(this.taskOrder);
//        hoanm1_20181229_start
        constructionTaskBO.setWorkItemNameHSHC(this.workItemNameHSHC);
//        hoanm1_20181229_end
        return constructionTaskBO;
    }

    public java.lang.Double getCompletePercent() {
        return completePercent;
    }

    public void setCompletePercent(java.lang.Double completePercent) {
        this.completePercent = completePercent;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getSourceType() {
        return sourceType;
    }

    public void setSourceType(java.lang.String sourceType) {
        this.sourceType = sourceType;
    }

    public java.lang.String getDeployType() {
        return deployType;
    }

    public void setDeployType(java.lang.String deployType) {
        this.deployType = deployType;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.Double getVat() {
        return vat != null ? vat / 1000000 : 0;
    }

    public void setVat(java.lang.Double vat) {
        this.vat = vat;
    }

    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public java.lang.String getCompleteState() {
        return completeState;
    }

    public void setCompleteState(java.lang.String completeState) {
        this.completeState = completeState;
    }

    public java.lang.Long getPerformerWorkItemId() {
        return performerWorkItemId;
    }

    public void setPerformerWorkItemId(java.lang.Long performerWorkItemId) {
        this.performerWorkItemId = performerWorkItemId;
    }

    public java.lang.Double getSupervisorId() {
        return supervisorId;
    }

    public void setSupervisorId(java.lang.Double supervisorId) {
        this.supervisorId = supervisorId;
    }

    public java.lang.Double getDirectorId() {
        return directorId;
    }

    public void setDirectorId(java.lang.Double directorId) {
        this.directorId = directorId;
    }

    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }

    public java.lang.Double getQuantity() {
        return quantity != null ? quantity / 1000000 : 0;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Override
    public Long getFWModelId() {
        return constructionTaskId;
    }

    @Override
    public String catchName() {
        return getConstructionTaskId().toString();
    }

    public java.lang.Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(java.lang.Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    public java.lang.String getTaskName() {
        return taskName;
    }

    public void setTaskName(java.lang.String taskName) {
        this.taskName = taskName;
    }

    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    public java.util.Date getBaselineStartDate() {
        return baselineStartDate;
    }

    public void setBaselineStartDate(java.util.Date baselineStartDate) {
        this.baselineStartDate = baselineStartDate;
    }

    public java.util.Date getBaselineEndDate() {
        return baselineEndDate;
    }

    public void setBaselineEndDate(java.util.Date baselineEndDate) {
        this.baselineEndDate = baselineEndDate;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    public java.lang.Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(java.lang.Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    public java.lang.Long getLevelId() {
        return levelId;
    }

    public void setLevelId(java.lang.Long levelId) {
        this.levelId = levelId;
    }

    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    public java.lang.String getPath() {
        return path;
    }

    public void setPath(java.lang.String path) {
        this.path = path;
    }

    public java.lang.String getReasonStop() {
        return reasonStop;
    }

    public void setReasonStop(java.lang.String reasonStop) {
        this.reasonStop = reasonStop;
    }

    public java.lang.String getConstructionName() {
        return constructionName;
    }

    public void setConstructionName(java.lang.String constructionName) {
        this.constructionName = constructionName;
    }

    public java.lang.String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(java.lang.String performerName) {
        this.performerName = performerName;
    }

    public java.lang.String getQuantityByDate() {
        return quantityByDate;
    }

    public void setQuantityByDate(java.lang.String quantityByDate) {
        this.quantityByDate = quantityByDate;
    }
    
//huypq_20181030_start
    
    private String quantityThSl,quantityThHc,quantityKhHc,quantityKhSl;
    public String getQuantityThSl() {
		return quantityThSl;
	}

	public void setQuantityThSl(String quantityThSl) {
		this.quantityThSl = quantityThSl;
	}

	public String getQuantityThHc() {
		return quantityThHc;
	}

	public void setQuantityThHc(String quantityThHc) {
		this.quantityThHc = quantityThHc;
	}

	public String getQuantityKhHc() {
		return quantityKhHc;
	}

	public void setQuantityKhHc(String quantityKhHc) {
		this.quantityKhHc = quantityKhHc;
	}

	public String getQuantityKhSl() {
		return quantityKhSl;
	}

	public void setQuantityKhSl(String quantityKhSl) {
		this.quantityKhSl = quantityKhSl;
	}
    
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((TCTT == null) ? 0 : TCTT.hashCode());
		result = prime * result + ((amount == null) ? 0 : amount.hashCode());
		result = prime * result + ((baselineEndDate == null) ? 0 : baselineEndDate.hashCode());
		result = prime * result + ((baselineStartDate == null) ? 0 : baselineStartDate.hashCode());
		result = prime * result + ((batdau_thicong == null) ? 0 : batdau_thicong.hashCode());
		result = prime * result + ((catConstructionTypeId == null) ? 0 : catConstructionTypeId.hashCode());
		result = prime * result + ((catTaskId == null) ? 0 : catTaskId.hashCode());
		result = prime * result + ((checkEntangle == null) ? 0 : checkEntangle.hashCode());
		result = prime * result + ((chua_thicong == null) ? 0 : chua_thicong.hashCode());
		result = prime * result + ((completePercent == null) ? 0 : completePercent.hashCode());
		result = prime * result + ((completeState == null) ? 0 : completeState.hashCode());
		result = prime * result + ((constructionCode == null) ? 0 : constructionCode.hashCode());
		result = prime * result + ((constructionId == null) ? 0 : constructionId.hashCode());
		result = prime * result + ((constructionName == null) ? 0 : constructionName.hashCode());
		result = prime * result + ((constructionTaskId == null) ? 0 : constructionTaskId.hashCode());
		result = prime * result + ((constructionTypeName == null) ? 0 : constructionTypeName.hashCode());
		result = prime * result + ((contractCode == null) ? 0 : contractCode.hashCode());
		result = prime * result + ((createdDate == null) ? 0 : createdDate.hashCode());
		result = prime * result + ((createdGroupId == null) ? 0 : createdGroupId.hashCode());
		result = prime * result + ((createdUserId == null) ? 0 : createdUserId.hashCode());
		result = prime * result + ((dang_thicong == null) ? 0 : dang_thicong.hashCode());
		result = prime * result + ((dateFrom == null) ? 0 : dateFrom.hashCode());
		result = prime * result + ((dateTo == null) ? 0 : dateTo.hashCode());
		result = prime * result + ((deployType == null) ? 0 : deployType.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((detailMonthPlanId == null) ? 0 : detailMonthPlanId.hashCode());
		result = prime * result + ((directorId == null) ? 0 : directorId.hashCode());
		result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
		result = prime * result + ((fullName == null) ? 0 : fullName.hashCode());
		result = prime * result + ((giam_sat == null) ? 0 : giam_sat.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((ketthuc_thicong == null) ? 0 : ketthuc_thicong.hashCode());
		result = prime * result + ((ketthuc_trienkhai == null) ? 0 : ketthuc_trienkhai.hashCode());
		result = prime * result + ((ketthuc_trienkhai_den == null) ? 0 : ketthuc_trienkhai_den.hashCode());
		result = prime * result + ((ketthuc_trienkhai_tu == null) ? 0 : ketthuc_trienkhai_tu.hashCode());
		result = prime * result + ((levelId == null) ? 0 : levelId.hashCode());
		result = prime * result + ((listImage == null) ? 0 : listImage.hashCode());
		result = prime * result + ((luy_ke == null) ? 0 : luy_ke.hashCode());
		result = prime * result + ((month == null) ? 0 : month.hashCode());
		result = prime * result + ((obstructedState == null) ? 0 : obstructedState.hashCode());
		result = prime * result + ((oldPerformerId == null) ? 0 : oldPerformerId.hashCode());
		result = prime * result + ((parentId == null) ? 0 : parentId.hashCode());
		result = prime * result + ((partnerName == null) ? 0 : partnerName.hashCode());
		result = prime * result + ((path == null) ? 0 : path.hashCode());
		result = prime * result + ((performerId == null) ? 0 : performerId.hashCode());
		result = prime * result + ((performerName == null) ? 0 : performerName.hashCode());
		result = prime * result + ((performerWorkItemId == null) ? 0 : performerWorkItemId.hashCode());
		result = prime * result + ((price == null) ? 0 : price.hashCode());
		result = prime * result + ((provinceCode == null) ? 0 : provinceCode.hashCode());
		result = prime * result + ((quantity == null) ? 0 : quantity.hashCode());
		result = prime * result + ((quantityByDate == null) ? 0 : quantityByDate.hashCode());
		result = prime * result + ((quantityChart == null) ? 0 : quantityChart.hashCode());
		result = prime * result + ((quantityKhHc == null) ? 0 : quantityKhHc.hashCode());
		result = prime * result + ((quantityKhSl == null) ? 0 : quantityKhSl.hashCode());
		result = prime * result + ((quantityRevenue == null) ? 0 : quantityRevenue.hashCode());
		result = prime * result + ((quantityThHc == null) ? 0 : quantityThHc.hashCode());
		result = prime * result + ((quantityThSl == null) ? 0 : quantityThSl.hashCode());
		result = prime * result + ((reasonStop == null) ? 0 : reasonStop.hashCode());
		result = prime * result + ((sourceType == null) ? 0 : sourceType.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
		result = prime * result + ((startDateChart == null) ? 0 : startDateChart.hashCode());
		result = prime * result + ((stationCode == null) ? 0 : stationCode.hashCode());
		result = prime * result + ((stationId == null) ? 0 : stationId.hashCode());
		result = prime * result + ((status == null) ? 0 : status.hashCode());
		result = prime * result + ((supervisorId == null) ? 0 : supervisorId.hashCode());
		result = prime * result + ((sysGroupId == null) ? 0 : sysGroupId.hashCode());
		result = prime * result + ((sysGroupName == null) ? 0 : sysGroupName.hashCode());
		result = prime * result + ((sysUserId == null) ? 0 : sysUserId.hashCode());
		result = prime * result + ((taskName == null) ? 0 : taskName.hashCode());
		result = prime * result + ((taskOrder == null) ? 0 : taskOrder.hashCode());
		result = prime * result + ((thicong_xong == null) ? 0 : thicong_xong.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + ((typeName == null) ? 0 : typeName.hashCode());
		result = prime * result + ((updatedDate == null) ? 0 : updatedDate.hashCode());
		result = prime * result + ((updatedGroupId == null) ? 0 : updatedGroupId.hashCode());
		result = prime * result + ((updatedUserId == null) ? 0 : updatedUserId.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
		result = prime * result + ((vuong == null) ? 0 : vuong.hashCode());
		result = prime * result + ((workItemId == null) ? 0 : workItemId.hashCode());
		result = prime * result + ((workItemName == null) ? 0 : workItemName.hashCode());
		result = prime * result + ((year == null) ? 0 : year.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ConstructionTaskDTO other = (ConstructionTaskDTO) obj;
		if (TCTT == null) {
			if (other.TCTT != null)
				return false;
		} else if (!TCTT.equals(other.TCTT))
			return false;
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
			return false;
		if (baselineEndDate == null) {
			if (other.baselineEndDate != null)
				return false;
		} else if (!baselineEndDate.equals(other.baselineEndDate))
			return false;
		if (baselineStartDate == null) {
			if (other.baselineStartDate != null)
				return false;
		} else if (!baselineStartDate.equals(other.baselineStartDate))
			return false;
		if (batdau_thicong == null) {
			if (other.batdau_thicong != null)
				return false;
		} else if (!batdau_thicong.equals(other.batdau_thicong))
			return false;
		if (catConstructionTypeId == null) {
			if (other.catConstructionTypeId != null)
				return false;
		} else if (!catConstructionTypeId.equals(other.catConstructionTypeId))
			return false;
		if (catTaskId == null) {
			if (other.catTaskId != null)
				return false;
		} else if (!catTaskId.equals(other.catTaskId))
			return false;
		if (checkEntangle == null) {
			if (other.checkEntangle != null)
				return false;
		} else if (!checkEntangle.equals(other.checkEntangle))
			return false;
		if (chua_thicong == null) {
			if (other.chua_thicong != null)
				return false;
		} else if (!chua_thicong.equals(other.chua_thicong))
			return false;
		if (completePercent == null) {
			if (other.completePercent != null)
				return false;
		} else if (!completePercent.equals(other.completePercent))
			return false;
		if (completeState == null) {
			if (other.completeState != null)
				return false;
		} else if (!completeState.equals(other.completeState))
			return false;
		if (constructionCode == null) {
			if (other.constructionCode != null)
				return false;
		} else if (!constructionCode.equals(other.constructionCode))
			return false;
		if (constructionId == null) {
			if (other.constructionId != null)
				return false;
		} else if (!constructionId.equals(other.constructionId))
			return false;
		if (constructionName == null) {
			if (other.constructionName != null)
				return false;
		} else if (!constructionName.equals(other.constructionName))
			return false;
		if (constructionTaskId == null) {
			if (other.constructionTaskId != null)
				return false;
		} else if (!constructionTaskId.equals(other.constructionTaskId))
			return false;
		if (constructionTypeName == null) {
			if (other.constructionTypeName != null)
				return false;
		} else if (!constructionTypeName.equals(other.constructionTypeName))
			return false;
		if (contractCode == null) {
			if (other.contractCode != null)
				return false;
		} else if (!contractCode.equals(other.contractCode))
			return false;
		if (createdDate == null) {
			if (other.createdDate != null)
				return false;
		} else if (!createdDate.equals(other.createdDate))
			return false;
		if (createdGroupId == null) {
			if (other.createdGroupId != null)
				return false;
		} else if (!createdGroupId.equals(other.createdGroupId))
			return false;
		if (createdUserId == null) {
			if (other.createdUserId != null)
				return false;
		} else if (!createdUserId.equals(other.createdUserId))
			return false;
		if (dang_thicong == null) {
			if (other.dang_thicong != null)
				return false;
		} else if (!dang_thicong.equals(other.dang_thicong))
			return false;
		if (dateFrom == null) {
			if (other.dateFrom != null)
				return false;
		} else if (!dateFrom.equals(other.dateFrom))
			return false;
		if (dateTo == null) {
			if (other.dateTo != null)
				return false;
		} else if (!dateTo.equals(other.dateTo))
			return false;
		if (deployType == null) {
			if (other.deployType != null)
				return false;
		} else if (!deployType.equals(other.deployType))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (detailMonthPlanId == null) {
			if (other.detailMonthPlanId != null)
				return false;
		} else if (!detailMonthPlanId.equals(other.detailMonthPlanId))
			return false;
		if (directorId == null) {
			if (other.directorId != null)
				return false;
		} else if (!directorId.equals(other.directorId))
			return false;
		if (endDate == null) {
			if (other.endDate != null)
				return false;
		} else if (!endDate.equals(other.endDate))
			return false;
		if (fullName == null) {
			if (other.fullName != null)
				return false;
		} else if (!fullName.equals(other.fullName))
			return false;
		if (giam_sat == null) {
			if (other.giam_sat != null)
				return false;
		} else if (!giam_sat.equals(other.giam_sat))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (ketthuc_thicong == null) {
			if (other.ketthuc_thicong != null)
				return false;
		} else if (!ketthuc_thicong.equals(other.ketthuc_thicong))
			return false;
		if (ketthuc_trienkhai == null) {
			if (other.ketthuc_trienkhai != null)
				return false;
		} else if (!ketthuc_trienkhai.equals(other.ketthuc_trienkhai))
			return false;
		if (ketthuc_trienkhai_den == null) {
			if (other.ketthuc_trienkhai_den != null)
				return false;
		} else if (!ketthuc_trienkhai_den.equals(other.ketthuc_trienkhai_den))
			return false;
		if (ketthuc_trienkhai_tu == null) {
			if (other.ketthuc_trienkhai_tu != null)
				return false;
		} else if (!ketthuc_trienkhai_tu.equals(other.ketthuc_trienkhai_tu))
			return false;
		if (levelId == null) {
			if (other.levelId != null)
				return false;
		} else if (!levelId.equals(other.levelId))
			return false;
		if (listImage == null) {
			if (other.listImage != null)
				return false;
		} else if (!listImage.equals(other.listImage))
			return false;
		if (luy_ke == null) {
			if (other.luy_ke != null)
				return false;
		} else if (!luy_ke.equals(other.luy_ke))
			return false;
		if (month == null) {
			if (other.month != null)
				return false;
		} else if (!month.equals(other.month))
			return false;
		if (obstructedState == null) {
			if (other.obstructedState != null)
				return false;
		} else if (!obstructedState.equals(other.obstructedState))
			return false;
		if (oldPerformerId == null) {
			if (other.oldPerformerId != null)
				return false;
		} else if (!oldPerformerId.equals(other.oldPerformerId))
			return false;
		if (parentId == null) {
			if (other.parentId != null)
				return false;
		} else if (!parentId.equals(other.parentId))
			return false;
		if (partnerName == null) {
			if (other.partnerName != null)
				return false;
		} else if (!partnerName.equals(other.partnerName))
			return false;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		if (performerId == null) {
			if (other.performerId != null)
				return false;
		} else if (!performerId.equals(other.performerId))
			return false;
		if (performerName == null) {
			if (other.performerName != null)
				return false;
		} else if (!performerName.equals(other.performerName))
			return false;
		if (performerWorkItemId == null) {
			if (other.performerWorkItemId != null)
				return false;
		} else if (!performerWorkItemId.equals(other.performerWorkItemId))
			return false;
		if (price == null) {
			if (other.price != null)
				return false;
		} else if (!price.equals(other.price))
			return false;
		if (provinceCode == null) {
			if (other.provinceCode != null)
				return false;
		} else if (!provinceCode.equals(other.provinceCode))
			return false;
		if (quantity == null) {
			if (other.quantity != null)
				return false;
		} else if (!quantity.equals(other.quantity))
			return false;
		if (quantityByDate == null) {
			if (other.quantityByDate != null)
				return false;
		} else if (!quantityByDate.equals(other.quantityByDate))
			return false;
		if (quantityChart == null) {
			if (other.quantityChart != null)
				return false;
		} else if (!quantityChart.equals(other.quantityChart))
			return false;
		if (quantityKhHc == null) {
			if (other.quantityKhHc != null)
				return false;
		} else if (!quantityKhHc.equals(other.quantityKhHc))
			return false;
		if (quantityKhSl == null) {
			if (other.quantityKhSl != null)
				return false;
		} else if (!quantityKhSl.equals(other.quantityKhSl))
			return false;
		if (quantityRevenue == null) {
			if (other.quantityRevenue != null)
				return false;
		} else if (!quantityRevenue.equals(other.quantityRevenue))
			return false;
		if (quantityThHc == null) {
			if (other.quantityThHc != null)
				return false;
		} else if (!quantityThHc.equals(other.quantityThHc))
			return false;
		if (quantityThSl == null) {
			if (other.quantityThSl != null)
				return false;
		} else if (!quantityThSl.equals(other.quantityThSl))
			return false;
		if (reasonStop == null) {
			if (other.reasonStop != null)
				return false;
		} else if (!reasonStop.equals(other.reasonStop))
			return false;
		if (sourceType == null) {
			if (other.sourceType != null)
				return false;
		} else if (!sourceType.equals(other.sourceType))
			return false;
		if (startDate == null) {
			if (other.startDate != null)
				return false;
		} else if (!startDate.equals(other.startDate))
			return false;
		if (startDateChart == null) {
			if (other.startDateChart != null)
				return false;
		} else if (!startDateChart.equals(other.startDateChart))
			return false;
		if (stationCode == null) {
			if (other.stationCode != null)
				return false;
		} else if (!stationCode.equals(other.stationCode))
			return false;
		if (stationId == null) {
			if (other.stationId != null)
				return false;
		} else if (!stationId.equals(other.stationId))
			return false;
		if (status == null) {
			if (other.status != null)
				return false;
		} else if (!status.equals(other.status))
			return false;
		if (supervisorId == null) {
			if (other.supervisorId != null)
				return false;
		} else if (!supervisorId.equals(other.supervisorId))
			return false;
		if (sysGroupId == null) {
			if (other.sysGroupId != null)
				return false;
		} else if (!sysGroupId.equals(other.sysGroupId))
			return false;
		if (sysGroupName == null) {
			if (other.sysGroupName != null)
				return false;
		} else if (!sysGroupName.equals(other.sysGroupName))
			return false;
		if (sysUserId == null) {
			if (other.sysUserId != null)
				return false;
		} else if (!sysUserId.equals(other.sysUserId))
			return false;
		if (taskName == null) {
			if (other.taskName != null)
				return false;
		} else if (!taskName.equals(other.taskName))
			return false;
		if (taskOrder == null) {
			if (other.taskOrder != null)
				return false;
		} else if (!taskOrder.equals(other.taskOrder))
			return false;
		if (thicong_xong == null) {
			if (other.thicong_xong != null)
				return false;
		} else if (!thicong_xong.equals(other.thicong_xong))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (typeName == null) {
			if (other.typeName != null)
				return false;
		} else if (!typeName.equals(other.typeName))
			return false;
		if (updatedDate == null) {
			if (other.updatedDate != null)
				return false;
		} else if (!updatedDate.equals(other.updatedDate))
			return false;
		if (updatedGroupId == null) {
			if (other.updatedGroupId != null)
				return false;
		} else if (!updatedGroupId.equals(other.updatedGroupId))
			return false;
		if (updatedUserId == null) {
			if (other.updatedUserId != null)
				return false;
		} else if (!updatedUserId.equals(other.updatedUserId))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		if (vuong == null) {
			if (other.vuong != null)
				return false;
		} else if (!vuong.equals(other.vuong))
			return false;
		if (workItemId == null) {
			if (other.workItemId != null)
				return false;
		} else if (!workItemId.equals(other.workItemId))
			return false;
		if (workItemName == null) {
			if (other.workItemName != null)
				return false;
		} else if (!workItemName.equals(other.workItemName))
			return false;
		if (year == null) {
			if (other.year != null)
				return false;
		} else if (!year.equals(other.year))
			return false;
		return true;
	}

//	public String getDateComplete() {
//		return dateComplete;
//	}
//
//	public void setDateComplete(String dateComplete) {
//		this.dateComplete = dateComplete;
//	}

	
	//huypq_20181030_end
	

    //nhantv
//    public double getUnChangedQuantity() {
//        return this.quantity;
//    }
//Huypq-20181105-start
    private String fillCatProvince;
	private String catProvinceCode;
	private Long workItemPartFinish;
	private Double quantityPartFinish;
	private Long workItemConsFinish;
	private Double quantityConsFinish;
	private Long workItemSumFinish;
	private Double quantitySumFinish;
	private Long workItemPartConstructing;
	private Double quantityPartConstructing;
	private Long workItemConsConstructing;
	private Double quantityConsConstructing;
	private Long workItemSumConstructing;
	private Double quantitySumConstructing;
	private Long workItemPartNonConstruction;
	private Double quantityPartNonConstruction;
	private Long workItemConsNonConstruction;
	private Double quantityConsNonConstruction;
	private Long workItemSumNonConstruction;
	private Double quantitySumNonConstruction;
	private Long workItemPartStuck;
	private Double quantityPartStuck;
	private Long workItemConsStuck;
	private Double quantityConsStuck;
	private Long workItemSumStuck;
	private Double quantitySumStuck;
	
	public String getFillCatProvince() {
		return fillCatProvince;
	}

	public void setFillCatProvince(String fillCatProvince) {
		this.fillCatProvince = fillCatProvince;
	}

	public String getCatProvinceCode() {
		return catProvinceCode;
	}

	public void setCatProvinceCode(String catProvinceCode) {
		this.catProvinceCode = catProvinceCode;
	}

	public Long getWorkItemPartFinish() {
		return workItemPartFinish;
	}

	public void setWorkItemPartFinish(Long workItemPartFinish) {
		this.workItemPartFinish = workItemPartFinish;
	}

	public Double getQuantityPartFinish() {
		return quantityPartFinish;
	}

	public void setQuantityPartFinish(Double quantityPartFinish) {
		this.quantityPartFinish = quantityPartFinish;
	}

	public Long getWorkItemConsFinish() {
		return workItemConsFinish;
	}

	public void setWorkItemConsFinish(Long workItemConsFinish) {
		this.workItemConsFinish = workItemConsFinish;
	}

	public Double getQuantityConsFinish() {
		return quantityConsFinish;
	}

	public void setQuantityConsFinish(Double quantityConsFinish) {
		this.quantityConsFinish = quantityConsFinish;
	}

	public Long getWorkItemSumFinish() {
		return workItemSumFinish;
	}

	public void setWorkItemSumFinish(Long workItemSumFinish) {
		this.workItemSumFinish = workItemSumFinish;
	}

	public Double getQuantitySumFinish() {
		return quantitySumFinish;
	}

	public void setQuantitySumFinish(Double quantitySumFinish) {
		this.quantitySumFinish = quantitySumFinish;
	}

	public Long getWorkItemPartConstructing() {
		return workItemPartConstructing;
	}

	public void setWorkItemPartConstructing(Long workItemPartConstructing) {
		this.workItemPartConstructing = workItemPartConstructing;
	}

	public Double getQuantityPartConstructing() {
		return quantityPartConstructing;
	}

	public void setQuantityPartConstructing(Double quantityPartConstructing) {
		this.quantityPartConstructing = quantityPartConstructing;
	}

	public Long getWorkItemConsConstructing() {
		return workItemConsConstructing;
	}

	public void setWorkItemConsConstructing(Long workItemConsConstructing) {
		this.workItemConsConstructing = workItemConsConstructing;
	}

	public Double getQuantityConsConstructing() {
		return quantityConsConstructing;
	}

	public void setQuantityConsConstructing(Double quantityConsConstructing) {
		this.quantityConsConstructing = quantityConsConstructing;
	}

	public Long getWorkItemSumConstructing() {
		return workItemSumConstructing;
	}

	public void setWorkItemSumConstructing(Long workItemSumConstructing) {
		this.workItemSumConstructing = workItemSumConstructing;
	}

	public Double getQuantitySumConstructing() {
		return quantitySumConstructing;
	}

	public void setQuantitySumConstructing(Double quantitySumConstructing) {
		this.quantitySumConstructing = quantitySumConstructing;
	}

	public Long getWorkItemPartNonConstruction() {
		return workItemPartNonConstruction;
	}

	public void setWorkItemPartNonConstruction(Long workItemPartNonConstruction) {
		this.workItemPartNonConstruction = workItemPartNonConstruction;
	}

	public Double getQuantityPartNonConstruction() {
		return quantityPartNonConstruction;
	}

	public void setQuantityPartNonConstruction(Double quantityPartNonConstruction) {
		this.quantityPartNonConstruction = quantityPartNonConstruction;
	}

	public Long getWorkItemConsNonConstruction() {
		return workItemConsNonConstruction;
	}

	public void setWorkItemConsNonConstruction(Long workItemConsNonConstruction) {
		this.workItemConsNonConstruction = workItemConsNonConstruction;
	}

	public Double getQuantityConsNonConstruction() {
		return quantityConsNonConstruction;
	}

	public void setQuantityConsNonConstruction(Double quantityConsNonConstruction) {
		this.quantityConsNonConstruction = quantityConsNonConstruction;
	}

	public Long getWorkItemSumNonConstruction() {
		return workItemSumNonConstruction;
	}

	public void setWorkItemSumNonConstruction(Long workItemSumNonConstruction) {
		this.workItemSumNonConstruction = workItemSumNonConstruction;
	}

	public Double getQuantitySumNonConstruction() {
		return quantitySumNonConstruction;
	}

	public void setQuantitySumNonConstruction(Double quantitySumNonConstruction) {
		this.quantitySumNonConstruction = quantitySumNonConstruction;
	}

	public Long getWorkItemPartStuck() {
		return workItemPartStuck;
	}

	public void setWorkItemPartStuck(Long workItemPartStuck) {
		this.workItemPartStuck = workItemPartStuck;
	}

	public Double getQuantityPartStuck() {
		return quantityPartStuck;
	}

	public void setQuantityPartStuck(Double quantityPartStuck) {
		this.quantityPartStuck = quantityPartStuck;
	}

	public Long getWorkItemConsStuck() {
		return workItemConsStuck;
	}

	public void setWorkItemConsStuck(Long workItemConsStuck) {
		this.workItemConsStuck = workItemConsStuck;
	}

	public Double getQuantityConsStuck() {
		return quantityConsStuck;
	}

	public void setQuantityConsStuck(Double quantityConsStuck) {
		this.quantityConsStuck = quantityConsStuck;
	}

	public Long getWorkItemSumStuck() {
		return workItemSumStuck;
	}

	public void setWorkItemSumStuck(Long workItemSumStuck) {
		this.workItemSumStuck = workItemSumStuck;
	}

	public Double getQuantitySumStuck() {
		return quantitySumStuck;
	}

	public void setQuantitySumStuck(Double quantitySumStuck) {
		this.quantitySumStuck = quantitySumStuck;
	}
	//Huypq-20181105-end
//  hoanm1_20190108_start
	private String startingDateTK;
	private String handoverDateBuildBGMB;
	private String checkBGMB;
	
	public String getCheckBGMB() {
		return checkBGMB;
	}

	public void setCheckBGMB(String checkBGMB) {
		this.checkBGMB = checkBGMB;
	}

	public String getHandoverDateBuildBGMB() {
		return handoverDateBuildBGMB;
	}

	public void setHandoverDateBuildBGMB(String handoverDateBuildBGMB) {
		this.handoverDateBuildBGMB = handoverDateBuildBGMB;
	}

	public String getStartingDateTK() {
		return startingDateTK;
	}

	public void setStartingDateTK(String startingDateTK) {
		this.startingDateTK = startingDateTK;
	}
//	hoanm1_20190108_end
}
