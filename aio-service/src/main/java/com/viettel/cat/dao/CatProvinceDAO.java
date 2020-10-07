package com.viettel.cat.dao;

import com.viettel.cat.bo.CatProvinceBO;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.utils.ValidateUtils;
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
 * @author hailh10
 */
@Repository("catProvinceDAO")
public class CatProvinceDAO extends BaseFWDAOImpl<CatProvinceBO, Long> {

    public CatProvinceDAO() {
        this.model = new CatProvinceBO();
    }

    public CatProvinceDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CatProvinceDTO> doSearch(CatProvinceDTO criteria) {
        // StringBuilder stringBuilder = new
        // StringBuilder("select totalRecord ");
        // stringBuilder.append(",T1.CAT_PROVINCE_ID catProvinceId ");
        // stringBuilder.append(",T1.CODE code ");
        // stringBuilder.append(",T1.NAME name ");
        // stringBuilder.append(",T1.STATUS status ");
        // stringBuilder.append("WHERE 1=1 ");
        StringBuilder stringBuilder = new StringBuilder(
                "SELECT T1.CAT_PROVINCE_ID catProvinceId," + "T1.CODE code,"
                        + "T1.NAME name," + "T1.STATUS status "
                        + " FROM CAT_PROVINCE T1 where 1=1 ");
        if (null != criteria.getKeySearch()) {
            stringBuilder
                    .append("AND (upper(T1.CODE) like upper(:key) or upper(T1.NAME) like :key)");
        }

        if (StringUtils.isNotEmpty(criteria.getStatus())) {
            stringBuilder
                    .append("AND UPPER(T1.STATUS) LIKE UPPER(:status) ESCAPE '\\' ");
        }

        if (criteria.getIdList() != null && !criteria.getIdList().isEmpty()) {
            stringBuilder.append("and T1.CAT_PROVINCE_ID in (:idList) ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        if (null != criteria.getKeySearch()) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }

        if (null != criteria.getStatus()) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }

        if (criteria.getIdList() != null && !criteria.getIdList().isEmpty()) {
            query.setParameterList("idList", criteria.getIdList());
            queryCount.setParameterList("idList", criteria.getIdList());
        }

        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1)
                    * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }

        List ls = query.list();
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
                .intValue());
        return ls;
    }

    public CatProvinceDTO findByCode(String code) {
        StringBuilder stringBuilder = new StringBuilder(
                "Select T1.CAT_PROVINCE_ID catProvinceId," + "T1.CODE code,"
                        + "T1.NAME name," + "T1.STATUS status"
                        + "FROM CAT_PROVINCE T1"
                        + "WHERE 1=1 AND upper(T1.CODE) = upper(:code)");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("code", code);
        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));

        return (CatProvinceDTO) query.uniqueResult();
    }

    @SuppressWarnings("unchecked")
    public List<CatProvinceDTO> getForComboBox(CatProvinceDTO obj) {
        String sqlStr = "SELECT CAT_PROVINCE_ID catUnitId" + " ,NAME name"
                + " ,CODE code" + " FROM CAT_PROVINCE" + " WHERE 1=1";

        StringBuilder sql = new StringBuilder(sqlStr);
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            sql.append(" AND STATUS = :status ");
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            sql.append(" AND upper(CODE)=upper(:code) ");
        }

        sql.append(" ORDER BY CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catUnitId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));

        if (StringUtils.isNotEmpty(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", obj.getCode());
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public CatProvinceDTO getById(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_PROVINCE_ID catProvinceId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.STATUS status ");

        stringBuilder.append("FROM CAT_PROVINCE T1 ");
        stringBuilder
                .append("WHERE T1.IS_DELETED = 'N' AND T1.CAT_PROVINCE_ID = :catProvinceId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("catProvinceId", id);
        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));

        return (CatProvinceDTO) query.uniqueResult();
    }

    //tungmt92 start 17122019
    public CatProvinceDTO getByOnlyId(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_PROVINCE_ID catProvinceId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.STATUS status ");

        stringBuilder.append("FROM CAT_PROVINCE T1 ");
        stringBuilder
                .append("WHERE T1.CAT_PROVINCE_ID = :catProvinceId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("catProvinceId", id);
        query.setResultTransformer(Transformers
                .aliasToBean(CatProvinceDTO.class));

        return (CatProvinceDTO) query.uniqueResult();
    }
    //tungmt92 end


    // Tìm kiếm tỉnh trong popup
    @SuppressWarnings("unchecked")
    public List<CatProvinceDTO> doSearchProvinceInPopup(CatProvinceDTO obj) {
        StringBuilder sql = new StringBuilder(
                "SELECT CAT_PROVINCE_ID catProvinceId, NAME name, STATUS status, CODE code FROM CAT_PROVINCE cpro ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(" WHERE upper(cpro.NAME) LIKE upper(:name) escape '&' OR upper(cpro.CODE) LIKE upper(:name) escape '&' ");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CatProvinceDTO.class));
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

}
