package com.viettel.coms.dao;

import com.viettel.coms.bo.IssueBO;
import com.viettel.coms.dto.DomainDTO;
import com.viettel.coms.dto.IssueDTO;
import com.viettel.coms.dto.IssueRequest;
import com.viettel.coms.dto.IssueWorkItemDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-05-23
 */
@Repository("IssueMbDAO")
public class IssueMbDAO extends BaseFWDAOImpl<IssueBO, Long> {

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<IssueWorkItemDTO> getIssueItem(IssueRequest request) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("issue.CONTENT AS content, ");
        sql.append("issue.CONSTRUCTION_ID AS constructionId, ");
        sql.append("cst.CODE AS code, ");
        sql.append("issue.STATUS AS status, ");
        sql.append("issue.ISSUE_ID AS issueId, ");
        sql.append("issue.CONTENT_HANDING AS contentHanding, ");
        sql.append("issue.CURRENT_HANDING_USER_ID AS currentHandingUserId, ");
        sql.append("issue.STATE AS state, ");
        sql.append("issue.CREATED_USER_ID AS createdUserId, ");
        sql.append("issue.WORK_ITEM_ID AS workItemId, ");
        sql.append("wi.NAME AS workItemName, ");
        sql.append("issue.IS_PROCESS_FEEDBACK isProcessFeedback ");

