package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.aio.dto.*;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.dto.SysUserDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.object.SqlQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioSurveyDAO")
public class AIOSurveyDAO extends BaseFWDAOImpl<AIOSurveyBO, Long> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOSurveyDAO.class);

    public AIOSurveyDAO() {
        this.model = new AIOSurveyBO();
    }

    public AIOSurveyDAO(Session session) {
        this.session = session;
    }

    private static final String HIBERNATE_ESCAPE_CHAR = "\\";
    private static final Integer STATUS_NOT_PROCESSED_YET = 1;

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }

    public List<AIOSurveyDTO> doSearch(AIOSurveyDTO obj) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");
        sql.append(" s.AIO_SURVEY_ID surveyId,");
        sql.append(" s.SURVEY_CONTENT surveyContent,");
        sql.append(" s.START_DATE startDate,");
        sql.append(" s.END_DATE endDate,");
        sql.append(" s.NUMBER_CUSTOMER_SURVEY numberCustomerSurvey,");
        sql.append(" s.STATUS status,");
        sql.append(" s.CREATED_DATE createdDate,");
        sql.append(" s.CREATED_USER createdUser,");
        sql.append(" u.FULL_NAME || ' (' || SUBSTR(u.EMAIL, 0, INSTR(u.EMAIL, '@') - 1) || ')' createdUserName,");
        sql.append(" s.UPDATED_DATE updatedDate,");
        sql.append(" s.UPDATED_USER updatedUser");
        sql.append(" FROM AIO_SURVEY s LEFT OUTER JOIN SYS_USER u ON s.CREATED_USER = u.SYS_USER_ID");
        //coditions
        sql.append(" WHERE 1 = 1");
        if (obj.getStatus() != null) {
            sql.append(" AND s.STATUS = :status");
        }

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql.append(" AND UPPER(s.SURVEY_CONTENT) LIKE UPPER(:keySearch)  escape '&'");
        }
        if (obj.getEndDate() != null) {
            sql.append(" AND TRUNC(s.END_DATE) <= TRUNC(:endDate)");
        }
        if (obj.getStartDate() != null) {
            sql.append(" AND TRUNC(s.START_DATE) >= TRUNC(:startDate)");
        }
        if (StringUtils.isNotEmpty(obj.getCreatedUserName())) {
            sql.append(" AND ( UPPER(u.FULL_NAME) LIKE UPPER(:createdUserName)  escape '&'");
            sql.append(" OR  UPPER(u.EMAIL) LIKE UPPER(:createdUserName)  escape '&')");
        }
        sql.append(" ORDER BY s.AIO_SURVEY_ID DESC");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql.toString() + ")");
        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch()) + "%");
            queryCount.setParameter("keySearch", "%" + ValidateUtils.validateKeySearch(obj.getKeySearch())  + "%");
        }
        if (obj.getStartDate() != null) {
            query.setParameter("startDate", obj.getStartDate());
            queryCount.setParameter("startDate", obj.getStartDate());
        }
        if (obj.getEndDate() != null) {
            query.setParameter("endDate", obj.getEndDate());
            queryCount.setParameter("endDate", obj.getEndDate());
        }
        if (StringUtils.isNotEmpty(obj.getCreatedUserName())) {
            query.setParameter("createdUserName", "%" + ValidateUtils.validateKeySearch(obj.getCreatedUserName()) + "%");
            queryCount.setParameter("createdUserName", "%" + ValidateUtils.validateKeySearch(obj.getCreatedUserName())  + "%");
        }

        query.setResultTransformer(Transformers.aliasToBean(AIOSurveyDTO.class));
        query.addScalar("surveyId", new LongType());
        query.addScalar("surveyContent", new StringType());
        query.addScalar("startDate", new DateType());
        query.addScalar("endDate", new DateType());
        query.addScalar("numberCustomerSurvey", new LongType());
        query.addScalar("status", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdUserName", new StringType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("updatedUser", new LongType());
        this.setPageSize(obj, query, queryCount);
        return query.list();
    }

    public Long doDelete(AIOSurveyDTO obj) {
        try {
            String strsql = "UPDATE AIO_SURVEY SET STATUS = 0 WHERE AIO_SURVEY_ID =" + obj.getSurveyId();
            SQLQuery query = this.getSession().createSQLQuery(strsql);
            int res = query.executeUpdate();
            return Long.valueOf(res);


        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<AIOQuestionDTO> getQuestions(Long surveyId) {
        StringBuilder sql = new StringBuilder("SELECT");
        sql.append("  q.AIO_QUESTION_ID questionId ");
        sql.append(" ,q.TYPE type ");
        sql.append(" ,q.QUESTION_CONTENT questionContent ");
        sql.append(" ,q.ANSWER1 answer1 ");
        sql.append(" ,q.ANSWER2 answer2 ");
        sql.append(" ,q.ANSWER3 answer3 ");
        sql.append(" ,q.ANSWER4 answer4 ");
        sql.append(" ,q.ANSWER5 answer5 ");
        sql.append(" ,q.STATUS status ");
        sql.append(" FROM AIO_QUESTION q ");
        sql.append(" INNER JOIN AIO_SURVEY_QUESTION sq ON q.AIO_QUESTION_ID = sq.QUESTION_ID ");
        sql.append(" WHERE 1 = 1 ");
        sql.append(" AND sq.SURVEY_ID = :surveyId");

        SQLQuery query = this.getSession().createSQLQuery(sql.toString());

        query.setParameter("surveyId", surveyId);

        query.setResultTransformer(Transformers.aliasToBean(AIOQuestionDTO.class));
        query.addScalar("questionId", new LongType());
        query.addScalar("type", new IntegerType());
        query.addScalar("questionContent", new StringType());
        query.addScalar("answer1", new StringType());
        query.addScalar("answer2", new StringType());
        query.addScalar("answer3", new StringType());
        query.addScalar("answer4", new StringType());
        query.addScalar("answer5", new StringType());
        query.addScalar("status", new IntegerType());

        return query.list();
    }

    public List<AIOSurveyCustomerDTO> getPerformers(List<Long> surveyIds) {
        StringBuilder sql = new StringBuilder("SELECT");
        sql.append("  sc.PERFORMER_ID performerId ");
        sql.append(" ,sc.SURVEY_ID surveyId ");
        sql.append(" ,u.FULL_NAME performerName");
        sql.append(" ,u.EMPLOYEE_CODE performerCode");
        sql.append(" ,TO_NUMBER((substr(sg.PATH, INSTR(sg.PATH, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 2 + 1) - (INSTR(sg.PATH, '/', 1, 2) + 1)))) sysGroupLv2Id");
        sql.append(" ,sg.GROUP_NAME_LEVEL2 sysGroupLv2Name");
        sql.append(" FROM AIO_SURVEY_CUSTOMER sc, SYS_USER u, SYS_GROUP sg");
        sql.append(" WHERE sc.SURVEY_ID IN (:surveyIds) ");
        sql.append("     AND sg.SYS_GROUP_ID = u.SYS_GROUP_ID");
        sql.append("     AND sc.PERFORMER_ID  = u.SYS_USER_ID");
        sql.append(" GROUP BY sc.PERFORMER_ID, sc.SURVEY_ID, u.FULL_NAME, u.EMPLOYEE_CODE, sg.PATH, sg.GROUP_NAME_LEVEL2");
        SQLQuery query = this.getSession().createSQLQuery(sql.toString());
        query.setParameterList("surveyIds", surveyIds);

        query.setResultTransformer(Transformers.aliasToBean(AIOSurveyCustomerDTO.class));
        query.addScalar("performerId", new LongType());
        query.addScalar("surveyId", new LongType());
        query.addScalar("performerId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("sysGroupLv2Id", new LongType());
        query.addScalar("sysGroupLv2Name", new StringType());

        return query.list();
    }

    public void removeQuestions(Long surveyId) {
        String sql = "DELETE AIO_SURVEY_QUESTION WHERE SURVEY_ID = :surveyId";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("surveyId", surveyId);
        query.executeUpdate();
    }

    public void removeSurveyCustomer(Long surveyId) {
        String sql = "DELETE AIO_SURVEY_CUSTOMER WHERE SURVEY_ID = :surveyId";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("surveyId", surveyId);
        query.executeUpdate();
    }

    public List<AIOSurveyCustomerDTO> getNewPerformersByCodes(List<String> employeeCodes) {
        String sql = "SELECT u.SYS_USER_ID performerId " +
                " ,u.FULL_NAME performerName" +
                " ,u.EMPLOYEE_CODE performerCode" +
                " ,TO_NUMBER((substr(sg.PATH, INSTR(sg.PATH, '/', 1, 2) + 1, INSTR(sg.path, '/', 1, 2 + 1) - (INSTR(sg.PATH, '/', 1, 2) + 1)))) sysGroupLv2Id" +
                " ,sg.GROUP_NAME_LEVEL2 sysGroupLv2Name" +
                " FROM SYS_USER u, SYS_GROUP sg  " +
                " WHERE  sg.SYS_GROUP_ID = u.SYS_GROUP_ID " +
                "     AND u.EMPLOYEE_CODE IN (:codes) " +
                "     AND u.STATUS = 1";
        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameterList("codes", employeeCodes);

        query.setResultTransformer(Transformers.aliasToBean(AIOSurveyCustomerDTO.class));

        query.addScalar("performerId", new LongType());
        query.addScalar("performerName", new StringType());
        query.addScalar("performerCode", new StringType());
        query.addScalar("sysGroupLv2Id", new LongType());
        query.addScalar("sysGroupLv2Name", new StringType());
        return query.list();
    }

    public List<AIOSurveyDTO> getAioSurvey(Long performerId){

        String sql="select ac.AIO_SURVEY_CUSTOMER_ID as surveyCustomerId ,s.AIO_SURVEY_ID surveyId,s.START_DATE startDate,s.END_DATE endDate,s.SURVEY_CONTENT surveyContent" +
                " from AIO_SURVEY_CUSTOMER ac inner join AIO_SURVEY s on ac.SURVEY_ID=s.AIO_SURVEY_ID " +
                " where ac.PERFORMER_ID=:performerId and sysdate>= s.START_DATE and sysdate<= s.END_DATE+3 and s.status=1 and ac.status in(1,2) order by s.start_date";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        query.setParameter("performerId",performerId);

        query.addScalar("surveyCustomerId", new LongType());
        query.addScalar("surveyId", new LongType());
        query.addScalar("startDate",new DateType() );
        query.addScalar("endDate", new DateType());
        query.addScalar("surveyContent", new StringType());
        query.setResultTransformer(Transformers.aliasToBean(AIOSurveyDTO.class));
        return query.list();
    }



}
