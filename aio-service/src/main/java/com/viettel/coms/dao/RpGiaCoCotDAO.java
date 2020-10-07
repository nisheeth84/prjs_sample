package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dto.RpGiaCoCotDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("rpGiaCoCotDAO")
public class RpGiaCoCotDAO extends BaseFWDAOImpl<WorkItemBO, Long>{

	public RpGiaCoCotDAO() {
        this.model = new WorkItemBO();
    }

    public RpGiaCoCotDAO(Session session) {
        this.session = session;
    }
    @SuppressWarnings("unchecked")
    public List<RpGiaCoCotDTO> doSearchGiaCoCot(RpGiaCoCotDTO obj){
		StringBuilder sql = new StringBuilder(" with tbl as" + 
				"(select '1' type," + 
				"'Tổng' DonVi," + 
				"'Tổng' provinceCode," + 
				"count(stationCode) TongKH," + 
				"sum(ChuaDuDKnhanBGMB)ChuaDuDKnhanBGMB," + 
				"sum(DuDKNhanBGMB)DuDKNhanBGMB," + 
				"sum(DaNhanBGMB)DaNhanBGMB," + 
				"sum(DaTrienKhai)DaTrienKhai," + 
				"sum(XongXD)XongXD," + 
				"sum(XongLD)XongLD," + 
				"sum(DoiDangXD)DoiDangXD," + 
				"sum(XDTong)Tong," + 
				"sum(XDChuaNhanBGMB)ChuaNhanBGMB," + 
				"sum(XDNhanMBChuaTK)NhanMBChuaTk," + 
				"sum(CapLenTinh)CapLenTinh," + 
				"sum(XongMongChuaCap)XongMongChuaCap," + 
				"sum(CapNhungChuaXongMong)CapNhungChuaXongMong," + 
				"sum(CapChuaLap)CapChuaLap," + 
				"sum(DangCoDoiLap)DangCoDoiLap," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 ");
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHLapDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KQXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))LapCot " + 
				"from RP_GIACOCOT rp where 1=1 ");
//				if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
				sql.append(" and contractCode in (:contractCodeLst) ");
//				}
				if(null != obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
					sql.append(" and stationCode in(:stationCodeLst) ");
				} 
				
				sql.append(" union all " + 
				"select '2' type," + 
				"sysGroupName DonVi," + 
				"sysGroupName provinceCode," + 
				"count(stationCode) TongKH," + 
				"sum(ChuaDuDKnhanBGMB)ChuaDuDKnhanBGMB," + 
				"sum(DuDKNhanBGMB)DuDKNhanBGMB," + 
				"sum(DaNhanBGMB)DaNhanBGMB," + 
				"sum(DaTrienKhai)DaTrienKhai," + 
				"sum(XongXD)XongXD," + 
				"sum(XongLD)XongLD," + 
				"sum(DoiDangXD)DoiDangXD," + 
				"sum(XDTong)Tong," + 
				"sum(XDChuaNhanBGMB)ChuaNhanBGMB," + 
				"sum(XDNhanMBChuaTK)NhanMBChuaTk," + 
				"sum(CapLenTinh)CapLenTinh," + 
				"sum(XongMongChuaCap)XongMongChuaCap," + 
				"sum(CapNhungChuaXongMong)CapNhungChuaXongMong," + 
				"sum(CapChuaLap)CapChuaLap," + 
				"sum(DangCoDoiLap)DangCoDoiLap," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 ");
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHLapDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KQXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))LapCot " + 
				" from RP_GIACOCOT rp where 1=1 ");
//				if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
				sql.append(" and contractCode in (:contractCodeLst) ");