        sql.append("FROM ");
        sql.append(
                "SYS_USER a, USER_ROLE b, SYS_ROLE  c, USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g, cat_station station, construction cst ,ISSUE issue ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON issue.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        sql.append("WHERE ");
        sql.append("a.SYS_USER_ID = b.SYS_USER_ID ");
        sql.append("AND a.SYS_USER_ID = '" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append("AND b.SYS_ROLE_ID = c.SYS_ROLE_ID ");
        sql.append("AND c.CODE = 'COMS_GOVERNOR' ");
        sql.append("AND b.USER_ROLE_ID = d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID = e.DOMAIN_DATA_ID ");
        sql.append("AND e.DOMAIN_TYPE_ID = g.DOMAIN_TYPE_ID ");
        sql.append("AND g.CODE = 'KTTS_LIST_PROVINCE' ");
        sql.append("AND e.DATA_ID = station.CAT_PROVINCE_ID ");
        sql.append("AND station.CAT_STATION_ID = cst.CAT_STATION_ID ");
        sql.append("AND cst.CONSTRUCTION_ID = issue.CONSTRUCTION_ID");

        // Mapping value
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("content", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("issueId", new LongType());
        query.addScalar("contentHanding", new StringType());
        query.addScalar("currentHandingUserId", new LongType());
        query.addScalar("state", new StringType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("isProcessFeedback", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(IssueWorkItemDTO.class));

        // get list
        return query.list();
    }

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<IssueWorkItemDTO> getIssueItemByProcessFeedback(IssueRequest request) {
        StringBuilder sql = new StringBuilder();

        sql.append("SELECT  ");
        sql.append("issue.CONTENT AS content,  ");
        sql.append("issue.CONSTRUCTION_ID AS constructionId,  ");
        sql.append("cst.CODE AS code,  ");
        sql.append("issue.STATUS AS status,  ");
        sql.append("issue.ISSUE_ID AS issueId,  ");
        sql.append("issue.CONTENT_HANDING AS contentHanding,  ");
        sql.append("issue.CURRENT_HANDING_USER_ID AS currentHandingUserId,  ");
        sql.append("issue.STATE AS state,  ");
        sql.append("issue.CREATED_USER_ID AS createdUserId,  ");
        sql.append("issue.WORK_ITEM_ID AS workItemId,  ");
        sql.append("wi.NAME AS workItemName, ");
        sql.append("issue.IS_PROCESS_FEEDBACK isProcessFeedback ");
        sql.append("FROM SYS_USER a,  ");
        sql.append("  USER_ROLE b,  ");
        sql.append("  SYS_ROLE c,  ");
        sql.append("  USER_ROLE_DATA d,  ");
        sql.append("  DOMAIN_DATA e,  ");
        sql.append("  ROLE_PERMISSION role_per,  ");
        sql.append("  permission pe,  ");
        sql.append("  OPERATION op,  ");
        sql.append("  AD_RESOURCE ad ,cat_station station, construction cst ,ISSUE issue ");
        sql.append("  LEFT JOIN WORK_ITEM wi ON issue.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        sql.append("WHERE a.SYS_USER_ID       =b.SYS_USER_ID  ");
        sql.append("AND b.SYS_ROLE_ID         =c.SYS_ROLE_ID  ");
        sql.append("AND b.USER_ROLE_ID        =d.USER_ROLE_ID  ");
        sql.append("AND d.DOMAIN_DATA_ID      =e.DOMAIN_DATA_ID  ");
        sql.append("AND c.SYS_ROLE_ID         =role_per.SYS_ROLE_ID  ");
        sql.append("AND role_per.permission_id=pe.permission_id  ");
        sql.append("AND pe.OPERATION_id       =op.OPERATION_id  ");
        sql.append("AND pe.AD_RESOURCE_ID     =ad.AD_RESOURCE_ID  ");
        sql.append("AND e.DATA_ID = station.CAT_PROVINCE_ID ");
        sql.append("AND station.CAT_STATION_ID = cst.CAT_STATION_ID ");
        sql.append("AND cst.CONSTRUCTION_ID = issue.CONSTRUCTION_ID ");
        sql.append("AND a.SYS_USER_ID         = '" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append("AND upper(op.code  ");
        sql.append("  ||' '  ");
        sql.append("  ||ad.code) LIKE 'PROCESS FEEDBACK'  ");

        // Mapping value
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("content", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("issueId", new LongType());
        query.addScalar("contentHanding", new StringType());
        query.addScalar("currentHandingUserId", new LongType());
        query.addScalar("state", new StringType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("isProcessFeedback", new LongType());

        query.setResultTransformer(Transformers.aliasToBean(IssueWorkItemDTO.class));

        // get list
        return query.list();
    }

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<IssueWorkItemDTO> getIssueItemByStaff(IssueRequest request) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append("issue.CONTENT AS content, ");
        sql.append("issue.CONSTRUCTION_ID AS constructionId, ");
        sql.append("cst.CODE AS code, ");
        sql.append("issue.STATUS AS status, ");
        sql.append("issue.ISSUE_ID AS issueId, ");
        sql.append("issue.CONTENT_HANDING AS contentHanding, ");
        sql.append("issue.CURRENT_HANDING_USER_ID AS currentHandingUserId, ");
        sql.append("issue.STATE AS state, ");
        sql.append("issue.CREATED_USER_ID AS createdUserId, ");
        sql.append("issue.WORK_ITEM_ID AS workItemId, ");
        sql.append("wi.NAME AS workItemName, ");
        sql.append("issue.IS_PROCESS_FEEDBACK isProcessFeedback ");

        sql.append("FROM ");
        sql.append("ISSUE issue ");
        sql.append("LEFT JOIN WORK_ITEM wi ");
        sql.append("ON issue.WORK_ITEM_ID = wi.WORK_ITEM_ID ");
        sql.append("LEFT JOIN construction cst ");
        sql.append("ON cst.CONSTRUCTION_ID = issue.CONSTRUCTION_ID ");
        sql.append("WHERE ");
        sql.append("issue.CREATED_USER_ID = '" + request.getSysUserRequest().getSysUserId() + "' ");

        // Mapping value
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("content", new StringType());
        query.addScalar("constructionId", new LongType());
        query.addScalar("code", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("issueId", new LongType());
        query.addScalar("contentHanding", new StringType());
        query.addScalar("currentHandingUserId", new LongType());
        query.addScalar("state", new StringType());
        query.addScalar("createdUserId", new LongType());
        query.addScalar("workItemId", new LongType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("isProcessFeedback", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(IssueWorkItemDTO.class));

        return query.list();
    }

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<IssueWorkItemDTO> checkGovernor(IssueRequest request) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT c.code ");
        sql.append("FROM SYS_USER a, USER_ROLE b, SYS_ROLE c, USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g ");
        sql.append("WHERE a.SYS_USER_ID=b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID=c.SYS_ROLE_ID ");
        sql.append("AND c.CODE='COMS_GOVERNOR' ");
        sql.append("AND b.USER_ROLE_ID=d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID ");
        sql.append("AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID ");
        sql.append("AND g.code='KTTS_LIST_PROVINCE' ");
        sql.append("AND a.SYS_USER_ID = '" + request.getSysUserRequest().getSysUserId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("code", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(IssueWorkItemDTO.class));

        return query.list();
    }

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     */
    public List<DomainDTO> checkProcessFeedback(IssueRequest request) {
        StringBuilder sql = new StringBuilder();
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
        sql.append("AND a.SYS_USER_ID         = '" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append("AND upper(op.code ");
        sql.append("  ||' ' ");
        sql.append("  ||ad.code) LIKE 'PROCESS FEEDBACK' ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("dataCode", new StringType());
        query.addScalar("dataId", new LongType());
        query.addScalar("adResource", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(DomainDTO.class));

        return query.list();
    }

    /**
     * START SERVICE MOBILE
     *
     * @param request
     * @return List<IssueWorkItemDTO>
     *//*
     * public IssueWorkItemDTO getCurrentHandingUserIdByContruction(IssueRequest
     * request) { StringBuilder sql = new StringBuilder();
     * sql.append("SELECT a.SYS_USER_ID gorSysUserIdByCons "); sql.append("FROM  ");
     * sql.
     * append("SYS_USER a,USER_ROLE b,SYS_ROLE  c,USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g,CAT_STATION station, CONSTRUCTION cst  "
     * ); sql.append("WHERE  "); sql.append("a.SYS_USER_ID=b.SYS_USER_ID  ");
     * sql.append("AND b.SYS_ROLE_ID=c.SYS_ROLE_ID  ");
     * sql.append("AND c.CODE='COMS_GOVERNOR'  ");
     * sql.append("AND b.USER_ROLE_ID=d.USER_ROLE_ID  ");
     * sql.append("AND d.DOMAIN_DATA_ID=e.DOMAIN_DATA_ID  ");
     * sql.append("AND e.DOMAIN_TYPE_ID=g.DOMAIN_TYPE_ID  ");
     * sql.append("AND g.code='KTTS_LIST_PROVINCE'  ");
     * sql.append("AND e.data_id=station.cat_province_id  ");
     * sql.append("AND station.cat_station_id = cst.cat_station_id  ");
     * sql.append("and cst.construction_id    = '" +
     * request.getIssueDetail().getConstructionId() + "' ");
     *
     * SQLQuery query = getSession().createSQLQuery(sql.toString());
     * query.addScalar("gorSysUserIdByCons", new LongType());
     * query.setResultTransformer(Transformers.aliasToBean(IssueWorkItemDTO.class));
     *
     * return (IssueWorkItemDTO) query.list().get(0); }
     */

    /**
     * update Issue Item By Staff
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueItemByClose(IssueRequest request) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE ISSUE issue ");
        sql.append("SET ");
        sql.append("issue.CONTENT            = '" + request.getIssueDetail().getContent() + "', ");
        sql.append("issue.STATUS             = '0', ");
        sql.append("issue.CONSTRUCTION_ID    = '" + request.getIssueDetail().getConstructionId() + "', ");
        sql.append("issue.WORK_ITEM_ID       = '" + request.getIssueDetail().getWorkItemId() + "', ");
        sql.append("issue.UPDATED_DATE       = sysdate, ");
        sql.append("issue.UPDATED_USER_ID    = '" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append("WHERE issue.ISSUE_ID     = '" + request.getIssueDetail().getIssueId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * update Issue Item By Staff
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueItemByOpen(IssueRequest request) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE ISSUE issue ");
        sql.append("SET ");
        sql.append("issue.CONTENT            = '" + request.getIssueDetail().getContent() + "', ");
        sql.append("issue.STATUS             = '1', ");
        sql.append("issue.CONSTRUCTION_ID    = '" + request.getIssueDetail().getConstructionId() + "', ");
        sql.append("issue.WORK_ITEM_ID       = '" + request.getIssueDetail().getWorkItemId() + "', ");
        sql.append("issue.UPDATED_DATE       = sysdate, ");
        sql.append("issue.UPDATED_USER_ID    = '" + request.getSysUserRequest().getSysUserId() + "' ");
        sql.append("WHERE issue.ISSUE_ID     = '" + request.getIssueDetail().getIssueId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());

        return query.executeUpdate();
    }

    /**
     * update Issue Item By Governor
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueItemToProcessFeedBack(IssueRequest req, IssueDTO currentHandingUserIdByContruction)
            throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE ISSUE issueGov ");
        sql.append("SET ");
        sql.append("issueGov.CONTENT_HANDING = '" + req.getIssueDetail().getContentHanding() + "', ");
        sql.append("issueGov.STATUS          = '2', ");
        sql.append("issueGov.CONSTRUCTION_ID = '" + req.getIssueDetail().getConstructionId() + "', ");
        sql.append("issueGov.WORK_ITEM_ID    = '" + req.getIssueDetail().getWorkItemId() + "', ");
        sql.append("issueGov.CURRENT_HANDING_USER_ID    = '"
                + currentHandingUserIdByContruction.getCurrentHandingUserId() + "', ");
//		sql.append("issueGov.UPDATED_DATE    = '" + getCurrentTime() + "', ");
        sql.append("issueGov.UPDATED_DATE    = sysdate, ");
        sql.append("issueGov.IS_PROCESS_FEEDBACK    = '1', ");
        sql.append("issueGov.UPDATED_USER_ID = '" + req.getSysUserRequest().getSysUserId() + "' ");
        sql.append("WHERE ");
        sql.append("issueGov.ISSUE_ID  = '" + req.getIssueDetail().getIssueId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * update issue history
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueHistoryHandingUserId(IssueRequest req, Long currentHandingUserIdByContruction,
                                               Long changeSysRoleCodeNo) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ISSUE_HISTORY ");
        sql.append("(ISSUE_HISTORY_ID, OLD_VALUE, NEW_VALUE, TYPE, CREATED_USER_ID, ISSUE_ID, CREATED_DATE) ");
        sql.append("VALUES ( ");
        sql.append("ISSUE_HISTORY_seq.nextval, ");

        if (changeSysRoleCodeNo.compareTo(2l) == 0) {
            sql.append("'" + req.getIssueDetail().getCurrentHandingUserId() + "', ");
            sql.append("'" + currentHandingUserIdByContruction + "', ");
            sql.append("'2', ");
        } else if (changeSysRoleCodeNo.compareTo(1l) == 0) {
            sql.append("'0', ");
            sql.append("'1', ");
            sql.append("'1', ");
        } else {
            sql.append("'1', ");
            sql.append("'0', ");
            sql.append("'1', ");
        }
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getCreatedUserId() + "', ");
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getIssueId() + "', ");
//		sql.append("'" + getCurrentTime() + "'");
        sql.append(" sysdate ");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * update issue history
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int insertCurrentHandingUserId(IssueRequest req) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ISSUE_HISTORY ");
        sql.append("(ISSUE_HISTORY_ID, OLD_VALUE, NEW_VALUE, TYPE, CREATED_USER_ID, ISSUE_ID, CREATED_DATE) ");
        sql.append("VALUES ( ");
        sql.append("ISSUE_HISTORY_seq.nextval, ");
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getOldValue() + "', ");
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getNewValue() + "', ");
        sql.append("'6', ");
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getCreatedUserId() + "', ");
        sql.append("'" + req.getIssueHistoryContentIssueDetail().getIssueId() + "', ");
        sql.append("'" + getCurrentTime() + "'");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * update issue history
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueHistoryContentHanding(IssueRequest req) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ISSUE_HISTORY ");
        sql.append("(ISSUE_HISTORY_ID, OLD_VALUE, NEW_VALUE, TYPE, CREATED_USER_ID, ISSUE_ID, CREATED_DATE) ");
        sql.append("VALUES ( ");
        sql.append("ISSUE_HISTORY_seq.nextval, ");
        sql.append("'" + req.getIssueHistoryContentHandingDetail().getOldValue() + "', ");
        sql.append("'" + req.getIssueHistoryContentHandingDetail().getNewValue() + "', ");
        sql.append("'3', ");
        sql.append("'" + req.getIssueHistoryContentHandingDetail().getCreatedUserId() + "', ");
        sql.append("'" + req.getIssueHistoryContentHandingDetail().getIssueId() + "', ");
        sql.append("'" + getCurrentTime() + "'");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * update issue history status
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int updateIssueHistoryContentIssueStatus(IssueRequest req) throws ParseException {
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ISSUE_HISTORY ");
        sql.append("(ISSUE_HISTORY_ID, OLD_VALUE, NEW_VALUE, TYPE, CREATED_USER_ID, ISSUE_ID, CREATED_DATE) ");
        sql.append("VALUES ( ");
        sql.append("ISSUE_HISTORY_seq.nextval, ");

        sql.append("'" + req.getIssueDetail().getStatus() + "', ");
        sql.append("'" + req.getIssueDetail().getOldStatus() + "', ");
        sql.append("'" + req.getIssueDetail().getStatus() + "', ");
        sql.append("'" + req.getIssueDetail().getCurrentHandingUserId() + "', ");

        sql.append("'" + req.getIssueDetail().getIssueId() + "', ");
        sql.append("'" + getCurrentTime() + "'");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * update issue history
     *
     * @param request
     * @return sqlState
     * @throws ParseException
     */
    public int registerIssueItemDetail(IssueRequest req) throws ParseException {

        // Công trình không có người quản lý
        List<IssueDTO> listIssueDTO = getGovernorIdByContructionIdInsert(req);
        if (listIssueDTO.size() == 0) {
            return -1;
        }

        // Current_handing_user_id = id của user được cấu hình là tỉnh trưởng của tỉnh
        // quản lý trạm của công trình
        // theo cấu hình VPS (CONSTRUCTION _id =>cat_station_id=> cat_province_id=> tỉnh
        // trưởng)
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ISSUE ");
        sql.append(
                "(ISSUE_ID, CONTENT, CONSTRUCTION_ID,  WORK_ITEM_ID, STATUS, CURRENT_HANDING_USER_ID, CREATED_USER_ID, CREATED_GROUP_ID, CREATED_DATE) ");
        sql.append("VALUES ( ");
        sql.append("ISSUE_seq.nextval, ");
        sql.append("'" + req.getIssueDTODetail().getContent() + "', ");
        sql.append("'" + req.getIssueDTODetail().getConstructionId() + "', ");
        sql.append("'" + req.getIssueDTODetail().getWorkItemId() + "', ");
        sql.append("'1', ");
        sql.append("'" + listIssueDTO.get(0).getCurrentHandingUserId() + "', ");
        sql.append("'" + req.getSysUserRequest().getSysUserId() + "', ");
        sql.append("'" + req.getIssueDTODetail().getCreatedGroupId() + "', ");
        sql.append(" sysdate ");
        sql.append(")");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        return query.executeUpdate();
    }

    /**
     * Get current time
     *
     * @return Current time
     * @throws ParseException
     */
    private String getCurrentTime() throws ParseException {
        Date now = new Date();
        String dateNow = now.toString();
        // Tue May 22 13:56:18 GMT+07:00 2018
        SimpleDateFormat dt = new SimpleDateFormat("EEE MMM d HH:mm:ss zzz yyyy");
        Date dateString = dt.parse(dateNow);
        SimpleDateFormat formater = new SimpleDateFormat("dd-MMMM-yy");
        return formater.format(dateString);
    }

    /**
     * Get current time
     *
     * @return Current time
     * @throws ParseException
     */
    public List<IssueDTO> getGovernorIdByContructionIdInsert(IssueRequest request) throws IndexOutOfBoundsException {
        StringBuilder sql = new StringBuilder();
        request.getIssueDTODetail().getConstructionId();

        sql.append("SELECT ");
        sql.append("a.SYS_USER_id AS currentHandingUserId ");
        sql.append("FROM ");
        sql.append(
                "SYS_USER a, USER_ROLE b, SYS_ROLE  c, USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g, cat_station station, construction cst ");
        sql.append("WHERE ");
        sql.append("a.SYS_USER_ID = b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID = c.SYS_ROLE_ID ");
        sql.append("AND c.CODE = 'COMS_GOVERNOR' ");
        sql.append("AND b.USER_ROLE_ID = d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID = e.DOMAIN_DATA_ID ");
        sql.append("AND e.DOMAIN_TYPE_ID = g.DOMAIN_TYPE_ID ");
        sql.append("AND g.CODE = 'KTTS_LIST_PROVINCE' ");
        sql.append("AND e.DATA_ID = station.CAT_PROVINCE_ID ");
        sql.append("AND station.CAT_STATION_ID = cst.CAT_STATION_ID ");
        sql.append("AND cst.CONSTRUCTION_ID = '" + request.getIssueDTODetail().getConstructionId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("currentHandingUserId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(IssueDTO.class));

        return query.list();
    }

    public List<IssueDTO> getGovernorIdByContructionId(IssueRequest request) throws IndexOutOfBoundsException {
        StringBuilder sql = new StringBuilder();
        request.getIssueDetail().getConstructionId();

        sql.append("SELECT ");
        sql.append("a.SYS_USER_id AS currentHandingUserId ");
        sql.append("FROM ");
        sql.append(
                "SYS_USER a, USER_ROLE b, SYS_ROLE  c, USER_ROLE_DATA d, DOMAIN_DATA  e, DOMAIN_TYPE g, cat_station station, construction cst ");
        sql.append("WHERE ");
        sql.append("a.SYS_USER_ID = b.SYS_USER_ID ");
        sql.append("AND b.SYS_ROLE_ID = c.SYS_ROLE_ID ");
        sql.append("AND c.CODE = 'COMS_GOVERNOR' ");
        sql.append("AND b.USER_ROLE_ID = d.USER_ROLE_ID ");
        sql.append("AND d.DOMAIN_DATA_ID = e.DOMAIN_DATA_ID ");
        sql.append("AND e.DOMAIN_TYPE_ID = g.DOMAIN_TYPE_ID ");
        sql.append("AND g.CODE = 'KTTS_LIST_PROVINCE' ");
        sql.append("AND e.DATA_ID = station.CAT_PROVINCE_ID ");
        sql.append("AND station.CAT_STATION_ID = cst.CAT_STATION_ID ");
        sql.append("AND cst.CONSTRUCTION_ID = '" + request.getIssueDetail().getConstructionId() + "'");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("currentHandingUserId", new LongType());
        query.setResultTransformer(Transformers.aliasToBean(IssueDTO.class));

        return query.list();
    }
}
