package com.viettel.coms.dao;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.coms.dto.WorkItemDetailDTO;
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

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * @author hungnx 20180625
 */
@Repository("quantityConstructionDAO")
public class QuantityConstructionDAO extends BaseFWDAOImpl<WorkItemBO, Long> {

    public QuantityConstructionDAO() {
        this.model = new WorkItemBO();
    }

    public QuantityConstructionDAO(Session session) {
        this.session = session;
    }

    public List<WorkItemDetailDTO> doSearchQuantity(WorkItemDetailDTO obj, List<String> groupIdList) {
        StringBuilder stringBuilder = buildQueryQuantity();
        if (groupIdList != null && !groupIdList.isEmpty()) {
            stringBuilder.append(" and ctd.SYS_GROUP_ID in :groupIdList ");
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            stringBuilder
                    .append(" and (upper(cs.CODE) like upper(:keySearch) or upper(c.CODE) like upper(:keySearch))");
        }
        if (obj.getSysGroupId() != null) {
            stringBuilder.append(" AND sg.SYS_GROUP_ID = :sysGroupId");
        }
        if (obj.getSysUserId() != null) {
            stringBuilder.append(" AND su.SYS_USER_ID = :sysUserId");
        }
        if (obj.getDateFrom() != null) {
            stringBuilder.append(" and trunc(ctd.CREATED_DATE) >= :startDateFrom");
        }
        if (obj.getDateTo() != null) {
            stringBuilder.append(" and trunc(ctd.CREATED_DATE) <= :startDateTo");
        }
        if (obj.getWorkItemId() != null) {
            stringBuilder.append(" and w.WORK_ITEM_ID = :workItemId");
        }
        if (obj.getConfirmLst() != null && obj.getConfirmLst().size() > 0) {
            stringBuilder.append(" and ctd.CONFIRM in :confirmLst");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            stringBuilder.append(" AND cp.CAT_PROVINCE_ID = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        stringBuilder.append(" ORDER BY ctd.CREATED_DATE desc");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + stringBuilder.toString() + ")");
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
        }
        if (obj.getWorkItemId() != null) {
            query.setParameter("workItemId", obj.getWorkItemId());
            queryCount.setParameter("workItemId", obj.getWorkItemId());
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }

        if (obj.getSysUserId() != null) {
            query.setParameter("sysUserId", obj.getSysUserId());
            queryCount.setParameter("sysUserId", obj.getSysUserId());
        }
        if (obj.getDateFrom() != null) {
            query.setParameter("startDateFrom", obj.getDateFrom());
            queryCount.setParameter("startDateFrom", obj.getDateFrom());
        }
        if (obj.getDateTo() != null) {
            query.setParameter("startDateTo", obj.getDateTo());
            queryCount.setParameter("startDateTo", obj.getDateTo());
        }
        if (obj.getConfirmLst() != null && obj.getConfirmLst().size() > 0) {
            query.setParameterList("confirmLst", obj.getConfirmLst());
            queryCount.setParameterList("confirmLst", obj.getConfirmLst());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        query.addScalar("dateDo", new DateType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("taskName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("userName", new StringType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("confirm", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("statusConstruction", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("price", new DoubleType());
        query.addScalar("obstructedState", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("cntContractCode", new StringType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("amountConstruction", new DoubleType());
        query.addScalar("statusConstructionTask", new StringType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("path", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(WorkItemDetailDTO.class));
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    private StringBuilder buildQueryQuantity() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(buildQuerySumByDay());
        stringBuilder.append(" SELECT ctd.CREATED_DATE dateDo,sg.NAME sysGroupName,ct.TASK_NAME taskName"
                + " ,cs.CODE catStationCode,c.CODE constructionCode, cs.CAT_PROVINCE_ID catProvinceId"
                + " ,su.FULL_NAME userName, c.CONSTRUCTION_ID constructionId"
                + " ,ctd.AMOUNT amount, ctd.quantity,ctd.CONFIRM confirm"
                + ", ctd.CONSTRUCTION_TASK_ID constructionTaskId, ctd.CAT_TASK_ID catTaskId"
                + ", c.status statusConstruction, c.price price, c.OBSTRUCTED_STATE obstructedState, c.amount amountConstruction"
                + ", w.name workItemName, w.WORK_ITEM_ID workItemId"
                + ", w.status status, cta.QUANTITY_BY_DATE quantityByDate" + ", T6.CODE cntContractCode"
                + ", cp.code catProvinceCode" + ", ct.status statusConstructionTask, ct.path path"
                + " FROM CONSTRUCTION_TASK ct" + " join CONSTRUCTION c on ct.CONSTRUCTION_ID = c.CONSTRUCTION_ID"
                + " left join CAT_STATION cs on cs.CAT_STATION_ID = c.CAT_STATION_ID"
                + " join CAT_TASK cta on cta.CAT_TASK_ID = ct.CAT_TASK_ID"
                + " join tblTaskDaily ctd on ctd.CONSTRUCTION_TASK_ID = ct.CONSTRUCTION_TASK_ID"
                + " left join SYS_USER su on su.SYS_USER_ID = ctd.CREATED_USER_ID"
                + " left join SYS_GROUP sg on sg.SYS_GROUP_ID = ctd.SYS_GROUP_ID"
                + " LEFT JOIN ( SELECT DISTINCT CONSTRUCTION_ID,CODE from CNT_CONSTR_WORK_ITEM_TASK T5 ,CNT_CONTRACT T6 where T6.CNT_CONTRACT_ID = T5.CNT_CONTRACT_ID"
                + " AND T6.CONTRACT_TYPE = 0 and T6.status !=0)T6 ON c.CONSTRUCTION_ID = T6.CONSTRUCTION_ID"
                + " JOIN WORK_ITEM w on ct.WORK_ITEM_ID = w.WORK_ITEM_ID"
                + " JOIN CAT_PROVINCE cp on cp.CAT_PROVINCE_ID = cs.CAT_PROVINCE_ID" + " where c.status != 0"
//				+ "(c.STATUS = 3 or c.status = 5 or c.status = 4 and c.OBSTRUCTED_STATE = 2)"
                + " and ct.LEVEL_ID = 4 and cta.QUANTITY_BY_DATE = 1");
        return stringBuilder;
    }

    private String buildQuerySumByDay() {
        return "with tblTaskDaily as (SELECT trunc(ctd.CREATED_DATE) CREATED_DATE, ctd.CREATED_USER_ID, ctd.sys_group_id ,sum(ctd.amount) amount, sum(ctd.QUANTITY) quantity"
                + ", ctd.CONSTRUCTION_TASK_ID, ctd.CONFIRM, ctd.work_item_id, CTD.CAT_TASK_ID"
                + " FROM CONSTRUCTION_TASK_DAILY ctd group by ctd.CONSTRUCTION_TASK_ID, ctd.CONFIRM, trunc(ctd.CREATED_DATE)"
                + ", ctd.CREATED_USER_ID, ctd.sys_group_id, ctd.work_item_id, CTD.CAT_TASK_ID)";
    }

    public String buildQuerySumByMonth(WorkItemDetailDTO obj) {
        StringBuilder builder = new StringBuilder(
                "with tblTaskDaily as (SELECT to_char(ctd.CREATED_DATE, 'dd/MM/yyyy') CREATED_DATE,TO_CHAR(ctd.CREATED_DATE, 'MM/yyyy') CREATED_DATE_MONTH, ctd.CREATED_USER_ID, ctd.sys_group_id ,sum(ctd.amount) amount, sum(ctd.QUANTITY) quantity "
                        + ",ctd.CONSTRUCTION_TASK_ID, ctd.work_item_id " + " FROM CONSTRUCTION_TASK_DAILY ctd "
                        + " where CTD.WORK_ITEM_ID IS NOT NULL");
        if (obj.getDateFrom() != null) {
            builder.append(" and trunc(CTD.CREATED_DATE) >= :monthYearFrom");
        }
        if (obj.getDateTo() != null) {
            builder.append(" and trunc(CTD.CREATED_DATE) <= :monthYearTo");
        }
        builder.append(
                " group by ctd.CONSTRUCTION_TASK_ID, to_char(ctd.CREATED_DATE, 'dd/MM/yyyy'), TO_CHAR(ctd.CREATED_DATE, 'MM/yyyy') ,ctd.CREATED_USER_ID, ctd.sys_group_id, ctd.work_item_id)");
        return builder.toString();
    }

    public String buildQuerySumByMonth2() {
        return "with tblTaskDaily as (SELECT to_char(ctd.CREATED_DATE, 'dd/MM/yyyy') CREATED_DATE,TO_CHAR(ctd.CREATED_DATE, 'MM/yyyy') CREATED_DATE_MONTH, ctd.CREATED_USER_ID, ctd.sys_group_id ,sum(ctd.amount) amount, sum(ctd.QUANTITY) quantity "
                + ",ctd.CONSTRUCTION_TASK_ID, ctd.work_item_id " + " FROM CONSTRUCTION_TASK_DAILY ctd "
                + " where CTD.WORK_ITEM_ID IS NOT NULL"
                + " group by ctd.CONSTRUCTION_TASK_ID, to_char(ctd.CREATED_DATE, 'dd/MM/yyyy'),TO_CHAR(ctd.CREATED_DATE, 'MM/yyyy') , ctd.CREATED_USER_ID, ctd.sys_group_id, ctd.work_item_id)";
    }

    public int updateConstructionTaskDaily(ConstructionTaskDailyDTO constructionTaskDailyDTO,
                                           boolean isUpdateQuantity) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("UPDATE CONSTRUCTION_TASK_DAILY CTD SET CTD.CONFIRM = :confirm");
        if (isUpdateQuantity) {
            stringBuilder.append(", CTD.AMOUNT = :amount" + ", CTD.QUANTITY = :quantity"
                    + ", CTD.APPROVE_DATE = :approveDate, CTD.APPROVE_USER_ID = :userId");
        }
        stringBuilder.append(" WHERE CTD.CONSTRUCTION_TASK_DAILY_ID = :taskId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("confirm", constructionTaskDailyDTO.getConfirm());
        if (isUpdateQuantity) {
            query.setParameter("amount", constructionTaskDailyDTO.getAmount());
            query.setParameter("quantity",
                    (constructionTaskDailyDTO.getPrice() != null)
                            ? constructionTaskDailyDTO.getAmount() * constructionTaskDailyDTO.getPrice()
                            : 0);
            query.setParameter("approveDate", new Date(System.currentTimeMillis()));
            query.setParameter("userId", constructionTaskDailyDTO.getApproveUserId());
        }
        query.setParameter("taskId", constructionTaskDailyDTO.getConstructionTaskDailyId());
        return query.executeUpdate();
    }

    public int approveQuantityWorkItem(WorkItemDetailDTO obj) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(
                "UPDATE WORK_ITEM wi set wi.QUANTITY = (select sum(ctd.quantity) from CONSTRUCTION_TASK_DAILY ctd"
                        + " WHERE ctd.CONSTRUCTION_TASK_ID in"
                        + " (SELECT ct.CONSTRUCTION_TASK_ID FROM CONSTRUCTION_TASK ct"
                        + " where ct.WORK_ITEM_ID = wi.WORK_ITEM_ID) and ctd.confirm=1)"
                        + " where wi.WORK_ITEM_ID= :workItemId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("workItemId", obj.getWorkItemId());
        return query.executeUpdate();
    }

    public void recalculateValueConstruction(WorkItemDetailDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE CONSTRUCTION con ");
        sql.append(" SET con.COMPLETE_VALUE= ");
        sql.append(" 	(SELECT SUM(quantity) ");
        sql.append(" 	 FROM work_item WORK ");
        sql.append(" 	 	INNER JOIN CONSTRUCTION con ");
        sql.append(" 	    ON WORK.CONSTRUCTION_ID=con.CONSTRUCTION_ID ");
        sql.append(" 	 WHERE con.CONSTRUCTION_ID= :constructionId ");
        sql.append(" 	)");
        sql.append(" 	WHERE con.CONSTRUCTION_ID=:constructionId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("constructionId", obj.getConstructionId());
        query.executeUpdate();
    }

    public List<ConstructionTaskDailyDTO> getConstructionTaskDaily(WorkItemDetailDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(
                "SELECT ctd.APPROVE_DATE approveDate, ctd.APPROVE_USER_ID approveUserId"
                        + ",ctd.CREATED_DATE createdDate, ctd.CREATED_USER_ID createdUserId, ctd.sys_group_id sysGroupId ,ctd.amount amount, ctd.QUANTITY quantity"
                        + ", ctd.CONSTRUCTION_TASK_ID constructionTaskId, ctd.CONFIRM confirm, ctd.CONSTRUCTION_TASK_DAILY_ID constructionTaskDailyId "
                        + ", ap.name constructionTypeName" + " FROM CONSTRUCTION_TASK_DAILY ctd"
                        + " left join APP_PARAM ap on ap.PAR_TYPE = 'CONSTRUCTION_TYPE_DAILY' and ap.CODE = ctd.TYPE"
                        + " where 1=1");
        if (criteria.getConstructionTaskId() != null) {
            stringBuilder.append(" and ctd.CONSTRUCTION_TASK_ID = :taskId");
        }
        stringBuilder.append(" and trunc(ctd.CREATED_DATE) = :dateDo");
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            stringBuilder.append(" and ctd.confirm = :confirm");
        }
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        if (criteria.getConstructionTaskId() != null) {
            query.setParameter("taskId", criteria.getConstructionTaskId());
        }
        query.setParameter("dateDo", criteria.getDateDo());
        if (StringUtils.isNotEmpty(criteria.getConfirm())) {
            query.setParameter("confirm", criteria.getConfirm());
        }
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("sysGroupId", new LongType());
        query.addScalar("amount", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("constructionTaskId", new LongType());
        query.addScalar("confirm", new StringType());
        query.addScalar("approveDate", new DateType());
        query.addScalar("approveUserId", new LongType());
        query.addScalar("constructionTaskDailyId", new LongType());
        query.addScalar("constructionTypeName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDailyDTO.class));
        return query.list();
    }

    public List<ConstructionTaskDailyDTO> getConstructionTaskGroupDay(WorkItemDetailDTO criteria) {
        StringBuilder stringBuilder = new StringBuilder(buildQuerySumByDay());
        stringBuilder.append(
                " SELECT ctd.amount amount, ctd.confirm confirm, ctd.quantity quantity, w.code workItemName, ctd.created_date createdDate FROM tblTaskDaily ctd"
                        + " join WORK_ITEM w on w.work_item_id = ctd.WORK_ITEM_ID"
                        + " where w.WORK_ITEM_ID = :workItemId");
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        query.setParameter("workItemId", criteria.getWorkItemId());
        query.addScalar("amount", new DoubleType());
        query.addScalar("quantity", new DoubleType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("confirm", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionTaskDailyDTO.class));
        return query.list();
    }

    public double sumAmountConstructionTask(List<ConstructionTaskDailyDTO> taskDailyLst, Long constructionId) {
        StringBuilder stringBuilder = new StringBuilder("SELECT nvl(sum(ctd.amount), 0) amount FROM CONSTRUCTION c"
                + " join CONSTRUCTION_TASK ct on c.CONSTRUCTION_ID = ct.CONSTRUCTION_ID"
                + " join CONSTRUCTION_TASK_DAILY ctd on ctd.CONSTRUCTION_TASK_ID = ct.CONSTRUCTION_TASK_ID"
                + " join DETAIL_MONTH_PLAN dmp on DMP.DETAIL_MONTH_PLAN_ID = CT.DETAIL_MONTH_PLAN_ID and DMP.STATUS = 1"
                + " where 1=1 and ctd.confirm != 2");
        List<Long> lstNotSum = new ArrayList<Long>();
        for (ConstructionTaskDailyDTO item : taskDailyLst) {
            lstNotSum.add(item.getConstructionTaskDailyId());
        }
        if (lstNotSum != null && lstNotSum.size() > 0) {
            stringBuilder.append(" and ctd.CONSTRUCTION_TASK_DAILY_ID not in (:constructionTaskDailyIdLst)");
        }
        if (constructionId != null) {
            stringBuilder.append(" and c.CONSTRUCTION_ID = :constructionId");
        }
        SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
        if (lstNotSum != null && lstNotSum.size() > 0) {
            query.setParameterList("constructionTaskDailyIdLst", lstNotSum);
        }
        if (constructionId != null) {
            query.setParameter("constructionId", constructionId);
        }
        BigDecimal obj = (BigDecimal) query.uniqueResult();
        return obj.doubleValue();
    }
}
