package com.viettel.aio.dao;

import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.aio.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.dto.StockDTO;
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

//VietNT_20190404_create
@EnableTransactionManagement
@Transactional
@Repository("commonDAO")
public class CommonDAO extends BaseFWDAOImpl {

	public CommonDAO() {}

    public CommonDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public <T extends com.viettel.coms.dto.ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    @SuppressWarnings("Duplicates")
    public int insertIntoSmsTable(String subject, String content,
                                  String email, String phoneNum,
                                  Long createdUserId, Date createdDate) {
//        String idSql = "SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL";
//        SQLQuery idQuery = getSession().createSQLQuery(idSql);
//        int smsId = ((BigDecimal) idQuery.uniqueResult()).intValue();

        String sql = "INSERT INTO SEND_SMS_EMAIL " +
                "(SEND_SMS_EMAIL_ID, SUBJECT, CONTENT, RECEIVE_PHONE_NUMBER, RECEIVE_EMAIL, CREATED_DATE, CREATED_USER_ID, status) " +
                "VALUES " +
                "(SEND_SMS_EMAIL_SEQ.nextval, :subject, :content, :phoneNum, :email, :createdDate, :createdUserId, 0) ";
        SQLQuery query = super.getSession().createSQLQuery(sql);
//        query.setParameter("id", smsId);
        query.setParameter("subject", subject);
        query.setParameter("content", content);
        query.setParameter("email", email);
        query.setParameter("phoneNum", phoneNum);
        query.setParameter("createdUserId", createdUserId);
        query.setParameter("createdDate", createdDate);

        return query.executeUpdate();
    }

    public int insertIntoSmsTable(String subject, String content, Long receiverId, Long createdUserId, Date createdDate) {
        String sql = "INSERT INTO SEND_SMS_EMAIL " +
                "(SEND_SMS_EMAIL_ID, SUBJECT, CONTENT, RECEIVE_PHONE_NUMBER, RECEIVE_EMAIL, CREATED_DATE, CREATED_USER_ID, status) " +
                "with a as(select email, phone_number phone from sys_user where sys_user_id = :sysUserId and rownum = 1) " +
                "select SEND_SMS_EMAIL_SEQ.nextval, :subject, :content, a.phone, a.email, :createdDate, :createdUserId, 0 from a ";
//                "VALUES " +
//                "(SEND_SMS_EMAIL_SEQ.nextval, :subject, :content" +
//                ", (select phone_number from sys_user where sys_user_id = :sysUserId and rownum = 1)" +
//                ", (select email from sys_user where sys_user_id = :sysUserId and rownum = 1), :createdDate, :createdUserId, 0) ";
        SQLQuery query = super.getSession().createSQLQuery(sql);
        query.setParameter("subject", subject);
        query.setParameter("content", content);
        query.setParameter("sysUserId", receiverId);
        query.setParameter("createdUserId", createdUserId);
        query.setParameter("createdDate", createdDate);

        return query.executeUpdate();
    }

