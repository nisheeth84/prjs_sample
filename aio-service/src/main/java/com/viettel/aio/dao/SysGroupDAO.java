package com.viettel.aio.dao;

import com.viettel.aio.bo.SysGroupBO;
import com.viettel.aio.dto.SysGroupDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author hailh10
 */
@Repository("AIOsysGroupDAO")
public class SysGroupDAO extends BaseFWDAOImpl<SysGroupBO, Long> {

    public SysGroupDAO() {
        this.model = new SysGroupBO();
    }

    public SysGroupDAO(Session session) {
        this.session = session;
    }	
    //Huypq-20181102-start
//	@SuppressWarnings("unchecked")
	public List<SysGroupDTO> doSearch(SysGroupDTO obj) {
//		StringBuilder stringBuilder = getSelectAllQuery();
//		stringBuilder.append("WHERE STATUS=1 ");
//
//		if (StringUtils.isNotEmpty(criteria.getKeySearch())) {
//			stringBuilder
//					.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
//		}
//		
//		if (null != criteria.getGroupLevelLst() && criteria.getGroupLevelLst().size()>0) {
//			stringBuilder.append(" AND T1.GROUP_LEVEL in (:groupLevelLst) ");
//		}
//		
//		if(criteria.getSysGroupId() != null){
//			stringBuilder
//			.append(" AND (PARENT_ID = :sysGroupId OR SYS_GROUP_ID = :sysGroupId)");
//		}
//		
//		if (StringUtils.isNotEmpty(criteria.getName())) {
//			stringBuilder
//					.append(" AND (UPPER(NAME) like UPPER(:name) escape '&')");
//		}
//		
//		stringBuilder.append(" ORDER BY GROUP_LEVEL");
//
//		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
//		sqlCount.append(stringBuilder.toString());
//		sqlCount.append(")");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
//
//		query.addScalar("sysGroupId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("parentId", new LongType());
//		query.addScalar("parentName", new StringType());
//		query.addScalar("status", new StringType());
//		query.addScalar("path", new StringType());
//		query.addScalar("effectDate", new DateType());
//		query.addScalar("endDate", new DateType());
//		query.addScalar("groupLevel", new StringType());

		StringBuilder sql = new StringBuilder();
		sql.append(
				"SELECT DP.SYS_GROUP_ID id, DP.GROUP_NAME_LEVEL1 groupNameLevel1, DP.GROUP_NAME_LEVEL2 groupNameLevel2, DP.GROUP_NAME_LEVEL3 groupNameLevel3, "
						+ "DP.CODE code,(DP.CODE ||'-' || DP.NAME) text, DP.NAME name, DP.SYS_GROUP_ID sysGroupId, DP.GROUP_LEVEL groupLevel,"
						+ "DP.PARENT_ID parentId, DP.STATUS status, DP.PATH path,"
						+ "DP.EFFECT_DATE effectDate, DP.END_DATE endDate, DP1.NAME parentName"
						+ " FROM CTCT_CAT_OWNER.SYS_GROUP DP "
						+ "LEFT Join CTCT_CAT_OWNER.SYS_GROUP DP1 "
						+ "On DP1.SYS_GROUP_ID=DP.PARENT_ID "
						+ "WHERE DP.STATUS=1 and upper(DP.GROUP_NAME_LEVEL1) like upper('%Công ty CP Công trình Viettel%') ");
		if (StringUtils.isNotEmpty(obj.getCode())) {
			sql.append(" AND upper(DP.CODE) like upper(:code) OR upper(DP.NAME) like upper(:code)");
		}
		if (obj.getId() != null) {
			sql.append(" AND (DP.PARENT_ID = :id OR DP.SYS_GROUP_ID=:id )");
		}
		sql.append("ORDER BY DP.CODE");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("id", new LongType());
		query.addScalar("groupNameLevel1", new StringType());
		query.addScalar("groupNameLevel2", new StringType());
		query.addScalar("groupNameLevel3", new StringType());
		query.addScalar("code", new StringType());
		query.addScalar("text", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("groupLevel", new StringType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new StringType());
		query.addScalar("path", new StringType());
		query.addScalar("parentName", new StringType());
		query.addScalar("effectDate", new DateType());
		query.addScalar("endDate", new DateType());

        query.setResultTransformer(Transformers.aliasToBean(SysGroupDTO.class));
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }

        if (StringUtils.isNotEmpty(obj.getCode())) {
            query.setParameter("code", "%" + ValidateUtils.validateKeySearch(obj.getCode()) + "%");
        }

        if (obj.getId() != null) {
            query.setParameter("id", obj.getId());
        }
        return query.list();
	}
	//Huypq-20181102-end
//	public SysGroupDTO findByCode(String value) {
//		StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE upper(T1.CODE) = upper(:code)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("parentId", new LongType());
//		query.addScalar("parentName", new StringType());
//		query.addScalar("status", new StringType());
//		query.addScalar("path", new StringType());
//		query.addScalar("effectDate", new DateType());
//		query.addScalar("endDate", new DateType());
//
//		query.setParameter("code", value);
//		query.setResultTransformer(Transformers.aliasToBean(SysGroupDTO.class));
//
//		return (SysGroupDTO) query.uniqueResult();
//	}
//
//	public SysGroupDTO findByCodeForImport(String value) {
//		StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE upper(T1.CODE) = upper(:code) and (T1.GROUP_LEVEL = 1 OR T1.GROUP_LEVEL = 2)");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("parentId", new LongType());
//		query.addScalar("parentName", new StringType());
//		query.addScalar("status", new StringType());
//		query.addScalar("path", new StringType());
//		query.addScalar("effectDate", new DateType());
//		query.addScalar("endDate", new DateType());
//
//		query.setParameter("code", value);
//		query.setResultTransformer(Transformers.aliasToBean(SysGroupDTO.class));
//
//		return (SysGroupDTO) query.uniqueResult();
//	}

