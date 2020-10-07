package com.viettel.coms.dao;

import com.viettel.coms.bo.AssignHandoverBO;
import com.viettel.coms.dto.AssignHandoverDTO;
import com.viettel.coms.dto.ConstructionDetailDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

//VietNT_20181210_created
@EnableTransactionManagement
@Transactional
@Repository("assignHandoverDAO")
public class AssignHandoverDAO extends BaseFWDAOImpl<AssignHandoverBO, Long> {

    public AssignHandoverDAO() {
        this.model = new AssignHandoverBO();
    }

    public AssignHandoverDAO(Session session) {
        this.session = session;
    }

    private final String PERMISSION_RECEIVE_SMS_HANDOVER = "RECEIVE SMS_HANDOVER";


    public List<AssignHandoverDTO> doSearch(AssignHandoverDTO criteria) {
        StringBuilder sql = this.createDoSearchBaseQuery();

        // if listConsType exist then do left join query
        if (criteria.getListCatConstructionType() != null && !criteria.getListCatConstructionType().isEmpty()) {
            sql.append(", t.cat_construction_type_id ");
            sql.append("FROM ASSIGN_HANDOVER a ");
            sql.append("LEFT JOIN construction t on a.construction_id = t.construction_id " +
                    "WHERE 1=1 ");
            sql.append("AND t.cat_construction_type_id in (:listConsType) ");
        } else {
            sql.append("FROM ASSIGN_HANDOVER a ");
            sql.append("WHERE 1=1 ");
        }

        if (null != criteria.getStatus()) {
            sql.append("AND a.STATUS = :status ");
        }
        //query by keySearch: Mã công trình/trạm/tỉnh/kế hoạch/hợp đồng
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (" +
                    "upper(a.CONSTRUCTION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CAT_STATION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CAT_PROVINCE_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CNT_CONTRACT_CODE) LIKE upper(:keySearch) escape '&') ");
        }

        //, sysGroupId, catConstructionType, companyAssignDate
//        if (null != criteria.getSysGroupId()) {
//            sql.append("AND SYS_GROUP_ID LIKE :sysGroupId ");
//        }
        if (null != criteria.getSysGroupId()) {
            sql.append("AND a.SYS_GROUP_ID LIKE :sysGroupId ");
        } else if (StringUtils.isNotEmpty(criteria.getText())) {
            sql.append("AND upper(a.SYS_GROUP_CODE || '_' || a.SYS_GROUP_NAME) like upper(:text) escape '&' ");
        }

        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(a.COMPANY_ASSIGN_DATE) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(a.COMPANY_ASSIGN_DATE) <= :dateTo ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        sql.append("ORDER BY assignHandoverId desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());

        // set params
        if (null != criteria.getStatus()) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getListCatConstructionType() != null && !criteria.getListCatConstructionType().isEmpty()) {
            query.setParameterList("listConsType", criteria.getListCatConstructionType());
            queryCount.setParameterList("listConsType", criteria.getListCatConstructionType());
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (null != criteria.getSysGroupId()) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        } else if (StringUtils.isNotEmpty(criteria.getText())) {
            query.setParameter("text", "%" + criteria.getText() + "%");
            queryCount.setParameter("text", "%" + criteria.getText() + "%");
        }
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        this.addQueryScalarDoSearch(query);

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public AssignHandoverDTO findById(Long id) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append("FROM ASSIGN_HANDOVER a " +
                "WHERE assign_handover_id = :id");

