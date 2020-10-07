package com.viettel.aio.dao;

import com.viettel.aio.bo.SysUserBO;
import com.viettel.aio.dto.SysUserDTO;
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

import java.util.List;

@Repository("AIOsysUserDAO")
public class SysUserDAO extends BaseFWDAOImpl<SysUserBO, Long> {

    public SysUserDAO() {
        this.model = new SysUserBO();
    }

    public SysUserDAO(Session session) {
        this.session = session;
    }	
    
//    @SuppressWarnings("unchecked")
//	public List<SysUserDTO> doSearch(SysUserDTO criteria) {
//    	StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE 1=1 ");
//		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			stringBuilder
//					.append(" AND (UPPER(EMPLOYEE_CODE) like UPPER(:key) OR UPPER(FULL_NAME) like UPPER(:key)"
//							+ " OR UPPER(T1.EMAIL) like UPPER(:key) escape '&')");
//		}
//
//		if (null != criteria.getGroupLevelLst() && criteria.getGroupLevelLst().size()>0) {
//			stringBuilder.append(" AND T1.SYS_GROUP_ID IN ("
//					+ "SELECT SYS_GROUP_ID FROM CTCT_CAT_OWNER.SYS_GROUP WHERE GROUP_LEVEL in (:groupLevelLst)) ");
//		}
//
////		hnx start 24.3.18
//		if (null != criteria.getSysGroupId()) {
//			stringBuilder.append(getSelectUserGroupQuery());
//		}
////		hnx end 24.3.18
//		if (null != criteria.getStatus()) {
//			stringBuilder.append("AND T1.STATUS = :status ");
//		}
//		if (StringUtils.isNotEmpty(criteria.getPhoneNumber())) {
//			stringBuilder.append("AND UPPER(T1.PHONE_NUMBER) LIKE UPPER(:phoneNumber) ESCAPE '\\' ");
//		}
//		if (StringUtils.isNotEmpty(criteria.getEmail())) {
//			stringBuilder.append("AND UPPER(T1.EMAIL) LIKE UPPER(:email) ESCAPE '\\' ");
//		}
//
//		if (null != criteria.getSysUserId()) {
//			stringBuilder.append("AND T1.SYS_USER_ID = :sysUserId ");
//		}
//
//		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(stringBuilder.toString());
//		sqlCount.append(")");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//
////		query.addScalar("totalRecord", new IntegerType());
//		query.addScalar("sysGroupId", new DoubleType());
////		query.addScalar("sysGroupName", new StringType());
//		query.addScalar("needChangePassword", new LongType());
//		query.addScalar("changePasswordDate", new DateType());
//		query.addScalar("newId", new LongType());
////		query.addScalar("newName", new StringType());
//		query.addScalar("status", new LongType());
//		query.addScalar("phoneNumber", new StringType());
//		query.addScalar("email", new StringType());
//		query.addScalar("employeeCode", new StringType());
//		query.addScalar("password", new StringType());
//		query.addScalar("fullName", new StringType());
//		query.addScalar("loginName", new StringType());
//		query.addScalar("sysUserId", new LongType());
////		query.addScalar("sysUserName", new StringType());
//
////		hnx start 24.3.18
//
//		if (null != criteria.getGroupLevelLst() && criteria.getGroupLevelLst().size()>0) {
//			query.setParameterList("groupLevelLst", criteria.getGroupLevelLst());
//			queryCount.setParameterList("groupLevelLst", criteria.getGroupLevelLst());
//		}
//
//		if (null != criteria.getSysGroupId()) {
//			query.setParameter("sysGroupId", criteria.getSysGroupId());
//			queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
//		}
////		hnx end 24.3.18
//
//		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
//			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
//		}
//
//		if (null != criteria.getStatus()) {
//			query.setParameter("status", criteria.getStatus());
//			queryCount.setParameter("status", criteria.getStatus());
//		}
//		if (StringUtils.isNotEmpty(criteria.getPhoneNumber())) {
//			query.setParameter("phoneNumber", "%" + criteria.getPhoneNumber() + "%");
//			queryCount.setParameter("phoneNumber", "%" + criteria.getPhoneNumber() + "%");
//		}
//		if (StringUtils.isNotEmpty(criteria.getEmail())) {
//			query.setParameter("email", "%" + criteria.getEmail()+ "%");
//			queryCount.setParameter("email", "%" + criteria.getEmail()+ "%");
//		}
//
//
//		if (null != criteria.getSysUserId()) {
//			query.setParameter("sysUserId", criteria.getSysUserId());
//			queryCount.setParameter("sysUserId", criteria.getSysUserId());
//		}
//
//		query.setResultTransformer(Transformers
//				.aliasToBean(SysUserDTO.class));
//		if (criteria.getPage() != null && criteria.getPageSize() != null) {
//			query.setFirstResult((criteria.getPage().intValue() - 1)
//					* criteria.getPageSize().intValue());
//			query.setMaxResults(criteria.getPageSize().intValue());
//		}
//		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
//		return query.list();
//	}
//
//	public SysUserDTO findByLoginName(String value) {
//		StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE T1.SYS_GROUP_ID =sys.SYS_GROUP_ID and upper(T1.LOGIN_NAME) = upper(:value)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new DoubleType());
//		query.addScalar("needChangePassword", new LongType());
//		query.addScalar("changePasswordDate", new DateType());
//		query.addScalar("newId", new LongType());
//		query.addScalar("status", new LongType());
//		query.addScalar("phoneNumber", new StringType());
//		query.addScalar("email", new StringType());
//		query.addScalar("employeeCode", new StringType());
//		query.addScalar("password", new StringType());
//		query.addScalar("fullName", new StringType());
//		query.addScalar("loginName", new StringType());
//		query.addScalar("sysUserId", new LongType());
//
//		query.setParameter("value", value);
//		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
//
//		return (SysUserDTO) query.uniqueResult();
//	}
//
//
//	public SysUserDTO findByEmployeeCode(String code) {
//		StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE T1.SYS_GROUP_ID=sys.SYS_GROUP_ID and upper(T1.EMPLOYEE_CODE) = upper(:code)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new DoubleType());
//		query.addScalar("needChangePassword", new LongType());
//		query.addScalar("changePasswordDate", new DateType());
//		query.addScalar("newId", new LongType());
//		query.addScalar("status", new LongType());
//		query.addScalar("phoneNumber", new StringType());
//		query.addScalar("email", new StringType());
//		query.addScalar("employeeCode", new StringType());
//		query.addScalar("password", new StringType());
//		query.addScalar("fullName", new StringType());
//		query.addScalar("loginName", new StringType());
//		query.addScalar("sysUserId", new LongType());
//
//		query.setParameter("code", code);
//		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
//
//		return (SysUserDTO) query.uniqueResult();
//	}

