package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_CONTRACTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AIOContractDTO extends ComsBaseFWDTO<AIOContractBO> {

    public static Long STATUS_NOT_START = 1L;
    public static Long STATUS_DOING = 2L;
    public static Long STATUS_DONE = 3L;
    public static Long STATUS_CANCEL = 4L;
    public static Long STATUS_PROPOSE_PAUSE = 5L;
    public static Long STATUS_PROPOSE_CANCEL = 6L;

    private Long contractId;
    private String contractCode;
    private String contractContent;
    private Long servicePointId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date signDate;
    private String signPlace;
    private Long customerId;
    private String customerCode;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String customerTaxCode;
    private Long performerId;
    private Long status;
    private Long type;
    private Long speciesId;
    private String speciesName;
    private Long engineCapacityId;
    private String engineCapacityName;
    private Double amountElectric;
    private Long goodsId;
    private String goodsName;
    private String description;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdUser;
    private Long createdGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updatedDate;
    private Long updatedUser;
    private Long updatedGroupId;
    private Long areaId;
    private String areaName;
    private Long catProvinceId;
    private String catProvinceCode;
    private Long isMoney;
    private Double contractAmount;
    private Long sellerId;
    private String sellerName;
    // VietNT_20190409_start
    private String sellerCode;
    private String performerName;
    private String performerCode;
    private String serviceCode;
    private String industryCode;
    private Long isInvoice;
    // VietNT_end
    //VietNT_24/06/2019_start
    private Long isPay;
    private Double amountPay;
    private Date payDate;
    //VietNT_end
    //VietNT_10/07/2019_start
    private String salesTogether;
    private Long isInternal;
    private String staffCode;

    private String reasonOutOfDate;

    private Double departmentAssignment;
    private Double perDepartmentAssignment;
    private Double sales;
    private Double performer;
    private Double staffAio;
    private Double manager;
    //VietNT_end
    //VietNT_22/07/2019_start
    private Long payType;
    private Long numberPay;
    private Long approvedPay;
    private String approvedDescription;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date approvedDate;
    //VietNT_end
    //VietNT_24/07/2019_start
    private Double thuHo;
    private String action;
    //VietNT_end

    // detail
    private Long contractDetailId;
    private String workName;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    // dto only
    private String createdDateStr;
    private AIOCustomerDTO customerDTO;
    private List<AIOContractDetailDTO> detailDTOS;
    //VietNT_20190528_start
    private List<AIOContractDetailDTO> deleteDTOS;
    //VietNT_end
    private double[] latRange;
    private double[] lngRange;
    private List<Long> contractIds;
    private Double time;

    private Double sumAmount;
    private Double sumDiscountStaff;
    private String createdUserName;
    private String performerEmail;
    private String performerPhone;
    private String lastPerformerName;
    private Long lastPerformerId;
    private Long isBill;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDateTo;
    private Long isProvinceBought;

    // ---
    //VietNT_21/06/2019_start
    private Long packageGoodsType;
    private Long packageType;
    //VietNT_end
    //VietNT_28/06/2019_start
    private String saleChannel;
    //VietNT_end
    //VietNT_22/07/2019_start
    private List<UtilAttachDocumentDTO> listFile;
    private int detailFinished;
    //VietNT_end
    //VietNT_10/08/2019_start
    private String sellerGroupLv3;
    private String performerGroupLv3;
    private String endDateStr;
    //VietNT_end

    //HuyPq-20190425-start
    private Long performerGroupId;
    private String name;
    private List<AIOPackageDetailDTO> listPackageDetail;
    private Long sysUserId;
    private Long sysGroupId;
    private Long statusContract;
    private Long moneyPromotion;

    private AIOContractPauseDTO contractPauseDTO;
    private List<AIOContractPauseDTO> pauseDTOS;
    private AIOContractPerformDateDTO contractPerformDateDTO;
    private int subAction;
    private List<AIOPackagePromotionDTO> promotionDTOS;
    private int done;
    private String contactChannel;
    private Double industryScale;

    public Double getIndustryScale() {
        return industryScale;
    }

    public void setIndustryScale(Double industryScale) {
        this.industryScale = industryScale;
    }

    public String getContactChannel() {
        return contactChannel;
    }

    public void setContactChannel(String contactChannel) {
        this.contactChannel = contactChannel;
    }

    public int getDone() {
        return done;
    }

    public void setDone(int done) {
        this.done = done;
    }

    public String getStaffCode() {
        return staffCode;
    }

    public void setStaffCode(String staffCode) {
        this.staffCode = staffCode;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public Long getMoneyPromotion() {
        return moneyPromotion;
    }

    public void setMoneyPromotion(Long moneyPromotion) {
        this.moneyPromotion = moneyPromotion;
    }

    public List<AIOContractPauseDTO> getPauseDTOS() {
        return pauseDTOS;
    }

    public void setPauseDTOS(List<AIOContractPauseDTO> pauseDTOS) {
        this.pauseDTOS = pauseDTOS;
    }

    public int getSubAction() {
        return subAction;
    }

    public void setSubAction(int subAction) {
        this.subAction = subAction;
    }

    public AIOContractPauseDTO getContractPauseDTO() {
        return contractPauseDTO;
    }

    public void setContractPauseDTO(AIOContractPauseDTO contractPauseDTO) {
        this.contractPauseDTO = contractPauseDTO;
    }

    public AIOContractPerformDateDTO getContractPerformDateDTO() {
        return contractPerformDateDTO;
    }

    public void setContractPerformDateDTO(AIOContractPerformDateDTO contractPerformDateDTO) {
        this.contractPerformDateDTO = contractPerformDateDTO;
    }

    public String getReasonOutOfDate() {
        return reasonOutOfDate;
    }

    public void setReasonOutOfDate(String reasonOutOfDate) {
        this.reasonOutOfDate = reasonOutOfDate;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public List<AIOPackageDetailDTO> getListPackageDetail() {
        return listPackageDetail;
    }

    public void setListPackageDetail(List<AIOPackageDetailDTO> listPackageDetail) {
        this.listPackageDetail = listPackageDetail;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    //Huy-end
    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getSellerCode() {
        return sellerCode;
    }

    public void setSellerCode(String sellerCode) {
        this.sellerCode = sellerCode;
    }

    public String getPerformerCode() {
        return performerCode;
    }

    public void setPerformerCode(String performerCode) {
        this.performerCode = performerCode;
    }

    public Long getIsBill() {
        return isBill;
    }

    public Date getEndDateFrom() {
        return endDateFrom;
    }

    public void setEndDateFrom(Date endDateFrom) {
        this.endDateFrom = endDateFrom;
    }

    public Date getEndDateTo() {
        return endDateTo;
    }

    public void setEndDateTo(Date endDateTo) {
        this.endDateTo = endDateTo;
    }

    public void setIsBill(Long isBill) {
        this.isBill = isBill;
    }

    public Long getLastPerformerId() {
        return lastPerformerId;
    }

    public void setLastPerformerId(Long lastPerformerId) {
        this.lastPerformerId = lastPerformerId;
    }

    public String getLastPerformerName() {
        return lastPerformerName;
    }

    public void setLastPerformerName(String lastPerformerName) {
        this.lastPerformerName = lastPerformerName;
    }

    public String getPerformerEmail() {
        return performerEmail;
    }

    public void setPerformerEmail(String performerEmail) {
        this.performerEmail = performerEmail;
    }

    public String getPerformerPhone() {
        return performerPhone;
    }

    public void setPerformerPhone(String performerPhone) {
        this.performerPhone = performerPhone;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public Double getSumAmount() {
        return sumAmount;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public void setSumAmount(Double sumAmount) {
        this.sumAmount = sumAmount;
    }

    public Double getSumDiscountStaff() {
        return sumDiscountStaff;
    }

    public void setSumDiscountStaff(Double sumDiscountStaff) {
        this.sumDiscountStaff = sumDiscountStaff;
    }

    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
    }

    public List<Long> getContractIds() {
        return contractIds;
    }

    public void setContractIds(List<Long> contractIds) {
        this.contractIds = contractIds;
    }

    public double[] getLatRange() {
        return latRange;
    }

    public void setLatRange(double[] latRange) {
        this.latRange = latRange;
    }

    public double[] getLngRange() {
        return lngRange;
    }

    public void setLngRange(double[] lngRange) {
        this.lngRange = lngRange;
    }

    public List<AIOContractDetailDTO> getDetailDTOS() {
        return detailDTOS;
    }

    public void setDetailDTOS(List<AIOContractDetailDTO> detailDTOS) {
        this.detailDTOS = detailDTOS;
    }

    public AIOCustomerDTO getCustomerDTO() {
        return customerDTO;
    }

    public void setCustomerDTO(AIOCustomerDTO customerDTO) {
        this.customerDTO = customerDTO;
    }

    public Double getContractAmount() {
        return contractAmount;
    }

    public void setContractAmount(Double contractAmount) {
        this.contractAmount = contractAmount;
    }

    public String getCustomerTaxCode() {
        return customerTaxCode;
    }

    public void setCustomerTaxCode(String customerTaxCode) {
        this.customerTaxCode = customerTaxCode;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }

    public String getWorkName() {
        return workName;
    }

    public void setWorkName(String workName) {
        this.workName = workName;
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

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public String getContractContent() {
        return contractContent;
    }

    public void setContractContent(String contractContent) {
        this.contractContent = contractContent;
    }

    public Long getServicePointId() {
        return servicePointId;
    }

    public void setServicePointId(Long servicePointId) {
        this.servicePointId = servicePointId;
    }

    public Date getSignDate() {
        return signDate;
    }

    public void setSignDate(Date signDate) {
        this.signDate = signDate;
    }

    public String getSignPlace() {
        return signPlace;
    }

    public void setSignPlace(String signPlace) {
        this.signPlace = signPlace;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Long getSpeciesId() {
        return speciesId;
    }

    public void setSpeciesId(Long speciesId) {
        this.speciesId = speciesId;
    }

    public String getSpeciesName() {
        return speciesName;
    }

    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
    }

    public Double getAmountElectric() {
        return amountElectric;
    }

    public void setAmountElectric(Double amountElectric) {
        this.amountElectric = amountElectric;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public Long getIsMoney() {
        return isMoney;
    }

    public void setIsMoney(Long isMoney) {
        this.isMoney = isMoney;
    }

    @Override
    public AIOContractBO toModel() {
        AIOContractBO bo = new AIOContractBO();
        bo.setContractId(this.getContractId());
        bo.setContractCode(this.getContractCode());
        bo.setContractContent(this.getContractContent());
        bo.setServicePointId(this.getServicePointId());
        bo.setSignDate(this.getSignDate());
        bo.setSignPlace(this.getSignPlace());
        bo.setCustomerId(this.getCustomerId());
        bo.setCustomerCode(this.getCustomerCode());
        bo.setCustomerName(this.getCustomerName());
        bo.setCustomerPhone(this.getCustomerPhone());
        bo.setCustomerAddress(this.getCustomerAddress());
        bo.setCustomerTaxCode(this.getCustomerTaxCode());
        bo.setPerformerId(this.getPerformerId());
        bo.setStatus(this.getStatus());
        bo.setType(this.getType());
        bo.setSpeciesId(this.getSpeciesId());
        bo.setSpeciesName(this.getSpeciesName());
        // bo.setEngineCapacityId(this.getEngineCapacityId());
        // bo.setEngineCapacityName(this.getEngineCapacityName());
        bo.setAmountElectric(this.getAmountElectric());
        // bo.setGoodsId(this.getGoodsId());
        // bo.setGoodsName(this.getGoodsName());
        bo.setDescription(this.getDescription());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedGroupId(this.getCreatedGroupId());
        bo.setUpdatedDate(this.getUpdatedDate());
        bo.setUpdatedUser(this.getUpdatedUser());
        bo.setUpdatedGroupId(this.getUpdatedGroupId());
        bo.setAreaId(this.getAreaId());
        bo.setAreaName(this.getAreaName());
        bo.setCatProvinceId(this.getCatProvinceId());
        bo.setCatProvinceCode(this.getCatProvinceCode());
        bo.setIsMoney(this.getIsMoney());
        bo.setContractAmount(this.getContractAmount());
        bo.setSellerId(this.getSellerId());
        bo.setSellerName(this.getSellerName());
        bo.setSellerCode(this.getSellerCode());
        bo.setPerformerName(this.getPerformerName());
        bo.setPerformerCode(this.getPerformerCode());
        bo.setServiceCode(this.getServiceCode());
        bo.setIndustryCode(this.getIndustryCode());
        bo.setPerformerGroupId(this.getPerformerGroupId());
        bo.setIsInvoice(this.getIsInvoice());
        bo.setIsPay(this.getIsPay());
        bo.setAmountPay(this.getAmountPay());
        bo.setPayDate(this.getPayDate());
        bo.setSalesTogether(this.getSalesTogether());
        bo.setPayType(this.getPayType());
        bo.setNumberPay(this.getNumberPay());
        bo.setApprovedPay(this.getApprovedPay());
        bo.setApprovedDate(this.getApprovedDate());
        bo.setApprovedDescription(this.getApprovedDescription());
        bo.setThuHo(this.getThuHo());
        bo.setReasonOutOfDate(this.getReasonOutOfDate());
        bo.setIsInternal(this.getIsInternal());
        bo.setStaffCode(this.getStaffCode());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return contractId;
    }

    @Override
    public String catchName() {
        return contractId.toString();
    }

    // hoanm1_20190316_start
    private Long sumExcute;
    private Long sumNonExcute;
    private Long packageId;
    private Long packageDetailId;
    private String packageName;
    private Double quantity;
    private Double amount;
    private Double amountDetail;
    private Double lat;
    private Double lng;
    private Long aioPackageGoodsId;
    private String startDateContract;
    private String endDateContract;

    private String customerNameBill;
    private String customerAddressBill;
    private String taxCodeBill;
    private Double discountStaff;
    private Double percentDiscountStaff;
    private String goodsCode;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Long acceptanceRecordsId;
    private Long goodsIsSerial;
    private String serial;
    // image
    private long utilAttachDocumentId;
    private long statusImage;
    private Double longtitude;
    private Double latitude;
    private String imageName;
    private long obstructedId;
    private String base64String;
    private String imagePath;
    private List<String> lstSerial;
    private Long stockId;
    private String stockCode;
    private String stockName;
    private Double price;
    private String goodType;
    private Double quantityDiscount;
    private Double amountDiscount;
    private Double percentDiscount;
    private Long checkBill;
    private String version;
    private String link;
    private Long checkStock;
    // hoanm1_20190410_start
    private List<String> lstSerialText;
    private Long typeSerial;

    //VietNT_11/09/2019_start
    private Long guaranteeType;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date warrantyMonth;
    private String nameGuarantee;
    private String serviceName;

    //VietNT_21/09/2019_start
    private String guaranteeTypeName;
    private Long guaranteeTime;
    //VietNT_end


    public String getGuaranteeTypeName() {
        return guaranteeTypeName;
    }

    public void setGuaranteeTypeName(String guaranteeTypeName) {
        this.guaranteeTypeName = guaranteeTypeName;
    }

    public Long getGuaranteeTime() {
        return guaranteeTime;
    }

    public void setGuaranteeTime(Long guaranteeTime) {
        this.guaranteeTime = guaranteeTime;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getGuaranteeType() {
        return guaranteeType;
    }

    public void setGuaranteeType(Long guaranteeType) {
        this.guaranteeType = guaranteeType;
    }

    public Date getWarrantyMonth() {
        return warrantyMonth;
    }

    public void setWarrantyMonth(Date warrantyMonth) {
        this.warrantyMonth = warrantyMonth;
    }

    public String getNameGuarantee() {
        return nameGuarantee;
    }

    public void setNameGuarantee(String nameGuarantee) {
        this.nameGuarantee = nameGuarantee;
    }
    //VietNT_end

    public List<String> getLstSerialText() {
        return lstSerialText;
    }

    public void setLstSerialText(List<String> lstSerialText) {
        this.lstSerialText = lstSerialText;
    }

    public Long getTypeSerial() {
        return typeSerial;
    }

    public void setTypeSerial(Long typeSerial) {
        this.typeSerial = typeSerial;
    }

    // hoanm1_20190410_end
    public Long getCheckStock() {
        return checkStock;
    }

    public void setCheckStock(Long checkStock) {
        this.checkStock = checkStock;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Long getCheckBill() {
        return checkBill;
    }

    public void setCheckBill(Long checkBill) {
        this.checkBill = checkBill;
    }

    public Double getPercentDiscount() {
        return percentDiscount;
    }

    public void setPercentDiscount(Double percentDiscount) {
        this.percentDiscount = percentDiscount;
    }

    public Double getQuantityDiscount() {
        return quantityDiscount;
    }

    public void setQuantityDiscount(Double quantityDiscount) {
        this.quantityDiscount = quantityDiscount;
    }

    public Double getAmountDiscount() {
        return amountDiscount;
    }

    public void setAmountDiscount(Double amountDiscount) {
        this.amountDiscount = amountDiscount;
    }

    public String getGoodType() {
        return goodType;
    }

    public void setGoodType(String goodType) {
        this.goodType = goodType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public String getStockCode() {
        return stockCode;
    }

    public void setStockCode(String stockCode) {
        this.stockCode = stockCode;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public List<String> getLstSerial() {
        return lstSerial;
    }

    public void setLstSerial(List<String> lstSerial) {
        this.lstSerial = lstSerial;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public Double getAmountDetail() {
        return amountDetail;
    }

    public void setAmountDetail(Double amountDetail) {
        this.amountDetail = amountDetail;
    }

    public Long getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(Long goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
        this.acceptanceRecordsId = acceptanceRecordsId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public Double getPercentDiscountStaff() {
        return percentDiscountStaff;
    }

    public void setPercentDiscountStaff(Double percentDiscountStaff) {
        this.percentDiscountStaff = percentDiscountStaff;
    }

    public long getUtilAttachDocumentId() {
        return utilAttachDocumentId;
    }

    public void setUtilAttachDocumentId(long utilAttachDocumentId) {
        this.utilAttachDocumentId = utilAttachDocumentId;
    }

    public long getStatusImage() {
        return statusImage;
    }

    public void setStatusImage(long statusImage) {
        this.statusImage = statusImage;
    }

    public Double getLongtitude() {
        return longtitude;
    }

    public void setLongtitude(Double longtitude) {
        this.longtitude = longtitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public long getObstructedId() {
        return obstructedId;
    }

    public void setObstructedId(long obstructedId) {
        this.obstructedId = obstructedId;
    }

    public String getBase64String() {
        return base64String;
    }

    public void setBase64String(String base64String) {
        this.base64String = base64String;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Double getDiscountStaff() {
        return discountStaff;
    }

    public void setDiscountStaff(Double discountStaff) {
        this.discountStaff = discountStaff;
    }

    public String getCustomerNameBill() {
        return customerNameBill;
    }

    public void setCustomerNameBill(String customerNameBill) {
        this.customerNameBill = customerNameBill;
    }

    public String getCustomerAddressBill() {
        return customerAddressBill;
    }

    public void setCustomerAddressBill(String customerAddressBill) {
        this.customerAddressBill = customerAddressBill;
    }

    public String getTaxCodeBill() {
        return taxCodeBill;
    }

    public void setTaxCodeBill(String taxCodeBill) {
        this.taxCodeBill = taxCodeBill;
    }

    public String getStartDateContract() {
        return startDateContract;
    }

    public void setStartDateContract(String startDateContract) {
        this.startDateContract = startDateContract;
    }

    public String getEndDateContract() {
        return endDateContract;
    }

    public void setEndDateContract(String endDateContract) {
        this.endDateContract = endDateContract;
    }

    public Long getAioPackageGoodsId() {
        return aioPackageGoodsId;
    }

    public void setAioPackageGoodsId(Long aioPackageGoodsId) {
        this.aioPackageGoodsId = aioPackageGoodsId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Long getSumExcute() {
        return sumExcute;
    }

    public void setSumExcute(Long sumExcute) {
        this.sumExcute = sumExcute;
    }

    public Long getSumNonExcute() {
        return sumNonExcute;
    }

    public void setSumNonExcute(Long sumNonExcute) {
        this.sumNonExcute = sumNonExcute;
    }

    public Long getEngineCapacityId() {
        return engineCapacityId;
    }

    public void setEngineCapacityId(Long engineCapacityId) {
        this.engineCapacityId = engineCapacityId;
    }

    public String getEngineCapacityName() {
        return engineCapacityName;
    }

    public void setEngineCapacityName(String engineCapacityName) {
        this.engineCapacityName = engineCapacityName;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }
    // hoanm1_20190316_end
    /**
     * Hoangnh start 16042016
     **/
    private Long aioOrdersId;

    public Long getAioOrdersId() {
        return aioOrdersId;
    }

    public void setAioOrdersId(Long aioOrdersId) {
        this.aioOrdersId = aioOrdersId;
    }

    /**
     * Hoangnh end 16042016
     **/

    public Long getIsInvoice() {
        return isInvoice;
    }

    public void setIsInvoice(Long isInvoice) {
        this.isInvoice = isInvoice;
    }

    //	hoanm1_20190517_start
    private Double priceRecordDetail;

    public Double getPriceRecordDetail() {
        return priceRecordDetail;
    }

    public void setPriceRecordDetail(Double priceRecordDetail) {
        this.priceRecordDetail = priceRecordDetail;
    }

    //	hoanm1_20190517_end
    //VietNT_20190528_start
    public List<AIOContractDetailDTO> getDeleteDTOS() {
        return deleteDTOS;
    }

    public void setDeleteDTOS(List<AIOContractDetailDTO> deleteDTOS) {
        this.deleteDTOS = deleteDTOS;
    }

    //VietNT_end
    public Long getPackageGoodsType() {
        return packageGoodsType;
    }

    public void setPackageGoodsType(Long packageGoodsType) {
        this.packageGoodsType = packageGoodsType;
    }

    public Long getPackageType() {
        return packageType;
    }

    public void setPackageType(Long packageType) {
        this.packageType = packageType;
    }

    public Long getIsPay() {
        return isPay;
    }

    public void setIsPay(Long isPay) {
        this.isPay = isPay;
    }

    public Double getAmountPay() {
        return amountPay;
    }

    public void setAmountPay(Double amountPay) {
        this.amountPay = amountPay;
    }

    public Date getPayDate() {
        return payDate;
    }

    public void setPayDate(Date payDate) {
        this.payDate = payDate;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public String getSalesTogether() {
        return salesTogether;
    }

    public void setSalesTogether(String salesTogether) {
        this.salesTogether = salesTogether;
    }

    public Double getDepartmentAssignment() {
        return departmentAssignment;
    }

    public void setDepartmentAssignment(Double departmentAssignment) {
        this.departmentAssignment = departmentAssignment;
    }

    public Double getPerDepartmentAssignment() {
        return perDepartmentAssignment;
    }

    public void setPerDepartmentAssignment(Double perDepartmentAssignment) {
        this.perDepartmentAssignment = perDepartmentAssignment;
    }

    public Double getSales() {
        return sales;
    }

    public void setSales(Double sales) {
        this.sales = sales;
    }

    public Double getPerformer() {
        return performer;
    }

    public void setPerformer(Double performer) {
        this.performer = performer;
    }

    public Double getStaffAio() {
        return staffAio;
    }

    public void setStaffAio(Double staffAio) {
        this.staffAio = staffAio;
    }

    public Double getManager() {
        return manager;
    }

    public void setManager(Double manager) {
        this.manager = manager;
    }

    public List<UtilAttachDocumentDTO> getListFile() {
        return listFile;
    }

    public void setListFile(List<UtilAttachDocumentDTO> listFile) {
        this.listFile = listFile;
    }

    public Long getPayType() {
        return payType;
    }

    public void setPayType(Long payType) {
        this.payType = payType;
    }

    public Long getNumberPay() {
        return numberPay;
    }

    public void setNumberPay(Long numberPay) {
        this.numberPay = numberPay;
    }

    public Long getApprovedPay() {
        return approvedPay;
    }

    public void setApprovedPay(Long approvedPay) {
        this.approvedPay = approvedPay;
    }

    public String getApprovedDescription() {
        return approvedDescription;
    }

    public void setApprovedDescription(String approvedDescription) {
        this.approvedDescription = approvedDescription;
    }

    public Date getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(Date approvedDate) {
        this.approvedDate = approvedDate;
    }

    public Double getThuHo() {
        return thuHo;
    }

    public void setThuHo(Double thuHo) {
        this.thuHo = thuHo;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getDetailFinished() {
        return detailFinished;
    }

    public void setDetailFinished(int detailFinished) {
        this.detailFinished = detailFinished;
    }

    public String getSellerGroupLv3() {
        return sellerGroupLv3;
    }

    public void setSellerGroupLv3(String sellerGroupLv3) {
        this.sellerGroupLv3 = sellerGroupLv3;
    }

    public String getPerformerGroupLv3() {
        return performerGroupLv3;
    }

    public void setPerformerGroupLv3(String performerGroupLv3) {
        this.performerGroupLv3 = performerGroupLv3;
    }

    public String getEndDateStr() {
        return endDateStr;
    }

    public void setEndDateStr(String endDateStr) {
        this.endDateStr = endDateStr;
    }

    public Long getStatusContract() {
        return statusContract;
    }

    public void setStatusContract(Long statusContract) {
        this.statusContract = statusContract;
    }

    public List<AIOPackagePromotionDTO> getPromotionDTOS() {
        return promotionDTOS;
    }

    public void setPromotionDTOS(List<AIOPackagePromotionDTO> promotionDTOS) {
        this.promotionDTOS = promotionDTOS;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }
}
