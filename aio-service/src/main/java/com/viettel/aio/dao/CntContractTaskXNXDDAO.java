package com.viettel.aio.dao;

import com.viettel.aio.bo.CntContractTaskXNXDBO;
import com.viettel.aio.dto.CatTaskHCQTDTO;
import com.viettel.aio.dto.CntContractTaskXNXDDTO;
import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author HIENVD
 */
@Repository("cntContractTaskXNXDDAO")
public class CntContractTaskXNXDDAO extends BaseFWDAOImpl<CntContractTaskXNXDBO, Long> {

    public CntContractTaskXNXDDAO() {
        this.model = new CntContractTaskXNXDBO();
    }

    public CntContractTaskXNXDDAO(Session session) {
        this.session = session;
    }


//	public List<CntAppendixJobDTO> doSearch() {
//		StringBuilder stringBuilder = new StringBuilder("SELECT ");
//		stringBuilder.append("T1.CAT_UNIT_ID catUnitId ");
//		stringBuilder.append(",T1.CAT_TASK_ID catTaskId ");
//		stringBuilder.append(",T1.WORK_ITEM_TYPE_ID workItemTypeId ");
//		stringBuilder.append(",T1.WORK_ITEM_ID workItemId ");
//		stringBuilder.append(",T1.STATUS status ");
//		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
//		stringBuilder.append(",T1.CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID cntWorkItemTaskHSQTId ");
//		stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
//		stringBuilder.append("FROM CNT_CONSTR_WORK_ITEM_TASK_HCQT T1 ");
//		stringBuilder.append("WHERE 1=1 AND T1.STATUS != 0 ");
//		stringBuilder.append("ORDER BY CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID DESC");
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//		query.addScalar("catUnitId", new LongType());
//		query.addScalar("catTaskId", new LongType());
//		query.addScalar("workItemId", new LongType());
//		query.addScalar("workItemTypeId", new LongType());
//		query.addScalar("status", new LongType());
//		query.addScalar("cntContractId", new LongType());
//		query.addScalar("cntWorkItemTaskHSQTId", new LongType());
//		query.addScalar("catTaskName", new StringType());
//		query.setResultTransformer(Transformers
//				.aliasToBean(CntAppendixJobDTO.class));
//		return query.list();
//	}
//
	public List<CntContractTaskXNXDDTO> doSearchPLHD2(Long cntContractIdIp) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append(" T1.CNT_CONTRACT_TASK_XNXD_ID cntContractTaskXNXDId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
		stringBuilder.append(",T1.CAT_UNIT_NAME catUnitName ");
		stringBuilder.append(",T1.TASK_MASS taskMass ");
		stringBuilder.append(",T1.TASK_PRICE taskPrice ");
		stringBuilder.append(",T1.TOTAL_MONEY totalMoney ");
		stringBuilder.append("FROM CNT_CONTRACT_TASK_XNXD T1 ");
		stringBuilder.append("WHERE 1=1  ");

		if (null != cntContractIdIp) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}

		stringBuilder.append("ORDER BY CNT_CONTRACT_TASK_XNXD_ID DESC");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("cntContractTaskXNXDId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("taskMass", new DoubleType());
		query.addScalar("taskPrice", new LongType());
		query.addScalar("totalMoney", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(CntContractTaskXNXDDTO.class));
		if (null != cntContractIdIp) {
			query.setParameter("cntContractId", cntContractIdIp);
		}
		return query.list();
	}

	public List<CntContractTaskXNXDDTO> doSearchPLHD(CntContractTaskXNXDDTO criteria) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append(" T1.CNT_CONTRACT_TASK_XNXD_ID cntContractTaskXNXDId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.CAT_TASK_NAME catTaskName ");
		stringBuilder.append(",T1.CAT_UNIT_NAME catUnitName ");
		stringBuilder.append(",T1.TASK_MASS taskMass ");
		stringBuilder.append(",T1.TASK_PRICE taskPrice ");
		stringBuilder.append(",T1.TOTAL_MONEY totalMoney ");
	
		stringBuilder.append("FROM CNT_CONTRACT_TASK_XNXD T1 ");

		stringBuilder.append("WHERE 1=1  ");
		if(null != criteria.getKeySearch()) {
			stringBuilder.append(" AND (UPPER(T1.CAT_TASK_NAME) like UPPER(:key) escape '&')");
		}
		if (null != criteria.getCntContractId()) {
			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
		}

