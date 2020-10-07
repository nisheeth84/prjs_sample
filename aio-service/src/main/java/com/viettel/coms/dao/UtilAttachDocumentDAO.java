/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.dao;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.coms.dto.WorkItemDetailDTORequest;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author TruongBX3
 * @version 1.0
 * @since 08-May-15 4:07 PM
 */
@Repository("utilAttachDocumentDAO")
public class UtilAttachDocumentDAO extends BaseFWDAOImpl<UtilAttachDocumentBO, Long> {

    @Autowired
    private ConstructionTaskDAO constructionTaskDao;

    public UtilAttachDocumentDAO() {
        this.model = new UtilAttachDocumentBO();
    }

    public UtilAttachDocumentDAO(Session session) {
        this.session = session;
    }

    public List<Long> getIdByObjectAndType(Long constructionId, Long type) {
        // TODO Auto-generated method stub

        StringBuilder sql = new StringBuilder(
                "SELECT UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId from UTIL_ATTACH_DOCUMENT where OBJECT_ID = :objectId and TYPE = :type");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("objectId", constructionId);
        // hoanm1_20180613_start
        query.setParameter("type", type.toString());
        // hoanm1_20180613_end
        query.addScalar("utilAttachDocumentId", new LongType());
        List<Long> val = query.list();
        return val;
    }

    public void deleteListUtils(List<Long> deleteId) {
        // TODO Auto-generated method stub
        if (deleteId != null && !deleteId.isEmpty()) {
            StringBuilder sql = new StringBuilder(
                    "Delete  ctct_cat_owner.UTIL_ATTACH_DOCUMENT where UTIL_ATTACH_DOCUMENT_ID IN :deleteId");
            SQLQuery query = getSession().createSQLQuery(sql.toString());
            query.setParameterList("deleteId", deleteId);
            query.executeUpdate();
        }
    }

    public List<UtilAttachDocumentDTO> getByTypeAndObject(Long id, Long type) throws Exception {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
        sql.append("NAME name, CREATED_DATE createdDate, CREATED_USER_NAME createdUserName,FILE_PATH filePath ");
        sql.append("from ctct_cat_owner.UTIL_ATTACH_DOCUMENT where OBJECT_ID = :id and type = :type ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("type", type.toString());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            for (UtilAttachDocumentDTO dto : res) {
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
        }
        return res;
    }

