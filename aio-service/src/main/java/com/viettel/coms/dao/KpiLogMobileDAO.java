package com.viettel.coms.dao;

import com.viettel.coms.bo.KpiLogMobileBO;
import com.viettel.coms.dto.CatConstructionTypeDTO;
import com.viettel.coms.dto.KpiLogMobileDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository("kpiLogMobileDAO")
public class KpiLogMobileDAO extends BaseFWDAOImpl<KpiLogMobileBO, Long> {

    public KpiLogMobileDAO() {
        this.model = new KpiLogMobileBO();
    }

    public KpiLogMobileDAO(Session session) {
        this.session = session;
    }

    //	hoanm1_20180815_start
    public List<KpiLogMobileDTO> rpDailyTask(KpiLogMobileDTO obj, List<String> groupIdList) {
        StringBuilder sql = new StringBuilder("SELECT "
                + " max((select CAT_TASK_NAME from (select CAT_TASK_NAME from KPI_LOG_MOBILE a"
                + " where a.FUNCTION_CODE = 'UPDATE' and a.update_time=klm.update_time "
                + " and a.work_item_id=klm.work_item_id order by KPI_LOG_MOBILE_id desc) where ROWNUM <2)) catTaskName,  "
                + "cct.name constructiontypename, cst.code constructionCode, "
                + "task.DESCRIPTION description,su.EMAIL email, su.FULL_NAME fullname, "
                + " cp.NAME provincename, su.PHONE_NUMBER phonenumber, cp.code provincecode, "
                + "cs.code stationcode,klm.UPDATE_TIME updateTime, task.WORK_ITEM_ID workItemId, "
                + " task.task_name workItemName, "
				+ "'Hoàn thành:'|| ''|| max((select count(*) from construction_task a where a.parent_id=task.construction_task_id and a.WORK_ITEM_ID=task.WORK_ITEM_ID and a.COMPLETE_PERCENT=100)) "
                + " ||'/'||max((select count(*) from construction_task a where a.parent_id=task.construction_task_id and a.WORK_ITEM_ID=task.WORK_ITEM_ID )) luyKeThucHien "
                + " FROM construction_task task inner join detail_month_plan dmp on task.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 "
                + " left join KPI_LOG_MOBILE klm on task.performer_id=klm.SYSUSERID "
                + " and klm.FUNCTION_CODE = 'UPDATE' ");
        if (obj.getUpdateTime() != null) {
            sql.append(" and klm.update_time = :updateTime");
        }
        sql.append(" LEFT JOIN construction cst on task.construction_id=cst.construction_id ");
        sql.append(" left join CAT_CONSTRUCTION_TYPE cct ON cst.CAT_CONSTRUCTION_TYPE_ID = cct.CAT_CONSTRUCTION_TYPE_ID ");
        sql.append(" left join sys_user su on task.performer_id=su.sys_user_id ");
        sql.append(" left join cat_station cs on cst.cat_station_id=cs.cat_station_id ");
        sql.append(" LEFT JOIN CAT_PROVINCE cp ON cs.CAT_PROVINCE_id = cp.CAT_PROVINCE_id ");
        sql.append(" where 1=1 ");
        if (obj.getUpdateTime() != null) {
            sql.append(" and (( CASE WHEN task.MONTH <10 THEN 0 ||task.Month ELSE TO_CHAR(task.Month) END) ||'/' ||task.YEAR)= TO_CHAR(:updateTime, 'MM/yyyy')");
        }
        sql.append(" and task.level_id=3 and nvl(task.COMPLETE_PERCENT,0) < 100 ");

        if (obj.getSysuserid() != null) {
            sql.append(" AND task.performer_id = :userId");
        }
        if (StringUtils.isNotEmpty(obj.getProvincecode())) {
            sql.append(" AND (upper(cp.code) LIKE upper(:provincecode))");
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            sql.append(" and cp.CAT_PROVINCE_ID in :groupIdList ");
        }
        if (obj.getCatConstructionType() != null) {
            sql.append(" AND cct.CAT_CONSTRUCTION_TYPE_ID = :catConstructionType");
        }
        if (obj.getConstructionId() != null) {
            sql.append(" AND task.CONSTRUCTION_ID = :constructionId");
        }
        if (obj.getWorkItemId() != null) {
            sql.append(" AND task.WORK_ITEM_ID = :workItemId");
        }
//		if (obj.getUpdateTime() != null) {
//			sql.append(" AND TO_CHAR(klm.UPDATE_TIME, 'DD-MM-YYYY') = TO_CHAR(:updateTime, 'DD-MM-YYYY') ");
//		}
        sql.append(" group by cct.name ,cst.code ,task.DESCRIPTION ,su.EMAIL ,su.FULL_NAME ,cp.NAME , ");
        sql.append(" su.PHONE_NUMBER ,cp.code ,cs.code ,klm.UPDATE_TIME ,task.WORK_ITEM_ID ,task.task_name ");
        sql.append(" ORDER BY su.FULL_NAME, cst.code, task.task_name, klm.UPDATE_TIME ");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catTaskName", new StringType());
        query.addScalar("constructiontypename", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("email", new StringType());
        query.addScalar("fullname", new StringType());
        query.addScalar("provincename", new StringType());
        query.addScalar("phonenumber", new StringType());
        query.addScalar("provincecode", new StringType());
        query.addScalar("stationcode", new StringType());
        query.addScalar("updateTime", new DateType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("luyKeThucHien", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(KpiLogMobileDTO.class));

        if (obj.getSysuserid() != null) {
            query.setParameter("userId", obj.getSysuserid());
            queryCount.setParameter("userId", obj.getSysuserid());
        }
        if (StringUtils.isNotEmpty(obj.getProvincecode())) {
            query.setParameter("provincecode", obj.getProvincecode());
            queryCount.setParameter("provincecode", obj.getProvincecode());
        }
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
        }
        if (obj.getCatConstructionType() != null) {
            query.setParameter("catConstructionType", obj.getCatConstructionType());
            queryCount.setParameter("catConstructionType", obj.getCatConstructionType());
        }
        if (obj.getConstructionId() != null) {
            query.setParameter("constructionId", obj.getConstructionId());
            queryCount.setParameter("constructionId", obj.getConstructionId());
        }
        if (obj.getWorkItemId() != null) {
            query.setParameter("workItemId", obj.getWorkItemId());
            queryCount.setParameter("workItemId", obj.getWorkItemId());
        }
        if (obj.getUpdateTime() != null) {
            query.setTimestamp("updateTime", obj.getUpdateTime());
            queryCount.setTimestamp("updateTime", obj.getUpdateTime());
        }
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }
//	hoanm1_20180815_end

    public List<CatConstructionTypeDTO> getConstructionTypeForAutoComplete(CatConstructionTypeDTO obj) {
        StringBuilder sql = new StringBuilder("SELECT CAT_CONSTRUCTION_TYPE_ID catConstructionTypeId" + " ,NAME name"
                + " ,CODE code" + " ,STATUS status" + " ,DESCRIPTION description" + " FROM CAT_CONSTRUCTION_TYPE"
                + " WHERE status=1 ");

        if (StringUtils.isNotEmpty(obj.getName())) {
            sql.append(" AND (upper(NAME) LIKE upper(:name) OR upper(code) LIKE upper(:name)) ");
        }
        sql.append(" ORDER BY NAME");

        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("catConstructionTypeId", new LongType());
        query.addScalar("name", new StringType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("description", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(CatConstructionTypeDTO.class));

        if (StringUtils.isNotEmpty(obj.getName())) {
            query.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
            queryCount.setParameter("name", "%" + ValidateUtils.validateKeySearch(obj.getName()) + "%");
        }
        query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
        query.setMaxResults(obj.getPageSize().intValue());
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
        return query.list();
    }
}
