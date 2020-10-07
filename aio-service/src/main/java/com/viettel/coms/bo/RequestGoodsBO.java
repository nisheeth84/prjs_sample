package com.viettel.coms.bo;

import com.viettel.coms.dto.RequestGoodsDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190401_created
@Entity
@Table(name = "REQUEST_GOODS")
public class RequestGoodsBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "REQUEST_GOODS_SEQ")})
    @Column(name = "REQUEST_GOODS_ID", length = 10)
    private Long requestGoodsId;
    @Column(name = "SYS_GROUP_ID", length = 10)
    private Long sysGroupId;
    @Column(name = "CAT_PROVINCE_ID", length = 10)
    private Long catProvinceId;
    @Column(name = "CONSTRUCTION_ID", length = 10)
    private Long constructionId;
    @Column(name = "CONSTRUCTION_CODE", length = 20)
    private String constructionCode;
    @Column(name = "CNT_CONTRACT_ID", length = 10)
    private Long cntContractId;
    @Column(name = "CNT_CONTRACT_CODE", length = 20)
    private String cntContractCode;
    @Column(name = "REQUEST_CONTENT", length = 40)
    private String requestContent;
    @Column(name = "RECEIVE_DATE", length = 22)
    private Date receiveDate;
    @Column(name = "OBJECT_ID", length = 10)
    private Long objectId;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "SEND_DATE", length = 22)
    private Date sendDate;
    @Column(name = "IS_ORDER", length = 1)
    private Long isOrder;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_USER_ID", length = 10)
    private Long createdUserId;
    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;
    @Column(name = "UPDATE_USER_ID", length = 10)
    private Long updateUserId;

    @Override
    public BaseFWDTOImpl toDTO() {
        RequestGoodsDTO dto = new RequestGoodsDTO();
        dto.setRequestGoodsId(this.getRequestGoodsId());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setCatProvinceId(this.getCatProvinceId());
        dto.setConstructionId(this.getConstructionId());
        dto.setConstructionCode(this.getConstructionCode());
        dto.setCntContractId(this.getCntContractId());
        dto.setCntContractCode(this.getCntContractCode());
        dto.setRequestContent(this.getRequestContent());
        dto.setReceiveDate(this.getReceiveDate());
        dto.setObjectId(this.getObjectId());
        dto.setStatus(this.getStatus());
        dto.setSendDate(this.getSendDate());
        dto.setIsOrder(this.getIsOrder());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUserId(this.getCreatedUserId());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setUpdateUserId(this.getUpdateUserId());
        return dto;
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
