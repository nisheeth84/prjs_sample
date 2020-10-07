package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractOrderDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractOrderBO")
@Table(name = "CNT_CONTRACT_ORDER")
/**
 *
 * @author: hailh10
 */
public class CntContractOrderBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_ORDER_SEQ") })
	@Column(name = "CNT_CONTRACT_ORDER_ID", length = 22)
	private Long cntContractOrderId;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	@Column(name = "PURCHASE_ORDER_ID", length = 22)
	private Long purchaseOrderId;


	public Long getCntContractOrderId(){
		return cntContractOrderId;
	}

	public void setCntContractOrderId(Long cntContractOrderId)
	{
		this.cntContractOrderId = cntContractOrderId;
	}

	public Long getCntContractId(){
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId)
	{
		this.cntContractId = cntContractId;
	}

	public Long getPurchaseOrderId(){
		return purchaseOrderId;
	}

	public void setPurchaseOrderId(Long purchaseOrderId)
	{
		this.purchaseOrderId = purchaseOrderId;
	}
   
    @Override
    public CntContractOrderDTO toDTO() {
        CntContractOrderDTO cntContractOrderDTO = new CntContractOrderDTO();
        cntContractOrderDTO.setCntContractOrderId(this.cntContractOrderId);		
        cntContractOrderDTO.setCntContractId(this.cntContractId);		
        cntContractOrderDTO.setPurchaseOrderId(this.purchaseOrderId);		
        return cntContractOrderDTO;
    }
}
