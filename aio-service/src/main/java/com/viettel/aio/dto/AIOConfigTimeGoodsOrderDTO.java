package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOConfigTimeGoodsOrderBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190604_create
@XmlRootElement(name = "AIO_CONFIG_TIME_GOODS_ORDERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOConfigTimeGoodsOrderDTO extends ComsBaseFWDTO<AIOConfigTimeGoodsOrderBO> {

    private Long configTimeGoodsOrderId;
    private String code;
    private String content;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private Date createDate;
    private Long createdUser;
    private Date updatedDate;
    private Long updatedUser;

    public Long getConfigTimeGoodsOrderId() {
        return configTimeGoodsOrderId;
    }

    public void setConfigTimeGoodsOrderId(Long configTimeGoodsOrderId) {
        this.configTimeGoodsOrderId = configTimeGoodsOrderId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    @Override
    public AIOConfigTimeGoodsOrderBO toModel() {
        AIOConfigTimeGoodsOrderBO bo = new AIOConfigTimeGoodsOrderBO();
        bo.setConfigTimeGoodsOrderId(this.getConfigTimeGoodsOrderId());
        bo.setCode(this.getCode());
        bo.setContent(this.getContent());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setCreateDate(this.getCreateDate());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setUpdatedDate(this.getUpdatedDate());
        bo.setUpdatedUser(this.getUpdatedUser());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return configTimeGoodsOrderId;
    }

    @Override
    public String catchName() {
        return configTimeGoodsOrderId.toString();
    }
}