    public List<UtilAttachDocumentDTO> getListAttachmentByIdAndType(List<Long> idList, List<String> types) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, ")
                .append("OBJECT_ID objectId, ")
                .append("NAME name, ")
                .append("CREATED_DATE createdDate, ")
                .append("CREATED_USER_NAME createdUserName, ")
                .append("TYPE type, ")
                .append("FILE_PATH filePath ")
                .append("FROM ")
                .append("UTIL_ATTACH_DOCUMENT ")
                .append("WHERE OBJECT_ID in (:idList) ")
                .append("AND TYPE in (:types) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("idList", idList);
        query.setParameterList("types", types);

        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("objectId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.addScalar("type", new StringType());

        return query.list();
    }

    public List<UtilAttachDocumentDTO> getListAttachmentByObjIDAndType(Long objectID, String types) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, ")
                .append("NAME name, ")
                .append("CREATED_DATE createdDate, ")
                .append("CREATED_USER_NAME createdUserName, ")
                .append("TYPE type, ")
                .append("FILE_PATH filePath ")
                .append("FROM ")
                .append("UTIL_ATTACH_DOCUMENT ")
                .append("WHERE OBJECT_ID in (:idList) ")
                .append("AND TYPE in (:types) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("idList", objectID);
        query.setParameter("types", types);

        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("filePath", new StringType());
        query.addScalar("type", new StringType());

        return query.list();
    }

    public int deleteById(String tableName, String fieldId, Long id) {
        StringBuilder sql = new StringBuilder("DELETE FROM ")
                .append(tableName)
                .append(StringUtils.SPACE)
                .append("WHERE ")
                .append(fieldId)
                .append(StringUtils.SPACE)
                .append("= :id ");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("id", id);

        return query.executeUpdate();
    }

    public List<SysUserCOMSDTO> getListUser(SysUserCOMSDTO criteria) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("su.EMPLOYEE_CODE employeeCode, ")
                .append("su.sys_user_id sysUserId, ")
                .append("su.full_name fullName, ")
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
        } else {
            if (criteria.getSysUserId() != null) {
                sql.append("AND su.SYS_USER_ID = :sysUserId ");
            }

            if (StringUtils.isNotEmpty(criteria.getEmployeeCode())) {
                sql.append("AND su.EMPLOYEE_CODE = :code ");
            }
        }

        if (StringUtils.isNotEmpty(criteria.getPhoneNumber())) {
            sql.append("AND su.phone_number = :phoneNum ");
        }

        sql.append(" ORDER BY su.EMPLOYEE_CODE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        query.setResultTransformer(Transformers.aliasToBean(SysUserCOMSDTO.class));
        query.addScalar("employeeCode", new StringType());
        query.addScalar("sysUserId", new LongType());
        query.addScalar("fullName", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            query.setParameter("keySearch", "%" + criteria.getKeySearch() + "%");
        } else {
            if (criteria.getSysUserId() != null) {
                query.setParameter("sysUserId", criteria.getSysUserId());
            }

            if (StringUtils.isNotEmpty(criteria.getEmployeeCode())) {
                query.setParameter("code", criteria.getEmployeeCode());
            }
        }

        if (StringUtils.isNotEmpty(criteria.getPhoneNumber())) {
            query.setParameter("phoneNum", criteria.getPhoneNumber());
        }

        return query.list();
    }

    public SysUserCOMSDTO getUserByCodeOrId(SysUserCOMSDTO criteria) {
        List<SysUserCOMSDTO> list = this.getListUser(criteria);
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public SysUserCOMSDTO getUserByPhone(String phoneNum) {
        SysUserCOMSDTO criteria = new SysUserCOMSDTO();
        criteria.setPhoneNumber(phoneNum);
        List<SysUserCOMSDTO> list = this.getListUser(criteria);
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<StockDTO> getStockForAutoComplete(StockDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT " +
                "CAT_STOCK_ID stockId, " +
                "NAME name, " +
                "CODE code " +
                "FROM CAT_STOCK " +
                "WHERE STATUS = 1 ");

        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(" AND (upper(NAME) LIKE upper(:name) escape '&' OR upper(CODE) LIKE upper(:name) escape '&') ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("stockId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(StockDTO.class));
        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + obj.getName() + "%");
        }

