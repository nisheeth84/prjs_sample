/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.ConstructionAcceptanceCertBO;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dto.*;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("constructionAcceptanceCertDAO")
public class ConstructionAcceptanceCertDAO extends
		BaseFWDAOImpl<ConstructionAcceptanceCertBO, Long> {

	public ConstructionAcceptanceCertDAO() {
		this.model = new ConstructionAcceptanceCertBO();
	}

	public ConstructionAcceptanceCertDAO(Session session) {
		this.session = session;
	}

	private UtilAttachDocumentDAO utilAttachDocumentDAO;

	public List<ConstructionAcceptanceCertDetailDTO> getValueToInitConstructionAcceptancePages(
			ConstructionAcceptanceDTORequest request) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" SELECT distinct ");

		sql.append(" cons.CONSTRUCTION_ID constructionId, ");
		sql.append("cons.CODE constructionCode,cons.status statusConstruction,cat.ADDRESS address ");

		sql.append("FROM CONSTRUCTION cons ");
		sql.append("LEFT JOIN work_item wi ");
		sql.append("ON wi.CONSTRUCTION_ID     = cons.CONSTRUCTION_ID ");
		sql.append("left join CAT_STATION cat on cat.CAT_STATION_ID=cons.CAT_STATION_ID ");

		sql.append("WHERE ((cons.STATUS       IN (3,4,5) ");
		sql.append("AND wi.STATUS             = 3) ");

		sql.append("OR (cons.STATUS           =4 ");
		sql.append("AND cons.OBSTRUCTED_STATE = 2 ");
		sql.append("AND wi.STATUS             = 2)) ");
		sql.append(" AND wi.PERFORMER_ID =:userid ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());

		query.addScalar("constructionId", new LongType());
		query.addScalar("address", new StringType());
		query.addScalar("statusConstruction", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("statusConstruction", new StringType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailDTO.class));
		return query.list();
	}

	public List<ConstructionAcceptanceCertDetailDTO> getValueToInitConstructionAcceptanceWorkItemsPages(
			ConstructionAcceptanceDTORequest request) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" SELECT ");

		sql.append(" cons.CONSTRUCTION_ID constructionId, ");
		sql.append("cons.CODE constructionCode, ");
		sql.append("wi.WORK_ITEM_ID workItemId, ");
		sql.append("wi.NAME workItemName, ");
		sql.append("count(conReturn.WORK_ITEM_ID) countWorkItemComplete ");
		sql.append("FROM CONSTRUCTION cons ");
		sql.append("LEFT JOIN work_item wi ");
		sql.append("ON wi.CONSTRUCTION_ID     = cons.CONSTRUCTION_ID ");
		sql.append("LEFT JOIN CONSTRUCTION_RETURN conReturn ");
		sql.append("ON wi.WORK_ITEM_ID        = conReturn.WORK_ITEM_ID ");
		sql.append("AND cons.CONSTRUCTION_ID  = conReturn.CONSTRUCTION_ID ");
		sql.append("WHERE ((cons.STATUS       IN (3,4,5) ");
		sql.append("AND wi.STATUS             = 3) ");

		sql.append("OR (cons.STATUS           =4 ");
		sql.append("AND cons.OBSTRUCTED_STATE = 2 ");
		sql.append("AND wi.STATUS             = 2)) ");
		sql.append(" AND wi.PERFORMER_ID =:userid ");
		sql.append(" AND cons.CONSTRUCTION_ID =:constructionId ");
		sql.append(" GROUP BY cons.CONSTRUCTION_ID,cons.CODE, wi.WORK_ITEM_ID, wi.NAME ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.setParameter("constructionId", request
				.getConstructionAcceptanceCertDetailDTO().getConstructionId());

		query.addScalar("constructionId", new LongType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("countWorkItemComplete", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemName", new StringType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailDTO.class));
		return query.list();
	}

	public boolean checkStatusAcceptance(Long workItemId, Long constructionId) {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				" select WORK_ITEM_ID workItemId , CONSTRUCTION_ID constructionId  from CONSTRUCTION_MERCHANDISE where WORK_ITEM_ID=:workItemId AND CONSTRUCTION_ID=:constructionId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", workItemId);
		query.setParameter("constructionId", constructionId);
		query.addScalar("workItemId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailDTO.class));
		List<ConstructionAcceptanceCertDetailDTO> re = query.list();
		if (!re.isEmpty()) {
			return true;
		}
		return false;
	}
//	hoanm1_20190130_start
	public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceVTAPages(
			ConstructionAcceptanceDTORequest request, Long temp) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT ");

		sql.append("synDetailSerial.GOODS_ID goodsId , ");
		sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitName , ");
		sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
		sql.append("synDetailSerial.GOODS_NAME goodsName,  ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(serial.amount) ");
		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
		sql.append("AND syn.TYPE                               =2 and syn.CONFIRM=1 and syn.BUSSINESS_TYPE = 1 ");
		sql.append(")),0) numberXuat, ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(serial.amount) ");
		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
		sql.append("AND syn.TYPE                           =1 ");
		sql.append("AND syn.status                         =2 and syn.BUSSINESS_TYPE = 4 ");
		sql.append(")),0) numberThuhoi, ");
		sql.append("NVL(max( ");
		sql.append("(SELECT distinct SUM(conMer.quantity) ");
		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
		sql.append("AND conMer.TYPE            = 1 ");
		if (temp == 0) {
			sql.append("AND conMer.GOODS_IS_SERIAL = nvl(synDetail.GOODS_IS_SERIAL,0) ");

		} else {
			sql.append("AND conMer.GOODS_IS_SERIAL =  nvl(synDetail.GOODS_IS_SERIAL,0) ");
			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
			sql.append(" AND rownum                   =1 ");
		}
		//sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
		sql.append(")),0) numberNghiemthu, ");
		sql.append("NVL(max( ");
		sql.append("(SELECT distinct SUM(conMer.quantity) ");
		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append("AND conMer.WORK_ITEM_ID    != wi.WORK_ITEM_ID ");
		sql.append("AND conMer.TYPE            = 1 ");
		if (temp == 0) {
			sql.append("AND conMer.GOODS_IS_SERIAL  = nvl(synDetail.GOODS_IS_SERIAL,0) ");

		} else {
			sql.append("AND conMer.GOODS_IS_SERIAL = nvl(synDetail.GOODS_IS_SERIAL,0) ");
			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
			sql.append(" AND rownum                   =1 ");
		}
		//sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
		sql.append(")),0) numberNghiemThuKhac ");
		sql.append("FROM SYN_STOCK_TRANS syn ");
		sql.append("INNER JOIN CONSTRUCTION con ");
		sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
		sql.append("LEFT JOIN WORK_ITEM wi ");
		sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
		sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
		if (temp == 0) {
			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) != 1 ");

		} else {
			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) = 1 ");

		}
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
		sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
		sql.append("WHERE syn.SYN_TRANS_TYPE   =1 ");
