package com.viettel.aio.dao;

import com.viettel.aio.bo.AIORequestBHSCBO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.aio.dto.AIORequestBHSCDTO;
import com.viettel.aio.dto.AIORequestBHSCDetailDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
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

//VietNT_20190913_create
@EnableTransactionManagement
@Transactional
@Repository("aioRequestBhscDAO")
public class AIORequestBHSCDAO extends BaseFWDAOImpl<AIORequestBHSCBO, Long> {

    public AIORequestBHSCDAO() {
        this.model = new AIORequestBHSCBO();
    }

    public AIORequestBHSCDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    private static final String HIBERNATE_ESCAPE_CHAR = "\\";

    public List<AIORequestBHSCDTO> doSearch(AIORequestBHSCDTO criteria) {
        String statusCondition = StringUtils.EMPTY;
        String warrantyFromCondition = StringUtils.EMPTY;
        String keywordCondition = StringUtils.EMPTY;
        String fromDateCondition = StringUtils.EMPTY;
        String toDateCondition = StringUtils.EMPTY;
        String performerGroupIdCondition = "AND r.PERFORMER_GROUP_ID IN (:performerGroupIds) ";

        if (criteria.getStatus() != null && criteria.getStatus() != 0) {
            statusCondition = "AND r.STATUS = :status ";
        }

        if (criteria.getWarrantyForm() != null && criteria.getWarrantyForm() != 0) {
            warrantyFromCondition = "AND r.WARRANTY_FORM = :warrantyForm ";
        }

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            keywordCondition = "AND (UPPER(r.CUSTOMER_ID) like UPPER(:keyword) ";
//            keywordCondition += "OR UPPER(r.CUSTOMER_CODE) like UPPER(:keyword) ";
//            keywordCondition += "OR UPPER(r.CUSTOMER_NAME) like UPPER(:keyword) ";
//            keywordCondition += "OR UPPER(r.CUSTOMER_ADDRESS) like UPPER(:keyword) ";
//            keywordCondition += "OR UPPER(r.CUSTOMER_PHONE) like UPPER(:keyword)) ";

            keywordCondition = "AND (UPPER(r.CUSTOMER_ID) like UPPER(:keySearch) escape '" + HIBERNATE_ESCAPE_CHAR + "' ";
            keywordCondition += "OR UPPER(r.CUSTOMER_CODE) like UPPER(:keySearch) escape '" + HIBERNATE_ESCAPE_CHAR + "' ";
            keywordCondition += "OR UPPER(r.CUSTOMER_NAME) like UPPER(:keySearch) escape '" + HIBERNATE_ESCAPE_CHAR + "' ";
            keywordCondition += "OR UPPER(r.CUSTOMER_ADDRESS) like UPPER(:keySearch) escape '" + HIBERNATE_ESCAPE_CHAR + "' ";
            keywordCondition += "OR UPPER(r.CUSTOMER_PHONE) like UPPER(:keySearch) escape '" + HIBERNATE_ESCAPE_CHAR + "') ";
        }

        if (criteria.getFromDate() != null) {
            fromDateCondition = "AND trunc(:dateFrom) <= trunc(r.CREATED_DATE) ";
        }

        if (criteria.getToDate() != null) {
            toDateCondition = "AND trunc(:toDate) >= trunc(r.CREATED_DATE) ";
        }

