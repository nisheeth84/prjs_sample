package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOStaffBO;
import com.viettel.aio.bo.AIOStaffPlanBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

@XmlRootElement(name = "AIO_STAFF_PLANBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStaffPlainDTO extends ComsBaseFWDTO<AIOStaffPlanBO> {

    private Long aioStaffPlanId;
    private String description;
    private String month;
    private String year;
    private Long status;
    private Long sysGroupId;
    private String sysGroupCode;
    private String sysGroupName;
    private Double sumTargetAmount;
    private Long createdUser;
    private Date createdDate;
    private Long updateUser;
    private Date updateDate;

    private List<AIOStaffPlanDetailDTO> listStaffPlanDetail;
    private Boolean isCreatNew;
    private List<String> sysUserCodes;
    private List<String> sysGroupIdsPermission;

    private String name;
    private String sysUserCode;
    private String sysUserName;
    private Long targetsAmountDV;
    private Long targetsAmountTM;
    private Long targetsMe;
    private Long targetsSh;
    private Long targetsNlmt;
    private Long targetsIct;
    private Long targetsMs;

    public List<String> getSysGroupIdsPermission() {
        return sysGroupIdsPermission;
    }

    public void setSysGroupIdsPermission(List<String> sysGroupIdsPermission) {
        this.sysGroupIdsPermission = sysGroupIdsPermission;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public List<String> getSysUserCodes() {
        return sysUserCodes;
    }

    public void setSysUserCodes(List<String> sysUserCodes) {
        this.sysUserCodes = sysUserCodes;
    }

    public List<AIOStaffPlanDetailDTO> getListStaffPlanDetail() {
        return listStaffPlanDetail;
    }

    public void setListStaffPlanDetail(List<AIOStaffPlanDetailDTO> listStaffPlanDetail) {
        this.listStaffPlanDetail = listStaffPlanDetail;
    }

    public Boolean getIsCreatNew() {
        return isCreatNew;
    }

    public void setIsCreatNew(Boolean creatNew) {
        isCreatNew = creatNew;
    }

    public Long getAioStaffPlanId() {
        return aioStaffPlanId;
    }

    public void setAioStaffPlanId(Long aioStaffPlanId) {
        this.aioStaffPlanId = aioStaffPlanId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Double getSumTargetAmount() {
        return sumTargetAmount;
    }

    public void setSumTargetAmount(Double sumTargetAmount) {
        this.sumTargetAmount = sumTargetAmount;
    }

//    public Boolean getCreatNew() {
//        return isCreatNew;
//    }
//
//    public void setCreatNew(Boolean creatNew) {
//        isCreatNew = creatNew;
//    }


    public String getSysUserCode() {
        return sysUserCode;
    }

    public void setSysUserCode(String sysUserCode) {
        this.sysUserCode = sysUserCode;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public Long getTargetsAmountDV() {
        return targetsAmountDV;
    }

    public void setTargetsAmountDV(Long targetsAmountDV) {
        this.targetsAmountDV = targetsAmountDV;
    }

    public Long getTargetsAmountTM() {
        return targetsAmountTM;
    }

    public void setTargetsAmountTM(Long targetsAmountTM) {
        this.targetsAmountTM = targetsAmountTM;
    }

    public Long getTargetsMe() {
        return targetsMe;
    }

    public void setTargetsMe(Long targetsMe) {
        this.targetsMe = targetsMe;
    }

    public Long getTargetsSh() {
        return targetsSh;
    }

    public void setTargetsSh(Long targetsSh) {
        this.targetsSh = targetsSh;
    }

    public Long getTargetsNlmt() {
        return targetsNlmt;
    }

    public void setTargetsNlmt(Long targetsNlmt) {
        this.targetsNlmt = targetsNlmt;
    }

    public Long getTargetsIct() {
        return targetsIct;
    }

    public void setTargetsIct(Long targetsIct) {
        this.targetsIct = targetsIct;
    }

    public Long getTargetsMs() {
        return targetsMs;
    }

    public void setTargetsMs(Long targetsMs) {
        this.targetsMs = targetsMs;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public AIOStaffPlanBO toModel() {
        AIOStaffPlanBO bo = new AIOStaffPlanBO();
        bo.setAioStaffPlanId(this.getAioStaffPlanId());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setMonth(this.getMonth());
        bo.setYear(this.getYear());
        bo.setDescription(this.getDescription());
        bo.setStatus(this.getStatus());
        bo.setSysGroupCode(this.getSysGroupCode());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setUpdateUser(this.getUpdateUser());
        bo.setUpdateDate(this.getUpdateDate());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioStaffPlanId;
    }

    @Override
    public String catchName() {
        return aioStaffPlanId.toString();
    }
}
