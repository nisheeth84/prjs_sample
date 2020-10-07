package com.viettel.aio.dto;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.aio.bo.AIOMonthPlanBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

@XmlRootElement(name = "AIO_MONTH_PLANBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOMonthPlanDTO extends ComsBaseFWDTO<AIOMonthPlanBO>{

	private Long aioMonthPlanId;
	private String description;
	private String month;
	private String status;
	private String year;
	private List<AIOMonthPlanDetailDTO> listMonthplanDetail;
	private Boolean isCreatNew;
	
	public Boolean getIsCreatNew() {
		return isCreatNew;
	}

	public void setIsCreatNew(Boolean isCreatNew) {
		this.isCreatNew = isCreatNew;
	}

	public List<AIOMonthPlanDetailDTO> getListMonthplanDetail() {
		return listMonthplanDetail;
	}

	public void setListMonthplanDetail(List<AIOMonthPlanDetailDTO> listMonthplanDetail) {
		this.listMonthplanDetail = listMonthplanDetail;
	}

	public Long getAioMonthPlanId() {
		return aioMonthPlanId;
	}

	public void setAioMonthPlanId(Long aioMonthPlanId) {
		this.aioMonthPlanId = aioMonthPlanId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return aioMonthPlanId.toString();
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return aioMonthPlanId;
	}

	@Override
	public AIOMonthPlanBO toModel() {
		// TODO Auto-generated method stub
		AIOMonthPlanBO aIOMonthPlanBO = new AIOMonthPlanBO();
		aIOMonthPlanBO.setAioMonthPlanId(this.aioMonthPlanId);
		aIOMonthPlanBO.setDescription(this.description);
		aIOMonthPlanBO.setMonth(this.month);
		aIOMonthPlanBO.setStatus(this.status);
		aIOMonthPlanBO.setYear(this.year);
		return aIOMonthPlanBO;
	}

	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateFrom;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateTo;

	public Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}
	
	private String sysGroupName;
	private Double thucHien1Ngay;
	private Double thucHien2Ngay;
	private Double thucHien3Ngay;
	private Double valueChartColumn;
	

	public Double getValueChartColumn() {
		return valueChartColumn;
	}

	public void setValueChartColumn(Double valueChartColumn) {
		this.valueChartColumn = valueChartColumn;
	}

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	public Double getThucHien1Ngay() {
		return thucHien1Ngay;
	}

	public void setThucHien1Ngay(Double thucHien1Ngay) {
		this.thucHien1Ngay = thucHien1Ngay;
	}

	public Double getThucHien2Ngay() {
		return thucHien2Ngay;
	}

	public void setThucHien2Ngay(Double thucHien2Ngay) {
		this.thucHien2Ngay = thucHien2Ngay;
	}

	public Double getThucHien3Ngay() {
		return thucHien3Ngay;
	}

	public void setThucHien3Ngay(Double thucHien3Ngay) {
		this.thucHien3Ngay = thucHien3Ngay;
	}
	
	
}
