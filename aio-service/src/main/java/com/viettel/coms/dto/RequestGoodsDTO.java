package com.viettel.coms.dto;

import com.viettel.coms.bo.RequestGoodsBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190401_created
@XmlRootElement(name = "REQUEST_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestGoodsDTO extends ComsBaseFWDTO<RequestGoodsBO> {

    @Override
    public RequestGoodsBO toModel() {
        RequestGoodsBO bo = new RequestGoodsBO();
        bo.setRequestGoodsId(this.getRequestGoodsId());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setCatProvinceId(this.getCatProvinceId());
        bo.setConstructionId(this.getConstructionId());
        bo.setConstructionCode(this.getConstructionCode());
        bo.setCntContractId(this.getCntContractId());
        bo.setCntContractCode(this.getCntContractCode());
        bo.setRequestContent(this.getRequestContent());
        bo.setReceiveDate(this.getReceiveDate());
        bo.setObjectId(this.getObjectId());
        bo.setStatus(this.getStatus());
        bo.setSendDate(this.getSendDate());
        bo.setIsOrder(this.getIsOrder());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUserId(this.getCreatedUserId());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setUpdateUserId(this.getUpdateUserId());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return requestGoodsId;
    }

    @Override
    public String catchName() {
        return requestGoodsId.toString();
    }

    private Long requestGoodsId;
    private Long sysGroupId;
    private Long catProvinceId;
    private Long constructionId;
    private String constructionCode;
    private Long cntContractId;
    private String cntContractCode;
    private String requestContent;
    private Date receiveDate;
    private Long objectId;
    private Long status;
    private Date sendDate;
    private Long isOrder;
    private Date createdDate;
    private Long createdUserId;
    private Date updateDate;
    private Long updateUserId;
//    hoangnh38_20190125_start
    private String description;
	private String sysGroupName;
	
//	hoangnh38_20190125_end

    public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	// dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;

    private List<RequestGoodsDetailDTO> requestGoodsDetailList;

    private Long assignHandoverId;

    private Long isDesign;

    //VietNT_20190125_start
    private String catProvinceCode;

    private String catStationCode;

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    //VietNT_end

    public Long getAssignHandoverId() {
        return assignHandoverId;
    }

    public void setAssignHandoverId(Long assignHandoverId) {
        this.assignHandoverId = assignHandoverId;
    }

    public Long getIsDesign() {
        return isDesign;
    }

    public void setIsDesign(Long isDesign) {
        this.isDesign = isDesign;
    }

    public List<RequestGoodsDetailDTO> getRequestGoodsDetailList() {
        return requestGoodsDetailList;
    }

    public void setRequestGoodsDetailList(List<RequestGoodsDetailDTO> requestGoodsDetailList) {
        this.requestGoodsDetailList = requestGoodsDetailList;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    public Long getRequestGoodsId() {
        return requestGoodsId;
    }

    public void setRequestGoodsId(Long requestGoodsId) {
        this.requestGoodsId = requestGoodsId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

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

    public String getRequestContent() {
        return requestContent;
    }

    public void setRequestContent(String requestContent) {
        this.requestContent = requestContent;
    }

    public Date getReceiveDate() {
        return receiveDate;
    }

    public void setReceiveDate(Date receiveDate) {
        this.receiveDate = receiveDate;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getSendDate() {
        return sendDate;
    }

    public void setSendDate(Date sendDate) {
        this.sendDate = sendDate;
    }

    public Long getIsOrder() {
        return isOrder;
    }

    public void setIsOrder(Long isOrder) {
        this.isOrder = isOrder;
    }

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

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Long getUpdateUserId() {
        return updateUserId;
    }

    public void setUpdateUserId(Long updateUserId) {
        this.updateUserId = updateUserId;
    }
}
