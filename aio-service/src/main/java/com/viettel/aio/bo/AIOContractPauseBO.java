package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractPauseDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190927_start
@Entity
@Table(name = "AIO_CONTRACT_PAUSE")
public class AIOContractPauseBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONTRACT_PAUSE_SEQ")})
    @Column(name = "CONTRACT_PAUSE_ID", length = 10)
    private Long contractPauseId;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "APPOINTMENT_DATE", length = 22)
    private Date appointmentDate;
    @Column(name = "STATUS", length = 2)
    private Long status;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "UPDATED_USER", length = 10)
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
    public BaseFWDTOImpl toDTO() {
        AIOContractPauseDTO dto = new AIOContractPauseDTO();
        dto.setContractPauseId(this.getContractPauseId());
        dto.setContractId(this.getContractId());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setAppointmentDate(this.getAppointmentDate());
        dto.setStatus(this.getStatus());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setUpdatedUser(this.getUpdatedUser());
        return dto;
    }
}
