/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ContractInformationDTO extends ComsBaseFWDTO<BaseFWModelImpl> {
	private Long cntContractId;
	private Long constructionTotalNum;// tổng số công trình
	private Long liquidateConstrNum; // số công trình đã nghiệm thu
	private Long onGoingConstrNum; // sô công trình đang thực hiện
	private Long notConstructedNum; // số công trình chưa thực hiện
	private Long paidConstrNum; // số công trình đã quyết toán
	private Long lateConstrNum; // số công trình chậm tiến độ
	private Long onScheduleConstrNum; // số công trình đúng tiến độ
	private Long pausedConstrNum; //số công trình đã tạm dừng
	
	public ContractInformationDTO() {
		super();
	}
	public Long getCntContractId() {
		return cntContractId;
	}
	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}
	public Long getConstructionTotalNum() {
		return constructionTotalNum;
	}
	public void setConstructionTotalNum(Long constructionTotalNum) {
		this.constructionTotalNum = constructionTotalNum;
	}
	public Long getLiquidateConstrNum() {
		return liquidateConstrNum;
	}
	public void setLiquidateConstrNum(Long liquidateConstrNum) {
		this.liquidateConstrNum = liquidateConstrNum;
	}
	public Long getOnGoingConstrNum() {
		return onGoingConstrNum;
	}
	public void setOnGoingConstrNum(Long onGoingConstrNum) {
		this.onGoingConstrNum = onGoingConstrNum;
	}
	public Long getNotConstructedNum() {
		return notConstructedNum;
	}
	public void setNotConstructedNum(Long notConstructedNum) {
		this.notConstructedNum = notConstructedNum;
	}
	public Long getPaidConstrNum() {
		return paidConstrNum;
	}
	public void setPaidConstrNum(Long paidConstrNum) {
		this.paidConstrNum = paidConstrNum;
	}
	public Long getLateConstrNum() {
		return lateConstrNum;
	}
	public void setLateConstrNum(Long lateConstrNum) {
		this.lateConstrNum = lateConstrNum;
	}
	public Long getOnScheduleConstrNum() {
		return onScheduleConstrNum;
	}
	public void setOnScheduleConstrNum(Long onScheduleConstrNum) {
		this.onScheduleConstrNum = onScheduleConstrNum;
	}
	public Long getPausedConstrNum() {
		return pausedConstrNum;
	}
	public void setPausedConstrNum(Long pausedConstrNum) {
		this.pausedConstrNum = pausedConstrNum;
	}
	
	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public BaseFWModelImpl toModel() {
		// TODO Auto-generated method stub
		return null;
	}

	
	
}
