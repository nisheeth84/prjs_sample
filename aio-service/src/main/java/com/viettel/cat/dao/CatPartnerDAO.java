package com.viettel.cat.dao;

import com.viettel.cat.bo.CatPartnerBO;
import com.viettel.cat.dto.CatPartnerDTO;
import com.viettel.erp.dto.CatUnitDTO;
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

//import com.viettel.cat.dto.CatUnitDTO;
//import com.viettel.erp.utils.FilterUtilities;

/**
 * @author hailh10
 */
@Repository("catPartnerDAO")
public class CatPartnerDAO extends BaseFWDAOImpl<CatPartnerBO, Long> {

    public CatPartnerDAO() {
        this.model = new CatPartnerBO();
    }

    public CatPartnerDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CatPartnerDTO> doSearch(CatPartnerDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("select ");
        stringBuilder.append("T1.CAT_PARTNER_ID catPartnerId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.TAX_CODE taxCode ");
        stringBuilder.append(",T1.FAX fax ");
        stringBuilder.append(",T1.PHONE phone ");
        stringBuilder.append(",T1.ADDRESS address ");
        stringBuilder.append(",T1.REPRESENT represent ");
        stringBuilder.append(",T1.PARTNER_TYPE partnerType ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
        stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");

        stringBuilder.append("FROM CAT_PARTNER T1 where 1=1 ");


        if (null != criteria.getKeySearch()) {
            stringBuilder.append("AND (upper(T1.CODE) like upper(:key) or upper(T1.NAME) like upper(:key))");
        }
        if (null != criteria.getPartnerType()) {
            stringBuilder.append("AND T1.PARTNER_TYPE = :partnerType ");
        }

        if (null != criteria.getStatus()) {
            stringBuilder.append("AND T1.STATUS = :status ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");


        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("fax", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("represent", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());


        if (null != criteria.getPartnerType()) {
            query.setParameter("partnerType", criteria.getPartnerType());
            queryCount.setParameter("partnerType", criteria.getPartnerType());
        }

        if (null != criteria.getStatus()) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }

        if (null != criteria.getKeySearch()) {
            query.setParameter("key", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        List ls = query.list();
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return ls;
    }

    public CatPartnerDTO findByCode(String code) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_PARTNER_ID catPartnerId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.TAX_CODE taxCode ");
        stringBuilder.append(",T1.FAX fax ");
        stringBuilder.append(",T1.PHONE phone ");
        stringBuilder.append(",T1.ADDRESS address ");
        stringBuilder.append(",T1.REPRESENT represent ");
        stringBuilder.append(",T1.PARTNER_TYPE partnerType ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
        stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");

        stringBuilder.append("FROM CAT_PARTNER T1 ");
        stringBuilder.append("WHERE upper(T1.CODE) = upper(:code)");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("fax", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("represent", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());

        query.setParameter("code", code);
        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));

        return (CatPartnerDTO) query.uniqueResult();
    }

    public List<CatPartnerDTO> getForAutoComplete(CatPartnerDTO obj) {
        String sql = "SELECT CAT_PARTNER_ID catPartnerId"
                + " ,NAME name"
                + " ,VALUE value"
                + ",T1.TAX_CODE taxCode "
                + ",T1.FAX fax "
                + ",T1.PHONE phone "
                + ",T1.ADDRESS address "
                + ",T1.REPRESENT represent "
                + ",T1.PARTNER_TYPE partnerType "
                + ",T1.DESCRIPTION description "
                + ",T1.STATUS status "
                + ",T1.CREATED_DATE createdDate "
                + ",T1.CREATED_USER_ID createdUserId "
                + ",T1.CREATED_GROUP_ID createdGroupId "
                + ",T1.UPDATED_DATE updatedDate "
                + ",T1.UPDATED_USER_ID updatedUserId "
                + ",T1.UPDATED_GROUP_ID updatedGroupId "
                + " FROM CAT_PARTNER"
                + " WHERE 1=1";

        StringBuilder stringBuilder = new StringBuilder(sql);

        if (obj.getIsSize()) {
            stringBuilder.append(" AND ROWNUM <=10 ");
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
            }
        } else {
            if (StringUtils.isNotEmpty(obj.getName())) {
                stringBuilder.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&')");
            }
            if (StringUtils.isNotEmpty(obj.getCode())) {
                stringBuilder.append(" AND upper(CODE) LIKE upper(:name) escape '&'");
            }
        }
        if (null != obj.getPartnerType()) {
            stringBuilder.append("AND PARTNER_TYPE = :partnerType ");
        }

        stringBuilder.append(" ORDER BY NAME");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("fax", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("represent", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", "%" + obj.getName() + "%");
        }
        if (null != obj.getPartnerType()) {
            query.setParameter("partnerType", obj.getPartnerType());
        }
        return query.list();
    }


    @SuppressWarnings("unchecked")
    public List<CatPartnerDTO> getForComboBox(CatPartnerDTO obj) {
        String sqlStr = "SELECT CAT_PARTNER_ID catPartnerId"
                + " ,NAME name"
                + " ,VALUE value"
                + ",T1.TAX_CODE taxCode "
                + ",T1.FAX fax "
                + ",T1.PHONE phone "
                + ",T1.ADDRESS address "
                + ",T1.REPRESENT represent "
                + ",T1.PARTNER_TYPE partnerType "
                + ",T1.DESCRIPTION description "
                + ",T1.STATUS status "
                + ",T1.CREATED_DATE createdDate "
                + ",T1.CREATED_USER_ID createdUserId "
                + ",T1.CREATED_GROUP_ID createdGroupId "
                + ",T1.UPDATED_DATE updatedDate "
                + ",T1.UPDATED_USER_ID updatedUserId "
                + ",T1.UPDATED_GROUP_ID updatedGroupId "
                + " FROM CAT_PARTNER"
                + " WHERE 1=1";

        StringBuilder sql = new StringBuilder(sqlStr);
        if (obj.getStatus() != null) {
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

        query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));

        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", obj.getCode());
        }

        return query.list();
    }


    @SuppressWarnings("unchecked")
    public CatPartnerDTO getById(Long id) {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CAT_PARTNER_ID catPartnerId ");
        stringBuilder.append(",T1.CODE code ");
        stringBuilder.append(",T1.NAME name ");
        stringBuilder.append(",T1.TAX_CODE taxCode ");
        stringBuilder.append(",T1.FAX fax ");
        stringBuilder.append(",T1.PHONE phone ");
        stringBuilder.append(",T1.ADDRESS address ");
        stringBuilder.append(",T1.REPRESENT represent ");
        stringBuilder.append(",T1.PARTNER_TYPE partnerType ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
        stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
        stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
        stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
        stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
        stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");

        stringBuilder.append("FROM CAT_PARTNER T1 ");
        stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CAT_PARTNER_ID = :catPartnerId ");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("catPartnerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("fax", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("represent", new StringType());
        query.addScalar("partnerType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("createdGroupName", new StringType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedUserName", new StringType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("updatedGroupName", new StringType());

        query.setParameter("catPartnerId", id);
        query.setResultTransformer(Transformers.aliasToBean(CatPartnerDTO.class));

        return (CatPartnerDTO) query.uniqueResult();
    }
}
