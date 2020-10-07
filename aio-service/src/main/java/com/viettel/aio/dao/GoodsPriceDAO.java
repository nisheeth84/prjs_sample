package com.viettel.aio.dao;

import com.viettel.aio.bo.GoodsPriceBO;
import com.viettel.aio.dto.GoodsPriceDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

//VietNT_20190308_create
@EnableTransactionManagement
@Transactional
@Repository("goodsPriceDAO")
public class GoodsPriceDAO extends BaseFWDAOImpl<GoodsPriceBO, Long> {

    public GoodsPriceDAO() {
        this.model = new GoodsPriceBO();
    }

    public GoodsPriceDAO(Session session) {
        this.session = session;
    }

    @SuppressWarnings("Duplicates")
    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<GoodsPriceDTO> doSearch(GoodsPriceDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_GOODS_PRICE_ID goodsPriceId, ")
                .append("GOODS_ID goodsId, ")
                .append("GOODS_CODE goodsCode, ")
                .append("GOODS_NAME goodsName, ")
                .append("GOODS_UNIT_ID goodsUnitId, ")
                .append("GOODS_UNIT_NAME goodsUnitName, ")
                .append("PRICE price, ")
                .append("STATUS status ")
                .append("FROM AIO_GOODS_PRICE ")
                .append("WHERE 1 = 1 ");
        // find by id condition
        if (criteria.getGoodsPriceId() != null) {
            sql.append("AND AIO_GOODS_PRICE_ID = :id ");
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            sql.append("AND GOODS_CODE = :goodsCode ");
        }
        // dosearch condition
        if (criteria.getStatus() != null) {
            sql.append("AND STATUS = :status ");
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(GOODS_CODE) like upper(:keySearch) or upper(GOODS_NAME) like upper(:keySearch) escape '&') ");
        }

        sql.append("order by AIO_GOODS_PRICE_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getGoodsPriceId() != null) {
            query.setParameter("id", criteria.getGoodsPriceId());
            queryCount.setParameter("id", criteria.getGoodsPriceId());
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(GoodsPriceDTO.class));
        query.addScalar("goodsPriceId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("status", new LongType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }
}
