package com.viettel.coms.dto;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionTaskDailyBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionTaskDailyDTO extends ComsBaseFWDTO<ConstructionTaskDailyBO> {
    private java.lang.Long constructionTaskDailyId;
    private java.lang.Long sysGroupId;
    private java.lang.Double amount;
    private java.lang.String type;
    private java.lang.String confirm;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long constructionTaskId;
    private String workItemName;
    private Long workItemId;
    // hungnx 20180627 start
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDate;
    private Double quantity;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date approveDate;
    private Long approveUserId;
    private Double price;
    private String constructionTypeName;
    private Long constructionId;
    private String statusConstructionTask;
    private Double amountConstruction;
    // hungnx 20180627 end
    // caott 070818 start
    private java.lang.String fullName;
    // caott 070818 end
    /**Hoangnh start 14022019**/
    private List<ConstructionImageInfo> constructionImageInfo;
    private Long sysUserId;

    public Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	public List<ConstructionImageInfo> getConstructionImageInfo() {
		return constructionImageInfo;
	}

	public void setConstructionImageInfo(
			List<ConstructionImageInfo> constructionImageInfo) {
		this.constructionImageInfo = constructionImageInfo;
	}
	/**Hoangnh end 14022019**/

	//	hoanm1_20180710_start
    private Long catTaskId;

    public java.lang.String getFullName() {
        return fullName;
    }

    public void setFullName(java.lang.String fullName) {
        this.fullName = fullName;
    }

    public Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    //	hoanm1_20180710_end
    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    public Date getApproveDate() {
        return approveDate;
    }

    public void setApproveDate(Date approveDate) {
        this.approveDate = approveDate;
    }

    public Long getApproveUserId() {
        return approveUserId;
    }

    public void setApproveUserId(Long approveUserId) {
        this.approveUserId = approveUserId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getConstructionTaskDailyId() {
        return constructionTaskDailyId;
    }

    public void setConstructionTaskDailyId(Long constructionTaskDailyId) {
        this.constructionTaskDailyId = constructionTaskDailyId;
    }

    public String getConstructionTypeName() {
        return constructionTypeName;
    }

    public void setConstructionTypeName(String constructionTypeName) {
        this.constructionTypeName = constructionTypeName;
    }

    @Override
    public Long getFWModelId() {
        return constructionTaskDailyId;
    }

    @Override
    public String catchName() {
        return getConstructionTaskDailyId().toString();
    }

    @Override
    public ConstructionTaskDailyBO toModel() {
        ConstructionTaskDailyBO constructionTaskDailyBO = new ConstructionTaskDailyBO();
        constructionTaskDailyBO.setConstructionTaskDailyId(this.constructionTaskDailyId);
        constructionTaskDailyBO.setSysGroupId(this.sysGroupId);
        constructionTaskDailyBO.setAmount(this.amount);
        constructionTaskDailyBO.setType(this.type);
        constructionTaskDailyBO.setConfirm(this.confirm);
        constructionTaskDailyBO.setCreatedDate(this.createdDate);
        constructionTaskDailyBO.setCreatedUserId(this.createdUserId);
        constructionTaskDailyBO.setCreatedGroupId(this.createdGroupId);
        constructionTaskDailyBO.setUpdatedDate(this.updatedDate);
        constructionTaskDailyBO.setUpdatedUserId(this.updatedUserId);
        constructionTaskDailyBO.setUpdatedGroupId(this.updatedGroupId);
        constructionTaskDailyBO.setConstructionTaskId(this.constructionTaskId);
        constructionTaskDailyBO.setQuantity(this.quantity);
        constructionTaskDailyBO.setWorkItemId(this.workItemId);
//		hoanm1_20180710_start
        constructionTaskDailyBO.setCatTaskId(this.catTaskId);
//		hoanm1_20180710_end
        return constructionTaskDailyBO;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
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

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public String getStatusConstructionTask() {
        return statusConstructionTask;
    }

    public void setStatusConstructionTask(String statusConstructionTask) {
        this.statusConstructionTask = statusConstructionTask;
    }

    public Double getAmountConstruction() {
        return amountConstruction;
    }

    public void setAmountConstruction(Double amountConstruction) {
        this.amountConstruction = amountConstruction;
    }
    
    /**Hoangnh start 18022019**/
    private String constructionCode;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date startDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date endDate;
    private Long catStationId;
    private String catStationCode;
    private String taskName;
    private String keySearch;
    private String sysGroupName;
    private List<Long> confirmLst;
    
	public List<Long> getConfirmLst() {
		return confirmLst;
	}

	public void setConfirmLst(List<Long> confirmLst) {
		this.confirmLst = confirmLst;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	public String getKeySearch() {
		return keySearch;
	}

	public void setKeySearch(String keySearch) {
		this.keySearch = keySearch;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
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

	public Long getCatStationId() {
		return catStationId;
	}

	public void setCatStationId(Long catStationId) {
		this.catStationId = catStationId;
	}

	public String getCatStationCode() {
		return catStationCode;
	}

	public void setCatStationCode(String catStationCode) {
		this.catStationCode = catStationCode;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

    /**Hoangnh end 18022019**/
}
