package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderBranchDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190824_start
@Entity
@Table(name = "AIO_ORDER_BRANCH")
public class AIOOrderBranchBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_BRANCH_SEQ")})
    @Column(name = "ORDER_BRANCH_ID", length = 10)
    private Long orderBranchId;
    @Column(name = "ORDER_BRANCH_CODE", length = 200)
    private String orderBranchCode;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_ID", length = 10)
    private Long createdId;
    @Column(name = "SYS_GROUP_ID", length = 10)
    private Long sysGroupId;
    @Column(name = "SYS_GROUP_NAME", length = 500)
    private String sysGroupName;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 1)
    private Long isProvinceBought;
    @Column(name = "SIGN_STATE", length = 1)
    private Long signState;
//    //Huypq-20190922-start
//    @Column(name = "ORDER_REQUEST_ID")
//    private Long orderRequestId;
//
//    public Long getOrderRequestId() {
//		return orderRequestId;
//	}
//
//	public void setOrderRequestId(Long orderRequestId) {
//		this.orderRequestId = orderRequestId;
//	}
//	//huy-end
	public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getSignState() {
        return signState;
    }

    public void setSignState(Long signState) {
        this.signState = signState;
    }

    public Long getOrderBranchId() {
        return orderBranchId;
    }

    public void setOrderBranchId(Long orderBranchId) {
        this.orderBranchId = orderBranchId;
    }

    public String getOrderBranchCode() {
        return orderBranchCode;
    }

    public void setOrderBranchCode(String orderBranchCode) {
        this.orderBranchCode = orderBranchCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedId() {
        return createdId;
    }

    public void setCreatedId(Long createdId) {
        this.createdId = createdId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderBranchDTO dto = new AIOOrderBranchDTO();
        dto.setOrderBranchId(this.getOrderBranchId());
        dto.setOrderBranchCode(this.getOrderBranchCode());
        dto.setStatus(this.getStatus());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedId(this.getCreatedId());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        dto.setSignState(this.getSignState());
//        dto.setOrderRequestId(this.orderRequestId);
        return dto;
    }
}
