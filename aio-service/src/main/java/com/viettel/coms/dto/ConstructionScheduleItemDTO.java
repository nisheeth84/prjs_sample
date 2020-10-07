package com.viettel.coms.dto;

import org.codehaus.jackson.map.annotate.JsonDeserialize;


import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

public class ConstructionScheduleItemDTO extends ConstructionScheduleDTO {

    // from sql
    private java.lang.String name;
    private Long workItemId;
    private java.lang.Long completeState;
    private java.lang.Long completePercent;
    private java.lang.String itemOrder;
    private java.lang.String syuFullName;
    private java.lang.String catPrtName;
    private Long catTaskId;
//    hoanm1_20180828_start
    private java.lang.Double quantity;
    private java.lang.Long perUnImplemented;
    private java.lang.Long perImplemented;
    private java.lang.Long perStop;
    private java.lang.Long perComplete;
//  hoanm1_20181002_start
  @JsonSerialize(using = JsonDateSerializerDate.class)
  @JsonDeserialize(using = JsonDateDeserializer.class)
  private java.util.Date startDate;
  @JsonSerialize(using = JsonDateSerializerDate.class)
  @JsonDeserialize(using = JsonDateDeserializer.class)
  private java.util.Date endDate;
	
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
//  hoanm1_20181002_end

	public java.lang.Long getPerUnImplemented() {
		return perUnImplemented;
	}

	public void setPerUnImplemented(java.lang.Long perUnImplemented) {
		this.perUnImplemented = perUnImplemented;
	}

	public java.lang.Long getPerImplemented() {
		return perImplemented;
	}

	public void setPerImplemented(java.lang.Long perImplemented) {
		this.perImplemented = perImplemented;
	}

	public java.lang.Long getPerStop() {
		return perStop;
	}

	public void setPerStop(java.lang.Long perStop) {
		this.perStop = perStop;
	}

	public java.lang.Long getPerComplete() {
		return perComplete;
	}

	public void setPerComplete(java.lang.Long perComplete) {
		this.perComplete = perComplete;
	}

	public java.lang.Double getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.Double quantity) {
		this.quantity = quantity;
	}

	//    hoanm1_20180828_end
    //	hoanm1_20180720_start
    private Long performerId;
    private Long sysGroupId;

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }

    //	hoanm1_20180720_end
    public Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    public java.lang.String getCatPrtName() {
        return catPrtName;
    }

    public void setCatPrtName(java.lang.String catPrtName) {
        this.catPrtName = catPrtName;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public java.lang.Long getCompleteState() {
        return completeState;
    }

    public void setCompleteState(java.lang.Long completeState) {
        this.completeState = completeState;
    }

    public java.lang.Long getCompletePercent() {
        return completePercent;
    }

    public void setCompletePercent(java.lang.Long completePercent) {
        this.completePercent = completePercent;
    }

    public java.lang.String getItemOrder() {
        return itemOrder;
    }

    public void setItemOrder(java.lang.String itemOrder) {
        this.itemOrder = itemOrder;
    }

    public java.lang.String getSyuFullName() {
        return syuFullName;
    }

    public void setSyuFullName(java.lang.String syuFullName) {
        this.syuFullName = syuFullName;
    }

}
