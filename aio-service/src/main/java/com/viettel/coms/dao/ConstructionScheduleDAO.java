package com.viettel.coms.dao;

import com.viettel.coms.bo.ConstructionScheduleBO;
import com.viettel.coms.dto.*;
import com.viettel.coms.webservice.ConstructionTaskWsRsService;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Repository("constructionScheduleDAO")
public class ConstructionScheduleDAO extends BaseFWDAOImpl<ConstructionScheduleBO, Long> {

    public ConstructionScheduleDAO() {
        this.model = new ConstructionScheduleBO();
    }

    public ConstructionScheduleDAO(Session session) {
        this.session = session;
    }

    String strMonth = getCurrentTimeStampMonth();
    long month = Long.parseLong(strMonth);
    String strYear = getCurrentTimeStampYear();
    long year = Long.parseLong(strYear);

    /**
     * getValueToInitContructionManagementItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    public Long getTotalTask(ConstructionScheduleDTORequest req, ConstructionScheduleDTO constructionSchedule,
                             String typeNumb, List<DomainDTO> isManage) {

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT COUNT(DISTINCT wi.work_item_id) ");
        sql.append("FROM WORK_ITEM wi ");
        sql.append("INNER JOIN CONSTRUCTION_TASK ct ");
        sql.append("ON wi.CONSTRUCTION_ID  = ct.CONSTRUCTION_ID ");
        sql.append("AND wi.WORK_ITEM_ID    = ct.WORK_ITEM_ID ");
        sql.append("WHERE ct.LEVEL_ID      = 3 ");
        if ("1".equals(typeNumb) || "0".equals(typeNumb)) {
            sql.append("AND ct.PERFORMER_ID     = '" + req.getSysUserRequest().getSysUserId() + "' ");
        }
        if (isManage.size() > 0 && "2".equals(typeNumb)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < isManage.size(); i++) {
                domain.append(isManage.get(i).getDataId().toString());
                while (i != isManage.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        } else if (isManage.size() == 0 && "2".equals(typeNumb)) {
            sql.append("AND ct.PERFORMER_ID     = '" + req.getSysUserRequest().getSysUserId() + "' ");
        }
        sql.append("AND ct.CONSTRUCTION_ID      = '" + constructionSchedule.getConstructionId() + "' ");
        sql.append("AND ct.DETAIL_MONTH_PLAN_ID = '" + constructionSchedule.getDetailMonthPlanId() + "' ");
        if ("0".equals(typeNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '1' ");
        } else if ("1".equals(typeNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '2' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    /**
     * getValueToInitContruction
     *
     * @param req
     * @param tabNumb
     * @return List<ConstructionScheduleDTO>
     */

