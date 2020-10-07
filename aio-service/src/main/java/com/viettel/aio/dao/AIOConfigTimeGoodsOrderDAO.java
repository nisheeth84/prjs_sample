package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOConfigTimeGoodsOrderBO;
import com.viettel.aio.dto.AIOConfigTimeGoodsOrderDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190604_create
@EnableTransactionManagement
@Transactional
@Repository("aioConfigTimeGoodsOrderDAO")
public class AIOConfigTimeGoodsOrderDAO extends BaseFWDAOImpl<AIOConfigTimeGoodsOrderBO, Long> {

    public AIOConfigTimeGoodsOrderDAO() {
        this.model = new AIOConfigTimeGoodsOrderBO();
    }

    public AIOConfigTimeGoodsOrderDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOConfigTimeGoodsOrderDTO> doSearch(AIOConfigTimeGoodsOrderDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("CONFIG_TIME_GOODS_ORDER_ID configTimeGoodsOrderId, ")
                .append("CODE code, ")
                .append("CONTENT content, ")
                .append("START_DATE startDate, ")
                .append("END_DATE endDate ")
                .append("FROM AIO_CONFIG_TIME_GOODS_ORDER ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("and upper(code) like upper(:keySearch) escape '&' ");
        }

        sql.append("ORDER BY CONFIG_TIME_GOODS_ORDER_ID DESC ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigTimeGoodsOrderDTO.class));query.addScalar("configTimeGoodsOrderId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("content", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public int deleteById(Long id) {
        String sql = "delete from AIO_CONFIG_TIME_GOODS_ORDER where CONFIG_TIME_GOODS_ORDER_ID = :id";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        return query.executeUpdate();
    }

    public String getLastestCode() {
        String sql = "SELECT CODE code FROM AIO_CONFIG_TIME_GOODS_ORDER " +
                "where " +
                "CONFIG_TIME_GOODS_ORDER_ID = (SELECT MAX(CONFIG_TIME_GOODS_ORDER_ID) FROM AIO_CONFIG_TIME_GOODS_ORDER) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("code", new StringType());
        return (String) query.uniqueResult();
    }

    public boolean checkExist(String code) {
        String sql = "SELECT CONFIG_TIME_GOODS_ORDER_ID configTimeGoodsOrderId FROM AIO_CONFIG_TIME_GOODS_ORDER " +
                "WHERE CODE = :code ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("code", code);

        return query.uniqueResult() != null;
    }

    public int updateConfig(AIOConfigTimeGoodsOrderDTO dto) {
        String sql = "update AIO_CONFIG_TIME_GOODS_ORDER " +
                "SET " +
                "CONTENT = :content, " +
                "START_DATE = :startDate, " +
                "END_DATE = :endDate " +
                "WHERE CONFIG_TIME_GOODS_ORDER_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("content", dto.getContent());
        query.setParameter("startDate", dto.getStartDate());
        query.setParameter("endDate", dto.getEndDate());
        query.setParameter("id", dto.getConfigTimeGoodsOrderId());

        return query.executeUpdate();
    }
}