    public List<UtilAttachDocumentDTO> getByTypeAndObjectTC(Long id, String type) throws Exception {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
        sql.append("NAME name, CREATED_DATE createdDate, CREATED_USER_NAME createdUserName,FILE_PATH filePath ");
        sql.append("from ctct_cat_owner.UTIL_ATTACH_DOCUMENT where OBJECT_ID = :id and type = :type ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameter("type", type);
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            for (UtilAttachDocumentDTO dto : res) {
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
        }
        return res;
    }

    public List<ConstructionImageInfo> getListImageByConstructionId(Long constructionTaskId) {
        String sql = new String(
                "select a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status from UTIL_ATTACH_DOCUMENT a "
                        + " where a.object_id = :constructionTaskId AND a.TYPE = '44' and a.STATUS = 1 "
                        + " ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("imageName", new StringType());
        query.addScalar("imagePath", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.setParameter("constructionTaskId", constructionTaskId);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
        return query.list();
    }

    public List<ConstructionImageInfo> getListImageByWorkItem(WorkItemDetailDTORequest request) {
        long month = constructionTaskDao.getCurrentTimeStampMonth(new Date());
        long year = constructionTaskDao.getCurrentTimeStampYear(new Date());
        String sql = new String(
                " select b.FILE_PATH imagePath ,b.name imageName  from construction_task a,UTIL_ATTACH_DOCUMENT b where "
                        + " a.construction_task_id=b.object_id " + " and a.level_id=4 and b.type='44' and "
                        + " a.parent_id in (select construction_task_id from construction_task a,DETAIL_MONTH_PLAN b "
                        + " where a.level_id=3 and a.work_item_id= :workItemId and b.SIGN_STATE=3 and b.status = 1  "
                        + " and ((b.MONTH = :month  AND b.YEAR = :year) or (b.MONTH = :monthMinus  AND b.YEAR = :yearMinus)) ) "
                        + " and PERFORMER_WORK_ITEM_ID= :sysUserId  " + " ORDER BY b.UTIL_ATTACH_DOCUMENT_ID DESC ");

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("imageName", new StringType());
        query.addScalar("imagePath", new StringType());
        query.setParameter("month", month);
        query.setParameter("year", year);
        if (month > 1 && month <= 12) {
            query.setParameter("monthMinus", month - 1);
            query.setParameter("yearMinus", year);
        } else {
            query.setParameter("monthMinus", 12);
            query.setParameter("yearMinus", year - 1);
        }
        query.setParameter("sysUserId", request.getSysUserRequest().getSysUserId());
        // query.setParameter("sysGroupId",
        // request.getSysUserRequest().getSysGroupId());
        query.setParameter("workItemId", request.getWorkItemDetailDto().getWorkItemId());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));

        return query.list();
    }

    public void updateUtilAttachDocumentById(Long utilAttachDocumentId) {
        /*
         * String sql = new String(
         * " DELETE UTIL_ATTACH_DOCUMENT a  WHERE a.UTIL_ATTACH_DOCUMENT_ID =:id " );
         * SQLQuery query = getSession().createSQLQuery(sql.toString());
         * query.setParameter("id", utilAttachDocumentId); query.executeUpdate();
         */

        StringBuilder sql = new StringBuilder(" ");
        sql.append("DELETE FROM UTIL_ATTACH_DOCUMENT a  WHERE a.UTIL_ATTACH_DOCUMENT_ID =:id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", utilAttachDocumentId);
        query.executeUpdate();
    }

//	public List<UtilAttachDocumentDTO> getByTypeAndObjectList(
//			List<Long> listId, Long type) throws Exception {
//		// TODO Auto-generated method stub
//		StringBuilder sql = new StringBuilder(
//				"select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
//		sql.append("u.NAME name, u.CREATED_DATE createdDate, u.CREATED_USER_NAME createdUserName,u.FILE_PATH filePath ");
//		sql.append("from ctct_cat_owner.UTIL_ATTACH_DOCUMENT u, CONSTRUCTION_TASK_DAILY ctd where u.OBJECT_ID in :listId and u.type = :type ");
//		// hungnx 20180705 start
//		sql.append(" and CTD.CONSTRUCTION_TASK_ID = U.OBJECT_ID and CTD.CONFIRM = 1");
//		// hungnx 20180705 end
//		SQLQuery query = getSession().createSQLQuery(sql.toString());
//		query.setParameterList("listId", listId);
//		query.setParameter("type", type.toString());
//		query.addScalar("utilAttachDocumentId", new LongType());
//		query.addScalar("name", new StringType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserName", new StringType());
//		query.addScalar("filePath", new StringType());
//		query.setResultTransformer(Transformers
//				.aliasToBean(UtilAttachDocumentDTO.class));
//		List<UtilAttachDocumentDTO> res = query.list();
//		if (res != null && !res.isEmpty()) {
//			for (UtilAttachDocumentDTO dto : res) {
//				dto.setFilePath(UEncrypt.encryptFileUploadPath(dto
//						.getFilePath()));
//			}
//		}
//		return res;
//	}

    public List<UtilAttachDocumentDTO> getListImageWorkItemId(List<Long> listId, Long type) throws Exception {
        StringBuilder sql = new StringBuilder("select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
        sql.append(
                "u.NAME name, u.CREATED_DATE createdDate, u.CREATED_USER_NAME createdUserName,u.FILE_PATH filePath ");
        sql.append("from ctct_cat_owner.UTIL_ATTACH_DOCUMENT u where u.OBJECT_ID in :listId and u.type = :type ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listId", listId);
        query.setParameter("type", type.toString());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            for (UtilAttachDocumentDTO dto : res) {
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
        }
        return res;
    }

    public List<UtilAttachDocumentDTO> getByTypeAndObjectListConstructionTask(List<Long> listId, Long type)
            throws Exception {
        StringBuilder sql = new StringBuilder("select UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
        sql.append(
                "u.NAME name, u.CREATED_DATE createdDate, u.CREATED_USER_NAME createdUserName,u.FILE_PATH filePath ");
        sql.append(
                "from ctct_cat_owner.UTIL_ATTACH_DOCUMENT u, CONSTRUCTION_TASK ct where u.OBJECT_ID in :listId and u.type = :type and CT.CONSTRUCTION_TASK_ID = U.OBJECT_ID ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("listId", listId);
        query.setParameter("type", type.toString());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            for (UtilAttachDocumentDTO dto : res) {
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
        }
        return res;
    }

    public List<UtilAttachDocumentDTO> getByListTypeAndObject(Long id, ArrayList<Long> listOfTypePhuLuc)
            throws Exception {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("select uad.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId,");
        sql.append(
                "uad.NAME name, uad.CREATED_DATE createdDate, uad.CREATED_USER_NAME createdUserName,uad.FILE_PATH filePath ");
        sql.append(",app.code appParamCode,app.name appParamName ");
        sql.append("from UTIL_ATTACH_DOCUMENT  uad "
                + "Left join app_param app on app.code = uad.APP_PARAM_CODE and app.PAR_TYPE ='APPENDIX_MONTH_PLAN' "
                + "where uad.OBJECT_ID = :id and uad.type in :listOfTypePhuLuc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setParameterList("listOfTypePhuLuc", listOfTypePhuLuc);
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.addScalar("appParamName", new StringType());
        query.addScalar("appParamCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> res = query.list();
        if (res != null && !res.isEmpty()) {
            for (UtilAttachDocumentDTO dto : res) {
                dto.setFilePath(UEncrypt.encryptFileUploadPath(dto.getFilePath()));
            }
        }
        return res;
    }

    public List<Long> getIdByObjectAndTypeList(Long totalMonthPlanId, ArrayList<Long> listOfTypePhuLuc) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId from UTIL_ATTACH_DOCUMENT where OBJECT_ID = :objectId and TYPE in :listOfTypePhuLuc");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("objectId", totalMonthPlanId);
        query.setParameterList("listOfTypePhuLuc", listOfTypePhuLuc);
        query.addScalar("utilAttachDocumentId", new LongType());
        List<Long> val = query.list();
        return val;
    }

    public void updateAppParamCode(Long utilAttachDocumentId, String string) {
        // TODO Auto-generated method stub
        StringBuilder sbquery = new StringBuilder();
        sbquery.append(" UPDATE ");
        sbquery.append(" UTIL_ATTACH_DOCUMENT u");
        sbquery.append(" SET ");
        sbquery.append(" u.APP_PARAM_CODE =:string   ");
        sbquery.append(" WHERE ");
        sbquery.append(" u.UTIL_ATTACH_DOCUMENT_ID =:utilAttachDocumentId ");
        SQLQuery query = getSession().createSQLQuery(sbquery.toString());
        query.setParameter("utilAttachDocumentId", utilAttachDocumentId);
        query.setParameter("string", string);

        query.executeUpdate();
    }

    // hungnx 070618 start
    public List<UtilAttachDocumentDTO> doSearch(UtilAttachDocumentDTO criteria) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append(" WHERE 1=1 ");
        if (null != criteria.getObjectId()) {
            stringBuilder.append("AND T1.OBJECT_ID = :objectId ");
        }
        if (StringUtils.isNotEmpty(criteria.getType())) {
            stringBuilder.append("AND UPPER(T1.TYPE) LIKE UPPER(:type) ESCAPE '\\' ");
        }
        if (StringUtils.isNotEmpty(criteria.getAppParamCode())) {
            stringBuilder.append("AND UPPER(T1.APP_PARAM_CODE) LIKE UPPER(:appParamCode) ESCAPE '\\' ");
        }
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            stringBuilder.append("AND UPPER(T1.CODE) LIKE UPPER(:code) ESCAPE '\\' ");
        }
        if (StringUtils.isNotEmpty(criteria.getName())) {
            stringBuilder.append("AND UPPER(T1.NAME) LIKE UPPER(:name) ESCAPE '\\' ");
        }
        if (StringUtils.isNotEmpty(criteria.getEncrytName())) {
            stringBuilder.append("AND UPPER(T1.ENCRYT_NAME) LIKE UPPER(:encrytName) ESCAPE '\\' ");
        }

        if (StringUtils.isNotEmpty(criteria.getStatus())) {
            stringBuilder.append("AND UPPER(T1.STATUS) LIKE UPPER(:status) ESCAPE '\\' ");
        }
        if (StringUtils.isNotEmpty(criteria.getFilePath())) {
            stringBuilder.append("AND UPPER(T1.FILE_PATH) LIKE UPPER(:filePath) ESCAPE '\\' ");
        }
        if (null != criteria.getCreatedDate()) {
            stringBuilder.append("AND trunc(T1.CREATED_DATE) = :createdDate ");
        }
        // if (null != criteria.getCreatedDateFrom()) {
        // stringBuilder.append("AND T1.CREATED_DATE >= :createdDateFrom ");
        // }
        // if (null != criteria.getCreatedDateTo()) {
        // stringBuilder.append("AND T1.CREATED_DATE <= :createdDateTo ");
        // }
        if (null != criteria.getCreatedUserId()) {
            stringBuilder.append("AND T1.CREATED_USER_ID = :createdUserId ");
        }
        // if (StringUtils.isNotEmpty(criteria.getConfirm())) {
        // stringBuilder.append(" and CTD.CONFIRM = :confirm");
        // }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("objectId", new LongType());
        query.addScalar("type", new StringType());
        query.addScalar("appParamCode", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("encrytName", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("filePath", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdUserName", new StringType());

        if (null != criteria.getUtilAttachDocumentId()) {
            query.setParameter("utilAttachDocumentId", criteria.getUtilAttachDocumentId());
            queryCount.setParameter("utilAttachDocumentId", criteria.getUtilAttachDocumentId());
        }
        if (null != criteria.getObjectId()) {
            query.setParameter("objectId", criteria.getObjectId());
            queryCount.setParameter("objectId", criteria.getObjectId());
        }
        if (StringUtils.isNotEmpty(criteria.getType())) {
            query.setParameter("type", criteria.getType());
            queryCount.setParameter("type", "%" + criteria.getType() + "%");
        }
        if (StringUtils.isNotEmpty(criteria.getAppParamCode())) {
            query.setParameter("appParamCode", "%" + criteria.getAppParamCode() + "%");
            queryCount.setParameter("appParamCode", "%" + criteria.getAppParamCode() + "%");

        }
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", "%" + criteria.getCode() + "%");
            queryCount.setParameter("code", "%" + criteria.getCode() + "%");
        }
        if (StringUtils.isNotEmpty(criteria.getName())) {
            query.setParameter("name", "%" + criteria.getName() + "%");
            queryCount.setParameter("name", "%" + criteria.getName() + "%");
        }
        if (StringUtils.isNotEmpty(criteria.getEncrytName())) {
            query.setParameter("encrytName", "%" + criteria.getEncrytName() + "%");
            queryCount.setParameter("encrytName", "%" + criteria.getEncrytName() + "%");
        }

        if (StringUtils.isNotEmpty(criteria.getStatus())) {
            query.setParameter("status", "%" + criteria.getStatus() + "%");
            queryCount.setParameter("status", "%" + criteria.getStatus() + "%");
        }
        if (StringUtils.isNotEmpty(criteria.getFilePath())) {
            query.setParameter("filePath", "%" + criteria.getFilePath() + "%");
            queryCount.setParameter("filePath", "%" + criteria.getFilePath() + "%");
        }
        if (null != criteria.getCreatedDate()) {
            query.setParameter("createdDate", criteria.getCreatedDate());
            queryCount.setParameter("createdDate", criteria.getCreatedDate());
        }
        // if (null != criteria.getCreatedDateFrom()) {
        // query.setTimestamp("createdDateFrom", criteria.getCreatedDateFrom());
        // queryCount.setTimestamp("createdDateFrom",
        // criteria.getCreatedDateFrom());
        // }
        // if (null != criteria.getCreatedDateTo()) {
        // query.setTimestamp("createdDateTo", criteria.getCreatedDateTo());
        // queryCount.setTimestamp("createdDateTo",
        // criteria.getCreatedDateTo());
        // }
        if (null != criteria.getCreatedUserId()) {
            query.setParameter("createdUserId", criteria.getCreatedUserId());
            queryCount.setParameter("createdUserId", criteria.getCreatedUserId());
        }

        // if (StringUtils.isNotEmpty(criteria.getConfirm())) {
        // query.setParameter("confirm", criteria.getConfirm());
        // queryCount.setParameter("confirm", criteria.getConfirm());
        // }
        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        List<UtilAttachDocumentDTO> ls = query.list();
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        // hnx 25/5/18 when download file
        // for (int i = 0; i < ls.size(); i++) {
        // try {
        // ls.get(i).setFilePath(UEncrypt.encryptFileUploadPath(ls.get(i).getFilePath()));
        // } catch (Exception e) {
        // e.printStackTrace();
        // }
        // }
        return ls;
    }

    public StringBuilder getSelectAllQuery() {
        StringBuilder stringBuilder = new StringBuilder("SELECT distinct ");
        stringBuilder.append("T1.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId ");
        stringBuilder.append(",T1.OBJECT_ID objectId ");
        stringBuilder.append(",T1.TYPE type ");
        stringBuilder.append(",T1.APP_PARAM_CODE appParamCode ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.ENCRYT_NAME encrytName ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.FILE_PATH filePath ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",T1.CREATED_USER_NAME createdUserName ");
        stringBuilder.append("FROM UTIL_ATTACH_DOCUMENT T1");
        return stringBuilder;
    }
    // hungnx 070618 end
//    kepv_20181010_start
    public List<ConstructionImageInfo> getListImageByConstructionId_Type(Long constructionId, String type) {
        String sql = new String(
                "select a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status from UTIL_ATTACH_DOCUMENT a "
                        + " where a.object_id = :constructionkId And a.name like '%.jpg' AND a.TYPE = :typeimage and a.STATUS = 1 "
                        + " ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("imageName", new StringType());
        query.addScalar("imagePath", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("utilAttachDocumentId", new LongType());
        query.setParameter("constructionkId", constructionId);
        query.setParameter("typeimage", type);
        query.setResultTransformer(Transformers.aliasToBean(ConstructionImageInfo.class));
        return query.list();
    }
//    kepv_20181010_end
}
