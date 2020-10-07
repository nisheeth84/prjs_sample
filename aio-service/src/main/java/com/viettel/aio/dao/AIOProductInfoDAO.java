package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOProductInfoBO;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOCategoryProductPriceDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOProductGoodsDTO;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.aio.dto.AIOProductPriceDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.AppParamDTO;
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

//VietNT_20190701_create
@EnableTransactionManagement
@Transactional
@Repository("aioProductInfoDAO")
public class AIOProductInfoDAO extends BaseFWDAOImpl<AIOProductInfoBO, Long> {

    public AIOProductInfoDAO() {
        this.model = new AIOProductInfoBO();
    }

    public AIOProductInfoDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query,
                                                      SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1)
                    * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOProductInfoDTO> doSearch(AIOProductInfoDTO criteria) {
        String provinceLeftJoinQuery = StringUtils.EMPTY;
        String statusCondition = StringUtils.EMPTY;
        String priceCondition = StringUtils.EMPTY;
        String provinceCondition = StringUtils.EMPTY;
        String groupProductCondition = StringUtils.EMPTY;
        String findByIdCondition = StringUtils.EMPTY;

        if (criteria.getProductInfoId() != null) {
            findByIdCondition = "and PRODUCT_INFO_ID = :productInfoId ";
        }

        if (criteria.getProvinceId() != null || criteria.getPriceMin() != null || criteria.getPriceMax() != null) {
            provinceLeftJoinQuery = "left join AIO_PRODUCT_PRICE pp on p.PRODUCT_INFO_ID = pp.PRODUCT_INFO_ID ";
//					+ "and pp.CAT_PROVINCE_ID = :provinceId ";
            if (criteria.getProvinceId() != null) {
                provinceCondition = "and pp.CAT_PROVINCE_ID = :provinceId ";
            }

            if (criteria.getPriceMin() != null) {
                priceCondition = "and pp.PRICE >= :min ";
            }

            if (criteria.getPriceMax() != null) {
                priceCondition += "and pp.PRICE <= :max ";
            }
        }

        if (criteria.getStatus() != null) {
            if (criteria.getStatus() != 2) {
                statusCondition = "and p.status = :status ";
            }
        } else {
            statusCondition = "and p.status = 1 ";
        }

        if (criteria.getGroupProductId() != null) {
            groupProductCondition = "and p.GROUP_PRODUCT_ID = :groupId ";
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("distinct p.PRODUCT_INFO_ID productInfoId, ")
                .append("p.GROUP_PRODUCT_ID groupProductId, ")
                .append("p.GROUP_PRODUCT_CODE groupProductCode, ")
                .append("p.GROUP_PRODUCT_NAME groupProductName, ")
                .append("p.PRODUCT_CODE productCode, ")
                .append("p.PRODUCT_NAME productName, ")
                .append("p.PRODUCT_INFO productInfo, ")
                .append("p.STATUS status, ")
                .append("p.IS_HIGHLIGHT isHighlight, ")
                .append("p.PRODUCT_PROMOTION productPromotion, ")
                .append("p.CREATED_USER createdUser, ")
                .append("p.CREATED_DATE createdDate, ")
                .append("u.full_name sysUserName, ")
                .append("u.email email ")
                .append("FROM AIO_PRODUCT_INFO p ")
                .append("left join SYS_USER u on u.sys_user_id = p.CREATED_USER ")
                .append(provinceLeftJoinQuery)
                .append("WHERE 1=1 ")
                .append(findByIdCondition)
                .append(priceCondition)
                .append(provinceCondition)
                .append(groupProductCondition)
                .append(statusCondition)
                .append("order by p.PRODUCT_INFO_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(
                "SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getProductInfoId() != null) {
            query.setParameter("productInfoId", criteria.getProductInfoId());
        }

        if (criteria.getProvinceId() != null) {
            query.setParameter("provinceId", criteria.getProvinceId());
            queryCount.setParameter("provinceId", criteria.getProvinceId());
        }

        if (criteria.getPriceMin() != null) {
            query.setParameter("min", criteria.getPriceMin());
            queryCount.setParameter("min", criteria.getPriceMin());
        }

        if (criteria.getPriceMax() != null) {
            query.setParameter("max", criteria.getPriceMax());
            queryCount.setParameter("max", criteria.getPriceMax());
        }

        if (criteria.getStatus() != null && criteria.getStatus() != 2) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }

        if (criteria.getGroupProductId() != null) {
            query.setParameter("groupId", criteria.getGroupProductId());
            queryCount.setParameter("groupId", criteria.getGroupProductId());
        }

        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
        query.addScalar("productInfoId", new LongType());
        query.addScalar("groupProductId", new LongType());
        query.addScalar("groupProductCode", new StringType());
        query.addScalar("groupProductName", new StringType());
        query.addScalar("productCode", new StringType());
        query.addScalar("productName", new StringType());
        query.addScalar("productInfo", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("isHighlight", new LongType());
        query.addScalar("productPromotion", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("email", new StringType());

        if (criteria.getProductInfoId() == null) {
            this.setPageSize(criteria, query, queryCount);
        }

        return query.list();
    }

    public List<AppParamDTO> getDropDownData() {
        String sql = "select cat_province_id id, code code, name name, TRANSLATE ('PROVINCE' USING NCHAR_CS) parType "
                + "from cat_province "
                + "union all "
                + "select CATEGORY_PRODUCT_ID id, code code, name name, TRANSLATE ('GOODS_GROUP' USING NCHAR_CS) parType "
                + "from AIO_CATEGORY_PRODUCT where status = 1 "
                + "order by parType, code ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        // query.addScalar("text", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));

        return query.list();
    }

    public boolean isProductExist(String code) {
        String sql = "SELECT PRODUCT_INFO_ID id FROM AIO_PRODUCT_INFO WHERE upper(PRODUCT_CODE) = upper(:code) "
                + "and status = 1 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("id", new LongType());
        query.setParameter("code", code);

        List list = query.list();
        return (list != null && !list.isEmpty());
    }

    public AIOProductInfoDTO findById(Long id) {
        AIOProductInfoDTO criteria = new AIOProductInfoDTO();
        criteria.setProductInfoId(id);
        criteria.setStatus(2L);
        List<AIOProductInfoDTO> list = this.doSearch(criteria);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<AIOProductPriceDTO> getListPriceByProductId(Long id) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("PRODUCT_PRICE_ID productPriceId, ")
                .append("PRODUCT_INFO_ID productInfoId, ")
                .append("CAT_PROVINCE_ID provinceId, ")
                .append("PROVINCE_CODE provinceCode, ")
                .append("PROVINCE_NAME provinceName, ").append("PRICE price ")
                .append("from AIO_PRODUCT_PRICE ")
                .append("where PRODUCT_INFO_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductPriceDTO.class));
        query.addScalar("productPriceId", new LongType());
        query.addScalar("productInfoId", new LongType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("provinceName", new StringType());
        query.addScalar("price", new DoubleType());

        query.setParameter("id", id);

        return query.list();
    }

    public int disableProduct(Long id) {
        String sql = "update AIO_PRODUCT_INFO set STATUS = 0 where PRODUCT_INFO_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    // mobile thangtv24 start 040719
    // Lấy hang muc
    public List<AIOProductInfoDTO> getDataGroupProduct() {
        StringBuilder sql = new StringBuilder("SELECT DISTINCT "
                + "a1.group_product_id groupProductId,"
                + "a1.group_product_code groupProductCode,"
                + "a1.group_product_name groupProductName "
                + "FROM aio_product_info a1 ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("groupProductId", new LongType());
        query.addScalar("groupProductCode", new StringType());
        query.addScalar("groupProductName", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
        return query.list();
    }

    // tra cuu thong tin san pham
    public List<AIOProductInfoDTO> doSeachInfoProduct(
            AIOProductInfoDTO aioProductInfoDTO) {
        StringBuilder sql = new StringBuilder(
                "SELECT "
                        + "a1.product_code productCode,"
                        + "a1.product_name productName,"
                        + "p1.price price,"
                        + "a1.product_info productInfo,"
                        + "a1.product_info_id productInfoId "
                        //VietNT_25/07/2019_start
                        + ", p1.CAT_PROVINCE_ID provinceId "
                        //VietNT_end
                        + "FROM aio_product_info a1 inner join  aio_product_price p1 on a1.product_info_id = p1.product_info_id "
                        + "where 1=1 "
                        + "and a1.status != 0 ");
        if (aioProductInfoDTO.getCatProvinceId() != 0L) {
            sql.append("and p1.cat_province_id = :catProvinceId ");
        }

        if (aioProductInfoDTO.getGroupProductId() != 0L) {
            sql.append("and a1.group_product_id = :groupProductId ");
        }

        if (aioProductInfoDTO.getPriceMin() != null
                && aioProductInfoDTO.getPriceMin() != 0L) {
            sql.append("and p1.price >= :minPrice ");
        }

        if (aioProductInfoDTO.getPriceMax() != null
                && aioProductInfoDTO.getPriceMax() != 0L) {
            sql.append("and p1.price <= :maxPrice ");
        }
        if (StringUtils.isNotEmpty(aioProductInfoDTO.getProductName())) {
            sql.append("and upper(a1.product_name) like upper(:productName) escape '&' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("productCode", new StringType());
        query.addScalar("productName", new StringType());
        query.addScalar("productInfo", new StringType());
        query.addScalar("productInfoId", new LongType());
        query.addScalar("provinceId", new LongType());

        query.addScalar("price", new DoubleType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
        if (aioProductInfoDTO.getCatProvinceId() != 0L) {
            query.setParameter("catProvinceId",
                    aioProductInfoDTO.getCatProvinceId());
        }

        if (aioProductInfoDTO.getGroupProductId() != 0L) {
            query.setParameter("groupProductId",
                    aioProductInfoDTO.getGroupProductId());
        }

        if (aioProductInfoDTO.getPriceMin() != null
                && aioProductInfoDTO.getPriceMin() != 0L) {
            query.setParameter("minPrice", aioProductInfoDTO.getPriceMin());
        }

        if (aioProductInfoDTO.getPriceMax() != null
                && aioProductInfoDTO.getPriceMax() != 0L) {
            query.setParameter("maxPrice", aioProductInfoDTO.getPriceMax());
        }
        if (StringUtils.isNotEmpty(aioProductInfoDTO.getProductName())) {
            query.setParameter("productName", "%" + aioProductInfoDTO.getProductName() + "%");
        }

        return query.list();
    }

    //VietNT_25/07/2019_start
    public Double getAmountStockProduct(Long productId, Long provinceId) {
        String groupCondition = StringUtils.EMPTY;
        if (provinceId != null) {
            groupCondition = "sys_group_id in (SELECT s.sys_group_id FROM sys_group s WHERE s.group_level = 2 AND s.province_id = :provinceId) ";
        }
        String sql = "SELECT nvl(SUM(sum_amount),0) amountStock " +
                "FROM aio_stock_report " +
                "WHERE 1=1 " +
                groupCondition +
                "AND goods_code in (select goods_code from aio_product_goods where product_info_id = :productId) ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("amountStock", new DoubleType());
        if (provinceId != null) {
            query.setParameter("provinceId", provinceId);
        }
        query.setParameter("productId", productId);

        return (Double) query.uniqueResult();
    }

    public List<AIOProductGoodsDTO> getProductGoods(Long productId) {
        String sql = "SELECT " +
                "GOODS_ID goodsId , " +
                "GOODS_CODE goodsCode, " +
                "GOODS_NAME goodsName " +
                "from AIO_PRODUCT_GOODS where PRODUCT_INFO_ID = :productInfoId ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("productInfoId", productId);
        query.setResultTransformer(Transformers.aliasToBean(AIOProductGoodsDTO.class));
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());

        return query.list();
    }

    public int deleteProductGoods(Long productId) {
        String sql = "DELETE FROM AIO_PRODUCT_GOODS WHERE PRODUCT_INFO_ID = :productInfoId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("productInfoId", productId);

        return query.executeUpdate();
    }
    //VietNT_end

    public List<AIOProductInfoDTO> getProducts(AIOProductInfoDTO criteria) {
        String sql = "WITH a AS (SELECT PRODUCT_INFO_ID, max(price) price FROM AIO_PRODUCT_PRICE GROUP BY PRODUCT_INFO_ID ORDER BY PRODUCT_INFO_ID desc, price desc) " +
                "select " +
                "p.PRODUCT_INFO_ID productInfoId, " +
//				"p.GROUP_PRODUCT_ID groupProductId, " +
//				"p.GROUP_PRODUCT_CODE groupProductCode, " +
//				"p.GROUP_PRODUCT_NAME groupProductName, " +
                "p.PRODUCT_CODE productCode, " +
                "p.PRODUCT_NAME productName, " +
                "p.PRODUCT_INFO productInfo, " +
//				"p.STATUS status, " +
//				"p.CREATED_USER createdUser, " +
//				"p.CREATED_DATE createdDate, " +
                "p.IS_HIGHLIGHT isHighlight, " +
                "p.PRODUCT_PROMOTION productPromotion " +
                ", a.price " +
                "from aio_product_info p " +
                "LEFT JOIN a ON a.PRODUCT_INFO_ID = p.PRODUCT_INFO_ID " +
                "where 1=1 " +
                "and status = 1 ";
        if (criteria.getIsHighlight() != null) {
            sql += "and IS_HIGHLIGHT = 1 ";
        }
        if (criteria.getGroupProductId() != null) {
            sql += "and GROUP_PRODUCT_ID = :groupProductId ";
        }
        if (criteria.getProductInfoId() != null) {
            sql += "and p.PRODUCT_INFO_ID = :productInfoId ";
        }

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOProductInfoDTO.class));
        query.addScalar("productInfoId", new LongType());
        query.addScalar("productCode", new StringType());
        query.addScalar("productName", new StringType());
        query.addScalar("productInfo", new StringType());
        query.addScalar("isHighlight", new LongType());
        query.addScalar("productPromotion", new StringType());
        query.addScalar("price", new DoubleType());

        if (criteria.getGroupProductId() != null) {
            query.setParameter("groupProductId", criteria.getGroupProductId());
        }
        if (criteria.getProductInfoId() != null) {
            query.setParameter("productInfoId", criteria.getProductInfoId());
        }

        return query.list();
    }

    public List<AIOPackageDetailDTO> getPackageFromProduct(Long idProduct) {
        String sql = "select " +
                "pg.AIO_PACKAGE_DETAIL_ID aioPackageDetailId, " +
                "p.SERVICE_CODE serviceCode " +
                "from AIO_PACKAGE_GOODS pg " +
                "LEFT JOIN AIO_PACKAGE p ON p.AIO_PACKAGE_ID = pg.AIO_PACKAGE_ID " +
                "where goods_code in " +
                "(select goods_code from AIO_PRODUCT_GOODS where PRODUCT_INFO_ID = :idProduct) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.addScalar("aioPackageDetailId", new LongType());
        query.addScalar("serviceCode", new StringType());
        query.setParameter("idProduct", idProduct);
        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDetailDTO.class));

        return query.list();
    }

    public List<AIOProductInfoDTO> getAmountStockEachGroup(Long productId) {
        String sql = "SELECT " +
                "SUBSTR(code, 1, INSTR(code, '-') - 1) sysGroupCode, " +
                "nvl(SUM(sum_amount),0) amountStock " +
                "FROM AIO_STOCK_REPORT " +
                "WHERE 1=1 " +
                "AND goods_code in (select goods_code from aio_product_goods where product_info_id = :productId) " +
                "GROUP BY CODE ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOProductInfoDTO.class));
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("amountStock", new DoubleType());
        query.setParameter("productId", productId);

        return query.list();
    }

    public AIOProductInfoDTO getById(Long id) {
        AIOProductInfoDTO criteria = new AIOProductInfoDTO();
        criteria.setProductInfoId(id);
        List<AIOProductInfoDTO> list = this.getProducts(criteria);

        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    //tatph - start - 10/12/2019
    public List<AIOCategoryProductDTO> getCategory() {
        StringBuilder sql = new StringBuilder("SELECT DISTINCT ")
                .append("T1.CATEGORY_PRODUCT_ID categoryProductId, ")
                .append("T1.CODE code, ")
                .append("T1.NAME name ")
                .append("from AIO_CATEGORY_PRODUCT T1 WHERE T1.STATUS != 0 ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOCategoryProductDTO.class));
        query.addScalar("categoryProductId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());

        return query.list();
    }


    public List<AIOProductInfoDTO> getHightLightProduct(AIOProductInfoDTO aioProductInfoDTO) {
        StringBuilder sql = this.createQueryProduct().append(" AND IS_HIGHLIGHT = 1 ");
        if (aioProductInfoDTO.getKeySearch() != null && !"".equals(aioProductInfoDTO.getKeySearch())) {
            sql.append(" AND  (UPPER(T1.PRODUCT_NAME) like UPPER(:keySearch) escape '&') ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
      this.addScalarQueryProduct(query);
        if (aioProductInfoDTO.getKeySearch() != null && !"".equals(aioProductInfoDTO.getKeySearch())) {
            query.setParameter("keySearch", "%" + aioProductInfoDTO.getKeySearch() + "%");
        }

        return query.list();
    }

    public List<AIOProductInfoDTO> doSearchProductInfo(AIOProductInfoDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder("select count (product_info_id) countByProvinceCode");
        stringBuilder.append(" , province_code provinceCode ");
        stringBuilder.append(" from AIO_PRODUCT_PRICE ");
        stringBuilder.append(" where product_info_id = :productInfoId group by province_code ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(stringBuilder.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("provinceCode", new StringType());
        query.addScalar("countByProvinceCode", new LongType());

        if (null != criteria.getProductInfoId()) {
            query.setParameter("productInfoId", criteria.getProductInfoId());
            queryCount.setParameter("productInfoId", criteria.getProductInfoId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOProductInfoDTO.class));
        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public List<AIOProductInfoDTO> getProductByCategory(AIOProductInfoDTO aioProductInfoDTO) {
        StringBuilder sql = this.createQueryProduct();
        if (aioProductInfoDTO.getGroupProductId() != null) {
            sql.append(" AND T1.GROUP_PRODUCT_ID = :groupProductId ");
        }
        if (aioProductInfoDTO.getValueFrom() != null && aioProductInfoDTO.getValueTo() == null) {
            sql.append(" AND (SELECT MAX(PRICE) FROM AIO_PRODUCT_PRICE WHERE PRODUCT_INFO_ID = T1.PRODUCT_INFO_ID) < :valueFrom ");
        }
        if (aioProductInfoDTO.getValueFrom() == null && aioProductInfoDTO.getValueTo() != null) {
            sql.append(" AND (SELECT MAX(PRICE) FROM AIO_PRODUCT_PRICE WHERE PRODUCT_INFO_ID = T1.PRODUCT_INFO_ID) > :valueTo ");
        }
        if (aioProductInfoDTO.getValueFrom() != null && aioProductInfoDTO.getValueTo() != null) {
            sql.append(" AND (SELECT MAX(PRICE) FROM AIO_PRODUCT_PRICE WHERE PRODUCT_INFO_ID = T1.PRODUCT_INFO_ID) >= :valueFrom ");
            sql.append(" AND (SELECT MAX(PRICE) FROM AIO_PRODUCT_PRICE WHERE PRODUCT_INFO_ID = T1.PRODUCT_INFO_ID) <= :valueTo ");
        }
        if (aioProductInfoDTO.getFilter() != null) {
            if ("1".equals(aioProductInfoDTO.getFilter())) {
                sql.append(" AND T1.IS_HIGHLIGHT = 1 ");
            }
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
        this.addScalarQueryProduct(query);
        if (aioProductInfoDTO.getGroupProductId() != null) {
            query.setParameter("groupProductId", aioProductInfoDTO.getGroupProductId());
        }
        if (aioProductInfoDTO.getValueFrom() != null && aioProductInfoDTO.getValueTo() == null) {
            query.setParameter("valueFrom", aioProductInfoDTO.getValueFrom());
        }
        if (aioProductInfoDTO.getValueFrom() == null && aioProductInfoDTO.getValueTo() != null) {
            query.setParameter("valueTo", aioProductInfoDTO.getValueTo());
        }
        if (aioProductInfoDTO.getValueFrom() != null && aioProductInfoDTO.getValueTo() != null) {
            query.setParameter("valueTo", aioProductInfoDTO.getValueTo());
            query.setParameter("valueFrom", aioProductInfoDTO.getValueFrom());
        }

        return query.list();
    }

    public List<AIOProductInfoDTO> getProductById(AIOProductInfoDTO aioProductInfoDTO) {
        StringBuilder sql = this.createQueryProduct();
        if (aioProductInfoDTO.getProductInfoId() != null) {
            sql.append(" AND T1.PRODUCT_INFO_ID = :productInfoId");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOProductInfoDTO.class));
        this.addScalarQueryProduct(query);
        if (aioProductInfoDTO.getProductInfoId() != null) {
            query.setParameter("productInfoId", aioProductInfoDTO.getProductInfoId());
        }

        return query.list();
    }

    public List<AIOCategoryProductPriceDTO> getDaiGia(AIOCategoryProductDTO aioProductInfoDTO) {
        StringBuilder sql = new StringBuilder("SELECT  ")
                .append("T1.AIO_CATEGORY_PRODUCT_PRICE_ID aioCategoryProductPriceId, ")
                .append("T1.AIO_CATEGORY_PRODUCT_ID aioCategoryProductId, ")
                .append("T1.TYPE type, ")
                .append("T1.VALUE_TO valueTo, ")
                .append("T1.VALUE_FROM valueFrom ")
                .append("from AIO_CATEGORY_PRODUCT_PRICE T1 ")
                .append(" WHERE 1 = 1 ");
        if (aioProductInfoDTO.getCategoryProductId() != null) {
            sql.append(" AND T1.AIO_CATEGORY_PRODUCT_ID = :aioCategoryProductId");
        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOCategoryProductPriceDTO.class));
        query.addScalar("aioCategoryProductPriceId", new LongType());
        query.addScalar("aioCategoryProductId", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("valueTo", new LongType());
        query.addScalar("valueFrom", new LongType());
        if (aioProductInfoDTO.getCategoryProductId() != null) {
            query.setParameter("aioCategoryProductId", aioProductInfoDTO.getCategoryProductId());
        }
        return query.list();
    }

    public StringBuilder createQueryProduct() {
    	 StringBuilder sql = new StringBuilder("SELECT  ")
                 .append("T1.PRODUCT_INFO_ID productInfoId, ")
                 .append("T1.GROUP_PRODUCT_ID groupProductId, ")
                 .append("T1.GROUP_PRODUCT_CODE groupProductCode, ")
                 .append("T1.GROUP_PRODUCT_NAME groupProductName, ")
                 .append("T1.PRODUCT_CODE productCode, ")
                 .append("T1.PRODUCT_NAME productName, ")
                 .append("T1.PRODUCT_INFO productInfo, ")
                 .append("T1.PRODUCT_PROMOTION productPromotion, ")
                 .append(" (SELECT MAX(PRICE) FROM AIO_PRODUCT_PRICE WHERE PRODUCT_INFO_ID = T1.PRODUCT_INFO_ID) price ")
                 .append("from AIO_PRODUCT_INFO T1 ")
                 .append(" WHERE 1 = 1 AND T1.STATUS != 0 ");
    	 return sql;
    }
    public SQLQuery addScalarQueryProduct(SQLQuery query) {
    	 query.addScalar("productInfoId", new LongType());
         query.addScalar("groupProductId", new LongType());
         query.addScalar("groupProductCode", new StringType());
         query.addScalar("groupProductName", new StringType());
         query.addScalar("productCode", new StringType());
         query.addScalar("productName", new StringType());
         query.addScalar("productInfo", new StringType());
         query.addScalar("productPromotion", new StringType());
         query.addScalar("price", new DoubleType());
         return query;
    }
    @SuppressWarnings("unchecked")
   	public List<AIOProductInfoDTO> autoSearchProduct(String keySearch){
       	StringBuilder sql = new StringBuilder("SELECT ")
       	.append(" T1.PRODUCT_INFO_ID productInfoId,")
       	.append(" T1.PRODUCT_CODE productCode, ")
       	.append(" T1.PRODUCT_NAME productName ")
       	.append(" from AIO_PRODUCT_INFO T1 ")
       	.append(" join AIO_CATEGORY_PRODUCT T2 on T1.GROUP_PRODUCT_ID = T2.CATEGORY_PRODUCT_ID")
       	.append(" WHERE T1.STATUS != 0 AND T2.STATUS != 0 AND ROWNUM < 11 ");
       	if(StringUtils.isNotBlank(keySearch)){
       		sql.append("AND (upper(T1.PRODUCT_CODE) LIKE upper(:keySearch) OR upper(T1.PRODUCT_NAME) LIKE upper(:keySearch)) ");
       	}
       	SQLQuery query = getSession().createSQLQuery(sql.toString());
       	query.addScalar("productInfoId", new LongType());
       	query.addScalar("productCode", new StringType());
       	query.addScalar("productName", new StringType());
       	query.setResultTransformer(Transformers.aliasToBean(AIOProductInfoDTO.class));
       	if(StringUtils.isNotBlank(keySearch)){
       		query.setParameter("keySearch", "%" + keySearch + "%");
       	}
       	return query.list();
       }
       
    //tatph - end - 10/12/2019

    public List<AIOProductInfoDTO> getProductStockRemain(AIOProductInfoDTO criteria) {
        String sql = "SELECT " +
                "CASE WHEN ((SELECT count(*) FROM (select goods_code from aio_product_goods where product_info_id = :productId)) > 1) " +
                    "then CEIL(nvl(SUM(r.sum_amount),0)/(SELECT count(*) FROM (select goods_code from aio_product_goods where product_info_id = :productId))) " +
                    "ELSE nvl(SUM(r.sum_amount),0) " +
                "END countByProvinceCode, " +
                "s.province_code provinceCode " +
                "FROM aio_stock_report r " +
                "LEFT JOIN sys_group s ON s.sys_group_id = r.sys_group_id AND s.group_level = 2 " +
                "WHERE 1=1 " +
                "AND r.goods_code in (select goods_code from aio_product_goods where product_info_id = :productId) " +
                "GROUP BY s.province_code " +
                "ORDER BY s.province_code ";

        SQLQuery query = getSession().createSQLQuery(sql);
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");
        query.addScalar("provinceCode", new StringType());
        query.addScalar("countByProvinceCode", new LongType());

        query.setParameter("productId", criteria.getProductInfoId());
        queryCount.setParameter("productId", criteria.getProductInfoId());

        query.setResultTransformer(Transformers.aliasToBean(AIOProductInfoDTO.class));
        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }
}
