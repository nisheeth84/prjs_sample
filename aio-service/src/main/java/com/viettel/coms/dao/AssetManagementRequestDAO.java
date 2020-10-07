/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import java.math.BigDecimal;
import java.util.List;

import javassist.convert.Transformer;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.cat.utils.ValidateUtils;
import com.viettel.coms.bo.AssetManageRequestEntityBO;
import com.viettel.coms.bo.AssetManagementRequestBO;
import com.viettel.coms.dto.AssetManageRequestEntityDetailDTO;
import com.viettel.coms.dto.AssetManagementRequestDetailDTO;
import com.viettel.coms.dto.CatCommonDTO;
import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.coms.dto.StockTransGeneralDTO;
import com.viettel.coms.dto.manufacturingVT_DTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.dto.StockTransDTO;
import com.viettel.coms.dto.GoodsDetailEditDTO;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("assetManagementRequestDAO")
public class AssetManagementRequestDAO extends BaseFWDAOImpl<AssetManagementRequestBO, Long> {

	public AssetManagementRequestDAO() {
		this.model = new AssetManagementRequestBO();
	}

	public AssetManagementRequestDAO(Session session) {
		this.session = session;
	}

	public Long getProvinceIdByCatStationId(Long constructionId) {
		if (constructionId == null) {
			return -1L;
		}
		StringBuilder sql = new StringBuilder("SELECT catPro.CAT_PROVINCE_ID catProvinceId"
				+ " FROM CAT_PROVINCE catPro " + " LEFT JOIN CAT_STATION catStation "
				+ " ON catPro.CAT_PROVINCE_ID       = catStation.CAT_PROVINCE_ID " + " LEFT JOIN CONSTRUCTION con "
				+ " ON catStation.CAT_STATION_ID = con.CAT_STATION_ID "
				+ " WHERE con.CONSTRUCTION_ID =:constructionId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("constructionId", constructionId);
		query.addScalar("catProvinceId", new LongType());
		List<Long> list = query.list();
		if (list != null && !list.isEmpty()) {
			return list.get(0);
		}
		return -1L;
	}

	public List<AssetManagementRequestDetailDTO> doSearch(AssetManagementRequestDetailDTO obj,
			List<String> groupIdList) {
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT distinct a.ASSET_MANAGEMENT_REQUEST_ID assetManagementRequestId,");
		sql.append("  a.CODE code, ");
		sql.append("  a.STATUS status, ");
		sql.append("  a.CONTENT content, ");
		sql.append("  a.CAT_REASON_ID catReasonId, ");
		sql.append("  d.NAME reasonName, ");
		sql.append("  s1.NAME requestGroupName, ");
		sql.append("  a.REQUEST_GROUP_ID requestGroupId, ");
		sql.append("  s2.NAME receiveGroupName, ");
		sql.append("  a.RECEIVE_GROUP_ID receiveGroupId, ");
		sql.append("  cs.code catStationCode, ");
		sql.append("  c.code constructionCode, ");
		sql.append("  cst.NAME catName, ");
		sql.append("  cst.CODE catCode, ");
		sql.append("  catPro.CAT_PROVINCE_ID catProvinceId, ");
		sql.append("  catPro.CODE catProvinceCode, ");
		sql.append("  catPro.NAME catProvinceName, ");
		sql.append("  c.CONSTRUCTION_ID constructionId ");
		sql.append(" FROM ASSET_MANAGEMENT_REQUEST a "
				+ "left join SYS_GROUP s1 on a.REQUEST_GROUP_ID          = s1.SYS_GROUP_ID "
				+ "left join  SYS_GROUP s2 on a.RECEIVE_GROUP_ID            = s2.SYS_GROUP_ID "
				+ "inner join CONSTRUCTION c on  a.CONSTRUCTION_ID             = c.CONSTRUCTION_ID "
				+ "LEFT JOIN CAT_STOCK cst ON c.SYS_GROUP_ID=cst.SYS_GROUP_ID and cst.TYPE=1 "
				+ "inner join CAT_REASON d on a.CAT_REASON_ID               = d.REASON_ID "
				+ "LEFT JOIN CAT_STOCK cst ON c.SYS_GROUP_ID=cst.SYS_GROUP_ID and cst.TYPE=1 "
				+ "inner join CAT_STATION cs on cs.CAT_STATION_ID             = c.CAT_STATION_ID "
//				+ "left join CNT_CONSTR_WORK_ITEM_TASK  ccwtt on ccwtt.CONSTRUCTION_ID   = c.CONSTRUCTION_ID "
//				+ "left join CNT_CONTRACT  cnt on cnt.CNT_CONTRACT_ID   = ccwtt.CNT_CONTRACT_ID "
				+ "left join cat_province catPro  on catPro.CAT_PROVINCE_ID   = cs.CAT_PROVINCE_ID ");
		sql.append(" WHERE 1=1 ");
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			sql.append(
					" AND (upper(a.CODE) LIKE upper(:keySearch) OR upper(cs.code) LIKE upper(:keySearch)  OR upper(c.code) LIKE upper(:keySearch) OR upper(catPro.code) LIKE upper(:keySearch) OR upper(catPro.name) LIKE upper(:keySearch) OR upper(cs.code) LIKE upper(:keySearch)  OR upper(cnt.code) LIKE upper(:keySearch) escape '&')");
		}
		if (obj.getListStatus() != null && obj.getListStatus().size() > 0) {
			sql.append(" AND a.STATUS in :listStatus ");
		}
		if (obj.getReceiveGroupId() != null) {
			sql.append(" AND s2.SYS_GROUP_ID =:receiveGroupId ");
		}
		if (obj.getRequestGroupId() != null) {
			sql.append(" AND s1.SYS_GROUP_ID =:requestGroupId ");
		}
		if (groupIdList != null && !groupIdList.isEmpty()) {
			sql.append(" and catPro.CAT_PROVINCE_ID in :groupIdList ");
		}
		if (obj.getCatProvinceId() != null) {
			sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
		}
		sql.append(" ORDER BY a.ASSET_MANAGEMENT_REQUEST_ID DESC");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("assetManagementRequestId", new LongType());
		query.addScalar("requestGroupId", new LongType());
		query.addScalar("receiveGroupId", new LongType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("catReasonId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("requestGroupName", new StringType());
		query.addScalar("receiveGroupName", new StringType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("reasonName", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("catName", new StringType());
		query.addScalar("catCode", new StringType());
		query.addScalar("catProvinceId", new LongType());
		query.addScalar("catProvinceCode", new StringType());
		query.addScalar("catProvinceName", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManagementRequestDetailDTO.class));
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
			queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
		}
		if (obj.getListStatus() != null && obj.getListStatus().size() > 0) {
			query.setParameterList("listStatus", obj.getListStatus());
			queryCount.setParameterList("listStatus", obj.getListStatus());
		}
		if (obj.getReceiveGroupId() != null) {
			query.setParameter("receiveGroupId", obj.getReceiveGroupId());
			queryCount.setParameter("receiveGroupId", obj.getReceiveGroupId());

		}
		if (obj.getRequestGroupId() != null) {
			query.setParameter("requestGroupId", obj.getRequestGroupId());
			queryCount.setParameter("requestGroupId", obj.getRequestGroupId());
		}
		if (groupIdList != null && !groupIdList.isEmpty()) {
			query.setParameterList("groupIdList", groupIdList);
			queryCount.setParameterList("groupIdList", groupIdList);
		}
		if (obj.getCatProvinceId() != null) {
			query.setParameter("catProvinceId", obj.getCatProvinceId());
			queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
		}
		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

		return query.list();
	}
//	hungtd_20181217_start
	public List<manufacturingVT_DTO> doSearchVT(manufacturingVT_DTO obj) {
		StringBuilder sql = new StringBuilder("select T.GOODS_PLAN_ID goodsPlanId,"
				+ " T.CODE code,"
				+ " T.NAME name,"
				+ " T.CREATED_DATE createdDate,"
//				+ " T.CONSTRUCTION_ID constructionId,"
//				+ " T.CNT_CONTRACT_ID cntContractId,"
//				+ " T.GOODS_NAME goodsName,"
//				+ " T.DESCRIPTION description,"
//				+ " T.EXPECTED_DATE expectedDate,"
				+ " T.BASE_CONTENT baseContent,"
				+ " T.PERFORM_CONTENT performContent,"
				+ " T.STATUS status "
				+ " from GOODS_PLAN T WHERE 1=1 AND T.STATUS!='0'");
		
		if (obj.getCode() != null) {
			sql.append(" AND (upper(T.CODE) LIKE upper(:code) OR upper(T.CODE) LIKE upper(:code) escape '&')");
		}
		if (obj.getName() != null) {
			sql.append(" AND (upper(T.NAME) LIKE upper(:name) OR upper(T.NAME) LIKE upper(:name) escape '&')");
		}
		if (obj.getStatus() != null) {
			sql.append(" AND (upper(T.STATUS) LIKE upper(:status) OR upper(T.STATUS) LIKE upper(:status) escape '&')");
		}
//		if (obj.getStationCode() != null) {
//			sql.append(" AND (upper(T.CAT_STATTION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATTION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
//		}
//		if (obj.getCntContractCode() != null) {
//			sql.append(" AND (upper(T.CNT_CONTRACT_CODE) LIKE upper(:cntContractCode) OR upper(T.CNT_CONTRACT_CODE) LIKE upper(:cntContractCode) escape '&')");
//		}
		/*hungtd_20180311_strat*/
		if (obj.getDateFrom() != null) {
			sql.append(" and T.CREATED_DATE >= :monthYearFrom ");
		}
		if (obj.getDateTo() != null) {
			sql.append(" and T.CREATED_DATE <= :monthYearTo ");
		}
		/*hungtd_20180311_end*/

//		if (StringUtils.isNotEmpty(obj.getConstructionCode())) {
//			sql.append(" AND (upper(T.CONSTRUCTION_CODE) LIKE upper(:constructionCode) OR upper(T.CONSTRUCTION_CODE) LIKE upper(:constructionCode) escape '&')");
//		}

//		if (StringUtils.isNotEmpty(obj.getRequestContent())) {
//			sql.append(" AND (upper(T.REQUEST_CONTENT) LIKE upper(:requestContent) OR upper(T.REQUEST_CONTENT) LIKE upper(:requestContent) escape '&')");
//		}

//		if (null!=obj.getCreatedDate()) {
//			sql.append(" AND (upper(T.CREATED_DATE) LIKE upper(:createdDate) OR upper(T.CREATED_DATE) LIKE upper(:createdDate) escape '&')");
//		}
		
		sql.append(" ORDER BY T.GOODS_PLAN_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
//		query.addScalar("goodsName", new StringType());
//		query.addScalar("constructionId", new LongType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("description", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		
//		query.addScalar("number", new LongType());
		query.addScalar("baseContent", new StringType());
//		query.addScalar("expectedDate", new DateType());
		query.addScalar("performContent", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(manufacturingVT_DTO.class));
		if (obj.getStatus() != null) {
			query.setParameter("status", "%" + (obj.getStatus()) + "%");
			queryCount.setParameter("status", "%" + (obj.getStatus()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getCode())) {
			query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
			queryCount.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getName())) {
			query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
			queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
		}
//		if (null!=obj.getCreatedDate()) {
//			query.setParameter("createdDate", obj.getCreatedDate());
//			queryCount.setParameter("createdDate",obj.getCreatedDate());
//		}
		if (obj.getDateFrom() != null) {
            query.setParameter("monthYearFrom", obj.getDateFrom());
            queryCount.setParameter("monthYearFrom", obj.getDateFrom());
            
        }
        if (obj.getDateTo() != null) {
            query.setParameter("monthYearTo", obj.getDateTo());
            queryCount.setParameter("monthYearTo", obj.getDateTo());
            
        }
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		List ls = query.list();
		return ls;
	}
//	hungtd_20190102_start
	public List<manufacturingVT_DTO> doSearchdetail(Long requestgoodsId) {
		StringBuilder sql = new StringBuilder("select a.REQUEST_GOODS_ID requestgoodsId,"
				+ " b.REQUEST_GOODS_DETAIL_ID requestgoodsDetailId,"
				+ " a.CONSTRUCTION_CODE constructionCode,"
				+ " a.CNT_CONTRACT_CODE cntContractCode,"
				+ " a.CONSTRUCTION_ID constructionId,"
				+ " a.CNT_CONTRACT_ID cntContractId,"
				+ " a.CREATED_DATE createdDate,"
				+ " a.SYS_GROUP_ID sysgroupId,"
				+ " b.GOODS_NAME goodsName,"
				+ " b.CAT_UNIT_NAME catUnitName,"
				+ " b.CAT_UNIT_ID catUnitId"
				+ " a.DESCRIPTION description,"
				+ " b.QUANTITY quantity"
				+ " from REQUEST_GOODS a,REQUEST_GOODS_DETAIL b WHERE a.REQUEST_GOODS_ID=b.REQUEST_GOODS_ID and a.REQUEST_GOODS_ID=:requestgoodsId");
		
		
//		if (obj.getSysgroupId() != null) {
//			sql.append(" AND (upper(T.SYS_GROUP_ID) LIKE upper(:sysgroupId) OR upper(T.SYS_GROUP_ID) LIKE upper(:sysgroupId) escape '&')");
//		}
		
		
		
		sql.append(" ORDER BY a.REQUEST_GOODS_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("requestgoodsId", new LongType());
		query.addScalar("quantity", new LongType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("sysgroupId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("requestGoodsDetailId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("constructionId", new StringType());
		query.addScalar("cntContractId", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(manufacturingVT_DTO.class));
		
			query.setParameter("requestgoodsId", requestgoodsId);
			queryCount.setParameter("requestgoodsId", requestgoodsId);
		
//		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		List ls = query.list();
		return ls;
	}
	public List<GoodsDetailEditDTO> Search(Long requestgoodsId) {
		StringBuilder sql = new StringBuilder("select a.REQUEST_GOODS_ID requestgoodsId,"
				+ " b.REQUEST_GOODS_DETAIL_ID requestgoodsDetailId,"
				+ " a.CONSTRUCTION_CODE constructionCode,"
				+ " a.CNT_CONTRACT_CODE cntContractCode,"
				+ " b.GOODS_NAME goodsName,"
				+ " b.CAT_UNIT_NAME catUnitName,"
				+ " b.EXPECTED_DATE expectedDate"
				+ " a.DESCRIPTION description,"
				+ " b.QUANTITY quantity"
				+ " from REQUEST_GOODS a,REQUEST_GOODS_DETAIL b WHERE a.REQUEST_GOODS_ID=b.REQUEST_GOODS_ID and a.REQUEST_GOODS_ID=:requestgoodsId");
		sql.append(" ORDER BY a.REQUEST_GOODS_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("requestgoodsId", new LongType());
		query.addScalar("quantity", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("requestGoodsDetailId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("createdDate", new DateType());

		query.setResultTransformer(Transformers.aliasToBean(manufacturingVT_DTO.class));
		
			query.setParameter("requestgoodsId", requestgoodsId);
			queryCount.setParameter("requestgoodsId", requestgoodsId);
		
//		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		List ls = query.list();
		return ls;
	}
	public List<manufacturingVT_DTO> doSearchPopup(manufacturingVT_DTO obj) {
		StringBuilder sql = new StringBuilder("select a.REQUEST_GOODS_ID requestgoodsId,"
				+ " b.REQUEST_GOODS_DETAIL_ID requestgoodsDetailId,"
				+ " a.CONSTRUCTION_CODE constructionCode,"
				+ " a.CNT_CONTRACT_CODE cntContractCode,"
				+ " a.CONSTRUCTION_ID constructionId,"
				+ " a.CNT_CONTRACT_ID cntContractId,"
//				+ " a.CREATED_DATE createdDate,"
				+ " a.SYS_GROUP_ID sysgroupId,"
				+ " b.GOODS_NAME goodsName,"
				+ " b.CAT_UNIT_NAME catUnitName,"
				+ " a.DESCRIPTION description,"
				+ " b.QUANTITY quantity"
				+ " from REQUEST_GOODS a,REQUEST_GOODS_DETAIL b WHERE a.REQUEST_GOODS_ID=b.REQUEST_GOODS_ID");
		
		if (obj.getSysgroupId() != null) {
			sql.append(" AND (upper(T.SYS_GROUP_ID) LIKE upper(:sysgroupId) OR upper(T.GOODS_PLAN_DETAIL_ID) LIKE upper(:sysgroupId) escape '&')");
		}
//		if (obj.getStationCode() != null) {
//			sql.append(" AND (upper(T.CAT_STATTION_HOUSE_CODE) LIKE upper(:stationCode) OR upper(T.CAT_STATTION_HOUSE_CODE) LIKE upper(:stationCode) escape '&')");
//		}
//		if (obj.getCntContractCode() != null) {
//			sql.append(" AND (upper(T.CNT_CONTRACT_CODE) LIKE upper(:cntContractCode) OR upper(T.CNT_CONTRACT_CODE) LIKE upper(:cntContractCode) escape '&')");
//		}
//		if (obj.getDateFrom() != null) {
//			sql.append(" and T.CREATED_DATE >= :monthYearFrom ");
//		}
//		if (obj.getDateTo() != null) {
//			sql.append(" and T.CREATED_DATE <= :monthYearTo ");
//		}
		
		sql.append(" ORDER BY a.REQUEST_GOODS_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("requestgoodsId", new LongType());
		query.addScalar("quantity", new LongType());
		query.addScalar("sysgroupId", new LongType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("requestGoodsDetailId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("goodsName", new StringType());
//		query.addScalar("createdDate", new DateType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("cntContractId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(manufacturingVT_DTO.class));
		if (obj.getRequestgoodsId() != null) {
			query.setParameter("requestgoodsId", "%" + (obj.getRequestgoodsId()) + "%");
			queryCount.setParameter("requestgoodsId", "%" + (obj.getRequestgoodsId()) + "%");
		}
		if (null!=obj.getRequestGoodsDetailId()) {
			query.setParameter("requestGoodsDetailId", "%" + (obj.getRequestGoodsDetailId()) + "%");
			queryCount.setParameter("requestGoodsDetailId", "%" + (obj.getRequestGoodsDetailId()) + "%");
		}
		if (null!=obj.getQuantity()) {
			query.setParameter("quantity", "%" + (obj.getQuantity()) + "%");
			queryCount.setParameter("quantity", "%" + (obj.getQuantity()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getCntContractCode())) {
			query.setParameter("cntContractCode", "%" + ValidateUtils.validateKeySearch(obj.getCntContractCode()) + "%");
			queryCount.setParameter("cntContractCode", "%" + ValidateUtils.validateKeySearch(obj.getCntContractCode()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getConstructionCode())) {
			query.setParameter("constructionCode", "%" + ValidateUtils.validateKeySearch(obj.getConstructionCode()) + "%");
			queryCount.setParameter("constructionCode", "%" + ValidateUtils.validateKeySearch(obj.getConstructionCode()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getGoodsName())) {
			query.setParameter("goodsName", "%" + ValidateUtils.validateKeySearch(obj.getGoodsName()) + "%");
			queryCount.setParameter("goodsName", "%" + ValidateUtils.validateKeySearch(obj.getGoodsName()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getCatUnitName())) {
			query.setParameter("catUnitName", "%" + ValidateUtils.validateKeySearch(obj.getCatUnitName()) + "%");
			queryCount.setParameter("catUnitName", "%" + ValidateUtils.validateKeySearch(obj.getCatUnitName()) + "%");
		}
		if (obj.getCreatedDate() != null) {
            query.setParameter("createdDate", obj.getCreatedDate());
            queryCount.setParameter("createdDate", obj.getCreatedDate());
            
        }
//        if (obj.getDateTo() != null) {
//            query.setParameter("monthYearTo", obj.getDateTo());
//            queryCount.setParameter("monthYearTo", obj.getDateTo());
//            
//        }
		obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		List ls = query.list();
		return ls;
	}
//	hungtd_20190102_end
	public void removeVT(Long goodsPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("UPDATE GOODS_PLAN set status = 0  where GOODS_PLAN_ID = :goodsPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("goodsPlanId", goodsPlanId);
        query.executeUpdate();
    }
	public void openVT(Long goodsPlanId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("UPDATE GOODS_PLAN set status = 0  where GOODS_PLAN_ID = :goodsPlanId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("goodsPlanId", goodsPlanId);
        query.executeUpdate();
    }
	public void Registry(Long requestgoodsId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("UPDATE REQUEST_GOODS set status = 0  where REQUEST_GOODS_ID = :requestgoodsId");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("requestgoodsId", requestgoodsId);
        query.executeUpdate();
    }
	public manufacturingVT_DTO findByCode(String code) {
		StringBuilder sql = new StringBuilder("select T.GOODS_PLAN_ID goodsPlanId,"
				+ " T.CODE code,"
				+ " T.NAME name,"
				+ " T.CREATED_DATE createdDate,"
				+ " T.status,"
				+ " T.BASE_CONTENT baseContent,"
				+ " T.PERFORM_CONTENT performContent"
				+ " from GOODS_PLAN T WHERE 1=1 AND upper(T.CODE) LIKE upper(:code)");
    	
		sql.append(" ORDER BY T.GOODS_PLAN_ID DESC ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("goodsPlanId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("createdDate", new DateType());
		query.addScalar("status", new LongType());
		query.addScalar("baseContent", new StringType());
		query.addScalar("performContent", new StringType());
		
		query.setParameter("code", code);
		query.setResultTransformer(Transformers.aliasToBean(manufacturingVT_DTO.class));    	

		return (manufacturingVT_DTO) query.uniqueResult();
	}
//	hungtd_20181225_end
	public AssetManagementRequestDetailDTO getById(Long id) {
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT a.ASSET_MANAGEMENT_REQUEST_ID assetManagementRequestId,");
		sql.append("  a.CODE code, ");
		sql.append("  ord.CODE codeOrders, ");
		sql.append("  a.STATUS status, ");
		sql.append("  a.CONTENT content, ");
		sql.append("  a.description description, ");
		sql.append("  a.CAT_REASON_ID catReasonId, ");
		sql.append("  d.NAME reasonName, ");
		sql.append("  s1.NAME requestGroupName, ");
		sql.append("   a.REQUEST_GROUP_ID requestGroupId, ");
		sql.append("  s2.NAME receiveGroupName, ");
		sql.append("   a.RECEIVE_GROUP_ID receiveGroupId, ");
		sql.append("  cs.code catStationCode, ");
		sql.append("  c.code constructionCode, ");
		sql.append("  c.CONSTRUCTION_ID constructionId, ");
		sql.append("  cst.NAME catName, ");
		sql.append("  cst.CODE catCode, ");
		sql.append("  cst.CAT_STOCK_ID catStockId ");
		sql.append(" FROM ASSET_MANAGEMENT_REQUEST a "
				+ "left join SYS_GROUP s1 on a.REQUEST_GROUP_ID          = s1.SYS_GROUP_ID "
				+ "left join  SYS_GROUP s2 on a.RECEIVE_GROUP_ID            = s2.SYS_GROUP_ID "
				+ "inner join CONSTRUCTION c on  a.CONSTRUCTION_ID             = c.CONSTRUCTION_ID "
				+ "LEFT JOIN CAT_STOCK cst ON c.SYS_GROUP_ID=cst.SYS_GROUP_ID and cst.TYPE=1 "
				+ "inner join CAT_REASON d on a.CAT_REASON_ID               = d.REASON_ID "
				+ "inner join CAT_STATION cs on cs.CAT_STATION_ID             = c.CAT_STATION_ID "
				+ "left join ORDERS ord on a.asset_management_request_id = ord.asset_management_request_id ");

		sql.append(" WHERE ");

		sql.append("  a.ASSET_MANAGEMENT_REQUEST_ID   =:id ");

		sql.append(" ORDER BY a.ASSET_MANAGEMENT_REQUEST_ID DESC");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("id", id);

		query.addScalar("assetManagementRequestId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("codeOrders", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("content", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("catReasonId", new LongType());
		query.addScalar("reasonName", new StringType());
		query.addScalar("requestGroupName", new StringType());
		query.addScalar("requestGroupId", new LongType());
		query.addScalar("receiveGroupName", new StringType());
		query.addScalar("receiveGroupId", new LongType());
		query.addScalar("catStationCode", new StringType());
		query.addScalar("constructionCode", new StringType());
		query.addScalar("constructionId", new LongType());
		query.addScalar("catName", new StringType());
		query.addScalar("catCode", new StringType());
		query.addScalar("catStockId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManagementRequestDetailDTO.class));

		return (AssetManagementRequestDetailDTO) query.uniqueResult();
	}

	public List<AssetManageRequestEntityDetailDTO> getAmrdTHVTTBDTOListByParent(Long id, Long assetManagementRequestId,
			Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT  " + "MER.GOODS_CODE goodsCode, "
				+ " MER.APPLY_PRICE applyPrice, ss.PRICE price, ss.QUANTITY quantity, " + " goo.GOODS_TYPE goodsType, "
				+ " goo.UNIT_TYPE unitType, " + " appp.NAME goodsTypeName, " + "MER.mer_entity_id merEntityId , "
				+ "MER.GOODS_ID goodsId, " + "MER.GOODS_NAME goodsName, " + "MER.CAT_UNIT_NAME goodsUnitName, " + ""
				+ "nvl(SUM(ss.QUANTITY), 0) amountPX , " + "nvl(sum((SELECT sum(cm.QUANTITY) "
				+ "FROM CONSTRUCTION_MERCHANDISE cm " + "WHERE cm.TYPE     =2 "
				+ "AND mer.mer_entity_id = cm.mer_entity_id " + "and s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID "
				+ ")), 0) amountNT , " + "nvl(sum((SELECT  " + "SUM(quantity) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID " + "WHERE a.STATUS    =3 "
				+ "and a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");
		} else
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId ");
		sql.append(" )), 0) amountDTH, ");
		sql.append("nvl(sum((SELECT ");
		sql.append("SUM(quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append("WHERE a.STATUS    in (1,2) ");
		sql.append("and a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");

		} else
			sql.append("and a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId ");

		sql.append(")), 0) amountDYCTH, ");
		sql.append("nvl(sum((SELECT  ");
		sql.append("SUM(quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");

		} else
			sql.append("and a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId  ");

		sql.append("WHERE ");
		sql.append("a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
		sql.append(")), 0) consQuantity ");
		sql.append("FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append("ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append("AND s.CONFIRM       = 1 ");
		sql.append("AND s.TYPE          = 2 ");
		sql.append("AND s.STATUS        = 2 " + "AND s.CONSTRUCTION_ID       =:id "
				+ " left join GOODS goo on goo.GOODS_ID = :goodsId "
				+ " left join APP_PARAM appp on appp.PAR_ORDER = goo.GOODS_TYPE AND appp.PAR_TYPE = 'GOODS_TYPE' "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss " + "ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID "
				+ "AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY MER ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL is null "
				+ "WHERE MER.GOODS_ID = :goodsId AND MER.STATUS = 5 "
				+ "group by  s.CONSTRUCTION_ID,MER.GOODS_ID,MER.mer_entity_id, goo.GOODS_TYPE, goo.UNIT_TYPE, appp.NAME,MER.APPLY_PRICE, ss.PRICE, ss.QUANTITY, "
				+ "MER.GOODS_CODE, " + "MER.GOODS_NAME, " + "MER.CAT_UNIT_NAME, " + "s.REAL_IE_TRANS_DATE ");

		sql.append(" ORDER BY s.REAL_IE_TRANS_DATE DESC,MER.mer_entity_id  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.setParameter("goodsId", goodsId);
		if (assetManagementRequestId != null) {
			query.setParameter("assetManagementRequestId", assetManagementRequestId);

		}
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getAmrdTHVTTBDTOListByParent2(Long goodsId,Long constructionId) {
		StringBuilder sql = new StringBuilder("SELECT MER.GOODS_CODE goodsCode, "
			+ " MER.APPLY_PRICE applyPrice, " 
			+ " stds.PRICE price, "
			+ " MER.AMOUNT quantity, " 
			+ " MER.AMOUNT amount, "
			+ " goo.GOODS_TYPE goodsType, " 
			+ " goo.UNIT_TYPE unitType, "
			+ " appp.NAME goodsTypeName, "
			+ " MER.mer_entity_id merEntityId , " 
			+ " MER.GOODS_ID goodsId, "
			+ " MER.GOODS_NAME goodsName, "
			+ " MER.PARENT_MER_ENTITY_ID parentMerEntityId," 
			+ " MER.CAT_UNIT_NAME goodsUnitName " 
			+ " FROM MER_ENTITY MER, APP_PARAM appp, "
			+ " GOODS goo,stock_trans st,STOCK_TRANS_DETAIL std,STOCK_TRANS_DETAIL_SERIAL stds "
			+ " where MER.GOODS_ID=goo.GOODS_ID "
			+ " and goo.GOODS_TYPE=appp.PAR_ORDER (+) AND appp.PAR_TYPE = 'GOODS_TYPE' " 
			+ " and (MER.mer_entity_id=stds.mer_entity_id) "//OR  stds.mer_entity_id = MER.PARENT_MER_ENTITY_ID) 
			+ " and stds.STOCK_TRANS_ID = st.STOCK_TRANS_ID AND stds.STOCK_TRANS_DETAIL_ID = std.STOCK_TRANS_DETAIL_ID " 
			+ " and st.STOCK_TRANS_ID = std.STOCK_TRANS_ID "
			+ " and  goo.GOODS_ID = :goodsId "
			+ " and st.construction_id = :constructionId "
			+ " AND st.CONFIRM = 1 AND st.TYPE = 2 AND st.STATUS= 2 "
			+ "AND MER.STATUS=5 ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("goodsId", goodsId);
		query.setParameter("constructionId", constructionId);
		query.addScalar("goodsCode", new StringType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("parentMerEntityId", new DoubleType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> LAYTHEOGROUP(Long id, Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("WITH tableA AS(SELECT SUM(NVL(ME.AMOUNT,0)) amountPX, ME.GOODS_ID FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM= 1 AND s.TYPE= 2 AND s.STATUS= 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID= s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID AND ME.SERIAL IS NULL AND ME.STATUS=5 "
				+ "GROUP BY s.CONSTRUCTION_ID,ME.GOODS_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME) "
				+ "SELECT  " + "MER.GOODS_CODE goodsCode, " + "MER.GOODS_ID goodsId, "
				+ "MER.GOODS_NAME goodsName, " + "MER.CAT_UNIT_NAME goodsUnitName, " + ""
//				+ "SUM(ss.QUANTITY) amountPX , " --hoangnh cmt
				+ "tableA.amountPX amountPX," //hoangnh add
				+ "nvl(sum((SELECT sum(cm.QUANTITY) "
				+ "FROM CONSTRUCTION_MERCHANDISE cm " + "WHERE cm.TYPE     =2 "
				+ "AND mer.mer_entity_id = cm.mer_entity_id " + "and s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID "
				+ ")), 0) amountNT , " + "nvl(sum((SELECT  " + "SUM(quantity) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID " + "WHERE a.STATUS    =3 "
				+ " and a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");
		} else
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId ");
		sql.append(" )), 0) amountDTH, ");
		sql.append("nvl(sum((SELECT ");
		sql.append("SUM(quantity) ");
		sql.append("FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append("INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append("ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append("WHERE a.STATUS    in (1,2) ");
		sql.append("AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");
		} else {
			sql.append("and a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId ");
		}
		sql.append(")), 0) amountDYCTH, ");
		sql.append("((nvl(sum((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "WHERE a.STATUS in (1,2) AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
		if (assetManagementRequestId == null) {
			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");
		} else {
			sql.append("and a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		}
		sql.append(" )), 0))) consQuantity ");
		sql.append("FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append("ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append("AND s.CONFIRM = 1 ");
		sql.append("AND s.TYPE = 2 ");
		sql.append("AND s.STATUS = 2 " + "AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss " + "ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID "
				+ "AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY MER ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL is null "
				+ "INNER JOIN tableA tableA ON tableA.GOODS_ID= MER.GOODS_ID "
				+ "group by  s.CONSTRUCTION_ID,MER.GOODS_ID, " + "MER.GOODS_CODE, " + "MER.GOODS_NAME, "
				+ "MER.CAT_UNIT_NAME,tableA.amountPX ");

		sql.append(" ORDER BY MER.GOODS_CODE ASC ");

		StringBuilder sqlCountAmount = new StringBuilder("SELECT * FROM ( ");
		sqlCountAmount.append(sql.toString());
		sqlCountAmount.append(" ) WHERE (amountPX - amountNT - amountDTH) > 0 ");

		SQLQuery query = getSession().createSQLQuery(sqlCountAmount.toString());
		query.setParameter("id", id);
		if (assetManagementRequestId != null) {
			query.setParameter("assetManagementRequestId", assetManagementRequestId);

		}
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
//		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsId", new LongType());

		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	/*public List<AssetManageRequestEntityDetailDTO> LAYTHEOGROUPT(Long id, Long assetManagementRequestId) {
		StringBuilder sql = new StringBuilder("with tableA as(SELECT SUM(ME.AMOUNT) amountPX, ME.GOODS_ID FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID AND ME.STATUS=5 AND ME.SERIAL IS NULL "
				+ "GROUP BY s.CONSTRUCTION_ID,ME.GOODS_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME),"
				+ "tableB as(SELECT SUM(ME.AMOUNT) amountRemove, ME.GOODS_ID FROM MER_ENTITY ME WHERE ME.STATUS=5 AND ME.CONSTRUCTION_ID =:id GROUP BY ME.GOODS_ID), "
				+ "tableC as(SELECT ta.GOODS_ID,(NVL(TA.amountPX,0) + NVL(TB.amountRemove,0)) amountEnd FROM tableA ta LEFT JOIN tableB tb ON ta.GOODS_ID=tb.GOODS_ID) "
				+ "SELECT " + " MER.GOODS_CODE goodsCode, " + " MER.GOODS_ID goodsId, "
				+ " MER.GOODS_NAME goodsName, " + " MER.CAT_UNIT_NAME goodsUnitName, "
//				+ " nvl(SUM(MER.AMOUNT),0) amountPX, " -- hoangnh cmt
				+ "MIN((CASE WHEN tableC.amountEnd IS NOT NULL THEN tableC.amountEnd ELSE tableA.amountPX END)) amountPX," //hoangnh add
				+ " nvl(SUM((SELECT sum(cm.QUANTITY) "
				+ " FROM CONSTRUCTION_MERCHANDISE cm " + " WHERE cm.TYPE =2 "
				+ " AND mer.mer_entity_id = cm.mer_entity_id " + " and s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID "
				+ " )),0) amountNT, " + " nvl(SUM((SELECT " + " SUM(quantity) " + " FROM ASSET_MANAGEMENT_REQUEST a "
				+ " INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ " ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID " + " WHERE a.STATUS = 3 "
				+ " AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID " + " AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");

		sql.append(" )),0) amountDTH, ");
		sql.append(" nvl(sum((SELECT ");
		sql.append(" SUM(quantity) ");
		sql.append(" FROM ASSET_MANAGEMENT_REQUEST a ");
		sql.append(" INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ");
		sql.append(" ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID ");
		sql.append(" WHERE a.STATUS in (1,2) ");
		sql.append(" AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
		sql.append(" )),0) amountDYCTH, ");
		*//**hoangnh cmt -- start**//*
//		sql.append("( (SUM(ss.QUANTITY)) - ((nvl(sum((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a "
//				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID "
//				+ "WHERE a.STATUS in (1,2) AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID ");
//		if (assetManagementRequestId == null) {
//			sql.append(" and a.ASSET_MANAGEMENT_REQUEST_ID is null ");
//		} else {
//			sql.append("and a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
//		}
//		sql.append(" )), 0))) ) consQuantity ");
		*//**hoangnh cmt -- end**//*
		sql.append("MAX((CASE WHEN tableC.amountEnd IS NOT NULL THEN tableC.amountEnd ELSE tableA.amountPX END)) consQuantity ");
		sql.append(" FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ");
		sql.append(" ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID ");
		sql.append(" AND s.CONFIRM = 1 ");
		sql.append(" AND s.TYPE = 2 ");
		sql.append(" AND s.STATUS = 2 " + "AND s.CONSTRUCTION_ID =:id " + " INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss "
				+ "ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID "
				+ " AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ " INNER JOIN MER_ENTITY MER ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL is null  "
				+ "INNER JOIN tableA ON tableA.GOODS_ID=MER.GOODS_ID "
				+ "LEFT JOIN tableC ON tableC.GOODS_ID=MER.GOODS_ID "//hoangnh add
				+ " group by s.CONSTRUCTION_ID,MER.GOODS_ID, " + "MER.GOODS_CODE, " + "MER.GOODS_NAME, "
				+ " MER.CAT_UNIT_NAME ");
		sql.append(" ORDER BY MER.GOODS_CODE ASC ");

		StringBuilder sqlCountAmount = new StringBuilder("SELECT * FROM ( ");
		sqlCountAmount.append(sql.toString());
		sqlCountAmount.append(" ) WHERE (amountPX - amountNT - amountDTH) > 0 ");

		SQLQuery query = getSession().createSQLQuery(sqlCountAmount.toString());
		query.setParameter("id", id);
		if (assetManagementRequestId != null) {
			query.setParameter("assetManagementRequestId", assetManagementRequestId);
		}

		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}*/
	/**Hoangnh add**/
	public List<AssetManageRequestEntityDetailDTO> LAYTHEOGROUPT(Long id, Long assetManagementRequestId) {
		StringBuilder sql = new StringBuilder("WITH tableA AS (SELECT SUM(ME.AMOUNT) amountPX, ME.GOODS_ID FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID "
				+ "AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID "
				+ "AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID "
				+ "AND ME.STATUS =5 AND ME.SERIAL IS NULL AND ME.CONSTRUCTION_ID IS NULL "
				+ "GROUP BY s.CONSTRUCTION_ID,ME.GOODS_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME "
				+ "UNION ALL "
				+ "SELECT SUM(ME.AMOUNT) amountRemove,ME.GOODS_ID FROM MER_ENTITY ME "
				+ "WHERE ME.STATUS =5 AND ME.CONSTRUCTION_ID =:id GROUP BY ME.GOODS_ID), "
				+ "tableB as (SELECT SUM(a.AMOUNTPX) amountPX, a.GOODS_ID FROM tableA a GROUP BY GOODS_ID) "
				+ "SELECT MER.GOODS_CODE goodsCode,"
				+ "MER.GOODS_ID goodsId,"
				+ "MER.GOODS_NAME goodsName,"
				+ "MER.CAT_UNIT_NAME goodsUnitName,"
				+ "MIN(tableB.amountPX) amountPX,"
				+ "NVL(SUM((SELECT SUM(cm.QUANTITY) FROM CONSTRUCTION_MERCHANDISE cm "
				+ "WHERE cm.TYPE =2 AND mer.mer_entity_id = cm.mer_entity_id AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID)),0) amountNT,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID  WHERE a.STATUS = 3 "
				+ "AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID)),0) amountDTH,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID= ae.ASSET_MANAGEMENT_REQUEST_ID WHERE a.STATUS IN (1,2) "
				+ "AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID)),0) amountDYCTH,"
				+ "MIN(tableB.amountPX) consQuantity "
				+ "FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID "
				+ "AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY MER ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL IS NULL "
				+ "INNER JOIN tableB ON tableB.GOODS_ID=MER.GOODS_ID "
				+ "GROUP BY s.CONSTRUCTION_ID,MER.GOODS_ID,MER.GOODS_CODE,MER.GOODS_NAME,MER.CAT_UNIT_NAME ");
		
		StringBuilder sqlCountAmount = new StringBuilder("SELECT * FROM ( ");
		sqlCountAmount.append(sql.toString());
		sqlCountAmount.append(" ) WHERE (amountPX - amountNT - amountDTH) > 0 ");

		SQLQuery query = getSession().createSQLQuery(sqlCountAmount.toString());
		query.setParameter("id", id);
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	} //end hoangnh add

	public List<AssetManageRequestEntityDetailDTO> getAmrdDSTBDTOListByParentT(Long id, Long assetManagementRequestId) {
		StringBuilder sql = new StringBuilder("SELECT   " + "s.CONSTRUCTION_ID constructionId, "
				+ " MER.GOODS_CODE goodsCode, " + " MER.GOODS_ID goodsId, " + " MER.GOODS_NAME goodsName, "
				+ " MER.CAT_UNIT_NAME goodsUnitName, " + " MER.SERIAL, " + " MER.mer_entity_id merentityId, "
				+ " MER.APPLY_PRICE applyPrice, " + " goo.GOODS_TYPE goodsType, " + " goo.UNIT_TYPE unitType, "
				+ " appp.NAME goodsTypeName, " + " SUM(ss.QUANTITY) " + " amountPX , " + " nvl(SUM( "
				+ " (SELECT SUM(cm.QUANTITY) " + "FROM CONSTRUCTION_MERCHANDISE cm " + "WHERE cm.TYPE =2 "
				+ "AND mer.mer_entity_id = cm.mer_entity_id " + "AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID "
				+ ")), 0) amountNT , " + " nvl(SUM( " + "(SELECT SUM(quantity) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ " ON a.ASSET_MANAGEMENT_REQUEST_ID = ae.ASSET_MANAGEMENT_REQUEST_ID AND a.STATUS in (1,2,3) "
				+ "WHERE a.CONSTRUCTION_ID =s.CONSTRUCTION_ID " + "AND ae.MER_ENTITY_ID =mer.MER_ENTITY_ID "
				+ ")), 0) amountDTH, " + "(SELECT count(*) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "AND a.STATUS != 4 " + "WHERE a.CONSTRUCTION_ID =s.CONSTRUCTION_ID "
				+ " AND ae.MER_ENTITY_ID =mer.MER_ENTITY_ID " + ") consQuantity " + " FROM stock_trans s "
				+ " INNER JOIN STOCK_TRANS_DETAIL sd " + "ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID "
				+ " AND s.CONFIRM = 1 " + "AND s.TYPE = 2 " + "AND s.STATUS = 2 " + "AND s.CONSTRUCTION_ID =:id "
				+ " INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss " + "ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID "
				+ " AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID " + " INNER JOIN MER_ENTITY MER "
				+ "ON (MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL IS NOT NULL) "
				+ " left join GOODS goo on goo.GOODS_ID = MER.GOODS_ID "
				+ " left join APP_PARAM appp on appp.PAR_ORDER = goo.GOODS_TYPE AND appp.PAR_TYPE = 'GOODS_TYPE' "
				+ " GROUP BY s.CONSTRUCTION_ID, " + " MER.GOODS_ID, " + " MER.GOODS_CODE, " + " MER.GOODS_NAME, "
				+ " MER.SERIAL, mer.mer_entity_id, "
				+ " MER.CAT_UNIT_NAME, goo.GOODS_TYPE, goo.UNIT_TYPE, appp.NAME, MER.APPLY_PRICE ");
		sql.append(" ORDER BY mer.GOODS_CODE ASC ");

		StringBuilder sqlCountAmount = new StringBuilder("SELECT * FROM ( ");
		sqlCountAmount.append(sql.toString());
		sqlCountAmount.append(" ) WHERE amountDTH = 0 AND consQuantity = 0 ");

		SQLQuery query = getSession().createSQLQuery(sqlCountAmount.toString());
		query.setParameter("id", id);
		query.addScalar("constructionId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("merentityId", new LongType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getAmrdDSTBDTOListByParent(Long id, Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT   " + "s.CONSTRUCTION_ID constructionId, "
				+ " MER.GOODS_CODE goodsCode, " + " MER.GOODS_ID goodsId, " + " MER.GOODS_NAME goodsName, "
				+ " MER.CAT_UNIT_NAME goodsUnitName, " + " MER.SERIAL serial, " + " MER.mer_entity_id merentityId,  "
				+ " SUM(ss.QUANTITY) " + " amountPX , " + " SUM( " + " (SELECT SUM(cm.QUANTITY) "
				+ "FROM CONSTRUCTION_MERCHANDISE cm " + "WHERE cm.TYPE         =2 "
				+ "AND mer.mer_entity_id = cm.mer_entity_id " + "AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID "
				+ ")) amountNT , " + "SUM( " + "(SELECT SUM(quantity) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ " ON a.ASSET_MANAGEMENT_REQUEST_ID   = ae.ASSET_MANAGEMENT_REQUEST_ID AND a.STATUS in (1,2,3) "
				+ "WHERE a.CONSTRUCTION_ID            =s.CONSTRUCTION_ID "
				+ "AND ae.MER_ENTITY_ID               =mer.MER_ENTITY_ID  "
				+ " AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId " + ")) amountDTH, "
				+ "(SELECT count(*) " + "FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae "
				+ "ON a.ASSET_MANAGEMENT_REQUEST_ID   = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ " AND a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId "
				+ "WHERE a.CONSTRUCTION_ID            =s.CONSTRUCTION_ID "
				+ " AND ae.MER_ENTITY_ID               =mer.MER_ENTITY_ID " + ") consQuantity " + "FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd " + "ON s.STOCK_TRANS_ID   = sd.STOCK_TRANS_ID "
				+ "AND s.CONFIRM         = 1 " + "AND s.TYPE            = 2 " + "AND s.STATUS          = 2 "
				+ "AND s.CONSTRUCTION_ID =:id " + "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss "
				+ "ON ss.STOCK_TRANS_ID         = s.STOCK_TRANS_ID "
				+ "AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID " + "INNER JOIN MER_ENTITY MER "
				+ "ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID " + "AND MER.SERIAL     IS NOT NULL "
				+ "GROUP BY s.CONSTRUCTION_ID, " + " MER.GOODS_ID, " + " MER.GOODS_CODE, " + "MER.GOODS_NAME, "
				+ "MER.SERIAL, mer.mer_entity_id,  " + " MER.CAT_UNIT_NAME ");
		sql.append(" ORDER BY mer.GOODS_CODE ASC ");
		
		StringBuilder sqlCountAmount = new StringBuilder("SELECT * FROM ( ");
		sqlCountAmount.append(sql.toString());
		sqlCountAmount.append(" ) WHERE consQuantity > 0 ");
		
		SQLQuery query = getSession().createSQLQuery(sqlCountAmount.toString());
		query.setParameter("id", id);
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.addScalar("constructionId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("merentityId", new LongType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<CatCommonDTO> getCatReason() {
		String sql = "SELECT " + " ST.REASON_ID id" + " ,ST.NAME name" + " ,ST.CODE code" + " FROM CAT_REASON ST"
				+ " WHERE ST.STATUS=1 " + " AND ST.TYPE =21 ";

		StringBuilder stringBuilder = new StringBuilder(sql);
		stringBuilder.append(" ORDER BY ST.REASON_ID");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("id", new LongType());
		query.addScalar("name", new StringType());
		query.addScalar("code", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(CatCommonDTO.class));

		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getListEntityTask(Long id) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT SUM(amre.quantity) amountGoodsCode,amre.GOODS_ID goodsId, "
				+ " amre.GOODS_IS_SERIAL goodsIsSerial,amre.GOODS_CODE goodsCode,amre.GOODS_NAME goodsName, amre.GOODS_UNIT_NAME goodsUnitName, "
				+ " sum(amre.QUANTITY*mer.APPLY_PRICE) TotalPrice, " + " goo.GOODS_TYPE goodsType, "
				+ " goo.UNIT_TYPE unitType, " + " appp.NAME goodsTypeName " + " FROM ASSET_MANAGE_REQUEST_ENTITY amre  "
				+ " inner join ASSET_MANAGEMENT_REQUEST amr on amre.ASSET_MANAGEMENT_REQUEST_ID=amr.ASSET_MANAGEMENT_REQUEST_ID "
				+ " left join MER_ENTITY mer on mer.MER_ENTITY_ID=amre.MER_ENTITY_ID "
				+ " left join GOODS goo on goo.GOODS_ID = amre.GOODS_ID "
				+ " left join APP_PARAM appp on appp.PAR_ORDER = goo.GOODS_TYPE AND appp.PAR_TYPE = 'GOODS_TYPE' "
				+ " where amre.ASSET_MANAGEMENT_REQUEST_ID =:id "
				+ " group by amre.GOODS_ID,amre.GOODS_IS_SERIAL,amre.GOODS_CODE,amre.GOODS_NAME,amre.GOODS_UNIT_NAME,goo.GOODS_TYPE,goo.UNIT_TYPE,appp.NAME ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.addScalar("amountGoodsCode", new DoubleType());
		query.addScalar("TotalPrice", new DoubleType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsIsSerial", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getListMerentityTask(Long id) {
		StringBuilder sql = new StringBuilder("SELECT mer.MER_ENTITY_ID merentityId, "
				+ "mer.IMPORT_STOCK_TRANS_ID importStockTransId "
				+ "FROM ASSET_MANAGEMENT_REQUEST amr "
				+ "INNER JOIN ORDERS ord ON ord.ASSET_MANAGEMENT_REQUEST_ID=amr.ASSET_MANAGEMENT_REQUEST_ID "
				+ "INNER JOIN MER_ENTITY mer ON mer.ORDER_ID=ord.ORDER_ID "
				+ "where amr.ASSET_MANAGEMENT_REQUEST_ID = :id");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.addScalar("merentityId", new LongType());
		query.addScalar("importStockTransId", new LongType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getListMerentitySerialTask(Long id) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"SELECT mer.MER_ENTITY_ID  merentityId ,amre.QUANTITY quantity " + " FROM MER_ENTITY mer "
						+ " INNER JOIN ASSET_MANAGE_REQUEST_ENTITY amre ON mer.MER_ENTITY_ID=amre.MER_ENTITY_ID "

						+ "where amre.ASSET_MANAGEMENT_REQUEST_ID =:id AND mer.SERIAL is not null "
						+ " group by mer.MER_ENTITY_ID,amre.QUANTITY ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.addScalar("merentityId", new LongType());
		query.addScalar("quantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));

		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getListMerentityGoodIsSeriaTask(Long id) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"SELECT mer.MER_ENTITY_ID  merentityId ,amre.QUANTITY quantity " + " FROM MER_ENTITY mer "
						+ " INNER JOIN ASSET_MANAGE_REQUEST_ENTITY amre ON mer.MER_ENTITY_ID=amre.MER_ENTITY_ID "

						+ "where amre.ASSET_MANAGEMENT_REQUEST_ID =:id AND amre.GOODS_IS_SERIAL=1 "
						+ " group by mer.MER_ENTITY_ID,amre.QUANTITY ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
//		query.addScalar("amountGoodsCode", new DoubleType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("merentityId", new LongType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));

		return query.list();
	}

	public List<Long> getListIdMerentity() {
		StringBuilder sql = new StringBuilder("");
		sql.append(" select mer.MER_ENTITY_ID merentityId from MER_ENTITY mer group by mer.MER_ENTITY_ID  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("merentityId", new LongType());
		return query.list();
	}

	public List<AssetManageRequestEntityDetailDTO> getListIdMerentityDetail() {
		StringBuilder sql = new StringBuilder("");
		sql.append(
				" select mer.MER_ENTITY_ID merentityId, mer.AMOUNT aMountMerentity from MER_ENTITY mer group by mer.MER_ENTITY_ID,mer.AMOUNT order by mer.MER_ENTITY_ID asc ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("merentityId", new LongType());
		query.addScalar("aMountMerentity", new DoubleType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}

	public Long getCatStockId(Long id) {
		StringBuilder sql = new StringBuilder("");
		sql.append("select cst.CAT_STOCK_ID catStockId " + " from CONSTRUCTION c "
				+ "LEFT JOIN CAT_STOCK cst ON c.SYS_GROUP_ID=cst.SYS_GROUP_ID and cst.TYPE=1 "
				+ "where c.CONSTRUCTION_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("catStockId", new LongType());
		query.setParameter("id", id);

		return (Long) query.uniqueResult();
	}

	public Double getMerApplyPrice(Long id) {
		StringBuilder sql = new StringBuilder("");
		sql.append("select mer.APPLY_PRICE applyPrice from MER_ENTITY mer where mer.MER_ENTITY_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("applyPrice", new DoubleType());
		query.setParameter("id", id);

		return (Double) query.uniqueResult();
	}

	public String getCodeCatStock(Long id) {
		StringBuilder sql = new StringBuilder("");
		sql.append("select cst.CODE codeCatStock  FROM  " + "CONSTRUCTION c LEFT JOIN CAT_STOCK cst "
				+ "ON c.SYS_GROUP_ID=cst.SYS_GROUP_ID and cst.TYPE=1  " + "where c.CONSTRUCTION_ID =:id  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("codeCatStock", new StringType());
		query.setParameter("id", id);

		return (String) query.uniqueResult();
	}

	public String getCodeSysGroup(Long id) {
		StringBuilder sql = new StringBuilder("");
		sql.append("select a.CODE codeSysGroup,a.NAME from SYS_GROUP a  where a.SYS_GROUP_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("codeSysGroup", new StringType());
		query.setParameter("id", id);

		return (String) query.uniqueResult();
	}

	public List<StockTransGeneralDTO> getStockTrans(Long id) {
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT merEn.GOODS_CODE goodsCode,");
		sql.append(" 		merEn.GOODS_NAME goodsName,");
		sql.append(" 		merEn.GOODS_ID goodsId,");
		sql.append("        merEn.UNIT_PRICE unitPrice,");
		sql.append(" 		merEn.MER_ENTITY_ID merEntityId,");
		sql.append(" 		synDetail.GOODS_IS_SERIAL goodsIsSerial,");
		sql.append(" 		synDetail.AMOUNT_REAL amountReal,");
		sql.append(" 		mer.QUANTITY consQuantity,");
		sql.append(" 		merEn.SERIAL serial,");
		sql.append(" 		merEn.UNIT_TYPE_NAME goodsUnitName,");
		sql.append(" 		( SELECT ass.QUANTITY From ASSET_MANAGE_REQUEST_ENTITY ass");
		sql.append(" 		INNER JOIN ASSET_MANAGEMENT_REQUEST assEn ");
		sql.append(
				" 		on assEn.ASSET_MANAGEMENT_REQUEST_ID = ass.ASSET_MANAGEMENT_REQUEST_ID AND assEn.STATUS = 4");
		sql.append(" 		Where ass.MER_ENTITY_ID = synDetailSerial.MER_ENTITY_ID) assetQuantity,");
		sql.append(" 		mer.REMAIN_COUNT remainQuantity");
		sql.append(" FROM  STOCK_TRANS syn ");
		sql.append(" LEFT JOIN  STOCK_TRANS_DETAIL  synDetail on syn.STOCK_TRANS_ID = synDetail.STOCK_TRANS_ID");
		sql.append(
				" LEFT JOIN  STOCK_TRANS_DETAIL_SERIAL synDetailSerial on synDetailSerial.STOCK_TRANS_DETAIL_ID = synDetail.STOCK_TRANS_DETAIL_ID");
		sql.append(" LEFT JOIN  CONSTRUCTION_MERCHANDISE mer on mer.MER_ENTITY_ID = synDetailSerial.MER_ENTITY_ID");
		sql.append(" LEFT JOIN  MER_ENTITY merEn on merEn.MER_ENTITY_ID = synDetailSerial.MER_ENTITY_ID");
		sql.append(" WHERE syn.CONFIRM =1");
		sql.append(" AND  syn.CONSTRUCTION_ID =:id AND syn.TYPE=2");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("merEntityId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("goodsIsSerial", new StringType());
		query.addScalar("amountReal", new DoubleType());
		query.addScalar("assetQuantity", new DoubleType());
		query.addScalar("serial", new StringType());
		query.addScalar("consQuantity", new DoubleType());
		query.addScalar("remainQuantity", new DoubleType());
		query.setResultTransformer(Transformers.aliasToBean(StockTransGeneralDTO.class));
		return query.list();
	}

	public Long getSequence() {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("Select ASSET_MANAGEMENT_REQUEST_SEQ.nextVal FROM DUAL");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		return ((BigDecimal) query.uniqueResult()).longValue();
	}

	public Long getSequenceOrders() {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("Select CTCT_WMS_OWNER.ORDER_SEQ.nextval FROM DUAL");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		return ((BigDecimal) query.uniqueResult()).longValue();
	}

	public void updateVTTBItem(AssetManagementRequestDetailDTO obj) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE ASSET_MANAGEMENT_REQUEST amr  ");
		sql.append(" SET ");

		sql.append(" amr.CODE          =:code , ");
		sql.append(" amr.CONTENT       =:content ,  ");
		sql.append(" amr.CONSTRUCTION_ID       =:constructionId , ");
		sql.append(" amr.CAT_REASON_ID       	=:catReasonId , ");
		sql.append(" amr.REQUEST_GROUP_ID       =:requestGroupId,  ");
		sql.append(" amr.RECEIVE_GROUP_ID       =:receiveGroupId,  ");
		sql.append(" amr.DESCRIPTION      		 =:description  ");
		sql.append(" WHERE amr.ASSET_MANAGEMENT_REQUEST_ID =:id  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("code", obj.getCode());
		query.setParameter("content", obj.getContent());
		query.setParameter("constructionId", obj.getConstructionId());
		query.setParameter("catReasonId", obj.getCatReasonId());
		query.setParameter("requestGroupId", obj.getRequestGroupId());
		query.setParameter("receiveGroupId", obj.getReceiveGroupId());
		query.setParameter("description", obj.getDescription());
		query.setParameter("id", obj.getAssetManagementRequestId());
		query.executeUpdate();

	}

	public void removeDSVT(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"DELETE from ASSET_MANAGE_REQUEST_ENTITY amre where amre.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId"
//				+ " AND amre.MER_ENTITY_ID =:merEntityId "
		);
		SQLQuery query = getSession().createSQLQuery(sql.toString());
//		query.setParameter("merEntityId", merEntityId);
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.executeUpdate();

	}

	public void removeVTTB(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"DELETE from ASSET_MANAGEMENT_REQUEST amre where amre.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.executeUpdate();

	}

	public void removeDSTB(Long merEntityId, Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"DELETE from ASSET_MANAGE_REQUEST_ENTITY amre where amre.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId AND amre.MER_ENTITY_ID =:merEntityId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("merEntityId", merEntityId);
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.executeUpdate();

	}

	public void removeOrder(Long assetManagementRequestId) {
		// TODO Auto-generated method stubSSS
		StringBuilder sql = new StringBuilder(
				"DELETE FROM ORDERS WHERE ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.executeUpdate();

	}

	public void removeOrderGoods(Long orderId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("DELETE " + "FROM ORDER_GOODS " + "WHERE ORDER_ID =:orderId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("orderId", orderId);
		query.executeUpdate();

	}

	public void removeMerentity(Long orderId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("DELETE " + "FROM MER_ENTITY  " + "WHERE ORDER_ID =:orderId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("orderId", orderId);
		query.executeUpdate();

	}

	public void removeOrderGoodsDetail(Long orderId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("DELETE " + "FROM ORDER_GOODS_DETAIL " + "WHERE ORDER_ID =:orderId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("orderId", orderId);

		query.executeUpdate();
	}

	public void removeDSTB(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				"DELETE from ASSET_MANAGE_REQUEST_ENTITY amre where amre.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("assetManagementRequestId", assetManagementRequestId);
		query.executeUpdate();

	}

	public void removeTHVT(AssetManagementRequestDetailDTO obj) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE ASSET_MANAGEMENT_REQUEST amr  ");
		sql.append(" SET ");

		sql.append(" amr.STATUS=4  ");

		sql.append(" WHERE amr.ASSET_MANAGEMENT_REQUEST_ID =:id  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("id", obj.getAssetManagementRequestId());
		// query.setResultTransformer(Transformers.aliasToBean(ConstructionAcceptanceCertDTO.class));
		query.executeUpdate();

	}

	public void removeOrderTHVT(AssetManagementRequestDetailDTO obj) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("update ORDERS ods  ");
		sql.append(" SET ");

		sql.append(" ods.STATUS=4 ");

		sql.append(" WHERE ods.ASSET_MANAGEMENT_REQUEST_ID =:id  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("id", obj.getAssetManagementRequestId());
		query.executeUpdate();

	}

	public List<Long> getAllListId(AssetManagementRequestDetailDTO obj) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT  distinct "

				+ "a.CONSTRUCTION_ID constructionId " + "FROM ASSET_MANAGEMENT_REQUEST amr "
				+ "inner join  CONSTRUCTION_MERCHANDISE a  " + "on a.CONSTRUCTION_ID=amr.CONSTRUCTION_ID "
				+ "WHERE a.CONSTRUCTION_ID =:constructionId " + "AND amr.ASSET_MANAGEMENT_REQUEST_ID =:id "
				+ "AND a.type                =2 ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", obj.getAssetManagementRequestId());
		query.setParameter("constructionId", obj.getConstructionId());

		query.addScalar("constructionId", new LongType());

		return query.list();
	}

	public List<String> getConstructionMerchandise(AssetManagementRequestDetailDTO obj) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder();
		sql.append(
				" select cm.SERIAL serialEntity from CONSTRUCTION_MERCHANDISE cm where cm. CONSTRUCTION_ID =:constructionId and TYPE=2 ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("constructionId", obj.getConstructionId());

		query.addScalar("serialEntity", new StringType());

		return query.list();
	}

	public void updateConstructionMerchandise(Long merEntityId, Long goodsId, Double remainQuantity) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("         update CONSTRUCTION_MERCHANDISE cm  ");
		sql.append(" SET ");

		sql.append("  cm.REMAIN_COUNT =:remainQuantity ");

		sql.append(" WHERE cm.MER_ENTITY_ID =:merEntityId and cm.GOODS_ID =:goodsId   ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("merEntityId", merEntityId);
		query.setParameter("remainQuantity", remainQuantity);
		query.setParameter("goodsId", goodsId);
		query.executeUpdate();

	}

	public List<AssetManagementRequestDetailDTO> getLstConstruction(AssetManagementRequestDetailDTO obj) {
		// TODO Auto-generated method stub
		String sql = "SELECT " + " ST.SYS_GROUP_ID requestGroupId "
				+ ",(ST.CODE ||'-' || ST.NAME) text , ST.NAME requestGroupName " + " FROM CTCT_CAT_OWNER.SYS_GROUP ST "
				+ " inner join CONSTRUCTION cons on ST.SYS_GROUP_ID=cons.SYS_GROUP_ID "
				+ " WHERE ST.STATUS=1 and cons.CONSTRUCTION_ID =:id ";

		StringBuilder stringBuilder = new StringBuilder(sql);

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.setParameter("id", obj.getConstructionId());
		query.addScalar("requestGroupId", new LongType());
		query.addScalar("text", new StringType());
		query.addScalar("requestGroupName", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManagementRequestDetailDTO.class));

		return query.list();
	}

	public void updateQuantityAssetEntity(String string) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append("         update ASSET_MANAGE_REQUEST_ENTITY amre  ");
		sql.append(" SET ");

		sql.append("  amre.QUANTITY =0 ");
		sql.append(" WHERE amre.SERIAL =:string  ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("string", string);

		query.executeUpdate();

	}

	public Long getMerEntity(Double merEntityId, Long orderId) {
		// TODO Auto-generated method stub

		StringBuilder sql = new StringBuilder("");
		sql.append(
				"    select MER_ENTITY_ID merEntityId from MER_ENTITY where MER_ENTITY_ID=:merEntityId and  ORDER_ID =:orderId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("merEntityId", new LongType());
		query.setParameter("merEntityId", merEntityId);
		query.setParameter("orderId", orderId);

		return (Long) query.uniqueResult();
	}

	public Long getMerEntityAdd(Double merEntityId) {
		// TODO Auto-generated method stub

		StringBuilder sql = new StringBuilder("");
		sql.append("    select MER_ENTITY_ID merEntityId from MER_ENTITY where MER_ENTITY_ID=:merEntityId  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("merEntityId", new LongType());
		query.setParameter("merEntityId", merEntityId);

		return (Long) query.uniqueResult();
	}

	public Long getMerEntityVTTB(Double merEntityId, Long orderId) {
		// TODO Auto-generated method stub

		StringBuilder sql = new StringBuilder("");
		sql.append(
				"    select MER_ENTITY_ID merEntityId from MER_ENTITY where PARENT_MER_ENTITY_ID=:merEntityId and  ORDER_ID =:orderId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("merEntityId", new LongType());
		query.setParameter("merEntityId", merEntityId);
		query.setParameter("orderId", orderId);

		return (Long) query.uniqueResult();
	}

	public Long getOrdersId(Long assetManagementRequestId) {
		StringBuilder sql = new StringBuilder("");
		sql.append(
				"   select ORDER_ID orderId from ORDERS where ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("orderId", new LongType());
		query.setParameter("assetManagementRequestId", assetManagementRequestId);

		List<Long> list = query.list();

		if (list != null && !list.isEmpty()) {
			return list.get(0);
		}
		return -1L;
		// return (Long)query.uniqueResult();
	}

	public void updateGoodIsSeriaVTTB(AssetManageRequestEntityDetailDTO obj, Long orderId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				" UPDATE MER_ENTITY me SET me.STATUS= '3', me.ORDER_ID = :orderId,  me.STOCK_ID = :stockId, me.UPDATED_DATE = SYSDATE "
						+ " WHERE me.MER_ENTITY_ID = :id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setLong("id", obj.getMerEntityId().longValue());
		query.setLong("orderId", orderId);
		query.setLong("stockId", obj.getStockId());
		query.executeUpdate();
	}
	/**hoangnh add**/
	public void updateStatusMerId(AssetManageRequestEntityDetailDTO obj, Long orderId, Long id) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				" UPDATE MER_ENTITY me SET me.STATUS= '3', me.ORDER_ID = :orderId,  me.STOCK_ID = :stockId, me.UPDATED_DATE = SYSDATE "
						+ " WHERE me.MER_ENTITY_ID = :id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setLong("id", id);
		query.setLong("orderId", orderId);
		query.setLong("stockId", obj.getStockId());
		query.executeUpdate();
	}

	public void updateStatusMerentity(Long merentityId, Long stockId,Long constructionId) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE MER_ENTITY me ");
		sql.append(" SET ");
		sql.append(" me.STATUS = 5, ");
		sql.append(" me.CONSTRUCTION_ID =:constructionId, ");
		sql.append(" me.STOCK_ID = :stockId ");
		sql.append(" WHERE me.MER_ENTITY_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("stockId", stockId);
		query.setParameter("id", merentityId);
		query.setParameter("constructionId", constructionId);
		query.executeUpdate();
	}
	
	public void updateStatusMer(Long merentityId, Long stockId) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE MER_ENTITY me ");
		sql.append(" SET ");
		sql.append(" me.STATUS = 5, ");
		sql.append(" me.STOCK_ID = :stockId ");
		sql.append(" WHERE me.MER_ENTITY_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("stockId", stockId);
		query.setParameter("id", merentityId);
		query.executeUpdate();
	}

	public void deleteMerentityDSVT(Long orderId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder(
				" delete from MER_ENTITY mer where mer.ORDER_ID =:orderId and mer.SERIAL is null ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("orderId", orderId);
		query.executeUpdate();

	}

	public Long getAssetRequestManagementId(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append(
				" select ORDER_ID orderId from ORDERS orders where orders.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId  ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("orderId", new LongType());
		query.setParameter("assetManagementRequestId", assetManagementRequestId);

		return (Long) query.uniqueResult();
	}

	public void updateMerentityVTTB(Long merentityId, double amount) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" UPDATE MER_ENTITY me ");
		sql.append(" SET ");
		sql.append(" me.AMOUNT =:amount, me.UPDATED_DATE = SYSDATE ");
		sql.append(" WHERE me.MER_ENTITY_ID =:merentityId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("merentityId", merentityId);
		query.setParameter("amount", amount);
		query.executeUpdate();
	}

	public List<Long> getOrderGoodsId(Long orderId, Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("");
		sql.append(
				"select ORDER_GOODS_ID orderGoodsId from ORDER_GOODS where ORDER_ID=:orderId and GOODS_ID=:goodsId ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("orderId", orderId);
		query.setParameter("goodsId", goodsId);

		query.addScalar("orderGoodsId", new LongType());
		return query.list();
	}

	public StockTransDTO getStockTransDetail(Long id) {
		StringBuilder sql = new StringBuilder("SELECT st.STOCK_TRANS_ID stockTransId," 
			+ "st.CODE code, "
			+ "st.STOCK_ID stockId "
			+ "FROM CTCT_WMS_OWNER.STOCK_TRANS st "
			+ "WHERE st.STOCK_TRANS_ID = :stockTransId");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("stockTransId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("stockId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(StockTransDTO.class));

		query.setParameter("stockTransId", id);
		return (StockTransDTO) query.uniqueResult();
	}
	
	public List<AssetManageRequestEntityDetailDTO> getDetailDSVT(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT AE.GOODS_ID goodsId,"
				+ "AE.GOODS_NAME goodsName,"
				+ "AE.GOODS_UNIT_NAME goodsUnitName,"
				+ "SUM(AE.QUANTITY) consQuantity,"
				+ "AE.GOODS_CODE goodsCode FROM ASSET_MANAGEMENT_REQUEST AM "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY AE ON AM.ASSET_MANAGEMENT_REQUEST_ID = AE.ASSET_MANAGEMENT_REQUEST_ID "
				+ "AND AE.GOODS_IS_SERIAL=0 ");
		if(assetManagementRequestId != null){
			sql.append("AND AE.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		}
		sql.append("GROUP BY AE.GOODS_ID,AE.GOODS_NAME,AE.GOODS_UNIT_NAME,AE.GOODS_CODE ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		if (assetManagementRequestId != null) {
			query.setParameter("assetManagementRequestId", assetManagementRequestId);
		}
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
	
	public List<AssetManageRequestEntityDetailDTO> getDetailDSTB(Long assetManagementRequestId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("SELECT AE.GOODS_ID goodsId,"
				+ "AE.GOODS_NAME goodsName,"
				+ "AE.GOODS_UNIT_NAME goodsUnitName,"
				+ "AE.QUANTITY consQuantity,"
				+ "AE.SERIAL serial,"
				+ "AE.GOODS_CODE goodsCode FROM ASSET_MANAGEMENT_REQUEST AM "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY AE ON AM.ASSET_MANAGEMENT_REQUEST_ID = AE.ASSET_MANAGEMENT_REQUEST_ID "
				+ "AND AE.GOODS_IS_SERIAL=1 ");
		if(assetManagementRequestId != null){
			sql.append("AND AE.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId ");
		}

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		if (assetManagementRequestId != null) {
			query.setParameter("assetManagementRequestId", assetManagementRequestId);
		}
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
	
	public List<AssetManageRequestEntityDetailDTO> getMerEntityIdOrigin(Long id){
		StringBuilder sql = new StringBuilder("SELECT AE.MER_ENTITY_ID merEntityId2,"
				+ "AE.PARENT_MER_ENTITY_ID parentMerEntityId2 FROM ASSET_MANAGE_REQUEST_ENTITY AE WHERE 1=1 ");
		if(id != null){
			sql.append("AND AE.ASSET_MANAGEMENT_REQUEST_ID =:id ");
		}
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		if(id != null){
			query.setParameter("id", id);
		}
		query.addScalar("merEntityId2", new LongType());
		query.addScalar("parentMerEntityId2", new LongType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
	
	public AssetManageRequestEntityDetailDTO getParentMerId(Long goodsId,Long constructionId) {
		StringBuilder sql = new StringBuilder("SELECT MER.GOODS_CODE goodsCode, "
			+ " MER.APPLY_PRICE applyPrice, " 
			+ " stds.PRICE price, "
			+ " MER.AMOUNT quantity, " 
			+ " MER.AMOUNT amount, "
			+ " goo.GOODS_TYPE goodsType, " 
			+ " goo.UNIT_TYPE unitType, "
			+ " appp.NAME goodsTypeName, "
			+ " MER.mer_entity_id merEntityId , " 
			+ " MER.GOODS_ID goodsId, "
			+ " MER.GOODS_NAME goodsName, " 
			+ " MER.CAT_UNIT_NAME goodsUnitName " 
			+ " FROM MER_ENTITY MER, APP_PARAM appp, "
			+ " GOODS goo,stock_trans st,STOCK_TRANS_DETAIL std,STOCK_TRANS_DETAIL_SERIAL stds "
			+ " where MER.GOODS_ID=goo.GOODS_ID "
			+ " and goo.GOODS_TYPE=appp.PAR_ORDER (+) AND appp.PAR_TYPE = 'GOODS_TYPE' " 
			+ " and (MER.mer_entity_id=stds.mer_entity_id OR  stds.mer_entity_id = MER.PARENT_MER_ENTITY_ID) "
			+ " and stds.STOCK_TRANS_ID = st.STOCK_TRANS_ID AND stds.STOCK_TRANS_DETAIL_ID = std.STOCK_TRANS_DETAIL_ID " 
			+ " and st.STOCK_TRANS_ID = std.STOCK_TRANS_ID "
			+ " and  goo.GOODS_ID = :goodsId "
			+ " and st.construction_id = :constructionId "
			+ " AND st.CONFIRM = 1 AND st.TYPE = 2 AND st.STATUS= 2"
			+ " AND MER.PARENT_MER_ENTITY_ID IS NULL ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("goodsId", goodsId);
		query.setParameter("constructionId", constructionId);
		query.addScalar("goodsCode", new StringType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("goodsUnitName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return (AssetManageRequestEntityDetailDTO) query.uniqueResult();
	}
	
	public List<AssetManageRequestEntityDetailDTO> getAmrdTHVTTBDTO(Long id, Long assetManagementRequestId,
			Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("with tableA as(SELECT ME.AMOUNT amountPX, ME.GOODS_ID, ME.MER_ENTITY_ID FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID AND ME.STATUS=5 AND ME.SERIAL IS NULL) "
				+ "SELECT MER.GOODS_CODE goodsCode,"
				+ "MER.APPLY_PRICE applyPrice,"
				+ "ss.PRICE price,"
				+ "ss.QUANTITY quantity,"
				+ "goo.GOODS_TYPE goodsType,"
				+ "goo.UNIT_TYPE unitType,"
				+ "appp.NAME goodsTypeName,"
				+ "MER.mer_entity_id merEntityId,"
				+ "MER.GOODS_ID goodsId,"
				+ "MER.GOODS_NAME goodsName,"
				+ "MER.CAT_UNIT_NAME goodsUnitName,"
				+ "tableA.amountPX amountPX,"
				+ "NVL(SUM((SELECT SUM(cm.QUANTITY) FROM CONSTRUCTION_MERCHANDISE cm "
				+ "WHERE cm.TYPE =2 AND mer.mer_entity_id = cm.mer_entity_id AND s.CONSTRUCTION_ID = cm.CONSTRUCTION_ID)), 0) amountNT ,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "WHERE a.STATUS=3 AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID "
				+ "AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId)), 0) amountDTH, "
				+ "NVL(sum((SELECT sum(ae.quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID   = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "WHERE a.STATUS IN (1,2) AND a.CONSTRUCTION_ID=s.CONSTRUCTION_ID and ae.GOODS_ID=mer.GOODS_ID "
				+ "AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId)),0) amountDYCTH,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID  = ae.ASSET_MANAGEMENT_REQUEST_ID AND a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId "
				+ "WHERE a.CONSTRUCTION_ID =s.CONSTRUCTION_ID AND ae.MER_ENTITY_ID=mer.MER_ENTITY_ID)), 0) consQuantity "
				+ "FROM stock_trans s INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM = 1 AND s.TYPE = 2 "
				+ "AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "LEFT JOIN GOODS goo ON goo.GOODS_ID = :goodsId "
				+ "LEFT JOIN APP_PARAM appp ON appp.PAR_ORDER = goo.GOODS_TYPE AND appp.PAR_TYPE = 'GOODS_TYPE' "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY MER ON MER.MER_ENTITY_ID=SS.MER_ENTITY_ID AND MER.SERIAL IS NULL "
				+ "INNER JOIN tableA ON tableA.GOODS_ID=MER.GOODS_ID  AND tableA.MER_ENTITY_ID =MER.MER_ENTITY_ID "
				+ "WHERE MER.GOODS_ID  = :goodsId AND MER.STATUS = 5 "
				+ "GROUP BY s.CONSTRUCTION_ID,MER.GOODS_ID,MER.mer_entity_id,goo.GOODS_TYPE,goo.UNIT_TYPE,appp.NAME,"
				+ "MER.APPLY_PRICE,ss.PRICE,ss.QUANTITY,MER.GOODS_CODE,MER.GOODS_NAME,"
				+ "MER.CAT_UNIT_NAME,tableA.amountPX,s.REAL_IE_TRANS_DATE "
				+ "ORDER BY s.REAL_IE_TRANS_DATE DESC,MER.mer_entity_id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.setParameter("goodsId", goodsId);
		query.setParameter("assetManagementRequestId", assetManagementRequestId);

		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
	
	/**hoangnh add**/
	public MerEntitySimpleDTO getLevelParentId (Long merEntityId){
		StringBuilder sql = new StringBuilder("SELECT ME.LEVEL_PARENT_ID levelParentId FROM MER_ENTITY ME WHERE 1=1 ");
		sql.append("AND ME.MER_ENTITY_ID =:merEntityId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("merEntityId", merEntityId);
		query.addScalar("levelParentId", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(MerEntitySimpleDTO.class));
		return (MerEntitySimpleDTO) query.uniqueResult();
	}
	/**Hoangnh add**/
	public List<AssetManageRequestEntityDetailDTO> getDetailTHVTTBDTO(Long id, Long assetManagementRequestId,Long goodsId) {
		// TODO Auto-generated method stub
		StringBuilder sql = new StringBuilder("WITH tableA as(SELECT ME.AMOUNT amountPX, ME.GOODS_ID, ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID AND ME.STATUS=5 AND ME.SERIAL IS NULL AND ME.GOODS_ID =:goodsId "
				+ "UNION "
				+ "SELECT SUM(ME.AMOUNT) amountRemove,ME.GOODS_ID,ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE FROM MER_ENTITY ME "
				+ "WHERE ME.STATUS =5 AND ME.CONSTRUCTION_ID =:id AND ME.GOODS_ID =:goodsId GROUP BY ME.GOODS_ID,ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE) "
				+ "SELECT a.GOODS_ID goodsId,"
				+ "a.GOODS_CODE goodsCode,"
				+ "a.GOODS_NAME goodsName,"
				+ "a.MER_ENTITY_ID merEntityId,"
				+ "a.CAT_UNIT_NAME goodsUnitName,"
				+ "a.amountPX amountPX,"
				+ "a.APPLY_PRICE applyPrice,"
				+ "GO.GOODS_TYPE goodsType,"
				+ "GO.UNIT_TYPE unitType,"
				+ "AP.NAME goodsTypeName,"
				+ "NVL(SUM((SELECT SUM(cm.QUANTITY) FROM CONSTRUCTION_MERCHANDISE cm WHERE cm.TYPE =2 AND a.MER_ENTITY_ID = cm.MER_ENTITY_ID AND cm.CONSTRUCTION_ID =:id )), 0) amountNT,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "WHERE a.STATUS=3 AND a.CONSTRUCTION_ID=:id AND ae.MER_ENTITY_ID=a.MER_ENTITY_ID AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId)), 0) amountDTH,"
				+ "NVL(sum((SELECT sum(ae.quantity) FROM ASSET_MANAGEMENT_REQUEST a INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID = ae.ASSET_MANAGEMENT_REQUEST_ID "
				+ "WHERE a.STATUS IN (1,2) AND a.CONSTRUCTION_ID =:id  and ae.GOODS_ID=a.GOODS_ID AND a.ASSET_MANAGEMENT_REQUEST_ID !=:assetManagementRequestId)),0) amountDYCTH,"
				+ "NVL(SUM((SELECT SUM(quantity) FROM ASSET_MANAGEMENT_REQUEST a "
				+ "INNER JOIN ASSET_MANAGE_REQUEST_ENTITY ae ON a.ASSET_MANAGEMENT_REQUEST_ID  = ae.ASSET_MANAGEMENT_REQUEST_ID AND a.ASSET_MANAGEMENT_REQUEST_ID =:assetManagementRequestId "
				+ "WHERE a.CONSTRUCTION_ID =:id AND ae.MER_ENTITY_ID=a.MER_ENTITY_ID)), 0) consQuantity "
				+ "FROM tableA a LEFT JOIN GOODS GO ON GO.GOODS_ID=a.GOODS_ID "
				+ "LEFT JOIN APP_PARAM AP ON AP.PAR_ORDER = GO.GOODS_TYPE AND AP.PAR_TYPE = 'GOODS_TYPE' "
				+ "GROUP BY a.GOODS_ID,a.GOODS_CODE,a.GOODS_NAME,a.MER_ENTITY_ID,a.CAT_UNIT_NAME,"
				+ "a.amountPX,a.APPLY_PRICE,GO.GOODS_TYPE,GO.UNIT_TYPE,AP.NAME ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", id);
		query.setParameter("goodsId", goodsId);
		query.setParameter("assetManagementRequestId", assetManagementRequestId);

		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("amountPX", new DoubleType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		query.addScalar("amountNT", new DoubleType());
		query.addScalar("amountDTH", new DoubleType());
		query.addScalar("amountDYCTH", new DoubleType());
		query.addScalar("consQuantity", new DoubleType());

		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
	/**Hoangnh add**/
	public List<AssetManageRequestEntityDetailDTO> getDetailDTOListByParent2(Long goodsId,Long id) {
		StringBuilder sql = new StringBuilder("WITH tableA as(SELECT ME.AMOUNT amountPX, ME.GOODS_ID, ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE FROM stock_trans s "
				+ "INNER JOIN STOCK_TRANS_DETAIL sd ON s.STOCK_TRANS_ID = sd.STOCK_TRANS_ID AND s.CONFIRM = 1 AND s.TYPE = 2 AND s.STATUS = 2 AND s.CONSTRUCTION_ID =:id "
				+ "INNER JOIN STOCK_TRANS_DETAIL_SERIAL ss ON ss.STOCK_TRANS_ID = s.STOCK_TRANS_ID AND ss.STOCK_TRANS_DETAIL_ID = sd.STOCK_TRANS_DETAIL_ID "
				+ "INNER JOIN MER_ENTITY ME ON ME.MER_ENTITY_ID=SS.MER_ENTITY_ID AND ME.STATUS=5 AND ME.SERIAL IS NULL AND ME.GOODS_ID =:goodsId "
				+ "UNION "
				+ "SELECT SUM(ME.AMOUNT) amountRemove,ME.GOODS_ID,ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE FROM MER_ENTITY ME "
				+ "WHERE ME.STATUS =5 AND ME.CONSTRUCTION_ID =:id AND ME.GOODS_ID =:goodsId GROUP BY ME.GOODS_ID,ME.MER_ENTITY_ID,ME.GOODS_CODE,ME.GOODS_NAME,ME.CAT_UNIT_NAME,ME.APPLY_PRICE) "
				+ "SELECT a.GOODS_ID goodsId,"
				+ "a.GOODS_CODE goodsCode,"
				+ "a.GOODS_NAME goodsName,"
				+ "a.MER_ENTITY_ID merEntityId,"
				+ "a.CAT_UNIT_NAME goodsUnitName,"
				+ "a.amountPX amount,"
				+ "a.amountPX quantity,"
				+ "a.APPLY_PRICE applyPrice,"
				+ "a.APPLY_PRICE price,"
				+ "GO.GOODS_TYPE goodsType,"
				+ "GO.UNIT_TYPE unitType,"
				+ "AP.NAME goodsTypeName "
				+ "FROM tableA a LEFT JOIN GOODS GO ON GO.GOODS_ID=a.GOODS_ID "
				+ "LEFT JOIN APP_PARAM AP ON AP.PAR_ORDER = GO.GOODS_TYPE AND AP.PAR_TYPE = 'GOODS_TYPE' ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.setParameter("goodsId", goodsId);
		query.setParameter("id", id);
		
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("merEntityId", new DoubleType());
		query.addScalar("goodsUnitName", new StringType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("goodsType", new StringType());
		query.addScalar("unitType", new LongType());
		query.addScalar("goodsTypeName", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(AssetManageRequestEntityDetailDTO.class));
		return query.list();
	}
}
