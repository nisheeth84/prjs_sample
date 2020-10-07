package com.viettel.cat.dao;

import com.viettel.cat.bo.CatProducingCountryBO;
import com.viettel.cat.dto.CatProducingCountryDTO;
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

//import com.viettel.utils.FilterUtilities;

/**
 * @author hailh10
 */
@Repository("catProducingCountryDAO")
public class CatProducingCountryDAO extends
        BaseFWDAOImpl<CatProducingCountryBO, Long> {

    public CatProducingCountryDAO() {
        this.model = new CatProducingCountryBO();
    }

    public CatProducingCountryDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CatProducingCountryDTO> doSearch(CatProducingCountryDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(
                "SELECT T1.CAT_PRODUCING_COUNTRY_ID catProducingCountryId,"
                        + "T1.CODE code," + "T1.NAME name,"
                        + "T1.STATUS status "
                        + " FROM CAT_PRODUCING_COUNTRY T1 where 1=1 ");

        if (null != criteria.getKeySearch()) {
            stringBuilder
                    .append("AND (upper(T1.CODE) like upper(:key) or upper(T1.NAME) like upper(:key))");
        }
        if (null != criteria.getStatus()) {
            stringBuilder.append("AND T1.STATUS = :status");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catProducingCountryId", new LongType());
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

        query.setResultTransformer(Transformers.aliasToBean(CatProducingCountryDTO.class));
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

    public CatProducingCountryDTO findByCode(String code) {
        StringBuilder stringBuilder = new StringBuilder("Select T1.CAT_PRODUCING_COUNTRY_ID catProducingCountryId,"
                + "T1.CODE code,"
                + "T1.NAME name,"
                + "T1.STATUS status"
                + "FROM CAT_PRODUCING_COUNTRY T1"
                + "WHERE 1=1 AND upper(T1.CODE) = upper(:code)");


        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("code", code);
        query.setResultTransformer(Transformers
                .aliasToBean(CatProducingCountryDTO.class));

        return (CatProducingCountryDTO) query.uniqueResult();
    }

    public List<CatProducingCountryDTO> getForAutoComplete(
            CatProducingCountryDTO obj) {
        String sql = "SELECT CAT_PRODUCING_COUNTRY_ID catProducingCountryId"
                + " ,NAME name" + " ,VALUE value"
                + " FROM CAT_PRODUCING_COUNTRY"
                + " WHERE 1=1";


        StringBuilder stringBuilder = new StringBuilder(sql);
        if (obj.getIsSize()) {
            stringBuilder.append(" AND ROWNUM <=10 ");
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
            }
        } else {
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND upper(NAME) LIKE upper(:name) escape '&'");
            }
            if (StringUtils.isNotEmpty(obj.getCode())) {
                stringBuilder.append(" AND upper(CODE) LIKE upper(:value) escape '&'");
            }
        }
        stringBuilder.append(" ORDER BY NAME");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("value", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(CatProducingCountryDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<CatProducingCountryDTO> getForComboBox(CatProducingCountryDTO obj) {
        String sql = "SELECT CAT_PRODUCING_COUNTRY_ID catProducingCountryId"
                + " ,NAME name" + " ,CODE code"
                + " FROM CAT_PRODUCING_COUNTRY"
                + " WHERE 1=1";


        StringBuilder stringBuilder = new StringBuilder(sql);
        if (StringUtils.isNotEmpty(obj.getStatus())) {
            stringBuilder.append(" AND STATUS = :status ");
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            stringBuilder.append(" AND upper(CODE)=upper(:code) ");
        }
        stringBuilder.append(" ORDER BY CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(CatProducingCountryDTO.class));


        if (StringUtils.isNotEmpty(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", obj.getCode());
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public CatProducingCountryDTO getById(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder
                .append("T1.CAT_PRODUCING_COUNTRY_ID catProducingCountryId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.STATUS status ");

        stringBuilder.append("FROM CAT_PRODUCING_COUNTRY T1 ");
        stringBuilder
                .append("WHERE T1.IS_DELETED = 'N' AND T1.CAT_PRODUCING_COUNTRY_ID = :catProducingCountryId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catProducingCountryId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("catProducingCountryId", id);
        query.setResultTransformer(Transformers
                .aliasToBean(CatProducingCountryDTO.class));

        return (CatProducingCountryDTO) query.uniqueResult();
    }
}
