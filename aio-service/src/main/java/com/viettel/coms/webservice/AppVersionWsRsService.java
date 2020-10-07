package com.viettel.coms.webservice;


import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.business.AppVersionBusinessImpl;
import com.viettel.coms.dto.AppVersionDTOResponse;
import com.viettel.coms.dto.AppVersionWorkItemDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service")
public class AppVersionWsRsService {
    private Logger LOGGER = Logger.getLogger(AppVersionWsRsService.class);

    @Autowired
    AppVersionBusinessImpl appVersionBusiness;

    @POST
    @Path("/getAppVersion/")
    public AppVersionDTOResponse getAppVersion() {
        AppVersionDTOResponse response = new AppVersionDTOResponse();
        try {
            List<AppVersionWorkItemDTO> data = appVersionBusiness.getAppVersion();
            AppVersionWorkItemDTO dataDetail = data.get(0);
            response.setAppVersionWorkItemDTO(dataDetail);
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
