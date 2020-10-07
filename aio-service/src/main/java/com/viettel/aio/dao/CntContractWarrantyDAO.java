package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractWarrantyBO;
import com.viettel.aio.dto.CntContractWarrantyDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hailh10
 */
@Repository("cntContractWarrantyDAO")
public class CntContractWarrantyDAO extends BaseFWDAOImpl<CntContractWarrantyBO, Long> {

    public CntContractWarrantyDAO() {
        this.model = new CntContractWarrantyBO();
    }

    public CntContractWarrantyDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public List<CntContractWarrantyDTO> doSearch(CntContractWarrantyDTO criteria) {
        StringBuilder stringBuilder = getSelectAllQuery();
        stringBuilder.append("WHERE T1.STATUS=1 ");


        if (null != criteria.getCntContractId()) {
            stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("cntContractWarrantyId", new LongType());
        query.addScalar("startTime", new DateType());
        query.addScalar("endTime", new DateType());
        query.addScalar("content", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("description", new StringType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("moneyType", new IntegerType());


        if (null != criteria.getCntContractId()) {
            query.setParameter("cntContractId", criteria.getCntContractId());
            queryCount.setParameter("cntContractId", criteria.getCntContractId());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        query.setResultTransformer(Transformers.aliasToBean(CntContractWarrantyDTO.class));
        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize().intValue());
            query.setMaxResults(criteria.getPageSize().intValue());
        }
        List ls = query.list();
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return ls;
    }

    //	public CntContractWarrantyDTO findByValue(String value) {
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.CNT_CONTRACT_WARRANTY_ID cntContractWarrantyId ");
//		stringBuilder.append(",T1.START_TIME startTime ");
//		stringBuilder.append(",T1.END_TIME endTime ");
//		stringBuilder.append(",T1.CONTENT content ");
//		stringBuilder.append(",T1.PRICE price ");
//		stringBuilder.append(",T1.DESCRIPTION description ");
//		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
//		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
//		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
//
//    	stringBuilder.append("FROM CNT_CONTRACT_WARRANTY T1 ");
//    	stringBuilder.append("WHERE T1.STATUS = 1 AND upper(T1.VALUE) = upper(:value)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("cntContractWarrantyId", new LongType());
//		query.addScalar("startTime", new DateType());
//		query.addScalar("endTime", new DateType());
//		query.addScalar("content", new StringType());
//		query.addScalar("price", new DoubleType());
//		query.addScalar("description", new StringType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("status", new LongType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedGroupId", new LongType());
//
//		query.setParameter("value", value);
//		query.setResultTransformer(Transformers.aliasToBean(CntContractWarrantyDTO.class));
//
//		return (CntContractWarrantyDTO) query.uniqueResult();
//	}
//
    public List<CntContractWarrantyDTO> getForAutoComplete(CntContractWarrantyDTO obj) {
        String sql = "SELECT CNT_CONTRACT_WARRANTY_ID cntContractWarrantyId"
                + " ,NAME name"
                + " ,VALUE value"
                + " FROM CNT_CONTRACT_WARRANTY"
                + " WHERE IS_DELETED = 'N' AND ISACTIVE = 'Y'";

        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=10" : "");
//		stringBuilder.append(StringUtils.isNotEmpty(obj.getName()) ? " AND (upper(NAME) LIKE upper(:name) ESCAPE '\\'" + (StringUtils.isNotEmpty(obj.getValue()) ? " OR upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : "") + ")" : (StringUtils.isNotEmpty(obj.getValue()) ? "AND upper(VALUE) LIKE upper(:value) ESCAPE '\\'" : ""));
        stringBuilder.append(" ORDER BY NAME");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

        query.addScalar("cntContractWarrantyId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("value", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(CntContractWarrantyDTO.class));

//		if (StringUtils.isNotEmpty(obj.getName())) {
//			query.setParameter("name", "%" + com.viettel.service.base.utils.StringUtils.replaceSpecialKeySearch(obj.getName()) + "%");
//		}
//
//		if (StringUtils.isNotEmpty(obj.getValue())) {
//			query.setParameter("value", "%" + com.viettel.service.base.utils.StringUtils.replaceSpecialKeySearch(obj.getValue()) + "%");
//		}

        query.setMaxResults(20);
        return query.list();
    }

    //
//	@SuppressWarnings("unchecked")
//	public CntContractWarrantyDTO getById(Long id) {
//    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.CNT_CONTRACT_WARRANTY_ID cntContractWarrantyId ");
//		stringBuilder.append(",T1.START_TIME startTime ");
//		stringBuilder.append(",T1.END_TIME endTime ");
//		stringBuilder.append(",T1.CONTENT content ");
//		stringBuilder.append(",T1.PRICE price ");
//		stringBuilder.append(",T1.DESCRIPTION description ");
//		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CNT_CONTRACT WHERE CNT_CONTRACT_ID = T1.CNT_CONTRACT_ID) cntContractName  ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CREATED_DATE createdDate ");
//		stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_USER WHERE CREATED_USER_ID = T1.CREATED_USER_ID) createdUserName  ");
//		stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM CREATED_GROUP WHERE CREATED_GROUP_ID = T1.CREATED_GROUP_ID) createdGroupName  ");
//		stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
//		stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_USER WHERE UPDATED_USER_ID = T1.UPDATED_USER_ID) updatedUserName  ");
//		stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM UPDATED_GROUP WHERE UPDATED_GROUP_ID = T1.UPDATED_GROUP_ID) updatedGroupName  ");
//
//    	stringBuilder.append("FROM CNT_CONTRACT_WARRANTY T1 ");
//    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.CNT_CONTRACT_WARRANTY_ID = :cntContractWarrantyId ");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("cntContractWarrantyId", new LongType());
//		query.addScalar("startTime", new DateType());
//		query.addScalar("endTime", new DateType());
//		query.addScalar("content", new StringType());
//		query.addScalar("price", new DoubleType());
//		query.addScalar("description", new StringType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("cntContractName", new StringType());
//		query.addScalar("status", new LongType());
//		query.addScalar("createdDate", new DateType());
//		query.addScalar("createdUserId", new LongType());
//		query.addScalar("createdUserName", new StringType());
//		query.addScalar("createdGroupId", new LongType());
//		query.addScalar("createdGroupName", new StringType());
//		query.addScalar("updatedDate", new DateType());
//		query.addScalar("updatedUserId", new LongType());
//		query.addScalar("updatedUserName", new StringType());
//		query.addScalar("updatedGroupId", new LongType());
//		query.addScalar("updatedGroupName", new StringType());
//
//		query.setParameter("cntContractWarrantyId", id);
//		query.setResultTransformer(Transformers.aliasToBean(CntContractWarrantyDTO.class));
//
//		return (CntContractWarrantyDTO) query.uniqueResult();
//	}
//
    public StringBuilder getSelectAllQuery() {
        StringBuilder stringBuilder = new StringBuilder("SELECT ");
        stringBuilder.append("T1.CNT_CONTRACT_WARRANTY_ID cntContractWarrantyId ");
        stringBuilder.append(",T1.START_TIME startTime ");
        stringBuilder.append(",T1.END_TIME endTime ");
        stringBuilder.append(",T1.CONTENT content ");
        stringBuilder.append(",T1.PRICE price ");
        stringBuilder.append(",T1.DESCRIPTION description ");
        stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
        stringBuilder.append(",T1.STATUS status ");
        stringBuilder.append(",T1.CREATED_DATE createdDate ");
        stringBuilder.append(",T1.CREATED_USER_ID createdUserId ");
        stringBuilder.append(",T1.CREATED_GROUP_ID createdGroupId ");
        stringBuilder.append(",T1.UPDATED_DATE updatedDate ");
        stringBuilder.append(",T1.UPDATED_USER_ID updatedUserId ");
        stringBuilder.append(",T1.UPDATED_GROUP_ID updatedGroupId ");
        stringBuilder.append(",T1.MONEY_TYPE moneyType ");

        stringBuilder.append("FROM CNT_CONTRACT_WARRANTY T1 ");

        return stringBuilder;
    }
}
