package com.viettel.cat.bo;

import com.viettel.cat.dto.CatManufacturerDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.CatManufacturerBO")
@Table(name = "CAT_MANUFACTURER")
/**
 *
 * @author: hailh10
 */
public class CatManufacturerBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {@Parameter(name = "sequence", value = "CAT_MANUFACTURER_SEQ")})
    @Column(name = "CAT_MANUFACTURER_ID", length = 22)
    private java.lang.Long catManufacturerId;
    @Column(name = "CODE", length = 100)
    private java.lang.String code;
    @Column(name = "NAME", length = 100)
    private java.lang.String name;
    @Column(name = "STATUS", length = 20)
    private java.lang.String status;


    public java.lang.Long getCatManufacturerId() {
        return catManufacturerId;
    }

    public void setCatManufacturerId(java.lang.Long catManufacturerId) {
        this.catManufacturerId = catManufacturerId;
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
    public CatManufacturerDTO toDTO() {
        CatManufacturerDTO catManufacturerDTO = new CatManufacturerDTO();
        catManufacturerDTO.setCatManufacturerId(this.catManufacturerId);
        catManufacturerDTO.setCode(this.code);
        catManufacturerDTO.setName(this.name);
        catManufacturerDTO.setStatus(this.status);
        return catManufacturerDTO;
    }
}
