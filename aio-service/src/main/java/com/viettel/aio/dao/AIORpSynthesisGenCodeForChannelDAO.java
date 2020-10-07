package com.viettel.aio.dao;

import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioRpSynthesisGenCodeForChannelDAO")
public class AIORpSynthesisGenCodeForChannelDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    @SuppressWarnings("unchecked")
    public List<AIORpSynthesisGenCodeForChannelDTO> doSearch(AIORpSynthesisGenCodeForChannelDTO criteria) {
        String groupBy = "group by " +
                "tbl.PROVINCE_CODE,tbl.NAME,ql.EMPLOYEE_CODE," +
                "ql.FULL_NAME,ql.PHONE_NUMBER ,tbl.EMPLOYEE_CODE, " +
                "tbl.FULL_NAME,tbl.PHONE_NUMBER, "+
                "tbl.TAX_CODE,tbl.ADDRESS ,tbl.CONTRACT_CODE, " +
                "tbl.TAX_CODE_USER,tbl.ACCOUNT_NUMBER ,tbl.BANK,tbl.BANK_BRANCH,tbl.COMPANY_PARTNER,tbl.CREATED_DATE,tbl.OCCUPATION  ";
        StringBuilder sql = new StringBuilder()
                .append("with ql as (select SYS_USER_ID,EMPLOYEE_CODE,FULL_NAME, PHONE_NUMBER from SYS_USER where STATUS = 1), ")
                .append("tbl as(select s.PARENT_USER_ID,sg.PROVINCE_CODE, sg.NAME, s.EMPLOYEE_CODE, s.FULL_NAME, s.PHONE_NUMBER, ")
                .append("s.TAX_CODE, s.ADDRESS, s.CONTRACT_CODE, s.TAX_CODE_USER, s.ACCOUNT_NUMBER, s.BANK, s.BANK_BRANCH, s.COMPANY_PARTNER, s.CREATED_DATE, s.OCCUPATION ")
                .append("from SYS_USER s ")
                .append("LEFT join SYS_GROUP sg on s.SYS_GROUP_ID  =  sg.SYS_GROUP_ID ")
                .append("where s.TYPE_USER in (1,2) and s.STATUS = 1 ");
                if (criteria.getAreaId() != null) {
                    sql.append("and sg.AREA_ID = :areaId ");
                }
                if (criteria.getSysGroupId() != null) {
                    sql.append("and sg.PATH like '%'||:sysGroupId||'%' ");
                }
                if (criteria.getDateFrom() != null) {
                    sql.append("and trunc(s.CREATED_DATE)>= :dateFrom ");
                }
                if (criteria.getDateTo() != null) {
                    sql.append("and trunc(s.CREATED_DATE)<= :dateTo ");
                }
                sql.append(") ")
                .append("select ")
                .append("tbl.PROVINCE_CODE provinceCode, tbl.NAME sysGroupName,  ql.EMPLOYEE_CODE sysUserCode,ql.FULL_NAME sysUserName, ql.PHONE_NUMBER sysUserPhone, tbl.EMPLOYEE_CODE employeeCTVCode, tbl.FULL_NAME employeeCTVName, tbl.PHONE_NUMBER employeeCTVPhone, ")
                .append("tbl.TAX_CODE taxCode, tbl.ADDRESS address, tbl.CONTRACT_CODE contractCode, tbl.TAX_CODE_USER taxCodeUser, tbl.ACCOUNT_NUMBER accountNumber, tbl.OCCUPATION occupation, tbl.BANK bank, tbl.BANK_BRANCH bankBranch, tbl.COMPANY_PARTNER companyPartner, tbl.CREATED_DATE createdDate ")
                .append("from tbl ")
                .append("LEFT join ql on ql.SYS_USER_ID = tbl.PARENT_USER_ID ");

        sql.append(groupBy);
        sql.append("order by tbl.PROVINCE_CODE ");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (criteria.getAreaId() != null) {
            query.setParameter("areaId", criteria.getAreaId());
            queryCount.setParameter("areaId", criteria.getAreaId());
        }
        if (criteria.getSysGroupId() != null) {
            query.setParameter("sysGroupId", criteria.getSysGroupId());
            queryCount.setParameter("sysGroupId", criteria.getSysGroupId());
        }
        if (criteria.getDateFrom() != null) {
            query.setParameter("dateFrom", criteria.getDateFrom());
            queryCount.setParameter("dateFrom", criteria.getDateFrom());
        }
        if (criteria.getDateTo() != null) {
            query.setParameter("dateTo", criteria.getDateTo());
            queryCount.setParameter("dateTo", criteria.getDateTo());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpSynthesisGenCodeForChannelDTO.class));

        query.addScalar("provinceCode", new StringType());
        query.addScalar("sysGroupName", new StringType());
        query.addScalar("sysUserCode", new StringType());
        query.addScalar("sysUserName", new StringType());
        query.addScalar("sysUserPhone", new StringType());
        query.addScalar("employeeCTVCode", new StringType());
        query.addScalar("employeeCTVName", new StringType());
        query.addScalar("employeeCTVPhone", new StringType());
        query.addScalar("taxCode", new StringType());
        query.addScalar("address", new StringType());
        query.addScalar("contractCode", new StringType());
        query.addScalar("taxCodeUser", new StringType());
        query.addScalar("accountNumber", new StringType());
        query.addScalar("bank", new StringType());
        query.addScalar("bankBranch", new StringType());
        query.addScalar("companyPartner", new StringType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("occupation", new StringType());

        if (criteria.getPage() != null && criteria.getPageSize() != null) {
            query.setFirstResult((criteria.getPage().intValue() - 1) * criteria.getPageSize());
            query.setMaxResults(criteria.getPageSize());
        }

        criteria.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }
}