	public List<SysGroupDTO> getForAutoComplete(SysGroupDTO obj) {
				
		
		StringBuilder stringBuilder = getSelectAllQuery();
		stringBuilder.append("Where STATUS = 1");
		stringBuilder.append(obj.getIsSize() ? " AND ROWNUM <=20" : "");
		
		if (null != obj.getGroupLevelLst() && obj.getGroupLevelLst().size()>0) {
			stringBuilder.append(" AND T1.GROUP_LEVEL in (:groupLevelLst) ");
		}
		
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			stringBuilder
					.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
		}
		stringBuilder.append(" ORDER BY NAME");
		
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("sysGroupId", new LongType());
		query.addScalar("code", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("parentId", new LongType());
		query.addScalar("parentName", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("path", new StringType());
		query.addScalar("effectDate", new DateType());
		query.addScalar("endDate", new DateType());
	
		query.setResultTransformer(Transformers.aliasToBean(SysGroupDTO.class));
		
		if (null != obj.getGroupLevelLst() && obj.getGroupLevelLst().size()>0) {
			query.setParameterList("groupLevelLst", obj.getGroupLevelLst());
		}
		
		if (StringUtils.isNotEmpty(obj.getKeySearch())) {
			query.setParameter("key", "%" + obj.getKeySearch() + "%");
		}
		query.setMaxResults(20);
		return query.list();
	}
	
//	@SuppressWarnings("unchecked")
//	public List<SysGroupDTO> getForComboBox(SysGroupDTO obj){
//		String sql = "SELECT SYS_GROUP_ID sysGroupId "
//				+ " ,NAME name" + " ,CODE code"
//				+ " FROM CTCT_CAT_OWNER.SYS_GROUP"
//				+ " WHERE STATUS = 1";
//
//		StringBuilder stringBuilder = new StringBuilder(sql);
//
//		if(StringUtils.isNotEmpty(obj.getKeySearch())){
//			stringBuilder.append(" AND (UPPER(NAME) like UPPER(:key) OR UPPER(CODE) like UPPER(:key) escape '&')");
//		}
//		stringBuilder.append(" ORDER BY CODE");
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("catConstructionTypeId", new LongType());
//		query.addScalar("name", new StringType());
//		query.addScalar("code", new StringType());
//
//		query.setResultTransformer(Transformers
//				.aliasToBean(SysGroupDTO.class));
//
//		if(StringUtils.isNotEmpty(obj.getKeySearch())){
//			query.setParameter("key","%"+ obj.getKeySearch()+"%");
//		}
//
//		return query.list();
//	}
//
//	@SuppressWarnings("unchecked")
//	public SysGroupDTO getById(Long id) {
//    	StringBuilder stringBuilder = getSelectAllQuery();
//    	stringBuilder.append("WHERE T1.SYS_GROUP_ID = :sysGroupId ");
//
//    	SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new LongType());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//		query.addScalar("parentId", new LongType());
//		query.addScalar("parentName", new StringType());
//		query.addScalar("status", new StringType());
//		query.addScalar("path", new StringType());
//		query.addScalar("effectDate", new DateType());
//		query.addScalar("endDate", new DateType());
//
//		query.setParameter("sysGroupId", id);
//		query.setResultTransformer(Transformers.aliasToBean(SysGroupDTO.class));
//
//		return (SysGroupDTO) query.uniqueResult();
//	}
//
	StringBuilder getSelectAllQuery(){
    	StringBuilder stringBuilder = new StringBuilder("select ");
		stringBuilder.append("T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.CODE code ");
		stringBuilder.append(",T1.NAME name ");
		stringBuilder.append(",T1.PARENT_ID parentId ");
		stringBuilder.append(",(SELECT T2.NAME FROM CTCT_CAT_OWNER.SYS_GROUP T2 WHERE T2.SYS_GROUP_ID = T1.PARENT_ID) parentName ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.PATH path ");
		stringBuilder.append(",T1.EFFECT_DATE effectDate ");
		stringBuilder.append(",T1.END_DATE endDate ");
		stringBuilder.append(",T1.GROUP_LEVEL groupLevel ");
    	stringBuilder.append("FROM CTCT_CAT_OWNER.SYS_GROUP T1  ");

    	return stringBuilder;
	}
//
//	public List<SysGroupDTO> getAll(){
//		String sql = "SELECT SYS_GROUP_ID sysGroupId "
//				+ " ,CODE code"
//				+ " FROM CTCT_CAT_OWNER.SYS_GROUP"
//				+ " WHERE STATUS != 0";
//
//		StringBuilder stringBuilder = new StringBuilder(sql);
//
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//		query.addScalar("sysGroupId", new LongType());
//		query.addScalar("code", new StringType());
//
//		query.setResultTransformer(Transformers
//				.aliasToBean(SysGroupDTO.class));
//
//		return query.list();
//	}
}
