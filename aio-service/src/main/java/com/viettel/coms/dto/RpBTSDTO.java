package com.viettel.coms.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.coms.bo.WorkItemBO;

@XmlRootElement(name = "RP_BTSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class RpBTSDTO extends ComsBaseFWDTO<WorkItemBO>{

	private java.lang.String ChiNhanh;
	private java.lang.Long XDTongTram;
	private java.lang.Long XDDaCoMb;
	private java.lang.Long XDCanGPXD;
	private java.lang.Long XDDaCoGPXD;
	private java.lang.Long XDChuaCo;
	private java.lang.Long XDDuDKNhanBGMB;
	private java.lang.Long XDDaNhanBGMB;
	private java.lang.Long XDDuDKChuaDiNhan;
	private java.lang.Long XDDaVaoTK;
	private java.lang.Long XDNhanChuaTK;
	private java.lang.Long XDDangTKXDDoDang;
	private java.lang.Long XDTCQuaHan;
	private java.lang.Long CDNhanBGDiemDauNoi;
	private java.lang.Long CDVuong;
	private java.lang.Long CDDangTK;
	private java.lang.Long CDChuaTK;
	private java.lang.Long CDTCXongDien;
	private java.lang.Long LDDuDKChuaCap;
	private java.lang.Long LDCapChuaLap;
	private java.lang.Long LDVuongLD;
	private java.lang.Long LDDangLap;
	private java.lang.Long LDTCXongLapDung;
	private java.lang.Long BTSDuDKChuaCapBTS;
	private java.lang.Long BTSCapChuaLap;
	private java.lang.Long BTSDangLap;
	private java.lang.Long BTSTCXongBTS;
	private java.lang.Long TramXongDB;
	private List<String> stationCodeLst;
	private List<String> contractCodeLst;
	private java.lang.String provinceCode;
	
	public List<String> getStationCodeLst() {
		return stationCodeLst;
	}

	public void setStationCodeLst(List<String> stationCodeLst) {
		this.stationCodeLst = stationCodeLst;
	}

	public List<String> getContractCodeLst() {
		return contractCodeLst;
	}

	public void setContractCodeLst(List<String> contractCodeLst) {
		this.contractCodeLst = contractCodeLst;
	}

	

	public java.lang.String getChiNhanh() {
		return ChiNhanh;
	}

	public void setChiNhanh(java.lang.String chiNhanh) {
		ChiNhanh = chiNhanh;
	}

	public java.lang.String getProvinceCode() {
		return provinceCode;
	}

	public void setProvinceCode(java.lang.String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public java.lang.Long getXDTongTram() {
		return XDTongTram;
	}

	public void setXDTongTram(java.lang.Long xDTongTram) {
		XDTongTram = xDTongTram;
	}

	public java.lang.Long getXDDaCoMb() {
		return XDDaCoMb;
	}

	public void setXDDaCoMb(java.lang.Long xDDaCoMb) {
		XDDaCoMb = xDDaCoMb;
	}

	public java.lang.Long getXDCanGPXD() {
		return XDCanGPXD;
	}

	public void setXDCanGPXD(java.lang.Long xDCanGPXD) {
		XDCanGPXD = xDCanGPXD;
	}

	public java.lang.Long getXDDaCoGPXD() {
		return XDDaCoGPXD;
	}

	public void setXDDaCoGPXD(java.lang.Long xDDaCoGPXD) {
		XDDaCoGPXD = xDDaCoGPXD;
	}

	public java.lang.Long getXDChuaCo() {
		return XDChuaCo;
	}

	public void setXDChuaCo(java.lang.Long xDChuaCo) {
		XDChuaCo = xDChuaCo;
	}

	public java.lang.Long getXDDuDKNhanBGMB() {
		return XDDuDKNhanBGMB;
	}

	public void setXDDuDKNhanBGMB(java.lang.Long xDDuDKNhanBGMB) {
		XDDuDKNhanBGMB = xDDuDKNhanBGMB;
	}

	public java.lang.Long getXDDaNhanBGMB() {
		return XDDaNhanBGMB;
	}

	public void setXDDaNhanBGMB(java.lang.Long xDDaNhanBGMB) {
		XDDaNhanBGMB = xDDaNhanBGMB;
	}

	public java.lang.Long getXDDuDKChuaDiNhan() {
		return XDDuDKChuaDiNhan;
	}

	public void setXDDuDKChuaDiNhan(java.lang.Long xDDuDKChuaDiNhan) {
		XDDuDKChuaDiNhan = xDDuDKChuaDiNhan;
	}

	public java.lang.Long getXDDaVaoTK() {
		return XDDaVaoTK;
	}

	public void setXDDaVaoTK(java.lang.Long xDDaVaoTK) {
		XDDaVaoTK = xDDaVaoTK;
	}

	public java.lang.Long getXDNhanChuaTK() {
		return XDNhanChuaTK;
	}

	public void setXDNhanChuaTK(java.lang.Long xDNhanChuaTK) {
		XDNhanChuaTK = xDNhanChuaTK;
	}

	public java.lang.Long getXDDangTKXDDoDang() {
		return XDDangTKXDDoDang;
	}

	public void setXDDangTKXDDoDang(java.lang.Long xDDangTKXDDoDang) {
		XDDangTKXDDoDang = xDDangTKXDDoDang;
	}

	public java.lang.Long getXDTCQuaHan() {
		return XDTCQuaHan;
	}

	public void setXDTCQuaHan(java.lang.Long xDTCQuaHan) {
		XDTCQuaHan = xDTCQuaHan;
	}

	public java.lang.Long getCDNhanBGDiemDauNoi() {
		return CDNhanBGDiemDauNoi;
	}

	public void setCDNhanBGDiemDauNoi(java.lang.Long cDNhanBGDiemDauNoi) {
		CDNhanBGDiemDauNoi = cDNhanBGDiemDauNoi;
	}

	public java.lang.Long getCDVuong() {
		return CDVuong;
	}

	public void setCDVuong(java.lang.Long cDVuong) {
		CDVuong = cDVuong;
	}

	public java.lang.Long getCDDangTK() {
		return CDDangTK;
	}

	public void setCDDangTK(java.lang.Long cDDangTK) {
		CDDangTK = cDDangTK;
	}

	public java.lang.Long getCDChuaTK() {
		return CDChuaTK;
	}

	public void setCDChuaTK(java.lang.Long cDChuaTK) {
		CDChuaTK = cDChuaTK;
	}

	public java.lang.Long getCDTCXongDien() {
		return CDTCXongDien;
	}

	public void setCDTCXongDien(java.lang.Long cDTCXongDien) {
		CDTCXongDien = cDTCXongDien;
	}

	public java.lang.Long getLDDuDKChuaCap() {
		return LDDuDKChuaCap;
	}

	public void setLDDuDKChuaCap(java.lang.Long lDDuDKChuaCap) {
		LDDuDKChuaCap = lDDuDKChuaCap;
	}

	public java.lang.Long getLDCapChuaLap() {
		return LDCapChuaLap;
	}

	public void setLDCapChuaLap(java.lang.Long lDCapChuaLap) {
		LDCapChuaLap = lDCapChuaLap;
	}

	public java.lang.Long getLDVuongLD() {
		return LDVuongLD;
	}

	public void setLDVuongLD(java.lang.Long lDVuongLD) {
		LDVuongLD = lDVuongLD;
	}

	public java.lang.Long getLDDangLap() {
		return LDDangLap;
	}

	public void setLDDangLap(java.lang.Long lDDangLap) {
		LDDangLap = lDDangLap;
	}

	public java.lang.Long getLDTCXongLapDung() {
		return LDTCXongLapDung;
	}

	public void setLDTCXongLapDung(java.lang.Long lDTCXongLapDung) {
		LDTCXongLapDung = lDTCXongLapDung;
	}

	public java.lang.Long getBTSDuDKChuaCapBTS() {
		return BTSDuDKChuaCapBTS;
	}

	public void setBTSDuDKChuaCapBTS(java.lang.Long bTSDuDKChuaCapBTS) {
		BTSDuDKChuaCapBTS = bTSDuDKChuaCapBTS;
	}

	public java.lang.Long getBTSCapChuaLap() {
		return BTSCapChuaLap;
	}

	public void setBTSCapChuaLap(java.lang.Long bTSCapChuaLap) {
		BTSCapChuaLap = bTSCapChuaLap;
	}

	public java.lang.Long getBTSDangLap() {
		return BTSDangLap;
	}

	public void setBTSDangLap(java.lang.Long bTSDangLap) {
		BTSDangLap = bTSDangLap;
	}

	public java.lang.Long getBTSTCXongBTS() {
		return BTSTCXongBTS;
	}

	public void setBTSTCXongBTS(java.lang.Long bTSTCXongBTS) {
		BTSTCXongBTS = bTSTCXongBTS;
	}

	public java.lang.Long getTramXongDB() {
		return TramXongDB;
	}

	public void setTramXongDB(java.lang.Long tramXongDB) {
		TramXongDB = tramXongDB;
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
	public WorkItemBO toModel() {
		// TODO Auto-generated method stub
		return null;
	}

}
