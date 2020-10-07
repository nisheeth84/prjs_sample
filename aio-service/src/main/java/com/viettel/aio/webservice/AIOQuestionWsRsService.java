package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOSurveyBusinessImpl;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.aio.dto.QuestionForCustomerDTO;
import com.viettel.aio.response.ResponseMsg;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOQuestionWsRsService {
    private Logger LOGGER = Logger.getLogger(AIOQuestionWsRsService.class);

    @Autowired
    AIOSurveyBusinessImpl aioSurveyBusiness;

    //lay danh sach thong tin doi khao sat
    @POST
    @Path("/getSurveyCustomer/")
    public ResponseMsg getAioSurveyCustomer(AIOContractMobileRequest request){
        ResponseMsg responseMsg=new ResponseMsg<List<AIOSurveyDTO>>();

        try {
            List<AIOSurveyDTO> aioSurveyDTOS = aioSurveyBusiness.getAioSurveyCustomer(request.getSysUserId());
            responseMsg.setStatus(200);
            responseMsg.setMessage("success");
            responseMsg.setData(aioSurveyDTOS == null ? new ArrayList<>() : aioSurveyDTOS);
        } catch (Exception e) {
            responseMsg.setStatus(500);
            responseMsg.setMessage(e.getMessage());
        }
        return responseMsg;
    }

    //lay danh sach cau hoi khao sat
    @POST
    @Path("/getQuestionCustomer/")
    public ResponseMsg getAioQuestionForCustomer(AIOContractMobileRequest request){
        ResponseMsg responseMsg=new ResponseMsg<QuestionForCustomerDTO>();
        QuestionForCustomerDTO questionForCustomerDTO=aioSurveyBusiness.getQuestionForCustomer(request.getSysUserId(),request.getSurveyId());
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

    //hoan thanh cau hoi khao sat
    @POST
    @Path("/completeQuestionCustomer/")
    public ResponseMsg aioCompleteQuestion(AIOContractMobileRequest request){
        ResponseMsg responseMsg=new ResponseMsg<>();
        try {
            aioSurveyBusiness.updateQuestionForCustomer(request.getSysGroupId(),request.getSysUserId(),request.getSurveyId(),request.getSurveyCustomerId()
                    ,request.getQuestionForCustomerDTO().getAioCustomers().get(0),request.getQuestionForCustomerDTO().getAioQuestions());
            responseMsg.setStatus(200);
            responseMsg.setMessage("success");
        }catch (Exception e){
            responseMsg.setStatus(500);
            responseMsg.setMessage(e.toString());
        }

        return responseMsg;

    }
}