//		sql.append("AND syn.CONFIRM            =1 ");
		sql.append("AND con.CONSTRUCTION_ID    =:constructionId ");
		sql.append("AND wi.WORK_ITEM_ID        =:workItemId ");
		sql.append("AND wi.PERFORMER_ID        =:userid ");
		sql.append("AND synDetailSerial.amount >0 ");
//		sql.append("GROUP BY con.CONSTRUCTION_ID, ");
//		sql.append("con.CODE, ");
//		sql.append("wi.WORK_ITEM_ID, ");
//		sql.append("wi.NAME, ");
		sql.append("GROUP BY ");
		sql.append("synDetailSerial.GOODS_ID, ");
		sql.append("synDetailSerial.GOODS_CODE, ");
		sql.append("synDetailSerial.GOODS_NAME, ");
		sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
		// sql.append("synDetailSerial.SERIAL, ");
//		sql.append("syn.REAL_IE_TRANS_DATE, ");
		sql.append("nvl(synDetail.GOODS_IS_SERIAL,0) ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", request
				.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
		query.setParameter("constructionId", request
				.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());

		query.addScalar("numberXuat", new DoubleType());
		query.addScalar("numberThuhoi", new DoubleType());
		query.addScalar("numberNghiemthu", new DoubleType());
		query.addScalar("numberNghiemThuKhac", new DoubleType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailVTADTO.class));

		return query.list();
	}

