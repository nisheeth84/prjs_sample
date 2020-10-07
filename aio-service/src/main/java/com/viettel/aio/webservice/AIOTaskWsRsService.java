package com.viettel.aio.webservice;

import com.viettel.aio.business.VoSoScheduledTask;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.voso.VoSoManualDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Date;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOTaskWsRsService {
    private Logger LOGGER = Logger.getLogger(AIOTaskWsRsService.class);

    @Autowired
	public AIOTaskWsRsService(VoSoScheduledTask voSoScheduledTask) {
		this.voSoScheduledTask = voSoScheduledTask;
	}

	private VoSoScheduledTask voSoScheduledTask;

    @POST
    @Path("/getDataFromVoSoManual")
    public Response getDataFromVoSoManual(VoSoManualDTO dto) {
    	try {
			if (dto != null && dto.getStart() != 0) {
				if (dto.getEnd() == 0) {
					dto.setEnd(System.currentTimeMillis());
				}
				voSoScheduledTask.getDataFromVoSoManual(dto);
				return Response.ok(Response.Status.OK).build();
			} else {
				return Response.ok(Response.Status.UNAUTHORIZED).build();
			}
		} catch (Exception e) {
    		e.printStackTrace();
			return Response.ok(Response.Status.BAD_REQUEST).build();
		}
    }
}
