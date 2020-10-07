package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;


/**
 * @author hoanm1
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class couponExportDTO extends WorkItemDTO{
	
	private String stockCode;
	private String code;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date realIeTransDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
	private String constructionCode;
	private String name;
	private String fullName;
	private String email;
	private String phoneNumber;
	private String stockName;
	private Long sysGroupId;
	private String employeeCode;
	private String loginName;
	private String cntContractCode;
//	private String catstationCode;
	private String keySearch;
	private String status;
	private Long sysUserId;
	private String codeParam;
	private String parType;
	
	private String realDate;
	private String comfirm;
	private String contractCode;
	private String catStationCode;
	
	private String Key;
//	hoanm1_20190214_start
	private String comfirmExcel;
	
	public String getComfirmExcel() {
		return comfirmExcel;
	}
	public void setComfirmExcel(String comfirmExcel) {
		this.comfirmExcel = comfirmExcel;
	}
	private List<Integer> listConfirm;
	public List<Integer> getListConfirm() {
		return listConfirm;
	}
	public void setListConfirm(List<Integer> listConfirm) {
		this.listConfirm = listConfirm;
	}
//	hoanm1_20190214_end
	
	public Date getDateTo() {
		return dateTo;
	}
	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}
	public Date getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}
	public String getKey() {
		return Key;
	}
	public void setKey(String key) {
		Key = key;
	}
	public String getCatStationCode() {
		return catStationCode;
	}
	public void setCatStationCode(String catStationCode) {
		this.catStationCode = catStationCode;
	}
	public String getContractCode() {
		return contractCode;
	}
	public void setContractCode(String contractCode) {
		this.contractCode = contractCode;
	}
	public String getComfirm() {
		return comfirm;
	}
	public void setComfirm(String comfirm) {
		this.comfirm = comfirm;
	}
	public String getRealDate() {
		return realDate;
	}
	public void setRealDate(String realDate) {
		this.realDate = realDate;
	}
	public String getParType() {
		return parType;
	}
	public void setParType(String parType) {
		this.parType = parType;
	}
	public String getCodeParam() {
		return codeParam;
	}
	public void setCodeParam(String codeParam) {
		this.codeParam = codeParam;
	}
	public Long getSysUserId() {
		return sysUserId;
	}
	public void setSysUserId(Long sysUserId) {
		this.sysUserId = sysUserId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCntContractCode() {
		return cntContractCode;
	}
	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}
	public String getKeySearch() {
		return keySearch;
	}
	public void setKeySearch(String keySearch) {
		this.keySearch = keySearch;
	}
	public String getEmployeeCode() {
		return employeeCode;
	}
	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public Long getSysGroupId() {
		return sysGroupId;
	}
	public void setSysGroupId(Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}
	public String getStockName() {
		return stockName;
	}
	public void setStockName(String stockName) {
		this.stockName = stockName;
	}
	public String getStockCode() {
		return stockCode;
	}
	public void setStockCode(String stockCode) {
		this.stockCode = stockCode;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Date getRealIeTransDate() {
		return realIeTransDate;
	}
	public void setRealIeTransDate(Date realIeTransDate) {
		this.realIeTransDate = realIeTransDate;
	}
	public String getConstructionCode() {
		return constructionCode;
	}
	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
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
	
	
	
	
}
