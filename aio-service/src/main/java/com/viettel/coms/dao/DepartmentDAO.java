/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.coms.bo.DepartmentBO;
import com.viettel.coms.dto.CatStationDTO;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("departmentDAO")
public class DepartmentDAO extends BaseFWDAOImpl<DepartmentBO, Long> {

    public DepartmentDAO() {
        this.model = new DepartmentBO();
    }

    public DepartmentDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<DepartmentDTO> getall(DepartmentDTO obj) {
//        StringBuilder sql = new StringBuilder();
//        sql.append("SELECT DP.SYS_GROUP_ID id,"
//                + "DP.CODE code,(DP.CODE ||'-' || DP.NAME) text, DP.PARENT_ID parentId, DP.STATUS status, DP.PATH path,"
//                + "DP.EFFECT_DATE effectDate, DP.END_DATE endDate, DP1.NAME parentName"
//                + " FROM CTCT_CAT_OWNER.SYS_GROUP DP " + "LEFT Join CTCT_CAT_OWNER.SYS_GROUP DP1 "
//                + "On DP1.SYS_GROUP_ID=DP.PARENT_ID " + "WHERE DP.STATUS=1");
//        if (StringUtils.isNotEmpty(obj.getCode())) {
//            sql.append(" AND upper(DP.CODE) like upper(:code)");
//        }
//
//        if (StringUtils.isNotEmpty(obj.getName())) {
//            sql.append(" AND upper(DP.NAME) like upper(:name)");
//        }
//
//        if (obj.getId() != null) {
//            sql.append(" AND (DP.PARENT_ID = :id OR DP.SYS_GROUP_ID=:id )");
//        }
//
//        SQLQuery query = getSession().createSQLQuery(sql.toString());
//        query.addScalar("id", new LongType());
//        query.addScalar("code", new StringType());
//        query.addScalar("text", new StringType());
//        query.addScalar("parentId", new LongType());
//        query.addScalar("status", new StringType());
//        query.addScalar("path", new StringType());
//        query.addScalar("parentName", new StringType());
//        query.addScalar("effectDate", new DateType());
//        query.addScalar("endDate", new DateType());
//
//        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
//        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//        sqlCount.append(sql.toString());
//        sqlCount.append(")");
//
//        if (obj.getPage() != null && obj.getPageSize() != null) {
//            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
//            query.setMaxResults(obj.getPageSize().intValue());
//        }
//
//        if (StringUtils.isNotEmpty(obj.getCode())) {
//            query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
//        }
//
//        if (StringUtils.isNotEmpty(obj.getName())) {
//            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
//        }
//
//        if (obj.getId() != null) {
//            query.setParameter("id", obj.getId());
//        }
//        return query.list();
    	StringBuilder sql = new StringBuilder();
		sql.append(
				"SELECT DP.SYS_GROUP_ID id, DP.GROUP_NAME_LEVEL1 groupNameLevel1, DP.GROUP_NAME_LEVEL2 groupNameLevel2, DP.GROUP_NAME_LEVEL3 groupNameLevel3, "
						+ "DP.CODE code,(DP.CODE ||'-' || DP.NAME) text, DP.NAME name, DP.SYS_GROUP_ID sysGroupId, DP.GROUP_LEVEL groupLevel,"
						+ "DP.PARENT_ID parentId, DP.STATUS status, DP.PATH path,"
						+ "DP.EFFECT_DATE effectDate, DP.END_DATE endDate, DP1.NAME parentName"
						+ " FROM CTCT_CAT_OWNER.SYS_GROUP DP " 
						+ "LEFT Join CTCT_CAT_OWNER.SYS_GROUP DP1 "
						+ "On DP1.SYS_GROUP_ID=DP.PARENT_ID " 
						+ "WHERE DP.STATUS=1 and upper(DP.GROUP_NAME_LEVEL1) like upper('%Công ty CP Công trình Viettel%') ");
		if (StringUtils.isNotEmpty(obj.getCode())) {
			sql.append(" AND upper(DP.CODE) like upper(:code)");
		}

		if (StringUtils.isNotEmpty(obj.getName())) {
			sql.append(" AND upper(DP.NAME) like upper(:name)");
		}

		if (obj.getId() != null) {
			sql.append(" AND (DP.PARENT_ID = :id OR DP.SYS_GROUP_ID=:id )");
		}

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("id", new LongType());
		query.addScalar("groupNameLevel1", new StringType());
		query.addScalar("groupNameLevel2", new StringType());
		query.addScalar("groupNameLevel3", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("text", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("groupLevel", new StringType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("path", new StringType());
		query.addScalar("parentName", new StringType());
		query.addScalar("effectDate", new DateType());
		query.addScalar("endDate", new DateType());

		query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}

		if (StringUtils.isNotEmpty(obj.getCode())) {
			query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
		}

		if (StringUtils.isNotEmpty(obj.getName())) {
			query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
		}

		if (obj.getId() != null) {
			query.setParameter("id", obj.getId());
		}
		return query.list();
    }

    // AutocompleteDept
    @SuppressWarnings("unchecked")
    public List<DepartmentDTO> getForAutoCompleteDept(DepartmentDTO obj) {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code" + " FROM CTCT_CAT_OWNER.SYS_GROUP ST" + " WHERE ST.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(ST.NAME) LIKE upper(:name) escape '&' OR upper(ST.CODE) LIKE upper(:name) escape '&')");
        }
        //--------TrungPT add 5/12/2019
        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            stringBuilder.append(
                    " AND (upper(ST.AREA_CODE) = upper(:areaCode) )");
        }
        //--------TrungPT end
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("value", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getAreaCode())) {
            query.setParameter("areaCode",   ValidateUtils.validateKeySearch(obj.getAreaCode()));
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<DepartmentDTO> getForAutoCompleteDeptCheck(DepartmentDTO obj, List<String> groupIdLst) {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code" + " FROM CTCT_CAT_OWNER.SYS_GROUP ST" + " WHERE ST.STATUS=1";

        StringBuilder stringBuilder = new StringBuilder(sql);
        if(!groupIdLst.isEmpty()) {
        	stringBuilder.append(" AND ST.SYS_GROUP_ID IN (:groupIdLst)");
        }
        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(ST.NAME) LIKE upper(:name) escape '&' OR upper(ST.CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("value", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }
        if(!groupIdLst.isEmpty()) {
        	query.setParameterList("groupIdLst",groupIdLst);
        }
        return query.list();
    }
    
    @SuppressWarnings("unchecked")
    public List<CatPartnerDTO> getAutocompleteLanHan(CatPartnerDTO obj) {
        String sql = "SELECT " + " cp.CAT_PARTNER_ID id" + ",(cp.CODE ||'-' || cp.NAME) text" + " ,cp.NAME name"
                + " ,cp.CODE code" + " FROM CTCT_CAT_OWNER.CAT_PARTNER cp" + " WHERE cp.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(cp.NAME) LIKE upper(:name) escape '&' OR upper(cp.CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY cp.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("text", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
//			query.setParameter("code",
//					"%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }
//		}
//		if (StringUtils.isNotEmpty(obj.getCode())) {

        return query.list();
    }

    // End-AutocompleteDept

    public DepartmentDTO getOne(Long id) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT DP.SYS_GROUP_ID id,"
                + "DP.CODE code,(DP.CODE ||'-' || DP.NAME) text, DP.PARENT_ID parentId, DP.STATUS status, DP.PATH path,"
                + "DP.EFFECT_DATE effectDate, DP.END_DATE endDate, DP1.NAME parentName"
                + " FROM CTCT_CAT_OWNER.SYS_GROUP DP " + " LEFT Join CTCT_CAT_OWNER.SYS_GROUP DP1 "
                + " On DP1.SYS_GROUP_ID=DP.PARENT_ID " + " WHERE DP.STATUS=1 AND DP.SYS_GROUP_ID=:id ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("path", new StringType());
        query.addScalar("parentName", new StringType());
        query.addScalar("effectDate", new DateType());
        query.addScalar("endDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));

        query.setParameter("id", id);

        return (DepartmentDTO) query.uniqueResult();
    }

    public List<DepartmentDTO> getAll() {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code," + "ST.GROUP_NAME_LEVEL1 groupNameLevel1," + "ST.GROUP_NAME_LEVEL2 groupNameLevel2,"
                + "ST.GROUP_NAME_LEVEL3 groupNameLevel3 "
                // chinhpxn20180619
                + " FROM SYS_GROUP ST"
                + " WHERE ST.STATUS=1 AND ST.GROUP_LEVEL IN (1,2) OR UPPER(ST.NAME) LIKE UPPER('PHÒNG QUYẾT TOÁN')";
        // chinhpxn20180619
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("groupNameLevel1", new StringType());
        query.addScalar("groupNameLevel2", new StringType());
        query.addScalar("groupNameLevel3", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        return query.list();
    }

    public DepartmentDTO getSysGroupData(String code) {
        DepartmentDTO newObj = new DepartmentDTO();
        // TODO Auto-generated method stub
        // chinhpxn20180619
        StringBuilder sql = new StringBuilder(
                "SELECT name name, sys_GROUP_ID id from SYS_GROUP where UPPER(CODE) = :code");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("id", new LongType());
        query.setParameter("code", code.toUpperCase());
        // chinhpxn20180619
        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        List<DepartmentDTO> re = query.list();
        if (!re.isEmpty()) {
            newObj.setId(re.get(0).getId());
            newObj.setName(re.get(0).getName());
        }
        return newObj;

    }

    public List<DepartmentDTO> getCatPartnerForAutocompleteDept(DepartmentDTO obj) {
        String sql = "SELECT " + " ST.CAT_PARTNER_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code" + " ,ST.address address" + " ,ST.partner_Type partnerType" + " ,ST.STATUS status"
                + " FROM CAT_PARTNER ST" + " WHERE ST.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);
//			
        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(ST.NAME) LIKE upper(:name) escape '&' OR upper(ST.CODE) LIKE upper(:name) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            stringBuilder.append(" AND  upper(ST.CODE) LIKE upper(:code) escape '&'");
        }

        stringBuilder.append(" ORDER BY ST.CODE");
        StringBuilder sqlCount = new StringBuilder("select count (*) from(");
        sqlCount.append(stringBuilder);
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("status", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
            queryCount.setParameter("name", "%" + obj.getName() + "%");
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", "%" + obj.getCode() + "%");
            queryCount.setParameter("code", "%" + obj.getCode() + "%");
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<DepartmentDTO> doSearchCatPartner(DepartmentDTO obj) {
        String sql = "SELECT " + " ST.CAT_PARTNER_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code" + " ,ST.address address" + " ,ST.partner_Type partnerType" + " ,ST.STATUS status"
                + " FROM CAT_PARTNER ST" + " WHERE ST.STATUS=1 ";

        StringBuilder stringBuilder = new StringBuilder(sql);
//			
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(ST.NAME) LIKE upper(:name) escape '&' OR upper(ST.CODE) LIKE upper(:name) escape '&')");
        }
        if (StringUtils.isNotEmpty(obj.getCode())) {
            stringBuilder.append(" AND  upper(ST.CODE) LIKE upper(:code) escape '&'");
        }

        stringBuilder.append(" ORDER BY ST.CODE");
        StringBuilder sqlCount = new StringBuilder("select count (*) from(");
        sqlCount.append(stringBuilder);
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("status", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
            queryCount.setParameter("name", "%" + obj.getName() + "%");
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", "%" + obj.getCode() + "%");
            queryCount.setParameter("code", "%" + obj.getCode() + "%");
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<DepartmentDTO> getAllLevel12() {
        String sql = "SELECT " + " ST.SYS_GROUP_ID id" + ",(ST.CODE ||'-' || ST.NAME) text" + " ,ST.NAME name"
                + " ,ST.CODE code," + "ST.GROUP_NAME_LEVEL1 groupNameLevel1," + "ST.GROUP_NAME_LEVEL2 groupNameLevel2,"
                + "ST.GROUP_NAME_LEVEL3 groupNameLevel3 " + " FROM SYS_GROUP ST"
                + " WHERE ST.STATUS=1 and (ST.GROUP_LEVEL =1 or ST.GROUP_LEVEL =2)";

        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY ST.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("groupNameLevel1", new StringType());
        query.addScalar("groupNameLevel2", new StringType());
        query.addScalar("groupNameLevel3", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        return query.list();
    }

    public List<CatStationDTO> getCatStation() {
        String sql = "SELECT CS.CAT_STATION_ID id," + "CS.CODE code" + " FROM CAT_STATION CS" + " WHERE 1=1";
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY CS.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatStationDTO.class));
        return query.list();
    }

    public List<ConstructionDTO> getConstructiontation() {
        String sql = "SELECT CT.CONSTRUCTION_ID constructionId, " + "CT.CODE code, " + "CT.NAME name "
                + " FROM CONSTRUCTION CT " + " WHERE 1=1 ";
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY CT.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(ConstructionDTO.class));
        return query.list();
    }

    public List<CatPartnerDTO> getCatpartner() {
        String sql = "SELECT CP.CAT_PARTNER_ID catPartnerId, " + "CP.CODE code, " + "CP.NAME name "
                + " FROM CAT_PARTNER CP " + " WHERE 1=1 ";
        StringBuilder stringBuilder = new StringBuilder(sql);
        stringBuilder.append(" ORDER BY CP.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));
        return query.list();
    }
    
    //HuyPQ-start
    @SuppressWarnings("unchecked")
    public List<DepartmentDTO> getSysGroupCheck(DepartmentDTO obj, List<String> groupIdLst) {
    	StringBuilder sql = new StringBuilder();
		sql.append(
				"SELECT DP.SYS_GROUP_ID id, DP.GROUP_NAME_LEVEL1 groupNameLevel1, DP.GROUP_NAME_LEVEL2 groupNameLevel2, DP.GROUP_NAME_LEVEL3 groupNameLevel3, "
						+ "DP.CODE code,(DP.CODE ||'-' || DP.NAME) text, DP.NAME name, DP.SYS_GROUP_ID sysGroupId, DP.GROUP_LEVEL groupLevel,"
						+ "DP.PARENT_ID parentId, DP.STATUS status, DP.PATH path,"
						+ "DP.EFFECT_DATE effectDate, DP.END_DATE endDate, DP1.NAME parentName"
						+ " FROM CTCT_CAT_OWNER.SYS_GROUP DP " 
						+ "LEFT Join CTCT_CAT_OWNER.SYS_GROUP DP1 "
						+ "On DP1.SYS_GROUP_ID=DP.PARENT_ID " 
						+ "WHERE DP.STATUS=1 and upper(DP.GROUP_NAME_LEVEL1) like upper('%Công ty CP Công trình Viettel%') ");
		if (groupIdLst != null && !groupIdLst.isEmpty()) {
			sql.append(" AND DP.SYS_GROUP_ID in (:groupIdLst)");
		}
		if (StringUtils.isNotEmpty(obj.getCode())) {
			sql.append(" AND upper(DP.CODE) like upper(:code)");
		}

		if (StringUtils.isNotEmpty(obj.getName())) {
			sql.append(" AND upper(DP.NAME) like upper(:name)");
		}

		if (obj.getId() != null) {
			sql.append(" AND (DP.PARENT_ID = :id OR DP.SYS_GROUP_ID=:id )");
		}

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("id", new LongType());
		query.addScalar("groupNameLevel1", new StringType());
		query.addScalar("groupNameLevel2", new StringType());
		query.addScalar("groupNameLevel3", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("text", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("groupLevel", new StringType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("path", new StringType());
		query.addScalar("parentName", new StringType());
		query.addScalar("effectDate", new DateType());
		query.addScalar("endDate", new DateType());

		query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");

		if (obj.getPage() != null && obj.getPageSize() != null) {
			query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
			query.setMaxResults(obj.getPageSize().intValue());
		}
		if (groupIdLst!=null && !groupIdLst.isEmpty()) {
			query.setParameterList("groupIdLst", groupIdLst);
		}
		
		if (StringUtils.isNotEmpty(obj.getCode())) {
			query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
		}

		if (StringUtils.isNotEmpty(obj.getName())) {
			query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
		}

		if (obj.getId() != null) {
			query.setParameter("id", obj.getId());
		}
		return query.list();
    }
    //HuyPQ-end
}
