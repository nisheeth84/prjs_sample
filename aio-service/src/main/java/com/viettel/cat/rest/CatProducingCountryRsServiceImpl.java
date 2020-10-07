package com.viettel.cat.rest;

import com.viettel.cat.bo.CatProducingCountryBO;
import com.viettel.cat.business.CatProducingCountryBusinessImpl;
import com.viettel.cat.dto.CatProducingCountryDTO;
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

public class CatProducingCountryRsServiceImpl implements CatProducingCountryRsService {

    protected final Logger log = Logger.getLogger(CatProducingCountryRsService.class);
    @Autowired
    CatProducingCountryBusinessImpl catProducingCountryBusinessImpl;


    @Override
    public Response doSearch(CatProducingCountryDTO obj) {
        List<CatProducingCountryDTO> ls = catProducingCountryBusinessImpl.doSearch(obj);
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
        CatProducingCountryDTO obj = (CatProducingCountryDTO) catProducingCountryBusinessImpl.getById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response update(CatProducingCountryDTO obj) {
        CatProducingCountryDTO originObj = (CatProducingCountryDTO) catProducingCountryBusinessImpl.getOneById(obj.getCatProducingCountryId());

        if (originObj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {

            if (!obj.getCode().equalsIgnoreCase(originObj.getCode())) {
                CatProducingCountryDTO check = catProducingCountryBusinessImpl.findByCode(obj.getCode());
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

    private Response doUpdate(CatProducingCountryDTO obj) {

        Long id = catProducingCountryBusinessImpl.update(obj);
        if (id == 0l) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            return Response.ok(obj).build();
        }
    }

    @Override
    public Response add(CatProducingCountryDTO obj) {
        CatProducingCountryDTO existing = (CatProducingCountryDTO) catProducingCountryBusinessImpl.findByCode(obj.getCode());
        if (existing != null) {
            return Response.status(Response.Status.CONFLICT).build();
        } else {

            Long id = catProducingCountryBusinessImpl.save(obj);
            obj.setCatProducingCountryId(id);
            if (id == 0l) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            } else {
                return Response.ok(obj).build();
            }
        }
    }

    @Override
    public Response delete(Long id) {
        CatProducingCountryDTO obj = (CatProducingCountryDTO) catProducingCountryBusinessImpl.getOneById(id);
        if (obj == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else {
            obj.setStatus("0");
            catProducingCountryBusinessImpl.update(obj);
            return Response.ok(Response.Status.NO_CONTENT).build();
        }
    }

    @Override
    public Response deleteList(List<Long> ids) {
        String result = catProducingCountryBusinessImpl.delete(ids, CatProducingCountryBO.class.getName(), "CAT_PRODUCING_COUNTRY_ID");

        if (result == ParamUtils.SUCCESS) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.EXPECTATION_FAILED).build();
        }
    }

    @Override
    public Response getForAutoComplete(CatProducingCountryDTO obj) {
        return Response.ok(catProducingCountryBusinessImpl.getForAutoComplete(obj)).build();
    }

    @Override
    public Response getForComboBox(CatProducingCountryDTO obj) {
        return Response.ok(catProducingCountryBusinessImpl.getForComboBox(obj)).build();
    }

}
