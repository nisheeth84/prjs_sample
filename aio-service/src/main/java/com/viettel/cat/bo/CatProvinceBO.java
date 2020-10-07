package com.viettel.cat.bo;

import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.CatProvinceBO")
@Table(name = "CAT_PROVINCE")
/**
 *
 * @author: hailh10
 */
public class CatProvinceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {@Parameter(name = "sequence", value = "CAT_PROVINCE_SEQ")})
    @Column(name = "CAT_PROVINCE_ID", length = 22)
    private java.lang.Long catProvinceId;
    @Column(name = "CODE", length = 100)
    private java.lang.String code;
    @Column(name = "NAME", length = 100)
    private java.lang.String name;
    @Column(name = "STATUS", length = 20)
    private java.lang.String status;


    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Override
    public CatProvinceDTO toDTO() {
        CatProvinceDTO catProvinceDTO = new CatProvinceDTO();
        catProvinceDTO.setCatProvinceId(this.catProvinceId);
        catProvinceDTO.setCode(this.code);
        catProvinceDTO.setName(this.name);
        catProvinceDTO.setStatus(this.status);
        return catProvinceDTO;
    }
}