//				}
				if(null != obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
					sql.append(" and stationCode in (:stationCodeLst) ");
				} 
				
				sql.append(" group by sysGroupName" + 
				"" + 
				" union all " + 
				"select '3' type," + 
				"sysGroupName DonVi," + 
				"provinceCode ," + 
				"count(stationCode) TongKH," + 
				"sum(ChuaDuDKnhanBGMB)ChuaDuDKnhanBGMB," + 
				"sum(DuDKNhanBGMB)DuDKNhanBGMB," + 
				"sum(DaNhanBGMB)DaNhanBGMB," + 
				"sum(DaTrienKhai)DaTrienKhai," + 
				"sum(XongXD)XongXD," + 
				"sum(XongLD)XongLD," + 
				"sum(DoiDangXD)DoiDangXD," + 
				"sum(XDTong)Tong," + 
				"sum(XDChuaNhanBGMB)ChuaNhanBGMB," + 
				"sum(XDNhanMBChuaTK)NhanMBChuaTk," + 
				"sum(CapLenTinh)CapLenTinh," + 
				"sum(XongMongChuaCap)XongMongChuaCap," + 
				"sum(CapNhungChuaXongMong)CapNhungChuaXongMong," + 
				"sum(CapChuaLap)CapChuaLap," + 
				"sum(DangCoDoiLap)DangCoDoiLap," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 ");
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KHLapDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=1 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))KQXayDung," + 
				"sum((select count(task.construction_task_id) from construction_task task, detail_month_plan dmp where task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 " + 
				"and task.type=1 and task.level_id=3 and task.construction_id=rp.construction_id and task.work_item_id=rp.work_item_id and rp.cat_work_item_group_id=3 and rp.status=3 "); 
				if (obj.getMonth() != null && obj.getYear() != null) {
					sql.append(" and task.month =:month and task.year =:year ");
				}
				
				sql.append("))LapCot " + 
				" from RP_GIACOCOT rp where 1=1 "); 
//				if (null != obj.getContractCodeLst() && obj.getContractCodeLst().size() > 0) {
				sql.append(" and contractCode in (:contractCodeLst) ");
//				}
				if(null != obj.getStationCodeLst() && obj.getStationCodeLst().size()>0) {
					sql.append(" and stationCode in(:stationCodeLst) ");
				} 
				
				sql.append(" group by sysGroupName,provinceCode) " + 
				"select a.*,0 KHDC,0 VatTuDaDamBao,"
				+ " round(decode(KHXayDung,0,0,100* KQXayDung/KHXayDung ),2)KQTH1,"
				+ " round(decode(KHLapDung,0,0,100* LapCot/KHLapDung ),2) KQTH2 from tbl a order by type,DonVi,provinceCode");
		
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		query.addScalar("DonVi", new StringType());
		query.addScalar("TongKH", new LongType());
		query.addScalar("ChuaDuDKnhanBGMB", new LongType());
		query.addScalar("DuDKNhanBGMB", new LongType());
		query.addScalar("DaNhanBGMB", new LongType());
		query.addScalar("DaTrienKhai", new LongType());
		query.addScalar("XongXD", new LongType());
		query.addScalar("XongLD", new LongType());
		query.addScalar("DoiDangXD", new LongType());
		query.addScalar("Tong", new LongType());
		query.addScalar("ChuaNhanBGMB", new LongType());
		query.addScalar("NhanMBChuaTk", new LongType());
		query.addScalar("CapLenTinh", new LongType());
		query.addScalar("XongMongChuaCap", new LongType());
		query.addScalar("CapNhungChuaXongMong", new LongType());
		query.addScalar("CapChuaLap", new LongType());
		query.addScalar("DangCoDoiLap", new LongType());
		query.addScalar("KHXayDung", new LongType());
		query.addScalar("KHLapDung", new LongType());
		query.addScalar("KHDC", new LongType());
		query.addScalar("VatTuDaDamBao", new LongType());
		query.addScalar("KQXayDung", new LongType());
		query.addScalar("KQTH1", new DoubleType());
		query.addScalar("LapCot", new LongType());
		query.addScalar("KQTH2", new DoubleType());
//		query.addScalar("month", new LongType());
//		query.addScalar("year", new LongType());
		query.addScalar("provinceCode", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(RpGiaCoCotDTO.class));
		
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
		 if (obj.getMonth() != null) {
	            query.setParameter("month", obj.getMonth());
	            queryCount.setParameter("month", obj.getMonth());
	    }
	    if (obj.getYear() != null) {
	            query.setParameter("year", obj.getYear());
	            queryCount.setParameter("year", obj.getYear());
	    }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		
		return query.list();
		
	}
}
