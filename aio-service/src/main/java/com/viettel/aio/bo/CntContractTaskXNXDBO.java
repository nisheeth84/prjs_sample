package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractTaskXNXDDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.CntContractTaskXNXDBO")
@Table(name = "CNT_CONTRACT_TASK_XNXD")
/**
 *
 * @author: tatph
 */
public class CntContractTaskXNXDBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_TASK_XNXD_SEQ") })
	@Column(name = "CNT_CONTRACT_TASK_XNXD_ID", length = 22)
	private Long cntContractTaskXNXDId;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	@Column(name = "CAT_TASK_NAME", length = 1000)
	private String catTaskName;
	@Column(name = "CAT_UNIT_NAME", length = 50)
	private String catUnitName;
	@Column(name = "TASK_MASS", length = 22)
	private Double taskMass;
	@Column(name = "TASK_PRICE", length = 22)
	private Long taskPrice;
	@Column(name = "TOTAL_MONEY", length = 22)
	private Long totalMoney;



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
    public CntContractTaskXNXDDTO toDTO() {
		CntContractTaskXNXDDTO cntContractTaskXNXDDTO= new CntContractTaskXNXDDTO(); 
		cntContractTaskXNXDDTO.setCntContractTaskXNXDId(this.cntContractTaskXNXDId);
        cntContractTaskXNXDDTO.setCntContractId(this.cntContractId);
    	cntContractTaskXNXDDTO.setCatTaskName(this.catTaskName);
    	cntContractTaskXNXDDTO.setCatUnitName(this.catUnitName);
    	cntContractTaskXNXDDTO.setTaskMass(this.taskMass);
    	cntContractTaskXNXDDTO.setTaskPrice(this.taskPrice);
    	cntContractTaskXNXDDTO.setTotalMoney(this.totalMoney);
        return cntContractTaskXNXDDTO;
    }
}
