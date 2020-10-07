package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//StephenTrung_20191105_start
@Entity
@Table(name = "AIO_CATEGORY_PRODUCT")
public class AIOCategoryProductBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CATEGORY_PRODUCT_SEQ")})
    @Column(name = "CATEGORY_PRODUCT_ID", length = 10)
    private Long categoryProductId;
    @Column(name = "CODE", length = 200)
    private String code;
    @Column(name = "NAME", length = 500)
    private String name;
    @Column(name = "CREATE_USER", length = 10)
    private Long createUser;
    @Column(name = "CREATE_DATE", length = 22)
    private Date createDate;
    @Column(name = "STATUS", length = 1)
    private Long status;

    public Long getCategoryProductId() {
        return categoryProductId;
    }

    public void setCategoryProductId(Long categoryProductId) {
        this.categoryProductId = categoryProductId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOCategoryProductDTO dto = new AIOCategoryProductDTO();
        dto.setCategoryProductId(this.getCategoryProductId());
        dto.setCode(this.getCode());
        dto.setName(this.getName());
        dto.setCreateUser(this.getCreateUser());
        dto.setCreateDate(this.getCreateDate());
        dto.setStatus(this.getStatus());
        return dto;
    }
}
