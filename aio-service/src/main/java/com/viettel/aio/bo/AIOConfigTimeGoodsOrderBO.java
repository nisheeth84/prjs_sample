package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOConfigTimeGoodsOrderDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190604_start
@Entity
@Table(name = "AIO_CONFIG_TIME_GOODS_ORDER")
public class AIOConfigTimeGoodsOrderBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONFIG_TIME_GOODS_ORDER_SEQ")})
    @Column(name = "CONFIG_TIME_GOODS_ORDER_ID", length = 10)
    private Long configTimeGoodsOrderId;
    @Column(name = "CODE", length = 20)
    private String code;
    @Column(name = "CONTENT", length = 50)
    private String content;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "CREATE_DATE", length = 22)
    private Date createDate;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;
    @Column(name = "UPDATED_USER", length = 10)
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
    public BaseFWDTOImpl toDTO() {
        AIOConfigTimeGoodsOrderDTO dto = new AIOConfigTimeGoodsOrderDTO();
        dto.setConfigTimeGoodsOrderId(this.getConfigTimeGoodsOrderId());
        dto.setCode(this.getCode());
        dto.setContent(this.getContent());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setCreateDate(this.getCreateDate());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setUpdatedDate(this.getUpdatedDate());
        dto.setUpdatedUser(this.getUpdatedUser());
        return dto;
    }
}
