/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.wms.rest;

import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.SysRoleBusinessImpl;
import com.viettel.wms.dto.SysRoleDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class SysRoleRsServiceImpl implements SysRoleRsService {

    //    protected final Logger log = Logger.getLogger(UserRsService.class);
    @Autowired
    SysRoleBusinessImpl sysRoleBusinessImpl;

    @Override
    public Response getSysRole() {
        List<SysRoleDTO> ls = sysRoleBusinessImpl.getAll();
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
    public Response getSysRoleById(Long id) {
        SysRoleDTO obj = (SysRoleDTO) sysRoleBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateSysRole(SysRoleDTO obj) {
        Long id = sysRoleBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addSysRole(SysRoleDTO obj) {
        Long id = sysRoleBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteSysRole(Long id) {
        SysRoleDTO obj = (SysRoleDTO) sysRoleBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            sysRoleBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response doSearchSysRole(SysRoleDTO obj) {
        // TODO Auto-generated method stub
        DataListDTO data = sysRoleBusinessImpl.doSearchSysRole(obj);
        if (data == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(data).build();
        }
    }
}
