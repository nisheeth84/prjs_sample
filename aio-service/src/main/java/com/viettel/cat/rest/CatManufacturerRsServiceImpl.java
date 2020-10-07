package com.viettel.cat.rest;

import com.viettel.cat.bo.CatManufacturerBO;
import com.viettel.cat.business.CatManufacturerBusinessImpl;
import com.viettel.cat.dto.CatManufacturerDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.util.ParamUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

//import com.viettel.erp.constant.ApplicationConstants;
//import com.viettel.erp.utils.ExportExcel;
//import com.viettel.erp.utils.FilterUtilities;

/**
 * @author hailh10
 */

public class CatManufacturerRsServiceImpl implements CatManufacturerRsService {

    protected final Logger log = Logger.getLogger(CatManufacturerRsService.class);
    @Autowired
    CatManufacturerBusinessImpl catManufacturerBusinessImpl;


    @Override
    public Response doSearch(CatManufacturerDTO obj) {
        List<CatManufacturerDTO> ls = catManufacturerBusinessImpl.doSearch(obj);
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
        CatManufacturerDTO obj = (CatManufacturerDTO) catManufacturerBusinessImpl.getById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response update(CatManufacturerDTO obj) {
        CatManufacturerDTO originObj = (CatManufacturerDTO) catManufacturerBusinessImpl.getOneById(obj.getCatManufacturerId());

        if (originObj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {

            if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
                CatManufacturerDTO check = catManufacturerBusinessImpl.findByCode(obj.getCode());
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

    private Response doUpdate(CatManufacturerDTO obj) {

        Long id = catManufacturerBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response add(CatManufacturerDTO obj) {
        CatManufacturerDTO existing = (CatManufacturerDTO) catManufacturerBusinessImpl.findByCode(obj.getCode());
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT).build();
        } else {

            Long id = catManufacturerBusinessImpl.save(obj);
            obj.setCatManufacturerId(id);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(obj).build();
            }
        }
    }

    @Override
    public Response delete(Long id) {
        CatManufacturerDTO obj = (CatManufacturerDTO) catManufacturerBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            obj.setStatus("0");
            catManufacturerBusinessImpl.update(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response deleteList(List<Long> ids) {
        String result = catManufacturerBusinessImpl.delete(ids, CatManufacturerBO.class.getName(), "CAT_MANUFACTURER_ID");

        if (result == ParamUtils.SUCCESS) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }
    }

    @Override
    public Response getForAutoComplete(CatManufacturerDTO obj) {
        return Response.ok(catManufacturerBusinessImpl.getForAutoComplete(obj)).build();
    }

    @Override
    public Response getForComboBox(CatManufacturerDTO obj) {
        return Response.ok(catManufacturerBusinessImpl.getForComboBox(obj)).build();
    }
}
