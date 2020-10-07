package com.viettel.aio.rest;

import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOSysUserDTO;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//VietNT_20190506_created
public interface AIOSysUserRsService {

    @POST
    @Path("/doSearch")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doSearch(AIOSysUserDTO obj);
    @POST
    @Path("/doApproveAccount")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doApproveAccount(AIOSysUserDTO obj);
    @POST
    @Path("/doDeleteAccount")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doDeleteAccount(AIOSysUserDTO obj);
    @POST
    @Path("/doRejectAccount")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doRejectAccount(AIOSysUserDTO obj);
    @POST
    @Path("/searchParentUsers")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response searchParentUsers(AIOSysUserDTO obj);
    @POST
    @Path("/addParent")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response addParent(AIOSysUserDTO obj);

    @POST
    @Path("/doResetPassword")
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    Response doResetPassword(AIOSysUserDTO obj);


}