        StringBuilder sql = new StringBuilder("SELECT ")
                .append("distinct r.AIO_REQUEST_BHSC_ID aioRequestBhscId, ")
                .append("r.CUSTOMER_ID customerId, ")
                .append("r.CUSTOMER_CODE customerCode, ")
                .append("r.CUSTOMER_NAME customerName, ")
                .append("r.CUSTOMER_ADDRESS customerAddress, ")
                .append("r.CUSTOMER_PHONE customerPhone, ")
                .append("r.STATE state, ")
                .append("r.WARRANTY_FORM warrantyForm, ")
                .append("r.STATUS_APPROVED statusApproved, ")
                .append("r.PERFORMER_ID performerId, ")
                .append("r.STATUS status, ")
                .append("r.DESCRIPTION_STATUS descriptionStatus, ")
                .append("to_char(r.START_DATE, 'HH24:MI DD/MM/YYYY') startDateStr, ")
                .append("to_char(r.END_DATE, 'HH24:MI DD/MM/YYYY') endDateStr, ")
                .append("r.CREATED_USER createdUser, ")
                .append("r.CREATED_DATE createdDate, ")
                .append("r.UPDATED_USER updatedUser, ")
                .append("r.UPDATED_DATE updatedDate, ")
                .append("u.FULL_NAME performerName, ")
                .append("u.EMAIL performerEmail, ")
                .append("u.EMPLOYEE_CODE performerCode ")
                .append("FROM AIO_REQUEST_BHSC r ")
                .append("left join SYS_USER u on u.SYS_USER_ID = r.PERFORMER_ID ")
                .append("WHERE 1=1 ")
                .append(keywordCondition)
                .append(warrantyFromCondition)
                .append(statusCondition)
                .append(fromDateCondition)
                .append(toDateCondition)
                .append(performerGroupIdCondition)
                .append("order by r.AIO_REQUEST_BHSC_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(
                "SELECT COUNT(*) FROM (" + sql.toString() + ")");


