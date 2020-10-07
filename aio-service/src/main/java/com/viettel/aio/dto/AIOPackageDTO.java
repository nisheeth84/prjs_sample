package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190308_create
@XmlRootElement(name = "AIO_PACKAGEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageDTO extends ComsBaseFWDTO<AIOPackageBO> {

    private Long aioPackageId;
    private String code;
    private String name;
    private Long packageType;
    private Double time;
    private String description;
    private Long status;
    //VietNT_20190417_start
    private Long repeatNumber;
    private Double repeatInterval;
    private Long isRepeat;
    //VietNT_end
    //VietNT_25/06/2019_start
    private String saleChannel;
    //VietNT_end
    //VietNT_08/07/2019_start
    private Long isProvinceBought;
    //VietNT_end

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private Long serviceId;
    private String serviceCode;
    private Long isPromotion;
    private Long packagePoint;
    private Long createdUser;
    private Date createdDate;
    private Long updateUser;
    private Date updateDate;
    private Long isInternal;
    private String industryCode;

    // dto
    private Long provinceId;
    private String goodsCode;
    private List<String> domainData;
    private String listGoods;
    private Double price;

    @Override
    public AIOPackageBO toModel() {
        AIOPackageBO bo = new AIOPackageBO();
        bo.setAioPackageId(this.getAioPackageId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setPackageType(this.getPackageType());
        bo.setTime(this.getTime());
        bo.setDescription(this.getDescription());
        bo.setStatus(this.getStatus());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setServiceId(this.getServiceId());
        bo.setServiceCode(this.getServiceCode());
        bo.setRepeatNumber(this.getRepeatNumber());
        bo.setRepeatInterval(this.getRepeatInterval());
        bo.setIsRepeat(this.getIsRepeat());
        bo.setSaleChannel(this.getSaleChannel());
        bo.setIsPromotion(this.getIsPromotion());
        bo.setPackagePoint(this.getPackagePoint());
        bo.setIsInternal(this.getIsInternal());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setUpdateUser(this.getUpdateUser());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setIndustryCode(this.getIndustryCode());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioPackageId;
    }

    @Override
    public String catchName() {
        return aioPackageId.toString();
    }

    public Long getPackagePoint() {
        return packagePoint;
    }

    public void setPackagePoint(Long packagePoint) {
        this.packagePoint = packagePoint;
    }

    private List<UtilAttachDocumentDTO> listFilePromotion;

    public List<UtilAttachDocumentDTO> getListFilePromotion() {
        return listFilePromotion;
    }

    public void setListFilePromotion(List<UtilAttachDocumentDTO> listFilePromotion) {
        this.listFilePromotion = listFilePromotion;
    }

    public Long getIsPromotion() {
        return isPromotion;
    }

    public void setIsPromotion(Long isPromotion) {
        this.isPromotion = isPromotion;
    }

    public List<String> getDomainData() {
        return domainData;
    }

    public void setDomainData(List<String> domainData) {
        this.domainData = domainData;
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

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
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

    public Long getPackageType() {
        return packageType;
    }

    public void setPackageType(Long packageType) {
        this.packageType = packageType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
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

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public Long getRepeatNumber() {
        return repeatNumber;
    }

    public void setRepeatNumber(Long repeatNumber) {
        this.repeatNumber = repeatNumber;
    }

    public Double getRepeatInterval() {
        return repeatInterval;
    }

    public void setRepeatInterval(Double repeatInterval) {
        this.repeatInterval = repeatInterval;
    }

    public Long getIsRepeat() {
        return isRepeat;
    }

    public void setIsRepeat(Long isRepeat) {
        this.isRepeat = isRepeat;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public String getListGoods() {
        return listGoods;
    }

    public void setListGoods(String listGoods) {
        this.listGoods = listGoods;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
