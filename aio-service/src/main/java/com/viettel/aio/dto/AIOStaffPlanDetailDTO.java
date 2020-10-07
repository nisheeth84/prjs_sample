package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOStaffPlanDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "AIO_STAFF_PLAN_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStaffPlanDetailDTO extends ComsBaseFWDTO<AIOStaffPlanDetailBO> {
    private Long aioStaffPlanDetailId;
    private Long aioStaffPlanId;
    private Long sysUserId;
    private String sysUserCode;
    private String sysUserName;
    //	private Long targetsAmount;
    private String monthPlanType;
    private String monthPlanName;
    /*	Trung start 29/10/2019*/
    private Long sysGroupId;
    private String sysGroupCode;
    private String sysGroupName;
    private Long targetsAmountDV;
    private Long targetsAmountTM;

    //tatph-start-25/12/2019
    private Long targetsMe;
    private Long targetsSh;
    private Long targetsNlmt;
    private Long targetsIct;
    private Long targetsMs;
    //tatph-end-25/12/2019


    public String getSysGroupName() {
        return sysGroupName;
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

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
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

    /*	Trung end 29/10/2019*/

    public Long getAioStaffPlanDetailId() {
        return aioStaffPlanDetailId;
    }

    public void setAioStaffPlanDetailId(Long aioStaffPlanDetailId) {
        this.aioStaffPlanDetailId = aioStaffPlanDetailId;
    }

    public Long getAioStaffPlanId() {
        return aioStaffPlanId;
    }

    public void setAioStaffPlanId(Long aioStaffPlanId) {
        this.aioStaffPlanId = aioStaffPlanId;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

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

    public String getMonthPlanType() {
        return monthPlanType;
    }

    public void setMonthPlanType(String monthPlanType) {
        this.monthPlanType = monthPlanType;
    }

    public String getMonthPlanName() {
        return monthPlanName;
    }

    public void setMonthPlanName(String monthPlanName) {
        this.monthPlanName = monthPlanName;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return aioStaffPlanDetailId.toString();
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return aioStaffPlanDetailId;
    }

    @Override
    public AIOStaffPlanDetailBO toModel() {
        // TODO Auto-generated method stub
        AIOStaffPlanDetailBO aioStaffPlainDetailBO = new AIOStaffPlanDetailBO();
        aioStaffPlainDetailBO.setAioStaffPlanDetailId(this.getAioStaffPlanDetailId());
        aioStaffPlainDetailBO.setAioStaffPlanId(this.getAioStaffPlanId());
        aioStaffPlainDetailBO.setSysUserId(this.getSysUserId());
        aioStaffPlainDetailBO.setSysUserName(this.getSysUserName());
        aioStaffPlainDetailBO.setSysUserCode(this.getSysUserCode());
        aioStaffPlainDetailBO.setSysGroupId(this.getSysGroupId());
        aioStaffPlainDetailBO.setTargetsAmountTM(this.targetsAmountTM);
        aioStaffPlainDetailBO.setTargetsAmountDV(this.targetsAmountDV);

        aioStaffPlainDetailBO.setTargetsIct(this.targetsIct);
        aioStaffPlainDetailBO.setTargetsMe(this.targetsMe);
        aioStaffPlainDetailBO.setTargetsMs(this.targetsMs);
        aioStaffPlainDetailBO.setTargetsNlmt(this.targetsNlmt);
        aioStaffPlainDetailBO.setTargetsSh(this.targetsSh);
        return aioStaffPlainDetailBO;
    }

}
