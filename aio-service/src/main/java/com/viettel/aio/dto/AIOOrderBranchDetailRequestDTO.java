
package com.viettel.aio.dto;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.aio.bo.AIOOrderBranchDetailRequestBO;
import com.viettel.coms.dto.ComsBaseFWDTO;

@XmlRootElement(name = "AIO_ORDER_BRANCH_DETAIL_REQUESTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrderBranchDetailRequestDTO extends ComsBaseFWDTO<AIOOrderBranchDetailRequestBO>{

	private Long aioOrderBranchDetailRequestId;
	private Long orderBranchDetailId;
	private Long orderBranchId;
	private Long orderRequestId;
	private Long orderRequestDetailId;
	private Double amount;
	private Double totalAmount;
	
	public Long getAioOrderBranchDetailRequestId() {
		return aioOrderBranchDetailRequestId;
	}

	public void setAioOrderBranchDetailRequestId(Long aioOrderBranchDetailRequestId) {
		this.aioOrderBranchDetailRequestId = aioOrderBranchDetailRequestId;
	}

	public Long getOrderBranchDetailId() {
		return orderBranchDetailId;
	}

	public void setOrderBranchDetailId(Long orderBranchDetailId) {
		this.orderBranchDetailId = orderBranchDetailId;
	}

	public Long getOrderBranchId() {
		return orderBranchId;
	}

	public void setOrderBranchId(Long orderBranchId) {
		this.orderBranchId = orderBranchId;
	}

	public Long getOrderRequestId() {
		return orderRequestId;
	}

	public void setOrderRequestId(Long orderRequestId) {
		this.orderRequestId = orderRequestId;
	}

	public Long getOrderRequestDetailId() {
		return orderRequestDetailId;
	}

	public void setOrderRequestDetailId(Long orderRequestDetailId) {
		this.orderRequestDetailId = orderRequestDetailId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return getAioOrderBranchDetailRequestId().toString();
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return aioOrderBranchDetailRequestId;
	}

	@Override
	public AIOOrderBranchDetailRequestBO toModel() {
		AIOOrderBranchDetailRequestBO bo = new AIOOrderBranchDetailRequestBO();
		bo.setAioOrderBranchDetailRequestId(this.aioOrderBranchDetailRequestId);
		bo.setOrderBranchDetailId(this.orderBranchDetailId);
		bo.setOrderBranchId(this.orderBranchId);
		bo.setOrderRequestId(this.orderRequestId);
		bo.setOrderRequestDetailId(this.orderRequestDetailId);
		bo.setAmount(this.amount);
		bo.setTotalAmount(this.totalAmount);
		bo.setGoodsId(this.goodsId);
		return bo;
	}

	//Huypq-20190927-start
	private Long goodsId;

	public Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(Long goodsId) {
		this.goodsId = goodsId;
	}
	
	
	//Huy-end
	
}
