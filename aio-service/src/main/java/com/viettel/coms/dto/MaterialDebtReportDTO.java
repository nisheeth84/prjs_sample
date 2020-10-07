/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.MerEntityBO;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 * @author thuannht
 */
@XmlRootElement(name = "MER_ENTITYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class MaterialDebtReportDTO extends ComsBaseFWDTO<MerEntityBO> {

//    private java.util.Date updatedDate;
//    private java.lang.Long stockCellId;
//    private java.lang.String stockCellCode;
    private java.lang.Long catProducingCountryId;
    private java.lang.Long parentMerEntityId;
    private java.lang.String catUnitName;
//    private java.util.Date importDate;
    private java.lang.String manufacturerName;
    private java.lang.String producingCountryName;
    private java.lang.Long catUnitId;
//    private java.lang.Long orderId;
    private java.lang.String cntContractCode;
    private java.lang.Long merEntityId;
    private java.lang.String serial;
    private java.lang.Long goodsId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String state;
    private java.lang.String status;
    private java.lang.Double amount;
    private java.lang.Long catManufacturerId;
    private java.lang.Long stockId;
    private java.lang.Long cntContractId;
    private java.lang.Long sysGroupId;
//    private java.lang.Long projectId;
    private java.lang.Long shipmentId;
    private java.lang.String partNumber;
    private java.lang.Double unitPrice;
    private java.lang.Double applyPrice;
    private java.util.Date exportDate;
    private java.lang.Long importStockTransId;
    private java.lang.Long departmentId;
    private java.lang.String departmentName;
    private java.lang.String constructionName;
    private java.lang.String constructionCode;
    private java.lang.Long constructionId;
    private java.lang.String sysUserName;
    private java.lang.Long sysUserId;
    private java.lang.String sourceType;
    private java.lang.Double totalMoney;
    private java.lang.String provinceName;
    private java.lang.Long provinceId;
    private String sysGroupName;
//    private Long sysGroupId;
    
    @Override
    public MerEntityBO toModel() {
        MerEntityBO merEntityBO = new MerEntityBO();
//        merEntityBO.setUpdatedDate(this.updatedDate);
//        merEntityBO.setStockCellId(this.stockCellId);
//        merEntityBO.setStockCellCode(this.stockCellCode);
        merEntityBO.setCatProducingCountryId(this.catProducingCountryId);
        merEntityBO.setParentMerEntityId(this.parentMerEntityId);
        merEntityBO.setCatUnitName(this.catUnitName);
//        merEntityBO.setImportDate(this.importDate);
        merEntityBO.setManufacturerName(this.manufacturerName);
        merEntityBO.setProducingCountryName(this.producingCountryName);
        merEntityBO.setCatUnitId(this.catUnitId);
//        merEntityBO.setOrderId(this.orderId);
        merEntityBO.setCntContractCode(this.cntContractCode);
        merEntityBO.setMerEntityId(this.merEntityId);
        merEntityBO.setSerial(this.serial);
        merEntityBO.setGoodsId(this.goodsId);
        merEntityBO.setGoodsCode(this.goodsCode);
        merEntityBO.setGoodsName(this.goodsName);
        merEntityBO.setState(this.state);
        merEntityBO.setStatus(this.status);
        merEntityBO.setAmount(this.amount);
        merEntityBO.setCatManufacturerId(this.catManufacturerId);
        merEntityBO.setStockId(this.stockId);
        merEntityBO.setCntContractId(this.cntContractId);
        merEntityBO.setSysGroupId(this.sysGroupId);
//        merEntityBO.setProjectId(this.projectId);
        merEntityBO.setShipmentId(this.shipmentId);
        merEntityBO.setPartNumber(this.partNumber);
        merEntityBO.setUnitPrice(this.unitPrice);
        merEntityBO.setApplyPrice(this.applyPrice);
        merEntityBO.setExportDate(this.exportDate);
        merEntityBO.setImportStockTransId(this.importStockTransId);

        return merEntityBO;
    }

//    public java.util.Date getUpdatedDate() {
//        return updatedDate;
//    }
//
//    public void setUpdatedDate(java.util.Date updatedDate) {
//        this.updatedDate = updatedDate;
//    }

//    public java.lang.Long getStockCellId() {
//        return stockCellId;
//    }
//
//    public void setStockCellId(java.lang.Long stockCellId) {
//        this.stockCellId = stockCellId;
//    }
//
//    public java.lang.String getStockCellCode() {
//        return stockCellCode;
//    }
//
//    public void setStockCellCode(java.lang.String stockCellCode) {
//        this.stockCellCode = stockCellCode;
//    }

    public java.lang.Long getCatProducingCountryId() {
        return catProducingCountryId;
    }

    public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
        this.catProducingCountryId = catProducingCountryId;
    }

    public java.lang.Long getParentMerEntityId() {
        return parentMerEntityId;
    }

    public void setParentMerEntityId(java.lang.Long parentMerEntityId) {
        this.parentMerEntityId = parentMerEntityId;
    }

    public java.lang.String getCatUnitName() {
        return catUnitName;
    }

    public void setCatUnitName(java.lang.String catUnitName) {
        this.catUnitName = catUnitName;
    }

