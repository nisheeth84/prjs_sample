package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class ConstructionScheduleDTOResponse {

    private SysUserRequest sysUser;
    private ResultInfo resultInfo;
    private List<ConstructionScheduleDTO> listConstructionScheduleRealizationDTO;
    private List<ConstructionScheduleDTO> listConstructionSchedulePartnerDTO;
    private List<ConstructionScheduleDTO> listConstructionScheduleDirectorByDTO;
    private List<ConstructionScheduleItemDTO> listConstructionScheduleItemDTO;
    private List<ConstructionScheduleWorkItemDTO> listConstructionScheduleWorkItemDTO;
    private String slowSchedule;

    public SysUserRequest getSysUser() {
        return sysUser;
    }

    public void setSysUser(SysUserRequest sysUser) {
        this.sysUser = sysUser;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<ConstructionScheduleDTO> getListConstructionScheduleRealizationDTO() {
        return listConstructionScheduleRealizationDTO;
    }

    public void setListConstructionScheduleRealizationDTO(
            List<ConstructionScheduleDTO> listConstructionScheduleRealizationDTO) {
        this.listConstructionScheduleRealizationDTO = listConstructionScheduleRealizationDTO;
    }

    public List<ConstructionScheduleDTO> getListConstructionSchedulePartnerDTO() {
        return listConstructionSchedulePartnerDTO;
    }

    public void setListConstructionSchedulePartnerDTO(
            List<ConstructionScheduleDTO> listConstructionSchedulePartnerDTO) {
        this.listConstructionSchedulePartnerDTO = listConstructionSchedulePartnerDTO;
    }

    public List<ConstructionScheduleDTO> getListConstructionScheduleDirectorByDTO() {
        return listConstructionScheduleDirectorByDTO;
    }

    public void setListConstructionScheduleDirectorByDTO(
            List<ConstructionScheduleDTO> listConstructionScheduleDirectorByDTO) {
        this.listConstructionScheduleDirectorByDTO = listConstructionScheduleDirectorByDTO;
    }

    public List<ConstructionScheduleItemDTO> getListConstructionScheduleItemDTO() {
        return listConstructionScheduleItemDTO;
    }

    public void setListConstructionScheduleItemDTO(List<ConstructionScheduleItemDTO> listConstructionScheduleItemDTO) {
        this.listConstructionScheduleItemDTO = listConstructionScheduleItemDTO;
    }

    public List<ConstructionScheduleWorkItemDTO> getListConstructionScheduleWorkItemDTO() {
        return listConstructionScheduleWorkItemDTO;
    }

    public void setListConstructionScheduleWorkItemDTO(
            List<ConstructionScheduleWorkItemDTO> listConstructionScheduleWorkItemDTO) {
        this.listConstructionScheduleWorkItemDTO = listConstructionScheduleWorkItemDTO;
    }

    public String getSlowSchedule() {
        return slowSchedule;
    }

    public void setSlowSchedule(String slowSchedule) {
        this.slowSchedule = slowSchedule;
    }

}
