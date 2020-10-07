package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractPauseBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190927_create
@XmlRootElement(name = "AIO_CONTRACT_PAUSEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOContractPauseDTO extends ComsBaseFWDTO<AIOContractPauseBO> {

    public static Long STATUS_PENDING = 1L;
    public static Long STATUS_APPROVED = 2L;
    public static Long STATUS_DENIED = 3L;

    private Long contractPauseId;
    private Long contractId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date appointmentDate;
    private Long status;
    private Long createdUser;
    private Long updatedUser;

    public Long getContractPauseId() {
        return contractPauseId;
    }

    public void setContractPauseId(Long contractPauseId) {
        this.contractPauseId = contractPauseId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    @Override
    public AIOContractPauseBO toModel() {
        AIOContractPauseBO bo = new AIOContractPauseBO();
        bo.setContractPauseId(this.getContractPauseId());
        bo.setContractId(this.getContractId());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setAppointmentDate(this.getAppointmentDate());
        bo.setStatus(this.getStatus());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setUpdatedUser(this.getUpdatedUser());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return contractPauseId;
    }

    @Override
    public String catchName() {
        return contractPauseId.toString();
    }
}
