package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractPerformDateBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190927_create
@XmlRootElement(name = "AIO_CONTRACT_PERFORM_DATEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOContractPerformDateDTO extends ComsBaseFWDTO<AIOContractPerformDateBO> {

    private Long contractPerformDateId;
    private Long contractId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
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
    public AIOContractPerformDateBO toModel() {
        AIOContractPerformDateBO bo = new AIOContractPerformDateBO();
        bo.setContractPerformDateId(this.getContractPerformDateId());
        bo.setContractId(this.getContractId());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return contractPerformDateId;
    }

    @Override
    public String catchName() {
        return contractPerformDateId.toString();
    }
}
