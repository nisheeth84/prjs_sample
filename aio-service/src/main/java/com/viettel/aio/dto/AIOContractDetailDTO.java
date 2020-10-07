package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_CONTRACT_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOContractDetailDTO extends ComsBaseFWDTO<AIOContractDetailBO> {

    private Long contractDetailId;
    private Long contractId;
    private String workName;
    private Long packageId;
    private String packageName;
    private Long packageDetailId;
    private Long engineCapacityId;
    private String engineCapacityName;
    private Long goodsId;
    private String goodsName;
    private Double quantity;
    private Double amount;
    private Date startDate;
    private Date endDate;
    private Long status;
    private Long isBill;
    private String customerName;
    private String customerAddress;
    private String taxCode;
    private Long isRepeat;
    private Long isProvinceBought;
    //VietNT_28/06/2019_start
    private String saleChannel;
    //VietNT_end

    // dto only
    private Double price;
    private Long locationId;
    private String locationName;
    private Double time;
    private Long acceptanceRecordsId;
    private Double quantityDiscount; 
    private Double amountDiscount;
    private Double percentDiscount;
    private Double percentDiscountStaff;
    private Long repeatNumber;
    private Double repeatInterval;
    private Double money;
    private Long type;
    private List<AIOPackagePromotionDTO> promotionDTOS;

    public List<AIOPackagePromotionDTO> getPromotionDTOS() {
        return promotionDTOS;
    }

    public void setPromotionDTOS(List<AIOPackagePromotionDTO> promotionDTOS) {
        this.promotionDTOS = promotionDTOS;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public Long getIsRepeat() {
        return isRepeat;
    }

    public void setIsRepeat(Long isRepeat) {
        this.isRepeat = isRepeat;
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

    public Double getTime() {
        return time;
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

	public Double getPercentDiscount() {
		return percentDiscount;
	}

	public void setPercentDiscount(Double percentDiscount) {
		this.percentDiscount = percentDiscount;
	}

	public Double getPercentDiscountStaff() {
		return percentDiscountStaff;
	}

	public void setPercentDiscountStaff(Double percentDiscountStaff) {
		this.percentDiscountStaff = percentDiscountStaff;
	}

	public Long getAcceptanceRecordsId() {
		return acceptanceRecordsId;
	}

	public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
		this.acceptanceRecordsId = acceptanceRecordsId;
	}

	public void setTime(Double time) {
        this.time = time;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
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

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    @Override
    public AIOContractDetailBO toModel() {
        AIOContractDetailBO bo = new AIOContractDetailBO();
        bo.setContractDetailId(this.getContractDetailId());
        bo.setContractId(this.getContractId());
        bo.setWorkName(this.getWorkName());
        bo.setPackageId(this.getPackageId());
        bo.setPackageName(this.getPackageName());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setEngineCapacityId(this.getEngineCapacityId());
        bo.setEngineCapacityName(this.getEngineCapacityName());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsName(this.getGoodsName());
        bo.setQuantity(this.getQuantity());
        bo.setAmount(this.getAmount());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setStatus(this.getStatus());
        bo.setIsBill(this.getIsBill());
        bo.setCustomerName(this.getCustomerName());
        bo.setCustomerAddress(this.getCustomerAddress());
        bo.setTaxCode(this.getTaxCode());
        bo.setIsRepeat(this.getIsRepeat());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        bo.setSaleChannel(this.getSaleChannel());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return contractDetailId;
    }

    @Override
    public String catchName() {
        return contractDetailId.toString();
    }

}
