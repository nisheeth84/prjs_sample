package com.viettel.coms.dto;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

public class ConstructionScheduleWorkItemDTO extends ConstructionScheduleItemDTO {

    // from sql
    private java.lang.String taskName;
//    hoanm1_20181002_bo
//    @JsonSerialize(using = JsonDateSerializerDate.class)
//    @JsonDeserialize(using = JsonDateDeserializer.class)
//    private java.util.Date startDate;
//    @JsonSerialize(using = JsonDateSerializerDate.class)
//    @JsonDeserialize(using = JsonDateDeserializer.class)
//    private java.util.Date endDate;
//    hoanm1_20181002_bo
    private java.lang.String workItemName;
    private java.lang.String description;
    private java.lang.Long performerId;
    private java.lang.Long constructionTaskId;
    private java.lang.String path;
    private java.lang.String type;
    private java.lang.String taskOrder;
//    private java.lang.Double quantity;

    // use 1 time
    private java.lang.String workName;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date completeDate;
    private java.lang.String constructionState;
    private java.lang.String note;
    /*
     * private java.lang.String dataCode; private java.lang.Long dataId; private
     * java.lang.String adResource;
     */
    private java.lang.String quantityByDate;
    //	hoanm1_20180802_start
    private java.lang.String performerName;

    public java.lang.String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(java.lang.String performerName) {
        this.performerName = performerName;
    }

    //	hoanm1_20180802_end
    
//    hoanm1_20180905_start
    private java.lang.String obstructedState;
    
	public java.lang.String getObstructedState() {
		return obstructedState;
	}

	public void setObstructedState(java.lang.String obstructedState) {
		this.obstructedState = obstructedState;
	}
   
//    hoanm1_20180905_end
    




	// hoanm1_20180705_start
    private java.lang.Double amount;
    private java.lang.Double price;

    private java.lang.Long sysGroupId;

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    // hoanm1_20180705_end
    /*
     * public java.lang.String getDataCode() { return dataCode; } public void
     * setDataCode(java.lang.String dataCode) { this.dataCode = dataCode; } public
     * java.lang.String getAdResource() { return adResource; } public void
     * setAdResource(java.lang.String adResource) { this.adResource = adResource; }
     */
    public java.lang.String getTaskName() {
        return taskName;
    }

    public void setTaskName(java.lang.String taskName) {
        this.taskName = taskName;
    }
//    hoanm1_20181002_bo

//    public java.util.Date getStartDate() {
//        return startDate;
//    }
//
//    public void setStartDate(java.util.Date startDate) {
//        this.startDate = startDate;
//    }
//
//    public java.util.Date getEndDate() {
//        return endDate;
//    }
//
//    public void setEndDate(java.util.Date endDate) {
//        this.endDate = endDate;
//    }
//    hoanm1_20181002_bo
    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }

    public java.lang.Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(java.lang.Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    public java.lang.String getPath() {
        return path;
    }

    public void setPath(java.lang.String path) {
        this.path = path;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.String getTaskOrder() {
        return taskOrder;
    }

    public void setTaskOrder(java.lang.String taskOrder) {
        this.taskOrder = taskOrder;
    }

    public java.lang.String getWorkName() {
        return workName;
    }

    public void setWorkName(java.lang.String workName) {
        this.workName = workName;
    }

    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    public java.lang.String getConstructionState() {
        return constructionState;
    }

    public void setConstructionState(java.lang.String constructionState) {
        this.constructionState = constructionState;
    }

    public java.lang.String getNote() {
        return note;
    }

    public void setNote(java.lang.String note) {
        this.note = note;
    }
//hoanm1_20180828_comment
//    public java.lang.Double getQuantity() {
//        return quantity;
//    }
//
//    public void setQuantity(java.lang.Double quantity) {
//        this.quantity = quantity;
//    }
//hoanm1_20180828_comment

    /*
     * public java.lang.Long getDataId() { return dataId; } public void
     * setDataId(java.lang.Long dataId) { this.dataId = dataId; }
     */
    public java.lang.String getQuantityByDate() {
        return quantityByDate;
    }

    public void setQuantityByDate(java.lang.String quantityByDate) {
        this.quantityByDate = quantityByDate;
    }
	//    hoanm1_20190108_start
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
	
	/**Hoangnh start 15022019**/
	private java.lang.Double totalAmountChest;
	private java.lang.Double priceChest;
	private java.lang.Double totalAmountGate;
	private java.lang.Double priceGate;
	private java.lang.Double totalAmount;
	private java.lang.Double amountTaskDaily;
	private java.lang.String confirm;
	
	public java.lang.Double getAmountTaskDaily() {
		return amountTaskDaily;
	}

	public void setAmountTaskDaily(java.lang.Double amountTaskDaily) {
		this.amountTaskDaily = amountTaskDaily;
	}

	public java.lang.Double getTotalAmountChest() {
		return totalAmountChest;
	}

	public void setTotalAmountChest(java.lang.Double totalAmountChest) {
		this.totalAmountChest = totalAmountChest;
	}

	public java.lang.Double getPriceChest() {
		return priceChest;
	}

	public void setPriceChest(java.lang.Double priceChest) {
		this.priceChest = priceChest;
	}

	public java.lang.Double getTotalAmountGate() {
		return totalAmountGate;
	}

	public void setTotalAmountGate(java.lang.Double totalAmountGate) {
		this.totalAmountGate = totalAmountGate;
	}

	public java.lang.Double getPriceGate() {
		return priceGate;
	}

	public void setPriceGate(java.lang.Double priceGate) {
		this.priceGate = priceGate;
	}

	public java.lang.Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(java.lang.Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public java.lang.String getConfirm() {
		return confirm;
	}

	public void setConfirm(java.lang.String confirm) {
		this.confirm = confirm;
	}
	
	/**Hoangnh end 15022019**/
}
