package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOPackageDetailBO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

//VietNT_20190308_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageDetailDAO")
public class AIOPackageDetailDAO extends BaseFWDAOImpl<AIOPackageDetailBO, Long> {

    public AIOPackageDetailDAO() {
        this.model = new AIOPackageDetailBO();
    }

    public AIOPackageDetailDAO(Session session) {
        this.session = session;
    }


    public AIOPackageDetailDTO getById(Long id) {
        List<AIOPackageDetailDTO> list = this.getByIds(Collections.singletonList(id));
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<AIOPackageDetailDTO> getByIds(List<Long> packageDetailIds) {
        String sql = "select " +
                "cs.NAME workName, " +
                "p.AIO_PACKAGE_ID aioPackageId, " +
                "p.NAME packageName, " +
                "p.TIME time, " +
                "p.IS_REPEAT isRepeat, " +
                "p.REPEAT_NUMBER repeatNumber, " +
                "p.REPEAT_INTERVAL repeatInterval, " +
                "p.SALE_CHANNEL saleChannel, " +
                "pd.AIO_PACKAGE_DETAIL_ID aioPackageDetailId, " +
                "pd.IS_PROVINCE_BOUGHT isProvinceBought, " +
                "pd.ENGINE_CAPACITY_ID engineCapacityId, " +
                "pd.ENGINE_CAPACITY_NAME engineCapacityName, " +
                "pd.GOODS_ID goodsId, " +
                "pd.GOODS_NAME goodsName, " +
                "pd.LOCATION_ID locationId, " +
                "pd.LOCATION_NAME locationName, " +
                "pd.QUANTITY_DISCOUNT quantityDiscount, " +
                "pd.AMOUNT_DISCOUNT amountDiscount, " +
                "pd.PERCENT_DISCOUNT percentDiscount, " +
                "pd.PERCENT_DISCOUNT_STAFF percentDiscountStaff " +
//                "pr.PRICE price " +
//                "promo.MONEY money, " +
//                "promo.TYPE type " +
                "from AIO_PACKAGE_DETAIL pd " +
                "join aio_package p on pd.AIO_PACKAGE_ID = p.AIO_PACKAGE_ID " +
                "join aio_config_service cs on p.PACKAGE_TYPE = cs.TYPE and p.service_code = cs.code " +
//                "left join AIO_PACKAGE_DETAIL_PRICE pr on pd.AIO_PACKAGE_DETAIL_ID = pr.PACKAGE_DETAIL_ID " +
//                "LEFT JOIN AIO_PACKAGE_PROMOTION promo ON " +
//                "promo.PACKAGE_DETAIL_ID = pd.AIO_PACKAGE_DETAIL_ID " +
//                "AND promo.TYPE IN (1,2) " +
//                "AND promo.MONEY is NOT NULL " +
                "where p.status = 1 " +
//                "and pr.PROVINCE_ID = :provinceId " +
                "and pd.AIO_PACKAGE_DETAIL_ID in (:packageDetailIds) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("packageDetailIds", packageDetailIds);

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDetailDTO.class));
        query.addScalar("workName", new StringType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("time", new DoubleType());
        query.addScalar("isRepeat", new LongType());
        query.addScalar("repeatNumber", new LongType());
        query.addScalar("repeatInterval", new DoubleType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("engineCapacityId", new LongType());
        query.addScalar("engineCapacityName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("locationId", new LongType());
        query.addScalar("locationName", new StringType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("percentDiscountStaff", new DoubleType());
//        query.addScalar("price", new DoubleType());
//        query.addScalar("money", new DoubleType());
//        query.addScalar("type", new LongType());

        return query.list();
    }
}
