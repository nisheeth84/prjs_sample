//package com.viettel.aio.dto;
//
//import java.util.List;
//
//import javax.xml.bind.annotation.XmlRootElement;
//
//import org.codehaus.jackson.annotate.JsonIgnoreProperties;
//
////import com.viettel.aio.bo.StockTransDetailBO;
//
////import org.codehaus.jackson.annotate.JsonProperty;
////import org.codehaus.jackson.map.annotate.JsonDeserialize;
////import org.codehaus.jackson.map.annotate.JsonSerialize;
////
////
////import com.viettel.erp.utils.JsonDateDeserializer;
////import com.viettel.erp.utils.JsonDateSerializerDate;
//
//public class AIOMerEntityDTO  {
//
//	// private String quantity;--Long
//	private String cntConstractCode;
//	// private Long partNumber;---String
//	private String manufactureName;
//	private String productionCountryName;
//	private String stockType;
//	private String constructionCode;
//	private String goodsIsSerial;
//	private Long numbeRepository;
//	// aio_20190322_start
//	private Double price;
//	private String cellCode;
//	private Long synStockTransId;
//	private Long synStockTransDetailId;
//	private Long synStockTransDetailSerialId;
//	private String goodState;
//	private Double quantityImport;
//	private Double quantityIssue;
//
//	private java.lang.Long merEntityId;
//	private java.lang.String serial;
//	private java.lang.Long goodsId;
//	private java.lang.String goodsName;
//	private java.lang.String goodsCode;
//	private java.lang.String state;
//	private java.lang.String status;
//	private java.lang.Double amount;
//	private java.lang.Long catManufacturerId;
//	private java.lang.Long catProducingCountryId;
//	private java.lang.Long stockId;
//	private java.lang.Long cntContractId;
//	private java.lang.Long sysGroupId;
//	private java.lang.Long projectId;
//	private java.lang.Long shipmentId;
//	private java.lang.String partNumber;
//	private java.lang.Double unitPrice;
//	private java.lang.Double applyPrice;
//	private java.lang.String isSerial;
//	private java.lang.String manufacturerName;
//	private java.lang.String producingCountryName;
//	private java.lang.String catUnitName;
//	private java.lang.Long catUnitId;
//	private java.lang.String stockName;
//	private java.lang.String serialString;
//	private String[] listSerial;
//	private Long orderId;
//	private java.lang.String code;
//	private java.lang.String quantity;
//	private java.lang.Long assetManagementRequestId;
//	private List<AIOMerEntityDTO> listGoodDetail;
//	private java.lang.String contractCode;
//	private java.lang.String cntContractCode;
//	private java.util.Date updatedDate;
//	private java.lang.Long stockCellId;
//	private java.lang.String stockCellCode;
//	private java.lang.Long parentMerEntityId;
//	private java.lang.Long importStockTransId;
//	private java.lang.String goodsState;
//
//	public String getCntConstractCode() {
//		return cntConstractCode;
//	}
//
//	public void setCntConstractCode(String cntConstractCode) {
//		this.cntConstractCode = cntConstractCode;
//	}
//
//	public String getManufactureName() {
//		return manufactureName;
//	}
//
//	public void setManufactureName(String manufactureName) {
//		this.manufactureName = manufactureName;
//	}
//
//	public String getProductionCountryName() {
//		return productionCountryName;
//	}
//
//	public void setProductionCountryName(String productionCountryName) {
//		this.productionCountryName = productionCountryName;
//	}
//
//	public String getStockType() {
//		return stockType;
//	}
//
//	public void setStockType(String stockType) {
//		this.stockType = stockType;
//	}
//
//	public String getConstructionCode() {
//		return constructionCode;
//	}
//
//	public void setConstructionCode(String constructionCode) {
//		this.constructionCode = constructionCode;
//	}
//
//	public String getGoodsIsSerial() {
//		return goodsIsSerial;
//	}
//
//	public void setGoodsIsSerial(String goodsIsSerial) {
//		this.goodsIsSerial = goodsIsSerial;
//	}
//
//	public Long getNumbeRepository() {
//		return numbeRepository;
//	}
//
//	public void setNumbeRepository(Long numbeRepository) {
//		this.numbeRepository = numbeRepository;
//	}
//
//	public Double getPrice() {
//		return price;
//	}
//
//	public void setPrice(Double price) {
//		this.price = price;
//	}
//
//	public String getCellCode() {
//		return cellCode;
//	}
//
//	public void setCellCode(String cellCode) {
//		this.cellCode = cellCode;
//	}
//
//	public Long getSynStockTransId() {
//		return synStockTransId;
//	}
//
//	public void setSynStockTransId(Long synStockTransId) {
//		this.synStockTransId = synStockTransId;
//	}
//
//	public Long getSynStockTransDetailId() {
//		return synStockTransDetailId;
//	}
//
//	public void setSynStockTransDetailId(Long synStockTransDetailId) {
//		this.synStockTransDetailId = synStockTransDetailId;
//	}
//
//	public Long getSynStockTransDetailSerialId() {
//		return synStockTransDetailSerialId;
//	}
//
//	public void setSynStockTransDetailSerialId(Long synStockTransDetailSerialId) {
//		this.synStockTransDetailSerialId = synStockTransDetailSerialId;
//	}
//
//	public String getGoodState() {
//		return goodState;
//	}
//
//	public void setGoodState(String goodState) {
//		this.goodState = goodState;
//	}
//
//	public Double getQuantityImport() {
//		return quantityImport;
//	}
//
//	public void setQuantityImport(Double quantityImport) {
//		this.quantityImport = quantityImport;
//	}
//
//	public Double getQuantityIssue() {
//		return quantityIssue;
//	}
//
//	public void setQuantityIssue(Double quantityIssue) {
//		this.quantityIssue = quantityIssue;
//	}
//
//	public java.lang.Long getMerEntityId() {
//		return merEntityId;
//	}
//
//	public void setMerEntityId(java.lang.Long merEntityId) {
//		this.merEntityId = merEntityId;
//	}
//
//	public java.lang.String getSerial() {
//		return serial;
//	}
//
//	public void setSerial(java.lang.String serial) {
//		this.serial = serial;
//	}
//
//	public java.lang.Long getGoodsId() {
//		return goodsId;
//	}
//
//	public void setGoodsId(java.lang.Long goodsId) {
//		this.goodsId = goodsId;
//	}
//
//	public java.lang.String getGoodsName() {
//		return goodsName;
//	}
//
//	public void setGoodsName(java.lang.String goodsName) {
//		this.goodsName = goodsName;
//	}
//
//	public java.lang.String getGoodsCode() {
//		return goodsCode;
//	}
//
//	public void setGoodsCode(java.lang.String goodsCode) {
//		this.goodsCode = goodsCode;
//	}
//
//	public java.lang.String getState() {
//		return state;
//	}
//
//	public void setState(java.lang.String state) {
//		this.state = state;
//	}
//
//	public java.lang.String getStatus() {
//		return status;
//	}
//
//	public void setStatus(java.lang.String status) {
//		this.status = status;
//	}
//
//	public java.lang.Double getAmount() {
//		return amount;
//	}
//
//	public void setAmount(java.lang.Double amount) {
//		this.amount = amount;
//	}
//
//	public java.lang.Long getCatManufacturerId() {
//		return catManufacturerId;
//	}
//
//	public void setCatManufacturerId(java.lang.Long catManufacturerId) {
//		this.catManufacturerId = catManufacturerId;
//	}
//
//	public java.lang.Long getCatProducingCountryId() {
//		return catProducingCountryId;
//	}
//
//	public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
//		this.catProducingCountryId = catProducingCountryId;
//	}
//
//	public java.lang.Long getStockId() {
//		return stockId;
//	}
//
//	public void setStockId(java.lang.Long stockId) {
//		this.stockId = stockId;
//	}
//
//	public java.lang.Long getCntContractId() {
//		return cntContractId;
//	}
//
//	public void setCntContractId(java.lang.Long cntContractId) {
//		this.cntContractId = cntContractId;
//	}
//
//	public java.lang.Long getSysGroupId() {
//		return sysGroupId;
//	}
//
//	public void setSysGroupId(java.lang.Long sysGroupId) {
//		this.sysGroupId = sysGroupId;
//	}
//
//	public java.lang.Long getProjectId() {
//		return projectId;
//	}
//
//	public void setProjectId(java.lang.Long projectId) {
//		this.projectId = projectId;
//	}
//
//	public java.lang.Long getShipmentId() {
//		return shipmentId;
//	}
//
//	public void setShipmentId(java.lang.Long shipmentId) {
//		this.shipmentId = shipmentId;
//	}
//
//	public java.lang.String getPartNumber() {
//		return partNumber;
//	}
//
//	public void setPartNumber(java.lang.String partNumber) {
//		this.partNumber = partNumber;
//	}
//
//	public java.lang.Double getUnitPrice() {
//		return unitPrice;
//	}
//
//	public void setUnitPrice(java.lang.Double unitPrice) {
//		this.unitPrice = unitPrice;
//	}
//
//	public java.lang.Double getApplyPrice() {
//		return applyPrice;
//	}
//
//	public void setApplyPrice(java.lang.Double applyPrice) {
//		this.applyPrice = applyPrice;
//	}
//
//	public java.lang.String getIsSerial() {
//		return isSerial;
//	}
//
//	public void setIsSerial(java.lang.String isSerial) {
//		this.isSerial = isSerial;
//	}
//
//	public java.lang.String getManufacturerName() {
//		return manufacturerName;
//	}
//
//	public void setManufacturerName(java.lang.String manufacturerName) {
//		this.manufacturerName = manufacturerName;
//	}
//
//	public java.lang.String getProducingCountryName() {
//		return producingCountryName;
//	}
//
//	public void setProducingCountryName(java.lang.String producingCountryName) {
//		this.producingCountryName = producingCountryName;
//	}
//
//	public java.lang.String getCatUnitName() {
//		return catUnitName;
//	}
//
//	public void setCatUnitName(java.lang.String catUnitName) {
//		this.catUnitName = catUnitName;
//	}
//
//	public java.lang.Long getCatUnitId() {
//		return catUnitId;
//	}
//
//	public void setCatUnitId(java.lang.Long catUnitId) {
//		this.catUnitId = catUnitId;
//	}
//
//	public java.lang.String getStockName() {
//		return stockName;
//	}
//
//	public void setStockName(java.lang.String stockName) {
//		this.stockName = stockName;
//	}
//
//	public java.lang.String getSerialString() {
//		return serialString;
//	}
//
//	public void setSerialString(java.lang.String serialString) {
//		this.serialString = serialString;
//	}
//
//	public String[] getListSerial() {
//		return listSerial;
//	}
//
//	public void setListSerial(String[] listSerial) {
//		this.listSerial = listSerial;
//	}
//
//	public Long getOrderId() {
//		return orderId;
//	}
//
//	public void setOrderId(Long orderId) {
//		this.orderId = orderId;
//	}
//
//	public java.lang.String getCode() {
//		return code;
//	}
//
//	public void setCode(java.lang.String code) {
//		this.code = code;
//	}
//
//	public java.lang.String getQuantity() {
//		return quantity;
//	}
//
//	public void setQuantity(java.lang.String quantity) {
//		this.quantity = quantity;
//	}
//
//	public java.lang.Long getAssetManagementRequestId() {
//		return assetManagementRequestId;
//	}
//
//	public void setAssetManagementRequestId(
//			java.lang.Long assetManagementRequestId) {
//		this.assetManagementRequestId = assetManagementRequestId;
//	}
//
//	public List<AIOMerEntityDTO> getListGoodDetail() {
//		return listGoodDetail;
//	}
//
//	public void setListGoodDetail(List<AIOMerEntityDTO> listGoodDetail) {
//		this.listGoodDetail = listGoodDetail;
//	}
//
//	public java.lang.String getContractCode() {
//		return contractCode;
//	}
//
//	public void setContractCode(java.lang.String contractCode) {
//		this.contractCode = contractCode;
//	}
//
//	public java.lang.String getCntContractCode() {
//		return cntContractCode;
//	}
//
//	public void setCntContractCode(java.lang.String cntContractCode) {
//		this.cntContractCode = cntContractCode;
//	}
//
//	public java.util.Date getUpdatedDate() {
//		return updatedDate;
//	}
//
//	public void setUpdatedDate(java.util.Date updatedDate) {
//		this.updatedDate = updatedDate;
//	}
//
//	public java.lang.Long getStockCellId() {
//		return stockCellId;
//	}
//
//	public void setStockCellId(java.lang.Long stockCellId) {
//		this.stockCellId = stockCellId;
//	}
//
//	public java.lang.String getStockCellCode() {
//		return stockCellCode;
//	}
//
//	public void setStockCellCode(java.lang.String stockCellCode) {
//		this.stockCellCode = stockCellCode;
//	}
//
//	public java.lang.Long getParentMerEntityId() {
//		return parentMerEntityId;
//	}
//
//	public void setParentMerEntityId(java.lang.Long parentMerEntityId) {
//		this.parentMerEntityId = parentMerEntityId;
//	}
//
//	public java.lang.Long getImportStockTransId() {
//		return importStockTransId;
//	}
//
//	public void setImportStockTransId(java.lang.Long importStockTransId) {
//		this.importStockTransId = importStockTransId;
//	}
//
//	public java.lang.String getGoodsState() {
//		return goodsState;
//	}
//
//	public void setGoodsState(java.lang.String goodsState) {
//		this.goodsState = goodsState;
//	}
//
//}

