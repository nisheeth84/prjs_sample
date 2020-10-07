package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractPerformDateDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190927_start
@Entity
@Table(name = "AIO_CONTRACT_PERFORM_DATE")
public class AIOContractPerformDateBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONTRACT_PERFORM_DATE_SEQ")})
    @Column(name = "CONTRACT_PERFORM_DATE_ID", length = 10)
    private Long contractPerformDateId;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;

    public Long getContractPerformDateId() {
        return contractPerformDateId;
    }

    public void setContractPerformDateId(Long contractPerformDateId) {
        this.contractPerformDateId = contractPerformDateId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOContractPerformDateDTO dto = new AIOContractPerformDateDTO();
        dto.setContractPerformDateId(this.getContractPerformDateId());
        dto.setContractId(this.getContractId());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        return dto;
    }
}
