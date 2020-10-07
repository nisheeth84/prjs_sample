package com.viettel.aio.request.staff.plan;

import com.viettel.aio.dto.AIOStaffPlanInfoDTO;
import com.viettel.aio.request.RequestBase;

public class RequestStaffPlan extends RequestBase {
    public String getPathFile() {
        return pathFile;
    }

    public void setPathFile(String pathFile) {
        this.pathFile = pathFile;
    }

    private String pathFile;


    public AIOStaffPlanInfoDTO getAioStaffPlanInfoDTO() {
        return aioStaffPlanInfoDTO;
    }

    public void setAioStaffPlanInfoDTO(AIOStaffPlanInfoDTO aioStaffPlanInfoDTO) {
        this.aioStaffPlanInfoDTO = aioStaffPlanInfoDTO;
    }

    private AIOStaffPlanInfoDTO aioStaffPlanInfoDTO;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

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

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    private int status;
    private String month;
    private String year;
    private int page;
    private int pageSize;

}
