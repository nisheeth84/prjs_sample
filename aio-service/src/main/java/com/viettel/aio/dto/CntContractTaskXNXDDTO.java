package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractTaskXNXDBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CNT_CONTRACT_TASK_XNXDBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractTaskXNXDDTO extends ComsBaseFWDTO<CntContractTaskXNXDBO> {

	private Long cntContractTaskXNXDId;
	private Long cntContractId;
	private String catTaskName;
	private String catUnitName;
	private Double taskMass;
	private Long taskPrice;
	private Long totalMoney;
	private Double taskMassNow;
	private Long totalPriceNow;


    public Double getTaskMassNow() {
		return taskMassNow;
	}


	public void setTaskMassNow(Double taskMassNow) {
		this.taskMassNow = taskMassNow;
	}


	public Long getTotalPriceNow() {
		return totalPriceNow;
	}


	public void setTotalPriceNow(Long totalPriceNow) {
		this.totalPriceNow = totalPriceNow;
	}


	@Override
    public CntContractTaskXNXDBO toModel() {
    	CntContractTaskXNXDBO cntContractTaskXNXDBO = new CntContractTaskXNXDBO();
    	cntContractTaskXNXDBO.setCntContractTaskXNXDId(this.cntContractTaskXNXDId);
    	cntContractTaskXNXDBO.setCntContractId(this.cntContractId);
    	cntContractTaskXNXDBO.setCatTaskName(this.catTaskName);
    	cntContractTaskXNXDBO.setCatUnitName(this.catUnitName);
    	cntContractTaskXNXDBO.setTaskMass(this.taskMass);
    	cntContractTaskXNXDBO.setTaskPrice(this.taskPrice);
    	cntContractTaskXNXDBO.setTotalMoney(this.totalMoney);
        return cntContractTaskXNXDBO;
    }


	public Long getCntContractTaskXNXDId() {
		return cntContractTaskXNXDId;
	}


	public void setCntContractTaskXNXDId(Long cntContractTaskXNXDId) {
		this.cntContractTaskXNXDId = cntContractTaskXNXDId;
	}


	public Long getCntContractId() {
		return cntContractId;
	}


	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}


	public String getCatTaskName() {
		return catTaskName;
	}


	public void setCatTaskName(String catTaskName) {
		this.catTaskName = catTaskName;
	}


	public String getCatUnitName() {
		return catUnitName;
	}


	public void setCatUnitName(String catUnitName) {
		this.catUnitName = catUnitName;
	}

	public Double getTaskMass() {
		return taskMass;
	}


	public void setTaskMass(Double taskMass) {
		this.taskMass = taskMass;
	}


	public Long getTaskPrice() {
		return taskPrice;
	}


	public void setTaskPrice(Long taskPrice) {
		this.taskPrice = taskPrice;
	}


	public Long getTotalMoney() {
		return totalMoney;
	}


	public void setTotalMoney(Long totalMoney) {
		this.totalMoney = totalMoney;
	}


	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

   	
}
