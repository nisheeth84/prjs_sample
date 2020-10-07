package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOSurveyCustomerBO;
import com.viettel.aio.bo.AIOSurveyCustomerDetailBO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@EnableTransactionManagement
@Transactional
@Repository("aioSurveyCustomerDAO")
public class AIOSurveyCustomerDAO extends BaseFWDAOImpl<AIOSurveyCustomerBO, Long> {

    static Logger LOGGER = LoggerFactory.getLogger(AIOSurveyCustomerDAO.class);

    public AIOSurveyCustomerDAO() {
        this.model = new AIOSurveyCustomerBO();
    }

    public AIOSurveyCustomerDAO(Session session) {
        this.session = session;
    }

    public void updateAioSurveyCustomer(Long performerId, Long surveyId,Long surveyCustomerId, AIOCustomerDTO customerDTO){
        String sql="update AIO_SURVEY_CUSTOMER set customer_id=:cusId,customer_name=:cusName,customer_address=:cusAddr,customer_phone=:cusPhone,customer_email=:cusEmail" +
                ",status=3,end_date=sysdate where survey_id=:survey_id and performer_id=:perId and aio_survey_customer_id=:scId";

        SQLQuery query=this.getSession().createSQLQuery(sql);
        query.setParameter("scId",surveyCustomerId);
        query.setParameter("survey_id",surveyId);
        query.setParameter("perId",performerId);
        query.setParameter("cusId",customerDTO.getCustomerId());
        query.setParameter("cusName",customerDTO.getName());
        query.setParameter("cusAddr",customerDTO.getAddress());
        query.setParameter("cusPhone",customerDTO.getPhone());
        query.setParameter("cusEmail",customerDTO.getEmail());

        query.executeUpdate();

    }

    public void saveSurveyCustomerDetail(Long performerId, Long surveyId,Long surveyCustomerId, List<AIOQuestionDTO> questionDTOs){
        Query query=this.getSession().createQuery("from AIOSurveyCustomerBO where performerId=:performerId and surveyId=:surveyId and aio_survey_customer_id=:scId ");
        query.setParameter("performerId",performerId);
        query.setParameter("surveyId",surveyId);
        query.setParameter("scId",surveyCustomerId);

        List<AIOSurveyCustomerBO> customerBOS=query.list();

        if (customerBOS!=null&&!customerBOS.isEmpty()){
            AIOSurveyCustomerDetailBO customerDetailBO=null;
            for (AIOSurveyCustomerBO customerBO:customerBOS){
                for (AIOQuestionDTO questionDTO:questionDTOs){
                    customerDetailBO=new AIOSurveyCustomerDetailBO();

                    if(null!=questionDTO.getAnswer1()&&!"".equals(questionDTO.getAnswer1())){
                        customerDetailBO.setAioSurveyCustomerId(customerBO.getAioSurveyCustomerId());
                        customerDetailBO.setQuestionId(questionDTO.getQuestionId());
                        customerDetailBO.setType(questionDTO.getType());
                        customerDetailBO.setAnswer(questionDTO.getAnswer1());

                        this.getSession().save(customerDetailBO);
                    }
                }
            }
        }

    }
}
