package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "AIO_STAFF_PLAN_INFO_DTO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStaffPlanInfoDTO {
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<AIOStaffPlanDTO> getAioStaffPlanDTOS() {
        return aioStaffPlanDTOS;
    }

    public void setAioStaffPlanDTOS(List<AIOStaffPlanDTO> aioStaffPlanDTOS) {
        this.aioStaffPlanDTOS = aioStaffPlanDTOS;
    }

    private String month;
    private String year;
    private String note;
    private List<AIOStaffPlanDTO> aioStaffPlanDTOS;
}