        return query.list();
    }

    public List<DepartmentDTO> getListSysGroup(DepartmentDTO criteria, List<String> levelList, boolean isCount) {
	    StringBuilder sql = new StringBuilder("SELECT ")
                .append("SYS_GROUP_ID sysGroupId, ")
                .append("CODE code, ")
                .append("NAME name, ")
                .append("CODE || ' - ' || NAME text ")
                //VietNT_10/07/2019_start
                .append(", AREA_ID areaId, ")
                .append("AREA_CODE areaCode, ")
                .append("PROVINCE_ID provinceId, ")
                .append("PROVINCE_CODE provinceCode ")
                //VietNT_end
                .append("FROM SYS_GROUP ")
                .append("WHERE STATUS = 1 ");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            sql.append("AND (upper(NAME) LIKE upper(:name) escape '&' " +
                    "OR upper(CODE) LIKE upper(:name) escape '&') ");
        }

        if (levelList != null) {
            sql.append("AND GROUP_LEVEL in (:groupLevel) ");
        }

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("AND upper(CODE) = upper(:code) ");
        }
        //VietNT_10/07/2019_start
        if (null != criteria.getSysGroupId()) {
            sql.append("AND SYS_GROUP_ID = :sysGroupId ");
        }
        //VietNT_end

        sql.append("ORDER BY CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            query.setParameter("name", "%" + criteria.getName() + "%");
            queryCount.setParameter("name", "%" + criteria.getName() + "%");
        }

        if (levelList != null) {
            query.setParameterList("groupLevel", levelList);
            queryCount.setParameterList("groupLevel", levelList);
        }

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", criteria.getCode());
            queryCount.setParameter("code", criteria.getCode());
        }

        //VietNT_10/07/2019_start
        if (null != criteria.getSysGroupId()) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        //VietNT_end

        query.setResultTransformer(Transformers.aliasToBean(DepartmentDTO.class));
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("text", new StringType());
        //VietNT_10/07/2019_start
        query.addScalar("areaId", new LongType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceId", new LongType());
        query.addScalar("provinceCode", new StringType());
        //VietNT_end

        if (isCount) {
            this.setPageSize(criteria, query, queryCount);
        }

        return query.list();
    }

    public List<AIOConfigStockedGoodsDTO> getListCatUnit(AIOConfigStockedGoodsDTO criteria, boolean isCount) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("CAT_UNIT_ID catUnitId, ")
                .append("CODE catUnitCode, ")
                .append("NAME catUnitName ")
                .append("FROM CAT_UNIT ")
                .append("WHERE STATUS = 1 ");

        if (StringUtils.isNotEmpty(criteria.getCatUnitName())) {
            sql.append("AND (upper(NAME) LIKE upper(:name) escape '&' " +
                    "OR upper(CODE) LIKE upper(:name) escape '&') ");
        }
        if (criteria.getCatUnitId() != null) {
            sql.append("AND CAT_UNIT_ID = :id ");
        }

        if (StringUtils.isNotEmpty(criteria.getCatUnitCode())) {
            sql.append("AND upper(CODE) = upper(:code) ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getCatUnitName())) {
            query.setParameter("name", "%" + criteria.getCatUnitName() + "%");
            queryCount.setParameter("name", "%" + criteria.getCatUnitName() + "%");
        }
        if (criteria.getCatUnitId() != null) {
            query.setParameter("id", criteria.getCatUnitId());
            queryCount.setParameter("id", criteria.getCatUnitId());
        }

        if (StringUtils.isNotEmpty(criteria.getCatUnitCode())) {
            query.setParameter("code", criteria.getCatUnitCode());
            queryCount.setParameter("code", criteria.getCatUnitCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOConfigStockedGoodsDTO.class));
        query.addScalar("catUnitId", new LongType());
        query.addScalar("catUnitCode", new StringType());
        query.addScalar("catUnitName", new StringType());

        if (isCount) {
            this.setPageSize(criteria, query, queryCount);
        }

        return query.list();
    }

    public List<GoodsDTO> getListGoods(GoodsDTO criteria, boolean isCount) {
        StringBuilder sql = new StringBuilder("SELECT "
                + "G.GOODS_ID goodsId, "
                + "G.NAME name, "
                + "G.CODE code, "
                + "G.UNIT_TYPE unitType, "
                + "G.UNIT_TYPE_NAME unitTypeName, "
                + "G.IS_SERIAL isSerial "
                + "FROM GOODS G "
                + "WHERE G.STATUS=1 And G.CODE =:code ");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            sql.append("AND (upper(G.NAME) LIKE upper(:name) escape '&' " +
                    "OR upper(G.CODE) LIKE upper(:name) escape '&') ");
        }
        if (criteria.getGoodsId() != null) {
            sql.append("AND G.GOODS_ID = :id ");
        }

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("AND upper(G.CODE) = upper(:code) ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            query.setParameter("name", "%" + criteria.getName() + "%");
            queryCount.setParameter("name", "%" + criteria.getName() + "%");
        }

        if (criteria.getGoodsId() != null) {
            query.setParameter("id", criteria.getGoodsId());
            queryCount.setParameter("id", criteria.getGoodsId());
        }

        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", criteria.getCode());
            queryCount.setParameter("code", criteria.getCode());
        }

        query.setResultTransformer(Transformers.aliasToBean(GoodsDTO.class));
        query.addScalar("goodsId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("unitType", new LongType());
        query.addScalar("unitTypeName", new StringType());
        query.addScalar("isSerial", new StringType());

        if (isCount) {
            this.setPageSize(criteria, query, queryCount);
        }

        return query.list();
    }

    //VietNT_19/06/2019_start
    public List<AIOContractDTO> getListContract(AIOContractDTO criteria, boolean isCount) {
	    StringBuilder sql = new StringBuilder("SELECT ")
                .append("CONTRACT_ID contractId, ")
                .append("CONTRACT_CODE contractCode ")
                .append("FROM AIO_CONTRACT ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            sql.append("AND (upper(CONTRACT_CODE) LIKE upper(:name) escape '&') ");
        }
        if (criteria.getContractId() != null) {
            sql.append("AND CONTRACT_ID = :id ");
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            sql.append("AND upper(CONTRACT_CODE) = upper(:code) ");
        }
        if (criteria.getStatus() != null) {
            sql.append("AND status = :status ");
        }

        sql.append("order by contract_code ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        query.setResultTransformer(Transformers.aliasToBean(AIOContractDTO.class));
        if (StringUtils.isNotEmpty(criteria.getName())) {
            query.setParameter("name", "%" + criteria.getName() + "%");
            queryCount.setParameter("name", "%" + criteria.getName() + "%");
        }
        if (criteria.getContractId() != null) {
            query.setParameter("id", criteria.getContractId());
            queryCount.setParameter("id", criteria.getContractId());
        }
        if (StringUtils.isNotEmpty(criteria.getContractCode())) {
            query.setParameter("code", criteria.getContractCode());
            queryCount.setParameter("code", criteria.getContractCode());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }

        query.addScalar("contractId", new LongType());
        query.addScalar("contractCode", new StringType());

        if (isCount) {
            this.setPageSize(criteria, query, queryCount);
        } else {
            query.setMaxResults(criteria.getPageSize());
        }

        return query.list();
    }


    public List<AIOPackageDTO> getListPackage(AIOPackageDTO criteria, boolean isCount) {
        StringBuilder sql = new StringBuilder("SELECT ")
                .append("AIO_PACKAGE_ID aioPackageId, ")
                .append("name name, ")
                .append("code code ")
                .append("FROM AIO_PACKAGE ")
                .append("WHERE 1=1 ");

        if (StringUtils.isNotEmpty(criteria.getName())) {
            sql.append("AND (upper(name) LIKE upper(:name) escape '&' " +
                    "OR upper(CODE) LIKE upper(:name) escape '&') ");
        }
        if (criteria.getAioPackageId() != null) {
            sql.append("AND AIO_PACKAGE_ID = :id ");
        }
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            sql.append("AND upper(code) = upper(:code) ");
        }

        sql.append("order by code ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setResultTransformer(Transformers.aliasToBean(AIOPackageDTO.class));
        if (StringUtils.isNotEmpty(criteria.getName())) {
            query.setParameter("name", "%" + criteria.getName() + "%");
            queryCount.setParameter("name", "%" + criteria.getName() + "%");
        }
        if (criteria.getAioPackageId() != null) {
            query.setParameter("id", criteria.getAioPackageId());
            queryCount.setParameter("id", criteria.getAioPackageId());
        }
        if (StringUtils.isNotEmpty(criteria.getCode())) {
            query.setParameter("code", criteria.getCode());
            queryCount.setParameter("code", criteria.getCode());
        }

        query.addScalar("aioPackageId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());

        if (isCount) {
            this.setPageSize(criteria, query, queryCount);
        } else {
            query.setMaxResults(criteria.getPageSize());
        }

        return query.list();
    }
    //VietNT_end

    public Long getSysGroupLevelByUserId(Long sysUserId, int level) {
        String sql = "select " +
                "TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, :lv) + 1, INSTR(sg.path, '/', 1, :lv + 1) - (INSTR(sg.path, '/', 1, :lv) + 1)))) sysGroupId " +
                "from sys_Group sg " +
                "where sg.sys_group_id = " +
                "(select sys_group_id from sys_user where sys_user_id = :sysUserId) ";

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", sysUserId);
        query.setParameter("lv", level);
        query.addScalar("sysGroupId", new LongType());

        return (Long) query.uniqueResult();
    }

    public Long getLatestSeqNumber(String sequence) {
        String sql = "SELECT last_number + 1 FROM user_sequences WHERE sequence_name = '" + sequence + "' ";
        SQLQuery query = this.getSession().createSQLQuery(sql);

        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    public Long getNextId(String sequence) {
        String sql = "select " + sequence + ".nextval id from dual ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("id", new LongType());

        return (Long) query.uniqueResult();
    }

    public List<String> getDomainDataOfUserPermission(String opKey, String adKey, Long sysUserId) {
        String sql = "select dd.DATA_ID from SYS_USER s " +
                "LEFT JOIN USER_ROLE ur on s.SYS_USER_ID = ur.SYS_USER_ID " +
                "LEFT JOIN user_role_data urd on ur.USER_ROLE_ID = urd.USER_ROLE_ID " +
                "LEFT JOIN DOMAIN_DATA dd on urd.DOMAIN_DATA_ID = dd.DOMAIN_DATA_ID " +
                "LEFT JOIN SYS_ROLE sr on sr.SYS_ROLE_ID = ur.SYS_ROLE_ID " +
                "LEFT JOIN ROLE_PERMISSION rp on sr.SYS_ROLE_ID = rp.SYS_ROLE_ID " +
                "LEFT JOIN PERMISSION p on rp.PERMISSION_ID = p.PERMISSION_ID " +
                "LEFT JOIN AD_RESOURCE ad on ad.AD_RESOURCE_ID = p.AD_RESOURCE_ID " +
                "LEFT JOIN OPERATION o on o.OPERATION_ID = p.OPERATION_ID " +
                "where s.SYS_USER_ID = :userId " +
                "and o.CODE = :opKey " +
                "and ad.CODE = :adKey ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.addScalar("DATA_ID", new StringType());
        query.setParameter("userId", sysUserId);
        query.setParameter("opKey", opKey);
        query.setParameter("adKey", adKey);

        return query.list();
    }

    public List<UtilAttachDocumentDTO> getListAttachmentPathByIdAndType(List<Long> idList, List<String> types) {
        StringBuilder sql = new StringBuilder()
                .append("select ")
                .append("UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, ")
                .append("OBJECT_ID objectId, ")
                .append("NAME name, ")
                .append("FILE_PATH filePath ")
                .append("FROM ")
                .append("UTIL_ATTACH_DOCUMENT ")
                .append("WHERE OBJECT_ID in (:idList) ")
                .append("AND TYPE in (:types) ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameterList("idList", idList);
        query.setParameterList("types", types);

        query.setResultTransformer(Transformers.aliasToBean(UtilAttachDocumentDTO.class));
        query.addScalar("utilAttachDocumentId", new LongType());
        query.addScalar("objectId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("filePath", new StringType());

        return query.list();
    }

    public List<String> getUserProvinceCodes(List<Long> ids) {
        String sql = "select province_code " +
                "from sys_group " +
                "where sys_group_id = (select sys_group_id from sys_user where sys_user_id in (:sysUserIds)) ";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("sysUserIds", ids);
        query.addScalar("province_code", new StringType());

        return query.list();
    }
}
