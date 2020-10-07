/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.SysUserCOMSBusinessImpl;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class SysUserCOMSRsServiceImpl implements SysUserCOMSRsService {

    //    protected final Logger log = Logger.getLogger(UserwmsRsService.class);
    @Autowired
    SysUserCOMSBusinessImpl sysUserwmsBusinessImpl;

    @Override
    public Response getSysUserwms() {
        List<SysUserCOMSDTO> ls = sysUserwmsBusinessImpl.getAll();
        if (ls == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            DataListDTO data = new DataListDTO();
            data.setData(ls);
            data.setTotal(ls.size());
            data.setSize(ls.size());
            data.setStart(1);
            return Response.ok(data).build();
        }
    }

    @Override
    public Response getForAutoComplete(SysUserCOMSDTO obj) {
        return Response.ok(sysUserwmsBusinessImpl.getForAutoComplete(obj)).build();
    }

    @Override
    public Response getSuppervisorAutoComplete(SysUserCOMSDTO obj) {
        return Response.ok(sysUserwmsBusinessImpl.getSuppervisorAutoComplete(obj)).build();
    }

    @Override
    public Response getDirectorAutoComplete(SysUserCOMSDTO obj) {
        return Response.ok(sysUserwmsBusinessImpl.getDirectorAutoComplete(obj)).build();
    }

    @Override
    public Response doSearchUserInPopup(SysUserCOMSDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(sysUserwmsBusinessImpl.doSearchUserInPopup(obj)).build();
    }

    @Override
    public Response doSearchSuppervisorInPopup(SysUserCOMSDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(sysUserwmsBusinessImpl.doSearchSuppervisorInPopup(obj)).build();
    }

    @Override
    public Response doSearchDirectorInPopup(SysUserCOMSDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(sysUserwmsBusinessImpl.doSearchDirectorInPopup(obj)).build();
    }

    @Override
    public Response getForAutoCompleteInSign(SysUserCOMSDTO obj) {
        // TODO Auto-generated method stub
        return Response.ok(sysUserwmsBusinessImpl.getForAutoCompleteInSign(obj)).build();
    }
}
