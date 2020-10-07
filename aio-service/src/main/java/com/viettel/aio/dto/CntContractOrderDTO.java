package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractOrderBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CNT_CONTRACT_ORDERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractOrderDTO extends ComsBaseFWDTO<CntContractOrderBO> {

	private Long cntContractOrderId;
	private Long cntContractId;
	private String cntContractName;
	private Long purchaseOrderId;
	private String purchaseOrderName;


    @Override
    public CntContractOrderBO toModel() {
        CntContractOrderBO cntContractOrderBO = new CntContractOrderBO();
        cntContractOrderBO.setCntContractOrderId(this.cntContractOrderId);
        cntContractOrderBO.setCntContractId(this.cntContractId);
        cntContractOrderBO.setPurchaseOrderId(this.purchaseOrderId);
        return cntContractOrderBO;
    }

    @Override
     public Long getFWModelId() {
        return cntContractOrderId;
    }

    @Override
    public String catchName() {
        return getCntContractOrderId().toString();
    }

	@JsonProperty("cntContractOrderId")
    public Long getCntContractOrderId(){
		return cntContractOrderId;
    }

    public void setCntContractOrderId(Long cntContractOrderId){
		this.cntContractOrderId = cntContractOrderId;
    }

	@JsonProperty("cntContractId")
    public Long getCntContractId(){
		return cntContractId;
    }

    public void setCntContractId(Long cntContractId){
		this.cntContractId = cntContractId;
    }

	@JsonProperty("cntContractName")
    public String getCntContractName(){
		return cntContractName;
    }

    public void setCntContractName(String cntContractName){
		this.cntContractName = cntContractName;
    }

	@JsonProperty("purchaseOrderId")
    public Long getPurchaseOrderId(){
		return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId){
		this.purchaseOrderId = purchaseOrderId;
    }

	@JsonProperty("purchaseOrderName")
    public String getPurchaseOrderName(){
		return purchaseOrderName;
    }

    public void setPurchaseOrderName(String purchaseOrderName){
		this.purchaseOrderName = purchaseOrderName;
    }	

	

}