//	public List<ConstructionAcceptanceCertDetailVTADTO> getValueToInitConstructionAcceptanceVTAPages(
//			ConstructionAcceptanceDTORequest request, Long temp) {
//		// TODO Auto-generated method stub
//		StringBuilder sql = new StringBuilder("SELECT ");
//
//		sql.append("synDetailSerial.GOODS_ID goodsId , ");
//		sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitName , ");
//		sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
//		sql.append("synDetailSerial.GOODS_NAME goodsName,  ");
//		sql.append("NVL(SUM( ");
//		sql.append("(SELECT SUM(serial.amount) ");
//		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
//		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
//		sql.append("AND syn.TYPE                               =2 ");
//		sql.append(")),0) numberXuat, ");
//		sql.append("NVL(SUM( ");
//		sql.append("(SELECT SUM(serial.amount) ");
//		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
//		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
//		sql.append("AND syn.TYPE                           =1 ");
//		sql.append("AND syn.status                         =2 ");
//		sql.append(")),0) numberThuhoi, ");
//		sql.append("NVL(SUM( ");
//		sql.append("(SELECT SUM(conMer.quantity) ");
//		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
//		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
//		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//		sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
//		sql.append("AND conMer.TYPE            = 1 ");
//		if (temp == 0) {
//			sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
//
//		} else {
//			sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
//			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
//			sql.append(" AND rownum                   =1 ");
//		}
//		sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
//		sql.append(")),0) numberNghiemthu, ");
//		sql.append("NVL(SUM( ");
//		sql.append("(SELECT SUM(conMer.quantity) ");
//		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
//		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
//		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//		sql.append("AND conMer.WORK_ITEM_ID    != wi.WORK_ITEM_ID ");
//		sql.append("AND conMer.TYPE            = 1 ");
//		if (temp == 0) {
//			sql.append("AND conMer.GOODS_IS_SERIAL  = synDetail.GOODS_IS_SERIAL ");
//
//		} else {
//			sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
//			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
//			sql.append(" AND rownum                   =1 ");
//		}
//		sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
//		sql.append(")),0) numberNghiemThuKhac ");
//		sql.append("FROM SYN_STOCK_TRANS syn ");
//		sql.append("INNER JOIN CONSTRUCTION con ");
//		sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
//		sql.append("LEFT JOIN WORK_ITEM wi ");
//		sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
//		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
//		sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
//		if (temp == 0) {
//			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) != 1 ");
//
//		} else {
//			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) = 1 ");
//
//		}
//		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
//		sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
//		sql.append("WHERE syn.SYN_TRANS_TYPE   =1 ");
//		sql.append("AND syn.CONFIRM            =1 ");
//		sql.append("AND con.CONSTRUCTION_ID    =:constructionId ");
//		sql.append("AND wi.WORK_ITEM_ID        =:workItemId ");
//		sql.append("AND wi.PERFORMER_ID        =:userid ");
//		sql.append("AND synDetailSerial.amount >0 ");
//		sql.append("GROUP BY con.CONSTRUCTION_ID, ");
//		sql.append("con.CODE, ");
//		// if(temp==1){
//		// sql.append("synDetailSerial.MER_ENTITY_ID, ");
//		// }
//		sql.append("wi.WORK_ITEM_ID, ");
//		sql.append("wi.NAME, ");
//		sql.append("synDetailSerial.GOODS_ID, ");
//		sql.append("synDetailSerial.GOODS_CODE, ");
//		sql.append("synDetailSerial.GOODS_NAME, ");
//		sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
//		// sql.append("synDetailSerial.SERIAL, ");
//		sql.append("syn.REAL_IE_TRANS_DATE, ");
//		sql.append("synDetail.GOODS_IS_SERIAL ");
//
//		SQLQuery query = getSession().createSQLQuery(sql.toString());
//		query.setParameter("workItemId", request
//				.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
//		query.setParameter("constructionId", request
//				.getConstructionAcceptanceCertDetailDTO().getConstructionId());
//		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
//		query.addScalar("goodsId", new LongType());
//		query.addScalar("goodsCode", new StringType());
//		query.addScalar("goodsName", new StringType());
//		query.addScalar("goodsUnitName", new StringType());
//
//		query.addScalar("numberXuat", new DoubleType());
//		query.addScalar("numberThuhoi", new DoubleType());
//		query.addScalar("numberNghiemthu", new DoubleType());
//		query.addScalar("numberNghiemThuKhac", new DoubleType());
//
//		query.setResultTransformer(Transformers
//				.aliasToBean(ConstructionAcceptanceCertDetailVTADTO.class));
//
//		return query.list();
//	}
//	hoanm1_20190130_end

	public List<ConstructionAcceptanceCertItemTBDTO> getValueToInitConstructionAcceptanceVTADetailPages(
			ConstructionAcceptanceDTORequest request, Long temp, Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");

		sql.append("SELECT con.CONSTRUCTION_ID constructionIdTB, ");
		sql.append("con.CODE constructionCode, ");
		if (temp == 1) {
			sql.append("synDetailSerial.MER_ENTITY_ID merEntityId, ");
		}
		sql.append("wi.WORK_ITEM_ID workItemIdTB, ");
		sql.append("wi.NAME workItemNameTB, ");
		sql.append("synDetailSerial.GOODS_ID goodsId , ");
		sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
		sql.append("synDetailSerial.GOODS_NAME goodsName , ");
		sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitNameTB, ");
		sql.append("synDetailSerial.SERIAL serial, ");
		sql.append("syn.REAL_IE_TRANS_DATE realIeTransDateTB, ");
		sql.append("synDetail.GOODS_IS_SERIAL goodsIsSerialTB, ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(serial.amount) ");
		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
		sql.append("AND syn.TYPE                               =2 ");
		sql.append(")),0) numberXTB, ");
		
//		sql.append("NVL(SUM( ");
//		sql.append("(SELECT SUM(serial.amount) ");
//		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
//		sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
//		sql.append("AND syn.TYPE                           =1 ");
//		sql.append("AND syn.status                         =2 ");
//		sql.append(")),0) numberTHTB, ");
		
		sql.append(" NVL(SUM( (select SUM(stdr.amount) from SYN_STOCK_TRANS st"); 
		sql.append(" join syn_stock_trans_Detail std on std.SYN_STOCK_TRANS_ID = st.SYN_STOCK_TRANS_ID ");
		sql.append(" join SYN_STOCK_TRANS_DETAIL_SERIAL stdr on stdr.SYN_STOCK_TRANS_DETAIL_ID = std.SYN_STOCK_TRANS_DETAIL_ID "); 
		sql.append(" where st.type =1 and syn.status =2 and stdr.mer_entity_id=synDetailSerial.mer_entity_id and st.CONSTRUCTION_CODE= syn.CONSTRUCTION_CODE)),0)numberTHTB,");
		
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(conMer.quantity) ");
		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
		sql.append("AND conMer.TYPE            = 1 ");
		if (temp == 0) {
			sql.append("AND nvl(conMer.GOODS_IS_SERIAL,0) = nvl(synDetail.GOODS_IS_SERIAL,0) ");

		} else {
			sql.append("AND nvl(conMer.GOODS_IS_SERIAL,0) = nvl(synDetail.GOODS_IS_SERIAL,0) ");
			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
			sql.append(" AND rownum                   =1 ");
		}
		sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
		sql.append(")),0) numberNTTB, ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(conMer.quantity) ");
		sql.append("FROM  CONSTRUCTION_MERCHANDISE conMer ");
		sql.append("WHERE conMer.GOODS_ID         = synDetailSerial.GOODS_ID ");
		sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append("AND conMer.WORK_ITEM_ID    != wi.WORK_ITEM_ID ");
		sql.append("AND conMer.TYPE            = 1 ");
		if (temp == 0) {
			sql.append("AND nvl(conMer.GOODS_IS_SERIAL,0)  = nvl(synDetail.GOODS_IS_SERIAL,0) ");

		} else {
			sql.append("AND nvl(conMer.GOODS_IS_SERIAL,0) = nvl(synDetail.GOODS_IS_SERIAL,0) ");
			sql.append(" AND conMer.SERIAL            =synDetailSerial.SERIAL ");
			sql.append(" AND rownum                   =1 ");
		}
		sql.append(" AND conMer.MER_entity_id = synDetailSerial.MER_entity_id ");
		sql.append(")),0) numberNTKTB ");
		sql.append("FROM SYN_STOCK_TRANS syn ");
		sql.append("INNER JOIN CONSTRUCTION con ");
		sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
		sql.append("LEFT JOIN WORK_ITEM wi ");
		sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
		sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
		if (temp == 0) {
			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) != 1 ");

		} else {
			sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) = 1 ");

		}
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
		sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
		sql.append("WHERE syn.SYN_TRANS_TYPE   =1 ");
		sql.append("AND syn.CONFIRM            =1 ");
		sql.append("AND con.CONSTRUCTION_ID    =:constructionId ");
		sql.append("AND wi.WORK_ITEM_ID        =:workItemId ");
		sql.append("AND wi.PERFORMER_ID        =:userid ");
		sql.append("AND  synDetailSerial.GOODS_ID=:goodsId  ");
		sql.append("AND synDetailSerial.amount >0 ");
		sql.append("GROUP BY con.CONSTRUCTION_ID, ");
		sql.append("con.CODE, ");
		if (temp == 1) {
			sql.append("synDetailSerial.MER_ENTITY_ID, ");
		}
		sql.append("wi.WORK_ITEM_ID, ");
		sql.append("wi.NAME, ");
		sql.append("synDetailSerial.GOODS_ID, ");
		sql.append("synDetailSerial.GOODS_CODE, ");
		sql.append("synDetailSerial.GOODS_NAME, ");
		sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
		sql.append("synDetailSerial.SERIAL, ");
		sql.append("syn.REAL_IE_TRANS_DATE, ");
		sql.append("synDetail.GOODS_IS_SERIAL ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", request
				.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
		query.setParameter("constructionId", request
				.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.setParameter("goodsId", goodsId);
		query.addScalar("workItemIdTB", new LongType());
		query.addScalar("constructionIdTB", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemNameTB", new StringType());
		if (temp == 1) {
			query.addScalar("merEntityId", new LongType());
		}
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitNameTB", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("realIeTransDateTB", new StringType());
		query.addScalar("goodsIsSerialTB", new StringType());
		// query.addScalar("conMerquantity",new DoubleType());
		query.addScalar("numberXTB", new DoubleType());
		query.addScalar("numberTHTB", new DoubleType());
		query.addScalar("numberNTTB", new DoubleType());
		query.addScalar("numberNTKTB", new DoubleType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertItemTBDTO.class));

		return query.list();
	}

	public List<ConstructionAcceptanceCertDetailVTBDTO> getValueToInitConstructionAcceptanceVTBPages(
			ConstructionAcceptanceDTORequest request, Long temp) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT s.CONSTRUCTION_ID constructionId, ");
		sql.append("cons.code constructionCode, ");
		sql.append("s.WORK_ITEM_ID workItemId, ");
		sql.append("wi.Name workItemName, ");
		// sql.append("m.MER_ENTITY_ID merEntityId, ");
		sql.append("m.GOODS_ID goodsId, ");
		sql.append("m.GOODS_CODE goodsCode, ");
		sql.append("m.GOODS_NAME goodsName, ");
		sql.append("m.CAT_UNIT_NAME goodsUnitName, ");
		// sql.append("m.SERIAL serial, ");
		sql.append("NVL(SUM(ss.QUANTITY),0) numberXuat, ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(ae.quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append("WHERE m.goods_code              =ae.GOODS_CODE ");
		sql.append("AND a.CONSTRUCTION_ID           =s.CONSTRUCTION_ID ");
		sql.append("AND ae.MER_ENTITY_ID            =m.MER_ENTITY_ID ");
		sql.append("AND a.STATUS                   =3 ");
		sql.append(")),0) numberThuhoi, ");
		sql.append("(SELECT SUM(cm.QUANTITY) ");
		sql.append("FROM CONSTRUCTION_MERCHANDISE cm ");
		sql.append("WHERE cm.TYPE          =2 ");
		sql.append("AND m.GOODS_CODE       = cm.GOODS_CODE ");
		sql.append("AND s.CONSTRUCTION_ID  = cm.CONSTRUCTION_ID ");
		sql.append("and cm.WORK_ITEM_ID = s.WORK_ITEM_ID ");
		if (temp == 0) {
			sql.append("AND cm.GOODS_IS_SERIAL = 0 ");
		} else {
			sql.append("AND cm.GOODS_IS_SERIAL = 1 ");
			// sql.append("  AND m.SERIAL = cm.SERIAL ");

		}
		// sql.append(" AND m.SERIAL = cm.SERIAL ");
		sql.append(") numberSuDung  ");
		sql.append("FROM stock_trans s ");
		sql.append("LEFT JOIN CONSTRUCTION cons ");
		sql.append("ON s.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
		sql.append("INNER JOIN WORK_ITEM wi ");
		sql.append("ON wi.WORK_ITEM_ID    = s.WORK_ITEM_ID ");
		sql.append("AND s.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append("ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
		sql.append("ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
		sql.append("AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
		sql.append("INNER JOIN MER_ENTITY m ");
		sql.append("ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
		sql.append("AND s.CONFIRM         = 1 ");
		sql.append("AND s.TYPE            = 2 ");
		sql.append("AND s.STATUS          = 2 ");
		if (temp == 0) {
			sql.append("AND (M.SERIAL         IS NULL )  ");
			sql.append("AND sd.GOODS_IS_SERIAL=0 ");

		} else {
			sql.append("AND (M.SERIAL         IS not NULL) ");
			sql.append("AND sd.GOODS_IS_SERIAL=1 ");

		}
		sql.append("AND wi.PERFORMER_ID   =:userid ");
		sql.append("AND s.CONSTRUCTION_ID =:constructionId ");
		sql.append("AND wi.WORK_ITEM_ID   =:workItemId ");
		sql.append("GROUP BY s.CONSTRUCTION_ID, ");
		sql.append("cons.code, ");
		sql.append("s.WORK_ITEM_ID, ");
		sql.append("wi.Name, ");
		// sql.append("m.MER_ENTITY_ID, ");
		sql.append("m.GOODS_ID, ");
		sql.append("m.GOODS_CODE, ");
		sql.append("m.GOODS_NAME, ");
		sql.append("m.CAT_UNIT_NAME ");
		// sql.append("m.SERIAL ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", request
				.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.setParameter("constructionId", request
				.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("workItemName", new StringType());
		// query.addScalar("merEntityId", new LongType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		// query.addScalar("serial", new StringType());
		query.addScalar("numberXuat", new DoubleType());
		// query.addScalar("quantity", new DoubleType());
		// query.addScalar("conMerquantity", new DoubleType());
		query.addScalar("numberThuhoi", new DoubleType());
		query.addScalar("numberSuDung", new DoubleType());
		// query.addScalar("constructionMerchadiseId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailVTBDTO.class));

		return query.list();
	}

	public List<ConstructionAcceptanceCertItemTBDTO> getValueToInitConstructionAcceptanceVTBDetailPages(
			ConstructionAcceptanceDTORequest request, Long temp, Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT s.CONSTRUCTION_ID constructionIdTB, ");
		sql.append("cons.code constructionCode, ");
		sql.append("s.WORK_ITEM_ID workItemIdTB, ");
		sql.append("wi.Name workItemNameTB, ");
		sql.append("m.MER_ENTITY_ID merEntityId, ");
		sql.append("m.GOODS_ID goodsId, ");
		sql.append("m.GOODS_CODE goodsCode, ");
		sql.append("m.GOODS_NAME goodsName, ");
		sql.append("m.CAT_UNIT_NAME goodsUnitNameTB, ");
		sql.append("m.SERIAL serial, ");
		sql.append("sd.GOODS_IS_SERIAL goodsIsSerialTB, ");
		sql.append("NVL(SUM(ss.QUANTITY),0) numberXTB, ");
		sql.append("NVL(SUM( ");
		sql.append("(SELECT SUM(ae.quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append("WHERE m.goods_code              =ae.GOODS_CODE ");
		sql.append("AND a.CONSTRUCTION_ID           =s.CONSTRUCTION_ID ");
		sql.append("AND ae.MER_ENTITY_ID            =m.MER_ENTITY_ID ");
		sql.append("AND a.STATUS                   =3  ");
		sql.append("  AND m.SERIAL = ae.SERIAL  ");
		sql.append(")),0) numberTHTB, ");
		sql.append("(SELECT SUM(cm.QUANTITY) ");
		sql.append("FROM CONSTRUCTION_MERCHANDISE cm ");
		sql.append("WHERE cm.TYPE          =2 ");
		sql.append("AND m.GOODS_CODE       = cm.GOODS_CODE ");
		sql.append("AND s.CONSTRUCTION_ID  = cm.CONSTRUCTION_ID ");
		sql.append("and cm.WORK_ITEM_ID = s.WORK_ITEM_ID ");
		if (temp == 0) {
			sql.append("AND cm.GOODS_IS_SERIAL = 0 ");
		} else {
			sql.append("AND cm.GOODS_IS_SERIAL = 1 ");
			sql.append("  AND m.SERIAL = cm.SERIAL ");

		}
		// sql.append(" AND m.SERIAL = cm.SERIAL ");
		sql.append(") numberSDTB  ");
		sql.append("FROM stock_trans s ");
		sql.append("LEFT JOIN CONSTRUCTION cons ");
		sql.append("ON s.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
		sql.append("INNER JOIN WORK_ITEM wi ");
		sql.append("ON wi.WORK_ITEM_ID    = s.WORK_ITEM_ID ");
		sql.append("AND s.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append("ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
		sql.append("ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
		sql.append("AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
		sql.append("INNER JOIN MER_ENTITY m ");
		sql.append("ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
		sql.append("AND s.CONFIRM         = 1 ");
		sql.append("AND s.TYPE            = 2 ");
		sql.append("AND s.STATUS          = 2 ");
		if (temp == 0) {
			sql.append("AND (M.SERIAL         IS NULL )  ");
			sql.append("AND sd.GOODS_IS_SERIAL=0 ");

		} else {
			sql.append("AND (M.SERIAL         IS not NULL) ");
			sql.append("AND sd.GOODS_IS_SERIAL=1 ");

		}
		sql.append("AND wi.PERFORMER_ID   =:userid ");
		sql.append("AND s.CONSTRUCTION_ID =:constructionId ");
		sql.append("AND wi.WORK_ITEM_ID   =:workItemId ");
		sql.append("AND m.GOODS_ID   =:goodsId ");
		sql.append("GROUP BY s.CONSTRUCTION_ID, ");
		sql.append("cons.code, ");
		sql.append("s.WORK_ITEM_ID, ");
		sql.append("wi.Name, ");
		sql.append("m.MER_ENTITY_ID, ");
		sql.append("m.GOODS_ID, ");
		sql.append("m.GOODS_CODE, ");
		sql.append("m.GOODS_NAME, ");
		sql.append("m.CAT_UNIT_NAME, ");
		sql.append("m.SERIAL, ");
		sql.append("sd.GOODS_IS_SERIAL ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", request
				.getConstructionAcceptanceCertDetailDTO().getWorkItemId());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.setParameter("constructionId", request
				.getConstructionAcceptanceCertDetailDTO().getConstructionId());
		query.setParameter("goodsId", goodsId);
		query.addScalar("constructionIdTB", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemIdTB", new LongType());
		query.addScalar("workItemNameTB", new StringType());
		query.addScalar("merEntityId", new LongType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitNameTB", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("numberXTB", new DoubleType());
		// query.addScalar("quantity", new DoubleType());
		// query.addScalar("conMerquantity", new DoubleType());
		query.addScalar("numberTHTB", new DoubleType());
		query.addScalar("numberSDTB", new DoubleType());
		// query.addScalar("constructionMerchadiseId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertItemTBDTO.class));

		return query.list();
	}

	public List<ConstructionAcceptanceCertDetailVTADTO> getListVatTuDetail(
			Long constructionId, Long workItemId, Long goodsId, long userid) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT con.CONSTRUCTION_ID constructionId, ");
		sql.append("con.CODE constructionCode, ");
		sql.append("synDetailSerial.GOODS_ID goodsId , ");
		sql.append("synDetailSerial.MER_ENTITY_ID merEntityId, ");
		sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
		sql.append("synDetailSerial.GOODS_NAME goodsName, ");
		sql.append(" synDetailSerial.GOODS_UNIT_NAME goodsUnitName, ");
		sql.append("nvl(synDetail.GOODS_IS_SERIAL,0) goodsIsSerial, ");
		sql.append(" NVL(SUM( ");
		sql.append(" (SELECT SUM(serial.amount) ");
		sql.append(" FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
		sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
		sql.append("AND syn.TYPE                               =2 ");
		sql.append("and syn.CONFIRM=1  ");
		sql.append(" and syn.BUSSINESS_TYPE = 1 ");
		sql.append(" )),0) numberXuat, ");

		sql.append(" NVL(SUM( ");
		sql.append(" (SELECT SUM(serial.amount) ");
		sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
		sql.append(" WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
		sql.append(" AND syn.TYPE                           =1 ");
		sql.append(" AND syn.status                         =2 ");
		sql.append(" and syn.BUSSINESS_TYPE = 4 ");
		sql.append(" )),0) numberThuhoi, ");

		sql.append(" NVL(max( ");
		sql.append(" (SELECT distinct sum(conMer.quantity) ");
		sql.append(" FROM CONSTRUCTION_MERCHANDISE conMer ");
		sql.append(" WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
		sql.append("  AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append("  AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
		sql.append(" AND conMer.TYPE            = 1 ");
		sql.append(" AND conMer.GOODS_IS_SERIAL = nvl(synDetail.GOODS_IS_SERIAL,0) ");
		sql.append(" AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
		sql.append(" )),0) numberNghiemthuDB, ");

		sql.append(" NVL(max( ");
		sql.append(" (SELECT distinct SUM(conMer.quantity) ");
		sql.append(" FROM CONSTRUCTION_MERCHANDISE conMer ");
		sql.append(" WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
		sql.append(" AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
		sql.append(" AND conMer.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
		sql.append("  AND conMer.TYPE            = 1 ");
		sql.append("  AND conMer.GOODS_IS_SERIAL = nvl(synDetail.GOODS_IS_SERIAL,0) ");
		sql.append("  AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
		sql.append(" )),0) numberNghiemThuKhac ");

		sql.append("FROM SYN_STOCK_TRANS syn ");
		sql.append("INNER JOIN CONSTRUCTION con ");
		sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
		sql.append("LEFT JOIN WORK_ITEM wi ");
		sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
		sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
		sql.append("AND nvl(synDetail.GOODS_IS_SERIAL,0) = 0 ");
		sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
		sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
		sql.append("WHERE syn.SYN_TRANS_TYPE                     =1 ");
		sql.append("AND con.CONSTRUCTION_ID                      =:constructionId ");
		sql.append("AND wi.PERFORMER_ID                          =:userid ");
		sql.append("AND wi.work_item_id                          =:workItemId ");
		sql.append("AND synDetailSerial.amount                   >0 ");
		sql.append("AND synDetailSerial.GOODS_ID                 =:goodsId ");
		sql.append("GROUP BY con.CONSTRUCTION_ID, ");
		sql.append("con.CODE, ");
		sql.append("synDetailSerial.GOODS_ID, ");
		sql.append("synDetailSerial.MER_ENTITY_ID, ");
		sql.append("synDetailSerial.GOODS_CODE, ");
		sql.append("synDetailSerial.GOODS_NAME, ");
		sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
		sql.append("nvl(synDetail.GOODS_IS_SERIAL,0) ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("constructionId", constructionId);
		query.setParameter("workItemId", workItemId);
		query.setParameter("goodsId", goodsId);
		query.setParameter("userid", userid);
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("merEntityId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsIsSerial", new StringType());
		query.addScalar("numberXuat", new DoubleType());
		query.addScalar("numberThuhoi", new DoubleType());
		query.addScalar("numberNghiemthuDB", new DoubleType());
		query.addScalar("numberNghiemThuKhac", new DoubleType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailVTADTO.class));

		return query.list();
	}

//	 public List<ConstructionAcceptanceCertDetailVTADTO> getListVatTuDetail(
//	 Long constructionId, Long workItemId, Long goodsId, long userid) {
//	 // TODO Auto-generated method stub
//	 StringBuilder sql = new StringBuilder("");
//	 sql.append("SELECT con.CONSTRUCTION_ID constructionId, ");
//	 sql.append("wi.WORK_ITEM_ID workItemId, ");
//	 sql.append("con.CODE constructionCode, ");
//	 sql.append("wi.NAME workItemName, ");
//	 sql.append("synDetailSerial.GOODS_ID goodsId , ");
//	 sql.append("synDetailSerial.MER_ENTITY_ID merEntityId, ");
//	 sql.append("synDetailSerial.GOODS_CODE goodsCode , ");
//	 sql.append("synDetailSerial.GOODS_NAME goodsName, ");
//	 sql.append("synDetailSerial.GOODS_UNIT_NAME goodsUnitName, ");
//	 sql.append("syn.REAL_IE_TRANS_DATE realIeTransDate, ");
//	 sql.append("synDetail.GOODS_IS_SERIAL goodsIsSerial, ");
//	 sql.append("NVL(SUM( ");
//	 sql.append("(SELECT SUM(serial.amount) ");
//	 sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
//	 sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_SER_ID = synDetailSerial.SYN_STOCK_TRANS_DETAIL_SER_ID ");
//	 sql.append("AND syn.TYPE                               =2 ");
//	 sql.append(")),0) numberXuat, ");
//	 sql.append("NVL(SUM( ");
//	 sql.append("(SELECT SUM(serial.amount) ");
//	 sql.append("FROM SYN_STOCK_TRANS_DETAIL_SERIAL serial ");
//	 sql.append("WHERE serial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
//	 sql.append("AND syn.TYPE                           =1 ");
//	 sql.append("AND syn.status                         =2 ");
//	 sql.append(")),0) numberThuhoi, ");
//	 sql.append("NVL(SUM( ");
//	 sql.append("(SELECT SUM(conMer.quantity) ");
//	 sql.append("FROM CONSTRUCTION_MERCHANDISE conMer ");
//	 sql.append("WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
//	 sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//	 sql.append("AND conMer.WORK_ITEM_ID    = wi.WORK_ITEM_ID ");
//	 sql.append("AND conMer.TYPE            = 1 ");
//	 sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
//	 sql.append("AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
//	 sql.append(")),0) numberNghiemthu, ");
//	 sql.append("NVL(SUM( ");
//	 sql.append("(SELECT SUM(conMer.quantity) ");
//	 sql.append("FROM CONSTRUCTION_MERCHANDISE conMer ");
//	 sql.append("WHERE conMer.GOODS_ID      = synDetailSerial.GOODS_ID ");
//	 sql.append("AND conMer.CONSTRUCTION_ID = con.CONSTRUCTION_ID ");
//	 sql.append("AND conMer.WORK_ITEM_ID   != wi.WORK_ITEM_ID ");
//	 sql.append("AND conMer.TYPE            = 1 ");
//	 sql.append("AND conMer.GOODS_IS_SERIAL = synDetail.GOODS_IS_SERIAL ");
//	 sql.append("AND conMer.MER_entity_id   = synDetailSerial.MER_entity_id ");
//	 sql.append(")),0) numberNghiemThuKhac ");
//	 sql.append("FROM SYN_STOCK_TRANS syn ");
//	 sql.append("INNER JOIN CONSTRUCTION con ");
//	 sql.append("ON con.code = syn.CONSTRUCTION_CODE ");
//	 sql.append("LEFT JOIN WORK_ITEM wi ");
//	 sql.append("ON con.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
//	 sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL synDetail ");
//	 sql.append("ON syn.SYN_STOCK_TRANS_ID     = synDetail.SYN_STOCK_TRANS_ID ");
//	 sql.append("AND synDetail.GOODS_IS_SERIAL = 0 ");
//	 sql.append("LEFT JOIN SYN_STOCK_TRANS_DETAIL_SERIAL synDetailSerial ");
//	 sql.append("ON synDetailSerial.SYN_STOCK_TRANS_DETAIL_ID = synDetail.SYN_STOCK_TRANS_DETAIL_ID ");
//	 sql.append("WHERE syn.SYN_TRANS_TYPE                     =1 ");
//	 sql.append("AND syn.CONFIRM                              =1 ");
//	 sql.append("AND con.CONSTRUCTION_ID                      =:constructionId ");
//	 sql.append("AND wi.WORK_ITEM_ID                          =:workItemId ");
//	 sql.append("AND wi.PERFORMER_ID                          =:userid ");
//	 sql.append("AND synDetailSerial.amount                   >0 ");
//	 sql.append("AND synDetailSerial.GOODS_ID=:goodsId ");
//	 sql.append("GROUP BY con.CONSTRUCTION_ID, ");
//	 sql.append("con.CODE, ");
//	 sql.append("wi.WORK_ITEM_ID, ");
//	 sql.append("wi.NAME, ");
//	 sql.append("synDetailSerial.GOODS_ID, ");
//	 sql.append("synDetailSerial.MER_ENTITY_ID, ");
//	 sql.append("synDetailSerial.GOODS_CODE, ");
//	 sql.append("synDetailSerial.GOODS_NAME, ");
//	 sql.append("synDetailSerial.GOODS_UNIT_NAME, ");
//	 sql.append("syn.REAL_IE_TRANS_DATE, ");
//	 sql.append("synDetail.GOODS_IS_SERIAL  ");
//	
//	 SQLQuery query = getSession().createSQLQuery(sql.toString());
//	 query.setParameter("workItemId", workItemId);
//	 query.setParameter("constructionId", constructionId);
//	 query.setParameter("goodsId", goodsId);
//	 query.setParameter("userid", userid);
//	 query.addScalar("constructionId", new LongType());
//	 query.addScalar("workItemId", new LongType());
//	 query.addScalar("constructionCode", new StringType());
//	 query.addScalar("workItemName", new StringType());
//	 query.addScalar("goodsId", new LongType());
//	 query.addScalar("merEntityId", new LongType());
//	 query.addScalar("goodsCode", new StringType());
//	 query.addScalar("goodsName", new StringType());
//	 query.addScalar("goodsUnitName", new StringType());
//	 query.addScalar("realIeTransDate", new StringType());
//	 query.addScalar("goodsIsSerial", new StringType());
//	 query.addScalar("numberXuat", new DoubleType());
//	 query.addScalar("numberThuhoi", new DoubleType());
//	 query.addScalar("numberNghiemthu", new DoubleType());
//	 query.addScalar("numberNghiemThuKhac", new DoubleType());
//	
//	 query.setResultTransformer(Transformers
//	 .aliasToBean(ConstructionAcceptanceCertDetailVTADTO.class));
//	
//	 return query.list();
//	 }

	public List<ConstructionAcceptanceCertDetailVTBDTO> getListVatTuB(
			Long constructionId, Long workItemId, Long goodsId, long sysUserId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT s.CONSTRUCTION_ID constructionId, ");
		sql.append("cons.code constructionCode, ");
		sql.append("s.WORK_ITEM_ID workItemId, ");
		sql.append("wi.Name workItemName, ");
		sql.append("m.MER_ENTITY_ID merEntityId, ");
		sql.append("m.GOODS_ID goodsId, ");
		sql.append("m.GOODS_CODE goodsCode, ");
		sql.append("m.GOODS_NAME goodsName, ");
		sql.append("m.SERIAL serial, ");
		sql.append("m.CAT_UNIT_NAME goodsUnitName, ");
		sql.append("SUM(ss.QUANTITY) numberXuat, ");
		sql.append("SUM( ");
		sql.append("(SELECT SUM(ae.quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append("WHERE m.goods_code              =ae.GOODS_CODE ");
		sql.append("AND a.CONSTRUCTION_ID           =s.CONSTRUCTION_ID ");
		sql.append("AND ae.MER_ENTITY_ID            =m.MER_ENTITY_ID ");
		sql.append("AND a.STATUS                   IN(1,2,3) ");
		sql.append(")) numberThuhoi, ");
		sql.append("(SELECT SUM(cm.QUANTITY) ");
		sql.append("FROM CONSTRUCTION_MERCHANDISE cm ");
		sql.append("WHERE cm.TYPE          =2 ");
		sql.append("AND m.GOODS_CODE       = cm.GOODS_CODE ");
		sql.append("AND s.CONSTRUCTION_ID  = cm.CONSTRUCTION_ID ");
		sql.append("and cm.WORK_ITEM_ID = s.WORK_ITEM_ID ");
		sql.append("AND cm.GOODS_IS_SERIAL = 0 ");
		sql.append(") numberSuDung  ");
		sql.append("FROM stock_trans s ");
		sql.append("LEFT JOIN CONSTRUCTION cons ");
		sql.append("ON s.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
		sql.append("INNER JOIN WORK_ITEM wi ");
		sql.append("ON wi.WORK_ITEM_ID    = s.WORK_ITEM_ID ");
		sql.append("AND s.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append("ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append("INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ");
		sql.append("ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID ");
		sql.append("AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID ");
		sql.append("INNER JOIN MER_ENTITY m ");
		sql.append("ON ss.MER_ENTITY_ID   =m.MER_ENTITY_ID ");
		sql.append("AND s.CONFIRM         = 1 ");
		sql.append("AND s.TYPE            = 2 ");
		sql.append("AND s.STATUS          = 2 ");

		sql.append("AND (M.SERIAL         IS NULL )  ");

		sql.append("AND sd.GOODS_IS_SERIAL=0 ");
		sql.append("AND wi.PERFORMER_ID   =:userid ");
		sql.append("AND s.CONSTRUCTION_ID =:constructionId ");
		sql.append("AND wi.WORK_ITEM_ID   =:workItemId ");
		sql.append("AND m.GOODS_ID   =:goodsId ");

		sql.append("GROUP BY s.CONSTRUCTION_ID, ");
		sql.append("cons.code, ");
		sql.append("s.WORK_ITEM_ID, ");
		sql.append("wi.Name, ");
		sql.append("m.MER_ENTITY_ID, ");
		sql.append("m.GOODS_ID, ");
		sql.append("m.GOODS_CODE, ");
		sql.append("m.GOODS_NAME, ");
		sql.append("m.CAT_UNIT_NAME, ");
		sql.append("m.SERIAL ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", workItemId);
		query.setParameter("userid", sysUserId);
		query.setParameter("constructionId", constructionId);
		query.setParameter("goodsId", goodsId);
		query.addScalar("constructionId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("workItemId", new LongType());
		query.addScalar("workItemName", new StringType());
		query.addScalar("merEntityId", new LongType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("numberXuat", new DoubleType());
		// query.addScalar("quantity", new DoubleType());
		// query.addScalar("conMerquantity", new DoubleType());
		query.addScalar("numberThuhoi", new DoubleType());
		query.addScalar("numberSuDung", new DoubleType());
		// query.addScalar("constructionMerchadiseId", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailVTBDTO.class));

		return query.list();
	}

	/**
	 * Màn hình chi tiết hạng mục
	 *
	 * @param constructionId
	 * @return List<ConstructionTaskDTO>
	 * @author CuongNV2
	 */
	public List<ConstructionImageInfo> getListImageByConstructionId(
			Long workItemId) {
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT ");
		sql.append("a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status ");
		sql.append("FROM ");
		sql.append("UTIL_ATTACH_DOCUMENT a ");
		sql.append("WHERE ");
		sql.append("a.object_id = :workItemId ");
		sql.append("AND a.TYPE = '45' ");
		sql.append("ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("imageName", new StringType());
		query.addScalar("imagePath", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("utilAttachDocumentId", new LongType());
		query.setParameter("workItemId", workItemId);
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionImageInfo.class));
		return query.list();
	}

	public void updateStatusNT(Long constructionId, Long workItemId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" DELETE CONSTRUCTION_MERCHANDISE cm where  cm.CONSTRUCTION_ID=:constructionId and cm.WORK_ITEM_ID =:workItemId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("constructionId", constructionId);
		query.setParameter("workItemId", workItemId);
		query.executeUpdate();

	}

	public void deleteImageAcceptance(Long workItemId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" delete UTIL_ATTACH_DOCUMENT uad where uad.OBJECT_ID=:workItemId and uad.TYPE='45' ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("workItemId", workItemId);
		query.executeUpdate();

	}

	public long getValueToInitConstructionNoAcceptance(
			ConstructionAcceptanceDTORequest request) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT COUNT(wi.WORK_ITEM_ID) totalConstructionAcceptance ");
		sql.append("FROM CONSTRUCTION cons ");
		sql.append("LEFT JOIN work_item wi ");
		sql.append("ON wi.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
		sql.append("WHERE ((cons.STATUS      IN (3,4,5) ");
		sql.append("AND wi.STATUS             = 3) ");
		sql.append("OR (cons.STATUS           =4 ");
		sql.append("AND cons.OBSTRUCTED_STATE = 2 ");
		sql.append("AND wi.STATUS             = 2)) ");
		sql.append("AND wi.PERFORMER_ID       =:userid  ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.addScalar("totalConstructionAcceptance", new LongType());
		return (long) query.uniqueResult();
	}

	public List<ConstructionAcceptanceCertDetailDTO> getValueToInitConstructionAcceptance(
			ConstructionAcceptanceDTORequest request) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT wi.WORK_ITEM_ID workitemId  ");
		sql.append("FROM CONSTRUCTION cons ");
		sql.append("LEFT JOIN work_item wi ");
		sql.append("ON wi.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
		sql.append("WHERE ((cons.STATUS      IN (3,4,5) ");
		sql.append("AND wi.STATUS             = 3) ");
		sql.append("OR (cons.STATUS           =4 ");
		sql.append("AND cons.OBSTRUCTED_STATE = 2 ");
		sql.append("AND wi.STATUS             = 2)) ");
		sql.append("AND wi.PERFORMER_ID       =:userid  ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("userid", request.getSysUserRequest().getSysUserId());
		query.addScalar("workItemId", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailDTO.class));

		return query.list();
	}

	public List<ConstructionAcceptanceCertDetailDTO> getWorkitemIdConmerchandise() {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("select distinct cm.WORK_ITEM_ID workItemId from CONSTRUCTION_MERCHANDISE cm where cm.WORK_ITEM_ID is not null  ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("workItemId", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionAcceptanceCertDetailDTO.class));

		return query.list();
	}

	/**
	 * saveImagePaths
	 *
	 * @param lstConstructionImages
	 * @param constructionTaskId
	 * @param request
	 */
	public void saveImagePathsDao(
			List<ConstructionImageInfo> lstConstructionImages, long workItemId,
			SysUserRequest request) {

		if (lstConstructionImages == null) {
			return;
		}

		for (ConstructionImageInfo constructionImage : lstConstructionImages) {

			UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
			UtilAttachDocumentDTO util = new UtilAttachDocumentDTO();

			util.setObjectId(workItemId);
			util.setName(constructionImage.getImageName());
			util.setType("45");
			util.setDescription("file ảnh nghiem thu");
			util.setStatus("1");
			util.setFilePath(constructionImage.getImagePath());
			util.setCreatedDate(new Date());
			util.setCreatedUserId(request.getSysUserId());
			// utilAttachDocumentBO.setCreatedUserName(request.getName());
			util.setUtilAttachDocumentId(11155l);

			utilAttachDocumentDAO.saveObject(util.toModel());
			String a = "abc";
			// System.out.println("ret " + ret);
		}
	}

	public String getUserName(long sysUserId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("select FULL_NAME fullName from SYS_USER where SYS_USER_ID=:sysUserId ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId", sysUserId);
		query.addScalar("fullName", new StringType());

		return (String) query.uniqueResult();

	}
//	hoanm1_20190131_start
	public void updateWorkItemNT(Long workItemId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" update work_item set is_acceptance =1 where WORK_ITEM_ID =:workItemId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", workItemId);
		query.executeUpdate();

	}
	public Double avgAcceptanceWorkItem(Long constructionId) {
       String sql = new String("select nvl(round(AVG(is_acceptance),2),0)status from work_item where construction_id = :constructionId ");
       SQLQuery query = getSession().createSQLQuery(sql);
       query.addScalar("status", new DoubleType());
       query.setParameter("constructionId", constructionId);
       List<Double> lstDoub = query.list();
       if (lstDoub != null && lstDoub.size() > 0) {
           return lstDoub.get(0);
       }
       return 0D;
   }
	public void updateConstructionNT(Long constructionId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" update construction set Approved_acceptance =1,Acceptance_date=sysdate where construction_id = :constructionId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("constructionId", constructionId);
		query.executeUpdate();

	}
	
	public void updateDeleteWorkItemNT(Long workItemId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" update work_item set is_acceptance = null where WORK_ITEM_ID =:workItemId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("workItemId", workItemId);
		query.executeUpdate();

	}
	
	public void updateDeleteConstructionNT(Long constructionId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(" ");
		sql.append(" update construction set Approved_acceptance = null,Acceptance_date=null where construction_id = :constructionId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("constructionId", constructionId);
		query.executeUpdate();

	}
//	hoanm1_20190131_end
}
