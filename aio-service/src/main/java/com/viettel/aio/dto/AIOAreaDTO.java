package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOAreaBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

@XmlRootElement(name = "AIO_AREABO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOAreaDTO extends ComsBaseFWDTO<AIOAreaBO> {

    private Long areaId;
    private String code;
    private String name;
    private Long parentId;
    private String status;
    private String path;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date effectDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private String areaNameLevel1;
    private String areaNameLevel2;
    private String areaNameLevel3;
    private String areaOrder;
    private String areaLevel;
    private Long sysUserId;
    private String employeeCode;
    private String fullName;
    private Long provinceId;
    private String text;
    private String parentName;
    private String configServiceCode;
    private String email;
    private String phoneNumber;
    private Long type;
    private Long isInvoice;
    //VietNT_12/08/2019_start
    private Long saleSysUserId;
    private String saleEmployeeCode;
    private String saleFullName;
    private int typePerformer;
    //VietNT_end

    // dto only
    private List<Long> areaIds;
    private Long isInternal;
    private String industryCode;

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public int getTypePerformer() {
        return typePerformer;
    }

    public void setTypePerformer(int typePerformer) {
        this.typePerformer = typePerformer;
    }

    public Long getSaleSysUserId() {
        return saleSysUserId;
    }

    public void setSaleSysUserId(Long saleSysUserId) {
        this.saleSysUserId = saleSysUserId;
    }

    public String getSaleEmployeeCode() {
        return saleEmployeeCode;
    }

    public void setSaleEmployeeCode(String saleEmployeeCode) {
        this.saleEmployeeCode = saleEmployeeCode;
    }

    public String getSaleFullName() {
        return saleFullName;
    }

    public void setSaleFullName(String saleFullName) {
        this.saleFullName = saleFullName;
    }

    public List<Long> getAreaIds() {
        return areaIds;
    }

    public void setAreaIds(List<Long> areaIds) {
        this.areaIds = areaIds;
    }

    public Long getIsInvoice() {
        return isInvoice;
    }

    public void setIsInvoice(Long isInvoice) {
        this.isInvoice = isInvoice;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getConfigServiceCode() {
        return configServiceCode;
    }

    public void setConfigServiceCode(String configServiceCode) {
        this.configServiceCode = configServiceCode;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Date getEffectDate() {
        return effectDate;
    }

    public void setEffectDate(Date effectDate) {
        this.effectDate = effectDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getAreaNameLevel1() {
        return areaNameLevel1;
    }

    public void setAreaNameLevel1(String areaNameLevel1) {
        this.areaNameLevel1 = areaNameLevel1;
    }

    public String getAreaNameLevel2() {
        return areaNameLevel2;
    }

    public void setAreaNameLevel2(String areaNameLevel2) {
        this.areaNameLevel2 = areaNameLevel2;
    }

    public String getAreaNameLevel3() {
        return areaNameLevel3;
    }

    public void setAreaNameLevel3(String areaNameLevel3) {
        this.areaNameLevel3 = areaNameLevel3;
    }

    public String getAreaOrder() {
        return areaOrder;
    }

    public void setAreaOrder(String areaOrder) {
        this.areaOrder = areaOrder;
    }

    public String getAreaLevel() {
        return areaLevel;
    }

    public void setAreaLevel(String areaLevel) {
        this.areaLevel = areaLevel;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return areaId.toString();
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return getAreaId();
    }

    @Override
    public AIOAreaBO toModel() {
        AIOAreaBO bo = new AIOAreaBO();
        bo.setAreaId(this.getAreaId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setParentId(this.getParentId());
        bo.setStatus(this.getStatus());
        bo.setPath(this.getPath());
        bo.setEffectDate(this.getEffectDate());
        bo.setEndDate(this.getEndDate());
        bo.setAreaNameLevel1(this.getAreaNameLevel1());
        bo.setAreaNameLevel2(this.getAreaNameLevel2());
        bo.setAreaNameLevel3(this.getAreaNameLevel3());
        bo.setAreaOrder(this.getAreaOrder());
        bo.setAreaLevel(this.getAreaLevel());
        bo.setSysUserId(this.getSysUserId());
        bo.setEmployeeCode(this.getEmployeeCode());
        bo.setFullName(this.getFullName());
        bo.setProvinceId(this.getProvinceId());
        return bo;
    }

}