        SQLQuery query = super.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);
        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        this.addQueryScalarDoSearch(query);

        return (AssignHandoverDTO) query.uniqueResult();
    }

    public List<AssignHandoverDTO> findByCodes(String... constructionCodes) {
        String sql = "SELECT " +
                "a.SYS_GROUP_NAME sysGroupName " +
                "FROM ASSIGN_HANDOVER a " +
                "WHERE construction_code = :code";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameterList("code", constructionCodes);
        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        query.addScalar("sysGroupName", new StringType());

        return query.list();
    }

    public List<AssignHandoverDTO> findByIdList(List<Long> assignHandoverIds) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append("FROM ASSIGN_HANDOVER a " +
                "WHERE assign_handover_id IN (:ids)");

        SQLQuery query = super.getSession().createSQLQuery(sql.toString());
        query.setParameterList("ids", assignHandoverIds);
        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        this.addQueryScalarDoSearch(query);

        return query.list();
    }

    //VietNT_20190122_start
    public List<AssignHandoverDTO> findConstructionContractRef(Long constructionId) {
        String sql = "SELECT " +
                "cnt.cnt_contract_id cntContractId, " +
                "cnt.code cntContractCode, " +
                "ct.construction_id constructionId, " +
                "ct.code constructionCode " +
                "FROM construction ct " +
                "LEFT JOIN cnt_constr_work_item_task t ON ct.construction_id = t.construction_id " +
                "LEFT JOIN cnt_contract cnt ON cnt.cnt_contract_id = t.cnt_contract_id " +
                "WHERE 1=1 " +
                "AND cnt.code IS NOT NULL " +
                "AND ct.code IS NOT NULL ";

        if (null != constructionId) {
            sql += "AND ct.construction_id = :constructionId ";
        }

        SQLQuery query = super.getSession().createSQLQuery(sql);
        if (null != constructionId) {
            query.setParameter("constructionId", constructionId);
        }

        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        return query.list();
    }

    /*
    public List<AssignHandoverDTO> findConstructionContractRef(Long constructionId) {
        String sql = "SELECT " +
                "pr.cat_province_id catProvinceId, " +
                "pr.code catProvinceCode, " +
                "cnt.cnt_contract_id cntContractId, " +
                "cnt.code cntContractCode, " +
                "ct.construction_id constructionId, " +
                "ct.code constructionCode, " +
                "ch.code catStationHouseCode, " +
                "ch.cat_station_house_id catStationHouseId, " +
                "cs.cat_station_id catStationId, " +
                "cs.code catStationCode " +
                "FROM construction ct " +
                "LEFT JOIN cat_station cs ON cs.cat_station_id = ct.cat_station_id " +
                "LEFT JOIN cat_station_house ch on ch.cat_station_house_id = cs.cat_station_house_id " +
                "LEFT JOIN cat_province pr ON pr.cat_province_id = cs.cat_province_id " +
                "LEFT JOIN cnt_constr_work_item_task t ON ct.construction_id = t.construction_id " +
                "LEFT JOIN cnt_contract cnt ON cnt.cnt_contract_id = t.cnt_contract_id " +
                "WHERE cnt.code IS NOT NULL " +
                "AND cs.code IS NOT NULL " +
                "AND cnt.code IS NOT NULL " +
                "AND ct.code IS NOT NULL " +
                "AND ch.code IS NOT NULL " +
                "AND pr.code IS NOT NULL ";

        if (null != constructionId) {
            sql += "AND ct.construction_id = :constructionId ";
        }

        SQLQuery query = super.getSession().createSQLQuery(sql);
        if (null != constructionId) {
            query.setParameter("constructionId", constructionId);
        }

        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("catStationHouseId", new LongType());
        query.addScalar("catStationHouseCode", new StringType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catStationCode", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        return query.list();
    }
    */
    //VietNT_end

    public List<AssignHandoverDTO> getListSysGroupCode() {
        String sql = "SELECT CODE sysGroupCode, SYS_GROUP_ID sysGroupId, NAME sysGroupName FROM SYS_GROUP";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysGroupId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));

        return query.list();
    }

    public int insertIntoRpStationComplete(AssignHandoverDTO dto) {
        //mã tỉnh, mã nhà trạm, mã hợp đồng
        String idSql = "SELECT rp_station_complete_seq.nextval FROM DUAL";
        SQLQuery idQuery = getSession().createSQLQuery(idSql);
        int id = ((BigDecimal) idQuery.uniqueResult()).intValue();
        String sql = "INSERT INTO RP_STATION_COMPLETE " + 
                "(RP_STATION_COMPLETE_ID, CAT_PROVINCE_CODE, CAT_PROVINCE_ID, CAT_STATION_HOUSE_CODE, CAT_STATION_HOUSE_ID, CNT_CONTRACT_CODE, CNT_CONTRACT_ID, SYS_GROUP_ID, SYS_GROUP_NAME, SYS_GROUP_CODE ) " +
                "VALUES " +
                "(:id, :catProvinceCode, :catProvinceId, :catStationHouseCode, :catStationHouseId, :cntContractCode, :cntContractId, :sysGroupId, :sysGroupName, :sysGroupCode)";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("id", id);
        query.setParameter("catProvinceCode", dto.getCatProvinceCode());
        query.setParameter("catProvinceId", dto.getCatProvinceId());
        query.setParameter("catStationHouseCode", dto.getCatStationHouseCode());
        query.setParameter("catStationHouseId", dto.getCatStationHouseId());
        query.setParameter("cntContractCode", dto.getCntContractCode());
        query.setParameter("cntContractId", dto.getCntContractId());
        query.setParameter("sysGroupId", dto.getSysGroupId());
        query.setParameter("sysGroupName", dto.getSysGroupName());
        query.setParameter("sysGroupCode", dto.getSysGroupCode());

        return query.executeUpdate();
    }

    public List<SysUserDTO> findUsersReceiveMail(Long sysGroupId) {
        String sql = "SELECT a.PHONE_NUMBER phone, a.EMAIL email " +
                "FROM sys_user a, " +
                "user_role b, " +
                "sys_role c, " +
                "user_role_data d, " +
                "domain_data e, " +
                "role_permission role_per, " +
                "permission pe, " +
                "operation op, " +
                "ad_resource ad " +
                "WHERE " +
                "a.sys_user_id = b.sys_user_id " +
                "AND b.sys_role_id = c.sys_role_id " +
                "AND b.user_role_id = d.user_role_id " +
                "AND d.domain_data_id = e.domain_data_id " +
                "AND c.sys_role_id = role_per.sys_role_id " +
                "AND role_per.permission_id = pe.permission_id " +
                "AND pe.operation_id = op.operation_id " +
                "AND pe.ad_resource_id = ad.ad_resource_id " +
                "AND e.data_id = :sysGroupId " +
                "AND upper(op.code ||' ' ||ad.code) LIKE upper(:permission) escape '&'";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("permission", "%" + PERMISSION_RECEIVE_SMS_HANDOVER + "%");

        query.addScalar("email", new StringType());
        query.addScalar("phone", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));

        return query.list();
    }

    public int insertIntoSendSmsEmailTable(SysUserDTO user, String subject, String content,
                                           Long createdUserId, Date createdDate) {
        return this.insertIntoSendSmsEmailTable(subject, content, user.getEmail(), user.getPhone(), createdUserId, createdDate);
    }

    public int insertIntoSendSmsEmailTable(String subject, String content, String email,
                                           String phoneNum, Long createdUserId, Date createdDate) {
        String idSql = "SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL";
        SQLQuery idQuery = getSession().createSQLQuery(idSql);
        int smsId = ((BigDecimal) idQuery.uniqueResult()).intValue();

        String sql = "INSERT INTO SEND_SMS_EMAIL " +
                "(SEND_SMS_EMAIL_ID, SUBJECT, CONTENT, RECEIVE_PHONE_NUMBER, RECEIVE_EMAIL, CREATED_DATE, CREATED_USER_ID,status) " +
                "VALUES " +
                "(:id, :subject, :content, :phoneNum, :email, :createdDate, :createdUserId,0) ";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("id", smsId);
        query.setParameter("subject", subject);
        query.setParameter("content", content);
        query.setParameter("email", email);
        query.setParameter("phoneNum", phoneNum);
        query.setParameter("createdUserId", createdUserId);
        query.setParameter("createdDate", createdDate);

        return query.executeUpdate();
    }

    public boolean checkContractCatStationHouseExist(Long catStationHouseId, Long contractId) {
        String sql = "SELECT COUNT(1) " +
                "FROM RP_STATION_COMPLETE " +
                "WHERE " +
                "CAT_STATION_HOUSE_ID = :catStationHouseId " +
//                "AND CNT_CONSTRACT_ID = :cntContractId";
				"AND CNT_CONTRACT_ID = :cntContractId";

        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("catStationHouseId", catStationHouseId);
        query.setParameter("cntContractId", contractId);

        return ((BigDecimal) query.uniqueResult()).intValue() == 1;
    }

    public List<String> findUniqueRpStationComplete() {
//        String sql = "select upper(CAT_STATION_HOUSE_ID) || '_' || upper(CNT_CONSTRACT_ID) " + //as customField
        String sql = "select upper(CAT_STATION_HOUSE_ID) || '_' || upper(CNT_CONTRACT_ID) " + //as customField
                "FROM RP_STATION_COMPLETE";

        SQLQuery query = super.getSession().createSQLQuery(sql);
//        query.addScalar("customField", new StringType());

        return (List<String>) query.list();
    }

    private StringBuilder createDoSearchBaseQuery() {
        StringBuilder sql = new StringBuilder("SELECT " +
                "a.ASSIGN_HANDOVER_ID assignHandoverId, " +
                "a.SYS_GROUP_ID sysGroupId, " +
                "a.SYS_GROUP_CODE sysGroupCode, " +
                "a.SYS_GROUP_NAME sysGroupName, " +
                "a.CAT_PROVINCE_ID catProvinceId, " +
                "a.CAT_PROVINCE_CODE catProvinceCode, " +
                "a.CAT_STATION_HOUSE_ID catStationHouseId, " +
                "a.CAT_STATION_HOUSE_CODE catStationHouseCode, " +
                "a.CAT_STATION_ID catStationId, " +
                "a.CAT_STATION_CODE catStationCode, " +
                "a.CONSTRUCTION_ID constructionId, " +
                "a.CONSTRUCTION_CODE constructionCode, " +
                "a.CNT_CONTRACT_ID cntContractId, " +
                "a.CNT_CONTRACT_CODE cntContractCode, " +
                "a.IS_DESIGN isDesign, " +
                "a.COMPANY_ASSIGN_DATE companyAssignDate, " +
                "a.CREATE_DATE createDate, " +
                "a.CREATE_USER_ID createUserId, " +
                "a.UPDATE_DATE updateDate, " +
                "a.UPDATE_USER_ID updateUserId, " +
                "a.STATUS status, " +
                "a.PERFORMENT_ID performentId, " +
                "a.EMAIL email, " +
                "a.DEPARTMENT_ASSIGN_DATE departmentAssignDate, " +
                "a.RECEIVED_STATUS receivedStatus, " +
                "a.OUT_OF_DATE_RECEIVED outOfDateReceived, " +
                "a.OUT_OF_DATE_START_DATE outOfDateStartDate, " +
                "a.RECEIVED_OBSTRUCT_DATE receivedObstructDate, " +
                "a.RECEIVED_OBSTRUCT_CONTENT receivedObstructContent, " +
                "a.RECEIVED_GOODS_DATE receivedGoodsDate, " +
                "a.RECEIVED_GOODS_CONTENT receivedGoodsContent, " +
                "a.RECEIVED_DATE receivedDate, " +
                "a.DELIVERY_CONSTRUCTION_DATE deliveryConstructionDate, " +
                "a.PERFORMENT_CONSTRUCTION_ID performentConstructionId, " +
                "a.PERFORMENT_CONSTRUCTION_NAME performentConstructionName, " +
                "a.SUPERVISOR_CONSTRUCTION_ID supervisorConstructionId, " +
                "a.SUPERVISOR_CONSTRUCTION_NAME supervisorConstructionName, " +
                "a.STARTING_DATE startingDate, " +
                "a.CONSTRUCTION_STATUS constructionStatus, " +
                "a.COLUMN_HEIGHT columnHeight, " +
                "a.STATION_TYPE stationType, " +
                "a.NUMBER_CO numberCo, " +
                "a.HOUSE_TYPE_ID houseTypeId, " +
                "a.HOUSE_TYPE_NAME houseTypeName, " +
                "a.GROUNDING_TYPE_ID groundingTypeId, " +
                "a.GROUNDING_TYPE_NAME groundingTypeName, " +
                "a.HAVE_WORK_ITEM_NAME haveWorkItemName, " +
                "a.IS_FENCE isFence, " +
                "a.OUT_OF_DATE_CONSTRUCTION outOfDateConstruction," +
                "a.PARTNER_NAME partnerName ");
//                "FROM ASSIGN_HANDOVER a");
        return sql;
    }

    private void addQueryScalarDoSearch(SQLQuery query) {
        query.addScalar("assignHandoverId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catStationHouseId", new LongType());
        query.addScalar("catStationHouseCode", new StringType());
        query.addScalar("catStationId", new LongType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("cntContractId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("isDesign", new LongType());
        query.addScalar("companyAssignDate", new DateType());
        query.addScalar("createDate", new DateType());
        query.addScalar("createUserId", new LongType());
        query.addScalar("updateDate", new DateType());
        query.addScalar("updateUserId", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("performentId", new LongType());
        query.addScalar("email", new StringType());
        query.addScalar("departmentAssignDate", new DateType());
        query.addScalar("receivedStatus", new LongType());
        query.addScalar("outOfDateReceived", new LongType());
        query.addScalar("outOfDateStartDate", new LongType());
        query.addScalar("receivedObstructDate", new DateType());
        query.addScalar("receivedObstructContent", new StringType());
        query.addScalar("receivedGoodsDate", new DateType());
        query.addScalar("receivedGoodsContent", new StringType());
        query.addScalar("receivedDate", new DateType());
        query.addScalar("deliveryConstructionDate", new DateType());
        query.addScalar("performentConstructionId", new LongType());
        query.addScalar("performentConstructionName", new StringType());
        query.addScalar("supervisorConstructionId", new LongType());
        query.addScalar("supervisorConstructionName", new StringType());
        query.addScalar("startingDate", new DateType());
        query.addScalar("constructionStatus", new LongType());
        query.addScalar("columnHeight", new LongType());
        query.addScalar("stationType", new LongType());
        query.addScalar("numberCo", new LongType());
        query.addScalar("houseTypeId", new LongType());
        query.addScalar("houseTypeName", new StringType());
        query.addScalar("groundingTypeId", new LongType());
        query.addScalar("groundingTypeName", new StringType());
        query.addScalar("haveWorkItemName", new StringType());
        query.addScalar("isFence", new LongType());
        query.addScalar("outOfDateConstruction", new LongType());
        query.addScalar("partnerName", new StringType());
    }

    //VietNT_20181218_start
    @SuppressWarnings("Duplicates")
    public List<AssignHandoverDTO> doSearchNV(AssignHandoverDTO criteria, String sysGroupId) {
        StringBuilder sql = this.createDoSearchBaseQuery();
        sql.append(", su.full_name fullName ");
        sql.append("FROM ASSIGN_HANDOVER a " +
                "left join sys_user su on su.sys_user_id = a.PERFORMENT_ID " +
                "LEFT JOIN UTIL_ATTACH_DOCUMENT u on a.ASSIGN_HANDOVER_ID = u.OBJECT_ID and type='57'");
        sql.append("WHERE 1=1 ");
        sql.append("AND a.SYS_GROUP_ID = :sysGroupId ");

        if (null != criteria.getStatus()) {
            sql.append("AND a.STATUS = :status ");
        }
        //query by keySearch: Mã công trình/trạm/tỉnh/kế hoạch/hợp đồng
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sql.append("AND (" +
                    "upper(a.CONSTRUCTION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CAT_STATION_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CAT_PROVINCE_CODE) LIKE upper(:keySearch) " +
                    "OR upper(a.CNT_CONTRACT_CODE) LIKE upper(:keySearch) escape '&') ");
        }

        if (null != criteria.getPerformentId()) {
            sql.append("AND a.PERFORMENT_ID = :performentId ");
        }
        if (null != criteria.getDateDeptFrom()) {
            sql.append("AND TRUNC(a.DEPARTMENT_ASSIGN_DATE) >= :dateDeptFrom ");
        }
        if (null != criteria.getDateDeptTo()) {
            sql.append("AND TRUNC(a.DEPARTMENT_ASSIGN_DATE) <= :dateDeptTo ");
        }
        if (null != criteria.getDateFrom()) {
            sql.append("AND TRUNC(a.COMPANY_ASSIGN_DATE) >= :dateFrom ");
        }
        if (null != criteria.getDateTo()) {
            sql.append("AND TRUNC(a.COMPANY_ASSIGN_DATE) <= :dateTo ");
        }
        if (null != criteria.getConstructionStatusList() && !criteria.getConstructionStatusList().isEmpty()) {
            sql.append("AND a.CONSTRUCTION_STATUS in (:constructionStatusList) ");
        }
        if (null != criteria.getReceivedStatusList() && !criteria.getReceivedStatusList().isEmpty()) {
            // search quá hạn nhận bgmb
            int index = criteria.getReceivedStatusList().indexOf(6L);
            if (index >= 0) {
                sql.append("AND (a.OUT_OF_DATE_RECEIVED IS NOT NULL " +
                        "AND a.OUT_OF_DATE_RECEIVED > 0) ");
                criteria.getReceivedStatusList().remove(index);
            }
            //VietNT_20190219_start
            // tim cong trình chua BGMB: performentId = null
            index = criteria.getReceivedStatusList().indexOf(0L);
            if (index >= 0) {
                sql.append("AND a.PERFORMENT_ID IS NULL ");
                criteria.getReceivedStatusList().remove(index);
            }
            //VietNT_end
            if (!criteria.getReceivedStatusList().isEmpty()) {
                sql.append("AND a.RECEIVED_STATUS in (:receivedStatusList) ");	
            }
        }
        if (null != criteria.getConstructionCodeList() && !criteria.getConstructionCodeList().isEmpty()) {
            sql.append("AND upper(a.CONSTRUCTION_CODE) IN (:constructionCodeList) ");
        }
        if (null != criteria.getOutOfDateConstruction()) {
        	if (0 == criteria.getOutOfDateConstruction()) {
        		sql.append("AND (a.OUT_OF_DATE_CONSTRUCTION = 0 OR a.OUT_OF_DATE_CONSTRUCTION IS NULL) ");
        	} else {
                sql.append("AND a.OUT_OF_DATE_CONSTRUCTION > 0 ");
        	}
        }
        if (null != criteria.getOutOfDateStartDate()) {
            if (criteria.getOutOfDateStartDate() == 0) {
                sql.append("AND (a.OUT_OF_DATE_START_DATE IS NULL OR a.OUT_OF_DATE_START_DATE = 0) ");
            } else {
                sql.append("AND a.OUT_OF_DATE_START_DATE > 0 ");
            }
        }
        if (criteria.getIsReceivedGoods()) {
            sql.append("AND a.RECEIVED_GOODS_DATE IS NOT NULL ");
        }
        if (criteria.getIsReceivedObstruct()) {
            sql.append("AND a.RECEIVED_OBSTRUCT_DATE IS NOT NULL ");
        }

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        sql.append("ORDER BY assignHandoverId desc ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());

        query.setParameter("sysGroupId", sysGroupId);
        queryCount.setParameter("sysGroupId", sysGroupId);

        if (null != criteria.getStatus()) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        }
        if (null != criteria.getPerformentId()) {
            query.setParameter("performentId", criteria.getPerformentId());
            queryCount.setParameter("performentId", criteria.getPerformentId());
        }
        if (null != criteria.getDateDeptFrom()) {
            query.setParameter("dateDeptFrom", criteria.getDateDeptFrom());
            queryCount.setParameter("dateDeptFrom", criteria.getDateDeptFrom());
        }
        if (null != criteria.getDateDeptTo()) {
            query.setParameter("dateDeptTo", criteria.getDateDeptTo());
            queryCount.setParameter("dateDeptTo", criteria.getDateDeptTo());
        }
        if (null != criteria.getDateFrom()) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (null != criteria.getDateTo()) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        if (null != criteria.getConstructionStatusList() && !criteria.getConstructionStatusList().isEmpty()) {
            query.setParameterList("constructionStatusList", criteria.getConstructionStatusList());
            queryCount.setParameterList("constructionStatusList", criteria.getConstructionStatusList());
        }
        if (null != criteria.getReceivedStatusList() && !criteria.getReceivedStatusList().isEmpty()) {
            query.setParameterList("receivedStatusList", criteria.getReceivedStatusList());
            queryCount.setParameterList("receivedStatusList", criteria.getReceivedStatusList());
        }
        if (null != criteria.getConstructionCodeList() && !criteria.getConstructionCodeList().isEmpty()) {
            query.setParameterList("constructionCodeList", criteria.getConstructionCodeList());
            queryCount.setParameterList("constructionCodeList", criteria.getConstructionCodeList());
        }

        query.setResultTransformer(Transformers.aliasToBean(AssignHandoverDTO.class));
        this.addQueryScalarDoSearch(query);
        query.addScalar("fullName", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }

    public List<SysUserCOMSDTO> getForSysUserAutoComplete(SysUserCOMSDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT " +
                "su.SYS_USER_ID sysUserId, " +
                "su.FULL_NAME fullName, " +
                "su.EMPLOYEE_CODE employeeCode, " +
                "su.EMAIL email " +
                "FROM CTCT_VPS_OWNER.SYS_USER su " +
                "WHERE 1=1 ");

        if (StringUtils.isNotEmpty(obj.getFullName())) {
            sql.append("AND (upper(su.FULL_NAME) LIKE upper(:fullName) OR " +
                    "upper(su.EMPLOYEE_CODE) LIKE upper(:fullName) OR " +
                    "upper(su.EMAIL) like upper(:fullName) escape '&')");
        }

        sql.append(" ORDER BY su.EMPLOYEE_CODE");
        
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("sysUserId", new LongType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));

        if (StringUtils.isNotEmpty(obj.getFullName())) {
            query.setParameter("fullName", "%" + obj.getFullName() + "%");
            queryCount.setParameter("fullName", "%" + obj.getFullName() + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
        query.setMaxResults(obj.getPageSize());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }


    public void updateWorkItemConstructor(Long workItemId, Long constructorId) {
        String sql = " UPDATE WORK_ITEM wi SET " +
                "wi.is_internal = 2, " +
                "wi.CONSTRUCTOR_ID = :constructorId " +
                "where work_item_id = :workItemId ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("constructorId", constructorId);
        query.setParameter("workItemId", workItemId);
        query.executeUpdate();
    }
    //VietNT_end
}