package com.viettel.aio.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.aio.bo.AIOMerEntityBO;

/**
 *
 * @author hailh10
 */
@XmlRootElement(name = "AIO_MER_ENTITYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOMerEntityDTO extends ComsBaseFWDTO<AIOMerEntityBO> {

	// private String quantity;--Long
	private String cntConstractCode;
	// private Long partNumber;---String
	private String manufactureName;
	private String productionCountryName;
	private String stockType;
	private String constructionCode;
	private String goodsIsSerial;
	private Long numbeRepository;
	// aio_20190322_start
	private Double price;
	private String cellCode;
	private Long synStockTransId;
	private Long synStockTransDetailId;
	private Long synStockTransDetailSerialId;
	private String goodState;
	private Double quantityImport;
	private Double quantityIssue;

	private java.lang.Long merEntityId;
	private java.lang.String serial;
	private java.lang.Long goodsId;
	private java.lang.String goodsName;
	private java.lang.String goodsCode;
	private java.lang.String state;
	private java.lang.String status;
	private java.lang.Double amount;
	private java.lang.Long catManufacturerId;
	private java.lang.Long catProducingCountryId;
	private java.lang.Long stockId;
	private java.lang.Long cntContractId;
	private java.lang.Long sysGroupId;
	private java.lang.Long projectId;
	private java.lang.Long shipmentId;
	private java.lang.String partNumber;
	private java.lang.Double unitPrice;
	private java.lang.Double applyPrice;
	private java.lang.String isSerial;
	private java.lang.String manufacturerName;
	private java.lang.String producingCountryName;
	private java.lang.String catUnitName;
	private java.lang.Long catUnitId;
	private java.lang.String stockName;
	private java.lang.String serialString;
	private String[] listSerial;
	private Long orderId;
	private java.lang.String code;
	private java.lang.String quantity;
	private java.lang.Long assetManagementRequestId;
	private List<AIOMerEntityDTO> listGoodDetail;
	private java.lang.String contractCode;
	private java.lang.String cntContractCode;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date startDate;

	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date endDate;
	private String text;
	private int start;
	private int maxResult;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date importDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date updatedDate;
	private java.lang.Long stockCellId;
	private java.lang.String stockCellCode;
	private java.lang.Long parentMerEntityId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date exportDate;
	private java.lang.Long importStockTransId;
	private java.lang.String goodsState;

	//VietNT_07/08/2019_start
	private Long guaranteeType;
	private String guaranteeTypeName;
	private Long guaranteeTime;
	//VietNT_end

	// Huy-end
	@Override
	public AIOMerEntityBO toModel() {
		AIOMerEntityBO merEntityBO = new AIOMerEntityBO();
		merEntityBO.setMerEntityId(this.merEntityId);
		merEntityBO.setSerial(this.serial);
		merEntityBO.setGoodsId(this.goodsId);
		merEntityBO.setGoodsCode(this.goodsCode);
		merEntityBO.setGoodsName(this.goodsName);
		merEntityBO.setState(this.state);
		merEntityBO.setStatus(this.status);
		merEntityBO.setAmount(this.amount);
		merEntityBO.setCatManufacturerId(this.catManufacturerId);
		merEntityBO.setCatProducingCountryId(this.catProducingCountryId);
		merEntityBO.setStockId(this.stockId);
		merEntityBO.setCntContractId(this.cntContractId);
		merEntityBO.setSysGroupId(this.sysGroupId);
		merEntityBO.setProjectId(this.projectId);
		merEntityBO.setShipmentId(this.shipmentId);
		merEntityBO.setPartNumber(this.partNumber);
		merEntityBO.setUnitPrice(this.unitPrice);
		merEntityBO.setApplyPrice(this.applyPrice);
		merEntityBO.setManufacturerName(this.manufacturerName);
		merEntityBO.setProducingCountryName(this.producingCountryName);
		merEntityBO.setCatUnitName(this.catUnitName);
		merEntityBO.setCatUnitId(this.catUnitId);
		merEntityBO.setOrderId(this.orderId);
		merEntityBO.setCntContractCode(this.cntContractCode);
		merEntityBO.setUpdatedDate(this.updatedDate);
		merEntityBO.setImportDate(this.importDate);
		merEntityBO.setStockCellId(this.stockCellId);
		merEntityBO.setStockCellCode(this.stockCellCode);
		merEntityBO.setParentMerEntityId(this.parentMerEntityId);
		merEntityBO.setExportDate(this.exportDate);
		merEntityBO.setImportStockTransId(this.importStockTransId);
		return merEntityBO;
	}

	public java.lang.String getGoodsState() {
		return goodsState;
	}

	public void setGoodsState(java.lang.String goodsState) {
		this.goodsState = goodsState;
	}

	public java.lang.String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(java.lang.String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public java.lang.String getContractCode() {
		return contractCode;
	}

	public void setContractCode(java.lang.String contractCode) {
		this.contractCode = contractCode;
	}

	public List<AIOMerEntityDTO> getListGoodDetail() {
		return listGoodDetail;
	}

	public void setListGoodDetail(List<AIOMerEntityDTO> listGoodDetail) {
		this.listGoodDetail = listGoodDetail;
	}

	public java.lang.String getCode() {
		return code;
	}

	public void setCode(java.lang.String code) {
		this.code = code;
	}

	public java.lang.String getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.String quantity) {
		this.quantity = quantity;
	}

	public java.lang.Long getAssetManagementRequestId() {
		return assetManagementRequestId;
	}

	public void setAssetManagementRequestId(
			java.lang.Long assetManagementRequestId) {
		this.assetManagementRequestId = assetManagementRequestId;
	}

	public java.lang.Long getOrderId() {
		return orderId;
	}

	public void setOrderId(java.lang.Long orderId) {
		this.orderId = orderId;
	}

	public java.util.Date getStartDate() {
		return startDate;
	}

	public void setStartDate(java.util.Date startDate) {
		this.startDate = startDate;
	}

	public java.util.Date getEndDate() {
		return endDate;
	}

	public void setEndDate(java.util.Date endDate) {
		this.endDate = endDate;
	}

	public String[] getListSerial() {
		return listSerial;
	}

	public void setListSerial(String[] listSerial) {
		this.listSerial = listSerial;
	}

	public java.lang.String getSerialString() {
		return serialString;
	}

	public void setSerialString(java.lang.String serialString) {
		this.serialString = serialString;
	}

	public java.lang.String getStockName() {
		return stockName;
	}

	public void setStockName(java.lang.String stockName) {
		this.stockName = stockName;
	}

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

	public java.lang.String getCatUnitName() {
		return catUnitName;
	}

	public void setCatUnitName(java.lang.String catUnitName) {
		this.catUnitName = catUnitName;
	}

	public java.lang.Long getCatUnitId() {
		return catUnitId;
	}

	public void setCatUnitId(java.lang.Long catUnitId) {
		this.catUnitId = catUnitId;
	}

	public java.lang.String getIsSerial() {
		return isSerial;
	}

	public void setIsSerial(java.lang.String isSerial) {
		this.isSerial = isSerial;
	}

	@JsonProperty("merEntityId")
	public java.lang.Long getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(java.lang.Long merEntityId) {
		this.merEntityId = merEntityId;
	}

	@JsonProperty("serial")
	public java.lang.String getSerial() {
		return serial;
	}

	public void setSerial(java.lang.String serial) {
		this.serial = serial;
	}

	@JsonProperty("goodsId")
	public java.lang.Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(java.lang.Long goodsId) {
		this.goodsId = goodsId;
	}

	@JsonProperty("goodsCode")
	public java.lang.String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(java.lang.String goodsCode) {
		this.goodsCode = goodsCode;
	}

	@JsonProperty("goodsName")
	public java.lang.String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(java.lang.String goodsName) {
		this.goodsName = goodsName;
	}

	@JsonProperty("state")
	public java.lang.String getState() {
		return state;
	}

	public void setState(java.lang.String state) {
		this.state = state;
	}

	@JsonProperty("status")
	public java.lang.String getStatus() {
		return status;
	}

	public void setStatus(java.lang.String status) {
		this.status = status;
	}

	@JsonProperty("amount")
	public java.lang.Double getAmount() {
		return amount;
	}

	public void setAmount(java.lang.Double amount) {
		this.amount = amount;
	}

	@JsonProperty("catManufacturerId")
	public java.lang.Long getCatManufacturerId() {
		return catManufacturerId;
	}

	public void setCatManufacturerId(java.lang.Long catManufacturerId) {
		this.catManufacturerId = catManufacturerId;
	}

	@JsonProperty("catProducingCountryId")
	public java.lang.Long getCatProducingCountryId() {
		return catProducingCountryId;
	}

	public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
		this.catProducingCountryId = catProducingCountryId;
	}

	@JsonProperty("stockId")
	public java.lang.Long getStockId() {
		return stockId;
	}

	public void setStockId(java.lang.Long stockId) {
		this.stockId = stockId;
	}

	@JsonProperty("cntContractId")
	public java.lang.Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(java.lang.Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	@JsonProperty("sysGroupId")
	public java.lang.Long getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(java.lang.Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	@JsonProperty("projectId")
	public java.lang.Long getProjectId() {
		return projectId;
	}

	public void setProjectId(java.lang.Long projectId) {
		this.projectId = projectId;
	}

	@JsonProperty("shipmentId")
	public java.lang.Long getShipmentId() {
		return shipmentId;
	}

	public void setShipmentId(java.lang.Long shipmentId) {
		this.shipmentId = shipmentId;
	}

	@JsonProperty("partNumber")
	public java.lang.String getPartNumber() {
		return partNumber;
	}

	public void setPartNumber(java.lang.String partNumber) {
		this.partNumber = partNumber;
	}

	@JsonProperty("unitPrice")
	public java.lang.Double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(java.lang.Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	@JsonProperty("applyPrice")
	public java.lang.Double getApplyPrice() {
		return applyPrice;
	}

	public void setApplyPrice(java.lang.Double applyPrice) {
		this.applyPrice = applyPrice;
	}

	public java.lang.Long getParentMerEntityId() {
		return parentMerEntityId;
	}

	@JsonProperty("parentMerEntityId")
	public void setParentMerEntityId(java.lang.Long parentMerEntityId) {
		this.parentMerEntityId = parentMerEntityId;
	}

	@Override
	public String catchName() {
		return getMerEntityId().toString();
	}

	@Override
	public Long getFWModelId() {
		return merEntityId;
	}

	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public java.util.Date getImportDate() {
		return importDate;
	}

	public void setImportDate(java.util.Date importDate) {
		this.importDate = importDate;
	}

	public java.lang.Long getStockCellId() {
		return stockCellId;
	}

	public void setStockCellId(java.lang.Long stockCellId) {
		this.stockCellId = stockCellId;
	}

	public java.lang.String getStockCellCode() {
		return stockCellCode;
	}

	public void setStockCellCode(java.lang.String stockCellCode) {
		this.stockCellCode = stockCellCode;
	}

	@JsonProperty("exportDate")
	public java.util.Date getExportDate() {
		return exportDate;
	}

	public void setExportDate(java.util.Date exportDate) {
		this.exportDate = exportDate;
	}

	@JsonProperty("importStockTransId")
	public java.lang.Long getImportStockTransId() {
		return importStockTransId;
	}

	public void setImportStockTransId(java.lang.Long importStockTransId) {
		this.importStockTransId = importStockTransId;
	}

	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}

	public String getCntConstractCode() {
		return cntConstractCode;
	}

	public void setCntConstractCode(String cntConstractCode) {
		this.cntConstractCode = cntConstractCode;
	}

	public String getManufactureName() {
		return manufactureName;
	}

	public void setManufactureName(String manufactureName) {
		this.manufactureName = manufactureName;
	}

	public String getProductionCountryName() {
		return productionCountryName;
	}

	public void setProductionCountryName(String productionCountryName) {
		this.productionCountryName = productionCountryName;
	}

	public String getStockType() {
		return stockType;
	}

	public void setStockType(String stockType) {
		this.stockType = stockType;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public Long getNumbeRepository() {
		return numbeRepository;
	}

	public void setNumbeRepository(Long numbeRepository) {
		this.numbeRepository = numbeRepository;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getCellCode() {
		return cellCode;
	}

	public void setCellCode(String cellCode) {
		this.cellCode = cellCode;
	}

	public Long getSynStockTransId() {
		return synStockTransId;
	}

	public void setSynStockTransId(Long synStockTransId) {
		this.synStockTransId = synStockTransId;
	}

	public Long getSynStockTransDetailId() {
		return synStockTransDetailId;
	}

	public void setSynStockTransDetailId(Long synStockTransDetailId) {
		this.synStockTransDetailId = synStockTransDetailId;
	}

	public Long getSynStockTransDetailSerialId() {
		return synStockTransDetailSerialId;
	}

	public void setSynStockTransDetailSerialId(Long synStockTransDetailSerialId) {
		this.synStockTransDetailSerialId = synStockTransDetailSerialId;
	}

	public String getGoodState() {
		return goodState;
	}

	public void setGoodState(String goodState) {
		this.goodState = goodState;
	}

	public Double getQuantityImport() {
		return quantityImport;
	}

	public void setQuantityImport(Double quantityImport) {
		this.quantityImport = quantityImport;
	}

	public Double getQuantityIssue() {
		return quantityIssue;
	}

	public void setQuantityIssue(Double quantityIssue) {
		this.quantityIssue = quantityIssue;
	}

	public int getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(int maxResult) {
		this.maxResult = maxResult;
	}

	//HuyPQ-20190508-start
	private String sysGroupCode;
	private String sysGroupName;

	public String getSysGroupCode() {
		return sysGroupCode;
	}

	public void setSysGroupCode(String sysGroupCode) {
		this.sysGroupCode = sysGroupCode;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}
	
	//HuyPQ-end

	public Long getGuaranteeType() {
		return guaranteeType;
	}

	public void setGuaranteeType(Long guaranteeType) {
		this.guaranteeType = guaranteeType;
	}

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
}
