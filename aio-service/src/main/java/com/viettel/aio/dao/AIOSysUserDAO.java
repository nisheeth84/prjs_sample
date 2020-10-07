package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.dto.AIOSysGroupDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.*;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import a.c;
import com.viettel.aio.bo.AIOAreaBO;
import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.jdbc.object.SqlQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptEngine;
import java.math.BigDecimal;
import java.util.List;

//VietNT_20190506_create
@EnableTransactionManagement
@Transactional
@Repository("aioSysUserDAO")
public class AIOSysUserDAO extends BaseFWDAOImpl<AIOSysUserBO, Long> {

    public AIOSysUserDAO() {
        this.model = new AIOSysUserBO();
    }

    public AIOSysUserDAO(Session session) {
        this.session = session;
    }

    private static final String HIBERNATE_ESCAPE_CHAR = "\\";

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public AIOSysUserDTO getUserCTV(String username) {
        String sql = "SELECT " +
                "su.SYS_USER_ID sysUserId, " +
                "su.LOGIN_NAME loginName, " +
                "su.FULL_NAME fullName, " +
                "su.PASSWORD password, " +
                "su.EMPLOYEE_CODE employeeCode, " +
                "su.EMAIL email, " +
                "su.PHONE_NUMBER phoneNumber, " +
                "su.STATUS status, " +
//                "su.NEW_ID newId, " +
//                "su.CHANGE_PASSWORD_DATE changePasswordDate, " +
//                "su.NEED_CHANGE_PASSWORD needChangePassword, " +
                "su.SYS_GROUP_ID sysGroupId, " +
                "su.SALE_CHANNEL saleChannel, " +
//                "su.PARENT_USER_ID parentUserId, " +
                "su.type_user typeUser, " +
                "su.ADDRESS address, " +
                "su.TAX_CODE taxCode, " +
                "sg.NAME sysGroupName " +
                "FROM SYS_USER su " +
                "LEFT JOIN sys_group sg ON su.SYS_GROUP_ID = sg.SYS_GROUP_ID " +
                "WHERE (upper(su.login_name) = upper(:username) " +
                " or upper(su.EMPLOYEE_CODE) = upper(:username) " +
                " or upper(su.PHONE_NUMBER) = upper(:username)) " +
                "and su.status = 1 " +
                "and su.type_user is NOT NULL " +
                "and su.type_user in (1, 2) ";

        SQLQuery query = this.getSession().createSQLQuery(sql);

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("password", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new LongType());
//        query.addScalar("newId", new LongType());
//        query.addScalar("changePasswordDate", new DateType());
//        query.addScalar("needChangePassword", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("saleChannel", new StringType());
//        query.addScalar("parentUserId", new LongType());
        query.addScalar("typeUser", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("taxCode", new StringType());
        query.setParameter("username", username);

        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOSysUserDTO) query.list().get(0);
        }
        return null;
    }

    public AIOSysUserDTO getSysUserByTaxCodeAndPhoneNum(String taxCode, String phoneNumber) {
        String sql = "select " +
                "su.SYS_USER_ID sysUserId, " +
                "su.EMPLOYEE_CODE employeeCode, " +
                "su.PHONE_NUMBER phoneNumber, " +
                "su.tax_code taxCode " +

                "from sys_user su " +
                "where (tax_code = :taxCode " +
                "or PHONE_NUMBER = :phoneNumber) " +
                "and type_user is not null " +
                "and type_user in (1,2) ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));

        query.addScalar("sysUserId", new LongType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("taxCode", new StringType());
        query.setParameter("taxCode", taxCode);
        query.setParameter("phoneNumber", phoneNumber, new StringType());

        List list = query.list();
        if (list != null && !list.isEmpty()) {
            return (AIOSysUserDTO) (list.get(0));
        }
        return null;
    }

    public List<AIOSysGroupDTO> getGroupTree(String path, List<Long> level) {
        String sql = "select " +
                "SYS_GROUP_ID sysGroupId, " +
                "CODE code, " +
                "NAME name, " +
                "PARENT_ID parentId, " +
                "GROUP_LEVEL groupLevel " +
                "from sys_group where path like :path " +
                "and GROUP_LEVEL in (:level) " +
                "and status = 1 " +
                "order by SYS_GROUP_ID ";

        SQLQuery query = getSession().createSQLQuery(sql);
        query.setResultTransformer(Transformers.aliasToBean(AIOSysGroupDTO.class));
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("name", new StringType());
        query.addScalar("parentId", new LongType());
        query.addScalar("groupLevel", new StringType());
        query.setParameterList("level", level);
        query.setParameter("path", path);

        return query.list();
    }

    public int updateNewPassword(Long sysUserId, String password) {
        String sql = "update sys_user set " +
                "password = :password " +
                "where sys_user_id = :id ";
        SQLQuery query = getSession().createSQLQuery(sql);
        query.setParameter("password", password);
        query.setParameter("id", sysUserId);
        return query.executeUpdate();
    }

    public List<AIOSysUserDTO> doSearch(AIOSysUserDTO criteria) {

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" select ");
        sqlBuilder.append(" u.SYS_USER_ID sysUserId, ");
        sqlBuilder.append(" u.LOGIN_NAME loginName, ");
        sqlBuilder.append(" u.FULL_NAME fullName, ");
        sqlBuilder.append(" u.EMPLOYEE_CODE employeeCode, ");
        sqlBuilder.append(" u.EMAIL email, ");
        sqlBuilder.append(" u.PHONE_NUMBER phoneNumber, ");
        sqlBuilder.append(" u.STATUS status, ");
        sqlBuilder.append(" u.NEW_ID newId, ");
        sqlBuilder.append(" u.CHANGE_PASSWORD_DATE changePasswordDate, ");
        sqlBuilder.append(" u.NEED_CHANGE_PASSWORD needChangePassword, ");
        sqlBuilder.append(" u.SYS_GROUP_ID sysGroupId, ");
        sqlBuilder.append(" u.CREATED_DATE createdDate, ");
        sqlBuilder.append(" sg.NAME sysGroupName, ");
        sqlBuilder.append(" sglv2.CODE sysGroupLv2Code, ");
        sqlBuilder.append(" u.SALE_CHANNEL saleChannel, ");
        sqlBuilder.append(" u.PARENT_USER_ID parentUserId, ");
        sqlBuilder.append(" u.type_user typeUser, ");
        sqlBuilder.append(" u.ADDRESS address, ");
        sqlBuilder.append(" (select EMPLOYEE_CODE || '-' || FULL_NAME from sys_user where sys_user_id = u.PARENT_USER_ID) sysUserName ");
        sqlBuilder.append(" from SYS_USER u, ");
        sqlBuilder.append("      SYS_GROUP sg left outer join (select SYS_GROUP_ID, CODE from sys_group where group_level = 2) sglv2");
        sqlBuilder.append("          on instr(sg.PATH, sglv2.SYS_GROUP_ID) > 0");
        sqlBuilder.append(" where 1=1 ");
        sqlBuilder.append("     and u.SYS_GROUP_ID = sg.SYS_GROUP_ID ");
        sqlBuilder.append("     and instr(sg.PATH, sglv2.SYS_GROUP_ID) > 0 ");
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sqlBuilder.append(" and (upper(u.FULL_NAME) LIKE upper(:keySearch) escape  :escapeChar ");
            sqlBuilder.append(" or upper(u.EMAIL) LIKE upper(:keySearch) escape :escapeChar ");
            sqlBuilder.append(" or upper(u.PHONE_NUMBER) LIKE upper(:keySearch) escape  :escapeChar ) ");
        }
        if (criteria.getSysGroupId() != null)
            sqlBuilder.append(" and sglv2.SYS_GROUP_ID = :sysGroupId ");
        if (criteria.getStatus() != null)
            sqlBuilder.append(" and u.STATUS = :status ");
        if (criteria.getTypeUser() != null) {
            sqlBuilder.append(" and u.type_user = :type ");
        } else {
            sqlBuilder.append(" and u.type_user IN (1,2)");
        }
        if (!criteria.getSysGroupIds().isEmpty()) {
            sqlBuilder.append(" and (1 = 1 ");
            for (int i = 0; i < criteria.getSysGroupIds().size(); i++) {
                sqlBuilder.append(" or sg.PATH like :sysGroupId" + i);
            }
            sqlBuilder.append(" ) ");
        }
        SQLQuery query = this.getSession().createSQLQuery(sqlBuilder.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sqlBuilder.toString() + ") ");
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            String keySearch = criteria.getKeySearch().replace("\\", HIBERNATE_ESCAPE_CHAR + "\\")
                    .replace("_", HIBERNATE_ESCAPE_CHAR + "_")
                    .replace("%", HIBERNATE_ESCAPE_CHAR + "%");
            query.setParameter("keySearch", "%" + keySearch + "%");
            queryCount.setParameter("keySearch", "%" + keySearch + "%");
            query.setParameter("escapeChar", HIBERNATE_ESCAPE_CHAR);
            queryCount.setParameter("escapeChar", HIBERNATE_ESCAPE_CHAR);

        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (criteria.getStatus() != null) {
            query.setParameter("status", criteria.getStatus());
            queryCount.setParameter("status", criteria.getStatus());
        }
        if (criteria.getTypeUser() != null) {
            query.setParameter("type", criteria.getTypeUser());
            queryCount.setParameter("type", criteria.getTypeUser());
        }
        if (!criteria.getSysGroupIds().isEmpty()) {
            for (int i = 0; i < criteria.getSysGroupIds().size(); i++) {
                query.setParameter("sysGroupId" + i, "%/" + criteria.getSysGroupIds().get(i) + "/%");
                queryCount.setParameter("sysGroupId" + i, "%/" + criteria.getSysGroupIds().get(i) + "/%");
            }
        }
        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("newId", new LongType());
        query.addScalar("changePasswordDate", new DateType());
        query.addScalar("needChangePassword", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysGroupLv2Code", new StringType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("parentUserId", new LongType());
        query.addScalar("typeUser", new LongType());
        query.addScalar("address", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        this.setPageSize(criteria, query, queryCount);
        List<AIOSysUserDTO> ls = query.list();
        return ls;
    }

    public List<AIOSysUserDTO> searchParentUsers(AIOSysUserDTO criteria) {

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" select ");
        sqlBuilder.append("     u.SYS_USER_ID sysUserId ");
        sqlBuilder.append("     ,u.LOGIN_NAME loginName ");
        sqlBuilder.append("     ,u.FULL_NAME fullName ");
        sqlBuilder.append("     ,u.EMPLOYEE_CODE employeeCode ");
        sqlBuilder.append("     ,u.EMAIL email ");
        sqlBuilder.append("     ,u.PHONE_NUMBER phoneNumber ");
        sqlBuilder.append("     ,u.STATUS status ");
        sqlBuilder.append("     ,u.NEW_ID newId ");
        sqlBuilder.append("     ,u.CHANGE_PASSWORD_DATE changePasswordDate ");
        sqlBuilder.append("     ,u.NEED_CHANGE_PASSWORD needChangePassword ");
        sqlBuilder.append("     ,u.SYS_GROUP_ID sysGroupId ");
        sqlBuilder.append("     ,sg.CODE sysGroupName ");
        sqlBuilder.append("     ,u.SALE_CHANNEL saleChannel ");
        sqlBuilder.append("     ,u.PARENT_USER_ID parentUserId ");
        sqlBuilder.append("     ,u.type_user typeUser ");
        sqlBuilder.append("     ,u.ADDRESS address ");
        sqlBuilder.append(" from SYS_USER u, SYS_GROUP sg");
        sqlBuilder.append(" where 1=1 ");
        sqlBuilder.append("     and sg.SYS_GROUP_ID = u.SYS_GROUP_ID ");
        sqlBuilder.append("     and u.STATUS = 1 ");
        sqlBuilder.append("     and u.type_user IS NULL ");
        sqlBuilder.append("     and TO_NUMBER((substr(sg.path, INSTR(sg.path, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 2 + 1) - (INSTR(sg.path, '/', 1, 2) + 1)))) IN (:sysGroupIds)");

        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            sqlBuilder.append(" and (upper(u.FULL_NAME) like upper(:keySearch) escape  :escapeChar ");
            sqlBuilder.append(" or upper(u.EMAIL) like upper(:keySearch) escape :escapeChar ");
            sqlBuilder.append(" or upper(u.EMPLOYEE_CODE) like upper(:keySearch) escape  :escapeChar ) ");
        }

        SQLQuery query = this.getSession().createSQLQuery(sqlBuilder.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sqlBuilder.toString() + ") ");
        if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
            String keySearch = criteria.getKeySearch().replace("\\", HIBERNATE_ESCAPE_CHAR + "\\")
                    .replace("_", HIBERNATE_ESCAPE_CHAR + "_")
                    .replace("%", HIBERNATE_ESCAPE_CHAR + "%");
            query.setParameter("keySearch", "%" + keySearch + "%");
            queryCount.setParameter("keySearch", "%" + keySearch + "%");
            query.setParameter("escapeChar", HIBERNATE_ESCAPE_CHAR);
            queryCount.setParameter("escapeChar", HIBERNATE_ESCAPE_CHAR);
        }

        if (!criteria.getSysGroupIds().isEmpty()) {
            query.setParameterList("sysGroupIds", criteria.getSysGroupIds());
            queryCount.setParameterList("sysGroupIds", criteria.getSysGroupIds());
        }

        query.addScalar("sysUserId", new LongType());
        query.addScalar("loginName", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("phoneNumber", new StringType());
        query.addScalar("status", new LongType());
        query.addScalar("newId", new LongType());
        query.addScalar("changePasswordDate", new DateType());
        query.addScalar("needChangePassword", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("saleChannel", new StringType());
        query.addScalar("parentUserId", new LongType());
        query.addScalar("typeUser", new LongType());
        query.addScalar("address", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSysUserDTO.class));
        this.setPageSize(criteria, query, queryCount);
        List<AIOSysUserDTO> ls = query.list();
        return ls;
    }

    public void doUpdateStatus(AIOSysUserDTO obj) {

        String sql = "Update SYS_USER SET STATUS = :status WHERE SYS_USER_ID = :sysUserId";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("status", obj.getStatus());
        query.setParameter("sysUserId", obj.getSysUserId());
        query.executeUpdate();
    }

    public void updateNewEmployeeCode(Long sysUserId) {

        String code = "";
        StringBuilder sql = new StringBuilder("select nvl(sg.PROVINCE_CODE, '')");
        sql.append(" || '-' || ");
        sql.append(" case u.type_user when 1 then 'CTV' when 2 then 'DLBH' end ");
        sql.append(" || '-' || lpad(AIO_CONTRIBUTOR_SEQ.NEXTVAL, 4, '0') ");
        sql.append(" code ");
        sql.append(" from SYS_USER u, SYS_GROUP sg ");
        sql.append(" WHERE u.SYS_GROUP_ID = sg.SYS_GROUP_ID and u.SYS_USER_ID = :sysUserId ");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameter("sysUserId", sysUserId);
        query.addScalar("code", new StringType());
        Object ret = query.uniqueResult();
        if (ret != null)
            code = (String) ret;

        if (StringUtils.isEmpty(code))
            throw new BusinessException("Quá trình sinh mã bị lỗi");

        String sqlUpdate = "Update SYS_USER SET LOGIN_NAME = :code, EMPLOYEE_CODE = :code WHERE SYS_USER_ID = :sysUserId";
        SQLQuery queryUpdate = this.getSession().createSQLQuery(sqlUpdate);
        queryUpdate.setParameter("code", code);
        queryUpdate.setParameter("sysUserId", sysUserId);
        queryUpdate.executeUpdate();

    }

    public AIOSysUserBO findItem(String code){
        Query query=this.getSession().createQuery("from AIOSysUserBO where  employeeCode=:employeeCode");
        query.setParameter("employeeCode",code);

        if(query.list()!=null&&!query.list().isEmpty()){
            return (AIOSysUserBO)query.list().get(0);
        }

        return  null;
    }

    public void doUpdatePassword(AIOSysUserDTO obj) {

        String sql = "Update SYS_USER SET PASSWORD = :pwd WHERE SYS_USER_ID = :sysUserId";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("pwd", "+H95NwKEYyu5ajvPS8oRyA==:llWpk5yE00s6zJhBCp3Vag==");
        query.setParameter("sysUserId", obj.getSysUserId());
        query.executeUpdate();
    }
}
