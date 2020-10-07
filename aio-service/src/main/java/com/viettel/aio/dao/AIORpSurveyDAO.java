package com.viettel.aio.dao;

import com.viettel.aio.dto.report.AIORpSurveyDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by HaiND on 9/26/2019 12:14 AM.
 */
@EnableTransactionManagement
@Transactional
@Repository("aioRpSurveyDAO")
public class AIORpSurveyDAO extends BaseFWDAOImpl<BaseFWModelImpl, Long> {

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIORpSurveyDTO> doSearchSurvey(AIORpSurveyDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("select * from (select su.AIO_SURVEY_ID surveyId, su.SURVEY_CONTENT text, su.CREATED_USER createdUser, su.START_DATE startDate, ")
                .append("su.END_DATE endDate, su.NUMBER_CUSTOMER_SURVEY numberCustomerExpect, count(cu.CUSTOMER_ID) numberCustomerActual ")
                .append("from AIO_SURVEY su left outer join AIO_SURVEY_CUSTOMER cu on su.AIO_SURVEY_ID = cu.SURVEY_ID ")
                .append("where su.STATUS = 1 ");
        if (StringUtils.isNotEmpty(dto.getSurveyText())) {
            sql.append("and upper(su.SURVEY_CONTENT) LIKE upper(:keySearch) escape '&' ");
        }
        sql.append("group by su.AIO_SURVEY_ID, su.SURVEY_CONTENT, su.CREATED_USER, su.START_DATE, su.END_DATE, su.NUMBER_CUSTOMER_SURVEY) ")
                .append("where ROWNUM <=10");

        SQLQuery query = getSession().createSQLQuery(sql.toString());
        if (StringUtils.isNotEmpty(dto.getSurveyText())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(dto.getSurveyText()) + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpSurveyDTO.class));
        query.addScalar("surveyId", new LongType());
        query.addScalar("text", new StringType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("numberCustomerExpect", new LongType());
        query.addScalar("numberCustomerActual", new LongType());

        return query.list();
    }

    public List<AIORpSurveyDTO> doSearch(AIORpSurveyDTO dto) {
        StringBuilder sql = new StringBuilder()
                .append("with tbl as (")
                .append("select  q.QUESTION_CONTENT, q.ANSWER1, q.ANSWER2, q.ANSWER3, q.ANSWER4, q.ANSWER5, ")
                .append("sum(case when  scd.ANSWER is not null then 1 else 0 end) SKH_KS, ")
                .append("sum(case when  scd.ANSWER = 1 then 1 else 0 end) SKH_A, ")
                .append("sum(case when  scd.ANSWER = 2 then 1 else 0 end) SKH_B, ")
                .append("sum(case when  scd.ANSWER = 3 then 1 else 0 end) SKH_C, ")
                .append("sum(case when  scd.ANSWER = 4 then 1 else 0 end) SKH_D, ")
                .append("sum(case when  scd.ANSWER = 5 then 1 else 0 end) SKH_E ")
                .append("from AIO_SURVEY su ")
                .append("LEFT join AIO_SURVEY_QUESTION sq  on su.AIO_SURVEY_ID = sq.SURVEY_ID ")
                .append("LEFT join AIO_SURVEY_CUSTOMER sc on sc.SURVEY_ID = su.AIO_SURVEY_ID ")
                .append("LEFT join AIO_SURVEY_CUSTOMER_DETAIL scd on sc.AIO_SURVEY_CUSTOMER_ID = scd.AIO_SURVEY_CUSTOMER_ID ")
                .append("LEFT join AIO_QUESTION q on scd.QUESTION_ID = q.AIO_QUESTION_ID ")
                .append("LEFT join SYS_USER us on sc.PERFORMER_ID = us.SYS_USER_ID ")
                .append("LEFT join SYS_GROUP sg on sg.SYS_GROUP_ID = us.SYS_GROUP_ID ")
                .append("where q.TYPE = 1 ");
        if (dto.getSurveyId() != null) {
            sql.append("and su.AIO_SURVEY_ID = :surveyId ");
        }
        if (dto.getSysGroupId() != null) {
            sql.append("and sg.PARENT_ID = :sysGroup ");
        }
        sql.append("group by q.QUESTION_CONTENT, q.ANSWER1, q.ANSWER2, q.ANSWER3, q.ANSWER4, q.ANSWER5) ")
                .append("select QUESTION_CONTENT contentSurvey, ")
                .append("ANSWER1 contentAnswerA, round(decode(SKH_KS,0,0,100*SKH_A/SKH_KS),2) percentAnswerA, ")
                .append("ANSWER2 contentAnswerB, round(decode(SKH_KS,0,0,100*SKH_B/SKH_KS),2) percentAnswerB, ")
                .append("ANSWER3 contentAnswerC, round(decode(SKH_KS,0,0,100*SKH_C/SKH_KS),2) percentAnswerC, ")
                .append("ANSWER4 contentAnswerD, round(decode(SKH_KS,0,0,100*SKH_D/SKH_KS),2) percentAnswerD, ")
                .append("ANSWER5 contentAnswerE, round(decode(SKH_KS,0,0,100*SKH_E/SKH_KS),2) percentAnswerE ")
                .append("from tbl");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");

        if (dto.getSurveyId() != null) {
            query.setParameter("surveyId", dto.getSurveyId());
            queryCount.setParameter("surveyId", dto.getSurveyId());
        }
        if (dto.getSysGroupId() != null) {
            query.setParameter("sysGroup", dto.getSysGroupId());
            queryCount.setParameter("sysGroup", dto.getSysGroupId());
        }

        query.setResultTransformer(Transformers.aliasToBean(AIORpSurveyDTO.class));
        query.addScalar("contentSurvey", new StringType());
        query.addScalar("contentAnswerA", new StringType());
        query.addScalar("contentAnswerB", new StringType());
        query.addScalar("contentAnswerC", new StringType());
        query.addScalar("contentAnswerD", new StringType());
        query.addScalar("contentAnswerE", new StringType());
        query.addScalar("percentAnswerA", new DoubleType());
        query.addScalar("percentAnswerB", new DoubleType());
        query.addScalar("percentAnswerC", new DoubleType());
        query.addScalar("percentAnswerD", new DoubleType());
        query.addScalar("percentAnswerE", new DoubleType());

        this.setPageSize(dto, query, queryCount);

        return query.list();
    }
}
