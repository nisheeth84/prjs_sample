package com.viettel.aio.rest;

import com.viettel.aio.business.AIORpBacklogContractBusiness;
import com.viettel.aio.business.CommonServiceAio;
import com.viettel.aio.dto.report.AIORpBacklogContractDTO;
import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

public class AIORpBacklogContractRsServiceImpl implements AIORpBacklogContractRsService {

    @Autowired
    private AIORpBacklogContractBusiness aioRpBacklogContractBusiness;

    @Autowired
    private CommonServiceAio commonServiceAio;

    @Context
    HttpServletRequest request;

    private Logger log = Logger.getLogger(AIORpBacklogContractRsServiceImpl.class);

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIORpBacklogContractDTO obj) {
        List<Long> areaIds = obj.getAreaIds();
        List<AIORpBacklogContractDTO> dtos;
        if (obj.getRpLevel() == AIORpBacklogContractDTO.LEVEL_GROUP) {
            if (areaIds == null || areaIds.isEmpty()) {
                KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
                Long sysGroupLv2Id = commonServiceAio.getSysGroupLevelByUserId(objUser.getSysUserId(), 2);
                DepartmentDTO groupDto = commonServiceAio.getSysGroupById(sysGroupLv2Id);
                areaIds = Collections.singletonList(groupDto.getAreaId());
                obj.setAreaIds(areaIds);
            }
            dtos = aioRpBacklogContractBusiness.rpBacklogContractByGroup(obj);
        } else {
            dtos = aioRpBacklogContractBusiness.rpBacklogContractByProvince(obj);
        }

        DataListDTO data = new DataListDTO();
        data.setData(dtos);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return Response.ok(data).build();

    }

    @Override
    public Response doExport(AIORpBacklogContractDTO obj) {
        try {
            List<Long> areaIds = obj.getAreaIds();

            if (obj.getRpLevel() == AIORpBacklogContractDTO.LEVEL_GROUP) {
                if (areaIds == null || areaIds.isEmpty()) {
                    KttsUserSession objUser = (KttsUserSession) request.getSession().getAttribute("kttsUserSession");
                    Long sysGroupLv2Id = commonServiceAio.getSysGroupLevelByUserId(objUser.getSysUserId(), 2);
                    DepartmentDTO groupDto = commonServiceAio.getSysGroupById(sysGroupLv2Id);
                    areaIds = Collections.singletonList(groupDto.getAreaId());
                    obj.setAreaIds(areaIds);
                }
            }
            String fileName = aioRpBacklogContractBusiness.doExport(obj);
            return Response.ok(Collections.singletonMap("fileName", fileName)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex);
            return buildErrorResponse("Có lỗi xảy ra");
        }

    }
}
