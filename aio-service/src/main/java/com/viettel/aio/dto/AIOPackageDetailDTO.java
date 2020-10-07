package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

//VietNT_20190308_create
//@XmlRootElement(name = "AIO_PACKAGE_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOPackageDetailDTO extends ComsBaseFWDTO<AIOPackageDetailBO> {

    private Long aioPackageDetailId;
    private Long aioPackageId;
    private Long engineCapacityId;
    private String engineCapacityName;
    private Double quantityDiscount;
    private Double amountDiscount;
    private Double percentDiscount;
    private Long goodsId;
    private String goodsName;
    private Long locationId;
    private String locationName;
    private Double percentDiscountStaff;
    private Double price;
    private String aioPackageName;
    private Long aioPackageTime;
    private Long quantity;
    private Long repeatNumber;
    private Long repeatInterval;
    private Long contractId;
    private Long contractDetailId;
    private Long isProvinceBought;

    // dto only
    private List<AIOPackagePromotionDTO> promotionDTOS;
    private Double moneyNum;
    private Double moneyPercent;
    private Long typePromotion;

    private List<AIOPackageGoodsDTO> packageGoodsData;
    private List<AIOPackageGoodsAddDTO> packageGoodsAddData;
    private List<AIOPackageDetailPriceDTO> priceList;
    private List<AIOPackageConfigSalaryDTO> configs;

    private String workName;
    private String packageName;
    private Double time;
    private Long isRepeat;
    private String saleChannel;
    //promo
    private Double money;
    private Long type;
    private String serviceCode;

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getWorkName() {
        return workName;
    }

    public void setWorkName(String workName) {
        this.workName = workName;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
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

    public List<AIOPackageConfigSalaryDTO> getConfigs() {
        return configs;
    }

    public void setConfigs(List<AIOPackageConfigSalaryDTO> configs) {
        this.configs = configs;
    }

    public Double getMoneyNum() {
        return moneyNum;
    }

    public void setMoneyNum(Double moneyNum) {
        this.moneyNum = moneyNum;
    }

    public Double getMoneyPercent() {
        return moneyPercent;
    }

    public void setMoneyPercent(Double moneyPercent) {
        this.moneyPercent = moneyPercent;
    }

    public Long getTypePromotion() {
        return typePromotion;
    }

    public void setTypePromotion(Long typePromotion) {
        this.typePromotion = typePromotion;
    }

    public List<AIOPackagePromotionDTO> getPromotionDTOS() {
        return promotionDTOS;
    }

    public void setPromotionDTOS(List<AIOPackagePromotionDTO> promotionDTOS) {
        this.promotionDTOS = promotionDTOS;
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

	public Long getRepeatInterval() {
		return repeatInterval;
	}

	public void setRepeatInterval(Long repeatInterval) {
		this.repeatInterval = repeatInterval;
	}

	public Long getRepeatNumber() {
		return repeatNumber;
	}

	public void setRepeatNumber(Long repeatNumber) {
		this.repeatNumber = repeatNumber;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public Long getAioPackageTime() {
		return aioPackageTime;
	}

	public void setAioPackageTime(Long aioPackageTime) {
		this.aioPackageTime = aioPackageTime;
	}

	public String getAioPackageName() {
		return aioPackageName;
	}

	public void setAioPackageName(String aioPackageName) {
		this.aioPackageName = aioPackageName;
	}

    @Override
    public AIOPackageDetailBO toModel() {
        AIOPackageDetailBO bo = new AIOPackageDetailBO();
        bo.setAioPackageDetailId(this.getAioPackageDetailId());
        bo.setAioPackageId(this.getAioPackageId());
        bo.setEngineCapacityId(this.getEngineCapacityId());
        bo.setEngineCapacityName(this.getEngineCapacityName());
        bo.setQuantityDiscount(this.getQuantityDiscount());
        bo.setAmountDiscount(this.getAmountDiscount());
        bo.setPercentDiscount(this.getPercentDiscount());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsName(this.getGoodsName());
        bo.setLocationId(this.getLocationId());
        bo.setLocationName(this.getLocationName());
        bo.setPercentDiscountStaff(this.getPercentDiscountStaff());
        bo.setPrice(this.getPrice());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioPackageDetailId;
    }

    @Override
    public String catchName() {
        return aioPackageDetailId.toString();
    }

    public List<AIOPackageDetailPriceDTO> getPriceList() {
        return priceList;
    }

    public void setPriceList(List<AIOPackageDetailPriceDTO> priceList) {
        this.priceList = priceList;
    }

    public List<AIOPackageGoodsDTO> getPackageGoodsData() {
        return packageGoodsData;
    }

    public void setPackageGoodsData(List<AIOPackageGoodsDTO> packageGoodsData) {
        this.packageGoodsData = packageGoodsData;
    }

    public List<AIOPackageGoodsAddDTO> getPackageGoodsAddData() {
        return packageGoodsAddData;
    }

    public void setPackageGoodsAddData(List<AIOPackageGoodsAddDTO> packageGoodsAddData) {
        this.packageGoodsAddData = packageGoodsAddData;
    }
    //

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getAioPackageDetailId() {
        return aioPackageDetailId;
    }

    public void setAioPackageDetailId(Long aioPackageDetailId) {
        this.aioPackageDetailId = aioPackageDetailId;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
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

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }
}
