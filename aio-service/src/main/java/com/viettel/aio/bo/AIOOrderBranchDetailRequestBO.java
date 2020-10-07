
package com.viettel.aio.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.viettel.aio.dto.AIOOrderBranchDetailRequestDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "AIO_ORDER_BRANCH_DETAIL_REQUEST")
public class AIOOrderBranchDetailRequestBO extends BaseFWModelImpl {

	private Long aioOrderBranchDetailRequestId;
	private Long orderBranchDetailId;
	private Long orderBranchId;
	private Long orderRequestId;
	private Long orderRequestDetailId;
	private Double amount;
	private Double totalAmount;
	
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_BRANCH_DETAIL_REQUEST_SEQ")})
	@Column(name = "AIO_ORDER_BRANCH_DETAIL_REQUEST_ID")
	public Long getAioOrderBranchDetailRequestId() {
		return aioOrderBranchDetailRequestId;
	}



	public void setAioOrderBranchDetailRequestId(Long aioOrderBranchDetailRequestId) {
		this.aioOrderBranchDetailRequestId = aioOrderBranchDetailRequestId;
	}


	@Column(name = "ORDER_BRANCH_DETAIL_ID", length = 10)
	public Long getOrderBranchDetailId() {
		return orderBranchDetailId;
	}



	public void setOrderBranchDetailId(Long orderBranchDetailId) {
		this.orderBranchDetailId = orderBranchDetailId;
	}


	@Column(name = "ORDER_BRANCH_ID", length = 10)
	public Long getOrderBranchId() {
		return orderBranchId;
	}



	public void setOrderBranchId(Long orderBranchId) {
		this.orderBranchId = orderBranchId;
	}


	@Column(name = "ORDER_REQUEST_ID", length = 10)
	public Long getOrderRequestId() {
		return orderRequestId;
	}



	public void setOrderRequestId(Long orderRequestId) {
		this.orderRequestId = orderRequestId;
	}


	@Column(name = "ORDER_REQUEST_DETAIL_ID", length = 10)
	public Long getOrderRequestDetailId() {
		return orderRequestDetailId;
	}



	public void setOrderRequestDetailId(Long orderRequestDetailId) {
		this.orderRequestDetailId = orderRequestDetailId;
	}


	@Column(name = "AMOUNT", length = 10)
	public Double getAmount() {
		return amount;
	}



	public void setAmount(Double amount) {
		this.amount = amount;
	}


	@Column(name = "TOTAL_AMOUNT", length = 15)
	public Double getTotalAmount() {
		return totalAmount;
	}



	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	private Long goodsId;

	@Column(name = "GOODS_ID")
	public Long getGoodsId() {
		return goodsId;
	}



	public void setGoodsId(Long goodsId) {
		this.goodsId = goodsId;
	}



	@Override
	public BaseFWDTOImpl toDTO() {
		AIOOrderBranchDetailRequestDTO dto = new AIOOrderBranchDetailRequestDTO();
		dto.setAioOrderBranchDetailRequestId(this.aioOrderBranchDetailRequestId);
		dto.setOrderBranchDetailId(this.orderBranchDetailId);
		dto.setOrderBranchId(this.orderBranchId);
		dto.setOrderRequestId(this.orderRequestId);
		dto.setOrderRequestDetailId(this.orderRequestDetailId);
		dto.setAmount(this.amount);
		dto.setTotalAmount(this.totalAmount);
		dto.setGoodsId(this.goodsId);
		return dto;
	}

}
