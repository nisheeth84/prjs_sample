package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOConfigServiceBO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
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

//VietNT_20190315_create
@EnableTransactionManagement
@Transactional
@Repository("aioConfigServiceDAO")
public class AIOConfigServiceDAO extends BaseFWDAOImpl<AIOConfigServiceBO, Long> {

    public AIOConfigServiceDAO() {
        this.model = new AIOConfigServiceBO();
    }

    public AIOConfigServiceDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOConfigServiceDTO> getAllAIOConfigService() {
        String sql = "Select " +
                "a.AIO_CONFIG_SERVICE_ID aioConfigServiceId, " +
                "a.CODE code, " +
                "a.NAME name, " +
                "a.TYPE type, " +
                "a.STATUS status, " +
                "a.INDUSTRY_CODE industryCode, " +
                "a.INDUSTRY_NAME industryName " +
                "from AIO_CONFIG_SERVICE a ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("industryName", new StringType());
        return query.list();
    }

    public List<AIOContractDetailDTO> doSearchService(AIOConfigServiceDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("cs.NAME workName, ")
                .append("p.AIO_PACKAGE_ID packageId, ")
                .append("p.NAME packageName, ")
                .append("p.TIME time, ")
                .append("p.IS_REPEAT isRepeat, ")
                .append("p.REPEAT_NUMBER repeatNumber, ")
                .append("p.REPEAT_INTERVAL repeatInterval, ")
                // combine goodsCodes into 1 string
                .append("(select listagg(GOODS_CODE, ', ' ) within group (order by AIO_PACKAGE_DETAIL_ID) " +
                        "from aio_package_Goods where AIO_PACKAGE_DETAIL_ID = pd.AIO_PACKAGE_DETAIL_ID " +
                        "group by AIO_PACKAGE_DETAIL_ID) customField, ")
                .append("pd.IS_PROVINCE_BOUGHT isProvinceBought, ")
                .append("p.SALE_CHANNEL saleChannel, ")
                .append("pd.AIO_PACKAGE_DETAIL_ID packageDetailId, ")
                .append("pd.ENGINE_CAPACITY_ID engineCapacityId, ")
                .append("pd.ENGINE_CAPACITY_NAME engineCapacityName, ")
                .append("pd.GOODS_ID goodsId, ")
                .append("pd.GOODS_NAME goodsName, ")
                .append("pd.LOCATION_ID locationId, ")
                .append("pd.LOCATION_NAME locationName, ")
                .append("pd.QUANTITY_DISCOUNT quantityDiscount, ")
                .append("pd.AMOUNT_DISCOUNT amountDiscount, ")
                .append("pd.PERCENT_DISCOUNT percentDiscount, ")
                .append("pd.PERCENT_DISCOUNT_STAFF percentDiscountStaff, ")
                .append("pr.PRICE price ")
                .append(", PROMO.MONEY money ")
                .append(", promo.TYPE type ")
                .append("from aio_config_service cs ")
                .append("left join AIO_PACKAGE p on p.PACKAGE_TYPE = cs.TYPE and p.service_code = cs.code ")
                .append("left join AIO_PACKAGE_DETAIL pd on pd.AIO_PACKAGE_ID = p.AIO_PACKAGE_ID ")
                .append("left join AIO_PACKAGE_DETAIL_PRICE pr on pd.AIO_PACKAGE_DETAIL_ID = pr.PACKAGE_DETAIL_ID ")
                .append("LEFT JOIN AIO_PACKAGE_PROMOTION promo ON " +
                        "promo.PACKAGE_DETAIL_ID = pd.AIO_PACKAGE_DETAIL_ID " +
                        "AND promo.TYPE IN (1,2) " +
                        "AND promo.MONEY is NOT NULL ")
                .append("where (upper(cs.code) = upper(:code) " +
                        "or ((upper(cs.industry_code) = upper(:industryCode)) and (cs.type = 1))) ")
                .append("and pr.PROVINCE_ID = :provinceId ")
                .append("and p.status = 1 ");

    	if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
    		sql.append("and (upper(p.NAME) like upper(:keySearch) or upper(p.code) like upper(:keySearch) escape '&') ");
    	}
    	//VietNT_25/06/2019_start
        // query by saleChannelCode
        sql.append("and upper(p.sale_channel) = upper(:saleChannel) ");
    	//VietNT_end

        if (criteria.getIsInternal() != null) {
            sql.append("and p.is_internal = 1 ");
        }
        sql.append("ORDER BY cs.code, p.AIO_PACKAGE_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setParameter("code", criteria.getCode());
        queryCount.setParameter("code", criteria.getCode());

        // use params type as provinceId
        query.setParameter("provinceId", criteria.getType());
        queryCount.setParameter("provinceId", criteria.getType());

        //VietNT_25/06/2019_start
        // query by saleChannel
        query.setParameter("saleChannel", criteria.getName(), new StringType());
        queryCount.setParameter("saleChannel", criteria.getName(), new StringType());
        //VietNT_end

        // query by industryCode
        query.setParameter("industryCode", criteria.getIndustryCode(), new StringType());
        queryCount.setParameter("industryCode", criteria.getIndustryCode(), new StringType());

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOContractDetailDTO.class));
        query.addScalar("workName", new StringType());
        query.addScalar("packageId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("time", new DoubleType());
        query.addScalar("isRepeat", new LongType());
        query.addScalar("repeatNumber", new LongType());
        query.addScalar("repeatInterval", new DoubleType());
        query.addScalar("packageDetailId", new LongType());
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
        query.addScalar("price", new DoubleType());
        query.addScalar("customField", new StringType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("money", new DoubleType());
        query.addScalar("type", new LongType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOConfigServiceDTO> getForAutoCompleteConfigService(AIOConfigServiceDTO obj) {

        String sql = "SELECT acs.AIO_CONFIG_SERVICE_ID aioConfigServiceId,acs.CODE code, acs.NAME name FROM AIO_CONFIG_SERVICE acs WHERE 1=1 ";
//      +  " WHERE acs.STATUS=1 "
        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" AND ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(obj.getName())) {
            stringBuilder.append(
                    " AND (upper(acs.NAME) LIKE upper(:name) escape '&' OR upper(acs.CODE) LIKE upper(:name) escape '&')");
        }

        stringBuilder.append(" ORDER BY acs.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
//        if (StringUtils.isNotEmpty(obj.getCode())) {
//            query.setParameter("value", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
//        }

        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOConfigServiceDTO> getDropDownData() {
        String sql = "SELECT " +
                "acs.AIO_CONFIG_SERVICE_ID aioConfigServiceId, " +
                "acs.CODE code, " +
                "acs.NAME name " +
                ", acs.INDUSTRY_CODE industryCode " +
                "FROM AIO_CONFIG_SERVICE acs WHERE 1=1 ";
//      +  " WHERE acs.STATUS=1 "
        StringBuilder stringBuilder = new StringBuilder(sql);

        stringBuilder.append(" ORDER BY acs.CODE");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("industryCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));


        return query.list();
    }
}
