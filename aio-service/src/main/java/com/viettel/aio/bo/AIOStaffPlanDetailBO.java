package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOStaffPlanDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "AIO_STAFF_PLAN_DETAIL")
public class AIOStaffPlanDetailBO extends BaseFWModelImpl {
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_STAFF_PLAN_DETAIL_SEQ")})
    @Column(name = "STAFF_PLAN_DETAIL_ID", length = 10)
    private Long aioStaffPlanDetailId;
    @Column(name = "AIO_STAFF_PLAN_ID")
    private Long aioStaffPlanId;
    @Column(name = "SYS_USER_NAME")
    private String sysUserName;
    @Column(name = "SYS_USER_ID")
    private Long sysUserId;
    @Column(name = "SYS_USER_CODE")
    private String sysUserCode;

    @Column(name = "TARGETS_AMOUNT_TM")
    private Long targetsAmountTM;

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


    public Long getTargetsAmountTM() {
        return targetsAmountTM;
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

    public void setTargetsAmountTM(Long targetsAmountTM) {
        this.targetsAmountTM = targetsAmountTM;
    }

    public Long getTargetsAmountDV() {
        return targetsAmountDV;
    }

    public void setTargetsAmountDV(Long targetsAmountDV) {
        this.targetsAmountDV = targetsAmountDV;
    }

    @Column(name = "TARGETS_AMOUNT_DV")
    private Long targetsAmountDV;

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "SYS_GROUP_ID")
    private Long sysGroupId;

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

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
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

    @Override
    public AIOStaffPlanDetailDTO toDTO() {
        AIOStaffPlanDetailDTO aioStaffPlanDetailDTO = new AIOStaffPlanDetailDTO();
        aioStaffPlanDetailDTO.setAioStaffPlanDetailId(this.getAioStaffPlanDetailId());
        aioStaffPlanDetailDTO.setAioStaffPlanId(this.getAioStaffPlanId());
        aioStaffPlanDetailDTO.setSysUserId(this.getSysUserId());
        aioStaffPlanDetailDTO.setSysUserName(this.getSysUserName());
        aioStaffPlanDetailDTO.setSysUserCode(this.getSysUserCode());
        aioStaffPlanDetailDTO.setTargetsAmountTM(this.targetsAmountTM);
        aioStaffPlanDetailDTO.setTargetsAmountDV(this.targetsAmountDV);

        //tatph-start-25/12/2019
        aioStaffPlanDetailDTO.setTargetsIct(this.targetsIct);
        aioStaffPlanDetailDTO.setTargetsMe(this.targetsMe);
        aioStaffPlanDetailDTO.setTargetsMs(this.targetsMs);
        aioStaffPlanDetailDTO.setTargetsNlmt(this.targetsNlmt);
        aioStaffPlanDetailDTO.setTargetsSh(this.targetsSh);
        //tatph-start-25/12/2019
        return aioStaffPlanDetailDTO;
    }
}
