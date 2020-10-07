package com.viettel.aio.dao;

import com.viettel.aio.dto.report.AIORpHrNotSalesDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Created by HaiND on 9/28/2019 1:39 AM.
 */
@EnableTransactionManagement
@Transactional
@Repository("aioRpHrNotSalesDAO")
public class AIORpHrNotSalesDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public List<AIORpHrNotSalesDTO> doSearchArea(AIORpHrNotSalesDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("with tbl as (select distinct AREA_CODE, AREA_ID ")
                .append("from SYS_GROUP ")
                .append("where AREA_CODE is not null and AREA_ID is not null ");
        if (StringUtils.isNotEmpty(dto.getAreaCode())) {
            sql.append("and upper(AREA_CODE) LIKE upper(:keySearch) escape '&' ");
        }
        sql.append("order by AREA_CODE) ");
        sql.append("select AREA_CODE text, AREA_ID areaId ")
                .append("from tbl ")
                .append("where ROWNUM <=10 ");


        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getAreaCode())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(dto.getAreaCode()) + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpHrNotSalesDTO.class));
        query.addScalar("text", new StringType());
        query.addScalar("areaId", new LongType());

        return query.list();
    }

    public List<AIORpHrNotSalesDTO> doSearchGroup(AIORpHrNotSalesDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("SELECT ST.SYS_GROUP_ID groupId, ST.NAME text, ST.CODE groupCode ")
                .append("from CTCT_CAT_OWNER.SYS_GROUP ST ")
                .append("where ST.STATUS=1 and ROWNUM <=10 ");
        if (StringUtils.isNotEmpty(dto.getGroupName())) {
            sql.append("AND (upper(ST.NAME) LIKE upper(:groupName) escape '&' OR upper(ST.CODE) LIKE upper(:groupName) escape '&') ");
        }
        if (dto.getAreaId() != null) {
            sql.append("AND ST.AREA_ID = :areaId ");
        }
        sql.append("order by ST.CODE");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getGroupName())) {
            query.setParameter("groupName", "%" + ValidateUtils.validateKeySearch(dto.getGroupName()) + "%");
        }
        if (dto.getAreaId() != null) {
            query.setParameter("areaId", dto.getAreaId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpHrNotSalesDTO.class));
        query.addScalar("groupId", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("groupCode", new StringType());

        return query.list();
    }

    public List<AIORpHrNotSalesDTO> doSearch(AIORpHrNotSalesDTO dto, Date startDate, Date endDate, int month, int year) {
        StringBuilder sql = new StringBuilder()
                .append(" with tbl as( ")
                .append(" select " +
                        "su.SYS_USER_ID sysUserId, " +
                        "sg.AREA_CODE areaCode, " +
                        "sg.PROVINCE_CODE provinceCode, " +
                        "sg.GROUP_NAME_LEVEL3 groupNameLv3, " +
                        "su.EMPLOYEE_CODE employeeCode, " +
                        "su.FULL_NAME fullName, " +
                        " min(case when (std.TARGETS_AMOUNT_TM>0 and a.type = 2) or(std.TARGETS_AMOUNT_TM=0) then 0 else 1 end) tradeFlg, " +
                        " min(case when (std.TARGETS_AMOUNT_DV>0 and a.type = 1) or(std.TARGETS_AMOUNT_DV=0)  then 0 else 1 end) serviceFlg ")
                .append(" from AIO_STAFF_PLAN_DETAIL std ")
                .append(" left join AIO_STAFF_PLAN st on std.AIO_STAFF_PLAN_ID = st.STAFF_PLAN_ID ")
                .append(" left join SYS_USER su on std.SYS_USER_ID = su.SYS_USER_ID  ")
                .append(" left join sys_group sg on sg.SYS_GROUP_ID = su.SYS_GROUP_ID  ")
                .append(" left join aio_Contract c on c.SELLER_ID = std.sys_user_id  ")
                .append(" left join AIO_ACCEPTANCE_RECORDS a on c.CONTRACT_ID = a.CONTRACT_ID  ")
                .append(" where  ")
                .append(" st.MONTH = :month and st.YEAR = :year and st.STATUS = 1 and  ")
                .append(" su.STATUS = 1 and  ")
                .append(" ((c.STATUS !=4  and trunc(c.CREATED_DATE)>= trunc (:startDate)  and trunc(c.CREATED_DATE)<= trunc (:endDate) )  or (c.STATUS is null))  ")
                .append(" group by su.SYS_USER_ID,  sg.AREA_CODE, sg.PROVINCE_CODE, sg.GROUP_NAME_LEVEL3,  su.EMPLOYEE_CODE, su.FULL_NAME)  ")
                .append(" select * from tbl where tradeFlg !=0 or serviceFlg !=0  ");


        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        query.setParameter("month", month);
        query.setParameter("year", year);
        query.setParameter("startDate", startDate);
        query.setParameter("endDate", endDate);
        queryCount.setParameter("month", month);
        queryCount.setParameter("year", year);
        queryCount.setParameter("startDate", startDate);
        queryCount.setParameter("endDate", endDate);

        query.setResultTransformer(Transformers.aliasToBean(AIORpHrNotSalesDTO.class));
        query.addScalar("sysUserId", new LongType());
        query.addScalar("areaCode", new StringType());
        query.addScalar("provinceCode", new StringType());
        query.addScalar("groupNameLv3", new StringType());
        query.addScalar("employeeCode", new StringType());
        query.addScalar("fullName", new StringType());
        query.addScalar("tradeFlg", new IntegerType());
        query.addScalar("serviceFlg", new IntegerType());

        this.setPageSize(dto, query, queryCount);

        return query.list();
    }

    private <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }
}
