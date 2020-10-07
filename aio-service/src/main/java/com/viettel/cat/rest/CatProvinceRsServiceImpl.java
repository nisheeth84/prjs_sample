package com.viettel.cat.rest;

import com.viettel.cat.bo.CatProvinceBO;
import com.viettel.cat.business.CatProvinceBusinessImpl;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.util.ParamUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

//import com.viettel.cat.dto.CatUnitDTO;
//import com.viettel.erp.constant.ApplicationConstants;
//import com.viettel.service.base.dto.ActionListDTO;
//import com.viettel.utils.ExportExcel;
//import com.viettel.utils.FilterUtilities;

/**
 * @author hailh10
 */

public class CatProvinceRsServiceImpl implements CatProvinceRsService {

    protected final Logger log = Logger.getLogger(CatProvinceRsService.class);
    @Autowired
    CatProvinceBusinessImpl catProvinceBusinessImpl;

    @Override
    public Response doSearch(CatProvinceDTO obj) {
        List<CatProvinceDTO> ls = catProvinceBusinessImpl.doSearch(obj);
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
    public Response getById(Long id) {
        CatProvinceDTO obj = (CatProvinceDTO) catProvinceBusinessImpl
                .getById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response update(CatProvinceDTO obj) {
        CatProvinceDTO originObj = (CatProvinceDTO) catProvinceBusinessImpl
                .getOneById(obj.getCatProvinceId());

        if (originObj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {

            if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
                CatProvinceDTO check = catProvinceBusinessImpl.findByCode(obj
                        .getCode());
                if (check != null) {
                    return Response.status(Response.Status.CONFLICT).build();
                } else {
                    return doUpdate(obj);
                }
            } else {
                return doUpdate(obj);
            }

        }

    }

    private Response doUpdate(CatProvinceDTO obj) {

        Long id = catProvinceBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response add(CatProvinceDTO obj) {
        CatProvinceDTO existing = (CatProvinceDTO) catProvinceBusinessImpl
                .findByCode(obj.getCode());
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT).build();
        } else {

            Long id = catProvinceBusinessImpl.save(obj);
            obj.setCatProvinceId(id);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(obj).build();
            }
        }
    }

    @Override
    public Response delete(Long id) {
        CatProvinceDTO obj = (CatProvinceDTO) catProvinceBusinessImpl
                .getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            obj.setStatus("0");

            catProvinceBusinessImpl.update(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response deleteList(List<Long> ids) {
        String result = catProvinceBusinessImpl.delete(ids,
                CatProvinceBO.class.getName(), "CAT_PROVINCE_ID");

        if (result == ParamUtils.SUCCESS) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }
    }

    @Override
    public Response doSearchProvinceInPopup(CatProvinceDTO obj) {
        return Response
                .ok(catProvinceBusinessImpl.doSearchProvinceInPopup(obj))
                .build();
    }

}
