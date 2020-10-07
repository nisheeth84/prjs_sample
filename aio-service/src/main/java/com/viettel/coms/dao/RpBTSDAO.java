package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dto.RpBTSDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("rpBTSDAO")
public class RpBTSDAO extends BaseFWDAOImpl<WorkItemBO, Long>{

	public RpBTSDAO() {
        this.model = new WorkItemBO();
    }

    public RpBTSDAO(Session session) {
        this.session = session;
    }
	
	public List<RpBTSDTO> doSearchBTS(RpBTSDTO obj){
		StringBuilder sql = new StringBuilder("with tbl as\r\n" + 
				"(select '1' type,\r\n" + 
				"'Tổng' ChiNhanh,\r\n" + 
				"'Tổng' provinceCode,\r\n" + 
				"count(stationCode) XDTongTram,\r\n" + 
				"sum(XDDaCoMb)XDDaCoMb,\r\n" + 
				"sum(XDCanGPXD)XDCanGPXD,\r\n" + 
				"sum(XDDaCoGPXD)XDDaCoGPXD,\r\n" + 
				"sum(XDCanGPXD)- sum(XDDaCoGPXD) XDChuaCo,\r\n" + 
				"sum(XDDuDKNhanBGMB) XDDuDKNhanBGMB,\r\n" + 
				"sum(XDDaNhanBGMB) XDDaNhanBGMB,\r\n" + 
				"sum(XDDuDKNhanBGMB)- sum(XDDaNhanBGMB) XDDuDKChuaDiNhan,\r\n" + 
				"sum(XDDaVaoTK) XDDaVaoTK,\r\n" + 
				"sum(XDNhanChuaTK) XDNhanChuaTK,\r\n" + 
				"sum(XDDangTKXDDoDang)XDDangTKXDDoDang,\r\n" + 
				"sum(XDTCQuaHan)XDTCQuaHan,\r\n" + 
				"sum(CDNhanBGDiemDauNoi) CDNhanBGDiemDauNoi,\r\n" + 
				"sum(CDVuong)CDVuong,\r\n" + 
				"sum(CDDangTK) CDDangTK,\r\n" + 
				"sum(CDChuaTK) CDChuaTK,\r\n" + 
				"sum(CDTCXongDien) CDTCXongDien,\r\n" + 
				"sum(LDDuDKChuaCap) LDDuDKChuaCap,\r\n" + 
				"sum(LDCapChuaLap) LDCapChuaLap,\r\n" + 
				"sum(LDVuongLD) LDVuongLD,\r\n" + 
				"sum(LDDangLap) LDDangLap,\r\n" + 
				"sum(LDTCXongLapDung) LDTCXongLapDung,\r\n" + 
				"sum(BTSDuDKChuaCapBTS)BTSDuDKChuaCapBTS,\r\n" + 
				"sum(BTSCapChuaLap)BTSCapChuaLap,\r\n" + 
				"sum(BTSDangLap) BTSDangLap,\r\n" + 
				"sum(BTSTCXongBTS) BTSTCXongBTS,\r\n" + 
				"sum(TramXongDB)TramXongDB\r\n" + 
				"from RP_BTS where 1=1 \r\n");
//		if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
			sql.append(" and contractCode in (:contractCodeLst) ");
//		}
		if(null!=obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
			sql.append(" and stationCode in(:stationCodeLst) ");
		}
		sql.append(" union all\r\n" + 
				"select '2' type,\r\n" + 
				"sysGroupName ChiNhanh,\r\n" + 
				"sysGroupName provinceCode,\r\n" + 
				"count(stationCode) XDTongTram,\r\n" + 
				"sum(XDDaCoMb)XDDaCoMb,\r\n" + 
				"sum(XDCanGPXD)XDCanGPXD,\r\n" + 
				"sum(XDDaCoGPXD)XDDaCoGPXD,\r\n" + 
				"sum(XDCanGPXD)- sum(XDDaCoGPXD) XDChuaCo,\r\n" + 
				"sum(XDDuDKNhanBGMB) XDDuDKNhanBGMB,\r\n" + 
				"sum(XDDaNhanBGMB) XDDaNhanBGMB,\r\n" + 
				"sum(XDDuDKNhanBGMB)- sum(XDDaNhanBGMB) XDDuDKChuaDiNhan,\r\n" + 
				"sum(XDDaVaoTK) XDDaVaoTK,\r\n" + 
				"sum(XDNhanChuaTK) XDNhanChuaTK,\r\n" + 
				"sum(XDDangTKXDDoDang)XDDangTKXDDoDang,\r\n" + 
				"sum(XDTCQuaHan)XDTCQuaHan,\r\n" + 
				"sum(CDNhanBGDiemDauNoi) CDNhanBGDiemDauNoi,\r\n" + 
				"sum(CDVuong)CDVuong,\r\n" + 
				"sum(CDDangTK) CDDangTK,\r\n" + 
				"sum(CDChuaTK) CDChuaTK,\r\n" + 
				"sum(CDTCXongDien) CDTCXongDien,\r\n" + 
				"sum(LDDuDKChuaCap) LDDuDKChuaCap,\r\n" + 
				"sum(LDCapChuaLap) LDCapChuaLap,\r\n" + 
				"sum(LDVuongLD) LDVuongLD,\r\n" + 
				"sum(LDDangLap) LDDangLap,\r\n" + 
				"sum(LDTCXongLapDung) LDTCXongLapDung,\r\n" + 
				"sum(BTSDuDKChuaCapBTS)BTSDuDKChuaCapBTS,\r\n" + 
				"sum(BTSCapChuaLap)BTSCapChuaLap,\r\n" + 
				"sum(BTSDangLap) BTSDangLap,\r\n" + 
				"sum(BTSTCXongBTS) BTSTCXongBTS,\r\n" + 
				"sum(TramXongDB)TramXongDB\r\n" + 
				"from RP_BTS where 1=1 \r\n");
//		if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
			sql.append(" and contractCode in (:contractCodeLst) ");
//		}
		if(null!=obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
			sql.append(" and stationCode in(:stationCodeLst) ");
		}
		sql.append(" group by sysGroupName\r\n" + 
				"union all \r\n" + 
				"select '3' type,\r\n" + 
				"sysGroupName ChiNhanh,\r\n" + 
				"provinceCode ,\r\n" + 
				"count(stationCode) XDTongTram,\r\n" + 
				"sum(XDDaCoMb)XDDaCoMb,\r\n" + 
				"sum(XDCanGPXD)XDCanGPXD,\r\n" + 
				"sum(XDDaCoGPXD)XDDaCoGPXD,\r\n" + 
				"sum(XDCanGPXD)- sum(XDDaCoGPXD) XDChuaCo,\r\n" + 
				"sum(XDDuDKNhanBGMB) XDDuDKNhanBGMB,\r\n" + 
				"sum(XDDaNhanBGMB) XDDaNhanBGMB,\r\n" + 
				"sum(XDDuDKNhanBGMB)- sum(XDDaNhanBGMB) XDDuDKChuaDiNhan,\r\n" + 
				"sum(XDDaVaoTK) XDDaVaoTK,\r\n" + 
				"sum(XDNhanChuaTK) XDNhanChuaTK,\r\n" + 
				"sum(XDDangTKXDDoDang)XDDangTKXDDoDang,\r\n" + 
				"sum(XDTCQuaHan)XDTCQuaHan,\r\n" + 
				"sum(CDNhanBGDiemDauNoi) CDNhanBGDiemDauNoi,\r\n" + 
				"sum(CDVuong)CDVuong,\r\n" + 
				"sum(CDDangTK) CDDangTK,\r\n" + 
				"sum(CDChuaTK) CDChuaTK,\r\n" + 
				"sum(CDTCXongDien) CDTCXongDien,\r\n" + 
				"sum(LDDuDKChuaCap) LDDuDKChuaCap,\r\n" + 
				"sum(LDCapChuaLap) LDCapChuaLap,\r\n" + 
				"sum(LDVuongLD) LDVuongLD,\r\n" + 
				"sum(LDDangLap) LDDangLap,\r\n" + 
				"sum(LDTCXongLapDung) LDTCXongLapDung,\r\n" + 
				"sum(BTSDuDKChuaCapBTS)BTSDuDKChuaCapBTS,\r\n" + 
				"sum(BTSCapChuaLap)BTSCapChuaLap,\r\n" + 
				"sum(BTSDangLap) BTSDangLap,\r\n" + 
				"sum(BTSTCXongBTS) BTSTCXongBTS,\r\n" + 
				"sum(TramXongDB)TramXongDB\r\n" + 
				"from RP_BTS where 1=1\r\n" );
//		if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
			sql.append(" and contractCode in (:contractCodeLst) ");
//		}
		if(null!=obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
			sql.append(" and stationCode in(:stationCodeLst) ");
		}
		sql.append(" group by sysGroupName,provinceCode)\r\n" + 
				"select * from tbl order by type,ChiNhanh,provinceCode");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("provinceCode", new StringType());
		query.addScalar("ChiNhanh", new StringType());
		query.addScalar("XDTongTram", new LongType());
		query.addScalar("XDDaCoMb", new LongType());
		query.addScalar("TramXongDB", new LongType());
		query.addScalar("BTSTCXongBTS", new LongType());
		query.addScalar("BTSDangLap", new LongType());
		query.addScalar("BTSCapChuaLap", new LongType());
		query.addScalar("BTSDuDKChuaCapBTS", new LongType());
		query.addScalar("LDTCXongLapDung", new LongType());
		query.addScalar("LDVuongLD", new LongType());
		query.addScalar("LDDangLap", new LongType());
		query.addScalar("LDCapChuaLap", new LongType());
		query.addScalar("LDDuDKChuaCap", new LongType());
		query.addScalar("CDTCXongDien", new LongType());
		query.addScalar("CDChuaTK", new LongType());
		query.addScalar("CDDangTK", new LongType());
		query.addScalar("CDVuong", new LongType());
		query.addScalar("CDNhanBGDiemDauNoi", new LongType());
		query.addScalar("XDTCQuaHan", new LongType());
		query.addScalar("XDDangTKXDDoDang", new LongType());
		query.addScalar("XDNhanChuaTK", new LongType());
		query.addScalar("XDDaVaoTK", new LongType());
		query.addScalar("XDDuDKChuaDiNhan", new LongType());
		query.addScalar("XDDaNhanBGMB", new LongType());
		query.addScalar("XDDuDKNhanBGMB", new LongType());
		query.addScalar("XDChuaCo", new LongType());
		query.addScalar("XDDaCoGPXD", new LongType());
		query.addScalar("XDCanGPXD", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(RpBTSDTO.class));
//		if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
			query.setParameterList("contractCodeLst", obj.getContractCodeLst());
			queryCount.setParameterList("contractCodeLst", obj.getContractCodeLst());
//		}
		if (null != obj.getStationCodeLst() && obj.getStationCodeLst().size() > 0) {
            query.setParameterList("stationCodeLst", obj.getStationCodeLst());
            queryCount.setParameterList("stationCodeLst", obj.getStationCodeLst());
        }
		 if (obj.getPageSize() != null) {
	            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
	            query.setMaxResults(obj.getPageSize().intValue());
	        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
		return query.list();
		
	}
}
