package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrderCompanyBO;
import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.aio.dto.AIOOrderCompanyDTO;
import com.viettel.aio.dto.AIOOrderCompanyDetailDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190903_create
@EnableTransactionManagement
@Transactional
@Repository("aioOrderCompanyDAO")
public class AIOOrderCompanyDAO extends BaseFWDAOImpl<AIOOrderCompanyBO, Long> {

    public AIOOrderCompanyDAO() {
        this.model = new AIOOrderCompanyBO();
    }

    public AIOOrderCompanyDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOOrderCompanyDTO> doSearchOrderCompany(AIOOrderCompanyDTO criteria) {
        String sql = "SELECT " +
                "aoc.ORDER_COMPANY_ID orderCompanyId, " +
                "aoc.ORDER_COMPANY_CODE orderCompanyCode, " +
                "aoc.STATUS status, " +
                "aoc.SIGN_STATE signState, " +
                "aoc.CREATED_DATE createdDate, " +
                "to_char(aoc.CREATED_DATE, 'HH24:MI') createdDateStr, " +
                "su.full_name sysUserName, " +
                "su.employee_code sysUserCode " +
//                "aoc.CREATED_ID createdId " +
//                "aoc.CANCEL_DESCRIPTION cancelDescription, " +
//                "aoc.CANCEL_USER_ID cancelUserId, " +
                "FROM AIO_ORDER_COMPANY aoc " +
                "left join sys_user su on su.sys_user_id = aoc.CREATED_USER " +
                "WHERE 1=1 ";

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "AND upper(aoc.ORDER_COMPANY_CODE) like upper(:keySearch) escape '&' ";
        }
        if (criteria.getStatus() != null) {
            sql += "AND aoc.status = :status ";
        }
        if (criteria.getStartDate() != null) {
            sql += "AND trunc(:dateFrom) <= trunc(aoc.CREATED_DATE) ";
        }
        if (criteria.getEndDate() != null) {
            sql += "AND trunc(:dateTo) >= trunc(aoc.CREATED_DATE) ";
        }

        //Huypq-20190923-start
        if (criteria.getSignState() != null) {
            sql += "AND aoc.sign_State = :signState ";
        }
        //huy-end
        
        sql += "order by aoc.ORDER_COMPANY_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("dateFrom", criteria.getStartDate());
            queryCount.setParameter("dateFrom", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("dateTo", criteria.getEndDate());
            queryCount.setParameter("dateTo", criteria.getEndDate());
        }

