package com.viettel.wms.rest;

import com.viettel.wms.business.PartnerBusinessImpl;
import com.viettel.wms.dto.PartnerDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;

public class PartnerRsServiceImpl implements PartnerRsService {

    @Autowired
    PartnerBusinessImpl partnerBusinessImpl;

    @Override
    public Response getForAutoComplete(PartnerDTO pat) {
        return Response.ok(partnerBusinessImpl.getForAutoComplete(pat)).build();
    }

    @Override
    public Response getForAutoCompleteII(String obj) {
        return Response.ok(partnerBusinessImpl.getForAutoCompleteII(obj)).build();
    }

    @Override
    public Response getPartnerByCode(String code) {
        return Response.ok(partnerBusinessImpl.getPartnerByCode(code)).build();
    }

    @Override
    public Response getPartnerById(Long id) {
        return Response.ok(partnerBusinessImpl.getPartnerById(id)).build();
    }

}
