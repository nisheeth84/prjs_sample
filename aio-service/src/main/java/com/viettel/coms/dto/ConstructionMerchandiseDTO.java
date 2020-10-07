/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionMerchandiseBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONSTRUCTION_MERCHANDISEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionMerchandiseDTO extends ComsBaseFWDTO<ConstructionMerchandiseBO> {

    private java.lang.Long constructionMerchandiseId;
    private java.lang.String goodsName;
    private java.lang.String goodsCode;
    private java.lang.String goodsUnitName;
    private java.lang.String type;
    private java.lang.Long goodsId;
    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.Double remainCount;
    private java.lang.Long constructionId;
    private java.lang.String goodsIsSerial;
    private java.lang.String serial;
    private java.lang.String errorFilePath;
    private java.lang.Long workItemId;
    //chinhpxn20180620
    private java.lang.Double slConLai;
//chinhpxn20180620
    //Huypq-start
    private Double merchandiseQuantity;
    private String serialMerchan;
    private String merchanType;
    private List<WorkItemDTO> listDataWorkItem;
    
    public List<WorkItemDTO> getListDataWorkItem() {
		return listDataWorkItem;
	}

	public void setListDataWorkItem(List<WorkItemDTO> listDataWorkItem) {
		this.listDataWorkItem = listDataWorkItem;
	}

	public String getMerchanType() {
		return merchanType;
	}

	public void setMerchanType(String merchanType) {
		this.merchanType = merchanType;
	}

	public String getSerialMerchan() {
		return serialMerchan;
	}

	public void setSerialMerchan(String serialMerchan) {
		this.serialMerchan = serialMerchan;
	}

	public Double getMerchandiseQuantity() {
		return merchandiseQuantity;
	}

	public void setMerchandiseQuantity(Double merchandiseQuantity) {
		this.merchandiseQuantity = merchandiseQuantity;
	}
	//Huypq-end
	@Override
    public ConstructionMerchandiseBO toModel() {
        ConstructionMerchandiseBO constructionMerchandiseBO = new ConstructionMerchandiseBO();
        constructionMerchandiseBO.setConstructionMerchandiseId(this.constructionMerchandiseId);
        constructionMerchandiseBO.setGoodsName(this.goodsName);
        constructionMerchandiseBO.setGoodsCode(this.goodsCode);
        constructionMerchandiseBO.setGoodsUnitName(this.goodsUnitName);
        constructionMerchandiseBO.setType(this.type);
        constructionMerchandiseBO.setGoodsId(this.goodsId);
        constructionMerchandiseBO.setMerEntityId(this.merEntityId);
        constructionMerchandiseBO.setQuantity(this.quantity);
        constructionMerchandiseBO.setRemainCount(this.remainCount);
        constructionMerchandiseBO.setConstructionId(this.constructionId);
        constructionMerchandiseBO.setGoodsIsSerial(this.goodsIsSerial);
        constructionMerchandiseBO.setSerial(this.serial);
        constructionMerchandiseBO.setWorkItemId(this.workItemId);
        return constructionMerchandiseBO;
    }

    @Override
    public Long getFWModelId() {
        return constructionMerchandiseId;
    }

    @Override
    public String catchName() {
        return getConstructionMerchandiseId().toString();
    }

    public java.lang.Long getConstructionMerchandiseId() {
        return constructionMerchandiseId;
    }

    public void setConstructionMerchandiseId(java.lang.Long constructionMerchandiseId) {
        this.constructionMerchandiseId = constructionMerchandiseId;
    }

    public java.lang.String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    public java.lang.Double getRemainCount() {
        return remainCount;
    }

    public void setRemainCount(java.lang.Double remainCount) {
        this.remainCount = remainCount;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(java.lang.String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    // chinhpxn20180620
    public java.lang.Double getSlConLai() {
        return slConLai;
    }

    public void setSlConLai(java.lang.Double slConLai) {
        this.slConLai = slConLai;
    }
    // chinhpxn20180620

}
