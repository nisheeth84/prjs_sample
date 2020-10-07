package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_CONTRACT_DETAIL")
public class AIOContractDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONTRACT_DETAIL_SEQ")})
    @Column(name = "CONTRACT_DETAIL_ID", length = 10)
    private Long contractDetailId;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "WORK_NAME", length = 50)
    private String workName;
    @Column(name = "PACKAGE_ID", length = 10)
    private Long packageId;
    @Column(name = "PACKAGE_NAME", length = 50)
    private String packageName;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "ENGINE_CAPACITY_ID", length = 10)
    private Long engineCapacityId;
    @Column(name = "ENGINE_CAPACITY_NAME", length = 50)
    private String engineCapacityName;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_NAME", length = 50)
    private String goodsName;
    @Column(name = "QUANTITY", length = 15)
    private Double quantity;
    @Column(name = "AMOUNT", length = 15)
    private Double amount;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "IS_BILL", length = 1)
    private Long isBill;
    @Column(name = "CUSTOMER_NAME", length = 20)
    private String customerName;
    @Column(name = "CUSTOMER_ADDRESS", length = 50)
    private String customerAddress;
    @Column(name = "TAX_CODE", length = 30)
    private String taxCode;
    @Column(name = "IS_REPEAT", length = 1)
    private Long isRepeat;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 1)
    private Long isProvinceBought;
    //VietNT_28/06/2019_start
    @Column(name = "SALE_CHANNEL", length = 20)
    private String saleChannel;
    //VietNT_end

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOContractDetailDTO dto = new AIOContractDetailDTO();
        dto.setContractDetailId(this.getContractDetailId());
        dto.setContractId(this.getContractId());
        dto.setWorkName(this.getWorkName());
        dto.setPackageId(this.getPackageId());
        dto.setPackageName(this.getPackageName());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setEngineCapacityId(this.getEngineCapacityId());
        dto.setEngineCapacityName(this.getEngineCapacityName());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsName(this.getGoodsName());
        dto.setQuantity(this.getQuantity());
        dto.setAmount(this.getAmount());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setStatus(this.getStatus());
        dto.setIsBill(this.getIsBill());
        dto.setCustomerName(this.getCustomerName());
        dto.setCustomerAddress(this.getCustomerAddress());
        dto.setTaxCode(this.getTaxCode());
        dto.setIsRepeat(this.getIsRepeat());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        dto.setSaleChannel(this.getSaleChannel());
        return dto;
    }

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getWorkName() {
        return workName;
    }

    public void setWorkName(String workName) {
        this.workName = workName;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
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

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getIsBill() {
        return isBill;
    }

    public void setIsBill(Long isBill) {
        this.isBill = isBill;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public Long getIsRepeat() {
        return isRepeat;
    }

    public void setIsRepeat(Long isRepeat) {
        this.isRepeat = isRepeat;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }
}
