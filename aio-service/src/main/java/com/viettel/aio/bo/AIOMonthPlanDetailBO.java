package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOMonthPlanDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "AIO_MONTH_PLAN_DETAIL")
public class AIOMonthPlanDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_MONTH_PLAN_DETAIL_SEQ")})
    @Column(name = "AIO_MONTH_PLAN_DETAIL_ID", length = 10)
    private Long aioMonthPlanDetailId;
    @Column(name = "AREA_CODE")
    private String areaCode;
    @Column(name = "MONTH_PLAN_ID")
    private Long monthPlanId;
    @Column(name = "SYS_GROUP_CODE")
    private String sysGroupCode;
    @Column(name = "SYS_GROUP_ID")
    private Long sysGroupId;
    @Column(name = "SYS_GROUP_NAME")
    private String sysGroupName;
    @Column(name = "TARGETS_AMOUNT")
    private Long targetsAmount;
    //Huypq-20190930-start
    @Column(name = "TARGETS_AMOUNT_DV")
    private Long targetsAmountDv;

    //tatph-start-25/12/2019
    @Column(name = "TARGETS_ME")
    private Long targetsMe;
    @Column(name = "TARGETS_SH")
    private Long targetsSh;
    @Column(name = "TARGETS_NLMT")
    private Long targetsNlmt;
    @Column(name = "TARGETS_ICT")
    private Long targetsIct;
    @Column(name = "TARGETS_MS")
    private Long targetsMs;
    //tatph-end-25/12/2019


    public Long getTargetsAmountDv() {
        return targetsAmountDv;
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


    public void setTargetsAmountDv(Long targetsAmountDv) {
        this.targetsAmountDv = targetsAmountDv;
    }
    //Huy-end

    public Long getAioMonthPlanDetailId() {
        return aioMonthPlanDetailId;
    }


    public void setAioMonthPlanDetailId(Long aioMonthPlanDetailId) {
        this.aioMonthPlanDetailId = aioMonthPlanDetailId;
    }


    public String getAreaCode() {
        return areaCode;
    }


    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }


    public Long getMonthPlanId() {
        return monthPlanId;
    }


    public void setMonthPlanId(Long monthPlanId) {
        this.monthPlanId = monthPlanId;
    }


    public String getSysGroupCode() {
        return sysGroupCode;
    }


    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }


    public Long getSysGroupId() {
        return sysGroupId;
    }


    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }


    public String getSysGroupName() {
        return sysGroupName;
    }


    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }


    public Long getTargetsAmount() {
        return targetsAmount;
    }


    public void setTargetsAmount(Long targetsAmount) {
        this.targetsAmount = targetsAmount;
    }


    @Override
    public AIOMonthPlanDetailDTO toDTO() {
        AIOMonthPlanDetailDTO aIOMonthPlanDetailDTO = new AIOMonthPlanDetailDTO();
        aIOMonthPlanDetailDTO.setAioMonthPlanDetailId(this.aioMonthPlanDetailId);
        aIOMonthPlanDetailDTO.setAreaCode(this.areaCode);
        aIOMonthPlanDetailDTO.setMonthPlanId(this.monthPlanId);
        aIOMonthPlanDetailDTO.setSysGroupCode(this.sysGroupCode);
        aIOMonthPlanDetailDTO.setSysGroupId(this.sysGroupId);
        aIOMonthPlanDetailDTO.setSysGroupName(this.sysGroupName);
        aIOMonthPlanDetailDTO.setTargetsAmount(this.targetsAmount);
        aIOMonthPlanDetailDTO.setTargetsAmountDv(this.targetsAmountDv);
        //tatph-start-25/12/2019
        aIOMonthPlanDetailDTO.setTargetsIct(this.targetsIct);
        aIOMonthPlanDetailDTO.setTargetsMe(this.targetsMe);
        aIOMonthPlanDetailDTO.setTargetsMs(this.targetsMs);
        aIOMonthPlanDetailDTO.setTargetsNlmt(this.targetsNlmt);
        aIOMonthPlanDetailDTO.setTargetsSh(this.targetsSh);
        //tatph-start-25/12/2019
        return aIOMonthPlanDetailDTO;
    }

}
