package com.viettel.cat.dao;

import com.viettel.cat.bo.CatManufacturerBO;
import com.viettel.cat.dto.CatManufacturerDTO;
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

/**
 * @author hailh10
 */
@Repository("catManufacturerDAO")
public class CatManufacturerDAO extends BaseFWDAOImpl<CatManufacturerBO, Long> {

    public CatManufacturerDAO() {
        this.model = new CatManufacturerBO();
    }

    public CatManufacturerDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CatManufacturerDTO> doSearch(CatManufacturerDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(
                "SELECT T1.CAT_MANUFACTURER_ID catManufacturerId,"
                        + "T1.CODE code," + "T1.NAME name,"
                        + "T1.STATUS status "
                        + " FROM CAT_MANUFACTURER T1 where 1=1 ");

        if (null != criteria.getKeySearch()) {
            stringBuilder
                    .append("AND (upper(T1.CODE) like upper(:key) or upper(T1.NAME) like upper(:key))");
        }
//		if (null != criteria.getStatus()) {
//			stringBuilder.append("AND T1.STATUS = :status");
//		}

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());


        if (null != criteria.getKeySearch()) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }

//		if (null != criteria.getStatus()) {
//			query.setParameter("status", criteria.getStatus());
//			queryCount.setParameter("status", criteria.getStatus());
//		}

        query.setResultTransformer(Transformers.aliasToBean(CatManufacturerDTO.class));
        query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
        query.setMaxResults(criteria.getPageSize().intValue());
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        List ls = query.list();
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult())
                .intValue());
        return ls;
    }

    public CatManufacturerDTO findByCode(String code) {
        StringBuilder stringBuilder = new StringBuilder("Select T1.CAT_MANUFACTURER_ID catManufacturerId,"
                + "T1.CODE code,"
                + "T1.NAME name,"
                + "T1.STATUS status"
                + "FROM CAT_MANUFACTURER T1"
                + "WHERE 1=1 AND upper(T1.CODE) = upper(:code)");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("code", code);
        query.setResultTransformer(Transformers
                .aliasToBean(CatManufacturerDTO.class));

        return (CatManufacturerDTO) query.uniqueResult();
    }

    public List<CatManufacturerDTO> getForAutoComplete(CatManufacturerDTO obj) {
        String sql = "SELECT CAT_MANUFACTURER_ID catManufacturerId"
                + " ,NAME name" + " ,VALUE value"
                + " FROM CAT_MANUFACTURER"
                + " WHERE 1=1";

        StringBuilder stringBuilder = new StringBuilder(sql);

        if (obj.getIsSize()) {
            stringBuilder.append(" AND ROWNUM <=10 ");
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:value) escape '&')");
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

        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("value", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(CatProducingCountryDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
        }

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("value", "%" + obj.getName() + "%");
        }

        return query.list();
    }


    @SuppressWarnings("unchecked")
    public List<CatManufacturerDTO> getForComboBox(CatManufacturerDTO obj) {
        String sql = "SELECT CAT_MANUFACTURER_ID catManufacturerId"
                + " ,NAME name" + " ,VALUE value"
                + " FROM CAT_MANUFACTURER"
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

        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("value", new StringType());

        query.setResultTransformer(Transformers
                .aliasToBean(CatManufacturerDTO.class));


        if (StringUtils.isNotEmpty(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", obj.getCode());
        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public CatManufacturerDTO getById(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_MANUFACTURER_ID catManufacturerId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.STATUS status ");

        stringBuilder.append("FROM CAT_MANUFACTURER T1 ");
        stringBuilder.append("WHERE T1.CAT_MANUFACTURER_ID = :catManufacturerId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catManufacturerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());

        query.setParameter("catManufacturerId", id);
        query.setResultTransformer(Transformers.aliasToBean(CatManufacturerDTO.class));

        return (CatManufacturerDTO) query.uniqueResult();
    }
}