//    public java.util.Date getImportDate() {
//        return importDate;
//    }
//
//    public void setImportDate(java.util.Date importDate) {
//        this.importDate = importDate;
//    }

    public java.lang.String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(java.lang.String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public java.lang.String getProducingCountryName() {
        return producingCountryName;
    }

    public void setProducingCountryName(java.lang.String producingCountryName) {
        this.producingCountryName = producingCountryName;
    }

    public java.lang.Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(java.lang.Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    //    @Override
//     public Long getFWModelId() {
//        return orderId;
//    }
//   
//    @Override
//    public String catchName() {
//        return getOrderId().toString();
//    }
//    public java.lang.Long getOrderId() {
//        return orderId;
//    }
//
//    public void setOrderId(java.lang.Long orderId) {
//        this.orderId = orderId;
//    }

    public java.lang.String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(java.lang.String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    @Override
    public Long getFWModelId() {
        return merEntityId;
    }

    @Override
    public String catchName() {
        return getMerEntityId().toString();
    }

    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    public java.lang.Long getCatManufacturerId() {
        return catManufacturerId;
    }

    public void setCatManufacturerId(java.lang.Long catManufacturerId) {
        this.catManufacturerId = catManufacturerId;
    }

    public java.lang.Long getStockId() {
        return stockId;
    }

    public void setStockId(java.lang.Long stockId) {
        this.stockId = stockId;
    }

    public java.lang.Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(java.lang.Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

//    public java.lang.Long getProjectId() {
//        return projectId;
//    }
//
//    public void setProjectId(java.lang.Long projectId) {
//        this.projectId = projectId;
//    }

    public java.lang.Long getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(java.lang.Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    public java.lang.String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(java.lang.String partNumber) {
        this.partNumber = partNumber;
    }

    public java.lang.Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(java.lang.Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public java.lang.Double getApplyPrice() {
        return applyPrice;
    }

    public void setApplyPrice(java.lang.Double applyPrice) {
        this.applyPrice = applyPrice;
    }

    public java.util.Date getExportDate() {
        return exportDate;
    }

    public void setExportDate(java.util.Date exportDate) {
        this.exportDate = exportDate;
    }

    public java.lang.Long getImportStockTransId() {
        return importStockTransId;
    }

    public void setImportStockTransId(java.lang.Long importStockTransId) {
        this.importStockTransId = importStockTransId;
    }

	public java.lang.Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(java.lang.Long departmentId) {
		this.departmentId = departmentId;
	}

	public java.lang.String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(java.lang.String departmentName) {
		this.departmentName = departmentName;
	}

	public java.lang.String getConstructionName() {
		return constructionName;
	}

	public void setConstructionName(java.lang.String constructionName) {
		this.constructionName = constructionName;
	}

	public java.lang.Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(java.lang.Long constructionId) {
		this.constructionId = constructionId;
	}

	public java.lang.String getSysUserName() {
		return sysUserName;
	}

	public void setSysUserName(java.lang.String sysUserName) {
		this.sysUserName = sysUserName;
	}

	public java.lang.Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(java.lang.Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	public java.lang.String getSourceType() {
		return sourceType;
	}

	public void setSourceType(java.lang.String sourceType) {
		this.sourceType = sourceType;
	}

	public java.lang.Double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(java.lang.Double totalMoney) {
		this.totalMoney = totalMoney;
	}

	public java.lang.String getProvinceName() {
		return provinceName;
	}

	public void setProvinceName(java.lang.String provinceName) {
		this.provinceName = provinceName;
	}

	public java.lang.Long getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(java.lang.Long provinceId) {
		this.provinceId = provinceId;
	}

	public java.lang.String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(java.lang.String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}
    
	
    

}
