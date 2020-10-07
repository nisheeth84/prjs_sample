package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOOrdersBO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOConfigServiceDTO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIOProvinceDTO;
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
import java.util.Date;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioOrdersDAO")
public class AIOOrdersDAO extends BaseFWDAOImpl<AIOOrdersBO, Long> {

    public AIOOrdersDAO() {
        this.model = new AIOOrdersBO();
    }

    public AIOOrdersDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> doSearch(AIOOrdersDTO obj, List<String> idList) {
        StringBuilder sql = new StringBuilder("with TB as( SELECT  AI.AIO_ORDERS_ID aioOrdersId,")
                .append("CASE WHEN ROUND(( nvl(AI.APPROVED_DATE,sysdate) - AI.CREATED_DATE)*24,1) > 2 THEN 'Quá hạn xác nhận' ELSE '' END pastDueApproved,")
                .append("CASE WHEN (ROUND(( nvl(AI.CREATED_CONTRACT_DATE,sysdate) - nvl(AI.APPROVED_DATE,sysdate))*24,1) > 4  AND AI.STATUS !=4 ) THEN 'Quá hạn tạo hợp đồng' ELSE '' END pastDueContact ")
                .append(" FROM AIO_ORDERS AI) ")
                .append("select AI.AIO_ORDERS_ID aioOrdersId,")
                .append("select AI.ORDERS_CODE ordersCode,")
                .append(" AI.SERVICE_ID serviceId,")
                .append("AI.SERVICE_NAME serviceName,")
                .append("AI.CUSTOMER_NAME customerName,")
                .append("AI.CUSTOMER_ADDRESS customerAddress,")
                .append("AI.CUSTOMER_PHONE customerPhone,")
                .append("AI.APPROVED_DATE approvedDate,")
                .append("(TO_CHAR(AI.APPROVED_DATE, 'HH24:MI')) approvedDateStr,")
                .append("AI.STATUS status,")
                .append("AI.CREATED_CONTRACT_DATE createdContractDate,")
                .append("(TO_CHAR(AI.CREATED_CONTRACT_DATE, 'HH24:MI')) createdContractDateStr,")
                .append("AI.CREATED_DATE createdDate,")
                .append("(TO_CHAR(AI.CREATED_DATE, 'HH24:MI'))createdDateStr,")
                .append("TB.pastDueApproved pastDueApproved,")
                .append("TB.pastDueContact pastDueContact,")
                .append("AC.STATUS contractStatus ")
                .append("FROM AIO_ORDERS AI LEFT JOIN AIO_CONTRACT AC ON AI.CONTRACT_ID = AC.CONTRACT_ID ")
                .append("INNER JOIN TB ON TB.aioOrdersId = AI.AIO_ORDERS_ID ")
                .append("WHERE 1=1 ");

        if (idList != null && idList.size() > 0) {
            sql.append("AND AI.CAT_PROVINCE_ID IN (:idList)");
        }
        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            sql.append(" AND (upper(AI.CUSTOMER_PHONE) LIKE upper(:keySearch) OR upper(AI.CUSTOMER_ADDRESS) LIKE upper(:keySearch) OR upper(AI.CUSTOMER_NAME) LIKE upper(:keySearch))");
        }
        if (obj.getStartDate() != null) {
            sql.append("AND TRUNC(AI.CREATED_DATE) >= :startDate ");
        }
        if (obj.getEndDate() != null) {
            sql.append("AND TRUNC(AI.CREATED_DATE) <= :endDate ");
        }
        if (obj.getListStatusOrders() != null && obj.getListStatusOrders().size() > 0) {
            sql.append("AND AI.STATUS IN (:listStatusOrders) ");
        }
        if (obj.getLstStatus() != null) {
            if (obj.getLstStatus().equals("Chưa quá hạn")) {
                sql.append("and (TB.pastDueApproved is null and TB.pastDueContact is null) ");
            } else {
                sql.append("AND (upper(TB.pastDueContact) LIKE upper(:lstStatus) OR upper(TB.pastDueApproved) LIKE upper(:lstStatus)) ");
            }
        }
        sql.append(" ORDER BY AI.AIO_ORDERS_ID DESC ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT (*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("aioOrdersId", new LongType())
                .addScalar("serviceId", new LongType())
                .addScalar("serviceName", new StringType())
                .addScalar("customerName", new StringType())
                .addScalar("customerAddress", new StringType())
                .addScalar("customerPhone", new StringType())
                .addScalar("approvedDate", new DateType())
                .addScalar("approvedDateStr", new StringType())
                .addScalar("status", new LongType())
                .addScalar("createdContractDate", new DateType())
                .addScalar("createdContractDateStr", new StringType())
                .addScalar("createdDate", new DateType())
                .addScalar("pastDueApproved", new StringType())
                .addScalar("pastDueContact", new StringType())
                .addScalar("contractStatus", new StringType())
                .addScalar("createdDateStr", new StringType())
                .addScalar("ordersCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));

        if (idList != null && idList.size() > 0) {
            query.setParameterList("idList", idList);
            queryCount.setParameterList("idList", idList);
        }

        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());
            queryCount.setParameter("startDate", obj.getStartDate());
        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
            queryCount.setParameter("endDate", obj.getEndDate());
        }
        if (obj.getListStatusOrders() != null && obj.getListStatusOrders().size() > 0) {
            query.setParameterList("listStatusOrders", obj.getListStatusOrders());
            queryCount.setParameterList("listStatusOrders", obj.getListStatusOrders());
        }
        if (obj.getLstStatus() != null) {
            if (!obj.getLstStatus().equals("Chưa quá hạn")) {
                query.setParameter("lstStatus", obj.getLstStatus());
                queryCount.setParameter("lstStatus", obj.getLstStatus());
            }
        }

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> getDomainData(Long catProviceId, Long sysUserId) {
        StringBuilder sql = new StringBuilder("SELECT  e.DATA_ID catProviceId,")
                .append("a.SYS_USER_ID sysUserId,")
                .append("a.FULL_NAME fullName,")
                .append("a.EMAIL email,")
                .append("a.PHONE_NUMBER customerPhone ")
                .append("FROM SYS_USER a, USER_ROLE b, SYS_ROLE c, USER_ROLE_DATA d, ")
                .append("DOMAIN_DATA e, ROLE_PERMISSION role_per, permission pe, ")
                .append("OPERATION op, AD_RESOURCE ad  ")
                .append("WHERE a.SYS_USER_ID = b.SYS_USER_ID ")
                .append("AND b.SYS_ROLE_ID = c.SYS_ROLE_ID ")
                .append("AND b.USER_ROLE_ID = d.USER_ROLE_ID ")
                .append("AND d.DOMAIN_DATA_ID = e.DOMAIN_DATA_ID ")
                .append("AND c.SYS_ROLE_ID = role_per.SYS_ROLE_ID ")
                .append("AND role_per.permission_id = pe.permission_id ")
                .append("AND pe.OPERATION_id = op.OPERATION_id ")
                .append("AND pe.AD_RESOURCE_ID = ad.AD_RESOURCE_ID ")
                .append("AND  op.code ||' ' || ad.code   ='APPROVED CALLCENTER' ");
        if (catProviceId != null) {
            sql.append("AND e.DATA_ID =:catProviceId ");
        }
        if (sysUserId != null) {
            sql.append("AND a.SYS_USER_ID =:sysUserId ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("sysUserId", new LongType())
                .addScalar("fullName", new StringType())
                .addScalar("email", new StringType())
                .addScalar("customerPhone", new StringType())
                .addScalar("catProviceId", new LongType());
        if (catProviceId != null) {
            query.setParameter("catProviceId", catProviceId);
        }
        if (sysUserId != null) {
            query.setParameter("sysUserId", sysUserId);
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        return query.list();
    }


    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> autoSearchCatProvice(String keySearch) {
        StringBuilder sql = new StringBuilder("SELECT CAT_PROVINCE_ID catProviceId,")
                .append("CODE catProviceCode,")
                .append("NAME catProviceName ")
                .append("FROM CAT_PROVINCE WHERE STATUS=1 AND ROWNUM < 11 ");
        if (StringUtils.isNotBlank(keySearch)) {
            sql.append("AND (upper(CODE) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch)) ");
        }
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProviceId", new LongType());
        query.addScalar("catProviceCode", new StringType());
        query.addScalar("catProviceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        if (StringUtils.isNotBlank(keySearch)) {
            query.setParameter("keySearch", "%" + keySearch + "%");
        }
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> popupSearchCatProvice(AIOOrdersDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT CAT_PROVINCE_ID catProviceId,")
                .append("CODE catProviceCode,")
                .append("NAME catProviceName ")
                .append("FROM CAT_PROVINCE WHERE STATUS=1 ");
        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            sql.append("AND (upper(CODE) LIKE upper(:keySearch) OR upper(NAME) LIKE upper(:keySearch)) ");
        }
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT (*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
        query.addScalar("catProviceId", new LongType());
        query.addScalar("catProviceCode", new StringType());
        query.addScalar("catProviceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        if (StringUtils.isNotBlank(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> autoSearchService() {
        StringBuilder sql = new StringBuilder("SELECT CODE code, NAME serviceName FROM APP_PARAM WHERE PAR_TYPE='SERVICE_TYPE' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.addScalar("serviceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        return query.list();
    }

    @SuppressWarnings("unchecked")
    public List<AIOOrdersDTO> autoSearchChanel() {
        StringBuilder sql = new StringBuilder("SELECT CODE code, NAME contactChannel FROM APP_PARAM WHERE PAR_TYPE='CONTACT_CHANNEL' ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("contactChannel", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        return query.list();
    }

    public AIOOrdersDTO viewDetail(AIOOrdersDTO obj) {
        StringBuilder sql = new StringBuilder("select AI.AIO_ORDERS_ID aioOrdersId,")
                .append("(AI.CAT_PROVINCE_CODE ||'-' || AI.CAT_PROVINCE_NAME ) catProviceCode,")
                .append("AI.SERVICE_NAME serviceName,")
                .append("AI.CUSTOMER_NAME customerName,")
                .append("AI.CUSTOMER_ADDRESS customerAddress,")
                .append("AI.CUSTOMER_PHONE customerPhone,")
                .append("AI.QUANTITY_TEMP quantityTemp,")
                .append("AI.CONTENT_ORDER contentOrder,")
                .append("AI.CALL_DATE callDate,")
                .append("AP.NAME contactChannel,")
                .append("AI.STATUS status,")
                .append("AI.APPROVED_DATE approvedDate,")
                .append("(TO_CHAR(AI.APPROVED_DATE, 'HH24:MI')) approvedDateStr,")
                .append("AI.CREATED_CONTRACT_DATE createdContractDate,")
                .append("(TO_CHAR(AI.CREATED_CONTRACT_DATE, 'HH24:MI')) createdContractDateStr,")
                .append("AI.CREATED_DATE createdDate,")
                .append("(TO_CHAR(AI.CREATED_DATE, 'HH24:MI'))createdDateStr,")
                .append("AI.REASON_CLOSE reasonClose,")
                .append("AI.DATE_CLOSE dateClose,")
                .append("(TO_CHAR(AI.DATE_CLOSE, 'HH24:MI'))dateCloseStr ")
                .append("FROM AIO_ORDERS AI ")
                .append("LEFT JOIN CTCT_CAT_OWNER.APP_PARAM AP ON AP.CODE=AI.CONTACT_CHANNEL AND AP.PAR_TYPE='CONTACT_CHANNEL' ")
                .append("WHERE 1=1 ");
        if (obj.getAioOrdersId() != null) {
            sql.append("AND AI.AIO_ORDERS_ID =:aioOrdersId ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("aioOrdersId", new LongType())
                .addScalar("catProviceCode", new StringType())
                .addScalar("serviceName", new StringType())
                .addScalar("customerName", new StringType())
                .addScalar("customerAddress", new StringType())
                .addScalar("customerPhone", new StringType())
                .addScalar("quantityTemp", new DoubleType())
                .addScalar("contentOrder", new StringType())
                .addScalar("callDate", new StringType())
                .addScalar("contactChannel", new StringType())
                .addScalar("status", new LongType())
                .addScalar("approvedDate", new DateType())
                .addScalar("approvedDateStr", new StringType())
                .addScalar("createdContractDate", new DateType())
                .addScalar("createdContractDateStr", new StringType())
                .addScalar("createdDate", new DateType())
                .addScalar("createdDateStr", new StringType())
                .addScalar("reasonClose", new StringType())
                .addScalar("dateClose", new DateType())
                .addScalar("dateCloseStr", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        if (obj.getAioOrdersId() != null) {
            query.setParameter("aioOrdersId", obj.getAioOrdersId());
        }
        return (AIOOrdersDTO) query.uniqueResult();

    }

    public Long confirmStatus(AIOOrdersDTO obj) {
        StringBuilder sql = new StringBuilder("UPDATE AIO_ORDERS SET STATUS=:status ");

        if (StringUtils.isNotBlank(obj.getReasonClose())) {
            sql.append(",REASON_CLOSE =:reasonClose ");
            sql.append(",DATE_CLOSE = sysdate ");
        } else {
            sql.append(",APPROVED_DATE = sysdate ");
        }
        sql.append("WHERE AIO_ORDERS_ID =:aioOrdersId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("status", obj.getStatus());
        query.setParameter("aioOrdersId", obj.getAioOrdersId());
        if (StringUtils.isNotBlank(obj.getReasonClose())) {
            query.setParameter("reasonClose", obj.getReasonClose());
        }
        int result = query.executeUpdate();
        return result != 0 ? 1L : 0L;
    }

    public List<AIOProvinceDTO> getListProvince() {
        String sql = "SELECT " +
                "CAT_PROVINCE_ID catProvinceId, " +
                "CODE, " +
                "NAME, " +
                "PROVINCE_ID_VTP provinceIdVtp " +
                "FROM cat_province where status = 1 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOProvinceDTO.class));
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceIdVtp", new LongType());

        return query.list();
    }

    public List<AIOOrdersDTO> getOrdersByIds(List<String> codes) {
        String sql = "SELECT AIO_ORDERS_ID aioOrdersId, ORDER_CODE_VTP orderCodeVTP from aio_orders " +
                "where ORDER_CODE_VTP in (:codes) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        query.addScalar("aioOrdersId", new LongType());
        query.addScalar("orderCodeVTP", new StringType());
        query.setParameterList("codes", codes);

        return query.list();
    }

    public List<AIOOrdersDTO> getOrdersIdsByCode(String code) {
        String sql = "SELECT AIO_ORDERS_ID aioOrdersId " +
                "from aio_orders " +
                "where ORDER_CODE_VTP = :codes ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        query.addScalar("aioOrdersId", new LongType());
        query.setParameter("codes", code);

        return query.list();
    }

    public int updateCancelOrderVoSo(String code, Date updateDate) {
        String sql = "update aio_orders " +
                "set status = 4, " +
                "UPDATED_DATE = :updateDate " +
                "where ORDER_CODE_VTP = :code ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("code", code);
        query.setParameter("updateDate", updateDate);

        return query.executeUpdate();
    }

    public List<AIOOrdersDTO> getListOrder(Long userId) {
        String sql = "SELECT " +
                "od.AIO_ORDERS_ID aioOrdersId, " +
                "od.ORDER_CODE orderCode, " +
                "od.ORDERS_TYPE ordersType, " +
                "od.DESCRIPTION description, " +
                "od.REASON_NAME reasonName, " +
                "od.SERVICE_NAME serviceName, " +
                "od.CUSTOMER_NAME customerName, " +
                "od.CUSTOMER_ADDRESS customerAddress, " +
                "od.CUSTOMER_PHONE customerPhone, " +
                "od.STATUS status, " +
                "od.END_DATE endDate " +
                ", to_char(od.END_DATE, 'HH24:MI') endDateStr " +
                ", od.QUANTITY_TEMP quantityTemp " +
                ", od.CONTENT_ORDER contentOrder " +
                ", od.PERFORMER_ID performerId " +
                ", od.CREATED_USER createdUser " +
                ", od.area_id areaId " +
                ", (aa.path) provinceId " +
                ", (aa.path) districtId " +
                ", TO_NUMBER((substr(aa.path, INSTR(aa.path, '/', 1, 2) + 1, INSTR(aa.path, '/', 1, 2 + 1) - (INSTR(aa.path, '/', 1, 2) + 1)))) areaProvinceId " +
                ", TO_NUMBER((substr(aa.path, INSTR(aa.path, '/', 1, 3) + 1, INSTR(aa.path, '/', 1, 3 + 1) - (INSTR(aa.path, '/', 1, 3) + 1)))) areaDistrictId " +
                "FROM AIO_ORDERS od " +
                "left join aio_area aa on aa.area_id = od.area_id " +
                "where 1=1 " +
                "and (od.CREATED_USER = :userId or od.PERFORMER_ID = :userId) " +
                "and od.CREATED_DATE > sysdate - 90 " +
                "order by od.AIO_ORDERS_ID desc ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        query.setParameter("userId", userId);
        query.addScalar("aioOrdersId", new LongType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("ordersType", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("reasonName", new StringType());
        query.addScalar("serviceName", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("endDate", new DateType());
        query.addScalar("endDateStr", new StringType());
        query.addScalar("quantityTemp", new DoubleType());
        query.addScalar("contentOrder", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("areaId", new LongType());
        query.addScalar("areaProvinceId", new LongType());
        query.addScalar("areaDistrictId", new LongType());

        return query.list();
    }

    // get list reason
    // get list service
    // get list channel
    public List<AppParamDTO> getMetaData() {
        StringBuilder sql = new StringBuilder()
                .append("select app_param_id id, code code, name name, null industryCode, null industryName, PAR_TYPE parType, null text from app_param where par_type in ('ORDERS_REASON','CONTACT_CHANNEL') ")
                .append("union all ")
                .append("select AIO_CONFIG_SERVICE_Id id, TRANSLATE (type USING NCHAR_CS) code, NAME name, industry_code industryCode, industry_name industryName, TRANSLATE ('SERVICE' USING NCHAR_CS) parType, CAST(STATUS AS NVARCHAR2(50)) text from aio_config_service ")
                .append("order by code ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parType", new StringType());
        query.addScalar("text", new StringType());
        query.addScalar("industryName", new StringType());
        query.addScalar("industryCode", new StringType());
        return query.list();
    }

    public Long getStatusOrder(Long id) {
        String sql = "select status from aio_orders where AIO_ORDERS_ID = " + id;
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("status", new LongType());
        return (Long) query.uniqueResult();
    }

    public int updateApproveOrder(AIOOrdersDTO ordersDTO) {
        String sql = "UPDATE AIO_ORDERS SET " +
                "STATUS = :status, " +
                "DESCRIPTION = :desc, " +
                "APPROVED_DATE = sysdate, " +
                "UPDATED_DATE = :updateDate, " +
                "UPDATED_USER = :updateUser, " +
                "UPDATED_GROUP_ID = :updateGroupId, ";
        if (ordersDTO.getReasonId() != null) {
            sql += "REASON_ID = :reasonId, REASON_NAME = :reasonName ";
        } else if (ordersDTO.getQuantity() != null && ordersDTO.getQuantity() != 0) {
            sql += "QUANTITY = :quantity ";
        }
        sql += "where AIO_ORDERS_ID = " + ordersDTO.getAioOrdersId();

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", ordersDTO.getStatus());
        query.setParameter("desc", ordersDTO.getDescription());
        query.setParameter("updateDate", ordersDTO.getUpdatedDate());
        query.setParameter("updateUser", ordersDTO.getUpdatedUser());
        query.setParameter("updateGroupId", ordersDTO.getUpdatedGroupId());
        if (ordersDTO.getReasonId() != null) {
            query.setParameter("reasonId", ordersDTO.getReasonId());
            query.setParameter("reasonName", ordersDTO.getReasonName());
        } else if (ordersDTO.getQuantity() != null && ordersDTO.getQuantity() != 0) {
            query.setParameter("quantity", ordersDTO.getQuantity());
        }

        return query.executeUpdate();
    }

    public AIOOrdersDTO getOrderInfo(Long id) {
        String sql = "SELECT " +
                "STATUS status, " +
                "CREATED_USER createdUser, " +
                "CREATED_GROUP_ID createdGroupId " +
                "FROM AIO_ORDERS where AIO_ORDERS_ID = " + id;
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        query.addScalar("status", new LongType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdGroupId", new LongType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOOrdersDTO) query.list().get(0);
        }
        return null;
    }

    public int updateOrderCreatedUser(AIOOrdersDTO obj) {
        String sql = "update AIO_ORDERS set " +
                "SERVICE_ID = :serviceId, " +
                "SERVICE_NAME = :serviceName, " +
                "CUSTOMER_NAME = :customerName, " +
                "CUSTOMER_ADDRESS = :customerAddress, " +
                "CUSTOMER_PHONE = :customerPhone, " +
                "QUANTITY_TEMP = :quantityTemp, " +
                "CONTENT_ORDER = :contentOrder, " +
                "CONTACT_CHANNEL = :contactChannel, " +
                "UPDATED_DATE = :updatedDate, " +
                "UPDATED_USER = :updatedUser, " +
                "UPDATED_GROUP_ID = :updatedGroupId, " +
                "where AIO_ORDERS_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("serviceId", obj.getServiceId());
        query.setParameter("serviceName", obj.getServiceName());
        query.setParameter("customerName", obj.getCustomerName());
        query.setParameter("customerAddress", obj.getCustomerAddress());
        query.setParameter("customerPhone", obj.getCustomerPhone());
        query.setParameter("quantityTemp", obj.getQuantityTemp());
        query.setParameter("contentOrder", obj.getContentOrder());
        query.setParameter("contactChannel", obj.getContactChannel());
        query.setParameter("updatedDate", obj.getUpdatedDate());
        query.setParameter("updatedUser", obj.getUpdatedUser());
        query.setParameter("updatedGroupId", obj.getUpdatedGroupId());
        query.setParameter("id", obj.getAioOrdersId());

        return query.executeUpdate();
    }

    //tungmt92 start 17122019
    public List<AIOOrdersDTO> doSearchOrders(AIOOrdersDTO aioOrdersDTO) {
        StringBuilder sql = new StringBuilder("Select " +
                "aOrder.Aio_Orders_Id aioOrdersId, " +
                "aOrder.Orders_Type ordersType, " +
                "aOrder.Service_Name serviceName, " +
                "aOrder.Service_Id serviceId, " +
                "aOrder.Created_Date createdDate, " +
                "aOrder.Status status, " +
                "aOrder.Created_User createdUser, " +
                "bContract.Status statusContract, " +
                "aOrder.Customer_Name customerName, " +
                "aOrder.Customer_Phone customerPhone, " +
                "aOrder.Customer_Address customerAddress, " +
                "aOrder.Approved_Date approvedDate, " +
                "aOrder.Reason_Close reasonClose, " +
                "aOrder.ORDER_CODE orderCode, " +
                "aOrder.PERFORMER_ID performerId, " +
                "sUser.Full_Name as performerName, " +
                "aOrder.Created_Contract_Date createdContractDate, " +
                "aOrder.Quantity_Temp quantityTemp, " +
                "aOrder.CONTENT_ORDER contentOrder, " +
                "aOrder.INDUSTRY_CODE industryCode, " +
                "aOrder.INDUSTRY_NAME industryName, " +
                "aOrder.CAT_PROVINCE_ID catProviceId, " +
                "aOrder.AREA_ID areaId, " +
                "aOrder.Description description, ")
                .append("CASE WHEN (aOrder.END_DATE > SYSDATE) THEN 'Trong hạn' ")
                .append("WHEN ((SYSDATE > aOrder.END_DATE And aOrder.STATUS = 1) OR aOrder.APPROVED_DATE > aOrder.END_DATE ) THEN 'Quá hạn khảo sát' ")
                .append("WHEN ((SYSDATE > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 2) " +
                        "OR (aOrder.created_contract_date  > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 4 )) " +
                        "THEN 'Quá hạn tạo hợp đồng' ")
                .append("WHEN ((SYSDATE > ( aOrder.created_contract_date + 3 ))" +
                        "OR (cContract.END_DATE > ( aOrder.created_contract_date + 3 )  AND bContract.status NOT IN (3,4))) " +
                        "THEN 'Quá hạn đóng hợp đồng' ELSE '' END statusObsoleteContract ")
                .append(" From AIO_Orders aOrder LEFT JOIN AIO_CONTRACT bContract ON aOrder.CONTRACT_ID = bContract.CONTRACT_ID ")
                .append("LEFT JOIN AIO_CONTRACT_PERFORM_DATE cContract ON aOrder.CONTRACT_ID = cContract.CONTRACT_ID ")
                .append("LEFT JOIN SYS_USER sUser ON  aOrder.PERFORMER_ID = sUser.SYS_USER_ID ")
                .append("WHERE 1=1 ");
        if (aioOrdersDTO.getContentSearch() != null && aioOrdersDTO.getContentSearch().length() > 0) {
            if (!aioOrdersDTO.getContentSearch().matches("^[a-zA-Z ]*$")) {
                sql.append("AND (Upper(aOrder.ORDER_CODE) like Upper(:orderCode) escape '&' Or Upper(aOrder.CUSTOMER_NAME) like Upper(:orderCode) escape '&' Or " +
                        "Upper(aOrder.CUSTOMER_PHONE) like Upper(:orderCode) escape '&' Or Upper(aOrder.CUSTOMER_ADDRESS) like Upper(:orderCode) escape '&') ");
            } else {
                sql.append("AND (Upper(utl_raw.cast_to_nvarchar2(nlssort((aOrder.ORDER_CODE),'nls_sort = binary_ai'))) like Upper(:orderCode) escape '&' " +
                        "Or Upper(utl_raw.cast_to_nvarchar2(nlssort((aOrder.CUSTOMER_NAME),'nls_sort = binary_ai'))) like Upper(:orderCode) escape '&' " +
                        "Or Upper(utl_raw.cast_to_nvarchar2(nlssort((aOrder.CUSTOMER_PHONE),'nls_sort = binary_ai'))) like Upper(:orderCode) escape '&' " +
                        "Or Upper(utl_raw.cast_to_nvarchar2(nlssort((aOrder.CUSTOMER_ADDRESS),'nls_sort = binary_ai'))) like Upper(:orderCode) escape '&') ");
            }
        }
        if (aioOrdersDTO.getStartDate() != null) {
            sql.append("AND TRUNC(aOrder.CREATED_DATE) >= :startDate ");
        }
        if (aioOrdersDTO.getEndDate() != null) {
            sql.append("AND TRUNC(aOrder.CREATED_DATE) <= :endDate ");
        }
        if (aioOrdersDTO.getCreatedUser() != null) {
            sql.append("And aOrder.CREATED_USER like :createUser ");
        }
        if (aioOrdersDTO.getOrderStatus() != null && aioOrdersDTO.getOrderStatus() != 0) {
            sql.append("And aOrder.STATUS =:orderStatus ");
        }

        if (aioOrdersDTO.getObsoleteStatus() != null) {
            switch (aioOrdersDTO.getObsoleteStatus()) {
                case 0:
                    break;
                case 1:
                    sql.append("And (aOrder.END_DATE > SYSDATE ) ");
                    break;
                case 2:
                    sql.append("And ((SYSDATE > aOrder.END_DATE And aOrder.STATUS = 1) OR aOrder.APPROVED_DATE > aOrder.END_DATE ) ");
                    break;
                case 3:
                    sql.append("And ((SYSDATE > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 2) " +
                            "OR (CREATED_CONTRACT_DATE  > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 4)) ");
                    break;
                case 4:
                    sql.append("And ((SYSDATE > ( aOrder.created_contract_date + 3 )) OR (((cContract.END_DATE > ( aOrder.created_contract_date + 3 ))  AND bContract.status NOT IN (3,4)))) ");
                    break;
            }
        }
        if (aioOrdersDTO.getOrderFrom() != null && aioOrdersDTO.getOrderFrom() != 0) {
            sql.append("And aOrder.ORDERS_TYPE =:orderFrom ");
        }

        sql.append(" Order by aOrder.Aio_Orders_Id DESC");
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT (*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("aioOrdersId", new LongType());
        query.addScalar("ordersType", new LongType());
        query.addScalar("serviceId", new LongType());
        query.addScalar("serviceName", new StringType());
        query.addScalar("industryCode", new StringType());
        query.addScalar("industryName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("status", new LongType());
        query.addScalar("statusContract", new LongType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("approvedDate", new DateType());
        query.addScalar("reasonClose", new StringType());
        query.addScalar("createdContractDate", new DateType());
        query.addScalar("quantityTemp", new DoubleType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("contentOrder", new StringType());
        query.addScalar("statusObsoleteContract", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("catProviceId", new LongType());
        query.addScalar("areaId", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));

        if (aioOrdersDTO.getContentSearch() != null && aioOrdersDTO.getContentSearch().length() > 0) {
            query.setParameter("orderCode", "%" + aioOrdersDTO.getContentSearch() + "%");
            queryCount.setParameter("orderCode", "%" + aioOrdersDTO.getContentSearch() + "%");
//			query.setParameter("customerName", aioOrdersDTO.getContentSearch());
//			query.setParameter("customerPhone", aioOrdersDTO.getContentSearch());
//			query.setParameter("customerAddress", aioOrdersDTO.getContentSearch());
        }
        if (aioOrdersDTO.getStartDate() != null) {
            query.setParameter("startDate", aioOrdersDTO.getStartDate());
            queryCount.setParameter("startDate", aioOrdersDTO.getStartDate());
        }
        if (aioOrdersDTO.getEndDate() != null) {
            query.setParameter("endDate", aioOrdersDTO.getEndDate());
            queryCount.setParameter("endDate", aioOrdersDTO.getEndDate());
        }
        if (aioOrdersDTO.getOrderFrom() != null && aioOrdersDTO.getOrderFrom() != 0) {
            query.setParameter("orderFrom", aioOrdersDTO.getOrderFrom());
            queryCount.setParameter("orderFrom", aioOrdersDTO.getOrderFrom());
        }
        if (aioOrdersDTO.getOrderStatus() != null && aioOrdersDTO.getOrderStatus() != 0) {
            query.setParameter("orderStatus", aioOrdersDTO.getOrderStatus());
            queryCount.setParameter("orderStatus", aioOrdersDTO.getOrderStatus());
        }
        if (aioOrdersDTO.getCreatedUser() != null) {
            query.setParameter("createUser", aioOrdersDTO.getCreatedUser());
            queryCount.setParameter("createUser", aioOrdersDTO.getCreatedUser());
        }

        this.setPageSize(aioOrdersDTO, query, queryCount);
        return query.list();
    }

    //tungmt92 start 17122019
    public AIOOrdersDTO getDetailAioOrder(AIOOrdersDTO aioOrdersDTO) {
        StringBuilder sql = new StringBuilder("Select " +
                "aOrder.Aio_Orders_Id aioOrdersId, " +
                "aOrder.Orders_Type ordersType, " +
                "aOrder.ORDER_CODE orderCode, " +
                "aOrder.Service_Name serviceName, " +
                "aOrder.Service_Id serviceId, " +
                "aOrder.Created_Date createdDate, " +
                "aOrder.Status statusOrder, " +
                "aContract.Status statusContract, " +
                "aOrder.Customer_Name customerName, " +
                "aOrder.Customer_Phone customerPhone, " +
                "aOrder.Customer_Address customerAddress, " +
                "aOrder.Approved_Date approvedDate, " +
                "aOrder.Reason_Close reasonClose, " +
                "aOrder.CREATED_USER createdUser, " +
                "aOrder.PERFORMER_ID performerId, " +
                "sUser.Full_Name as performerName, " +
                "aOrder.Created_Contract_Date createdContractDate, " +
                "aOrder.Quantity_Temp quantityTemp, " +
                "aOrder.CONTENT_ORDER contentOrder, " +
                "aOrder.Description description, "    +
                "aOrder.Industry_Code industryCode, ")
                .append("CASE WHEN (aOrder.END_DATE > SYSDATE) THEN 'Trong hạn' ")
                .append("WHEN ((SYSDATE > aOrder.END_DATE And aOrder.STATUS = 1) OR aOrder.APPROVED_DATE > aOrder.END_DATE ) THEN 'Quá hạn khảo sát' ")
                .append("WHEN ((SYSDATE > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 2 )" +
                        " OR (CREATED_CONTRACT_DATE  > (aOrder.APPROVED_DATE + ((Select OPTION_NUMBER FROM APP_PARAM WHERE PAR_TYPE = 'ORDER_CREAT_CONTRACT')/24)) and aOrder.STATUS = 4 )) THEN 'Quá hạn tạo hợp đồng' ")
                .append("WHEN ((SYSDATE > ( aOrder.created_contract_date + 3 )) OR ((cContract.END_DATE > ( aOrder.created_contract_date + 3 )) AND aContract.status NOT IN (3,4))) THEN 'Quá hạn đóng hợp đồng' ELSE '' END statusObsoleteContract ");
        SQLQuery query;
        sql.append("From AIO_ORDERS aOrder ");
        sql.append("Left Join AIO_CONTRACT aContract ON aOrder.CONTRACT_ID = aContract.CONTRACT_ID ");
        sql.append("LEFT JOIN AIO_CONTRACT_DETAIL cContract ON aOrder.CONTRACT_ID = cContract.CONTRACT_ID ");
        sql.append("LEFT JOIN SYS_USER sUser ON  aOrder.PERFORMER_ID = sUser.SYS_USER_ID ");

        sql.append("Where aOrder.AIO_ORDERS_ID =:aioOrdersId ");
        query = this.getSession().createSQLQuery(sql.toString());

        query.addScalar("aioOrdersId", new LongType());
        query.addScalar("ordersType", new LongType());
        query.addScalar("orderCode", new StringType());
        query.addScalar("serviceId", new LongType());
        query.addScalar("serviceName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("statusOrder", new LongType());
        query.addScalar("statusContract", new LongType());
        query.addScalar("customerName", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("reasonClose", new StringType());
        query.addScalar("approvedDate", new DateType());
        query.addScalar("createdContractDate", new DateType());
        query.addScalar("quantityTemp", new DoubleType());
        query.addScalar("performerId", new LongType());
        query.addScalar("description", new StringType());
        query.addScalar("contentOrder", new StringType());
        query.addScalar("statusObsoleteContract", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("industryCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOOrdersDTO.class));
        //query.addScalar("checkSysUser", new StringType());

        query.setParameter("aioOrdersId", aioOrdersDTO.getAioOrdersId());
        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOOrdersDTO) query.list().get(0);
        }
        return null;
    }

    public Long updateAioOrders(AIOOrdersDTO obj) {
        StringBuilder sql = new StringBuilder("update AIO_ORDERS set ")
                .append("SERVICE_ID = :serviceId, ")
                .append("SERVICE_NAME = :serviceName, ")
                .append("CUSTOMER_NAME = :customerName, ")
                .append("INDUSTRY_CODE = :industryCode, ")
                .append("INDUSTRY_NAME = :industryName, ")
                .append("CUSTOMER_ADDRESS = :customerAddress, ")
                .append("CUSTOMER_PHONE = :customerPhone, ")
                .append("QUANTITY_TEMP = :quantityTemp, ")
                .append("REASON_CLOSE =  :reasonClose, ")
                .append("ORDERS_TYPE =  :ordersType, ")
                .append("UPDATED_DATE = :updatedDate, ")
                .append("UPDATED_USER = :updatedUser, ")
                .append("UPDATED_GROUP_ID = :updatedGroupId, ")
                .append("Description = :description, ")
                .append("Status = :status, ")
                .append("Approved_Date = :approvedDate ")
                .append("where AIO_ORDERS_ID = :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("serviceId", obj.getServiceId(), new LongType());
        query.setParameter("serviceName", obj.getServiceName(), new StringType());
        query.setParameter("customerName", obj.getCustomerName(), new StringType());
        query.setParameter("customerAddress", obj.getCustomerAddress(), new StringType());
        query.setParameter("customerPhone", obj.getCustomerPhone(), new StringType());
        query.setParameter("quantityTemp", obj.getQuantityTemp(), new DoubleType());
        query.setParameter("reasonClose", obj.getReasonClose(), new StringType());
        query.setParameter("updatedDate", obj.getUpdatedDate(), new DateType());
        query.setParameter("updatedUser", obj.getUpdatedUser(), new LongType());
        query.setParameter("updatedGroupId", obj.getUpdatedGroupId(), new LongType());
        query.setParameter("description", obj.getDescription(), new StringType());
        query.setParameter("industryCode", obj.getDescription(), new StringType());
        query.setParameter("industryName", obj.getDescription(), new StringType());
        query.setParameter("status", obj.getStatus(), new LongType());
        query.setParameter("ordersType", obj.getOrdersType(), new LongType());
        query.setParameter("approvedDate", obj.getApprovedDate(), new DateType());
        query.setParameter("id", obj.getAioOrdersId(), new LongType());

        return (long) query.executeUpdate();
    }


    // Lấy quận/huyện
    public List<AIOAreaDTO> getDataDistrict(Long id) {
        StringBuilder sql = new StringBuilder("SELECT AREA_ID areaId, "
                + "code code, " + "name name, " + "PROVINCE_ID provinceId, "
                + "AREA_LEVEL areaLevel " + "FROM AIO_AREA "
                + "where AREA_LEVEL=3 and PROVINCE_ID=:id order by AREA_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("areaLevel", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", id);
        return query.list();
    }

    //lay xa phuong
    public List<AIOAreaDTO> getDataWard(Long id) {
        StringBuilder sql = new StringBuilder("SELECT AREA_ID areaId, "
                + "code code, " + "sys_user_id sysUserId, " + "name name, "
                + "PROVINCE_ID provinceId, " + "AREA_LEVEL areaLevel "
                + "FROM AIO_AREA "
                + "where AREA_LEVEL=4 and PARENT_ID=:id order by AREA_ID asc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("areaId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("areaLevel", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", id);
        return query.list();
    }

    public AIOConfigServiceDTO getTypeAIOConf(Long Id) {
        StringBuilder sql = new StringBuilder()
                .append("select a.TYPE type ")
                .append("from AIO_CONFIG_SERVICE a ")
                .append("where a.AIO_CONFIG_SERVICE_Id = :Id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOConfigServiceDTO.class));
        query.addScalar("type", new LongType());
        query.setParameter("Id", Id);
        return (AIOConfigServiceDTO) query.uniqueResult();
    }

    public AIOAreaDTO getAreaPathByAreaId(Long idArea){
        StringBuilder sql = new StringBuilder()
                .append("select  a.path path ")
                .append(" from aio_area a ")
                .append(" where a.area_id =:idArea ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.addScalar("path", new StringType());
        query.setParameter("idArea", idArea);
        return (AIOAreaDTO)query.uniqueResult();
    }
    //tungmt92 end
}

