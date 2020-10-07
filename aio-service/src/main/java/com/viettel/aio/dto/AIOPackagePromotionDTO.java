package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackagePromotionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190930_create
@XmlRootElement(name = "AIO_PACKAGE_PROMOTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOPackagePromotionDTO extends ComsBaseFWDTO<AIOPackagePromotionBO> {

    public static final Long TYPE_VALUE = 1L;
    public static final Long TYPE_PERCENT = 2L;
    public static final Long TYPE_GOODS = 3L;
    public static final Long TYPE_VALUE_GOODS = 4L;
    public static final Long TYPE_PERCENT_GOODS = 5L;

    private Long packagePromotionId;
    private Long packageId;
    private Long packageDetailId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Long goodsIsSerial;
    private Double quantity;
    private Double money;
    private Long type;

    // dto
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private List<Long> idList;

    public List<Long> getIdList() {
        return idList;
    }

    public void setIdList(List<Long> idList) {
        this.idList = idList;
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

    public Long getPackagePromotionId() {
        return packagePromotionId;
    }

    public void setPackagePromotionId(Long packagePromotionId) {
        this.packagePromotionId = packagePromotionId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
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

    public Long getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(Long goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
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

    @Override
    public AIOPackagePromotionBO toModel() {
        AIOPackagePromotionBO bo = new AIOPackagePromotionBO();
        bo.setPackagePromotionId(this.getPackagePromotionId());
        bo.setPackageId(this.getPackageId());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setGoodsIsSerial(this.getGoodsIsSerial());
        bo.setQuantity(this.getQuantity());
        bo.setMoney(this.getMoney());
        bo.setType(this.getType());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return packagePromotionId;
    }

    @Override
    public String catchName() {
        return packagePromotionId.toString();
    }
}
