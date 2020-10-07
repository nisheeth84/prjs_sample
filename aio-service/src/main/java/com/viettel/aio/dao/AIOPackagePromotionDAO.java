package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackagePromotionBO;
import com.viettel.aio.dto.AIOPackagePromotionDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
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

//VietNT_20190930_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackagePromotionDAO")
public class AIOPackagePromotionDAO extends BaseFWDAOImpl<AIOPackagePromotionBO, Long> {

    public AIOPackagePromotionDAO() {
        this.model = new AIOPackagePromotionBO();
    }

    public AIOPackagePromotionDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOPackagePromotionDTO> getListPromotions(AIOPackagePromotionDTO criteria) {
        String sql = "select " +
                "promo.PACKAGE_PROMOTION_ID packagePromotionId, " +
//                "promo.PACKAGE_ID packageId, " +
                "promo.PACKAGE_DETAIL_ID packageDetailId, " +
                "promo.GOODS_ID goodsId, " +
                "promo.GOODS_CODE goodsCode, " +
                "promo.GOODS_NAME goodsName, " +
                "promo.GOODS_UNIT_ID goodsUnitId, " +
                "promo.GOODS_UNIT_NAME goodsUnitName, " +
                "promo.GOODS_IS_SERIAL goodsIsSerial, " +
                "promo.QUANTITY quantity, " +
                "promo.MONEY money, " +
                "promo.TYPE type, " +
                "p.start_date startDate, " +
                "p.end_date endDate " +
                "from AIO_PACKAGE_PROMOTION promo " +
                "left join aio_package p on p.AIO_PACKAGE_ID = promo.package_id " +
                "where 1=1 ";

        if (criteria.getPackageDetailId() != null) {
            sql += "and promo.PACKAGE_DETAIL_ID = " + criteria.getPackageDetailId();
        } else if (criteria.getPackageId() != null) {
            sql += "and promo.PACKAGE_ID = " + criteria.getPackageId();
        } else if (criteria.getIdList() != null && !criteria.getIdList().isEmpty()) {
            sql += "and promo.PACKAGE_DETAIL_ID in (:ids) ";
        }

        sql += "order by promo.PACKAGE_PROMOTION_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        if (criteria.getIdList() != null && !criteria.getIdList().isEmpty()) {
            query.setParameterList("ids", criteria.getIdList());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOPackagePromotionDTO.class));
        query.addScalar("packagePromotionId", new LongType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("money", new DoubleType());
        query.addScalar("type", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());

        return query.list();
    }

    public List<AIOPackagePromotionDTO> getListPromotions(Long packageDetailId) {
        AIOPackagePromotionDTO dto = new AIOPackagePromotionDTO();
        dto.setPackageDetailId(packageDetailId);
        return this.getListPromotions(dto);
    }
}
