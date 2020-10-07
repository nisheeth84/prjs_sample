package com.viettel.aio.dao;

import java.math.BigDecimal;
import java.util.List;

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

import com.viettel.aio.bo.AIOPackageBO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOPackageDetailPriceDTO;
import com.viettel.aio.dto.AIOPackageGoodsAddDTO;
import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

//VietNT_20190308_create
@EnableTransactionManagement
@Transactional
@Repository("aioPackageDAO")
public class AIOPackageDAO extends BaseFWDAOImpl<AIOPackageBO, Long> {

    public AIOPackageDAO() {
        this.model = new AIOPackageBO();
    }

    public AIOPackageDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOPackageDTO> doSearchPackage(AIOPackageDTO criteria) {
        String conditionProvince = StringUtils.EMPTY;
        String conditionGoods = StringUtils.EMPTY;
        if (criteria.getProvinceId() != null) {
            conditionProvince = "JOIN AIO_PACKAGE_DETAIL_PRICE pp ON p.AIO_PACKAGE_ID = pp.PACKAGE_ID and pp.PROVINCE_ID = :provinceId ";
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            conditionGoods = "JOIN AIO_PACKAGE_GOODS pg ON pg.AIO_PACKAGE_ID = p.AIO_PACKAGE_ID AND pg.GOODS_CODE = :goodsCode ";
        }
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("p.AIO_PACKAGE_ID aioPackageId, ")
                .append("p.CODE code, ")
                .append("p.NAME name, ")
                .append("p.PACKAGE_TYPE packageType, ")
                .append("p.DESCRIPTION description, ")
                .append("p.STATUS status, ")
                .append("p.TIME time, ")
                .append("p.SERVICE_ID serviceId, ")
                .append("p.SERVICE_CODE serviceCode, ")
                .append("p.REPEAT_NUMBER repeatNumber, ")
                .append("p.REPEAT_INTERVAL repeatInterval, ")
                .append("p.IS_REPEAT isRepeat, ")
                .append("p.START_DATE startDate, ")
                .append("p.END_DATE endDate ")
                //VietNT_26/06/2019_start
                .append(", p.SALE_CHANNEL saleChannel ")
                //VietNT_end
                .append(", CREATED_USER createdUser ")
                .append(", CREATED_DATE createdDate ")
//                .append(", UPDATE_USER updateUser ")
//                .append(", UPDATE_DATE updateDate ")
                .append(", p.is_PROMOTION isPromotion ")
                .append(", p.PACKAGE_POINT packagePoint ")
                .append(", p.is_internal isInternal ")
                .append(", p.industry_code industryCode ")
                .append(", (Select Nvl(Max(apdp.Price),0)  From AIO_PACKAGE_DETAIL_PRICE apdp " +
                       "            Right Join AIO_PACKAGE_DETAIL apd " +
                       "            on apdp.PACKAGE_DETAIL_ID = apd.AIO_PACKAGE_DETAIL_ID " +
                       "            Right Join AIO_PACKAGE ap " +
                       "            on apd.AIO_PACKAGE_ID = ap.AIO_PACKAGE_ID " +
                       "            where apdp.PACKAGE_ID = p.AIO_PACKAGE_ID ) as price ")

                .append(", (SELECT listagg(ap.GOODS_NAME ,',') WITHIN GROUP (ORDER BY ap.GOODS_NAME) \"List_Goods\"  from AIO_PACKAGE_GOODS ap " +
                        "            where ap.AIO_PACKAGE_ID = p.AIO_PACKAGE_ID) as listGoods ")
                .append("FROM AIO_PACKAGE p ")
                .append(conditionProvince)
                .append(conditionGoods)
                .append("WHERE 1 = 1 ");
        // find by id condition
        if (criteria.getAioPackageId() != null) {
            sql.append("AND p.AIO_PACKAGE_ID = :id ");
        }
        // dosearch condition
        if (criteria.getStatus() != null) {
            sql.append("AND p.STATUS = :status ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("AND trunc(:startDate) <= trunc(p.START_DATE) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append("AND trunc(:endDate) >= trunc(p.START_DATE) ");
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(p.code) like upper(:keySearch) escape '&' " +
                    "or upper(p.name) like upper(:keySearch) escape '&') ");
        }

        sql.append("order by p.AIO_PACKAGE_ID desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getAioPackageId() != null) {
            query.setParameter("id", criteria.getAioPackageId());
            queryCount.setParameter("id", criteria.getAioPackageId());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("startDate", criteria.getStartDate());
            queryCount.setParameter("startDate", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("endDate", criteria.getEndDate());
            queryCount.setParameter("endDate", criteria.getEndDate());
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getProvinceId() != null) {
            query.setParameter("provinceId", criteria.getProvinceId());
            queryCount.setParameter("provinceId", criteria.getProvinceId());
        }
        if (StringUtils.isNotEmpty(criteria.getGoodsCode())) {
            query.setParameter("goodsCode", criteria.getGoodsCode());
            queryCount.setParameter("goodsCode", criteria.getGoodsCode());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDTO.class));
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("packageType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("time", new DoubleType());
        query.addScalar("serviceId", new LongType());
        query.addScalar("serviceCode", new StringType());
        query.addScalar("repeatNumber", new LongType());
        query.addScalar("repeatInterval", new DoubleType());
        query.addScalar("isRepeat", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("isPromotion", new LongType());
        query.addScalar("packagePoint", new LongType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("listGoods", new StringType());
        query.addScalar("price",new DoubleType());
//        query.addScalar("updateUser", new LongType());
//        query.addScalar("updateDate", new DateType());
        query.addScalar("isInternal", new LongType());
        query.addScalar("industryCode", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOPackageDetailDTO> getDetailByPackageId(Long idPackage) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("d.AIO_PACKAGE_DETAIL_ID aioPackageDetailId, ")
                .append("d.AIO_PACKAGE_ID aioPackageId, ")
                .append("d.ENGINE_CAPACITY_ID engineCapacityId, ")
                .append("d.ENGINE_CAPACITY_NAME engineCapacityName, ")
                .append("d.QUANTITY_DISCOUNT quantityDiscount, ")
                .append("d.AMOUNT_DISCOUNT amountDiscount, ")
                .append("d.PERCENT_DISCOUNT percentDiscount, ")
                .append("d.GOODS_ID goodsId, ")
                .append("d.GOODS_NAME goodsName, ")
                .append("d.LOCATION_ID locationId, ")
                .append("d.LOCATION_NAME locationName, ")
                .append("d.PERCENT_DISCOUNT_STAFF percentDiscountStaff, ")
                .append("d.PRICE price ")
                //VietNT_08/07/2019_start
                .append(",d.IS_PROVINCE_BOUGHT isProvinceBought ")
                //VietNT_end
                .append("FROM AIO_PACKAGE_DETAIL d ")
                .append("WHERE 1 = 1 ")
                .append("AND d.AIO_PACKAGE_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", idPackage);

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDetailDTO.class));
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("engineCapacityId", new LongType());
        query.addScalar("engineCapacityName", new StringType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("locationId", new LongType());
        query.addScalar("locationName", new StringType());
        query.addScalar("percentDiscountStaff", new DoubleType());
        query.addScalar("price", new DoubleType());
        //VietNT_08/07/2019_start
        query.addScalar("isProvinceBought", new LongType());
        //VietNT_end

        return query.list();
    }

    public List<AIOPackageGoodsDTO> getGoodsByPackageId(Long idPackage) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("AIO_PACKAGE_GOODS_ID aioPackageGoodsId, ")
                .append("AIO_PACKAGE_ID aioPackageId, ")
                .append("AIO_PACKAGE_DETAIL_ID aioPackageDetailId, ")
                .append("GOODS_ID goodsId, ")
                .append("GOODS_CODE goodsCode, ")
                .append("GOODS_NAME goodsName, ")
                .append("GOODS_UNIT_ID goodsUnitId, ")
                .append("GOODS_UNIT_NAME goodsUnitName, ")
                .append("QUANTITY quantity, ")
                .append("GOODS_IS_SERIAL goodsIsSerial, ")
                .append("TYPE type ")
                .append("FROM AIO_PACKAGE_GOODS ")
                .append("WHERE 1 = 1 ")
                .append("AND AIO_PACKAGE_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", idPackage);

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageGoodsDTO.class));
        query.addScalar("aioPackageGoodsId", new LongType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("goodsIsSerial", new LongType());
        query.addScalar("type", new LongType());

        return query.list();
    }

    public List<AIOPackageDetailPriceDTO> getPriceListByPackageId(Long idPackage) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("PACKAGE_DETAIL_PRICE_ID packageDetailPriceId, ")
                .append("PACKAGE_ID packageId, ")
                .append("PACKAGE_DETAIL_ID packageDetailId, ")
                .append("PROVINCE_ID provinceId, ")
                .append("PROVINCE_CODE provinceCode, ")
                .append("PROVINCE_NAME provinceName, ")
                .append("PRICE price ")
                //VietNT_15/07/2019_start
                .append(", DEPARTMENT_ASSIGNMENT departmentAssignment, ")
                .append("PER_DEPARTMENT_ASSIGNMENT perDepartmentAssignment, ")
                .append("TYPE type, ")
                .append("SALES sales, ")
                .append("PERFORMER performer, ")
                .append("STAFF_AIO staffAio, ")
                .append("MANAGER manager ")
                //VietNT_end
                .append("FROM AIO_PACKAGE_DETAIL_PRICE ")
                .append("WHERE 1 = 1 ")
                .append("AND PACKAGE_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", idPackage);

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDetailPriceDTO.class));
        query.addScalar("packageDetailPriceId", new LongType());
        query.addScalar("packageId", new LongType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("price", new DoubleType());
        //VietNT_15/07/2019_start
        query.addScalar("departmentAssignment", new DoubleType());
        query.addScalar("perDepartmentAssignment", new DoubleType());
        query.addScalar("type", new LongType());
        query.addScalar("sales", new DoubleType());
        query.addScalar("performer", new DoubleType());
        query.addScalar("staffAio", new DoubleType());
        query.addScalar("manager", new DoubleType());
        //VietNT_end

        return query.list();
    }

    public List<AIOPackageGoodsAddDTO> getGoodsAddByPackageId(Long idPackage) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("AIO_PACKAGE_GOODS_ADD_ID aioPackageGoodsAddId, ")
                .append("AIO_PACKAGE_ID aioPackageId, ")
                .append("AIO_PACKAGE_DETAIL_ID aioPackageDetailId, ")
                .append("GOODS_ID goodsId, ")
                .append("GOODS_CODE goodsCode, ")
                .append("GOODS_NAME goodsName, ")
                .append("GOODS_UNIT_ID goodsUnitId, ")
                .append("GOODS_UNIT_NAME goodsUnitName, ")
                .append("PRICE price, ")
                .append("GOODS_IS_SERIAL goodsIsSerial ")
                .append("FROM AIO_PACKAGE_GOODS_ADD ")
                .append("WHERE 1 = 1 ")
                .append("AND AIO_PACKAGE_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", idPackage);

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageGoodsAddDTO.class));
        query.addScalar("aioPackageGoodsAddId", new LongType());
        query.addScalar("aioPackageId", new LongType());
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("price", new DoubleType());
        query.addScalar("goodsIsSerial", new LongType());

        return query.list();
    }

    public int countPackageByCode(List<String> codes) {
//        String sql = "select p.AIO_PACKAGE_ID aioPackageId from FROM AIO_PACKAGE p where code in (:code) and status != 0 ";
        String sql = "select count(1) from AIO_PACKAGE where code in (:code) and status != 0 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
//        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDTO.class));
//        query.addScalar("aioPackageId", new LongType());
        query.setParameterList("code", codes);

        return ((BigDecimal) query.uniqueResult()).intValue();
    }

    public List<AppParamDTO> getAppParamList(List<String> type) {
        String sql = "select app_param_id appParamId, name name, par_type parType, code code " +
                "from app_param where par_type in :type and status = 1";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("type", type);
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        query.addScalar("appParamId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("code", new StringType());

        return query.list();
    }

    public List<GoodsDTO> getGoodsList(GoodsDTO criteria) {
        String sql = "select goods_id goodsId, code code, name name, unit_type unitType, unit_type_name unitTypeName, is_serial isSerial " +
                "from goods where is_aio = 1 and status = 1 ";
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "and (upper(code) like upper(:keySearch) escape '&' or upper(name) like upper(:keySearch) escape '&') ";
        }
        // custom field id,id,id,id split for idList
        if (StringUtils.isNotEmpty(criteria.getCustomField())) {
            sql += "and goods_id not in (:idList) ";
        }

        if (StringUtils.isNotEmpty(criteria.getText())) {
            sql += "and goods_id not in (" + criteria.getText() + ") ";
        }

        //VietNT_11/07/2019_start
        // isProvinceBought? la goi tinh mua?
//        if (criteria.getIsSize()) {
        sql += "and code " + (criteria.getIsSize() ? "" : "not") + " like '%&_CN' escape '&' ";
//        }
        //VietNT_end

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (StringUtils.isNotEmpty(criteria.getCustomField())) {
            String[] idList = StringUtils.split(criteria.getCustomField(), ",");
            query.setParameterList("idList", idList);
            queryCount.setParameterList("idList", idList);
        }

        query.setResultTransformer(Transformers.aliasToBean(GoodsDTO.class));
        query.addScalar("goodsId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("unitType", new LongType());
        query.addScalar("unitTypeName", new StringType());
        query.addScalar("isSerial", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public List<AIOConfigServiceDTO> getListService(AIOConfigServiceDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_CONFIG_SERVICE_ID aioConfigServiceId, ")
                .append("CODE code, ")
                .append("NAME name, ")
                .append("TYPE type ")
                .append(", INDUSTRY_CODE industryCode ")
                .append("FROM AIO_CONFIG_SERVICE ")
                .append("WHERE 1=1 ");
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("AND upper(CODE) = upper(:code) ");
        }
        if (criteria.getType() != null) {
            sql.append("AND type = :type ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", criteria.getCode());
        }
        if (criteria.getType() != null) {
            query.setParameter("type", criteria.getType());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        query.addScalar("aioConfigServiceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("industryCode", new StringType());

        return query.list();
    }
}
