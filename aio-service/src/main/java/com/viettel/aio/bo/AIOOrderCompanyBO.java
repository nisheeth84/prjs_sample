package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderCompanyDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190903_start
@Entity
@Table(name = "AIO_ORDER_COMPANY")
public class AIOOrderCompanyBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_COMPANY_SEQ")})
    @Column(name = "ORDER_COMPANY_ID", length = 10)
    private Long orderCompanyId;
    @Column(name = "ORDER_COMPANY_CODE", length = 500)
    private String orderCompanyCode;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "SIGN_STATE", length = 1)
    private Long signState;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
//    @Column(name = "CREATED_ID", length = 10)
//    private Long createdId;
//    @Column(name = "CANCEL_DESCRIPTION", length = 1000)
//    private String cancelDescription;
//    @Column(name = "CANCEL_USER_ID", length = 10)
//    private Long cancelUserId;

    //Huypq-20190924-start
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "UPDATE_DATE", length = 10)
    private Date updateDate;
    @Column(name = "UPDATE_USER", length = 10)
    private Long updateUser;
    
    public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	//Huy-end
    public Long getOrderCompanyId() {
        return orderCompanyId;
    }

    public void setOrderCompanyId(Long orderCompanyId) {
        this.orderCompanyId = orderCompanyId;
    }

    public String getOrderCompanyCode() {
        return orderCompanyCode;
    }

    public void setOrderCompanyCode(String orderCompanyCode) {
        this.orderCompanyCode = orderCompanyCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSignState() {
        return signState;
    }

    public void setSignState(Long signState) {
        this.signState = signState;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderCompanyDTO dto = new AIOOrderCompanyDTO();
        dto.setOrderCompanyId(this.getOrderCompanyId());
        dto.setOrderCompanyCode(this.getOrderCompanyCode());
        dto.setStatus(this.getStatus());
        dto.setSignState(this.getSignState());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUser(this.createdUser);
        dto.setUpdateDate(this.updateDate);
        dto.setUpdateUser(this.updateUser);
        return dto;
    }
}
