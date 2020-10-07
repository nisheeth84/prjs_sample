package com.viettel.aio.service.survey;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.aio.business.AIOContractManagerBusinessImpl;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dao.AIOCustomerDAO;
import com.viettel.aio.dao.AIOQuestionDAO;
import com.viettel.aio.dao.AIOSurveyCustomerDAO;
import com.viettel.aio.dao.AIOSurveyDAO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.aio.dto.QuestionForCustomerDTO;
import com.viettel.aio.request.RequestMsg;
import com.viettel.aio.request.survey.RequestSurveyCustomer;
import com.viettel.aio.response.ResponseMsg;
import com.viettel.aio.service.AIOServiceBase;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
@Service("surveyCustomerService")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOSurveyCustomerService implements AIOServiceBase {

    @Autowired
    public AIOSurveyCustomerService(AIOSurveyDAO aioSurveyDAO, AIOCustomerDAO aioCustomerDAO,
                                    AIOQuestionDAO aioQuestionDAO, AIOSurveyCustomerDAO surveyCustomerDAO,
                                    AIOContractManagerBusinessImpl aioContractManagerBusiness,
                                    CommonServiceAio commonService) {
        this.aioSurveyDAO = aioSurveyDAO;
        this.aioCustomerDAO = aioCustomerDAO;
        this.aioQuestionDAO = aioQuestionDAO;
        this.surveyCustomerDAO = surveyCustomerDAO;
        this.aioContractManagerBusiness = aioContractManagerBusiness;
        this.commonService = commonService;
    }

    private AIOSurveyDAO aioSurveyDAO;
    private AIOCustomerDAO aioCustomerDAO;
    private AIOQuestionDAO aioQuestionDAO;
    private AIOSurveyCustomerDAO surveyCustomerDAO;
    private AIOContractManagerBusinessImpl aioContractManagerBusiness;
    private CommonServiceAio commonService;

    private final String ATTACHMENT_TYPE = "103";

    @Override
    public ResponseMsg doAction(RequestMsg requestMsg) throws Exception {

        switch (requestMsg.getServiceCode()){
            case "LIST_SURVEY":{
                return getSurveyCustomer(requestMsg);
            }case "LIST_SURVEY_QUESTION":{
                return  getQuestionForCustomer(requestMsg);
            }case "SURVEY_COMPLETE_QUESTION":{
                return completeQuestionCustomer(requestMsg);
            }
        }

        return null;
    }


    private ResponseMsg getSurveyCustomer(RequestMsg requestMsg){
        ResponseMsg responseMsg=new ResponseMsg<List<AIOSurveyDTO>>();

        RequestSurveyCustomer requestSurveyCustomer=(RequestSurveyCustomer) requestMsg.getData();

        List<AIOSurveyDTO> aioSurveyDTOS=aioSurveyDAO.getAioSurvey(requestSurveyCustomer.getSysUserId());

        if(aioSurveyDTOS!=null&&!aioSurveyDTOS.isEmpty()){
            responseMsg.setStatus(200);
            responseMsg.setMessage("success");
            responseMsg.setData(aioSurveyDTOS);
        }else {
            responseMsg.setStatus(500);
            responseMsg.setMessage("error");
        }
        return responseMsg;
    }

    private ResponseMsg getQuestionForCustomer(RequestMsg requestMsg){

        ResponseMsg responseMsg=new ResponseMsg<List<AIOSurveyDTO>>();
        RequestSurveyCustomer requestSurveyCustomer=(RequestSurveyCustomer) requestMsg.getData();

        List<AIOQuestionDTO> aioQuestionDTOS=aioQuestionDAO.getQuestion(requestSurveyCustomer.getSysUserId());
        List<AIOCustomerDTO> aioCustomerDTOS=aioCustomerDAO.getListCustomer(requestSurveyCustomer.getSurveyId());

        for (AIOQuestionDTO question : aioQuestionDTOS) {
            List<UtilAttachDocumentDTO> images = commonService.getListImagesByIdAndType(Collections.singletonList(question.getQuestionId()), ATTACHMENT_TYPE);
            question.setImages(images);
        }
        QuestionForCustomerDTO questionForCustomerDTO=new QuestionForCustomerDTO();

        questionForCustomerDTO.setAioCustomers(aioCustomerDTOS);
        questionForCustomerDTO.setAioQuestions(aioQuestionDTOS);

        if(questionForCustomerDTO!=null){
            responseMsg.setStatus(200);
            responseMsg.setMessage("success");
            responseMsg.setData(questionForCustomerDTO);
        }else{
            responseMsg.setStatus(500);
            responseMsg.setMessage("error");
        }
        return responseMsg;
    }

    @Transactional
    ResponseMsg completeQuestionCustomer(RequestMsg requestMsg) throws Exception{

        RequestSurveyCustomer requestSurveyCustomer=(RequestSurveyCustomer) requestMsg.getData();

        AIOCustomerDTO customerDTO=requestSurveyCustomer.getQuestionForCustomerDTO().getAioCustomers().get(0);

        AIOCustomerBO customerBO=aioCustomerDAO.checkExistCustomer(customerDTO);
        if(customerBO==null){
            //tao khach hang
            customerDTO=aioContractManagerBusiness.createNewCustomer(customerDTO,requestSurveyCustomer.getSysUserId(),requestSurveyCustomer.getSysGroupId());
        }else{
            customerDTO.setCustomerId(customerBO.getCustomerId());
        }

        surveyCustomerDAO.updateAioSurveyCustomer(requestSurveyCustomer.getSysUserId(),requestSurveyCustomer.getSurveyId(),requestSurveyCustomer.getSurveyCustomerId(),customerDTO);

        surveyCustomerDAO.saveSurveyCustomerDetail(requestSurveyCustomer.getSysUserId(),requestSurveyCustomer.getSurveyId(),requestSurveyCustomer.getSurveyCustomerId(),requestSurveyCustomer.getQuestionForCustomerDTO().getAioQuestions());


        ResponseMsg responseMsg=new ResponseMsg<>();
        responseMsg.setStatus(200);
        responseMsg.setMessage("success");

        return responseMsg;
    }
}
