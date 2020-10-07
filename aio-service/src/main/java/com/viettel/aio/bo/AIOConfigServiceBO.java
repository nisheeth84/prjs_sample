package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_CONFIG_SERVICE")
public class AIOConfigServiceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONFIG_SERVICE_SEQ")})
    @Column(name = "AIO_CONFIG_SERVICE_ID", length = 10)
    private Long aioConfigServiceId;
    @Column(name = "CODE", length = 50)
    private String code;
    @Column(name = "NAME", length = 50)
    private String name;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "STATUS", length = 1)
    private String status;
    @Column(name = "INDUSTRY_ID", length = 1)
    private Long industryId;
    @Column(name = "INDUSTRY_CODE", length = 1)
    private String industryCode;
    @Column(name = "INDUSTRY_NAME", length = 1)
    private String industryName;
    @Column(name = "SCALE", length = 1)
    private Double scale;

    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
    public BaseFWDTOImpl toDTO() {
        AIOConfigServiceDTO dto = new AIOConfigServiceDTO();
        dto.setAioConfigServiceId(this.getAioConfigServiceId());
        dto.setCode(this.getCode());
        dto.setName(this.getName());
        dto.setType(this.getType());
        dto.setStatus(this.status);
        dto.setIndustryId(this.getIndustryId());
        dto.setIndustryCode(this.getIndustryCode());
        dto.setIndustryName(this.getIndustryName());
        dto.setScale(this.getScale());
        return dto;
    }

    public Long getIndustryId() {
        return industryId;
    }

    public void setIndustryId(Long industryId) {
        this.industryId = industryId;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    public Double getScale() {
        return scale;
    }

    public void setScale(Double scale) {
        this.scale = scale;
    }

    public Long getAioConfigServiceId() {
        return aioConfigServiceId;
    }

    public void setAioConfigServiceId(Long aioConfigServiceId) {
        this.aioConfigServiceId = aioConfigServiceId;
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

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }
}
