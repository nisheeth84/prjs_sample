package com.viettel.aio.api;

import com.viettel.aio.request.RequestMsg;
import com.viettel.aio.request.survey.RequestSurveyCustomer;
import com.viettel.aio.response.ResponseMsg;
import com.viettel.aio.service.survey.AIOSurveyCustomerService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})

public class AIOApiSurveyCustomer  {

    @Autowired
    AIOSurveyCustomerService surveyCustomerService;

    @POST
    @Path(value = "/aio_api_survey")
    public ResponseMsg apiPost(RequestMsg<RequestSurveyCustomer> requestMsg){

        try {
            return surveyCustomerService.doAction(requestMsg);
        }catch (Exception e){
            ResponseMsg responseMsg=new ResponseMsg();
            responseMsg.setStatus(500);
            responseMsg.setMessage(e.toString());
            return responseMsg;
        }

    }



}
