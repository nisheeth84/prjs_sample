package com.viettel.coms.dto;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.coms.bo.RequestGoodsDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190401_created
@XmlRootElement(name = "REQUEST_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestGoodsDetailDTO extends ComsBaseFWDTO<RequestGoodsDetailBO> {
    @Override
    public RequestGoodsDetailBO toModel() {
        RequestGoodsDetailBO bo = new RequestGoodsDetailBO();
        bo.setRequestGoodsDetailId(this.getRequestGoodsDetailId());
        bo.setRequestGoodsId(this.getRequestGoodsId());
        bo.setGoodsName(this.getGoodsName());
        bo.setSuggestDate(this.getSuggestDate());
        bo.setCatUnitId(this.getCatUnitId());
        bo.setCatUnitName(this.getCatUnitName());
        bo.setQuantity(this.getQuantity());
        bo.setDescription(this.getDescription());

        return bo;
    }

    @Override
    public Long getFWModelId() {
        return requestGoodsDetailId;
    }

    @Override
    public String catchName() {
        return requestGoodsDetailId.toString();
    }

    private Long requestGoodsDetailId;
    private Long requestGoodsId;
    private String goodsName;
    private Date suggestDate;
    private Long catUnitId;
    private String catUnitName;
    private Double quantity;
    private String description;

    //dto only
    private String catUnitCode;
//    hoangnh38_20190125_start
    private Long constructionId;
	private String constructionCode;
	private Long cntContractId;
	private String cntContractCode;
	
	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	//	hoangnh38_20190125_end
    public String getCatUnitCode() {
        return catUnitCode;
    }

    public void setCatUnitCode(String catUnitCode) {
        this.catUnitCode = catUnitCode;
    }
    //end dto only

    public Long getRequestGoodsDetailId() {
        return requestGoodsDetailId;
    }

    public void setRequestGoodsDetailId(Long requestGoodsDetailId) {
        this.requestGoodsDetailId = requestGoodsDetailId;
    }

    public Long getRequestGoodsId() {
        return requestGoodsId;
    }

    public void setRequestGoodsId(Long requestGoodsId) {
        this.requestGoodsId = requestGoodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Date getSuggestDate() {
        return suggestDate;
    }

    public void setSuggestDate(Date suggestDate) {
        this.suggestDate = suggestDate;
    }

    public Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    public String getCatUnitName() {
        return catUnitName;
    }

    public void setCatUnitName(String catUnitName) {
        this.catUnitName = catUnitName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