    public List<ConstructionScheduleDTO> getValueToInitContruction(ConstructionScheduleDTORequest req, String tabNumb,
                                                                   List<DomainDTO> listManagePlan) {

        long sysUserId = req.getSysUserRequest().getSysUserId();
        StringBuilder sql = new StringBuilder("");

        sql.append("SELECT DISTINCT ");
        sql.append("cons.CONSTRUCTION_ID constructionId, ");
        sql.append("cons.CODE constructionCode, ");
        sql.append("cons.NAME constructionName, ");
        sql.append("detail.DETAIL_MONTH_PLAN_ID detailMonthPlanId, ");
        sql.append("cons.STATUS status, ");
        sql.append("cons.STARTING_DATE startingDate, ");
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            sql.append("wi.IS_INTERNAL isInternal, ");
        }
        sql.append("cs.CODE stationCode ");
//		sql.append("cp.NAME catPrtName ");
        sql.append("FROM DETAIL_MONTH_PLAN detail ");
        sql.append("INNER JOIN CONSTRUCTION_TASK ct ");
        sql.append("ON detail.DETAIL_MONTH_PLAN_ID = ct.DETAIL_MONTH_PLAN_ID ");
        sql.append("AND detail.STATUS              = 1 ");
        sql.append("AND detail.SIGN_STATE          = 3 ");
        sql.append("INNER JOIN CONSTRUCTION cons ");
        sql.append("ON ct.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN CAT_STATION cs ");
        sql.append("ON cons.CAT_STATION_ID = cs.CAT_STATION_ID ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON ct.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("AND ct.WORK_ITEM_ID = wi.WORK_ITEM_ID ");

        if ("0".equals(tabNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '1' ");
        } else if ("1".equals(tabNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '2' ");
        } else if ("2".equals(tabNumb)) {

        }
//		if(isManagePlan.size() == 0){
//			sql.append("WHERE ct.PERFORMER_ID = '" + req.getSysUserRequest().getSysUserId() + "' ");
//			sql.append("AND ");
//		} else {
//			sql.append("WHERE ");
//		}
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            sql.append("WHERE ct.PERFORMER_ID = '" + sysUserId + "' ");
            sql.append("AND ");
        } else {
            sql.append("WHERE  ");
        }
        sql.append(" detail.MONTH      = " + month + " ");
        sql.append("AND detail.YEAR       = " + year + " ");
        sql.append("AND ct.TYPE           = '1' ");

        if (listManagePlan.size() > 0 && "2".equals(tabNumb)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < listManagePlan.size(); i++) {
                domain.append(listManagePlan.get(i).getDataId().toString());
                while (i != listManagePlan.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        } else if (listManagePlan.size() == 0 && "2".equals(tabNumb)) {
            sql.append("AND ct.PERFORMER_ID = '" + sysUserId + "' ");
        }
        sql.append("AND ct.LEVEL_ID       = '3' ");
        sql.append("ORDER BY cons.CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionName", new StringType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("startingDate", new StringType());
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            query.addScalar("isInternal", new StringType());
        }
        query.addScalar("stationCode", new StringType());
//		query.addScalar("catPrtName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleDTO.class));
        return query.list();
    }

    //	hoanm1_20180824_start
    public List<ConstructionScheduleDTO> getValueToInitContructionTurning(ConstructionScheduleDTORequest req, String tabNumb,
                                                                          List<DomainDTO> listManagePlan) {
        long sysUserId = req.getSysUserRequest().getSysUserId();
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT  ");
        sql.append("max(cons.CONSTRUCTION_ID) constructionId, ");
        sql.append("max(cons.CODE) constructionCode, ");
        sql.append("max(cons.NAME) constructionName, ");
        sql.append("max(detail.DETAIL_MONTH_PLAN_ID) detailMonthPlanId, ");
        sql.append("max(cons.STATUS) status, ");
        sql.append("max(cons.STARTING_DATE) startingDate, ");
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            sql.append(" max(wi.IS_INTERNAL) isInternal, ");
        }
        sql.append("max(cs.CODE) stationCode, ");
        sql.append("sum(case when NVL(COMPLETE_PERCENT,0) <> 100 then 1 else 0 end) unCompletedTask, ");
        sql.append("COUNT(DISTINCT wi.work_item_id) totalTask, ");
        sql.append("sum(case when NVL(COMPLETE_PERCENT,0) <> 100 then 1 else 0 end)||'/'|| COUNT(DISTINCT wi.work_item_id) uncomTotalTask ");
//        sql.append(",max(nvl(cons.is_obstructed,0)) isObstructed ");
        sql.append("FROM DETAIL_MONTH_PLAN detail ");
        sql.append("INNER JOIN CONSTRUCTION_TASK ct ");
        sql.append("ON detail.DETAIL_MONTH_PLAN_ID = ct.DETAIL_MONTH_PLAN_ID ");
        sql.append("AND detail.STATUS              = 1 ");
        sql.append("AND detail.SIGN_STATE          = 3 ");
        sql.append("INNER JOIN CONSTRUCTION cons ");
        sql.append("ON ct.CONSTRUCTION_ID = cons.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN CAT_STATION cs ");
        sql.append("ON cons.CAT_STATION_ID = cs.CAT_STATION_ID ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON ct.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("AND ct.WORK_ITEM_ID = wi.WORK_ITEM_ID ");

        if ("0".equals(tabNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '1' ");
        } else if ("1".equals(tabNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '2' ");
        } else if ("2".equals(tabNumb)) {

        }
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            sql.append("WHERE ct.PERFORMER_ID = '" + sysUserId + "' ");
            sql.append("AND ");
        } else {
            sql.append("WHERE  ");
        }
        sql.append(" detail.MONTH      = " + month + " ");
        sql.append("AND detail.YEAR       = " + year + " ");
        sql.append("AND ct.TYPE           = '1' ");

        if (listManagePlan.size() > 0 && "2".equals(tabNumb)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < listManagePlan.size(); i++) {
                domain.append(listManagePlan.get(i).getDataId().toString());
                while (i != listManagePlan.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        } else if (listManagePlan.size() == 0 && "2".equals(tabNumb)) {
            sql.append("AND ct.PERFORMER_ID = '" + sysUserId + "' ");
        }
        sql.append("AND ct.LEVEL_ID       = '3' ");
        sql.append("group by cons.CONSTRUCTION_ID ,cons.CODE ,cons.NAME , ");
        sql.append("detail.DETAIL_MONTH_PLAN_ID ,cons.STATUS ,cons.STARTING_DATE ,cs.CODE,cons.is_obstructed ");
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            sql.append(",wi.IS_INTERNAL ");
        }
        sql.append("ORDER BY cons.CODE ");
        LOGGER.error("Hoanm1 start");
        LOGGER.error(sysUserId);
        LOGGER.error(month);
        LOGGER.error(year);
        LOGGER.error(sql);
        LOGGER.error("Hoanm1 end");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("constructionId", new LongType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("constructionName", new StringType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("status", new StringType());
        query.addScalar("startingDate", new StringType());
        if ("0".equals(tabNumb) || "1".equals(tabNumb)) {
            query.addScalar("isInternal", new StringType());
        }
        query.addScalar("stationCode", new StringType());
        query.addScalar("unCompletedTask", new StringType());
        query.addScalar("totalTask", new StringType());
        query.addScalar("uncomTotalTask", new StringType());
//        query.addScalar("isObstructed", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleDTO.class));
        return query.list();
    }
//	hoanm1_20180824_end

    /**
     * getValueToInitContructionManagementItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    public List<ConstructionScheduleItemDTO> getValueToInitContructionManagementItem(ConstructionScheduleDTORequest req,
                                                                                     List<DomainDTO> isManagePlan) {
        String scheduleType = req.getConstructionScheduleDTO().getScheduleType();
        long sysUserId = req.getSysUserRequest().getSysUserId();
        String authorities = req.getSysUserRequest().getAuthorities();
        Long detailMonthPlanId = req.getConstructionScheduleDTO().getDetailMonthPlanId();
        Long constructionId = req.getConstructionScheduleDTO().getConstructionId();

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("wi.NAME name, ");
        sql.append("wi.STATUS status, ");
        sql.append("wi.WORK_ITEM_ID workItemId, ");
        sql.append("wi.IS_INTERNAL isInternal, ");
        sql.append("ct.CONSTRUCTION_ID constructionId, ");
        sql.append("ct.DETAIL_MONTH_PLAN_ID detailMonthPlanId, ");
        sql.append("nvl(ct.COMPLETE_PERCENT,0) completePercent, ");
        sql.append("su.FULL_NAME syuFullName, ");
        sql.append("cWi.ITEM_ORDER itemOrder, ");
        sql.append("cp.NAME catPrtName, ");
        sql.append(
                "case when(select avg(a.complete_state) from CONSTRUCTION_TASK a where a.PARENT_ID=ct.CONSTRUCTION_TASK_id)=1 then 1 else 2 end completeState ");
        sql.append(",wi.PERFORMER_ID performerId,ct.sys_group_id sysGroupId ");
//      hoanm1_20180828_start
        sql.append(",nvl((select sum(quantity) from CONSTRUCTION_TASK_DAILY task_daily where task_daily.work_item_id=ct.work_item_id ");
        sql.append("and task_daily.confirm in(0,1)),ct.quantity) quantity, ");
        sql.append("(select to_char(min(start_date),'yyyy-MM-dd') startingDate from CONSTRUCTION_TASK task where level_id=4 and type=1 ");
        sql.append("start with task.parent_id = ct.construction_task_id connect by prior task.construction_task_id = task.parent_id) startingDate ");
        sql.append(",ct.start_date startDate,ct.end_date endDate ");
        
//		hoanm1_20180828_end
        sql.append("FROM CONSTRUCTION_TASK ct ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON ct.WORK_ITEM_ID     = wi.WORK_ITEM_ID ");
        sql.append("AND ct.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("AND ct.TYPE            = 1 ");
        sql.append("LEFT JOIN CAT_WORK_ITEM_TYPE cWi ");
        sql.append("ON wi.CAT_WORK_ITEM_TYPE_ID = cWi.CAT_WORK_ITEM_TYPE_ID ");
        sql.append("LEFT JOIN SYS_USER su ");
        sql.append("ON wi.PERFORMER_ID = su.SYS_USER_ID ");
        sql.append("LEFT JOIN CAT_PARTNER cp ");
        sql.append("ON wi.CONSTRUCTOR_ID = cp.CAT_PARTNER_ID ");
        sql.append("WHERE ct.LEVEL_ID           = 3  ");

        if ("1".equals(scheduleType) || "0".equals(scheduleType)) {
            sql.append("AND ct.PERFORMER_ID     = '" + sysUserId + "' ");
        }
        if (authorities == null || "".equals(authorities) && "2".equals(scheduleType)) {
            sql.append("AND ct.PERFORMER_ID         = '" + sysUserId + "' ");
        } else if (isManagePlan.size() > 0 && authorities != null && "2".equals(scheduleType)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < isManagePlan.size(); i++) {
                domain.append(isManagePlan.get(i).getDataId().toString());
                while (i != isManagePlan.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        }

        sql.append("AND ct.DETAIL_MONTH_PLAN_ID = '" + detailMonthPlanId + "' ");
        sql.append("AND ct.CONSTRUCTION_ID      = '" + constructionId + "' ");
        if ("0".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL      = 1 ");
        } else if ("1".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL      = 2 ");
        }
        sql.append("AND ct.MONTH = " + month + " ");
        sql.append("AND ct.YEAR  = " + year + " ");

        sql.append("ORDER BY cWi.ITEM_ORDER ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("name", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("detailMonthPlanId", new LongType());
        query.addScalar("completeState", new LongType());
        query.addScalar("completePercent", new LongType());
        query.addScalar("syuFullName", new StringType());
        query.addScalar("isInternal", new StringType());
        query.addScalar("itemOrder", new StringType());
        query.addScalar("catPrtName", new StringType());
        query.addScalar("performerId", new LongType());
        query.addScalar("sysGroupId", new LongType());
//        hoanm1_20180828_start
        query.addScalar("quantity", new DoubleType());
        query.addScalar("startingDate", new StringType());
//		hoanm1_20180828_end
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleItemDTO.class));
        return query.list();
    }

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param request
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<ConstructionScheduleWorkItemDTO> getValueToInitConstructionScheduleWorkItemDTO(
            ConstructionScheduleDTORequest request, List<DomainDTO> isManagePlan) {
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        // get tab
        String scheduleType = request.getConstructionScheduleItemDTO().getScheduleType();
        long sysUserId = request.getSysUserRequest().getSysUserId();
        String authorities = request.getSysUserRequest().getAuthorities();
        Long detailMonthPlanId = request.getConstructionScheduleItemDTO().getDetailMonthPlanId();
        Long constructionId = request.getConstructionScheduleItemDTO().getConstructionId();
        Long workItemId = request.getConstructionScheduleItemDTO().getWorkItemId();

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT ");
        sql.append("ct.TASK_NAME taskName, ");
        sql.append("ct.START_DATE startDate, ");
        sql.append("ct.END_DATE endDate, ");
//			hoanm1_20180809_start
        sql.append("cons.CODE constructionCode,ct.construction_id constructionId,");
//			hoanm1_20180809_end
        sql.append("wi.NAME workItemName, ");
        sql.append("ct.STATUS status, ");
        sql.append("ct.DESCRIPTION description, ");
        sql.append("caT.QUANTITY_BY_DATE quantityByDate, ");
        sql.append("ct.Performer_Id PerformerId, ");
//			hoanm1_20180802_start
        sql.append(
                "(select full_name from sys_user uu where uu.sys_user_id=ct.Performer_Id and uu.status=1) performerName, ");
//			hoanm1_20180802_end
        sql.append("ct.Construction_Task_Id ConstructionTaskId, ");
        sql.append("ct.Path, ");
        sql.append("ct.Type, ");
        sql.append("ct.TASK_ORDER taskOrder, ");
        sql.append("ct.QUANTITY quantity, ");
        sql.append("ct.complete_state  completeState, ");
        sql.append("nvl(ct.COMPLETE_PERCENT,0) completePercent ");
//			hoanm1_20180705_start
        sql.append(
                ", nvl(cons.amount,0) amount, nvl(cons.price,0)price,ct.WORK_ITEM_ID workItemId,ct.cat_task_id catTaskId,ct.SYS_GROUP_ID sysGroupId  ");
//			hoanm1_20180705_end
//        hoanm1_20180905_start
        sql.append(",nvl(cons.OBSTRUCTED_STATE,0) obstructedState ");
//        hoanm1_20180905_end
//        hoanm1_20190108_start
        sql.append(",cons.starting_date startingDateTK,cons.HANDOVER_DATE_BUILD handoverDateBuildBGMB ");
        sql.append(" ,case when (select nvl(avg(w.status),0) from work_item w where w.construction_id=ct.construction_id ) >1 then 0 else 1 end checkBGMB, ");
//        hoanm1_20190108_end
        /**Hoangnh start 15022019**/
        sql.append("cons.TOTAL_AMOUNT_CHEST totalAmountChest,"
        		+ "cons.PRICE_CHEST priceChest,"
        		+ "cons.TOTAL_AMOUNT_GATE totalAmountGate,"
        		+ "cons.PRICE_GATE priceGate,"
        		+ "nvl((select (nvl(cd.amount,0)) from CONSTRUCTION_TASK_DAILY cd where cd.CONSTRUCTION_TASK_ID = ct.CONSTRUCTION_TASK_ID AND cd.CONFIRM =0 AND TRUNC(cd.CREATED_DATE)= TRUNC(SYSDATE)),0) amountTaskDaily,"
        		+ "(select cd.confirm confirm from CONSTRUCTION_TASK_DAILY cd where cd.CONSTRUCTION_TASK_ID = ct.CONSTRUCTION_TASK_ID AND TRUNC(cd.CREATED_DATE)= TRUNC(SYSDATE)) confirm ,"
        		+ "nvl((select sum(nvl(cd.amount,0)) from CONSTRUCTION_TASK_DAILY cd where cd.CONSTRUCTION_TASK_ID = ct.CONSTRUCTION_TASK_ID),0) totalAmount ");
        /**Hoangnh end 15022019**/
        sql.append("FROM CONSTRUCTION_TASK ct ");
        sql.append("LEFT JOIN CAT_TASK ctt ");
        sql.append("ON ct.CAT_TASK_ID          = ctt.CAT_TASK_ID ");
        sql.append("LEFT JOIN CONSTRUCTION cons ");
        sql.append("ON ct.CONSTRUCTION_ID      = cons.CONSTRUCTION_ID ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON ct.CONSTRUCTION_ID      = wi.CONSTRUCTION_ID ");
        sql.append("AND ct.WORK_ITEM_ID        = wi.WORK_ITEM_ID ");
        sql.append("LEFT JOIN CAT_TASK caT ");
        sql.append("on ct.CAT_TASK_id=cat.CAT_TASK_id ");
//        sql.append("AND caT.QUANTITY_BY_DATE   = '1' ");
        sql.append("WHERE ct.LEVEL_ID          = '4' ");
        sql.append("AND ct.TYPE = 1 ");

        if ("1".equals(scheduleType) || "0".equals(scheduleType)) {
            sql.append("AND ct.PERFORMER_ID     = '" + sysUserId + "' ");
        }

        if (authorities == null || "".equals(authorities) && "2".equals(scheduleType)) {
            sql.append("AND ct.PERFORMER_ID        = '" + sysUserId + "' ");
        } else if (isManagePlan.size() > 0 && authorities != null && "2".equals(scheduleType)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < isManagePlan.size(); i++) {
                domain.append(isManagePlan.get(i).getDataId().toString());
                while (i != isManagePlan.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        }

        sql.append("AND ct.DETAIL_MONTH_PLAN_ID= '" + detailMonthPlanId + "' ");
        sql.append("AND ct.CONSTRUCTION_ID     = '" + constructionId + "' ");
        sql.append("AND ct.WORK_ITEM_ID        = '" + workItemId + "' ");
        sql.append("AND ct.MONTH               = '" + month + "'  ");
        sql.append("AND ct.YEAR                = '" + year + "'  ");

        if ("0".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL         = 1 ");
        } else if ("1".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL         = 2 ");
        }
        sql.append("ORDER BY ctt.TASK_ORDER ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("taskName", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
//		hoanm1_20180809_start
        query.addScalar("constructionId", new LongType());
//		hoanm1_20180809_end
        query.addScalar("constructionCode", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("description", new StringType());
        query.addScalar("quantityByDate", new StringType());
        query.addScalar("PerformerId", new LongType());
//		hoanm1_20180802_start
        query.addScalar("performerName", new StringType());
//		hoanm1_20180802_end
        query.addScalar("ConstructionTaskId", new LongType());
        query.addScalar("Path", new StringType());
        query.addScalar("Type", new StringType());
        query.addScalar("taskOrder", new StringType());
        query.addScalar("completeState", new LongType());
        query.addScalar("completePercent", new LongType());
        query.addScalar("quantity", new DoubleType());
//		hoanm1_20180705_start
        query.addScalar("amount", new DoubleType());
        query.addScalar("price", new DoubleType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("catTaskId", new LongType());
        query.addScalar("sysGroupId", new LongType());
//		hoanm1_20180705_end
//        hoanm1_20180905_start
        query.addScalar("obstructedState", new StringType());
//        hoanm1_20180905_end
//        hoanm1_20190108_start
        query.addScalar("startingDateTK", new StringType());
        query.addScalar("handoverDateBuildBGMB", new StringType());
        query.addScalar("checkBGMB", new StringType());
//        hoanm1_20190108_end
        /**Hoangnh start 15022019**/
        query.addScalar("totalAmountChest", new DoubleType());
        query.addScalar("priceChest", new DoubleType());
        query.addScalar("totalAmountGate", new DoubleType());
        query.addScalar("priceGate", new DoubleType());
        query.addScalar("amountTaskDaily", new DoubleType());
        query.addScalar("totalAmount", new DoubleType());
        query.addScalar("confirm", new StringType());
        /**Hoangnh end 15022019**/
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleWorkItemDTO.class));
        return query.list();
    }

    /**
     * getValueToInitContructionManagementItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    public ConstructionScheduleItemDTO getCompletePercent(ConstructionScheduleItemDTO req, Long userId) {
        String scheduleType = req.getScheduleType();

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT DISTINCT  ct.COMPLETE_PERCENT completePercent ");
        sql.append("FROM CONSTRUCTION_TASK ct ");
        sql.append("INNER JOIN WORK_ITEM wi ");
        sql.append("ON ct.WORK_ITEM_ID     = wi.WORK_ITEM_ID ");
        sql.append("AND ct.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append("AND ct.TYPE            = 1 ");
        sql.append("WHERE ct.LEVEL_ID        = 3 ");
        sql.append("AND ct.DETAIL_MONTH_PLAN_ID = '" + req.getDetailMonthPlanId() + "' ");
        sql.append("AND ct.CONSTRUCTION_ID      = '" + req.getConstructionId() + "' ");
        sql.append("and ct.WORK_ITEM_ID         = '" + req.getWorkItemId() + "' ");
        if ("0".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL = 1 ");
        } else if ("1".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL         = 2 ");
        }
        sql.append("AND ct.MONTH = " + month + " ");
        sql.append("AND ct.YEAR  = " + year + " ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("completePercent", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleItemDTO.class));
        return (ConstructionScheduleItemDTO) query.list().get(0);
    }

    /**
     * getValueToInitContructionManagementItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    public Long getCompleteState(ConstructionScheduleItemDTO req, Long userId, List<DomainDTO> isManage) {
        String scheduleType = req.getScheduleType();

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT count(*) ");
        sql.append("FROM CONSTRUCTION_TASK ct,WORK_ITEM wi ");
        sql.append("WHERE LEVEL_ID = 3  ");
        sql.append("AND wi.CONSTRUCTION_ID = ct.CONSTRUCTION_ID  ");
        sql.append("AND wi.WORK_ITEM_ID    = ct.WORK_ITEM_ID  ");
        if ("1".equals(scheduleType) || "0".equals(scheduleType)) {
            sql.append("AND ct.PERFORMER_ID    = '" + userId + "' ");
        }
        if (isManage.size() > 0 && "2".equals(scheduleType)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < isManage.size(); i++) {
                domain.append(isManage.get(i).getDataId().toString());
                while (i != isManage.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        }
        sql.append("AND ct.WORK_ITEM_ID    = '" + req.getWorkItemId() + "' ");
        sql.append("AND ct.CONSTRUCTION_ID = '" + req.getConstructionId() + "' ");
        sql.append("AND ct.DETAIL_MONTH_PLAN_ID = '" + req.getDetailMonthPlanId() + "' ");

        if ("0".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL      = '1' ");
        } else if ("1".equals(scheduleType)) {
            sql.append("AND wi.IS_INTERNAL      = '2' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    /**
     * getValueToInitContructionManagementItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    public Long getUnCompletedTask(ConstructionScheduleDTORequest req, ConstructionScheduleDTO constructionSchedule,
                                   String typeNumb, List<DomainDTO> isManage) {
        long sysUserId = req.getSysUserRequest().getSysUserId();

        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT count(*) ");
        sql.append("FROM CONSTRUCTION_TASK ct,WORK_ITEM wi ");
        sql.append("WHERE LEVEL_ID = 3  ");
        sql.append("AND nvl(COMPLETE_PERCENT,0) <> 100  ");
        sql.append("AND wi.CONSTRUCTION_ID  = ct.CONSTRUCTION_ID  ");
        sql.append("AND wi.WORK_ITEM_ID     = ct.WORK_ITEM_ID  ");

        if ("1".equals(typeNumb) || "0".equals(typeNumb)) {
            sql.append("AND ct.PERFORMER_ID     = '" + sysUserId + "' ");
        }
        if (isManage.size() > 0 && "2".equals(typeNumb)) {
            StringBuilder domain = new StringBuilder();
            for (int i = 0; i < isManage.size(); i++) {
                domain.append(isManage.get(i).getDataId().toString());
                while (i != isManage.size() - 1) {
                    domain.append(" , ");
                    break;
                }
            }
            sql.append("AND ct.SYS_GROUP_ID   in (" + domain + ") ");
        } else if (isManage.size() == 0 && "2".equals(typeNumb)) {
            sql.append("AND ct.PERFORMER_ID     = '" + sysUserId + "' ");
        }
        sql.append("AND ct.CONSTRUCTION_ID  ='" + constructionSchedule.getConstructionId() + "' ");
        sql.append("AND ct.DETAIL_MONTH_PLAN_ID = '" + constructionSchedule.getDetailMonthPlanId() + "' ");
        if ("0".equals(typeNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '1' ");
        } else if ("1".equals(typeNumb)) {
            sql.append("AND wi.IS_INTERNAL      = '2' ");
        }

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return ((BigDecimal) query.uniqueResult()).longValue();
    }

    /**
     * Màn hình chi tiết hạng mục
     *
     * @param request
     * @return List<ConstructionTaskDTO>
     * @author CuongNV2
     */
    public List<DomainDTO> getByAdResource(long sysUserId, String adResource) {
        // long sysUserId = request.getSysUserRequest().getSysUserId();
        StringBuilder sql = new StringBuilder("");
        sql.append("SELECT e.data_code dataCode, e.DATA_ID dataId, ");
        sql.append("  op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code adResource ");
        sql.append("FROM SYS_USER a, ");
        sql.append("  USER_ROLE b, ");
        sql.append("  SYS_ROLE c, ");
        sql.append("  USER_ROLE_DATA d, ");
        sql.append("  DOMAIN_DATA e, ");
        sql.append("  ROLE_PERMISSION role_per, ");
        sql.append("  permission pe, ");
        sql.append("  OPERATION op, ");
        sql.append("  AD_RESOURCE ad ");
        sql.append("WHERE a.SYS_USER_ID       =b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID         =c.SYS_ROLE_ID ");
        sql.append("AND b.USER_ROLE_ID        =d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID      =e.DOMAIN_DATA_ID ");
        sql.append("AND c.SYS_ROLE_ID         =role_per.SYS_ROLE_ID ");
        sql.append("AND role_per.permission_id=pe.permission_id ");
        sql.append("AND pe.OPERATION_id       =op.OPERATION_id ");
        sql.append("AND pe.AD_RESOURCE_ID     =ad.AD_RESOURCE_ID ");
        sql.append("AND a.SYS_USER_ID         = '" + sysUserId + "' ");
        sql.append("AND upper(op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code) LIKE '%" + adResource + "%' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("dataId", new LongType());
        query.addScalar("adResource", new StringType());

        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));
        return query.list();
    }

    /**
     * update khi chuyen nguoi
     *
     * @param request
     * @return int
     * @author CuongNV2
     */
    public int handlingByOtherPerson(ConstructionScheduleDTORequest request) {
        long sysUserId = request.getSysUserReceiver().getSysUserId();
        Long workItemId = request.getConstructionScheduleItemDTO().getWorkItemId();
        Long constructionId = request.getConstructionScheduleItemDTO().getConstructionId();
        Long detailMonthPlanId = request.getConstructionScheduleItemDTO().getDetailMonthPlanId();

        StringBuilder sqlRefusedConfirm = new StringBuilder("");
        sqlRefusedConfirm.append("UPDATE ");
        sqlRefusedConfirm.append("CONSTRUCTION_TASK ");
        sqlRefusedConfirm.append("SET ");
        sqlRefusedConfirm.append("PERFORMER_ID               = '" + sysUserId + "' ");
        sqlRefusedConfirm.append("WHERE ");
        sqlRefusedConfirm.append("WORK_ITEM_ID               = :workItemId ");
        sqlRefusedConfirm.append("AND CONSTRUCTION_ID        = :constructionId ");
        sqlRefusedConfirm.append("AND DETAIL_MONTH_PLAN_ID   = :detailMonthPlanId ");

        SQLQuery queryChapNhan = getSession().createSQLQuery(sqlRefusedConfirm.toString());
        queryChapNhan.setParameter("workItemId", workItemId);
        queryChapNhan.setParameter("constructionId", constructionId);
        queryChapNhan.setParameter("detailMonthPlanId", detailMonthPlanId);

        return queryChapNhan.executeUpdate();
    }

    /**
     * update khi chuyen nguoi
     *
     * @param request
     * @return int
     * @author CuongNV2
     */
    public int handlingByOtherPersonWorkItem(ConstructionScheduleDTORequest request) {
        long sysUserId = request.getSysUserReceiver().getSysUserId();
        Long workItemId = request.getConstructionScheduleItemDTO().getWorkItemId();
        Long constructionId = request.getConstructionScheduleItemDTO().getConstructionId();

        StringBuilder sqlRefusedConfirm = new StringBuilder("");
        sqlRefusedConfirm.append("UPDATE ");
        sqlRefusedConfirm.append("WORK_ITEM ");
        sqlRefusedConfirm.append("SET ");
        sqlRefusedConfirm.append("PERFORMER_ID            = '" + sysUserId + "' ");
        sqlRefusedConfirm.append("WHERE ");
        sqlRefusedConfirm.append("WORK_ITEM_ID            = :workItemId ");
        sqlRefusedConfirm.append("AND CONSTRUCTION_ID     = :constructionId ");

        SQLQuery queryChapNhan = getSession().createSQLQuery(sqlRefusedConfirm.toString());
        queryChapNhan.setParameter("workItemId", workItemId);
        queryChapNhan.setParameter("constructionId", constructionId);

        return queryChapNhan.executeUpdate();
    }

    /**
     * Get current month
     *
     * @return String month (MM)
     */
    public static String getCurrentTimeStampMonth() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);

        String res = strDate.substring(5, 7);
        return res;
    }

    /**
     * Get current year
     *
     * @return String year(yyyy)
     */
    public static String getCurrentTimeStampYear() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        Date now = new Date();
        String strDate = sdfDate.format(now);
        String res = strDate.substring(0, 4);
        return res;
    }

    // chinhpxn20180720_start
    public int createSendSmsEmailToOperator(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                            Long newPerformerId, Long oldPerformerId) {
        String sqlUser = new String("select e.email,e.PHONE_NUMBER phone "
                + " from domain_data a,user_role_data b,user_role c,sys_role d,sys_user e"
                + " where a.domain_data_id = b.DOMAIN_DATA_ID and c.USER_ROLE_ID = b.USER_ROLE_ID"
                + " and c.SYS_ROLE_ID = d.SYS_ROLE_ID and c.SYS_USER_ID=e.SYS_USER_ID and d.code = 'OPERATOR_SMS' "
                + " and a.DATA_ID = :sysGroupId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("phone", new StringType());
        queryGetSysUser.setParameter("sysGroupId", request.getSysGroupId());
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        List<SysUserDTO> lstUser = queryGetSysUser.list();

        for (SysUserDTO userDTO : lstUser) {
            String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
            SQLQuery query = getSession().createSQLQuery(sql);
            int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
            StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                    + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                    + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                    + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                    + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId " + ")");
            //

            String nameSubject = "";
            String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
            SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
            querySubject.addScalar("name", new StringType());
            List<String> ListSubject = querySubject.list();
            if (!ListSubject.isEmpty()) {
                nameSubject = ListSubject.get(0);
            }

            String nameCatTask = "";
            String sqlGetNameCatTask = new String(
                    " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_OPERATOR'");
            SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
            queryGetNameCatTask.addScalar("name", new StringType());
            List<String> nameListCatTask = queryGetNameCatTask.list();
            if (!nameListCatTask.isEmpty()) {
                nameCatTask = nameListCatTask.get(0);
            }

            StringBuilder strContent = new StringBuilder(nameCatTask);
            int i = strContent.indexOf("X");
            String name = request.getName();
            String constructionTaskSQL = "SELECT CODE code FROM CONSTRUCTION WHERE CONSTRUCTION_ID = :constructionId ";
            SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
            queryConstructionTask.addScalar("code", new StringType());
            queryConstructionTask.setParameter("constructionId", request.getConstructionId());
            List<String> ctName = queryConstructionTask.list();
            if (!ctName.isEmpty()) {
                strContent.append(" cho công trình: " + ctName.get(0));
            }
//          hoanm1_20180929_start// can xem lại chuyen nguoi thoi gian dang bi null
            SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");// dd/MM/yyyy
            strContent.append(", thời gian thực hiện từ " +sdfDate.format(request.getStartDate()) + " đến " + sdfDate.format(request.getEndDate()) );
//            hoanm1_20180929_end
            strContent.replace(i, i + 1, name);

            String sqlPerformer = new String("SELECT EMAIL email FROM SYS_USER WHERE SYS_USER_ID = :oldPerformerId ");
            SQLQuery queryGetPerformer = getSession().createSQLQuery(sqlPerformer);
            queryGetPerformer.addScalar("email", new StringType());
            queryGetPerformer.setParameter("oldPerformerId", oldPerformerId);
            queryGetPerformer.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
            List<SysUserDTO> perFormerLst = queryGetPerformer.list();
            String emailA = perFormerLst.get(0).getEmail();
            if (emailA != null) {
                emailA = emailA.substring(0, emailA.indexOf("@"));
            } else {
                emailA = "[EMAIL_IS_NULL]";
            }

            String sqlNewPerformer = new String("SELECT EMAIL email FROM SYS_USER WHERE SYS_USER_ID =  :perFormerId ");
            SQLQuery queryGetNewPerformer = getSession().createSQLQuery(sqlNewPerformer);
            queryGetNewPerformer.addScalar("email", new StringType());
            queryGetNewPerformer.setParameter("perFormerId", newPerformerId);
            queryGetNewPerformer.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
            List<SysUserDTO> newPerformerLst = queryGetNewPerformer.list();
            String emailB;
            emailB = newPerformerLst.get(0).getEmail();
            if (emailB != null) {
                emailB = emailB.substring(0, emailB.indexOf("@"));
            } else {
                emailB = "[EMAIL_IS_NULL]";
            }

            int j = strContent.indexOf("A");
            strContent.replace(j, j + 1, emailA);
            int k = strContent.indexOf("B");
            strContent.replace(k, k + 1, emailB);

            SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
            querySms.setParameter("phoneNumber", userDTO.getPhone());
            querySms.setParameter("email", userDTO.getEmail());
            querySms.setParameter("createUserId", sysUserId);
            querySms.setParameter("createGroupId", sysGroupId);
            querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
            querySms.setParameter("createdDate", new Date());
            querySms.setParameter("content", strContent.toString());
            querySms.setParameter("subject", nameSubject);
//          hoanm1_20181022_start
            if(request.getWorkItemId() !=null){
            	querySms.setParameter("workItemId", request.getWorkItemId());
            }else{
            	querySms.setParameter("workItemId", 0L);
            }
//            hoanm1_20181022_end
            querySms.executeUpdate();
        }
        return 1;

    }

    public int createSendSmsEmailToConvert(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                           Long oldPerformerId) {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");// dd/MM/yyyy
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId " + ")");
        //

        String nameSubject = "";
        String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
        SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
        querySubject.addScalar("name", new StringType());
        List<String> ListSubject = querySubject.list();
        if (!ListSubject.isEmpty()) {
            nameSubject = ListSubject.get(0);
        }

        String nameCatTask = "";
        String sqlGetNameCatTask = new String(
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_CONVERT'");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);
        int i = strContent.indexOf("X");
        String name = request.getName();
        String constructionTaskSQL = "SELECT CODE code FROM CONSTRUCTION WHERE CONSTRUCTION_ID = :constructionId ";
        SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
        queryConstructionTask.addScalar("code", new StringType());
        queryConstructionTask.setParameter("constructionId", request.getConstructionId());
        List<String> ctName = queryConstructionTask.list();
        if (!ctName.isEmpty()) {
            strContent.append(" cho công trình: " + ctName.get(0));
        }
        strContent.replace(i, i + 1, name);

        String email = "";
        String phoneNumber = "";
        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        String sqlUser = new String(
                "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE SYS_USER_ID = :sysUserId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("mobile", new StringType());
        queryGetSysUser.setParameter("sysUserId", oldPerformerId);
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();

        email = userDTO.getEmail();
        phoneNumber = userDTO.getMobile();

        querySms.setParameter("phoneNumber", phoneNumber);
        querySms.setParameter("email", email);
        querySms.setParameter("createUserId", sysUserId);
        querySms.setParameter("createGroupId", sysGroupId);
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
//      hoanm1_20181022_start
      if(request.getWorkItemId() !=null){
      	querySms.setParameter("workItemId", request.getWorkItemId());
      }else{
      	querySms.setParameter("workItemId", 0L);
      }
//      hoanm1_20181022_end
        return querySms.executeUpdate();
    }

    public int createSendSmsEmail(ConstructionScheduleItemDTO request, String sysGroupId, Long sysUserId,
                                  Long newPerformerId) {
        String sql = new String(" SELECT SEND_SMS_EMAIL_SEQ.nextval FROM DUAL ");
        SQLQuery query = getSession().createSQLQuery(sql);
        int sendSmsEmailId = ((BigDecimal) query.uniqueResult()).intValue();
        StringBuilder sqlSendSmsEmail = new StringBuilder("INSERT INTO SEND_SMS_EMAIL (" + "   SEND_SMS_EMAIL_ID "
                + " , TYPE" + " , RECEIVE_PHONE_NUMBER " + " , RECEIVE_EMAIL" + " , CREATED_DATE "
                + " , CREATED_USER_ID" + " , CREATED_GROUP_ID" + " , SUBJECT" + " , CONTENT,status,WORK_ITEM_ID " + " ) VALUES ( "
                + " :sendSmsEmailId" + " , 1 " + " , :phoneNumber " + " , :email" + " , :createdDate"
                + " , :createUserId" + " , :createGroupId" + " , :subject " + " , :content,0, :workItemId " + ")");
        //

        String nameSubject = "";
        String sqlSubject = new String(" SELECT ap.NAME from APP_PARAM ap where ap.par_type = 'SUBJECT_SMS'");
        SQLQuery querySubject = getSession().createSQLQuery(sqlSubject);
        querySubject.addScalar("name", new StringType());
        List<String> ListSubject = querySubject.list();
        if (!ListSubject.isEmpty()) {
            nameSubject = ListSubject.get(0);
        }

        String nameCatTask = "";
        String sqlGetNameCatTask = new String(
                " SELECT ap.NAME name from APP_PARAM ap where ap.par_type = 'CONTENT_SMS_RECEIVE'");
        SQLQuery queryGetNameCatTask = getSession().createSQLQuery(sqlGetNameCatTask);
        queryGetNameCatTask.addScalar("name", new StringType());
        List<String> nameListCatTask = queryGetNameCatTask.list();
        if (!nameListCatTask.isEmpty()) {
            nameCatTask = nameListCatTask.get(0);
        }

        StringBuilder strContent = new StringBuilder(nameCatTask);
        int i = strContent.indexOf("X");
        String name = request.getName();
        String constructionTaskSQL = "SELECT CODE code FROM CONSTRUCTION WHERE CONSTRUCTION_ID = :constructionId ";
        SQLQuery queryConstructionTask = getSession().createSQLQuery(constructionTaskSQL);
        queryConstructionTask.addScalar("code", new StringType());
        queryConstructionTask.setParameter("constructionId", request.getConstructionId());
        List<String> ctName = queryConstructionTask.list();
        if (!ctName.isEmpty()) {
            strContent.append(" cho công trình: " + ctName.get(0));
        }
//      hoanm1_20180929_start// can xem lại chuyen nguoi thoi gian dang bi null
        SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");// dd/MM/yyyy
        strContent.append(", thời gian thực hiện từ " +sdfDate.format(request.getStartDate()) + " đến " + sdfDate.format(request.getEndDate()) );
//        hoanm1_20180929_end
        strContent.replace(i, i + 1, name);
        

        String email = "";
        String phoneNumber = "";
        SQLQuery querySms = getSession().createSQLQuery(sqlSendSmsEmail.toString());
        String sqlUser = new String(
                "SELECT EMAIL email, PHONE_NUMBER mobile FROM SYS_USER WHERE SYS_USER_ID = :sysUserId ");
        SQLQuery queryGetSysUser = getSession().createSQLQuery(sqlUser);
        queryGetSysUser.addScalar("email", new StringType());
        queryGetSysUser.addScalar("mobile", new StringType());
        queryGetSysUser.setParameter("sysUserId", newPerformerId);
        queryGetSysUser.setResultTransformer(Transformers.aliasToBean(SysUserDTO.class));
        SysUserDTO userDTO = (SysUserDTO) queryGetSysUser.uniqueResult();

        email = userDTO.getEmail();
        phoneNumber = userDTO.getMobile();

        querySms.setParameter("phoneNumber", phoneNumber);
        querySms.setParameter("email", email);
        querySms.setParameter("createUserId", sysUserId);
        querySms.setParameter("createGroupId", sysGroupId);
        querySms.setParameter("sendSmsEmailId", sendSmsEmailId);
        querySms.setParameter("createdDate", new Date());
        querySms.setParameter("content", strContent.toString());
        querySms.setParameter("subject", nameSubject);
//      hoanm1_20181022_start
      if(request.getWorkItemId() !=null){
      	querySms.setParameter("workItemId", request.getWorkItemId());
      }else{
      	querySms.setParameter("workItemId", 0L);
      }
//      hoanm1_20181022_end
        return querySms.executeUpdate();
    }
    // chinhpxn20180720_end
//    hoanm1_20180829_start
    /**
     * getChartWorkItem
     *
     * @param req
     * @return List<ConstructionScheduleItemDTO>
     */
    private Logger LOGGER = Logger.getLogger(ConstructionTaskWsRsService.class);
    public List<ConstructionScheduleItemDTO> getChartWorkItem(ConstructionScheduleDTORequest req) {
        long sysUserId = req.getSysUserRequest().getSysUserId();
        long sysGroupId = Long.parseLong(req.getSysUserRequest().getSysGroupId());
        String strMonth = getCurrentTimeStampMonth();
        long month = Long.parseLong(strMonth);

        String strYear = getCurrentTimeStampYear();
        long year = Long.parseLong(strYear);

        StringBuilder sql = new StringBuilder("");
        sql.append(" SELECT ");
        sql.append(" sum(case when wi.STATUS =1 then 1 else 0 end) perUnImplemented, ");
        sql.append(" sum(case when wi.STATUS =2 then 1 else 0 end) perImplemented, ");
        sql.append(" sum(case when wi.STATUS =3 then 1 else 0 end) perComplete, ");
        sql.append(" sum(case when wi.STATUS =4 then 1 else 0 end) perStop ");
        sql.append(" FROM CONSTRUCTION_TASK ct INNER JOIN WORK_ITEM wi  ");
        sql.append(" ON ct.WORK_ITEM_ID = wi.WORK_ITEM_ID AND ct.CONSTRUCTION_ID = wi.CONSTRUCTION_ID ");
        sql.append(" inner join detail_month_plan dmp on ct.detail_month_plan_id=dmp.detail_month_plan_id and dmp.sign_state=3 and dmp.status=1 ");
        sql.append(" WHERE ct.LEVEL_ID = 3 and	ct.TYPE = 1 ");
        sql.append(" AND ct.PERFORMER_ID = :performerId ");
//        sql.append(" AND ct.SYS_GROUP_ID = :sysGroupId ");
        sql.append(" AND ct.MONTH = :month AND ct.YEAR = :year ");       

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("performerId", sysUserId);
//        query.setParameter("sysGroupId", sysGroupId);
        query.setParameter("month", month);
        query.setParameter("year", year);
        query.addScalar("perUnImplemented", new LongType());
        query.addScalar("perImplemented", new LongType());
        query.addScalar("perComplete", new LongType());
        query.addScalar("perStop", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(ConstructionScheduleItemDTO.class));
        return query.list();
    }
//    hoanm1_20180829_end
}
