package com.viettel.coms.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.GoodsDTO;
import com.viettel.service.base.model.BaseFWModelImpl;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.GoodsBO")
@Table(name = "CTCT_CAT_OWNER.GOODS")
/**
 *
 * @author: hailh10
 */
public class GoodsBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "GOODS_SEQ") })
	@Column(name = "GOODS_ID", length = 22)
	private java.lang.Long goodsId;
	@Column(name = "CODE", length = 100)
	private java.lang.String code;
	@Column(name = "NAME", length = 400)
	private java.lang.String name;
	@Column(name = "STATUS", length = 2)
	private java.lang.String status;
	@Column(name = "UNIT_TYPE", length = 22)
	private java.lang.Long unitType;
	@Column(name = "GOODS_TYPE", length = 2)
	private java.lang.String goodsType;
	@Column(name = "IS_SERIAL", length = 1)
	private java.lang.String isSerial;
	@Column(name = "ORIGIN_PRICE", length = 22)
	private java.lang.Double originPrice;
	@Column(name = "ORIGIN_SIZE", length = 22)
	private java.lang.Double originSize;
	@Column(name = "WEIGHT", length = 22)
	private java.lang.Double weight;
	@Column(name = "VOLUME_ORIGIN", length = 22)
	private java.lang.Double volumeOrigin;
	@Column(name = "VOLUME_REAL", length = 22)
	private java.lang.Double volumeReal;
	@Column(name = "DESCRIPTION", length = 2000)
	private java.lang.String description;
	@Column(name = "CAT_MANUFACTURER_ID", length = 22)
	private java.lang.Long manufacturerId;
	@Column(name = "CAT_PRODUCING_COUNTRY_ID", length = 22)
	private java.lang.Long producingCountryId;
	@Column(name = "MANUFACTURER_NAME", length = 2000)
	private java.lang.String manufacturerName;
	@Column(name = "PRODUCING_COUNTRY_NAME", length = 2000)
	private java.lang.String producingCountryName;
	@Column(name = "CREATED_BY", length = 22)
	private java.lang.Long createdBy;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "UPDATED_BY", length = 22)
	private java.lang.Long updatedBy;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "UNIT_TYPE_NAME", length = 100)
	private java.lang.String unitTypeName;

	
	public java.lang.Long getGoodsId(){
		return goodsId;
	}
	
	public void setGoodsId(java.lang.Long goodsId)
	{
		this.goodsId = goodsId;
	}
	
	public java.lang.String getCode(){
		return code;
	}
	
	public void setCode(java.lang.String code)
	{
		this.code = code;
	}
	
	public java.lang.String getName(){
		return name;
	}
	
	public void setName(java.lang.String name)
	{
		this.name = name;
	}
	
	public java.lang.String getStatus(){
		return status;
	}
	
	public void setStatus(java.lang.String status)
	{
		this.status = status;
	}
	
	public java.lang.Long getUnitType(){
		return unitType;
	}
	
	public void setUnitType(java.lang.Long unitType)
	{
		this.unitType = unitType;
	}
	
	public java.lang.String getGoodsType(){
		return goodsType;
	}
	
	public void setGoodsType(java.lang.String goodsType)
	{
		this.goodsType = goodsType;
	}
	
	public java.lang.String getIsSerial(){
		return isSerial;
	}
	
	public void setIsSerial(java.lang.String isSerial)
	{
		this.isSerial = isSerial;
	}
	
	public java.lang.Double getOriginPrice(){
		return originPrice;
	}
	
	public void setOriginPrice(java.lang.Double originPrice)
	{
		this.originPrice = originPrice;
	}
	
	public java.lang.Double getOriginSize(){
		return originSize;
	}
	
	public void setOriginSize(java.lang.Double originSize)
	{
		this.originSize = originSize;
	}
	
	public java.lang.Double getWeight(){
		return weight;
	}
	
	public void setWeight(java.lang.Double weight)
	{
		this.weight = weight;
	}
	
	public java.lang.Double getVolumeOrigin(){
		return volumeOrigin;
	}
	
	public void setVolumeOrigin(java.lang.Double volumeOrigin)
	{
		this.volumeOrigin = volumeOrigin;
	}
	
	public java.lang.Double getVolumeReal(){
		return volumeReal;
	}
	
	public void setVolumeReal(java.lang.Double volumeReal)
	{
		this.volumeReal = volumeReal;
	}
	
	public java.lang.String getDescription(){
		return description;
	}
	
	public void setDescription(java.lang.String description)
	{
		this.description = description;
	}
	
	public java.lang.Long getManufacturerId(){
		return manufacturerId;
	}
	
	public void setManufacturerId(java.lang.Long manufacturerId)
	{
		this.manufacturerId = manufacturerId;
	}
	
	public java.lang.Long getProducingCountryId(){
		return producingCountryId;
	}
	
	public void setProducingCountryId(java.lang.Long producingCountryId)
	{
		this.producingCountryId = producingCountryId;
	}
	
	public java.lang.String getManufacturerName(){
		return manufacturerName;
	}
	
	public void setManufacturerName(java.lang.String manufacturerName)
	{
		this.manufacturerName = manufacturerName;
	}
	
	public java.lang.String getProducingCountryName(){
		return producingCountryName;
	}
	
	public void setProducingCountryName(java.lang.String producingCountryName)
	{
		this.producingCountryName = producingCountryName;
	}
	
	public java.lang.Long getCreatedBy(){
		return createdBy;
	}
	
	public void setCreatedBy(java.lang.Long createdBy)
	{
		this.createdBy = createdBy;
	}
	
	public java.util.Date getCreatedDate(){
		return createdDate;
	}
	
	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}
	
	public java.lang.Long getUpdatedBy(){
		return updatedBy;
	}
	
	public void setUpdatedBy(java.lang.Long updatedBy)
	{
		this.updatedBy = updatedBy;
	}
	
	public java.util.Date getUpdatedDate(){
		return updatedDate;
	}
	
	public void setUpdatedDate(java.util.Date updatedDate)
	{
		this.updatedDate = updatedDate;
	}
	
	public java.lang.String getUnitTypeName(){
		return unitTypeName;
	}
	
	public void setUnitTypeName(java.lang.String unitTypeName)
	{
		this.unitTypeName = unitTypeName;
	}

	@Override
    public GoodsDTO toDTO() {
        GoodsDTO goodsDTO = new GoodsDTO(); 
        goodsDTO.setGoodsId(this.goodsId);		
        goodsDTO.setCode(this.code);		
        goodsDTO.setName(this.name);		
        goodsDTO.setStatus(this.status);		
        goodsDTO.setUnitType(this.unitType);		
        goodsDTO.setGoodsType(this.goodsType);		
        goodsDTO.setIsSerial(this.isSerial);		
        goodsDTO.setOriginPrice(this.originPrice);		
        goodsDTO.setOriginSize(this.originSize);		
        goodsDTO.setWeight(this.weight);		
        goodsDTO.setVolumeOrigin(this.volumeOrigin);		
        goodsDTO.setVolumeReal(this.volumeReal);		
        goodsDTO.setDescription(this.description);		
        goodsDTO.setManufacturerId(this.manufacturerId);		
        goodsDTO.setProducingCountryId(this.producingCountryId);		
        goodsDTO.setManufacturerName(this.manufacturerName);		
        goodsDTO.setProducingCountryName(this.producingCountryName);		
        goodsDTO.setCreatedBy(this.createdBy);		
        goodsDTO.setCreatedDate(this.createdDate);		
        goodsDTO.setUpdatedBy(this.updatedBy);		
        goodsDTO.setUpdatedDate(this.updatedDate);		
        goodsDTO.setUnitTypeName(this.unitTypeName);		
        return goodsDTO;
    }
}