        //Huypq-20190923-start
        if (criteria.getSignState() != null) {
        	query.setParameter("signState", criteria.getSignState());
            queryCount.setParameter("signState", criteria.getSignState());
        }
        //huy-end
        
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderCompanyDTO.class));
        query.addScalar("orderCompanyId", new LongType());
        query.addScalar("orderCompanyCode", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("signState", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserCode", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOOrderBranchDetailDTO> getBranchApprovedGoodsList(AIOOrderCompanyDTO obj) {
        String sql = "select " +
                "aobd.ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " +
                "aobd.ORDER_BRANCH_ID orderBranchId, " +
                "aobd.ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " +
                "aobd.GOODS_ID goodsId, " +
                "aobd.GOODS_CODE goodsCode, " +
                "aobd.GOODS_NAME goodsName, " +
                "aobd.TYPE type, " +
                "aobd.MANUFACTURER_NAME manufacturerName, " +
                "aobd.PRODUCING_COUNTRY_NAME producingCountryName, " +
                "aobd.GOODS_UNIT_NAME goodsUnitName, " +
                "aobd.GOODS_UNIT_ID goodsUnitId, " +
                "aobd.SPECIFICATIONS specifications, " +
                "aobd.DESCRIPTION description, " +
                "aobd.AMOUNT amount " +
                ", aobd.ORDER_BRANCH_CODE orderBranchCode " +
                "from AIO_ORDER_BRANCH_DETAIL aobd " +
                "where aobd.status = 1 and (aobd.in_request is null or aobd.in_request != 1) ";

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql += "and (upper(aobd.GOODS_CODE) like upper(:keySearch) escape '&' " +
                    "or upper(aobd.GOODs_NAME) like upper(:keySearch) escape '&') ";
        }

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderBranchDetailDTO.class));
        query.addScalar("orderBranchDetailId", new LongType());
        query.addScalar("orderBranchId", new LongType());
        query.addScalar("orderRequestDetailId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("specifications", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("orderBranchCode", new StringType());

        this.setPageSize(obj, query, queryCount);

        return query.list();
    }

    public List<Long> checkDetailsIsInRequest(List<Long> idList) {
        String sql = "select d.ORDER_BRANCH_DETAIL_ID orderBranchDetailId " +
                "from aio_order_BRANCH_detail d " +
                "where d.ORDER_REQUEST_DETAIL_ID in (:idList) " +
                "and d.in_request = 1 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("orderRequestDetailId", new LongType());
        query.setParameterList("idList", idList);

        return query.list();
    }

    public List<AIOOrderCompanyDetailDTO> getDetailOrderCompany(Long id) {
        String sql = "SELECT " +
                "ORDER_COMPANY_DETAIL_ID orderCompanyDetailId, " +
                "ORDER_COMPANY_ID orderCompanyId, " +
                "ORDER_BRANCH_DETAIL_ID orderBranchDetailId, " +
//                "ORDER_REQUEST_DETAIL_ID orderRequestDetailId, " +
                "TYPE type, " +
//                "IS_PROVINCE_BOUGHT isProvinceBought, " +
                "STATUS status, " +
                "GOODS_ID goodsId, " +
                "GOODS_CODE goodsCode, " +
                "GOODS_NAME goodsName, " +
                "MANUFACTURER_NAME manufacturerName, " +
                "PRODUCING_COUNTRY_NAME producingCountryName, " +
                "GOODS_UNIT_NAME goodsUnitName, " +
                "GOODS_UNIT_ID goodsUnitId, " +
                "SPECIFICATIONS specifications, " +
                "DESCRIPTION description, " +
                "AMOUNT amount, " +
                "ORDER_DATE orderDate " +
//                "CANCEL_USER_ID cancelUserId, " +
//                "CANCEL_DESCRIPTION cancelDescription, " +
//                "ORDER_COMPANY_CODE orderCompanyCode, " +
//                "ORDER_REQUEST_CODE orderRequestCode, " +
//                "ORDER_BRANCH_CODE orderBranchCode " ;
                "FROM AIO_ORDER_COMPANY_DETAIL where ORDER_COMPANY_ID = :id " +
                "order by ORDER_COMPANY_DETAIL_ID ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrderCompanyDetailDTO.class));
        query.addScalar("orderCompanyDetailId", new LongType());
        query.addScalar("orderCompanyId", new LongType());
        query.addScalar("orderBranchDetailId", new LongType());
//        query.addScalar("orderRequestDetailId", new LongType());
        query.addScalar("type", new LongType());
//        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("manufacturerName", new StringType());
        query.addScalar("producingCountryName", new StringType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("specifications", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("orderDate", new DateType());
//        query.addScalar("cancelUserId", new LongType());
//        query.addScalar("cancelDescription", new StringType());
//        query.addScalar("orderCompanyCode", new StringType());
//        query.addScalar("orderRequestCode", new StringType());
//        query.addScalar("orderBranchCode", new StringType());

        return query.list();
    }

    public int updateCompanyOrderDate(AIOOrderCompanyDetailDTO obj) {
        String sql = "update AIO_ORDER_COMPANY_DETAIL set order_date = :orderDate where ORDER_COMPANY_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("orderDate", obj.getOrderDate());
        query.setParameter("id", obj.getOrderCompanyDetailId());

        return query.executeUpdate();
    }
}
