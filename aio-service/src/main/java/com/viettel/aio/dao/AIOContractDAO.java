package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.dto.AIOAcceptanceRecordsDTO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIOPackageGoodsDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

//VietNT_20190313_create
@EnableTransactionManagement
@Transactional
@Repository("aioContractDAO")
public class AIOContractDAO extends BaseFWDAOImpl<AIOContractBO, Long> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOContractDAO.class);

    public AIOContractDAO() {
        this.model = new AIOContractBO();
    }

    public AIOContractDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOContractDTO> doSearch(AIOContractDTO criteria, List<String> idList) {
//    	String conditionExcelExport = StringUtils.EMPTY;
//    	String fieldExcelExport = StringUtils.EMPTY;
//    	String joinExcelExport = StringUtils.EMPTY;
//    	if (StringUtils.isNotEmpty(criteria.getCustomField()) && criteria.getCustomField().equals("excel")) {
//    	    conditionExcelExport = "with a as " +
//                    "(select contract_id, sum(amount) sum_amount, sum(DISCOUNT_STAFF) sum_discount " +
//                    "from AIO_ACCEPTANCE_RECORDS ar group by contract_id) ";
//    	    fieldExcelExport = "a.sum_amount sumAmount, " +
//                    "a.sum_discount sumDiscountStaff, " +
//                    "c.seller_name sellerName, ";
//    	    joinExcelExport = "left join a on c.contract_id = a.contract_id ";
//        }

        // query by end date AR
        boolean queryEndDate = false;
        String conditionEndDate = StringUtils.EMPTY;
        String joinAR = StringUtils.EMPTY;
        String tempTable = StringUtils.EMPTY;

        if (criteria.getEndDateFrom() != null) {
            conditionEndDate = "AND trunc(:dateFromAR) <= trunc(a.END_DATE) ";
            queryEndDate = true;
        }
        if (criteria.getEndDateTo() != null) {
            conditionEndDate += "AND trunc(:dateToAR) >= trunc(a.END_DATE) ";
            queryEndDate = true;
        }
        if (queryEndDate) {
            tempTable = "with a as " +
                    "(select contract_id, max(end_date) end_date " +
                    "from AIO_ACCEPTANCE_RECORDS ar group by contract_id) ";
            joinAR = "left join a on c.contract_id = a.contract_id ";
        }

//        StringBuilder sql = new StringBuilder(conditionExcelExport)
        StringBuilder sql = new StringBuilder(tempTable)
                .append("SELECT ")
                .append("c.CONTRACT_ID contractId, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("c.CONTRACT_CONTENT contractContent, ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("c.CUSTOMER_CODE customerCode, ")
                .append("c.CUSTOMER_NAME customerName, ")
                .append("c.CUSTOMER_PHONE customerPhone, ")
                .append("c.CUSTOMER_ADDRESS customerAddress, ")
                .append("c.CUSTOMER_TAX_CODE customerTaxCode, ")
                .append("c.DESCRIPTION description, ")
                .append("c.PERFORMER_ID performerId, ")
                //VietNT_20190409_start
                .append("c.PERFORMER_NAME performerName, ")
                .append("c.PERFORMER_CODE performerCode, ")
                .append("c.CAT_PROVINCE_ID catProvinceId, ")
                //VietNT_end
                .append("c.STATUS status, ")
                .append("c.TYPE type, ")
                .append("c.CREATED_DATE createdDate, ")
                ////VietNT_20190416_start
                .append("c.CREATED_USER createdUser, ")
                //VietNT_end
                .append("to_char(c.CREATED_DATE, 'HH24:MI') createdDateStr, ")
//                .append(fieldExcelExport)

                .append("(SELECT WORK_NAME FROM AIO_CONTRACT_DETAIL WHERE CONTRACT_ID = c.CONTRACT_ID AND ROWNUM = 1) workName, ")
                .append("(select min(start_date) from aio_contract_detail where contract_id = c.contract_id) startDate, ")
                .append("(select max(end_date) from aio_contract_detail where contract_id = c.contract_id) endDate ")

//                .append("su.FULL_NAME performerName ")

                .append("FROM AIO_CONTRACT c ")
//                .append("LEFT JOIN SYS_USER su on su.sys_user_id = c.PERFORMER_ID ")
                .append(joinAR)
//                .append(joinExcelExport)
                .append("WHERE 1 = 1 ")
                .append("and (c.CREATED_GROUP_ID in (:idList) or c.PERFORMER_GROUP_ID in (:idList)) ")
                .append(conditionEndDate);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(c.CUSTOMER_PHONE) like upper(:keySearch) ");
            sql.append("OR upper(c.CUSTOMER_NAME) like upper(:keySearch) ");
            sql.append("OR upper(c.CUSTOMER_ADDRESS) like upper(:keySearch) ");
            sql.append("OR upper(c.CONTRACT_CODE) like upper(:keySearch) escape '&') ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("AND trunc(:dateFrom) <= trunc(c.CREATED_DATE) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append("AND trunc(:dateTo) >= trunc(c.CREATED_DATE) ");
        }
        if (criteria.getStatus() != null) {
            sql.append("AND c.status = :status ");
        } else {
            sql.append("AND c.status != 4 ");
        }

        sql.append("ORDER BY c.CONTRACT_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setParameterList("idList", idList);
        queryCount.setParameterList("idList", idList);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("dateFrom", criteria.getStartDate());
            queryCount.setParameter("dateFrom", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("dateTo", criteria.getEndDate());
            queryCount.setParameter("dateTo", criteria.getEndDate());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getEndDateFrom() != null) {
            query.setParameter("dateFromAR", criteria.getEndDateFrom());
            queryCount.setParameter("dateFromAR", criteria.getEndDateFrom());
        }
        if (criteria.getEndDateTo() != null) {
            query.setParameter("dateToAR", criteria.getEndDateTo());
            queryCount.setParameter("dateToAR", criteria.getEndDateTo());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("contractContent", new StringType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerTaxCode", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDateStr", new StringType());

//        query.addScalar("contractDetailId", new LongType());
        query.addScalar("workName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());

        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("catProvinceId", new LongType());
//        if (StringUtils.isNotEmpty(criteria.getCustomField()) && criteria.getCustomField().equals("excel")) {
//            query.addScalar("sumAmount", new DoubleType());
//            query.addScalar("sumDiscountStaff", new DoubleType());
//            query.addScalar("sellerName", new StringType());
//        }

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    private StringBuilder buildQueryGetContractDetail() {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("cd.CONTRACT_DETAIL_ID contractDetailId, ")
                .append("cd.CONTRACT_ID contractId, ")
                .append("cd.WORK_NAME workName, ")
                .append("cd.PACKAGE_ID packageId, ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("cd.PACKAGE_DETAIL_ID packageDetailId, ")
                .append("cd.ENGINE_CAPACITY_ID engineCapacityId, ")
                .append("cd.ENGINE_CAPACITY_NAME engineCapacityName, ")
                .append("cd.GOODS_ID goodsId, ")
                .append("cd.GOODS_NAME goodsName, ")
                .append("cd.QUANTITY quantity, ")
                .append("cd.AMOUNT amount, ")
                .append("cd.START_DATE startDate, ")
                .append("cd.END_DATE endDate,")
                .append("cd.STATUS status, ")
                .append("cd.IS_BILL isBill, ")
                //VietNT_20190522_start
                .append("cd.IS_PROVINCE_BOUGHT isProvinceBought, ")
                //VietNT_end
                //VietNT_28/06/2019_start
                .append("cd.SALE_CHANNEL saleChannel, ")
                //VietNT_end
                .append("pd.LOCATION_NAME locationName, ")
//                .append("pr.PRICE price, ")
                .append("pd.QUANTITY_DISCOUNT quantityDiscount, ")
                .append("pd.AMOUNT_DISCOUNT amountDiscount, ")
                .append("pd.PERCENT_DISCOUNT percentDiscount, ")
                .append("ar.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, ")
                //VietNT_20190418_start
                .append("cd.IS_REPEAT isRepeat, ")
                .append("p.REPEAT_NUMBER repeatNumber, ")
                .append("p.REPEAT_INTERVAL repeatInterval, ")
                //VietNT_end
                .append("p.time time ")
                .append(", cd.CUSTOMER_NAME customerName, ")
                .append("cd.CUSTOMER_ADDRESS customerAddress, ")
                .append("cd.TAX_CODE taxCode ")
                //VietNT_29/06/2019_start
                // combine goodsCodes into 1 string
                .append(", (select listagg(GOODS_CODE, ', ' ) within group (order by AIO_PACKAGE_DETAIL_ID) " +
                        "from aio_package_Goods where AIO_PACKAGE_DETAIL_ID = pd.AIO_PACKAGE_DETAIL_ID " +
                        "group by AIO_PACKAGE_DETAIL_ID) customField ")
                //VietNT_end
                .append(", PROMO.MONEY money ")
                .append(", promo.TYPE type ")
                .append("FROM AIO_CONTRACT_DETAIL cd ")
                .append("left join AIO_PACKAGE_DETAIL pd on pd.AIO_PACKAGE_DETAIL_ID = cd.PACKAGE_DETAIL_ID ")
                .append("left join AIO_PACKAGE p on p.AIO_PACKAGE_ID = cd.PACKAGE_ID ")
                .append("left join AIO_ACCEPTANCE_RECORDS ar on (cd.contract_detail_id = ar.contract_detail_id) ")
                .append("LEFT JOIN AIO_PACKAGE_PROMOTION promo ON " +
                        "promo.PACKAGE_DETAIL_ID = pd.AIO_PACKAGE_DETAIL_ID " +
                        "AND promo.TYPE IN (1,2) " +
                        "AND promo.MONEY is NOT NULL ")
//                .append("join AIO_PACKAGE_DETAIL_PRICE pr on pd.AIO_PACKAGE_DETAIL_ID = pr.PACKAGE_DETAIL_ID ")
                .append("WHERE cd.CONTRACT_ID = :contractId ");

        return sql;
    }

    public List<AIOContractDetailDTO> getContractDetailByContractId(Long contractId) {
        StringBuilder sql = this.buildQueryGetContractDetail();
        sql.append("AND cd.AMOUNT > 0 ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDetailDTO.class));
        query.setParameter("contractId", contractId);

        this.addScalarQueryGetContractDetail(query);

        return query.list();
    }

    public List<AIOContractDetailDTO> getContractDetailByContractIdWithRepeat(Long contractId) {
        StringBuilder sql = this.buildQueryGetContractDetail();

        sql.append("order by cd.CONTRACT_DETAIL_ID, cd.PACKAGE_DETAIL_ID ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDetailDTO.class));
        query.setParameter("contractId", contractId);

        this.addScalarQueryGetContractDetail(query);

        return query.list();
    }

    private void addScalarQueryGetContractDetail(SQLQuery query) {
        query.addScalar("contractDetailId", new LongType());
        query.addScalar("contractId", new LongType());
        query.addScalar("workName", new StringType());
        query.addScalar("packageId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("packageDetailId", new LongType());
        query.addScalar("engineCapacityId", new LongType());
        query.addScalar("engineCapacityName", new StringType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("status", new LongType());
        query.addScalar("isBill", new LongType());
        query.addScalar("locationName", new StringType());
        query.addScalar("acceptanceRecordsId", new LongType());
//        query.addScalar("price", new DoubleType());
        query.addScalar("time", new DoubleType());
        //VietNT_20190418_start
        query.addScalar("isRepeat", new LongType());
        query.addScalar("repeatNumber", new LongType());
        query.addScalar("repeatInterval", new DoubleType());
        //VietNT_end
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("quantityDiscount", new DoubleType());
        query.addScalar("amountDiscount", new DoubleType());
        query.addScalar("percentDiscount", new DoubleType());
        query.addScalar("isProvinceBought", new LongType());
        //VietNT_28/06/2019_start
        query.addScalar("saleChannel", new StringType());
        //VietNT_end
        //VietNT_29/06/2019_start
        query.addScalar("customField", new StringType());
        //VietNT_end
        query.addScalar("money", new DoubleType());
        query.addScalar("type", new LongType());
    }

    public Long getNextContractCodeId() {
        String sql = "SELECT AIO_CONTRACT_SEQ.nextval from dual ";
        SQLQuery query = this.getSession().createSQLQuery(sql);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public Long getLastestSeqNumber() {
//        String sql = "SELECT MAX(CONTRACT_ID) FROM AIO_CONTRACT ";
        String sql = "SELECT last_number FROM user_sequences WHERE sequence_name = 'AIO_CONTRACT_SEQ' ";
        SQLQuery query = this.getSession().createSQLQuery(sql);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public List<AIOConfigServiceDTO> getDropDownData() {
        StringBuilder sql = new StringBuilder()
                .append("select app_param_id id, code code, name name, PAR_TYPE parType, null text, NULL industryCode " +
                        "from app_param where par_type in ('AREA','SPECIES','LIST_CONTRACT_OUTOFDATE') ")
                .append("union all ")
                .append("select AIO_CONFIG_SERVICE_Id id, code code, TRANSLATE (type USING NCHAR_CS) name, TRANSLATE ('SERVICE' USING NCHAR_CS) parType, CAST(STATUS AS NVARCHAR2(50)) text, industry_Code industryCode " +
                        "from aio_config_service ")
                .append("union all ")
                .append("select cat_province_id id, code code, area_code name, TRANSLATE ('PROVINCE' USING NCHAR_CS) parType, code || ' - ' || name text, NULL industryCode " +
                        "from cat_province ")
                .append("union all ")
                .append("select area_id id, code code, name name, TRANSLATE ('AIO_AREA' USING NCHAR_CS) parType, CAST(province_id AS NVARCHAR2(50)) text, NULL industryCode " +
                        "from aio_area where area_level = 2 ")
                .append("order by code ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("industryCode", new StringType());
        return query.list();
    }

    public Long getUserSysGroupLevel2(Long sysGroupId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("(case ")
                .append("when sg.group_level = 0 then (0) ")
                .append("when sg.group_level = 1 then (sg.sys_group_id) ")
                .append("else TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 3) - (INSTR(sg.path, '/', 1, 2) + 1)))) end) groupLv2 ")
                .append("from sys_Group sg ")
                .append("where sg.sys_group_id = :sysGroupId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("sysGroupId", sysGroupId);
        query.addScalar("groupLv2", new LongType());

        return (Long) query.uniqueResult();
    }

    public Long getUserSysGroupLevel2ByUserId(Long sysUserId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("(case ")
                .append("when sg.group_level = 0 then (0) ")
                .append("when sg.group_level = 1 then (sg.sys_group_id) ")
                .append("else TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 3) - (INSTR(sg.path, '/', 1, 2) + 1)))) end) groupLv2 ")
                .append("from sys_Group sg ")
                .append("where sg.sys_group_id = (select sys_group_id from sys_user where sys_user_id = :sysUserId) ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("groupLv2", new LongType());

        return (Long) query.uniqueResult();
    }

    public List<AIOLocationUserDTO> getUsersInRange(AIOContractDTO criteria) {
        String conditionBorder = StringUtils.EMPTY;
        if (criteria.getLatRange() != null && criteria.getLngRange() != null) {
            conditionBorder = "and (l.lat >= :minLat and l.lat <= :maxLat and l.lng >= :minLng and l.lng <= :maxLng) ";
        }
        String conditionStatus = StringUtils.EMPTY;
        if (criteria.getStatus() != null) {
            conditionStatus = "AND l.STATUS = :status ";
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("l.LOCATION_USER_ID locationUserId, ")
                .append("l.CREATED_DATE createdDate, ")
                .append("l.SYS_USER_ID sysUserId, ")
                .append("su.full_name sysUserName, ")
                .append("su.EMPLOYEE_CODE text, ")
                .append("su.email email, ")
                .append("su.phone_number phoneNumber, ")
                .append("l.LAT lat, ")
                .append("l.LNG lng, ")
                .append("l.STATUS status ")
                .append("FROM AIO_LOCATION_USER l ")
                .append("left join sys_user su on su.sys_user_id = l.sys_user_id ")
                .append("WHERE 1=1 ")
                .append("and trunc(l.created_date) = trunc(sysdate) ")
                .append(conditionStatus)
                .append(conditionBorder);

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
        }
        if (criteria.getLatRange() != null && criteria.getLngRange() != null) {
            query.setParameter("minLat", criteria.getLatRange()[0]);
            query.setParameter("maxLat", criteria.getLatRange()[1]);
            query.setParameter("minLng", criteria.getLngRange()[0]);
            query.setParameter("maxLng", criteria.getLngRange()[1]);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOLocationUserDTO.class));
        query.addScalar("locationUserId", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("lat", new DoubleType());
        query.addScalar("lng", new DoubleType());
        query.addScalar("status", new LongType());
        query.addScalar("text", new StringType());

        return query.list();
    }

    public int updateContractDeploy(Date today, AIOContractDTO contractDTO, Long sysUserId, Long sysGroupId) {
        String sql = "UPDATE AIO_CONTRACT SET " +
                "STATUS = 1, " +
                "PERFORMER_ID = :performerId, " +
                "PERFORMER_NAME = :performerName, " +
                "PERFORMER_CODE = :performerCode, " +
                "PERFORMER_GROUP_ID = :performerGroupId, " +
                "UPDATED_DATE = :updateDate, " +
                "UPDATED_USER = :sysUserId, " +
                "UPDATED_GROUP_ID = :sysGroupId " +
                "WHERE CONTRACT_ID = :contractId ";


        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("performerId", contractDTO.getPerformerId());
        query.setParameter("performerName", contractDTO.getPerformerName());
        query.setParameter("performerCode", contractDTO.getPerformerCode());
        //VietNT_20190524_start
        query.setParameter("performerGroupId", contractDTO.getPerformerGroupId());
        //VietNT_end
        query.setParameter("updateDate", today);
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("contractId", contractDTO.getContractId());

        return query.executeUpdate();
    }

    public int updateContractDetailDeploy(Date startDate, Date endDate, Long contractDetailId) {
        String sql = "UPDATE AIO_CONTRACT_DETAIL SET " +
                "START_DATE = :startDate, " +
                "END_DATE = :endDate " +
                "WHERE CONTRACT_DETAIL_ID = :contractDetailId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        query.setParameter("contractDetailId", contractDetailId);

        return query.executeUpdate();
    }

    public AIOContractDTO getContractById(Long id) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.CONTRACT_ID contractId, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("c.CONTRACT_CONTENT contractContent, ")
//                .append("c.SERVICE_POINT_ID servicePointId, ")
                .append("c.SIGN_DATE signDate, ")
                .append("c.SIGN_PLACE signPlace, ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("c.CUSTOMER_CODE customerCode, ")
                .append("c.CUSTOMER_NAME customerName, ")
                .append("c.CUSTOMER_PHONE customerPhone, ")
                .append("c.CUSTOMER_ADDRESS customerAddress, ")
                .append("c.CUSTOMER_TAX_CODE customerTaxCode, ")
                .append("c.PERFORMER_ID performerId, ")
                .append("c.PERFORMER_NAME performerName, ")
                .append("c.PERFORMER_CODE performerCode, ")
                .append("c.SELLER_ID sellerId, ")
                .append("c.SELLER_NAME sellerName, ")
                .append("c.SELLER_CODE sellerCode, ")
                .append("c.STATUS status, ")
                .append("c.TYPE type, ")
                .append("c.SPECIES_ID speciesId, ")
                .append("c.SPECIES_NAME speciesName, ")
                .append("c.AMOUNT_ELECTRIC amountElectric, ")
                .append("c.DESCRIPTION description, ")
                .append("c.CREATED_DATE createdDate, ")
                .append("c.CREATED_USER createdUser, ")
                .append("c.CREATED_GROUP_ID createdGroupId, ")
                .append("c.UPDATED_DATE updatedDate, ")
                .append("c.UPDATED_USER updatedUser, ")
                .append("c.UPDATED_GROUP_ID updatedGroupId, ")
                .append("c.AREA_ID areaId, ")
                .append("c.AREA_NAME areaName, ")
                .append("c.CAT_PROVINCE_ID catProvinceId, ")
                .append("c.CAT_PROVINCE_CODE catProvinceCode, ")
                .append("c.IS_INVOICE isInvoice, ")
                .append("c.SERVICE_CODE serviceCode, ")
                .append("c.CONTRACT_AMOUNT contractAmount ")
                //VietNT_20190513_start
                .append(", (SELECT STATUS FROM AIO_CONFIG_SERVICE WHERE CODE = c.SERVICE_CODE) text ")
                //VietNT_end
                //VietNT_10/07/2019_start
                .append(", c.SALES_TOGETHER salesTogether ")
                //VietNT_end
                //VietNT_23/07/2019_start
                .append(", c.PAY_TYPE payType ")
                //VietNT_end
                //VietNT_24/07/2019_start
                .append(", c.THU_HO thuHo ")
                //VietNT_end
                .append(", c.REASON_OUTOFDATE reasonOutOfDate ")
                .append(", c.IS_INTERNAL isInternal ")
                .append(", c.STAFF_CODE staffCode ")
                .append(", c.INDUSTRY_CODE industryCode ")
                .append("FROM AIO_CONTRACT c ")
                .append("WHERE c.CONTRACT_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);

        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("contractContent", new StringType());
//        query.addScalar("servicePointId", new LongType());
        query.addScalar("signDate", new DateType());
        query.addScalar("signPlace", new StringType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerTaxCode", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("sellerId", new LongType());
        query.addScalar("sellerName", new StringType());
        query.addScalar("sellerCode", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("type", new LongType());
        query.addScalar("speciesId", new LongType());
        query.addScalar("speciesName", new StringType());
        query.addScalar("amountElectric", new DoubleType());
        query.addScalar("description", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdGroupId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("updatedGroupId", new LongType());
        query.addScalar("areaId", new LongType());
        query.addScalar("areaName", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("isInvoice", new LongType());
        query.addScalar("serviceCode", new StringType());
        query.addScalar("contractAmount", new DoubleType());
        query.addScalar("text", new StringType());
        //VietNT_10/07/2019_start
        query.addScalar("salesTogether", new StringType());
        //VietNT_end
        //VietNT_23/07/2019_start
        query.addScalar("payType", new LongType());
        //VietNT_end
        //VietNT_24/07/2019_start
        query.addScalar("thuHo", new DoubleType());
        //VietNT_end
        query.addScalar("reasonOutOfDate", new StringType());
        query.addScalar("isInternal", new LongType());
        query.addScalar("staffCode", new StringType());
        query.addScalar("industryCode", new StringType());

        List list = query.list();
        if (list == null || list.isEmpty()) {
            return null;
        } else {
            return (AIOContractDTO) list.get(0);
        }
    }

    public List<AIOLocationUserDTO> getListPerformer(AIOLocationUserDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("l.lat lat, ")
                .append("l.lng lng, ")
                .append("l.status status, ")
                .append("su.sys_user_id sysUserId, ")
                .append("su.full_name sysUserName, ")
                .append("su.email email, ")
                .append("su.phone_number phoneNumber ")
                .append("FROM ")
                .append("aio_location_user l ")
                .append("LEFT JOIN sys_user su ON l.sys_user_id = su.sys_user_id ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(su.full_name) like upper(:keySearch) ");
            sql.append("or upper(su.email) like upper(:keySearch) ");
            sql.append("or upper(su.phone_number) like upper(:keySearch)) ");
        }
        sql.append("ORDER BY su.full_name ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOLocationUserDTO.class));
        query.addScalar("lat", new DoubleType());
        query.addScalar("lng", new DoubleType());
        query.addScalar("status", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOLocationUserDTO> getListSysUser(AIOLocationUserDTO criteria, Long sysGroupLv2) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("su.EMPLOYEE_CODE text, ")
                .append("su.status status, ")
                .append("su.sys_user_id sysUserId, ")
                .append("su.full_name sysUserName, ")
                .append("su.email email, ")
                .append("su.phone_number phoneNumber ")
                .append("FROM ")
                .append("sys_user su ")
                .append("WHERE 1=1 ")
                .append("and status = 1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(su.full_name) like upper(:keySearch) ");
            sql.append("or upper(su.email) like upper(:keySearch) ");
            sql.append("or upper(su.EMPLOYEE_CODE) like upper(:keySearch) ");
            sql.append("or upper(su.phone_number) like upper(:keySearch)) ");
        }

        if (sysGroupLv2 != null) {
            sql.append("and (select " +
                    "(case when sg.group_level = 0 then (0) when sg.group_level = 1 then (sg.sys_group_id) " +
                    "else TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 3) - (INSTR(sg.path, '/', 1, 2) + 1)))) end) groupLv2 " +
                    "from sys_Group sg where sg.sys_group_id = su.sys_group_id) = :sysGroupLv2 ");
        }

        sql.append("ORDER BY su.full_name ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (sysGroupLv2 != null) {
            query.setParameter("sysGroupLv2", sysGroupLv2);
            queryCount.setParameter("sysGroupLv2", sysGroupLv2);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOLocationUserDTO.class));
        query.addScalar("text", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public List<AIOContractDTO> doSearchExcelExport(AIOContractDTO criteria, List<String> idList) {
        // query by end date AR
        String conditionEndDate = StringUtils.EMPTY;

        if (criteria.getEndDateFrom() != null) {
            conditionEndDate = "AND trunc(:dateFromAR) <= trunc(ar.END_DATE) ";
        }
        if (criteria.getEndDateTo() != null) {
            conditionEndDate += "AND trunc(:dateToAR) >= trunc(ar.END_DATE) ";
        }

        StringBuilder sql = new StringBuilder()
                .append("with a as (select su.sys_user_id userId, sg.group_name_level3 groupName from sys_user su " +
                        "left join sys_group sg on sg.sys_group_id = su.sys_group_id) ")
                .append(", cus_rank AS " +
                        "(SELECT CUSTOMER_ID, Max(a.code), nvl(a.name, 'Thường') name FROM AIO_CUSTOMER " +
                        "LEFT JOIN app_param a ON CUSTOMER_POINT > TO_NUMBER(a.code) " +
                        "AND par_type = 'CUSTOMER_TYPE' GROUP BY CUSTOMER_ID, nvl(a.name, 'Thường')) ")
                .append(", channel as " +
                        "(SELECT app_param_id id, name name from app_param where par_type = 'CONTACT_CHANNEL') ")
                .append("select ")
                .append("c.contract_id contractId, ")
                .append("c.AREA_NAME areaName, ")
                .append("c.CAT_PROVINCE_CODE catProvinceCode, ")
                .append("d.work_name workName, ")
                .append("d.package_name packageName, ")
                .append("c.CONTRACT_CODE contractCode, ")
                .append("c.CONTRACT_CONTENT contractContent, ")
                .append("c.SIGN_DATE signDate, ")
                .append("c.CREATED_DATE createdDate, ")
                .append("to_char(c.CREATED_DATE, 'HH24:MI') createdDateStr, ")
//                .append("(select employee_code from sys_user where sys_user_id = c.seller_id) customField, ")
                //VietNT_20190409_start
                .append("c.SELLER_CODE sellerCode, ")
                //VietNT_end
                .append("c.SELLER_NAME sellerName, ")
//                .append("d.AMOUNT contractAmount, ")
                //VietNT_13/07/2019_start
                .append("c.SALES_TOGETHER salesTogether, ")
                //VietNT_end
                .append("sum(d.amount) contractAmount, ")
                .append("c.CUSTOMER_NAME customerName, ")
                .append("c.CUSTOMER_PHONE customerPhone, ")
                .append("c.CUSTOMER_ADDRESS customerAddress, ")
                .append("c.CUSTOMER_TAX_CODE customerTaxCode, ")
                .append("c.status status, ")
//                .append("ar.AMOUNT amount, ")
                .append("sum(ar.amount) amount, ")
                .append("ar.DISCOUNT_STAFF discountStaff, ")
//                .append("su.employee_code text, ")
//                .append("su.full_name performerName, ")
                //VietNT_20190409_start
                .append("c.PERFORMER_NAME performerName, ")
                .append("c.PERFORMER_CODE performerCode, ")
                //VietNT_end
//                .append("ar.START_DATE startDate, ")
                .append("min(ar.start_date) startDate, ")
//                .append("ar.END_DATE endDate, ")
                .append("max(ar.end_date) endDate, ")
                .append("d.IS_BILL isBill, ")
                .append("d.CUSTOMER_NAME customerNameBill, ")
                .append("d.CUSTOMER_ADDRESS customerAddressBill, ")
                .append("d.TAX_CODE taxCodeBill, ")
                //VietNT_20190522_start
                .append("d.QUANTITY quantity, ")
                .append("d.START_DATE endDateFrom, ")
                .append("d.END_DATE endDateTo, ")
                .append("d.IS_PROVINCE_BOUGHT isProvinceBought, ")
                //VietNT_end
                //VietNT_28/06/2019_start
                .append("d.SALE_CHANNEL saleChannel, ")
                //VietNT_end
                //VietNT_24/06/2019_start
                .append("ar.PERFORMER_TOGETHER text, ")
                .append("c.is_pay isPay, ")
                .append("c.pay_type payType, ")
                //VietNT_end
                //VietNT_31/07/2019_start
                .append("c.thu_ho thuHo, ")
                .append("c.PAY_DATE payDate, ")
                //VietNT_end
                //VietNT_10/08/2019_start
                .append("a_seller.groupName sellerGroupLv3, ")
                .append("a_performer.groupName performerGroupLv3, ")
                .append("TO_CHAR(ar.end_date,'HH24:MI') endDateStr, ")
                //VietNT_end
                .append("c.DESCRIPTION description ")
                .append(", c.INDUSTRY_CODE industryCode ")
                .append(", c.NUMBER_PAY numberPay ")
                .append(", cus_rank.name name ")
                .append(", channel.name contactChannel ")
                .append("from aio_contract c ")
                .append("left join aio_contract_detail d on c.contract_id = d.contract_id ")
                .append("left join aio_acceptance_records ar on c.contract_id = ar.contract_id and d.package_detail_id = ar.package_detail_id ")
                .append("left join a a_seller on a_seller.userId = c.seller_id ")
                .append("left join a a_performer on a_performer.userId = c.performer_id ")
                .append("LEFT JOIN cus_rank ON cus_rank.CUSTOMER_ID = c.CUSTOMER_ID ")
                .append("LEFT JOIN aio_orders o ON o.contract_id = c.contract_id ")
                .append("LEFT JOIN channel ON channel.id = o.contact_channel ")
                .append("where 1=1 ")
                .append("and (c.CREATED_GROUP_ID in (:idList) or c.PERFORMER_GROUP_ID in (:idList)) ")
                .append(conditionEndDate);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(c.CUSTOMER_PHONE) like upper(:keySearch) ");
            sql.append("OR upper(c.CUSTOMER_NAME) like upper(:keySearch) ");
            sql.append("OR upper(c.CUSTOMER_ADDRESS) like upper(:keySearch) escape '&') ");
        }
        if (criteria.getStartDate() != null) {
            sql.append("AND trunc(:dateFrom) <= trunc(c.CREATED_DATE) ");
        }
        if (criteria.getEndDate() != null) {
            sql.append("AND trunc(:dateTo) >= trunc(c.CREATED_DATE) ");
        }
        if (criteria.getStatus() != null) {
            sql.append("AND c.status = :status ");
        } else {
            sql.append("AND c.status != 4 ");
        }

        sql.append("GROUP BY ");
        sql.append("c.contract_id, c.area_name, c.cat_province_code, c.contract_code, c.INDUSTRY_CODE, c.NUMBER_PAY, " +
                "c.contract_content, c.sign_date, c.created_date, c.seller_code, " +
                "c.seller_name, c.customer_name, c.customer_phone, c.customer_address, " +
                "c.customer_tax_code, c.status, c.performer_name, c.performer_code, " +
                "c.description, TO_CHAR(c.created_date,'HH24:MI'), " +
                "d.work_name, d.package_name, d.is_bill, d.customer_name, " +
                "d.customer_address, d.tax_code, ar.discount_staff, " +
                "d.QUANTITY, d.START_DATE, d.END_DATE, d.IS_PROVINCE_BOUGHT " +
                //VietNT_28/06/2019_start
                ", d.SALE_CHANNEL " +
                //VietNT_end
                //VietNT_13/07/2019_start
                ", c.sales_together " +
                //VietNT_end
                //VietNT_24/06/2019_start
                ", c.is_pay, ar.PERFORMER_TOGETHER " +
                //VietNT_end
                //VietNT_10/08/2019_start
                ", a_seller.groupName, a_performer.groupName, TO_CHAR(ar.end_date,'HH24:MI') " +
                //VietNT_end
                //VietNT_31/07/2019_start
                ", c.thu_ho, c.PAY_DATE, c.pay_type, cus_rank.name, channel.name ");
                //VietNT_end

        sql.append("ORDER BY c.CONTRACT_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setParameterList("idList", idList);

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (criteria.getStartDate() != null) {
            query.setParameter("dateFrom", criteria.getStartDate());
        }
        if (criteria.getEndDate() != null) {
            query.setParameter("dateTo", criteria.getEndDate());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
        }
        if (criteria.getEndDateFrom() != null) {
            query.setParameter("dateFromAR", criteria.getEndDateFrom());
        }
        if (criteria.getEndDateTo() != null) {
            query.setParameter("dateToAR", criteria.getEndDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("areaName", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("workName", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("contractContent", new StringType());
        query.addScalar("signDate", new DateType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("sellerCode", new StringType());
        query.addScalar("sellerName", new StringType());
        query.addScalar("contractAmount", new DoubleType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerTaxCode", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("discountStaff", new DoubleType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("isBill", new LongType());
        query.addScalar("customerNameBill", new StringType());
        query.addScalar("customerAddressBill", new StringType());
        query.addScalar("taxCodeBill", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("endDateFrom", new DateType());
        query.addScalar("endDateTo", new DateType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("isPay", new LongType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("salesTogether", new StringType());
        query.addScalar("thuHo", new DoubleType());
        query.addScalar("payDate", new DateType());
        query.addScalar("payType", new LongType());
        query.addScalar("sellerGroupLv3", new StringType());
        query.addScalar("performerGroupLv3", new StringType());
        query.addScalar("endDateStr", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("contactChannel", new StringType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("numberPay", new LongType());

        return query.list();
    }

    public int disableContract(Long id, Long updateUserId, Long updateGroupId) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_CONTRACT SET ")
                .append("UPDATED_DATE = sysdate, ")
                .append("UPDATED_USER = :updateUserId, ")
                .append("UPDATED_GROUP_ID = :updateGroupId, ")
                .append("STATUS = 4 ")
                .append("WHERE CONTRACT_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("updateUserId", updateUserId);
        query.setParameter("updateGroupId", updateGroupId);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public int deleteAcceptanceRecord(Long contractId, Long packageDetailId) {
        String sql = "DELETE FROM AIO_ACCEPTANCE_RECORDS WHERE CONTRACT_ID = :id and PACKAGE_DETAIL_ID = :pdId ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", contractId);
        query.setParameter("pdId", packageDetailId);

        return query.executeUpdate();
    }

    public int deleteContractDetail(AIOContractDetailDTO dto) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_CONTRACT_DETAIL ")
                .append("WHERE CONTRACT_ID = :id and PACKAGE_DETAIL_ID = :pdId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", dto.getContractId());
        query.setParameter("pdId", dto.getPackageDetailId());

        return query.executeUpdate();
    }


    public int updateContractDetail(AIOContractDetailDTO dto, boolean isDeploy) {
        String deployQuery = StringUtils.EMPTY;
        if (isDeploy) {
            deployQuery = "START_DATE = :startDate, END_DATE = :endDate, ";
        }
        StringBuilder sql = new StringBuilder("UPDATE AIO_CONTRACT_DETAIL SET ")
                .append(deployQuery)
                .append("QUANTITY = :quantity, ")
                .append("AMOUNT = (CASE WHEN AMOUNT > 0 THEN :amount ELSE 0 END) ")
//                .append("WHERE CONTRACT_DETAIL_ID = :id ");
                .append("WHERE CONTRACT_ID = :id and PACKAGE_DETAIL_ID = :pdId");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("quantity", dto.getQuantity());
        query.setParameter("amount", dto.getAmount());
//        query.setParameter("id", dto.getContractDetailId());
        query.setParameter("id", dto.getContractId());
        query.setParameter("pdId", dto.getPackageDetailId());
        if (isDeploy) {
            long timeAsMillis = (long) (dto.getTime() * TimeUnit.DAYS.toMillis(1));
            Date startDate = new Date();
            Date endDate = new Date(startDate.getTime() + timeAsMillis);

            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }

        return query.executeUpdate();
    }

    public int updateAcceptanceRecord(AIOAcceptanceRecordsDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ACCEPTANCE_RECORDS SET ")
                .append("CUSTOMER_ID = :customerId, ")
                .append("CUSTOMER_CODE = :customerCode, ")
                .append("CUSTOMER_NAME = :customerName, ")
                .append("CUSTOMER_PHONE = :customerPhone, ")
                .append("CUSTOMER_ADDRESS = :customerAddress, ")
                .append("PERFORMER_ID = :performerId ")
                .append("WHERE CONTRACT_ID = :id and PACKAGE_DETAIL_ID = :pdId");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("customerId", dto.getCustomerId());
        query.setParameter("customerCode", dto.getCustomerCode());
        query.setParameter("customerName", dto.getCustomerName());
        query.setParameter("customerPhone", dto.getCustomerPhone());
        query.setParameter("customerAddress", dto.getCustomerAddress());
        query.setParameter("performerId", dto.getPerformerId());
        query.setParameter("id", dto.getContractId());
        query.setParameter("pdId", dto.getPackageDetailId());

        return query.executeUpdate();
    }

    public int updateCustomerEdit(AIOCustomerDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_CUSTOMER SET ")
                .append("NAME = :name, ")
                .append("PHONE = :phone, ")
                .append("TAX_CODE = :taxCode, ")
                .append("SURROGATE = :surrogate, ")
                .append("POSITION = :position, ")
                .append("PASSPORT = :passport, ")
                .append("ISSUED_BY = :issuedBy, ")
                .append("GENDER = :gender, ")
                .append("ADDRESS = :address, ")
                .append("AIO_AREA_ID = :aioAreaId, ")
                .append("EMAIL = :email, ")
                .append("TYPE = :type ")
                .append(", BIRTH = :birth ")
                .append(", PURVEY_DATE = :purveyDate ")
                .append("WHERE CUSTOMER_ID = :customerId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("name", dto.getName());
        query.setParameter("phone", dto.getPhone());
        query.setParameter("taxCode", dto.getTaxCode(), new StringType());
        query.setParameter("surrogate", dto.getSurrogate(), new StringType());
        query.setParameter("position", dto.getPosition(), new StringType());
        query.setParameter("passport", dto.getPassport());
        query.setParameter("issuedBy", dto.getIssuedBy(), new StringType());
        query.setParameter("gender", dto.getGender(), new LongType());
        query.setParameter("address", dto.getAddress());
        query.setParameter("aioAreaId", dto.getAioAreaId(), new LongType());
        query.setParameter("email", dto.getEmail(), new StringType());
        query.setParameter("type", dto.getType(), new LongType());
        query.setParameter("customerId", dto.getCustomerId());
        query.setParameter("birth", dto.getBirth(), new DateType());
        query.setParameter("purveyDate", dto.getPurveyDate(), new DateType());

        return query.executeUpdate();
    }

    public int updateContractEdit(AIOContractDTO dto, boolean isDeploy) {
        String deployQuery = StringUtils.EMPTY;
        if (isDeploy) {
            deployQuery = ", PERFORMER_ID = :performerId, " +
                    "PERFORMER_NAME = :performerName, " +
                    "PERFORMER_CODE = :performerCode, " +
                    "PERFORMER_GROUP_ID = :performerGroupId ";
        }

        StringBuilder sql = new StringBuilder("UPDATE AIO_CONTRACT SET ")
//                .append("CONTRACT_CODE = :contractCode, ")
                .append("CONTRACT_CONTENT = :contractContent, ")
                .append("SIGN_DATE = :signDate, ")
                .append("SIGN_PLACE = :signPlace, ")
                .append("CUSTOMER_ID = :customerId, ")
                .append("CUSTOMER_CODE = :customerCode, ")
                .append("CUSTOMER_NAME = :customerName, ")
                .append("CUSTOMER_PHONE = :customerPhone, ")
                .append("CUSTOMER_ADDRESS = :customerAddress, ")
                .append("CUSTOMER_TAX_CODE = :customerTaxCode, ")
                .append("SPECIES_ID = :speciesId, ")
                .append("SPECIES_NAME = :speciesName, ")
                .append("AMOUNT_ELECTRIC = :amountElectric, ")
                .append("DESCRIPTION = :description, ")
                .append("UPDATED_DATE = :updatedDate, ")
                .append("UPDATED_USER = :updatedUser, ")
                .append("UPDATED_GROUP_ID = :updatedGroupId, ")
//                .append("AREA_ID = :areaId, ")
//                .append("AREA_NAME = :areaName, ")
//                .append("CAT_PROVINCE_ID = :catProvinceId, ")
//                .append("CAT_PROVINCE_CODE = :catProvinceCode, ")
                .append("CONTRACT_AMOUNT = :contractAmount, ")
//                .append("SELLER_ID = :sellerId, ")
//                .append("SELLER_NAME = :sellerName, ")
//                .append("SELLER_CODE = :sellerCode, ")
//                .append("SERVICE_CODE = :serviceCode, ")
                .append("status = :status ")
                //VietNT_10/07/2019_start
                .append(", SALES_TOGETHER = :salesTogether ")
                .append(", STAFF_CODE = :staffCode ")
                //VietNT_end
                .append(deployQuery)
                .append("WHERE CONTRACT_ID = :contractId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
//        query.setParameter("contractCode", dto.getContractCode());
        query.setParameter("contractContent", dto.getContractContent());
        query.setParameter("signDate", dto.getSignDate());
        query.setParameter("signPlace", dto.getSignPlace());
        query.setParameter("customerId", dto.getCustomerId());
        query.setParameter("customerCode", dto.getCustomerCode());
        query.setParameter("customerName", dto.getCustomerName());
        query.setParameter("customerPhone", dto.getCustomerPhone());
        query.setParameter("customerAddress", dto.getCustomerAddress());
        query.setParameter("customerTaxCode", dto.getCustomerTaxCode());
        query.setParameter("speciesId", dto.getSpeciesId(), new LongType());
        query.setParameter("speciesName", dto.getSpeciesName(), new StringType());
        query.setParameter("amountElectric", dto.getAmountElectric(), new DoubleType());
        query.setParameter("description", dto.getDescription(), new StringType());
        query.setParameter("updatedDate", dto.getUpdatedDate());
        query.setParameter("updatedUser", dto.getUpdatedUser());
        query.setParameter("updatedGroupId", dto.getUpdatedGroupId());
//        query.setParameter("areaId", dto.getAreaId());
//        query.setParameter("areaName", dto.getAreaName());
//        query.setParameter("catProvinceId", dto.getCatProvinceId());
//        query.setParameter("catProvinceCode", dto.getCatProvinceCode());
        query.setParameter("contractAmount", dto.getContractAmount());
//        query.setParameter("sellerId", dto.getSellerId());
//        query.setParameter("sellerName", dto.getSellerName());
//        query.setParameter("sellerCode", dto.getSellerCode());
//        query.setParameter("serviceCode", dto.getServiceCode());
        query.setParameter("status", dto.getStatus());
        query.setParameter("contractId", dto.getContractId());
        //VietNT_10/07/2019_start
        query.setParameter("salesTogether", dto.getSalesTogether());
        query.setParameter("staffCode", dto.getStaffCode());
        //VietNT_end
        if (isDeploy) {
            query.setParameter("performerId", dto.getPerformerId(), new LongType());
            query.setParameter("performerName", dto.getPerformerName(), new StringType());
            query.setParameter("performerCode", dto.getPerformerCode(), new StringType());
            query.setParameter("performerGroupId", dto.getPerformerGroupId(), new LongType());
        }

        return query.executeUpdate();
    }

    /**
     * Hoangnh start 16042019
     **/
    public void updateAIOOrder(Long aioOrdersId, Long contractId) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ORDERS SET CREATED_CONTRACT_DATE = SYSDATE")
                // TODO: 10-Oct-19 update status
//    	.append(",STATUS =3")
                .append(",STATUS = 4")
                .append(",CONTRACT_ID=:contractId WHERE AIO_ORDERS_ID = :aioOrdersId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("aioOrdersId", aioOrdersId);
        query.setParameter("contractId", contractId);
        query.executeUpdate();
    }

    /**
     * Hoangnh end 16042019
     **/

    //VietNT_20190502_start
    public List<AIOAreaDTO> getListAreaForDropDown(AIOAreaDTO criteria) {
        String userInfoQuery = StringUtils.EMPTY;
        String userInfoJoin = StringUtils.EMPTY;
        if (criteria.getAreaLevel() != null && criteria.getAreaLevel().equals("4")) {
            userInfoQuery = ", aa.SYS_USER_ID sysUserId, " +
                    "aa.EMPLOYEE_CODE employeeCode, " +
                    "aa.FULL_NAME fullName, " +
                    "aa.sale_SYS_USER_ID saleSysUserId, " +
                    "aa.sale_EMPLOYEE_CODE saleEmployeeCode, " +
                    "aa.sale_FULL_NAME saleFullName, " +
                    "su.email email, su.phone_number phoneNumber ";
            userInfoJoin = "left join SYS_USER su on su.sys_user_id = aa.SYS_USER_ID ";
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("aa.AREA_ID areaId, ")
                .append("aa.CODE code, ")
                .append("aa.NAME name, ")
                .append("aa.PARENT_ID parentId, ")
                .append("aa.STATUS status, ")
//                .append("PATH path, ")
//                .append("EFFECT_DATE effectDate, ")
//                .append("END_DATE endDate, ")
//                .append("AREA_NAME_LEVEL1 areaNameLevel1, ")
//                .append("AREA_NAME_LEVEL2 areaNameLevel2, ")
//                .append("AREA_NAME_LEVEL3 areaNameLevel3, ")
//                .append("AREA_ORDER areaOrder, ")
                .append("aa.AREA_LEVEL areaLevel, ")
                .append("aa.PROVINCE_ID provinceId ")
                .append(userInfoQuery)
                .append("FROM AIO_AREA aa ")
                .append(userInfoJoin)
                .append("WHERE aa.STATUS = 1 ");

        if (criteria.getAreaLevel() != null) {
            sql.append("AND aa.AREA_LEVEL = :level ");
        }

        if (criteria.getParentId() != null) {
            sql.append("AND aa.PARENT_ID = :parentId ");
        }

        sql.append("ORDER BY aa.PARENT_ID, aa.AREA_ORDER ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        if (criteria.getAreaLevel() != null) {
            query.setParameter("level", criteria.getAreaLevel());
        }
        if (criteria.getParentId() != null) {
            query.setParameter("parentId", criteria.getParentId());
        }

        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("status", new StringType());
//        query.addScalar("path", new StringType());
//        query.addScalar("effectDate", new DateType());
//        query.addScalar("endDate", new DateType());
//        query.addScalar("areaNameLevel1", new StringType());
//        query.addScalar("areaNameLevel2", new StringType());
//        query.addScalar("areaNameLevel3", new StringType());
//        query.addScalar("areaOrder", new StringType());
        query.addScalar("areaLevel", new StringType());
        query.addScalar("provinceId", new LongType());
        if (criteria.getAreaLevel() != null && criteria.getAreaLevel().equals("4")) {
            query.addScalar("sysUserId", new LongType());
            query.addScalar("employeeCode", new StringType());
            query.addScalar("fullName", new StringType());
            query.addScalar("saleSysUserId", new LongType());
            query.addScalar("saleEmployeeCode", new StringType());
            query.addScalar("saleFullName", new StringType());
            query.addScalar("email", new StringType());
            query.addScalar("phoneNumber", new StringType());
        }

        return query.list();
    }
    //VietNT_end

    //VietNT_20190509_start
    public int deleteIncompleteDetailByContractId(Long contractId) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_CONTRACT_DETAIL ")
                .append("WHERE CONTRACT_ID = :contractId ")
                .append("AND STATUS NOT IN (3, 2) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", contractId);

        return query.executeUpdate();
    }

    public int deleteIncompleteRecordByContractId(Long contractId) {
        StringBuilder sql = new StringBuilder("DELETE FROM AIO_ACCEPTANCE_RECORDS ")
                .append("WHERE CONTRACT_DETAIL_ID in ")
                .append("(SELECT CONTRACT_DETAIL_ID FROM AIO_CONTRACT_DETAIL WHERE CONTRACT_ID = :contractId AND STATUS NOT IN (3, 2)) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", contractId);

        return query.executeUpdate();
    }

    public int deleteById(String table, String field, Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM ")
                .append(table)
                .append(" WHERE ")
                .append(field)
                .append(" = :id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);

        return query.executeUpdate();
    }
    //VietNT_end

    //HuyPq-start
    public Long getNextCustomerCodeId() {
        String sql = "SELECT AIO_CUSTOMER_SEQ.nextval from dual ";
        SQLQuery query = this.getSession().createSQLQuery(sql);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }
    //Huy-end

    //VietNT_20190523_start
    public AIOContractDTO getPackageSaleChannelAndProvinceBought(Long packageDetailId) {
        String sql = "SELECT d.IS_PROVINCE_BOUGHT isProvinceBought, " +
                "p.sale_channel saleChannel, " +
                "(select cs.name from AIO_CONFIG_SERVICE cs WHERE cs.CODE = p.SERVICE_CODE) workName " +
                "FROM AIO_PACKAGE_DETAIL d " +
                "LEFT JOIN AIO_PACKAGE p ON p.AIO_PACKAGE_ID = d.AIO_PACKAGE_ID " +
                "WHERE d.AIO_PACKAGE_DETAIL_ID = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.setParameter("id", packageDetailId);
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("workName", new StringType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOContractDTO) list.get(0);
        }
        return null;
    }

    //VietNT_end
    //VietNT_20190528_start
    public List<Long> getContractDetailStatus(Long id) {
        String sql = "select status from aio_contract_detail where contract_id = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);

        query.setParameter("id", id);
        query.addScalar("status", new LongType());

        return query.list();
    }
    //VietNT_end

    //VietNT_08/06/2019_start
    public AIOContractDTO getContractAmount(Long contractId) {
        String sql = "SELECT C.CONTRACT_ID contractId , " +
                "C.CONTRACT_CODE contractCode , " +
//                "SUM(R.AMOUNT) contractAmount " +
                //VietNT_29/07/2019_start
                // check if contract of saleChannel VTP, get amount = CONTRACT.THU_HO, (MIN is there b/c of group by)
                "(nvl((case when " +
                "(select sale_channel from aio_contract_detail where contract_id = c.contract_id and rownum = 1) = 'VTP' " +
                "then MIN(c.thu_ho) " +
                " else SUM(R.AMOUNT) end), 0)) contractAmount " +
                //VietNT_end
                ", c.is_pay isPay," +
                "c.CUSTOMER_NAME customerName, " +
                "c.CUSTOMER_PHONE customerPhone, " +
                "c.CUSTOMER_ADDRESS customerAddress, " +
                "c.STATUS status " +
                "FROM AIO_CONTRACT C " +
                "LEFT JOIN AIO_ACCEPTANCE_RECORDS R ON R.CONTRACT_ID = C.CONTRACT_ID " +
                "WHERE C.CONTRACT_ID = :id " +
//                "AND C.STATUS = 3 " +
                "GROUP BY C.CONTRACT_ID, C.CONTRACT_CODE, c.is_pay, c.CUSTOMER_NAME, c.CUSTOMER_PHONE, c.CUSTOMER_ADDRESS, " +
                "c.STATUS ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));

        query.setParameter("id", contractId);
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("contractAmount", new DoubleType());
        query.addScalar("isPay", new LongType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("status", new LongType());

        List result = query.list();
        if (result != null && !result.isEmpty()) {
            return (AIOContractDTO) result.get(0);
        }
        return null;
    }
    //VietNT_end

    //VietNT_13/06/2019_start
    public int updateContractPaidStatus(Long contractId, Long amount) {
        String sql = "UPDATE AIO_CONTRACT SET " +
                "IS_PAY = 1, " +
                "AMOUNT_PAY = :amount, " +
                "PAY_DATE = :date " +
                "WHERE CONTRACT_ID = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("amount", amount);
        query.setParameter("date", new Date());
        query.setParameter("id", contractId);

        return query.executeUpdate();
    }
    //VietNT_end
    //VietNT_18/06/2019_start
//    public boolean userHasContractUnpaid(Long sysUserId, Long contractId) {
//        return userHasContractUnpaid(sysUserId, contractId, 1L);
//    }

    public boolean userHasContractUnpaid(Long sysUserId, Long contractId) {
//            , Long numberPay
        String sql = "with a as " +
                "(select contract_id, max(end_date) end_date from AIO_ACCEPTANCE_RECORDS ar group by contract_id) " +
                "select c.contract_id contractId " +
                "from aio_contract c " +
                "left join a on a.contract_id = c.contract_id " +
                "where c.performer_id = :id and c.status = 3 and (c.is_pay is null or c.is_pay != 1) " +
                "and c.contract_id != :contractId " +
                "AND trunc(sysdate - c.NUMBER_PAY) > trunc(a.END_DATE) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", sysUserId);
        query.setParameter("contractId", contractId);
//        query.setParameter("numberPay", numberPay);
        query.addScalar("contractId", new LongType());

        List list = query.list();
        return list != null && !list.isEmpty();
    }

    //VietNT_26/06/2019_start
    public boolean isContractFinished(Long contractId) {
        return checkContractStatus(contractId, 3L);
    }

    public boolean isContractDetailCorrect(Long contractId, Long detailId, Double quantity) {
        String sql = "SELECT contract_detail_id contractDetailId from aio_contract_detail " +
                "where contract_id = :contractId and contract_detail_id = :detailId and quantity = :quantity ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("contractId", contractId);
        query.setParameter("detailId", detailId);
        query.setParameter("quantity", quantity);
        query.addScalar("contractDetailId", new LongType());

        Long result = (Long) query.uniqueResult();
        return result != null;
    }

    public boolean isContractDetailCorrect(AIOContractMobileRequest rq) {
        Long contractId = rq.getAioContractDTO().getContractId();
        Long detailId = rq.getAioContractDTO().getContractDetailId();
        Double quantity = rq.getAioContractDTO().getQuantity();
        if (contractId == null || detailId == null || quantity == null) {
            return false;
        }

        return this.isContractDetailCorrect(contractId, detailId, quantity);
    }

    //VietNT_end
    //VietNT_29/06/2019_start
    public Long countContractDetailWithStatuses(Long contractId, List<Long> statuses) {
        String sql = "select count(*) from aio_contract c " +
                "left join aio_contract_detail d on c.contract_id = d.contract_id " +
                "where c.contract_id = :id and d.status in (:statuses) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", contractId);
        query.setParameterList("statuses", statuses);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    //VietNT_end
    //VietNT_01/07/2019_start
    public boolean isContractDetailStatusCorrect(AIOContractDetailDTO detailDTO) {
        String sql = "SELECT contract_detail_id contractDetailId from aio_contract_detail " +
                "where contract_id = :contractId and contract_detail_id = :detailId and status = :status ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("contractId", detailDTO.getContractId());
        query.setParameter("detailId", detailDTO.getContractDetailId());
        query.setParameter("status", detailDTO.getStatus());
        query.addScalar("contractDetailId", new LongType());

        Long result = (Long) query.uniqueResult();
        return result != null;
    }

    //VietNT_end
    //VietNT_01/07/2019_start
    public boolean checkContractStatus(Long contractId, Long status) {
        Long result = this.getContractStatus(contractId);
        return result != null && result.equals(status);
    }

    public Long getContractStatus(Long contractId) {
        String sql = "SELECT status status from aio_contract where contract_id = :contractId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("contractId", contractId);
        query.addScalar("status", new LongType());
        return (Long) query.uniqueResult();
    }

    //VietNT_end
    //VietNT_12/07/2019_start
    public int updateContractSeller(AIOContractDTO contractDTO, Long sysUserId, Long sysGroupLv2) {
        String sql = "UPDATE AIO_CONTRACT SET " +
                "seller_id = :sellerId, " +
                "seller_code = :sellerCode, " +
                "seller_name = :sellerName, " +
                "SALES_TOGETHER = :salesTogether, " +
                "UPDATED_DATE = :updateDate, " +
                "UPDATED_USER = :sysUserId, " +
                "UPDATED_GROUP_ID = :sysGroupId " +
                "WHERE CONTRACT_ID = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("sellerId", contractDTO.getSellerId());
        query.setParameter("sellerCode", contractDTO.getSellerCode());
        query.setParameter("sellerName", contractDTO.getSellerName());
        query.setParameter("salesTogether", contractDTO.getSalesTogether(), new StringType());
        query.setParameter("updateDate", new Date());
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("sysGroupId", sysGroupLv2);
        query.setParameter("id", contractDTO.getContractId());

        return query.executeUpdate();
    }

    //VietNT_end
    //VietNT_24/07/2019_start
    public boolean userHasContractUnpaidVTPost(Long sysUserId) {
        String sql = "with a as " +
                "(select contract_id, max(end_date) end_date from AIO_ACCEPTANCE_RECORDS ar group by contract_id) " +
                "select c.contract_id contractId " +
                "from aio_contract c " +
                "left join a on a.contract_id = c.contract_id " +
                "where c.seller_id = :id " +
                "and c.status = 3 and (c.is_pay is null or c.is_pay != 1) " +
                "AND trunc(sysdate - c.number_pay) > trunc(a.END_DATE) ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", sysUserId);
        query.addScalar("contractId", new LongType());

        List list = query.list();
        return list != null && !list.isEmpty();
    }

    public int updatePayTypeContract(Long contractId, Long payType) {
        String typeField;
        if (payType == 1L) {
            typeField = "NUMBER_PAY = 1, " +
                    "APPROVED_PAY = 1 ";
        } else {
            typeField = "NUMBER_PAY = NULL, " +
                    "APPROVED_PAY = 0 ";
        }

        StringBuilder sql = new StringBuilder("UPDATE AIO_CONTRACT SET ")
                .append("PAY_TYPE = :payType, ")
                .append(typeField)
                .append("WHERE CONTRACT_ID = :contractId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("contractId", contractId);
        query.setParameter("payType", payType);
        return query.executeUpdate();
    }

    // get id, status & payType
    public AIOContractDTO getContractInfoEndContract(Long id, Long detailId) {
        String sql = "with a as " +
                "(select sale_channel, IS_PROVINCE_BOUGHT " +
                "from aio_contract_detail " +
                "where contract_detail_id = :detailId) " +

                "Select " +
                "c.contract_id contractId, " +
                "c.status status, " +
                "c.pay_type payType," +
                "c.thu_ho thuHo, " +
                "c.NUMBER_PAY numberPay, " +
                "c.APPROVED_PAY approvedPay, " +
//                "(select sale_channel from aio_contract_detail where contract_detail_id = :detailId) saleChannel " +
                " a.sale_channel saleChannel, " +
                " a.IS_PROVINCE_BOUGHT isProvinceBought " +
                ", (SELECT min(SCALE) FROM AIO_CONFIG_SERVICE cfg WHERE CFG.INDUSTRY_CODE = industry_code) industryScale " +
                "FROM AIO_CONTRACT c, a " +
                "WHERE CONTRACT_ID = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.setParameter("id", id);
        query.setParameter("detailId", detailId);
        query.addScalar("contractId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("payType", new LongType());
        query.addScalar("thuHo", new DoubleType());
        query.addScalar("numberPay", new LongType());
        query.addScalar("approvedPay", new LongType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("isProvinceBought", new LongType());
        query.addScalar("industryScale", new DoubleType());

        return (AIOContractDTO) query.uniqueResult();
    }
    //VietNT_end

    public int approvePayTypeContract(Long contractId) {
        String sql = " update aio_contract set number_pay = 1,APPROVED_PAY = 1,APPROVED_DATE = sysdate where contract_id = :id ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("id", contractId);
        return query.executeUpdate();
    }

    public List<AIOContractDTO> doSearchApproveContract(AIOContractDTO criteria, List<String> groupIdList) {
        String getByIdField = StringUtils.EMPTY;
        String getByIdCondition = StringUtils.EMPTY;
        String approvedPayCondition = StringUtils.EMPTY;
        String keySearchCondition = StringUtils.EMPTY;
        String permissionCondition = StringUtils.EMPTY;

        if (criteria.getContractId() != null) {
            getByIdField = ", c.customer_address customerAddress, " +
                    "c.customer_phone customerPhone, " +
                    "c.contract_content contractContent ";
            getByIdCondition = "and c.contract_id = :contractId ";
        } else {
            permissionCondition = "and c.PERFORMER_GROUP_ID in (:idList) ";
            if (criteria.getApprovedPay() != null && criteria.getApprovedPay() >= 0) {
                approvedPayCondition = "and c.approved_pay = :approvedPay ";
                if (criteria.getApprovedPay() != 2) {
                    approvedPayCondition += "and c.pay_type = 2 ";
                }
            } else {
                approvedPayCondition = "and c.approved_pay is not null ";
            }
            if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
                keySearchCondition = "and (upper(c.contract_code) like upper(:keySearch) escape '&' " +
                        "or upper(c.customer_name) like upper(:keySearch) escape '&') ";
            }
        }

        StringBuilder sql = new StringBuilder()
//                .append("with a as ")
//                .append("(select contract_id, nvl(sum(amount), 0) amount from AIO_ACCEPTANCE_RECORDS group by contract_id) ")
                .append("select c.contract_id contractId, ")
                .append("c.contract_code contractCode, ")
                .append("c.customer_name customerName, ")
                .append("c.seller_code || '-' || seller_name || '; ' || c.SALES_TOGETHER sellerName, ")
                .append("c.contract_amount amount, ")
                .append("c.created_date createdDate, ")
                .append("c.PAY_TYPE payType, ")
                .append("c.IS_PAY isPay, ")
                .append("c.status status, ")
                .append("c.approved_pay approvedPay ")
                .append(getByIdField)
                .append("from aio_contract c ")
//                .append("left join a on a.contract_id = c.contract_id ")
                .append("where 1=1 ")
                .append("and c.status is not null and c.status != 4 ")
//                .append("and c.pay_type = 2 ")
                .append(permissionCondition)
                .append(getByIdCondition)
                .append(approvedPayCondition)
                .append(keySearchCondition);

        sql.append("order by c.contract_id desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getContractId() != null) {
            query.setParameter("contractId", criteria.getContractId());
        } else {
            query.setParameterList("idList", groupIdList);
            queryCount.setParameterList("idList", groupIdList);

            if (criteria.getApprovedPay() != null && criteria.getApprovedPay() >= 0) {
                query.setParameter("approvedPay", criteria.getApprovedPay());
                queryCount.setParameter("approvedPay", criteria.getApprovedPay());
            }

            if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
                query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
                queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            }
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("sellerName", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("approvedPay", new LongType());
        query.addScalar("payType", new LongType());
        query.addScalar("isPay", new LongType());
        query.addScalar("status", new LongType());

        if (criteria.getContractId() != null) {
            query.addScalar("customerAddress", new StringType());
            query.addScalar("customerPhone", new StringType());
            query.addScalar("contractContent", new StringType());
        } else {
            this.setPageSize(criteria, query, queryCount);
        }
        return query.list();
    }

    public int updateApprovePayAction(Long contractId, Long numberPay) {
        String sql = "update aio_contract set " +
                "number_pay = :numberPay, " +
                "approved_pay = 1, " +
                "APPROVED_DATE = sysdate " +
                "where contract_id = :contractId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("numberPay", numberPay);
        query.setParameter("contractId", contractId);

        return query.executeUpdate();
    }

    public int updateDeniedPayAction(Long contractId, String desc) {
        String sql = "update aio_contract set " +
                "pay_type = 1, " +
                "number_pay = 1, " +
                "approved_pay = 2, " +
                "APPROVED_DATE = sysdate, " +
                "APPROVED_DESCRIPTION = :desc " +
                "where contract_id = :contractId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("contractId", contractId);
        query.setParameter("desc", desc);

        return query.executeUpdate();
    }

    public int updateConfirmPayment(Long contractId) {
        String sql = "update aio_contract set " +
                "is_pay = 1, " +
                "pay_date = sysdate, " +
                "amount_pay = (select sum(amount) from aio_acceptance_records where contract_id = :contractId) " +
                "where contract_id = :contractId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("contractId", contractId);

        return query.executeUpdate();
    }

    //VietNT_13/08/2019_start
    public SysUserCOMSDTO getDefaultPerformer(Long areaId, Long serviceType) {
        StringBuilder sql = new StringBuilder("select ");
        if (serviceType == 1) {
            sql.append("SYS_USER_ID sysUserId, EMPLOYEE_CODE employeeCode, FULL_NAME fullName ");
        } else {
            sql.append("SALE_SYS_USER_ID sysUserId, SALE_EMPLOYEE_CODE employeeCode, SALE_FULL_NAME fullName ");
        }

        sql.append("from aio_area ")
                .append("where 1 = 1 and area_level = 4 ")
                .append("and area_id = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));
        query.setParameter("id", areaId);
        query.addScalar("sysUserId", new LongType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (SysUserCOMSDTO) list.get(0);
        }
        return null;
    }
    //VietNT_end

    public int updateContractStatus(Long id, Long status, Long userId, Long groupLv2Id) {
        String sql = "update aio_contract " +
                "set " +
                "status = :status, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_GROUP_ID = :groupId, " +
                "UPDATED_DATE = sysdate " +
                "where contract_id = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", status);
        query.setParameter("userId", userId);
        query.setParameter("groupId", groupLv2Id);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public int updateReasonOutOfDate(Long id, String reason, Long userId, Long groupLv2Id) {
        String sql = "update aio_contract " +
                "set " +
                "reason_outofdate = :reason, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_GROUP_ID = :groupId, " +
                "UPDATED_DATE = sysdate " +
                "where contract_id = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setParameter("userId", userId);
        query.setParameter("groupId", groupLv2Id);
        query.setParameter("reason", reason);

        return query.executeUpdate();
    }

    public int updateCustomerEditMobile(AIOCustomerDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_CUSTOMER SET ")
                .append("NAME = :name, ")
                .append("PHONE = :phone, ")
                .append("TAX_CODE = :taxCode, ")
//                .append("SURROGATE = :surrogate, ")
//                .append("POSITION = :position, ")
                .append("PASSPORT = :passport, ")
//                .append("ISSUED_BY = :issuedBy, ")
//                .append("GENDER = :gender, ")
                .append("ADDRESS = :address, ")
                .append("AIO_AREA_ID = :aioAreaId ")
//                .append("EMAIL = :email, ")
//                .append("TYPE = :type ")
//                .append(", BIRTH = :birth ")
//                .append(", PURVEY_DATE = :purveyDate ")
                .append("WHERE CUSTOMER_ID = :customerId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("name", dto.getName());
        query.setParameter("phone", dto.getPhone());
        query.setParameter("taxCode", dto.getTaxCode(), new StringType());
//        query.setParameter("surrogate", dto.getSurrogate(), new StringType());
//        query.setParameter("position", dto.getPosition(), new StringType());
        query.setParameter("passport", dto.getPassport());
//        query.setParameter("issuedBy", dto.getIssuedBy(), new StringType());
//        query.setParameter("gender", dto.getGender(), new LongType());
        query.setParameter("address", dto.getAddress());
        query.setParameter("aioAreaId", dto.getAioAreaId(), new LongType());
//        query.setParameter("email", dto.getEmail(), new StringType());
//        query.setParameter("type", dto.getType(), new LongType());
//        query.setParameter("birth", dto.getBirth(), new DateType());
//        query.setParameter("purveyDate", dto.getPurveyDate(), new DateType());
        query.setParameter("customerId", dto.getCustomerId());

        return query.executeUpdate();
    }

    public List<AIOSysUserDTO> getListUserAC(AIOSysUserDTO criteria, Long sysGroupLv2) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("su.EMPLOYEE_CODE employeeCode, ")
                .append("su.full_name fullName ")
                .append("FROM ")
                .append("sys_user su ")
                .append("WHERE 1=1 ")
                .append("and status = 1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (upper(su.full_name) like upper(:keySearch) ");
            sql.append("or upper(su.email) like upper(:keySearch) ");
            sql.append("or upper(su.EMPLOYEE_CODE) like upper(:keySearch) ");
            sql.append("or upper(su.phone_number) like upper(:keySearch)) ");
        }

        if (sysGroupLv2 != null) {
            sql.append("and (select " +
                    "(case when sg.group_level = 0 then (0) when sg.group_level = 1 then (sg.sys_group_id) " +
                    "else TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 3) - (INSTR(sg.path, '/', 1, 2) + 1)))) end) groupLv2 " +
                    "from sys_Group sg where sg.sys_group_id = su.sys_group_id) = :sysGroupLv2 ");
        }

        sql.append("ORDER BY su.full_name ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (sysGroupLv2 != null) {
            query.setParameter("sysGroupLv2", sysGroupLv2);
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());

        return query.list();
    }

    public AIOContractDTO countContractDetail(Long id) {
        String sql = "SELECT " +
                "(SELECT count(*) FROM AIO_CONTRACT_DETAIL WHERE CONTRACT_ID = :id AND STATUS = 3) done, " +
                "(SELECT count(*) FROM AIO_CONTRACT_DETAIL WHERE CONTRACT_ID = :id) total " +
                " FROM aio_contract WHERE CONTRACT_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.setParameter("id", id);
        query.addScalar("done", new IntegerType());
        query.addScalar("total", new IntegerType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOContractDTO) list.get(0);
        }
        return null;
    }

    public List<AIOPackageGoodsDTO> getStockQuantityOfProvinceGroup(Long provinceGroupId, List<Long> goodsIds) {
        return this.getStockQuantityOfProvinceGroup(Collections.singletonList(provinceGroupId), goodsIds);
    }

    public List<AIOPackageGoodsDTO> getStockQuantityOfProvinceGroup(List<Long> groupIds, List<Long> goodsIds) {
        String sql = "with slt as( " +
                "select m.GOODS_ID, m.GOODS_CODE, sum(m.AMOUNT) slton " +
                "from MER_ENTITY m " +
                "LEFT join CAT_STOCK c on c.CAT_STOCK_ID = m.STOCK_ID " +
                "LEFT join SYS_GROUP s on c.SYS_GROUP_ID = s.SYS_GROUP_ID " +
                "LEFT join STOCK_TRANS_DETAIL_SERIAL ss on ss.MER_ENTITY_ID = m.MER_ENTITY_ID " +
                "LEFT join STOCK_TRANS st on st.STOCK_TRANS_ID = ss.STOCK_TRANS_ID " +
                "LEFT join STOCK_TRANS_DETAIL sd on sd.STOCK_TRANS_DETAIL_ID = ss.STOCK_TRANS_DETAIL_ID " +
                "where " +
                "c.TYPE = 4 " +
                "and c.SYS_GROUP_ID in (:groupId) " +
                "and m.GOODS_ID in (:goodsId) and " +
                "(m.STATUS = 4 or " +
                "(m.MER_ENTITY_ID in " +
                "(select MER_ENTITY_ID from STOCK_TRANS_DETAIL_SERIAL where STOCK_TRANS_ID in " +
                "(Select STOCK_TRANS_ID from STOCK_TRANS where TYPE = 2 and BUSINESS_TYPE in (8,12) and (CONFIRM = 0 or CONFIRM is null or CONFIRM = 2) AND STATUS = 2) " +
                ") " +
                ") " +
                ") " +
                "group by m.GOODS_ID, m.GOODS_CODE), " +

                "slyc as ( " +
                "select pg.GOODS_ID, sum(cd.QUANTITY * pg.QUANTITY) slycau " +
                "from AIO_CONTRACT c " +
                "LEFT join AIO_CONTRACT_DETAIL cd on c.CONTRACT_ID = cd.CONTRACT_ID " +
                "LEFT JOIN AIO_PACKAGE_GOODS pg on cd.PACKAGE_DETAIL_ID = pg.AIO_PACKAGE_DETAIL_ID " +
                "where c.STATUS not in (3,4) " +
                "and cd.STATUS in (1,2) " +
                "and c.PERFORMER_GROUP_ID in (:groupId) " +
                "and pg.GOODS_ID  in (:goodsId) " +
                "group by pg.GOODS_ID) " +

                "select " +
                "slt.GOODS_ID goodsId, " +
                "slt.GOODS_CODE goodsCode, " +
//                "nvl(slt.slton, 0), " +
//                "nvl(slyc.slycau, 0), " +
//                "nvl(slt.slton, 0) - nvl(slyc.slycau, 0) sldu " +
                "nvl(slt.slton, 0) - nvl(slyc.slycau, 0) quantity " +
                "from slt " +
                "LEFT join slyc on slt.GOODS_ID = slyc.GOODS_ID ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOPackageGoodsDTO.class));
        query.addScalar("quantity", new DoubleType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.setParameterList("groupId", groupIds);
        query.setParameterList("goodsId", goodsIds);

        return query.list();
    }

    public List<AIOPackageGoodsDTO> getPackageGoodsQuantityUsed(Long packageDetailId, Double quantity) {
        String sql = " select " +
                "(a.quantity * :qtt) quantity, " +
                " a.GOODS_ID goodsId, " +
                " a.GOODS_CODE goodsCode, " +
                " a.GOODS_NAME goodsName " +
                " from AIO_PACKAGE_GOODS a " +
                "where a.aio_package_detail_id = :packageDetailId ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("qtt", quantity);
        query.setParameter("packageDetailId", packageDetailId);
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.setResultTransformer(Transformers.aliasToBean(AIOPackageGoodsDTO.class));
        return query.list();
    }
}
