package com.viettel.coms.dao;

import com.viettel.cat.dto.IssueHistoryDetailDTO;
import com.viettel.coms.bo.IssueBO;
import com.viettel.coms.dto.IssueDetailDTO;
import com.viettel.coms.dto.IssueDiscussDTO;
import com.viettel.coms.dto.IssueHistoryDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
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

@Repository("issueItemDAO")
public class IssueDAO extends BaseFWDAOImpl<IssueBO, Long> {

    public IssueDAO() {
        this.model = new IssueBO();
    }

    public IssueDAO(Session session) {
        this.session = session;
    }

    public List<IssueDetailDTO> doSearch(IssueDetailDTO obj, List<String> groupIdList) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT issue.ISSUE_ID issueId, cons.code constructionCode,  issue.content content, issue.content_handing contentHanding, issue.Created_date createdDate,  createUser.full_name createdUserName, ");
        sql.append(" currentHandingUser.full_name currentHandingUserName,  issue.status status,  issue.state state,  catPro.CAT_PROVINCE_ID catProvinceId,  catPro.CODE catProvinceCode,  catPro.NAME catProvinceName "
                + ",cat.code catStationCode, work.name workItemName, createUser.PHONE_NUMBER createdPhoneNumber,currentHandingUser.PHONE_NUMBER currentHandingPhoneNumber,"
                + "issue.Current_handing_user_id currentHandingUserId" + "  from ISSUE issue  ");
        sql.append(" left join construction cons on cons.CONSTRUCTION_ID = issue.CONSTRUCTION_ID ");
        sql.append(" left join WORK_ITEM work on work.WORK_ITEM_ID = issue.WORK_ITEM_ID ");
        sql.append(" left join CAT_STATION cat on cat.cat_station_id = cons.cat_station_id ");
        sql.append(" left join cat_province catPro on catPro.CAT_PROVINCE_ID = cat.CAT_PROVINCE_ID ");
        sql.append(" left join sys_user createUser on createUser.sys_user_id = issue.Created_user_id ");
        sql.append(
                " left join sys_user currentHandingUser on currentHandingUser.sys_user_id = issue.Current_handing_user_id where 1=1 ");
        if (groupIdList != null && !groupIdList.isEmpty())
            sql.append(" and  catPro.CAT_PROVINCE_ID in :groupIdList ");
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(
                    " AND (upper(cons.code) LIKE upper(:keySearch) OR  upper(issue.content) LIKE upper(:keySearch) OR upper(createUser.full_name) LIKE upper(:keySearch) escape '&')");
        }
        if (obj.getSysGroupId() != null) {
            sql.append(" and  cons.sys_Group_id = :sysGroupId ");
        }
        if (obj.getCreatedFrom() != null) {
            sql.append(" and issue.Created_date >= :createFrom ");
        }
        if (obj.getCreatedTo() != null) {
            sql.append(" and issue.Created_date <= :createTo ");
        }
        if (StringUtils.isNotEmpty(obj.getState())) {
            sql.append(" and issue.state = :state ");
        }
        if (StringUtils.isNotEmpty(obj.getStatus()) && !"-1".equalsIgnoreCase(obj.getStatus())) {
            sql.append(" and issue.status = :status ");
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            sql.append(" AND catPro.CAT_PROVINCE_ID = :catProvinceId ");
        }
        // tuannt_15/08/2018_start
        StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
        sqlCount.append(sql.toString());
        sqlCount.append(" and 1 =1 )");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

        query.addScalar("issueId", new LongType());
        query.addScalar("currentHandingUserId", new LongType());
        query.addScalar("currentHandingPhoneNumber", new StringType());
        query.addScalar("contentHanding", new StringType());
        query.addScalar("createdPhoneNumber", new StringType());
        query.addScalar("workItemName", new StringType());
        query.addScalar("catStationCode", new StringType());
        query.addScalar("constructionCode", new StringType());
        query.addScalar("content", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("currentHandingUserName", new StringType());
        query.addScalar("status", new StringType());
        query.addScalar("state", new StringType());
        query.addScalar("catProvinceId", new LongType());
        query.addScalar("catProvinceCode", new StringType());
        query.addScalar("catProvinceName", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(IssueDetailDTO.class));
        if (groupIdList != null && !groupIdList.isEmpty()) {
            query.setParameterList("groupIdList", groupIdList);
            queryCount.setParameterList("groupIdList", groupIdList);
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
            queryCount.setParameter("keySearch", "%" + obj.getKeySearch() + "%");
        }
        if (obj.getSysGroupId() != null) {
            query.setParameter("sysGroupId", obj.getSysGroupId());
            queryCount.setParameter("sysGroupId", obj.getSysGroupId());
        }
        if (obj.getCreatedFrom() != null) {
            query.setParameter("createFrom", obj.getCreatedFrom());
            queryCount.setParameter("createFrom", obj.getCreatedFrom());
        }
        if (obj.getCreatedTo() != null) {
            query.setParameter("createTo", obj.getCreatedTo());
            queryCount.setParameter("createTo", obj.getCreatedTo());
        }
        if (StringUtils.isNotEmpty(obj.getState())) {
            query.setParameter("state", obj.getState());
            queryCount.setParameter("state", obj.getState());
        }
        if (StringUtils.isNotEmpty(obj.getStatus()) && !"-1".equalsIgnoreCase(obj.getStatus())) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        // tuannt_15/08/2018_start
        if (obj.getCatProvinceId() != null) {
            query.setParameter("catProvinceId", obj.getCatProvinceId());
            queryCount.setParameter("catProvinceId", obj.getCatProvinceId());
        }
        // tuannt_15/08/2018_start
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public Long getProvinceIdByIssue(Long issueId) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT catPro.cat_province_id catProvinceId FROM CAT_PROVINCE catPro LEFT JOIN CAT_STATION cat");
        sql.append(
                " ON cat.CAT_PROVINCE_ID = catPro.CAT_PROVINCE_ID LEFT JOIN CONSTRUCTION cons ON cons.CAT_STATION_ID =cat.CAT_STATION_ID ");
        sql.append(
                " LEFT JOIN ISSUE issue ON issue.CONSTRUCTION_ID = cons.CONSTRUCTION_ID WHERE issue.ISSUE_ID     = :id ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.addScalar("catProvinceId", new LongType());
        query.setParameter("id", issueId);
        List<Long> listId = query.list();
        if (listId != null && !listId.isEmpty())
            return listId.get(0);
        return -1L;
    }

    public int updateIssue(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "update ISSUE set UPDATED_DATE = sysDate, UPDATED_USER_ID = :userId, status = :status ");
        if (StringUtils.isNotEmpty(obj.getProcessContent())) {
            sql.append(",content_handing =:processContent");
        }
        sql.append(" where ISSUE_ID=:id");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getIssueId());
        query.setParameter("userId", obj.getUpdatedUserId());
        query.setParameter("status", obj.getStatus());
        if (StringUtils.isNotEmpty(obj.getProcessContent())) {
            query.setParameter("processContent", obj.getProcessContent());
        }
        return query.executeUpdate();
    }

    public List<IssueDiscussDTO> getIssueDiscuss(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "SELECT issueDis.content content,  TO_CHAR(issueDis.CREATED_DATE,'HH24:MI DD-MM-YYYY') createdDateStr,  createdUser.full_name createdUserName");
        sql.append(
                " FROM ISSUE_DISCUSS issueDis LEFT JOIN sys_user createdUser ON createdUser.SYS_USER_ID = issueDis.CREATED_USER_ID  ");
        sql.append(" where issueDis.ISSUE_ID = :id order by  issueDis.CREATED_DATE desc");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getIssueId());
        query.addScalar("content", new StringType());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("createdUserName", new StringType());
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        query.setResultTransformer(Transformers.aliasToBean(IssueDiscussDTO.class));
        return query.list();
    }

    public List<IssueHistoryDetailDTO> getIssueHistory(IssueDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                "WITH record AS  (SELECT createUser.full_Name createdUserName,  TO_CHAR(issueHis.CREATED_DATE,'HH24:MI DD-MM-YYYY') createdDateStr,  "
                        + " TO_CHAR(issueHis.CREATED_DATE,'HH24:MI ss DD-MM-YYYY') createdDateFull  ,issueHis.CREATED_USER_ID createdUserId");
        sql.append(
                " FROM ISSUE_HISTORY issueHis  LEFT JOIN sys_user createUser  ON createUser.sys_user_id = issueHis.CREATED_USER_ID  WHERE issueHis.ISSUE_ID   = :id ");
        sql.append(
                " GROUP BY createUser.full_Name,    TO_CHAR(issueHis.CREATED_DATE,'HH24:MI DD-MM-YYYY'),TO_CHAR(issueHis.CREATED_DATE,'HH24:MI ss DD-MM-YYYY'),issueHis.CREATED_USER_ID)  SELECT * FROM record ORDER BY createdDateFull DESC");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", obj.getIssueId());
        query.addScalar("createdDateStr", new StringType());
        query.addScalar("createdDateFull", new StringType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("createdUserId", new LongType());
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
            query.setMaxResults(obj.getPageSize().intValue());
        }
        query.setResultTransformer(Transformers.aliasToBean(IssueHistoryDetailDTO.class));
        return query.list();
    }

    public List<IssueHistoryDTO> getIssueHistoryGroup(IssueHistoryDetailDTO obj) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder(
                " WITH type1 AS  (SELECT issueHis.type type,    CASE issueHis.old_value      WHEN N'0'      THEN N'Đóng'      WHEN N'1' ");
        sql.append(
                " THEN N'Mở'    END oldValue,    CASE issueHis.new_value      WHEN N'0'      THEN N'Đóng'      WHEN N'1'      THEN N'Mở'    END newValue, ");
        sql.append(
                " issueHis.created_user_id,    issueHis.created_date  FROM issue_History issueHis  WHERE issueHis.type = 1  ), ");
        sql.append(
                " type2 AS  (SELECT issueHis.type type,    oldUser.full_name oldValue,    newUser.full_name newValue,    issueHis.created_user_id,    issueHis.created_date ");
        sql.append(
                " FROM issue_History issueHis  LEFT JOIN sys_user oldUser  ON oldUser.sys_user_id = issueHis.old_value  LEFT JOIN sys_user newUser ");
        sql.append(" ON newUser.sys_user_id = issueHis.new_value  WHERE issueHis.type    = 2 ");
        sql.append(
                " ),type3 as(SELECT issueHis.type type, issueHis.old_value oldValue,issueHis.new_value newValue, issueHis.created_user_id, ");
        sql.append(" issueHis.created_date  FROM issue_History issueHis WHERE issueHis.type    = 3 ), ");
        sql.append(
                " type4 as(SELECT issueHis.type type, issueHis.old_value oldValue,issueHis.new_value newValue, issueHis.created_user_id, ");
        sql.append(" issueHis.created_date  FROM issue_History issueHis WHERE issueHis.type    = 4 ), ");
        sql.append(
                " record as(SELECT * FROM type1 union all SELECT * FROM type2 union all SELECT * FROM type3 union all SELECT * FROM type4) ");
        sql.append(
                " select * from record where created_user_id  = :userId and TO_CHAR(CREATED_DATE,'HH24:MI ss DD-MM-YYYY') = :createDate ");
        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("userId", obj.getCreatedUserId());
        query.setParameter("createDate", obj.getCreatedDateFull());
        query.addScalar("type", new StringType());
        query.addScalar("oldValue", new StringType());
        query.addScalar("newValue", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(IssueHistoryDTO.class));
        return query.list();
    }

    public void updateCurentHandingUser(Long issueId, Long newValue) {
        // TODO Auto-generated method stub
        StringBuilder sql = new StringBuilder("");
        sql.append("update ISSUE set CURRENT_HANDING_USER_ID=:id where 	ISSUE_ID=:issueId ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        query.setParameter("id", newValue);
        query.setParameter("issueId", issueId);

        query.executeUpdate();

    }

}
