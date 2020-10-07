package com.viettel.aio.dao;

import com.viettel.aio.bo.WorkItemTypeHCQTBO;
import com.viettel.aio.dto.WorkItemTypeHCQTDTO;
import com.viettel.coms.dto.CatWorkItemTypeDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author HIENVD
 */
@Repository("workItemTypeHCQTDAO")
public class WorkItemTypeHCQTDAO extends BaseFWDAOImpl<WorkItemTypeHCQTBO, Long> {

    public WorkItemTypeHCQTDAO() {
        this.model = new WorkItemTypeHCQTBO();
    }

    public WorkItemTypeHCQTDAO(Session session) {
        this.session = session;
    }

    public StringBuilder getSelectAllQuery() {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.WORK_ITEM_TYPE_ID workItemTypeId ");
        stringBuilder.append(",T1.WORK_ITEM_TYPE_CODE workItemTypeCode ");
        stringBuilder.append(",T1.WORK_ITEM_TYPE_NAME workItemTypeName ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append("FROM WORK_ITEM_TYPE_HCQT T1 ");
        return stringBuilder;
    }

    public List<WorkItemTypeHCQTDTO> getForAutoComplete(WorkItemTypeHCQTDTO obj) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append(" Where STATUS != 0");
        stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            stringBuilder
                    .append(" AND (UPPER(T1.WORK_ITEM_TYPE_CODE) like UPPER(:key) OR UPPER(T1.WORK_ITEM_TYPE_NAME) like UPPER(:key) escape '&')");
        }
        stringBuilder.append(" ORDER BY T1.WORK_ITEM_TYPE_ID");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("workItemTypeId", new LongType());
        query.addScalar("workItemTypeCode", new StringType());
        query.addScalar("workItemTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemTypeHCQTDTO.class));
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("key", "%" + obj.getKeySearch() + "%");
        }
        query.setMaxResults(20);
        return query.list();
    }

    public List<WorkItemTypeHCQTDTO> doSearch(WorkItemTypeHCQTDTO criteria) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append("WHERE 1=1 AND STATUS = 1 ");
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            stringBuilder.append(" AND (UPPER(T1.WORK_ITEM_TYPE_CODE) like UPPER(:key) OR UPPER(T1.WORK_ITEM_TYPE_NAME) like UPPER(:key) escape '&')");
        }
        stringBuilder.append(" ORDER BY T1.WORK_ITEM_TYPE_ID DESC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("workItemTypeId", new LongType());
        query.addScalar("workItemTypeCode", new StringType());
        query.addScalar("workItemTypeName", new StringType());
        query.addScalar("status", new LongType());
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(WorkItemTypeHCQTDTO.class));
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<WorkItemTypeHCQTDTO> doSearchWorkItemType(WorkItemTypeHCQTDTO obj) {
        StringBuilder sql = new StringBuilder(" select ");
        sql.append("WORK_ITEM_TYPE_ID workItemTypeId, ")
                .append("WORK_ITEM_TYPE_CODE workItemTypeCode, ")
                .append("WORK_ITEM_TYPE_NAME workItemTypeName, ")
                .append("STATUS status ")
                .append(" from WORK_ITEM_TYPE_HCQT where 1=1 ");

        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            sql.append(" AND (UPPER(WORK_ITEM_TYPE_CODE) like (:keySearch) OR UPPER(WORK_ITEM_TYPE_NAME) LIKE (:keySearch) escape '&') ");
        }

        if (obj.getStatus() != null) {
            sql.append(" AND status = :status ");
        }
        sql.append(" ORDER BY WORK_ITEM_TYPE_ID DESC ");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("workItemTypeId", new LongType());
        query.addScalar("workItemTypeCode", new StringType());
        query.addScalar("workItemTypeName", new StringType());
        query.addScalar("status", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemTypeHCQTDTO.class));

        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
        }

        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<WorkItemTypeHCQTDTO> getAutoCompleteWorkItemType(WorkItemTypeHCQTDTO obj) {
        StringBuilder sql = new StringBuilder(" select ");
        sql.append("WORK_ITEM_TYPE_ID workItemTypeId, ")
                .append("WORK_ITEM_TYPE_CODE workItemTypeCode, ")
                .append("WORK_ITEM_TYPE_NAME workItemTypeName, ")
                .append("STATUS status ")
                .append(" from WORK_ITEM_TYPE_HCQT where 1=1 ");

        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            sql.append(" AND (UPPER(WORK_ITEM_TYPE_CODE) like (:keySearch) OR UPPER(WORK_ITEM_TYPE_NAME) LIKE (:keySearch) escape '&' ) ");
        }

        sql.append(" AND status = 1 ");
        sql.append(" AND ROWNUM <= 10");
        sql.append(" ORDER BY WORK_ITEM_TYPE_ID DESC ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.addScalar("workItemTypeId", new LongType());
        query.addScalar("workItemTypeCode", new StringType());
        query.addScalar("workItemTypeName", new StringType());
        query.addScalar("status", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(WorkItemTypeHCQTDTO.class));

        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch().toUpperCase() + "%");
        }

        return query.list();
    }

    public List<WorkItemTypeHCQTDTO> checkValidateWorkItemType(WorkItemTypeHCQTDTO obj) {

        StringBuilder sql = new StringBuilder(" select ");
        sql.append("WORK_ITEM_TYPE_CODE workItemTypeCode")
                .append(" from WORK_ITEM_TYPE_HCQT where status != 0 ");

        if (StringUtils.isNotEmpty(obj.getWorkItemTypeCode())) {
            sql.append(" AND WORK_ITEM_TYPE_CODE = :workItemTypeCode");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("workItemTypeCode", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(CatWorkItemTypeDTO.class));
        if (StringUtils.isNotEmpty(obj.getWorkItemTypeCode())) {
            query.setParameter("workItemTypeCode", obj.getWorkItemTypeCode());
        }
        return query.list();
    }
}
