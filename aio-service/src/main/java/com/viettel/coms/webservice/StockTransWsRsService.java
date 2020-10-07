package com.viettel.coms.webservice;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.dto.ConstructionTaskDTOResponse;
import com.viettel.coms.dto.SysUserRequest;
import org.apache.log4j.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class StockTransWsRsService {
    private Logger LOGGER = Logger.getLogger(ConstructionTaskWsRsService.class);

    @POST
    @Path("/getConstructionTaskById/")
    public ConstructionTaskDTOResponse getConstructionTask(SysUserRequest request) {
        ConstructionTaskDTOResponse response = new ConstructionTaskDTOResponse();
        try {

            /*response.setLstConstrucitonTask(data);*/
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
}
