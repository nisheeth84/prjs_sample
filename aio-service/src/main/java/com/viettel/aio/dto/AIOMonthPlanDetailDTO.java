package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOMonthPlanDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

@XmlRootElement(name = "AIO_MONTH_PLAN_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOMonthPlanDetailDTO extends ComsBaseFWDTO<AIOMonthPlanDetailBO> {

    private Long aioMonthPlanDetailId;
    private String areaCode;
    private Long monthPlanId;
    private String sysGroupCode;
    private Long sysGroupId;
    private String sysGroupName;
    private Long targetsAmount;
    private Long totalAmount;
    private String month;
    private String titleName;
    private String year;
    private String text;
    private List<Date> lstDateNow;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateMonth;
    private Double planValue;
    private Double performValue;
    private Double min;
    private Double max;

    //tatph-start-25/12/2019
    private Long targetsMe;
    private Long targetsSh;
    private Long targetsNlmt;
    private Long targetsIct;
    private Long targetsMs;
    //tatph-end-25/12/2019


    public Double getMin() {
        return min;
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

    public void setMin(Double min) {
        this.min = min;
    }

    public Double getMax() {
        return max;
    }

    public void setMax(Double max) {
        this.max = max;
    }

    public Double getPlanValue() {
        return planValue;
    }

    public void setPlanValue(Double planValue) {
        this.planValue = planValue;
    }

    public Double getPerformValue() {
        return performValue;
    }

    public void setPerformValue(Double performValue) {
        this.performValue = performValue;
    }

    public Date getDateMonth() {
        return dateMonth;
    }

    public void setDateMonth(Date dateMonth) {
        this.dateMonth = dateMonth;
    }

    public List<Date> getLstDateNow() {
        return lstDateNow;
    }

    public void setLstDateNow(List<Date> lstDateNow) {
        this.lstDateNow = lstDateNow;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getTitleName() {
        return titleName;
    }

    public void setTitleName(String titleName) {
        this.titleName = titleName;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }

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
    public String catchName() {
        // TODO Auto-generated method stub
        return aioMonthPlanDetailId.toString();
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return aioMonthPlanDetailId;
    }

    @Override
    public AIOMonthPlanDetailBO toModel() {
        // TODO Auto-generated method stub
        AIOMonthPlanDetailBO aIOMonthPlanDetailBO = new AIOMonthPlanDetailBO();
        aIOMonthPlanDetailBO.setAioMonthPlanDetailId(this.aioMonthPlanDetailId);
        aIOMonthPlanDetailBO.setAreaCode(this.areaCode);
        aIOMonthPlanDetailBO.setMonthPlanId(this.monthPlanId);
        aIOMonthPlanDetailBO.setSysGroupCode(this.sysGroupCode);
        aIOMonthPlanDetailBO.setSysGroupId(this.sysGroupId);
        aIOMonthPlanDetailBO.setSysGroupName(this.sysGroupName);
        aIOMonthPlanDetailBO.setTargetsAmount(this.targetsAmount);
        aIOMonthPlanDetailBO.setTargetsAmountDv(this.targetsAmountDv);
        //tatph-start-25/12/2019
        aIOMonthPlanDetailBO.setTargetsIct(this.targetsIct);
        aIOMonthPlanDetailBO.setTargetsMe(this.targetsMe);
        aIOMonthPlanDetailBO.setTargetsMs(this.targetsMs);
        aIOMonthPlanDetailBO.setTargetsNlmt(this.targetsNlmt);
        aIOMonthPlanDetailBO.setTargetsSh(this.targetsSh);
        //tatph-start-25/12/2019
        return aIOMonthPlanDetailBO;
    }

    //Huypq-20190930-start
    private Long targetsAmountDv;

    public Long getTargetsAmountDv() {
        return targetsAmountDv;
    }

    public void setTargetsAmountDv(Long targetsAmountDv) {
        this.targetsAmountDv = targetsAmountDv;
    }

    //Huy-end
}
