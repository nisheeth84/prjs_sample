package com.viettel.cat.bo;

import com.viettel.cat.dto.CatProducingCountryDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.CatProducingCountryBO")
@Table(name = "CAT_PRODUCING_COUNTRY")
/**
 *
 * @author: hailh10
 */
public class CatProducingCountryBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {@Parameter(name = "sequence", value = "CAT_PRODUCING_COUNTRY_SEQ")})
    @Column(name = "CAT_PRODUCING_COUNTRY_ID", length = 22)
    private java.lang.Long catProducingCountryId;
    @Column(name = "CODE", length = 100)
    private java.lang.String code;
    @Column(name = "NAME", length = 100)
    private java.lang.String name;
    @Column(name = "STATUS", length = 20)
    private java.lang.String status;


    public java.lang.Long getCatProducingCountryId() {
        return catProducingCountryId;
    }

    public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
        this.catProducingCountryId = catProducingCountryId;
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
    public CatProducingCountryDTO toDTO() {
        CatProducingCountryDTO catProducingCountryDTO = new CatProducingCountryDTO();
        catProducingCountryDTO.setCatProducingCountryId(this.catProducingCountryId);
        catProducingCountryDTO.setCode(this.code);
        catProducingCountryDTO.setName(this.name);
        catProducingCountryDTO.setStatus(this.status);
        return catProducingCountryDTO;
    }
}
