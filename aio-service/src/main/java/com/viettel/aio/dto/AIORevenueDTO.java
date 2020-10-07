package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIORevenueDTO {
	private Double revenueMonth;
	private Double revenueDay;
	private Double discountMonth;
	private Double discountDay;
	private String customerName;
	private String customerPhone;
	private Double amount;

	//VietNT_05/08/2019_start
	private Double salaryDailyPerform;
	private Double salaryDailySale;
	private Double salaryMonthPerform;
	private Double salaryMonthSale;

	public Double getSalaryDailyPerform() {
		return salaryDailyPerform;
	}

	public void setSalaryDailyPerform(Double salaryDailyPerform) {
		this.salaryDailyPerform = salaryDailyPerform;
	}

	public Double getSalaryDailySale() {
		return salaryDailySale;
	}

	public void setSalaryDailySale(Double salaryDailySale) {
		this.salaryDailySale = salaryDailySale;
	}

	public Double getSalaryMonthPerform() {
		return salaryMonthPerform;
	}

	public void setSalaryMonthPerform(Double salaryMonthPerform) {
		this.salaryMonthPerform = salaryMonthPerform;
	}

	public Double getSalaryMonthSale() {
		return salaryMonthSale;
	}

	public void setSalaryMonthSale(Double salaryMonthSale) {
		this.salaryMonthSale = salaryMonthSale;
	}

	//VietNT_end

	public Double getRevenueMonth() {
		return revenueMonth;
	}

	public void setRevenueMonth(Double revenueMonth) {
		this.revenueMonth = revenueMonth;
	}

	public Double getRevenueDay() {
		return revenueDay;
	}

	public void setRevenueDay(Double revenueDay) {
		this.revenueDay = revenueDay;
	}

	public Double getDiscountMonth() {
		return discountMonth;
	}

	public void setDiscountMonth(Double discountMonth) {
		this.discountMonth = discountMonth;
	}

	public Double getDiscountDay() {
		return discountDay;
	}

	public void setDiscountDay(Double discountDay) {
		this.discountDay = discountDay;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

}
