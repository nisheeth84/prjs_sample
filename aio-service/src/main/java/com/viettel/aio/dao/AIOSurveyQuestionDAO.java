package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.aio.bo.AIOSurveyQuestionBO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

//VietNT_20190313_create
@EnableTransactionManagement
@Transactional
@Repository("aioSurveyQuestionDAO")
public class AIOSurveyQuestionDAO extends BaseFWDAOImpl<AIOSurveyQuestionBO, Long> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOSurveyQuestionDAO.class);

    public AIOSurveyQuestionDAO() {
        this.model = new AIOSurveyQuestionBO();
    }

    public AIOSurveyQuestionDAO(Session session) {
        this.session = session;
    }

    public <T extends ComsBaseFWDTO> void setPageSize(T obj, SQLQuery query, SQLQuery queryCount) {
        if (obj.getPage() != null && obj.getPageSize() != null) {
            query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize());
            query.setMaxResults(obj.getPageSize());
        }

        obj.setTotalRecord(((BigDecimal) queryCount.uniqueResult()).intValue());
    }
//    public List<AIOSurveyDTO> doSearch(AIOSurveyDTO obj) {
//
//
//        boolean queryEndDate = false;
//        String conditionEndDate = StringUtils.EMPTY;
//        String joinAR = StringUtils.EMPTY;
//        String tempTable = StringUtils.EMPTY;
//
//
//        StringBuilder builder = new StringBuilder();
//        builder.append("SELECT ");
//        builder.append(" AIO_SURVEY_ID surveyId,");
//        builder.append(" SURVEY_CONTENT surveyContent,");
//        builder.append(" START_DATE startDate,");
//        builder.append(" END_DATE endDate,");
//        builder.append(" NUMBER_CUSTOMER_SURVEY numberCustomSurvey,");
//        builder.append(" STATUS status,");
//        builder.append(" CREATED_DATE createdDate,");
//        builder.append(" CREATED_USER createdUser,");
//        builder.append(" FULL_NAME createdUserName,");
//        builder.append(" UPDATED_DATE updatedDate,");
//        builder.append(" UPDATED_USER updatedUser");
//        builder.append(" FROM AIO_SURVEY LEFT JOIN USERS ON AIO_SURVEY.CREATED_USER = USERS.USER_ID");
//        //coditions
//        builder.append(" WHERE STATUS = "+obj.getStatus());
//        if(StringUtils.isNotEmpty(obj.getKeySearch()))
//            builder.append(" AND UPPER(SURVEY_CONTENT) LIKE UPPER("+obj.getKeySearch()+")");
//        if(obj.getStartDate()!=null){
//            //Date date = Calendar.getInstance().getTime();
//            DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
//            String strDate = dateFormat.format(obj.getStartDate());
//            builder.append(" AND AIO_SURVEY.START_DATE >= '"+strDate+"'");
//
//        }
//        if(obj.getEndDate()!=null){
//            DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
//            String strDate = dateFormat.format(obj.getEndDate());
//            builder.append(" AND AIO_SURVEY.END_DATE <= '"+strDate+"'");
//        }
//        //
//        SQLQuery query = this.getSession().createSQLQuery(builder.toString());
//        SQLQuery queryCount = this.getSession().createSQLQuery("SELECT COUNT(*) FROM (" + builder.toString() + ")");
//        query.setResultTransformer(Transformers.aliasToBean(AIOSurveyDTO.class));
//        query.addScalar("surveyId", new LongType());
//        query.addScalar("surveyContent", new StringType());
//        query.addScalar("startDate", new DateType());
//        query.addScalar("endDate", new DateType());
//        query.addScalar("numberCustomSurvey", new LongType());
//        query.addScalar("status", new LongType());
//        query.addScalar("createdDate",new DateType());
//        query.addScalar("createdUser", new LongType());
//        query.addScalar("createdUserName", new StringType());
//        query.addScalar("updatedDate", new DateType());
//        query.addScalar("updatedUser",new LongType());
//        this.setPageSize(obj,query, queryCount);
//        return  query.list();
//    }

//    public Long doDelete(AIOSurveyDTO obj){
//        try{
//            String strsql = "UPDATE AIO_SURVEY SET STATUS = 0 WHERE AIO_SURVEY_ID ="+obj.getSurveyId();
//            SQLQuery query = this.getSession().createSQLQuery(strsql);
//            int res = query.executeUpdate();
//            return Long.valueOf(res);
//
//
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            throw e ;
//        }
//    }


}
