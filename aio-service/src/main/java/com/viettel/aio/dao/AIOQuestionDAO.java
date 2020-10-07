package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOQuestionBO;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import com.viettel.wms.utils.ValidateUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioQuestionDAO")
public class AIOQuestionDAO extends BaseFWDAOImpl<AIOQuestionBO, Long> {

    public List<AIOQuestionDTO> doSearch(AIOQuestionDTO obj) {

        String sql = "SELECT " +
                "  q.AIO_QUESTION_ID questionId " +
                " ,q.TYPE type " +
                " ,q.QUESTION_CONTENT questionContent " +
                " ,q.ANSWER1 answer1 " +
                " ,q.ANSWER2 answer2 " +
                " ,q.ANSWER3 answer3 " +
                " ,q.ANSWER4 answer4 " +
                " ,q.ANSWER5 answer5 " +
                " ,q.STATUS status " +
                " ,q.CREATED_USER createdUser " +
                " ,q.CREATED_DATE createdDate " +
                " ,q.UPDATED_USER updatedUser " +
                " ,q.UPDATED_DATE updatedDate " +
                " ,u.FULL_NAME || ' (' || SUBSTR(u.EMAIL, 0, INSTR(u.EMAIL, '@') - 1) || ')' createdUserName " +
                " FROM AIO_QUESTION q LEFT JOIN SYS_USER u ON (q.CREATED_USER = u.SYS_USER_ID) " +
                " WHERE 1 = 1";

        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            sql += " AND (upper(UTL_I18N.UNESCAPE_REFERENCE(regexp_replace(q.QUESTION_CONTENT, '<.*?>'))) like '%' || upper(:keySearch) || '%' escape '&') ";
        }
        if (obj.getStatus() != null) {
            sql += " AND q.STATUS = :status ";
        }
        if (obj.getType() != null) {
            sql += " AND q.TYPE = :type ";
        }
        if (StringUtils.isNotEmpty(obj.getCreatedUserName())) {
            sql += " AND ( upper(u.FULL_NAME) like '%' || upper(:createdUserName)  || '%' escape '&' ";
            sql += " OR upper(u.EMAIL) like '%' || upper(:createdUserName)  || '%' escape '&' ";
            sql += " OR upper(u.EMPLOYEE_CODE) like '%' || upper(:createdUserName)  || '%' escape '&' )";
        }
        sql += " ORDER BY q.AIO_QUESTION_ID DESC ";

        SQLQuery query = this.getSession().createSQLQuery(sql);
        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + sql + ")");


        if (StringUtils.isNotEmpty(obj.getKeySearch())) {
            query.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch()));
            queryCount.setParameter("keySearch", ValidateUtils.validateKeySearch(obj.getKeySearch()));
        }
        if (obj.getStatus() != null) {
            query.setParameter("status", obj.getStatus());
            queryCount.setParameter("status", obj.getStatus());
        }
        if (obj.getType() != null) {
            query.setParameter("type", obj.getType());
            queryCount.setParameter("type", obj.getType());
        }
        if (StringUtils.isNotEmpty(obj.getCreatedUserName())) {
            query.setParameter("createdUserName", obj.getCreatedUserName());
            queryCount.setParameter("createdUserName", obj.getCreatedUserName());
        }
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
        query.addScalar("createdUser", new LongType());
        query.addScalar("createdDate", new DateType());
        query.addScalar("updatedUser", new LongType());
        query.addScalar("updatedDate", new DateType());
        query.addScalar("createdUserName", new StringType());

        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());

        return query.list();
    }

    public void updateStatus(Long questionId, Integer status, Long userId) {
        String sql = "UPDATE AIO_QUESTION SET " +
                " STATUS = :status " +
                " ,UPDATED_USER = :userId" +
                " ,UPDATED_DATE = SYSDATE" +
                " WHERE AIO_QUESTION_ID = :questionId";

        SQLQuery query = this.getSession().createSQLQuery(sql);

        query.setParameter("questionId", questionId);
        query.setParameter("status", status);
        query.setParameter("userId", userId);

        query.executeUpdate();
    }

    public List<AIOQuestionDTO> getQuestion(Long surveyId){
        String sql="select aq.AIO_QUESTION_ID as questionId,aq.TYPE as type " +
                ",aq.QUESTION_CONTENT as questionContent,aq.ANSWER1 as answer1,aq.ANSWER2 as answer2,aq.ANSWER3 as answer3,aq.ANSWER4 as answer4,aq.ANSWER5 answer5 " +
                " from AIO_SURVEY_QUESTION sq inner join AIO_QUESTION aq on sq.QUESTION_ID=aq.AIO_QUESTION_ID where sq.SURVEY_ID=:surveyId";

        SQLQuery query=this.getSession().createSQLQuery(sql);

        query.setParameter("surveyId",surveyId);

        query.addScalar("questionId",new LongType());
        query.addScalar("type",new IntegerType());
        query.addScalar("questionContent",new StringType());
        query.addScalar("answer1",new StringType());
        query.addScalar("answer2",new StringType());
        query.addScalar("answer3",new StringType());
        query.addScalar("answer4",new StringType());
        query.addScalar("answer5",new StringType());

        query.setResultTransformer(Transformers.aliasToBean(AIOQuestionDTO.class));

        return query.list();
    }
}
