package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOReglectDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "AIO_REGLECT_DETAIL")
public class AIOReglectDetailBO extends BaseFWModelImpl {
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_REGLECT_DETAIL_SEQ")})
    @Column(name = "AIO_REGLECT_DETAIL_ID")
    private Long aioReglectDetailId;
    @Column(name = "AIO_REGLECT_ID")
    private Long aioReglectId;
    @Column(name = "SERVICE_TYPE")
    private Long serviceType;
    @Column(name = "PERFORMER_ID")
    private Long performerId;
    @Column(name = "START_DATE")
    private Date startDate;
    @Column(name = "END_DATE")
    private Date endDate;
    @Column(name = "ACTUAL_START_DATE")
    private Date actualStartDate;
    @Column(name = "ACTUAL_END_DATE")
    private Date actualEndDate;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "EXPERT_DATE")
    private Date expertDate;
    @Column(name = "APPROVED_EXPERT_DATE")
    private Date approvedExpertDate;
    @Column(name = "REASON")
    private String reason;
    @Column(name = "DESCRIPTION_STAFF")
    private String descriptionStaff;


    public Long getAioReglectDetailId() {
        return aioReglectDetailId;
    }

    public void setAioReglectDetailId(Long aioReglectDetailId) {
        this.aioReglectDetailId = aioReglectDetailId;
    }

    public Long getAioReglectId() {
        return aioReglectId;
    }

    public void setAioReglectId(Long aioReglectId) {
        this.aioReglectId = aioReglectId;
    }

    public Long getServiceType() {
        return serviceType;
    }

    public void setServiceType(Long serviceType) {
        this.serviceType = serviceType;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
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

    public Date getActualStartDate() {
        return actualStartDate;
    }

    public void setActualStartDate(Date actualStartDate) {
        this.actualStartDate = actualStartDate;
    }

    public Date getActualEndDate() {
        return actualEndDate;
    }

    public void setActualEndDate(Date actualEndDate) {
        this.actualEndDate = actualEndDate;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getExpertDate() {
        return expertDate;
    }

    public void setExpertDate(Date expertDate) {
        this.expertDate = expertDate;
    }

    public Date getApprovedExpertDate() {
        return approvedExpertDate;
    }

    public void setApprovedExpertDate(Date approvedExpertDate) {
        this.approvedExpertDate = approvedExpertDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescriptionStaff() {
        return descriptionStaff;
    }

    public void setDescriptionStaff(String descriptionStaff) {
        this.descriptionStaff = descriptionStaff;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOReglectDetailDTO aioReglectDetailDTO = new AIOReglectDetailDTO();
        aioReglectDetailDTO.setAioReglectDetailId(this.getAioReglectDetailId());
        aioReglectDetailDTO.setAioReglectId(this.getAioReglectId());
        aioReglectDetailDTO.setServiceType(this.getServiceType());
        aioReglectDetailDTO.setPerformerId(this.getPerformerId());
        aioReglectDetailDTO.setStartDate(this.getStartDate());
        aioReglectDetailDTO.setEndDate(this.getEndDate());
        aioReglectDetailDTO.setActualStartDate(this.getActualStartDate());
        aioReglectDetailDTO.setActualEndDate(this.getActualEndDate());
        aioReglectDetailDTO.setStatus(this.getStatus());
        aioReglectDetailDTO.setExpertDate(this.getExpertDate());
        aioReglectDetailDTO.setApprovedExpertDate(this.getApprovedExpertDate());
        aioReglectDetailDTO.setReason(this.getReason());
        aioReglectDetailDTO.setDescriptionStaff(this.getDescriptionStaff());
        return aioReglectDetailDTO;
    }
}
