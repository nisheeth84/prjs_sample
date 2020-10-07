package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.aio.dto.AIOAcceptanceRecordsDetailDTO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
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

//VietNT_20190313_create
@EnableTransactionManagement
@Transactional
@Repository("aioCustomerDAO")
public class AIOCustomerDAO extends BaseFWDAOImpl<AIOCustomerBO, Long> {

    public AIOCustomerDAO() {
        this.model = new AIOCustomerBO();
    }

    public AIOCustomerDAO(Session session) {
        this.session = session;
    }


    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public String getLatestCodeByType(Long type) {
        String sql = "Select max(substr(CODE, 5)) code from aio_customer where type = :type ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("type", type);
        query.addScalar("code", new StringType());

        return ((String) query.uniqueResult());
    }

    public List<AIOCustomerDTO> doSearchCustomer(AIOCustomerDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("c.CODE code, ")
                .append("c.NAME name, ")
                .append("c.PHONE phone, ")
                .append("c.BIRTH birth, ")
                .append("c.TAX_CODE taxCode, ")
                .append("c.SURROGATE surrogate, ")
                .append("c.POSITION position, ")
                .append("c.PASSPORT passport, ")
                .append("c.ISSUED_BY issuedBy, ")
                .append("c.PURVEY_DATE purveyDate, ")
                .append("c.GENDER gender, ")
                .append("c.ADDRESS address, ")
                .append("c.EMAIL email, ")
                .append("c.TYPE type ")
                //VietNT_20190503_start
                .append(", aa.path text ")
                .append(", aa.province_id provinceId ")

                //VietNT_end
//                .append("CREATED_DATE createdDate, ")
//                .append("CREATED_USER createdUser, ")
//                .append("CREATED_GROUP_ID createdGroupId, ")
                .append("FROM AIO_CUSTOMER c ")
                .append("left join aio_area aa on aa.area_id = c.aio_area_id ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("and (upper(c.code) like upper(:keySearch) ")
                    .append("or upper(c.NAME) like upper(:keySearch) ")
                    .append("or upper(c.PHONE) like upper(:keySearch) ")
                    .append("or upper(c.TAX_CODE) like upper(:keySearch) ")
                    .append("or upper(c.PASSPORT) like upper(:keySearch) escape '&') ");
        }

        if (criteria.getType() != null) {
            sql.append("and c.type = :type ");
        }

        if (criteria.getCustomerId() != null) {
            sql.append("and c.CUSTOMER_ID = :id ");
        }

        sql.append("ORDER BY c.CUSTOMER_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        // query find exact
        if (criteria.getMessageColumn() != 0 && StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", criteria.getKeySearch());
            queryCount.setParameter("keySearch", criteria.getKeySearch());
        } else {
            if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
                query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
                queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            }
        }

        if (criteria.getType() != null) {
            query.setParameter("type", criteria.getType());
            queryCount.setParameter("type", criteria.getType());
        }

        if (criteria.getCustomerId() != null) {
            query.setParameter("id", criteria.getCustomerId());
            queryCount.setParameter("id", criteria.getCustomerId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));

        this.setPageSize(criteria, query, queryCount);
        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("birth", new DateType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("surrogate", new StringType());
        query.addScalar("position", new StringType());
        query.addScalar("passport", new StringType());
        query.addScalar("issuedBy", new StringType());
        query.addScalar("purveyDate", new DateType());
        query.addScalar("gender", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("provinceId", new LongType());
//        query.addScalar("createdDate", new DateType());
//        query.addScalar("createdUser", new LongType());
//        query.addScalar("createdGroupId", new LongType());

        return query.list();
    }
    
    //HuyPq-20190506-start
    public SysUserDTO getSysUserIdByAreaId(Long id) {
    	StringBuilder sql = new StringBuilder("SELECT aa.SYS_USER_ID sysUserId, " + 
    			"  su.SYS_GROUP_ID sysGroupId, " + 
    			"  su.EMPLOYEE_CODE employeeCode, " + 
    			"  su.PHONE_NUMBER phone, " + 
    			"  su.EMAIL email, " + 
    			"  su.FULL_NAME fullName " +
                //VietNT_27/07/2019_start
                ", su.SALE_CHANNEL saleChannel " +
                //VietNT_end
    			"FROM AIO_AREA aa " + 
    			"INNER JOIN CTCT_VPS_OWNER.SYS_USER su " + 
    			"ON su.SYS_USER_ID = aa.SYS_USER_ID " + 
    			"WHERE aa.AREA_ID  =:id");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.addScalar("sysUserId", new LongType());
    	query.addScalar("employeeCode", new StringType());
    	query.addScalar("fullName", new StringType());
    	query.addScalar("sysGroupId", new LongType());
    	query.addScalar("phone", new StringType());
    	query.addScalar("email", new StringType());
    	query.addScalar("saleChannel", new StringType());

    	query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
    	
    	query.setParameter("id", id);
    	
    	@SuppressWarnings("unchecked")
        List<SysUserDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }
    
    public SysUserDTO getDetailUserBySysUserId(Long id) {
    	StringBuilder sql = new StringBuilder("SELECT SYS_USER_ID sysUserId, " + 
    			"  SYS_GROUP_ID sysGroupId, " + 
    			"  EMPLOYEE_CODE employeeCode, " + 
    			"  FULL_NAME fullName, " + 
    			"  (SELECT SYS_GROUP_ID " + 
    			"  FROM CTCT_CAT_OWNER.SYS_GROUP " + 
    			"  WHERE name = " + 
    			"    (SELECT sg.GROUP_NAME_LEVEL2 " + 
    			"    FROM CTCT_CAT_OWNER.SYS_GROUP sg " + 
    			"    LEFT JOIN sys_user su " + 
    			"    ON sg.SYS_GROUP_ID  = su.SYS_GROUP_ID " + 
    			"    WHERE su.SYS_USER_ID=:id " + 
    			"    ) " + 
    			"  ) sysGroupIdLv2 " +
                //VietNT_27/07/2019_start
                ", SALE_CHANNEL saleChannel " +
                //VietNT_end
    			"FROM SYS_USER " + 
    			"WHERE SYS_USER_ID = :id");
    	SQLQuery query = getSession().createSQLQuery(sql.toString());
    	query.addScalar("sysUserId", new LongType());
    	query.addScalar("employeeCode", new StringType());
    	query.addScalar("fullName", new StringType());
    	query.addScalar("sysGroupId", new LongType());
    	query.addScalar("sysGroupIdLv2", new LongType());
        query.addScalar("saleChannel", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
    	
    	query.setParameter("id", id);
    	
    	@SuppressWarnings("unchecked")
        List<SysUserDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }
    //Huy-end

    //hienvd: START 12/8/2019

    public List<AIOCustomerDTO> doSearchLookupCustomer(AIOCustomerDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("c.CODE code, ")
                .append("c.NAME name, ")
                .append("c.PHONE phone, ")
                .append("c.BIRTH birth, ")
                .append("c.TAX_CODE taxCode, ")
                .append("c.SURROGATE surrogate, ")
                .append("c.POSITION position, ")
                .append("c.PASSPORT passport, ")
                .append("c.ISSUED_BY issuedBy, ")
                .append("c.PURVEY_DATE purveyDate, ")
                .append("c.GENDER gender, ")
                .append("c.CREATED_DATE createdDate, ")
                .append("c.ADDRESS address, ")
                .append("c.EMAIL email, ")
                .append("c.TYPE type ")
                .append(", (SELECT PATH FROM AIO_AREA WHERE AREA_ID = c.AIO_AREA_ID) text ")
                .append("FROM AIO_CUSTOMER c ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("and (upper(c.ADDRESS) like upper(:keySearch) ")
                    .append("or upper(c.NAME) like upper(:keySearch) ")
                    .append("or upper(c.PHONE) like upper(:keySearch) escape '&') ");
        }

        if (StringUtils.isNotEmpty(criteria.getPassport())) {
            sql.append("and c.PASSPORT = :passport ");
        }

        sql.append("ORDER BY c.CUSTOMER_ID DESC ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        if (StringUtils.isNotEmpty(criteria.getPassport())) {
            query.setParameter("passport", criteria.getPassport());
            queryCount.setParameter("passport", criteria.getPassport());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        this.setPageSize(criteria, query, queryCount);

        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("birth", new DateType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("surrogate", new StringType());
        query.addScalar("position", new StringType());
        query.addScalar("passport", new StringType());
        query.addScalar("issuedBy", new StringType());
        query.addScalar("purveyDate", new DateType());
        query.addScalar("gender", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("type", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("createdDate", new DateType());
//        query.addScalar("createdUser", new LongType());
//        query.addScalar("createdGroupId", new LongType());
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public AIOCustomerDTO viewDetail(AIOCustomerDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("c.CODE code, ")
                .append("c.NAME name, ")
                .append("c.PHONE phone, ")
                .append("c.BIRTH birth, ")
                .append("c.TAX_CODE taxCode, ")
                .append("c.SURROGATE surrogate, ")
                .append("c.POSITION position, ")
                .append("c.PASSPORT passport, ")
                .append("c.ISSUED_BY issuedBy, ")
                .append("c.PURVEY_DATE purveyDate, ")
                .append("c.GENDER gender, ")
                .append("c.CREATED_DATE createdDate, ")
                .append("c.ADDRESS address, ")
                .append("c.EMAIL email, ")
                .append("c.TYPE type ")
                .append(", (SELECT PATH FROM AIO_AREA WHERE AREA_ID = c.AIO_AREA_ID) text ")
                .append("FROM AIO_CUSTOMER c ")
                .append("WHERE 1=1 AND c.CUSTOMER_ID=:id ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("customerId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("phone", new StringType());
        query.addScalar("address", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        query.setParameter("id", criteria.getCustomerId());

        @SuppressWarnings("unchecked")
        List<AIOCustomerDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }




    public List<AIOCustomerDTO> doSearchContractDetail(AIOCustomerDTO criteria){
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("c.CONTRACT_ID contractId, ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("c.CUSTOMER_ADDRESS address, ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("r.AMOUNT amount, ")
                .append("c.PERFORMER_CODE performerCode, ")
                .append("c.PERFORMER_NAME performerName, ")
                .append("r.START_DATE startDate, ")
                .append("r.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, ")
                .append("r.END_DATE endDate ")
                .append("FROM AIO_CONTRACT c, AIO_CONTRACT_DETAIL cd, AIO_ACCEPTANCE_RECORDS r ")
                .append("WHERE c.CONTRACT_ID = cd.CONTRACT_ID and c.CONTRACT_ID = r.CONTRACT_ID and cd.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID ");
        if (criteria.getCustomerId() != null) {
            sql.append("and c.CUSTOMER_ID = :id ");
        }

        if (StringUtils.isNotEmpty(criteria.getPackageName())) {
            sql.append(" and cd.PACKAGE_NAME = :packageName ");

        }
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (criteria.getCustomerId() != null) {
            query.setParameter("id",  criteria.getCustomerId());
            queryCount.setParameter("id", criteria.getCustomerId());
        }
        if (StringUtils.isNotEmpty(criteria.getPackageName())) {
            query.setParameter("packageName", criteria.getPackageName());
            queryCount.setParameter("packageName", criteria.getPackageName());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        this.setPageSize(criteria, query, queryCount);
        query.addScalar("contractId", new LongType());
        query.addScalar("customerId", new LongType());
        query.addScalar("acceptanceRecordsId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }


    public List<AIOCustomerDTO> doSearchVTTBDetail(AIOCustomerDTO criteria){
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("c.CUSTOMER_ADDRESS address, ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("r.AMOUNT amount, ")
                .append("c.PERFORMER_CODE performerCode, ")
                .append("c.PERFORMER_NAME performerName, ")
                .append("r.START_DATE startDate, ")
                .append("r.END_DATE endDate, ")
                .append("r.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, ")
                .append("rd.GOODS_CODE goodCode, ")
                .append("rd.GOODS_NAME goodName, ")
                .append("rd.GOODS_UNIT_NAME goodUnitName, ")
                .append("rd.QUANTITY quantity, ")
                .append("rd.SERIAL serial, ")
                .append("rd.GUARANTEE_TYPE_NAME quaranteeTypeName, ")
                .append("r.END_DATE + rd.GUARANTEE_TIME dateGuTime ")
                .append("FROM AIO_CONTRACT c, AIO_CONTRACT_DETAIL cd, AIO_ACCEPTANCE_RECORDS r , AIO_ACCEPTANCE_RECORDS_DETAIL rd ")
                .append("WHERE c.CONTRACT_ID = cd.CONTRACT_ID and c.CONTRACT_ID = r.CONTRACT_ID and cd.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID and r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID ");
        if (criteria.getCustomerId() != null) {
            sql.append("and c.CUSTOMER_ID = :id ");
        }
        if (criteria.getAcceptanceRecordsId() != null) {
            sql.append("and r.ACCEPTANCE_RECORDS_ID = :acceptanceRecordsId");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (criteria.getCustomerId() != null) {
            query.setParameter("id",  criteria.getCustomerId());
            queryCount.setParameter("id", criteria.getCustomerId());
        }
        if (criteria.getAcceptanceRecordsId() != null) {
            query.setParameter("acceptanceRecordsId",  criteria.getAcceptanceRecordsId());
            queryCount.setParameter("acceptanceRecordsId", criteria.getAcceptanceRecordsId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        this.setPageSize(criteria, query, queryCount);

        query.addScalar("customerId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("acceptanceRecordsId", new LongType());
        query.addScalar("goodCode", new StringType());
        query.addScalar("goodName", new StringType());
        query.addScalar("goodUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("quaranteeTypeName", new StringType());
        query.addScalar("dateGuTime", new StringType());
        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }


    public AIOCustomerDTO viewDetailVTTB(AIOCustomerDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("cd.PACKAGE_NAME packageName, ")
                .append("c.CUSTOMER_ADDRESS address, ")
                .append("c.CUSTOMER_ID customerId, ")
                .append("r.AMOUNT amount, ")
                .append("c.PERFORMER_CODE performerCode, ")
                .append("c.PERFORMER_NAME performerName, ")
                .append("r.START_DATE startDate, ")
                .append("r.END_DATE endDate, ")
                .append("r.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, ")
                .append("rd.GOODS_CODE goodCode, ")
                .append("rd.GOODS_NAME goodName, ")
                .append("rd.GOODS_UNIT_NAME goodUnitName, ")
                .append("rd.QUANTITY quantity, ")
                .append("rd.SERIAL serial, ")
                .append("rd.GUARANTEE_TYPE_NAME quaranteeTypeName, ")
                .append("r.END_DATE + rd.GUARANTEE_TIME dateGuTime ")
                .append("FROM AIO_CONTRACT c, AIO_CONTRACT_DETAIL cd, AIO_ACCEPTANCE_RECORDS r , AIO_ACCEPTANCE_RECORDS_DETAIL rd ")
                .append("WHERE c.CONTRACT_ID = cd.CONTRACT_ID and c.CONTRACT_ID = r.CONTRACT_ID and cd.CONTRACT_DETAIL_ID = r.CONTRACT_DETAIL_ID and r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID ");
        if (criteria.getCustomerId() != null) {
            sql.append("and c.CUSTOMER_ID = :id ");
        }
        if (criteria.getAcceptanceRecordsId() != null) {
            sql.append("and r.ACCEPTANCE_RECORDS_ID = :acceptanceRecordsId");
        }

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        if (criteria.getCustomerId() != null) {
            query.setParameter("id",  criteria.getCustomerId());

        }
        if (criteria.getAcceptanceRecordsId() != null) {
            query.setParameter("acceptanceRecordsId",  criteria.getAcceptanceRecordsId());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));
        query.addScalar("customerId", new LongType());
        query.addScalar("packageName", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("acceptanceRecordsId", new LongType());
        query.addScalar("goodCode", new StringType());
        query.addScalar("goodName", new StringType());
        query.addScalar("goodUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("quaranteeTypeName", new StringType());
        query.addScalar("dateGuTime", new StringType());

        List<AIOCustomerDTO> lst = query.list();
        if (lst.size() > 0) {
            return lst.get(0);
        }
        return null;
    }

    //hienvd: START 19/08/2019
    public List<AIOContractDTO> getListContractLookupServiceTask(AIOContractMobileRequest request) {
        StringBuilder sql = new StringBuilder("");
        AIOContractDTO contractDTO = request.getAioContractDTO();
        sql.append("Select distinct c.CONTRACT_ID contractId, c.contract_code contractCode, c.customer_name customerName, ");
        sql.append(" c.created_date createdDate, cs.name serviceName, " +
                //VietNT_13/09/2019_start
                "cs.type servicePointId ");
        //VietNT_end
        sql.append("from AIO_CONTRACT c, ");
        sql.append(" AIO_ACCEPTANCE_RECORDS r, AIO_ACCEPTANCE_RECORDS_DETAIL rd, AIO_CONFIG_SERVICE cs ");
        sql.append(" WHERE c.CONTRACT_ID = r.CONTRACT_ID AND r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID AND c.SERVICE_CODE = cs.code ");
        if (StringUtils.isNotEmpty(contractDTO.getSerial())) {
            sql.append(" AND (upper(rd.SERIAL) like upper(:serial) escape '&')");
        }
        if (StringUtils.isNotEmpty(contractDTO.getContractCode())) {
            sql.append(" AND (upper(c.CONTRACT_CODE) like upper(:contractCode) escape '&')");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerPhone())) {
            sql.append(" AND (upper(c.CUSTOMER_PHONE) like upper(:customerPhone) escape '&')");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerTaxCode())) {
            sql.append(" AND (upper(c.CUSTOMER_TAX_CODE) like upper(:customerTaxCode) escape '&')");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerName())) {
            sql.append(" AND (upper(c.CUSTOMER_NAME) like upper(:customerName) escape '&')");
        }
        sql.append(" order by c.contract_id desc ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(contractDTO.getSerial())) {
            query.setParameter("serial", "%" + contractDTO.getSerial() + "%");
        }
        if (StringUtils.isNotEmpty(contractDTO.getContractCode())) {
            query.setParameter("contractCode", "%" + contractDTO.getContractCode() + "%");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerPhone())) {
            query.setParameter("customerPhone", "%" + contractDTO.getCustomerPhone() + "%");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerTaxCode())) {
            query.setParameter("customerTaxCode", "%" + contractDTO.getCustomerTaxCode() + "%");
        }
        if (StringUtils.isNotEmpty(contractDTO.getCustomerName())) {
            query.setParameter("customerName", "%" + contractDTO.getCustomerName() + "%");
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("serviceName", new StringType());
        query.addScalar("servicePointId", new LongType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }

    public List<AIOContractDTO> getViewLookDetail(AIOContractMobileRequest request) {
        AIOContractDTO contractDTO = request.getAioContractDTO();
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT " +
                "c.contract_id contractId, " +
                "c.contract_code contractCode, " +
                //VietNT_13/09/2019_start
                "c.CUSTOMER_ID customerId, " +
                "c.CUSTOMER_CODE customerCode, " +
                //VietNT_end
                "c.customer_name customerName, " +
                "c.customer_address customerAddress, " +
                "c.customer_phone customerPhone, " +
                "( rd.goods_code || '-' || rd.goods_name ) goodsName, " +
                "rd.quantity quantity, " +
                "rd.serial serial, " +
                "rd.guarantee_type guaranteetype, " +
                "ap.name nameguarantee, " +
                "r.end_date + rd.guarantee_time * 30 warrantymonth " +
                "FROM " +
                "aio_contract c " +
                "left join aio_acceptance_records r on r.contract_id = c.contract_id " +
                "left join aio_acceptance_records_detail rd on rd.ACCEPTANCE_RECORDS_ID = r.ACCEPTANCE_RECORDS_ID " +
                "left join app_param ap on ap.APP_PARAM_ID = rd.guarantee_type " +
                "WHERE " +
                "1=1 ");
        if (contractDTO.getContractId() != null) {
            sql.append("AND c.CONTRACT_ID = :contractId");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (contractDTO.getContractId() != null) {
            query.setParameter("contractId", contractDTO.getContractId());
        }
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("serial", new StringType());
        query.addScalar("guaranteeType", new LongType());
        query.addScalar("warrantyMonth", new DateType());
        query.addScalar("nameGuarantee", new StringType());
        query.setResultTransformer(Transformers
                .aliasToBean(AIOContractDTO.class));
        return query.list();
    }
    //hienvd: END 19/08/2019

    public List<AIOAcceptanceRecordsDetailDTO> doSearchLookUpWarranty(AIOContractDTO criteria) {
        String sql = "select " +
                "rd.ACCEPTANCE_RECORDS_DETAIL_ID acceptanceRecordsDetailId, " +
                "rd.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, " +
                "rd.GOODS_ID goodsId, " +
                "rd.GOODS_CODE goodsCode, " +
                "rd.GOODS_NAME goodsName, " +
//                "GOODS_UNIT_ID goodsUnitId, " +
//                "GOODS_UNIT_NAME goodsUnitName, " +
                "rd.QUANTITY quantity, " +
//                "PRICE price, " +
//                "AMOUNT amount, " +
                "rd.SERIAL serial, " +
//                "TYPE type, " +
//                "STOCK_TRANS_CODE stockTransCode, " +
                "rd.GUARANTEE_TYPE guaranteeType, " +
                "rd.GUARANTEE_TYPE_NAME guaranteeTypeName, " +
                "rd.GUARANTEE_TIME guaranteeTime, " +
                "r.customer_name customerName " +
                "FROM aio_ACCEPTANCE_RECORDS_DETAIL rd " +
                "left join aio_ACCEPTANCE_RECORDS r on r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID " +
                "left join aio_customer c on c.CUSTOMER_ID = r.CUSTOMER_ID " +
                "where 1=1 ";

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql += "and (upper(c.name) like upper(:keySearch) escape '&' or " +
                    "upper(c.PHONE) like upper(:keySearch) escape '&' or " +
                    "upper(c.ADDRESS) like upper(:keySearch) escape '&') ";
        }

        if (StringUtils.isNotEmpty(criteria.getCustomerTaxCode())) {
            sql += "and c.TAX_CODE = :taxCode ";
        }

        if (StringUtils.isNotEmpty(criteria.getSerial())) {
            sql += "and rd.serial = :serial ";
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsName())) {
            sql += "and upper(rd.GOODS_NAME) like upper(:goodsName) escape '&' ";
        }

        sql += "order by r.customer_name, rd.ACCEPTANCE_RECORDS_DETAIL_ID desc ";

        SQLQuery query = getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery(
                "SELECT COUNT(*) FROM (" + sql + ")");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }

        if (StringUtils.isNotEmpty(criteria.getCustomerTaxCode())) {
            query.setParameter("taxCode", criteria.getCustomerTaxCode());
            queryCount.setParameter("taxCode", criteria.getCustomerTaxCode());
        }

        if (StringUtils.isNotEmpty(criteria.getSerial())) {
            query.setParameter("serial", criteria.getSerial());
            queryCount.setParameter("serial", criteria.getSerial());
        }

        if (StringUtils.isNotEmpty(criteria.getGoodsName())) {
            query.setParameter("goodsName", "%" + criteria.getGoodsName() + "%");
            queryCount.setParameter("goodsName", "%" + criteria.getGoodsName() + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOAcceptanceRecordsDetailDTO.class));
        query.addScalar("acceptanceRecordsDetailId", new LongType());
        query.addScalar("acceptanceRecordsId", new LongType());
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
//        query.addScalar("goodsUnitId", new LongType());
//        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
//        query.addScalar("price", new DoubleType());
//        query.addScalar("amount", new DoubleType());
        query.addScalar("serial", new StringType());
//        query.addScalar("type", new LongType());
//        query.addScalar("stockTransCode", new StringType());
        query.addScalar("guaranteeType", new LongType());
        query.addScalar("guaranteeTypeName", new StringType());
        query.addScalar("guaranteeTime", new LongType());
        query.addScalar("customerName", new StringType());

        this.setPageSize(criteria, query, queryCount);

        return query.list();
    }

    public AIOContractDTO getDetailWarranty(Long id) {
        String sql = "select " +
//                "rd.ACCEPTANCE_RECORDS_DETAIL_ID acceptanceRecordsDetailId, " +
//                "rd.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, " +
                "rd.GOODS_ID goodsId, " +
                "rd.GOODS_CODE goodsCode, " +
                "rd.GOODS_NAME goodsName, " +
                "rd.GOODS_UNIT_ID goodsUnitId, " +
                "rd.GOODS_UNIT_NAME goodsUnitName, " +
                "rd.QUANTITY quantity, " +
//                "PRICE price, " +
                "rd.SERIAL serial, " +
//                "TYPE type, " +
//                "STOCK_TRANS_CODE stockTransCode, " +
                "rd.GUARANTEE_TYPE guaranteeType, " +
                "rd.GUARANTEE_TYPE_NAME guaranteeTypeName, " +
                "rd.GUARANTEE_TIME guaranteeTime, " +

                "r.CUSTOMER_ID customerId, " +
                "r.CUSTOMER_CODE customerCode, " +
                "r.CUSTOMER_NAME customerName, " +
                "r.CUSTOMER_PHONE customerPhone, " +
                "r.CUSTOMER_ADDRESS customerAddress, " +
                "r.AMOUNT amount, " +
                "r.start_date startDate, " +
                "r.end_date endDate, " +

                "c.contract_id contractId, " +
                "c.contract_code contractCode, " +
                "c.PERFORMER_NAME performerName, " +
                "c.PERFORMER_CODE performerCode, " +

                "d.package_name packageName, " +
                "add_months(r.end_date, rd.GUARANTEE_TIME) warrantyMonth " +

                "FROM aio_ACCEPTANCE_RECORDS_DETAIL rd " +
                "left join aio_ACCEPTANCE_RECORDS r on r.ACCEPTANCE_RECORDS_ID = rd.ACCEPTANCE_RECORDS_ID " +
                "left join aio_contract c on c.contract_id = r.contract_id " +
                "left join aio_contract_detail d on d.contract_detail_id = r.contract_detail_id " +
                "where 1=1 " +
                "and rd.ACCEPTANCE_RECORDS_DETAIL_ID = " + id;

        sql += "order by r.customer_name, rd.ACCEPTANCE_RECORDS_DETAIL_ID desc ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        query.addScalar("goodsId", new LongType());
        query.addScalar("goodsCode", new StringType());
        query.addScalar("goodsName", new StringType());
        query.addScalar("goodsUnitId", new LongType());
        query.addScalar("goodsUnitName", new StringType());
        query.addScalar("quantity", new DoubleType());
//        query.addScalar("price", new DoubleType());
        query.addScalar("serial", new StringType());
//        query.addScalar("type", new StringType());
//        query.addScalar("stockTransCode", new StringType());
        query.addScalar("guaranteeType", new LongType());
        query.addScalar("guaranteeTypeName", new StringType());
        query.addScalar("guaranteeTime", new LongType());
        query.addScalar("customerId", new LongType());
        query.addScalar("customerCode", new StringType());
        query.addScalar("customerName", new StringType());
        query.addScalar("customerPhone", new StringType());
        query.addScalar("customerAddress", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("packageName", new StringType());
        query.addScalar("warrantyMonth", new DateType());

        return (AIOContractDTO) query.uniqueResult();
    }

    public List<AIOCustomerDTO> getListCustomer(Long performerId) {
        String sql="select c.CUSTOMER_ID as customerId, c.CODE as code, c.NAME as name, c.ADDRESS as address, c.PHONE as phone, c.EMAIL as email" +
                " from AIO_AREA a, AIO_CUSTOMER c where " +
                " a.AREA_ID = c.AIO_AREA_ID and " +
                "(a.SYS_USER_ID = :performerId or a.SALE_SYS_USER_ID =:performerId)";


        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("performerId",performerId);

        query.addScalar("customerId",new LongType());
        query.addScalar("code",new StringType());
        query.addScalar("name",new StringType());
        query.addScalar("address",new StringType());
        query.addScalar("phone",new StringType());
        query.addScalar("email",new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOCustomerDTO.class));

        return query.list();
    }

    public AIOCustomerBO checkExistCustomer(AIOCustomerDTO customerDTO){
        Query query= this.getSession().createQuery("from AIOCustomerBO where phone=:phone");
        query.setParameter("phone",customerDTO.getPhone());

        if (query.list()!=null&&!query.list().isEmpty()){
            return (AIOCustomerBO)query.list().get(0);
        }else{
            return null;
        }

    }

    public int updateCustomerPoint(Long contractId, Long packageDetailId) {
        String sqlId = "SELECT CUSTOMER_ID FROM AIO_CONTRACT WHERE contract_id = " + contractId;
        SQLQuery queryId = this.getSession().createSQLQuery(sqlId);
        queryId.addScalar("CUSTOMER_ID", new LongType());
        Long customerId = (Long) queryId.uniqueResult();

        if (customerId == null) {
            return 0;
        }

        String getCustomerPoint = "(nvl((SELECT CUSTOMER_POINT FROM AIO_CUSTOMER WHERE CUSTOMER_ID = :customerId), 0) ";
        String getPackagePoint = "nvl((SELECT package_point FROM AIO_PACKAGE WHERE AIO_PACKAGE_ID = " +
                "(SELECT AIO_PACKAGE_ID FROM AIO_PACKAGE_DETAIL WHERE AIO_PACKAGE_DETAIL_ID = :packageDetailId)), 0)) ";

        StringBuilder sql = new StringBuilder("UPDATE AIO_CUSTOMER SET CUSTOMER_POINT = ")
                .append(getCustomerPoint)
                .append(" + ")
                .append(getPackagePoint)
                .append("WHERE CUSTOMER_ID = :customerId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("customerId", customerId);
        query.setParameter("packageDetailId", packageDetailId);
        return query.executeUpdate();
    }
}
