package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOConfigStockedGoodsBO;
import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import oracle.sql.DATE;
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
import java.util.Date;
import java.util.List;

//VietNT_20190530_create
@EnableTransactionManagement
@Transactional
@Repository("aioConfigStockedGoodsDAO")
public class AIOConfigStockedGoodsDAO extends BaseFWDAOImpl<AIOConfigStockedGoodsBO, Long> {

    public AIOConfigStockedGoodsDAO() {
        this.model = new AIOConfigStockedGoodsBO();
    }

    public AIOConfigStockedGoodsDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOConfigStockedGoodsDTO> doSearch(AIOConfigStockedGoodsDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("CONFIG_STOCKED_GOODS_ID configStockedGoodsId, ")
                .append("SYS_GROUP_ID sysGroupId, ")
                .append("SYS_GROUP_NAME sysGroupName, ")
                .append("GOODS_ID goodsId, ")
                .append("GOODS_CODE goodsCode, ")
                .append("GOODS_NAME goodsName, ")
                .append("CAT_UNIT_ID catUnitId, ")
//                .append("CAT_UNIT_CODE catUnitCode, ")
                .append("CAT_UNIT_NAME catUnitName, ")
                .append("MIN_QUANTITY minQuantity, ")
                .append("MAX_QUANTITY maxQuantity, ")
                .append("TIME_STOCKED timeStocked, ")
                .append("CREATED_DATE createdDate, ")
                .append("CREATED_USER createdUser, ")
                .append("UPDATED_DATE updatedDate, ")
                .append("UPDATED_USER updatedUser ")
                .append("FROM AIO_CONFIG_STOCKED_GOODS ")
                .append("WHERE 1=1 ");

        if (criteria.getSysGroupId() != null) {
            sql.append("AND SYS_GROUP_ID = :sysGroupId ");
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            sql.append("AND GOODS_CODE = :goodsCode ");
        }

        sql.append("ORDER BY CONFIG_STOCKED_GOODS_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");


        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigStockedGoodsDTO.class));
        query.addScalar("configStockedGoodsId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("catUnitId", new LongType());
//        query.addScalar("catUnitCode", new StringType());
        query.addScalar("catUnitName", new StringType());
        query.addScalar("minQuantity", new DoubleType());
        query.addScalar("maxQuantity", new DoubleType());
        query.addScalar("timeStocked", new DoubleType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUser", new LongType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public boolean checkUnique(String goodsCode, Long sysGroupId) {
        String sql = "SELECT CONFIG_STOCKED_GOODS_ID " +
                "FROM AIO_CONFIG_STOCKED_GOODS " +
                "WHERE SYS_GROUP_ID = :groupId AND GOODS_CODE = :goodsCode ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("groupId", sysGroupId);
        query.setParameter("goodsCode", goodsCode);

        List l = query.list();
        return l == null || l.isEmpty();
    }

    public int updateConfig(AIOConfigStockedGoodsDTO criteria, Long sysUserId) {
        String sql = "UPDATE AIO_CONFIG_STOCKED_GOODS SET " +
                "MIN_QUANTITY = :minQuantity, " +
                "MAX_QUANTITY = :maxQuantity, " +
                "TIME_STOCKED = :timeStocked, " +
                "UPDATED_DATE = :updateDate, " +
                "UPDATED_USER = :sysUserId " +
                "WHERE CONFIG_STOCKED_GOODS_ID = :id ";


        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("minQuantity", criteria.getMinQuantity());
        query.setParameter("maxQuantity", criteria.getMaxQuantity());
        query.setParameter("timeStocked", criteria.getTimeStocked());
        query.setParameter("updateDate", new Date());
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("id", criteria.getConfigStockedGoodsId());

        return query.executeUpdate();
    }

    public int deleteConfig(AIOConfigStockedGoodsDTO criteria) {
        String sql = "DELETE FROM AIO_CONFIG_STOCKED_GOODS " +
                "WHERE CONFIG_STOCKED_GOODS_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", criteria.getConfigStockedGoodsId());

        return query.executeUpdate();
    }
}
