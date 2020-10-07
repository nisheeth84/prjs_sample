package com.viettel.aio.rest;

import com.viettel.aio.business.AIOConfigSalaryBusinessImpl;
import com.viettel.aio.dto.AIOConfigSalaryDTO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

//VietNT_20191105_create
public class AIOConfigSalaryRsServiceImpl implements AIOConfigSalaryRsService {

    protected final Logger log = Logger.getLogger(AIOConfigSalaryRsServiceImpl.class);

    @Autowired
    private AIOConfigSalaryBusinessImpl aioConfigSalaryBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

    @Override
    public Response doSearch(AIOConfigSalaryDTO obj) {
        DataListDTO data = aioConfigSalaryBusiness.doSearch(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response submitAdd(AIOConfigSalaryDTO obj) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            aioConfigSalaryBusiness.submitAdd(obj, sysUserDto);
            return Response.ok(HttpStatus.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response delete(Long id) {
        try {
            KttsUserSession session = userRoleBusiness.getUserSession(request);
            SysUserCOMSDTO sysUserDto = session.getVpsUserInfo();
            aioConfigSalaryBusiness.deleteConfig(id, sysUserDto);
            return Response.ok(HttpStatus.OK).build();
        } catch (BusinessException e) {
            e.printStackTrace();
            return this.buildErrorResponse(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return this.buildErrorResponse("Có lỗi xảy ra!");
        }
    }

    @Override
    public Response getListConfigSalary(AIOConfigSalaryDTO obj) {
        List<AIOConfigSalaryDTO> data = aioConfigSalaryBusiness.getListConfigSalary(obj);
        return Response.ok(data).build();
    }
}