	private String getSelectUserGroupQuery() {
		String query = " AND T1.sys_group_id=sys.sys_group_id and"
							+ " (case when sys.group_level=4 then"
							+ " (select sys_group_id from sys_group a where a.sys_group_id="
							+ " (select parent_id from sys_group a where a.sys_group_id=sys.parent_id))"
							+ " when sys.group_level=3 then"
							+ " (select sys_group_id from sys_group a where a.sys_group_id=sys.parent_id)"
							+ " else sys.sys_group_id end ) = :sysGroupId";
		return query;
	}
	public List<SysUserDTO> getForAutoComplete(SysUserDTO obj) {
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append(" Where T1.STATUS = 1 ");
		stringBuilder.append( " AND ROWNUM <=20");
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(EMPLOYEE_CODE) like UPPER(:key) OR UPPER(FULL_NAME) like UPPER(:key)"
							+ " OR UPPER(T1.EMAIL) like UPPER(:key))");
		}
		//chinhpx 23032018 
		if (null != obj.getSysGroupId()) {
			stringBuilder
					.append(getSelectUserGroupQuery());
		}
		//chinhpx 23032018 
		stringBuilder.append(" ORDER BY FULL_NAME");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		
		query.addScalar("sysGroupId", new DoubleType());
		query.addScalar("needChangePassword", new LongType());
		query.addScalar("changePasswordDate", new DateType());
		query.addScalar("newId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("phoneNumber", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("employeeCode", new StringType());
		query.addScalar("password", new StringType());
		query.addScalar("fullName", new StringType());
		query.addScalar("loginName", new StringType());
		query.addScalar("sysUserId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));

		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		//chinhpx 23032018 
		if (null != obj.getSysGroupId()) {
			query.setParameter("sysGroupId", obj.getSysGroupId());
		}
		//chinhpx 23032018 
		query.setMaxResults(20);
		return query.list();
	}
	
//	@SuppressWarnings("unchecked")
//	public SysUserDTO getById(Long id) {
//    	StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.SYS_GROUP_ID sysGroupId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM SYS_GROUP WHERE SYS_GROUP_ID = T1.SYS_GROUP_ID) sysGroupName  ");
//		stringBuilder.append(",T1.NEED_CHANGE_PASSWORD needChangePassword ");
//		stringBuilder.append(",T1.CHANGE_PASSWORD_DATE changePasswordDate ");
//		stringBuilder.append(",T1.NEW_ID newId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM NEW WHERE NEW_ID = T1.NEW_ID) newName  ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.PHONE_NUMBER phoneNumber ");
//		stringBuilder.append(",T1.EMAIL email ");
//		stringBuilder.append(",T1.EMPLOYEE_CODE employeeCode ");
//		stringBuilder.append(",T1.PASSWORD password ");
//		stringBuilder.append(",T1.FULL_NAME fullName ");
//		stringBuilder.append(",T1.LOGIN_NAME loginName ");
//		stringBuilder.append(",T1.SYS_USER_ID sysUserId ");
//		stringBuilder.append(",(SELECT CASE WHEN VALUE IS NULL THEN NAME ELSE (VALUE || ' - ' || NAME) END FROM SYS_USER WHERE SYS_USER_ID = T1.SYS_USER_ID) sysUserName  ");
//
//    	stringBuilder.append("FROM SYS_USER T1 ");
//    	stringBuilder.append("WHERE T1.IS_DELETED = 'N' AND T1.SYS_USER_ID = :sysUserId ");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new DoubleType());
//		query.addScalar("sysGroupName", new StringType());
//		query.addScalar("needChangePassword", new LongType());
//		query.addScalar("changePasswordDate", new DateType());
//		query.addScalar("newId", new LongType());
//		query.addScalar("newName", new StringType());
//		query.addScalar("status", new LongType());
//		query.addScalar("phoneNumber", new StringType());
//		query.addScalar("email", new StringType());
//		query.addScalar("employeeCode", new StringType());
//		query.addScalar("password", new StringType());
//		query.addScalar("fullName", new StringType());
//		query.addScalar("loginName", new StringType());
//		query.addScalar("sysUserId", new LongType());
//		query.addScalar("sysUserName", new StringType());
//
//		query.setParameter("sysUserId", id);
//		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
//
//		return (SysUserDTO) query.uniqueResult();
//	}
//
	public StringBuilder getSelectAllQuery(){
		StringBuilder stringBuilder = new StringBuilder("SELECT DISTINCT ");
		stringBuilder.append("T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.NEED_CHANGE_PASSWORD needChangePassword ");
		stringBuilder.append(",T1.CHANGE_PASSWORD_DATE changePasswordDate ");
		stringBuilder.append(",T1.NEW_ID newId ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.PHONE_NUMBER phoneNumber ");
		stringBuilder.append(",T1.EMAIL email ");
		stringBuilder.append(",T1.EMPLOYEE_CODE employeeCode ");
		stringBuilder.append(",T1.PASSWORD password ");
		stringBuilder.append(",T1.FULL_NAME fullName ");
		stringBuilder.append(",T1.LOGIN_NAME loginName ");
		stringBuilder.append(",T1.SYS_USER_ID sysUserId ");

    	stringBuilder.append("FROM CTCT_CAT_OWNER.SYS_USER T1, sys_group sys ");

    	return stringBuilder;
	}
//
//	public List<SysUserDTO> getAll() {
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//
//		stringBuilder.append(" T1.EMPLOYEE_CODE employeeCode ");
//
//		stringBuilder.append(",T1.FULL_NAME fullName ");
//
//		stringBuilder.append(",T1.SYS_USER_ID sysUserId ");
//
//    	stringBuilder.append("FROM CTCT_CAT_OWNER.SYS_USER T1 ");
//    	stringBuilder.append("WHERE T1.status != 0");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//
//		query.addScalar("employeeCode", new StringType());
//
//		query.addScalar("fullName", new StringType());
//
//		query.addScalar("sysUserId", new LongType());
//
//		query.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
//
//		return  query.list();
//	}
////  hoanm1_20180916_start
//  public int RegisterLoginWeb(SysUserDTO userDto) throws ParseException {
//      StringBuilder sql = new StringBuilder();
//      sql.append("INSERT INTO KPI_LOG_LOGIN ");
//      sql.append(
//              "(KPI_LOG_LOGIN_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,FUNCTION_CODE,DESCRIPTION) ");
//      sql.append("VALUES( ");
//      sql.append("KPI_LOG_LOGIN_SEQ.nextval , ");
//
//      sql.append("'" + userDto.getSysUserId() + "', ");
//      sql.append("'" + userDto.getLoginName() + "', ");
//      sql.append("'" + userDto.getPassword() + "', ");
//      sql.append("'" + userDto.getEmail() + "', ");
//      sql.append("'" + userDto.getFullName() + "', ");
//      sql.append("'" + userDto.getEmployeeCode() + "', ");
//      sql.append("'" + userDto.getPhoneNumber() + "', ");
//      sql.append("'" + userDto.getSysGroupName() + "', ");
//      sql.append("'" + userDto.getSysGroupId() + "', ");
//      sql.append("sysdate,");
//      String functionCode = "LOGIN_WEB_IMS";
//      String description = "Đăng nhập web ims";
//      sql.append("'" + functionCode + "', ");
//      sql.append("'" + description + "' ");
//      sql.append(")");
//      SQLQuery query = getSession().createSQLQuery(sql.toString());
//      return query.executeUpdate();
//  }
//  hoanm1_20180916_end
}