		stringBuilder.append("ORDER BY CNT_CONTRACT_TASK_XNXD_ID DESC");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(stringBuilder.toString());
		sqlCount.append(")");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		SQLQuery queryCount=getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("cntContractTaskXNXDId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("catTaskName", new StringType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("taskMass", new DoubleType());
		query.addScalar("taskPrice", new LongType());
		query.addScalar("totalMoney", new LongType());
		if (null != criteria.getCntContractId()) {
			query.setParameter("cntContractId", criteria.getCntContractId());
			queryCount.setParameter("cntContractId", criteria.getCntContractId());
		}

		if (null != criteria.getKeySearch()) {
			query.setParameter("key", "%" + criteria.getKeySearch() + "%");
			queryCount.setParameter("key", "%" + criteria.getKeySearch() + "%");
		}

		query.setResultTransformer(Transformers
				.aliasToBean(CntContractTaskXNXDDTO.class));
		if (criteria.getPage() != null && criteria.getPageSize() != null) {
			query.setFirstResult((criteria.getPage().intValue() - 1)
					* criteria.getPageSize().intValue());
			query.setMaxResults(criteria.getPageSize().intValue());
		}
		criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
		return query.list();
	}

//	public List<CntContractTaskXNXDDTO> checkValidatePLHD(CntContractTaskXNXDDTO criteria) {
//		StringBuilder stringBuilder = new StringBuilder("SELECT * ");
//		stringBuilder.append("FROM CNT_CONTRACT_TASK_XNXD T1 ");
//		stringBuilder.append("WHERE 1=1 ");
//		if (null != criteria.getCntContractId()) {
//			stringBuilder.append("AND T1.CNT_CONTRACT_ID = :cntContractId ");
//		}
//
//		//cong viec
//		if (null != criteria.getCatTaskName()) {
//			stringBuilder.append("AND (UPPER(T1.CAT_TASK_NAME) like UPPER(:catTaskName) escape '&') ");
//		}
//		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
//
//
//		if (null != criteria.getCntContractId()) {  //id hop dong
//			query.setParameter("cntContractId", criteria.getCntContractId());
//		}
//		if (null != criteria.getCatTaskName()) { //id cong viec
//			query.setParameter("catTaskName", criteria.getCatTaskName());
//		}
//		query.setResultTransformer(Transformers.aliasToBean(CntContractTaskXNXDDTO.class));
//		return query.list();
//	}
//
	public void addPLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
		Session ss = getSession();
		ss.save(cntContractTaskXNXDDTO.toModel());
	}
//	public void updatePLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
//		Session ss = getSession();
//		ss.update(cntContractTaskXNXDDTO.toModel());
//	}
//	public void removePLHD(CntContractTaskXNXDDTO cntContractTaskXNXDDTO) {
//		StringBuilder sql = new StringBuilder("delete   "
//				+ " FROM CNT_CONTRACT_TASK_XNXD T1");
//		sql.append(" WHERE UPPER(T1.CNT_CONTRACT_TASK_XNXD_ID) = UPPER(:cntContractTaskXNXD) " );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		if (null != cntContractTaskXNXDDTO.getCntContractTaskXNXDId()) { //id cong viec
//			query.setParameter("cntContractTaskXNXD", cntContractTaskXNXDDTO.getCntContractTaskXNXDId());
//		}
//		 query.executeUpdate();
//	}
//
//	//select count
//	public Long checkExitPLHD(CntContractTaskXNXDDTO obj) {
//		StringBuilder sql = new StringBuilder("Select count(*) "
//				+ " FROM CNT_CONTRACT_TASK_XNXD T1");
//		sql.append(" WHERE UPPER(T1.CAT_TASK_NAME) = UPPER(:catTaskName) AND UPPER(T1.CNT_CONTRACT_ID) = UPPER(:cntContractId) " );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		if (null != obj.getCntContractId()) {  //id hop dong
//			query.setParameter("cntContractId", obj.getCntContractId());
//		}
//		if (null != obj.getCatTaskName()) {  //id hop dong
//			query.setParameter("catTaskName", obj.getCatTaskName());
//		}
//		Long count =((BigDecimal) query.uniqueResult()).longValue();
//		return count;
//	}
//	//hienvd: check va lay gia gia tri ten ma hang muc, id ma hang muc, ma hang muc tu ten hang muc
//	public WorkItemHCQTDTO checkExitInWorkItem(CntAppendixJobDTO obj) {
//		StringBuilder sql = new StringBuilder("Select "
//				+ "T1.WORK_ITEM_ID workItemId, "
//				+ "T1.WORK_ITEM_NAME workItemName, "
//				+ "T1.WORK_ITEM_CODE workItemCode "
//				+ " FROM WORK_ITEM_HCQT T1");
//		sql.append(" WHERE UPPER(T1.WORK_ITEM_NAME) = UPPER(:workItemName) AND T1.STATUS != 0" );
//		sql.append(" AND T1.WORK_ITEM_TYPE_ID = :workItemTypeId " );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("workItemCode", new StringType());
//		query.addScalar("workItemId", new LongType());
//		query.addScalar("workItemName", new StringType());
//		query.setParameter("workItemName", obj.getWorkItemName());
//		query.setParameter("workItemTypeId", obj.getWorkItemTypeId());
//		query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
//
//		return (WorkItemHCQTDTO) query.uniqueResult();
//	}