        if (criteria.getStatus() != null && criteria.getStatus() != 0) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }

        if (criteria.getWarrantyForm() != null && criteria.getWarrantyForm() != 0) {
            query.setParameter("warrantyForm", criteria.getWarrantyForm());
            queryCount.setParameter("warrantyForm", criteria.getWarrantyForm());
        }

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            query.setParameter("keyword", "%" + criteria.getKeySearch() + "%");
//            queryCount.setParameter("keyword", "%" + criteria.getKeySearch() + "%");
            String escapedKeySearch = criteria.getKeySearch().replace("\\", HIBERNATE_ESCAPE_CHAR + "\\")
                    .replace("_", HIBERNATE_ESCAPE_CHAR + "_")
                    .replace("%", HIBERNATE_ESCAPE_CHAR + "%");
            query.setParameter("keySearch", "%" + escapedKeySearch + "%");
            queryCount.setParameter("keySearch", "%" + escapedKeySearch + "%");
        }

        if (criteria.getFromDate() != null) {
            query.setParameter("dateFrom", criteria.getFromDate());
            queryCount.setParameter("dateFrom", criteria.getFromDate());
        }

        if (criteria.getToDate() != null) {
            query.setParameter("toDate", criteria.getToDate());
            queryCount.setParameter("toDate", criteria.getToDate());
        }

        query.setParameterList("performerGroupIds", criteria.getPerformerGroupIds());
        queryCount.setParameterList("performerGroupIds", criteria.getPerformerGroupIds());

        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));
        query.addScalar("aioRequestBhscId", new LongType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("warrantyForm", new LongType());
        query.addScalar("statusApproved", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("startDateStr", new StringType());
        query.addScalar("endDateStr", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerEmail", new StringType());
        query.addScalar("descriptionStatus", new StringType());

        if (criteria.getAioRequestBhscId() == null) {
            this.setPageSize(criteria, query, queryCount);
        }

        return query.list();
    }

    public int udpateStatusApproved(Long requestId, Long statusApproved, Long sysUserId) {
        String sql = "UPDATE AIO_REQUEST_BHSC SET " +
                "STATUS_APPROVED = :statusApproved, " +
                "UPDATED_DATE = SYSDATE, " +
                "UPDATED_USER = :sysUserId " +
                "WHERE AIO_REQUEST_BHSC_ID = :requestId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("statusApproved", statusApproved);
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("requestId", requestId);

        return query.executeUpdate();
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

    public int choosePerformer(Long performerId, List<Long> requestBhscIds, Long sysUserId) {
        String sql = "UPDATE AIO_REQUEST_BHSC SET " +
                "PERFORMER_ID = :performerId, " +
                "UPDATED_DATE = SYSDATE, " +
                "UPDATED_USER = :sysUserId " +
                "WHERE AIO_REQUEST_BHSC_ID IN (:requestIds) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("performerId", performerId);
        query.setParameter("sysUserId", sysUserId);
        query.setParameterList("requestIds", requestBhscIds);

        return query.executeUpdate();
    }

    public Long getPerformerIdByContract(Long contractId) {
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(" case ct.TYPE ");
        sql.append("    when 1 then a.SYS_USER_ID ");
        sql.append("    when 2 then a.SALE_SYS_USER_ID ");
        sql.append(" end performerId ");
        sql.append(" from AIO_AREA a, AIO_CUSTOMER c, AIO_CONTRACT ct ");
        sql.append(" where c.CUSTOMER_ID = ct.CUSTOMER_ID  ");
        sql.append(" and a.AREA_ID = c.AIO_AREA_ID ");
        sql.append(" and ct.CONTRACT_ID = :contractId ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setParameter("contractId", contractId);
        query.addScalar("performerId", new LongType());

        return (Long) query.uniqueResult();
    }

    public AIORequestBHSCDTO getRequestWarrantyById(Long requestId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("distinct r.AIO_REQUEST_BHSC_ID aioRequestBhscId, ")
                .append("r.CUSTOMER_ID customerId, ")
                .append("r.CUSTOMER_CODE customerCode, ")
                .append("r.CUSTOMER_NAME customerName, ")
                .append("r.CUSTOMER_ADDRESS customerAddress, ")
                .append("r.CUSTOMER_PHONE customerPhone, ")
                .append("r.STATE state, ")
                .append("r.WARRANTY_FORM warrantyForm, ")
                .append("r.STATUS_APPROVED statusApproved, ")
                .append("r.PERFORMER_ID performerId, ")
                .append("r.STATUS status, ")
                .append("to_char(r.START_DATE, 'HH24:MI DD/MM/YYYY') startDateStr, ")
                .append("to_char(r.END_DATE, 'HH24:MI DD/MM/YYYY') endDateStr, ")
                .append("r.CREATED_USER createdUser, ")
                .append("r.CREATED_DATE createdDate, ")
                .append("r.UPDATED_USER updatedUser, ")
                .append("r.UPDATED_DATE updatedDate, ")
                .append("u.FULL_NAME performerName, ")
                .append("u.EMAIL performerEmail, ")
                .append("u.EMPLOYEE_CODE performerCode ")
                .append("FROM AIO_REQUEST_BHSC r ")
                .append("left join SYS_USER u on u.SYS_USER_ID = r.PERFORMER_ID ")
                .append("WHERE 1=1 ")
                .append("AND AIO_REQUEST_BHSC_ID = :requestId ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setParameter("requestId", requestId);

        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));
        query.addScalar("aioRequestBhscId", new LongType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("warrantyForm", new LongType());
        query.addScalar("statusApproved", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("startDateStr", new StringType());
        query.addScalar("endDateStr", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerEmail", new StringType());

        Object obj = query.uniqueResult();
        return obj == null ? null : (AIORequestBHSCDTO) obj;
    }

    public List<AIORequestBHSCDetailDTO> getByRequestId(Long requestId) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("distinct r.AIO_REQUEST_BHSC_DETAIL_ID aioRequestBhscDetailId, ")
                .append("r.AIO_REQUEST_BHSC_ID aioRequestBhscId, ")
                .append("r.GOODS_ID goodsId, ")
                .append("r.GOODS_CODE goodsCode, ")
                .append("r.GOODS_NAME goodsName, ")
                .append("r.AMOUNT amount, ")
                .append("r.SERIAL serial ")
                .append("FROM AIO_REQUEST_BHSC_DETAIL r ")
                .append("WHERE 1=1 ")
                .append("and r.AIO_REQUEST_BHSC_ID = :requestId ")
                .append("order by r.AIO_REQUEST_BHSC_DETAIL_ID desc ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setParameter("requestId", requestId);

        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDetailDTO.class));
        query.addScalar("aioRequestBhscDetailId", new LongType());
        query.addScalar("aioRequestBhscId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("amount", new DoubleType());

        return query.list();
    }

    public List<AIORequestBHSCDTO> getStatusRequestBHSC(List<Long> ids) {
        String sql = "select AIO_REQUEST_BHSC_ID aioRequestBhscId, status from AIO_REQUEST_BHSC " +
                "where AIO_REQUEST_BHSC_ID in (:idList) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));

        query.addScalar("aioRequestBhscId", new LongType());
        query.addScalar("status", new LongType());
        query.setParameterList("idList", ids);
        return query.list();
    }

    // mobi
    public AIOAreaDTO getDefaultPerformerByCustomerId(Long id) {
        String sql = "select " +
                "SYS_USER_ID sysUserId, " +
                "EMPLOYEE_CODE employeeCode, " +
                "FULL_NAME fullName, " +
                "SALE_SYS_USER_ID saleSysUserId, " +
                "SALE_EMPLOYEE_CODE saleEmployeeCode, " +
                "SALE_FULL_NAME saleFullName " +
                "from aio_area " +
                "where area_id = (select AIO_AREA_ID from AIO_CUSTOMER where customer_id = :id) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", id);
        query.addScalar("sysUserId", new LongType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("saleSysUserId", new LongType());
        query.addScalar("saleEmployeeCode", new StringType());
        query.addScalar("saleFullName", new StringType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOAreaDTO) list.get(0);
        }
        return null;
    }

    public List<AIORequestBHSCDTO> getListRequestBHSC(Long sysUserId) {
        String sql = "SELECT " +
                "bhsc.AIO_REQUEST_BHSC_ID aioRequestBhscId, " +
//                "bhsc.CUSTOMER_ID customerId, " +
//                "bhsc.CUSTOMER_CODE customerCode, " +
                "bhsc.CUSTOMER_NAME customerName, " +
                "bhsc.CUSTOMER_ADDRESS customerAddress, " +
                "bhsc.CUSTOMER_PHONE customerPhone, " +
//                "bhsc.STATE state, " +
//                "bhsc.WARRANTY_FORM warrantyForm, " +
                "bhsc.STATUS status, " +
                "bhsc.STATUS_APPROVED statusApproved, " +
//                "bhsc.PERFORMER_ID performerId, " +
//                "bhsc.CREATED_USER createdUser, " +
                "bhsc.CREATED_DATE createdDate " +
//                "bhsc.UPDATED_USER updatedUser, " +
//                "bhsc.UPDATED_DATE updatedDate, " +
//                "bhsc.PERFORMER_GROUP_ID performerGroupId, " +
//                "bhsc.START_DATE startDate, " +
//                "bhsc.END_DATE endDate, " +
                "FROM AIO_REQUEST_BHSC bhsc " +
                "where bhsc.PERFORMER_ID = :userId " +
                "and bhsc.STATUS in (1, 2) " +
                "order by bhsc.AIO_REQUEST_BHSC_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));
        query.setParameter("userId", sysUserId);
        query.addScalar("aioRequestBhscId", new LongType());
//        query.addScalar("customerId", new LongType());
//        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("statusApproved", new LongType());
        query.addScalar("createdDate", new DateType());

        return query.list();
    }

    public AIORequestBHSCDTO getRequestBHSCById(Long id) {
        String sql = "SELECT " +
                "bhsc.CUSTOMER_ID customerId, " +
                "bhsc.CUSTOMER_CODE customerCode, " +
                "bhsc.STATE state, " +
                "bhsc.WARRANTY_FORM warrantyForm, " +
                "bhsc.STATUS status, " +
                "bhsc.STATUS_APPROVED statusApproved " +
                "FROM AIO_REQUEST_BHSC bhsc " +
                "where bhsc.AIO_REQUEST_BHSC_ID = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));
        query.setParameter("id", id);
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("warrantyForm", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("statusApproved", new LongType());

        return (AIORequestBHSCDTO) query.uniqueResult();
    }

    public List<AIORequestBHSCDetailDTO> getDetailRequestBHSC(Long requestId) {
        String sql = "SELECT " +
                "d.AIO_REQUEST_BHSC_DETAIL_ID aioRequestBhscDetailId, " +
//                "d.AIO_REQUEST_BHSC_ID aioRequestBhscId, " +
                "d.GOODS_ID goodsId, " +
                "d.GOODS_CODE goodsCode, " +
                "d.GOODS_NAME goodsName, " +
                "d.AMOUNT amount, " +
                "d.SERIAL serial " +
                "FROM AIO_REQUEST_BHSC_DETAIL d " +
                "WHERE d.AIO_REQUEST_BHSC_ID = :requestId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDetailDTO.class));
        query.setParameter("requestId", requestId);
        query.addScalar("aioRequestBhscDetailId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("serial", new StringType());

        return query.list();
    }

    public List<AIORequestBHSCDetailDTO> getCustomerGoodsUsed(Long customerId) {
        String sql = "select " +
                "GOODS_ID goodsId, " +
                "GOODS_CODE goodsCode, " +
                "GOODS_NAME goodsName, " +
                "serial serial, " +
                "sum(quantity) amount " +
                "from AIO_ACCEPTANCE_RECORDS_DETAIL " +
                "where ACCEPTANCE_RECORDS_id in " +
                "(select ACCEPTANCE_RECORDS_id from AIO_ACCEPTANCE_RECORDS where customer_id = :customerId) " +
                "group by GOODS_ID, GOODS_CODE, GOODS_NAME, serial ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDetailDTO.class));
        query.setParameter("customerId", customerId);
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("serial", new StringType());
        query.addScalar("amount", new DoubleType());

        return query.list();
    }

    public AIORequestBHSCDTO getStatusRequestBHSC(Long id) {
        String sql = "select status status, " +
                "status_approved statusApproved " +
                "from AIO_REQUEST_BHSC where AIO_REQUEST_BHSC_id = :id ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.addScalar("status", new LongType());
        query.addScalar("statusApproved", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AIORequestBHSCDTO.class));

        return (AIORequestBHSCDTO) query.uniqueResult();
    }

    public int updateSaveRequestBHSC(Long id, Long userId, Long warrantyForm, String state) {
        String sql = "update AIO_REQUEST_BHSC set " +
                "status = 2, " +
                "status_approved = 1, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_DATE = sysdate, " +
                "WARRANTY_FORM = :warrantyForm, " +
                "START_DATE = sysdate, " +
                "STATE = :state " +
                "where AIO_REQUEST_BHSC_id = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.setParameter("warrantyForm", warrantyForm);
        query.setParameter("state", state);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public int updateCloseRequestBHSC(Long id, Long userId, String desc) {
        String sql = "update AIO_REQUEST_BHSC set " +
                "status = 4, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_DATE = sysdate, " +
                "end_date = sysdate, " +
                "DESCRIPTION_STATUS = :desc " +
                "where AIO_REQUEST_BHSC_id = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.setParameter("desc", desc);
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public int updateFinishRequestBHSC(Long id, Long userId) {
        String sql = "update AIO_REQUEST_BHSC set " +
                "status = 3, " +
                "UPDATED_USER = :userId, " +
                "UPDATED_DATE = sysdate, " +
                "end_date = sysdate, " +
                "where AIO_REQUEST_BHSC_id = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.setParameter("id", id);

        return query.executeUpdate();
    }
}
