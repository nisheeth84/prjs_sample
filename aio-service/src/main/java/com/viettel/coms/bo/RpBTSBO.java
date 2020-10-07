//package com.viettel.coms.bo;
//
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.Table;
//
//import com.viettel.coms.dto.RpBTSDTO;
//import com.viettel.service.base.model.BaseFWModelImpl;
//
//@Entity
//@Table(name = "DUAL")
//public class RpBTSBO extends BaseFWModelImpl{
//
//	private java.lang.String ChiNhanh;
//	private java.lang.String XDTongTram;
//	private java.lang.String XDDaCoMb;
//	
//	@Column(name = "1", length = 20)
//	public java.lang.String getChiNhanh() {
//		return ChiNhanh;
//	}
//
//	public void setChiNhanh(java.lang.String chiNhanh) {
//		ChiNhanh = chiNhanh;
//	}
//	 @Column(name = "2", length = 20)
//	public java.lang.String getXDTongTram() {
//		return XDTongTram;
//	}
//
//	public void setXDTongTram(java.lang.String xDTongTram) {
//		XDTongTram = xDTongTram;
//	}
//	 @Column(name = "3", length = 20)
//	public java.lang.String getXDDaCoMb() {
//		return XDDaCoMb;
//	}
//
//	public void setXDDaCoMb(java.lang.String xDDaCoMb) {
//		XDDaCoMb = xDDaCoMb;
//	}
//
//	@Override
//	public RpBTSDTO toDTO() {
//		RpBTSDTO rpBTSDTO = new RpBTSDTO();
//		rpBTSDTO.setChiNhanh(this.ChiNhanh);
//		rpBTSDTO.setXDTongTram(this.XDTongTram);
//		rpBTSDTO.setXDDaCoMb(this.XDDaCoMb);
//		return rpBTSDTO;
//	}
//
//}