//	//hienvd: check va lay gia gia tri ten cong viec, id cong viec, ma cong viec tu ten cong viec
//	public CatTaskHCQTDTO checkExitInCatTask(CntAppendixJobDTO obj) {
//		StringBuilder sql = new StringBuilder("Select "
//				+ "T1.CAT_TASK_CODE catTaskCode, "
//				+ "T1.CAT_TASK_ID catTaskId, "
//				+ "T1.CAT_TASK_NAME catTaskName "
//				+ " FROM CAT_TASK_HCQT T1");
//		sql.append(" WHERE UPPER(T1.CAT_TASK_NAME) = UPPER(:catTaskName) AND T1.STATUS != 0" );
//		sql.append(" AND T1.WORK_ITEM_ID = :workItemId" );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("catTaskCode", new StringType());
//		query.addScalar("catTaskId", new LongType());
//		query.addScalar("catTaskName", new StringType());
//		query.setParameter("catTaskName", obj.getCatTaskName());
//		query.setParameter("workItemId", obj.getWorkItemId());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));
//		return (CatTaskHCQTDTO) query.uniqueResult();
//	}
//
//	public CntContractDTO getInfoContract(CntAppendixJobDTO obj){
//		StringBuilder sql = new StringBuilder("Select "
//				+ "code code "
//				+ " FROM CNT_CONTRACT T1");
//		sql.append(" WHERE UPPER(T1.CNT_CONTRACT_ID) = UPPER(:cntContractId) AND T1.STATUS != 0" );
//		SQLQuery query= getSession().createSQLQuery(sql.toString());
//		query.addScalar("code", new StringType());
//		query.setParameter("cntContractId", obj.getCntContractId());
//		query.setResultTransformer(Transformers.aliasToBean(CntContractDTO.class));
//		return (CntContractDTO) query.uniqueResult();
//	}
//
	public List<WorkItemHCQTDTO> checkValidateWorkInWorkType(){
		StringBuilder sql = new StringBuilder("select b.WORK_ITEM_Id workItemId, a.WORK_ITEM_TYPE_NAME||'/'||b.WORK_ITEM_NAME workItemName "
				+ " FROM WORK_ITEM_TYPE_HCQT a, WORK_ITEM_HCQT b ");
		sql.append(" WHERE a.WORK_ITEM_TYPE_ID = b.WORK_ITEM_TYPE_ID");

		SQLQuery query= getSession().createSQLQuery(sql.toString());
		query.addScalar("workItemId", new LongType());
		query.addScalar("workItemName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(WorkItemHCQTDTO.class));
		return query.list();

	}
//
	public List<CatTaskHCQTDTO> checkValidateCatInWorkItem(){
		StringBuilder sql = new StringBuilder("select a.CAT_TASK_ID catTaskId, b.WORK_ITEM_NAME||'/'||a.CAT_TASK_NAME catTaskName "
				+ " FROM CAT_TASK_HCQT a, WORK_ITEM_HCQT b ");
		sql.append(" WHERE a.WORK_ITEM_ID = b.WORK_ITEM_ID");
		SQLQuery query= getSession().createSQLQuery(sql.toString());
		query.addScalar("catTaskId", new LongType());
		query.addScalar("catTaskName", new StringType());
		query.setResultTransformer(Transformers.aliasToBean(CatTaskHCQTDTO.class));
		return query.list();
	}
//
//	//Huypq-20190827-start
//	public List<CntAppendixJobDTO> getDataExportFileTemplate(){
//		StringBuilder sql = new StringBuilder("select wit.WORK_ITEM_TYPE_NAME workItemTypeName, " +
//				" wi.WORK_ITEM_NAME workItemName, " +
//				" task.CAT_TASK_NAME catTaskName " +
//				" from WORK_ITEM_TYPE_HCQT wit " +
//				" left join WORK_ITEM_HCQT wi on wit.WORK_ITEM_TYPE_ID = wi.WORK_ITEM_TYPE_ID " +
//				" left join CAT_TASK_HCQT task on task.WORK_ITEM_ID = wi.WORK_ITEM_ID " +
//				" where wit.STATUS=1 " +
//				" and wi.STATUS=1 " +
//				" and task.STATUS=1 " +
//				" order by wit.WORK_ITEM_TYPE_NAME asc ");
//		SQLQuery query = getSession().createSQLQuery(sql.toString());
//		query.addScalar("workItemTypeName", new StringType());
//		query.addScalar("workItemName", new StringType());
//		query.addScalar("catTaskName", new StringType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CntAppendixJobDTO.class));
//
//		return query.list();
//	}
//
//	public List<CatUnitDTO> getAllCatUnit(){
//		StringBuilder sql = new StringBuilder("select CODE code," +
//				"NAME name " +
//				" from CTCT_CAT_OWNER.CAT_UNIT where status=1");
//		SQLQuery query = getSession().createSQLQuery(sql.toString());
//		query.addScalar("code", new StringType());
//		query.addScalar("name", new StringType());
//
//		query.setResultTransformer(Transformers.aliasToBean(CatUnitDTO.class));
//
//		return query.list();
//	}
//	//huy-end
}
