/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.rest;

import com.viettel.coms.business.AssetManageRequestEntityBusinessImpl;
import com.viettel.coms.dto.AssetManageRequestEntityDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author HungLQ9
 */
public class AssetManageRequestEntityRsServiceImpl implements AssetManageRequestEntityRsService {

    protected final Logger log = Logger.getLogger(AssetManageRequestEntityRsServiceImpl.class);
    @Autowired
    AssetManageRequestEntityBusinessImpl assetManageRequestEntityBusinessImpl;

    @Override
    public Response getAssetManageRequestEntity() {
        List<AssetManageRequestEntityDTO> ls = assetManageRequestEntityBusinessImpl.getAll();
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
    public Response getAssetManageRequestEntityById(Long id) {
        AssetManageRequestEntityDTO obj = (AssetManageRequestEntityDTO) assetManageRequestEntityBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response updateAssetManageRequestEntity(AssetManageRequestEntityDTO obj) {
        Long id = assetManageRequestEntityBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok().build();
        }

    }

    @Override
    public Response addAssetManageRequestEntity(AssetManageRequestEntityDTO obj) {
        Long id = assetManageRequestEntityBusinessImpl.save(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(Response.Status.CREATED).build();
        }
    }

    @Override
    public Response deleteAssetManageRequestEntity(Long id) {
        AssetManageRequestEntityDTO obj = (AssetManageRequestEntityDTO) assetManageRequestEntityBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            assetManageRequestEntityBusinessImpl.delete(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }
}
