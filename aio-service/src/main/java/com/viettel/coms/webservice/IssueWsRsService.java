package com.viettel.coms.webservice;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.business.IssueBusinessMbImpl;
import com.viettel.coms.dto.IssueDTOResponse;
import com.viettel.coms.dto.IssueRequest;
import com.viettel.coms.dto.IssueWorkItemDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-05-23
 */
@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class IssueWsRsService {
    private Logger LOGGER = Logger.getLogger(IssueWsRsService.class);

    @Autowired
    IssueBusinessMbImpl issueBusiness;

    /**
     * InitIssuePages
     *
     * @param request
     * @param issueBusiness
     * @return
     */
    @POST
    @Path("/getValueToInitIssuePages/")
    public IssueDTOResponse getValueToInitIssuePages(IssueRequest request) {
        IssueDTOResponse response = new IssueDTOResponse();

        // check process_feedback
        boolean isProcessFeedback = !issueBusiness.checkProcessFeedback(request).isEmpty();

        // check isGorvenor
        boolean isGorvenor = !issueBusiness.checkGovernor(request).isEmpty();

        if (isProcessFeedback) {
            // set Gorvenor
            response.setType(2l);

        } else if (isGorvenor) {
            // set process_feedback
            response.setType(1l);

        } else {
            response.setType(0l);
        }

        try {
            List<IssueWorkItemDTO> data = issueBusiness.getIssueItem(request, isGorvenor, isProcessFeedback);
            response.setListIssueEntityDTO(data);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }

    /**
     * updateIssue
     *
     * @param request
     * @return state
     */
    @POST
    @Path("/updateIssueItemDetail/")
    public IssueDTOResponse updateIssueItemDetail(IssueRequest request) {
        IssueDTOResponse response = new IssueDTOResponse();
        try {

            int result = issueBusiness.updateIssueItem(request);
            if (result > 0) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setType(request.getType());
                response.setResultInfo(resultInfo);
            } else if (result == -1) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Công trình hiện không có người quản lý ");
                response.setType(request.getType());
                response.setResultInfo(resultInfo);
            } else {

                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }

    /**
     * registerIssue
     *
     * @param request
     * @return state
     */
    @POST
    @Path("/registerIssueItemDetail/")
    public IssueDTOResponse registerIssueItemDetail(IssueRequest request) {
        IssueDTOResponse response = new IssueDTOResponse();
        try {
            int result = issueBusiness.registerIssueItemDetail(request);
            if (result > 0) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setType(request.getType());
                response.setResultInfo(resultInfo);
            } else if (result == -1) {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                resultInfo.setMessage("Công trình hiện không có người quản lý ");
                response.setType(request.getType());
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }
}