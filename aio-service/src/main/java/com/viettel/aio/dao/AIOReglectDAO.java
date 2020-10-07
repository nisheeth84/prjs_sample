package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOReglectBO;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@EnableTransactionManagement
@Transactional
@Repository("aioReglectDAO")
public class AIOReglectDAO extends BaseFWDAOImpl<AIOReglectBO, Long> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOReglectDAO.class);

    public AIOReglectDAO() {
        this.model = new AIOReglectBO();
    }

    public AIOReglectDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOReglectDTO> doSearch(AIOReglectDTO criteria) {
        String sql = "WITH a AS (SELECT AIO_REGLECT_ID, max(end_date) end_date " +
                "FROM AIO_REGLECT_DETAIL GROUP BY AIO_REGLECT_ID) " +
                "SELECT " +
                "rg.AIO_REGLECT_ID aioReglectId, " +
                "rg.CUSTOMER_ID customerId, " +
                "rg.CUSTOMER_CODE customerCode, " +
                "rg.CUSTOMER_NAME customerName, " +
                "rg.CUSTOMER_ADDRESS customerAddress, " +
                "rg.CUSTOMER_PHONE customerPhone, " +
                "rg.CREATED_DATE createdDate, " +
                "to_char(rg.CREATED_DATE, 'HH24:MI - DD/MM/YYYY') createdDateStr, " +
                "rg.STATUS status, " +
                "rg.TYPE type, " +
//                "rg.SUPPORT_DATE supportDate, " +
                "to_char(rg.SUPPORT_DATE, 'HH24:MI - DD/MM/YYYY') supportDateStr, " +
                "rg.DESCRIPTION description, " +
                "rg.REGLECT_CONTENT reglectContent, " +
                "rg.PERFORMER_GROUP_ID performerGroupId, " +
                "rg.CREATED_USER_ID createdUserId, " +
                "rg.UPDATED_USER_ID updatedUserId, " +
                "rg.UPDATED_DATE updatedDate " +
                ", a.end_date endDate " +
                "FROM AIO_REGLECT rg " +
                "LEFT JOIN a ON rg.AIO_REGLECT_ID = a.AIO_REGLECT_ID " +
                "WHERE 1 = 1 ";

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "AND (upper(rg.CUSTOMER_PHONE) like upper(:keySearch) escape '&' " +
                    "OR upper(rg.CUSTOMER_NAME) like upper(:keySearch) escape '&' " +
                    "OR upper(rg.CUSTOMER_ADDRESS) like upper(:keySearch) escape '&') ";
        }
        if (criteria.getStartDate() != null) {
            sql += "AND trunc(:dateFrom) <= trunc(rg.CREATED_DATE) ";
        }
        if (criteria.getEndDate() != null) {
            sql += "AND trunc(:dateTo) >= trunc(rg.CREATED_DATE) ";
        }
        if (criteria.getStatus() != 0) {
            sql += "AND rg.status = :status ";
        }
        if (criteria.getType() != 0) {
            sql += "AND rg.TYPE = :type ";
        }
        sql += " ORDER BY rg.AIO_REGLECT_ID DESC ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");
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
        if (criteria.getStatus() != 0) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getType() != 0) {
            query.setParameter("type", criteria.getType());
            queryCount.setParameter("type", criteria.getType());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOReglectDTO.class));
        query.addScalar("aioReglectId", new LongType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("type", new LongType());
//        query.addScalar("supportDate", new DateType());
        query.addScalar("supportDateStr", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("reglectContent", new StringType());
        query.addScalar("performerGroupId", new LongType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("updatedUserId", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("endDate", new DateType());

        this.setPageSize(criteria, query, queryCount);
        return query.list();
    }

    public List<AIOReglectDetailDTO> getReglectDetailByReglectId(Long reglectId) {
        String sql = "SELECT " +
                "cd.AIO_REGLECT_DETAIL_ID aioReglectDetailId, " +
//                "AIO_REGLECT_ID aioReglectId, " +
                "cd.SERVICE_TYPE serviceType, " +
                "cd.PERFORMER_ID performerId, " +
                "cd.START_DATE startDate, " +
                "cd.END_DATE endDate, " +
//                "cd.ACTUAL_START_DATE actualStartDate, " +
//                "cd.ACTUAL_END_DATE actualEndDate, " +
                "to_char(cd.ACTUAL_START_DATE, 'HH24:MI - DD/MM/YYYY') actualStartDateStr, " +
                "to_char(cd.ACTUAL_END_DATE, 'HH24:MI - DD/MM/YYYY') actualEndDateStr, " +
                "cd.STATUS status, " +
//                "EXPERT_DATE expertDate, " +
//                "APPROVED_EXPERT_DATE approvedExpertDate, " +
                "cd.REASON reason, " +
                "cd.DESCRIPTION_STAFF descriptionStaff, " +
                "su.full_name performerName, " +
                "su.employee_code performerCode " +
                "FROM AIO_REGLECT_DETAIL cd " +
                "left join sys_user su on su.sys_user_id = cd.performer_id " +
                "WHERE 1 = 1 " +
                "and AIO_REGLECT_ID = " + reglectId;
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOReglectDetailDTO.class));
        this.addScalarQueryGetReglectDetail(query);
        return query.list();
    }

    private void addScalarQueryGetReglectDetail(SQLQuery query) {
        query.addScalar("aioReglectDetailId", new LongType());
//        query.addScalar("aioReglectId", new LongType());
        query.addScalar("serviceType", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
//        query.addScalar("actualStartDate", new DateType());
//        query.addScalar("actualEndDate", new DateType());
        query.addScalar("actualStartDateStr", new StringType());
        query.addScalar("actualEndDateStr", new StringType());
        query.addScalar("status", new LongType());
//        query.addScalar("expertDate", new DateType());
//        query.addScalar("approvedExpertDate", new DateType());
        query.addScalar("reason", new StringType());
        query.addScalar("descriptionStaff", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
    }

    public List<AIOContractDTO> getListContractCustomer(Long idCustomer) {
        String sql = "SELECT " +
                "c.contract_id contractId, " +
                "d.package_name packageName, " +
                "max(ar.end_date) endDate, " +
                "c.contract_Amount contractAmount, " +
                "c.performer_name performerName, " +
                "c.performer_code performerCode, " +
                "max(ard.guarantee_time) numberPay " +

                "from aio_contract c " +
                "left join aio_contract_detail d on d.contract_id = c.contract_id " +
                "left join AIO_ACCEPTANCE_RECORDS ar on ar.contract_detail_id = d.contracT_detail_id " +
                "left join AIO_ACCEPTANCE_RECORDS_detail ard on ard.ACCEPTANCE_RECORDS_ID = ar.ACCEPTANCE_RECORDS_ID " +

                "where c.customer_id = :idCustomer and c.status != 4 " +
                "GROUP BY c.contract_id, d.package_name, c.contract_Amount, c.performer_name, c.performer_code " +
                "order by c.contract_id desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.setParameter("idCustomer", idCustomer);
        query.addScalar("contractId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("endDate", new DateType());
        query.addScalar("contractAmount", new DoubleType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("numberPay", new LongType());

        return query.list();
    }

    public AIOAreaDTO getDefaultPerformer(Long areaId) {
        String sql = "select " +
                "SYS_USER_ID sysUserId, " +
                "EMPLOYEE_CODE employeeCode, " +
                "FULL_NAME fullName, " +
                "SALE_SYS_USER_ID saleSysUserId, " +
                "SALE_EMPLOYEE_CODE saleEmployeeCode, " +
                "SALE_FULL_NAME saleFullName " +
                "from aio_area " +
                "where area_id = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOAreaDTO.class));
        query.setParameter("id", areaId);
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

    public Long getPerformerAllowedTime(Long type) {
        String parType = type == 1 ? "'REGLECT_TIME'" : "'COMPLAIN_TIME'";
        String sql = "select to_number(code) code from app_param where par_type = " + parType;
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("code", new LongType());

        return (Long) query.uniqueResult();
    }

    public int updateUpdateDate(Long detailId, Long userId) {
        String sql = "update aio_reglect " +
                "set UPDATED_USER_ID = :userId, UPDATED_DATE = sysdate " +
                "where AIO_REGLECT_ID = (SELECT AIO_REGLECT_ID FROM AIO_REGLECT_DETAIL WHERE AIO_REGLECT_DETAIL_ID = :detailId) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", userId);
        query.setParameter("detailId", detailId);

        return query.executeUpdate();
    }

    public int updatePerformer(Long detailId, Long performerId) {
        String sql = "update aio_reglect_detail set " +
                "performer_id = :performerId " +
                "where aio_reglect_detail_id = :detailId ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("performerId", performerId);
        query.setParameter("detailId", detailId);

        return query.executeUpdate();
    }

    public Long getStatusReglectDetail(Long idDetail) {
        String sql = "select status from aio_reglect_detail where aio_reglect_detail_id = " + idDetail;
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("status", new LongType());

        return (Long) query.uniqueResult();
    }
	public List<AIOReglectDetailDTO> getListReglect(AIOReglectDTO criteria, Long sysUserId) {
        String sql = "select " +
                "reg.AIO_REGLECT_ID aioReglectId, " +
//                "--reg.CUSTOMER_ID customerId, " +
//                "--reg.CUSTOMER_CODE customerCode, " +
                "reg.CUSTOMER_NAME customerName, " +
                "reg.CUSTOMER_ADDRESS customerAddress, " +
                "reg.CUSTOMER_PHONE customerPhone, " +
//                "--reg.CREATED_DATE createdDate, " +
//                "--reg.STATUS status, " +
                "reg.TYPE type, " +
                "reg.SUPPORT_DATE supportDate, " +
                "reg.DESCRIPTION description, " +
                "reg.REGLECT_CONTENT reglectContent, " +
//                "--reg.PERFORMER_GROUP_ID performerGroupId, " +
//                "--reg.CREATED_USER_ID createdUserId, " +
//                "--reg.UPDATED_USER_ID updatedUserId, " +
//                "--reg.UPDATED_DATE updatedDate, " +

                "regd.AIO_REGLECT_DETAIL_ID aioReglectDetailId, " +
//                "--regd.AIO_REGLECT_ID aioReglectId, " +
                "regd.SERVICE_TYPE serviceType, " +
//                "--regd.PERFORMER_ID performerId, " +
                "regd.START_DATE startDate, " +
                "regd.END_DATE endDate, " +
//                "--regd.ACTUAL_START_DATE actualStartDate, " +
//                "--regd.ACTUAL_END_DATE actualEndDate, " +
                "regd.STATUS status, " +
                "regd.EXPERT_DATE expertDate, " +
                "regd.APPROVED_EXPERT_DATE approvedExpertDate " +
//                "regd.REASON reason, " +
//                "regd.DESCRIPTION_STAFF descriptionStaff " +

                "from aio_reglect reg " +
                "left join aio_reglect_detail regd on reg.AIO_REGLECT_ID = regd.AIO_REGLECT_ID " +
                "where regd.performer_id = :sysUserId ";

//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            sql += "and (upper(reg.CUSTOMER_NAME) like upper(:keySearch) escape '&' " +
//                    "or upper(reg.CUSTOMER_ADDRESS) like upper(:keySearch) escape '&' " +
//                    "or upper(reg.CUSTOMER_PHONE) like upper(:keySearch) escape '&') ";
//        }
        if (criteria.getStatus() != null) {
            sql += "and regd.status = :status ";
        } else {
            sql += "and regd.status in (1,2,3) ";
        }

        sql += "order by regd.AIO_REGLECT_DETAIL_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOReglectDetailDTO.class));
        query.setParameter("sysUserId", sysUserId);

//        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
//        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
        }

        query.addScalar("aioReglectId", new LongType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("supportDate", new DateType());
        query.addScalar("description", new StringType());
        query.addScalar("reglectContent", new StringType());
        query.addScalar("aioReglectDetailId", new LongType());
        query.addScalar("serviceType", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("status", new LongType());
        query.addScalar("expertDate", new DateType());
        query.addScalar("approvedExpertDate", new DateType());

        return query.list();
    }

    public List<String> getListReason() {
        String sql = "select name name from app_param " +
                "where par_type = 'CAUSE_REFLECTION' " +
                "order by app_param_id desc ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("name", new StringType());
        return query.list();
    }

    public int updateUpdatedUserAndStatus(Long reglectId, Long sysUserId, Long status) {
        String sql = "update AIO_REGLECT set " +
                "UPDATED_USER_ID = :userId, " +
                "UPDATED_DATE = sysdate ";
        if (status != null) {
            sql += ", STATUS = :status ";
        }

        sql += "where AIO_REGLECT_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("userId", sysUserId);
        query.setParameter("id", reglectId);
        if (status != null) {
            query.setParameter("status", status);
        }
        return query.executeUpdate();
    }

    public int updateUpdatedUser(Long reglectId, Long sysUserId) {
        return updateUpdatedUserAndStatus(reglectId, sysUserId, null);
    }

    public int updateExpectedDateDetail(AIOReglectDetailDTO dto) {
        String sql = "update AIO_REGLECT_DETAIL set " +
                "EXPERT_DATE = :date, " +
                "status = 3 " +
                "where AIO_REGLECT_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("date", dto.getExpertDate());
        query.setParameter("id", dto.getAioReglectDetailId());
        return query.executeUpdate();
    }

    public int updateStartReglect(Long detailId) {
        String sql = "update AIO_REGLECT_DETAIL set " +
                "ACTUAL_START_DATE = sysdate, " +
                "status = 2 " +
                "where AIO_REGLECT_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", detailId);
        return query.executeUpdate();
    }

    public int updateEndReglect(AIOReglectDetailDTO dto) {
        String sql = "update AIO_REGLECT_DETAIL set " +
                "ACTUAL_END_DATE = sysdate," +
                "status = 4, " +
                "REASON = :reason, " +
                "DESCRIPTION_STAFF = :desc " +
                "where AIO_REGLECT_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("reason", dto.getReason());
        query.setParameter("desc", dto.getDescriptionStaff());
        query.setParameter("id", dto.getAioReglectDetailId());
        return query.executeUpdate();
    }

    /**
     * Lấy max status detail với status khác 4 làm status reglect khi không phải rq kết thúc
     */
    public Long getMaxStatusReglectDoing(Long reglectId) {
        String sql = "select max(status) status from aio_reglect_detail where aio_reglect_id = :id and status != 4 ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", reglectId);
        query.addScalar("status", new LongType());
        return (Long) query.uniqueResult();
    }

    /**
     * Lấy status của tất cả reglect detail
     */
    public List<Long> getAllStatusReglectDetail(Long reglectId) {
        String sql = "select status from aio_reglect_detail where AIO_REGLECT_ID = :id group by status ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", reglectId);
        query.addScalar("status", new LongType());
        return query.list();
    }

    public Long getDetailStatus(Long detailId) {
        String sql = "select status from aio_reglect_detail where AIO_REGLECT_DETAIL_ID = :id ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("id", detailId);
        query.addScalar("status", new LongType());
        return (Long) query.uniqueResult();
    }

    public List<AppParamDTO> getDropDownData() {
        String sql = "select area_id id, code code, name name, CAST(province_id AS NVARCHAR2(50)) text from aio_area where area_level = 2 ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AppParamDTO.class));
        query.addScalar("id", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        return query.list();
    }

    public List<AIOCustomerDTO> getListCustomer(AIOCustomerDTO dto) {
        String sql = "SELECT " +
                "CUSTOMER_ID customerId, " +
                "CODE code, " +
                "NAME name, " +
                "ADDRESS address, " +
                "PHONE phone, " +
                "AIO_AREA_ID aioAreaId " +
                "FROM AIO_CUSTOMER " +
                "where 1=1 ";

        if (StringUtils.isNotEmpty(dto.getKeySearch())) {
            sql += "and (upper(code) like upper(:keySearch) escape '&' " +
                    "or upper(name) like upper(:keySearch) escape '&') ";
        }

        sql += "order by CUSTOMER_ID desc ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        if (StringUtils.isNotEmpty(dto.getKeySearch())) {
            query.setParameter("keySearch", "%" + dto.getKeySearch() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("aioAreaId", new LongType());

        query.setFirstResult(1);
        query.setMaxResults(dto.getPageSize());

        return query.list();
    }
}
