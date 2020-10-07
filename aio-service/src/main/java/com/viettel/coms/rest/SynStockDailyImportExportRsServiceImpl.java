package com.viettel.coms.rest;

import java.io.FileNotFoundException;
import java.util.Collections;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.coms.business.SynStockDailyImportExportBusinessImpl;
import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.coms.dto.GoodsDTO;
import com.viettel.coms.dto.SynStockDailyImportExportDTO;
import com.viettel.coms.dto.SynStockDailyImportExportRequest;
import com.viettel.coms.dto.SynStockDailyRemainDTO;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.business.UserRoleBusinessImpl;

import viettel.passport.client.UserToken;

//VietNT_20190129_created
public class SynStockDailyImportExportRsServiceImpl implements SynStockDailyImportExportRsService {

    protected final Logger log = Logger.getLogger(RpHSHCRsServiceImpl.class);

    @Autowired
    private SynStockDailyImportExportBusinessImpl synStockDailyImportExportBusiness;

    @Autowired
    private UserRoleBusinessImpl userRoleBusiness;

    @Context
    private HttpServletRequest request;

    private Response buildErrorResponse(String message) {
        return Response.ok().entity(Collections.singletonMap("error", message)).build();
    }

	@Override
	public Response doSearchDebt(SynStockDailyRemainDTO obj) {
		DataListDTO data = synStockDailyImportExportBusiness.doSearchDebt(obj);
        return Response.ok(data).build();
	}

	@Override
	public Response doSearchImportExportTonACap(SynStockDailyRemainDTO obj) {
		DataListDTO data = synStockDailyImportExportBusiness.doSearchImportExportTonACap(obj);
        return Response.ok(data).build();
	}
	
	@Override
	public Response doSearchCompareReport(SynStockDailyRemainDTO obj) {
		DataListDTO data = synStockDailyImportExportBusiness.doSearchCompareReport(obj);
        return Response.ok(data).build();
	}
	
	@Override
	public Response exportExcelDebt(SynStockDailyRemainDTO obj) throws Exception {
		// TODO Auto-generated method stub
		UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
		String strReturn = synStockDailyImportExportBusiness.exportExcelDebt(obj, request,objUser.getUserName());
        return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	}

	@Override
	public Response getForCompleteGoods(GoodsDTO obj) {
		
		return Response.ok(synStockDailyImportExportBusiness.getForCompleteGoods(obj)).build();
	}

	@Override
	public Response doSearchGoods(SynStockDailyRemainDTO obj) {
		DataListDTO data = synStockDailyImportExportBusiness.doSearchGoods(obj);
        return Response.ok(data).build();
	}

	@Override
	public Response exportExcelImportExportTonACap(SynStockDailyRemainDTO obj) throws Exception {
		// TODO Auto-generated method stub
		UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
		String strReturn = synStockDailyImportExportBusiness.exportExcelImportExportTonACap(obj, request,objUser.getUserName());
        return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	}
	
	@Override
	public Response getForCompleteConstruction(ConstructionDTO obj) {
		
		return Response.ok(synStockDailyImportExportBusiness.getForCompleteConstruction(obj)).build();
	}
	
	@Override
	public Response exportExcelCompare(SynStockDailyRemainDTO obj) throws Exception {
		// TODO Auto-generated method stub
		UserToken objUser = (UserToken) request.getSession().getAttribute("vsaUserToken");
		String strReturn = synStockDailyImportExportBusiness.exportExcelCompare(obj, request,objUser.getUserName());
        return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
	}

//vietnt
    @Override
    public Response doSearchGoodsDebtConfirmDetail(SynStockDailyImportExportDTO obj) {
        DataListDTO data = synStockDailyImportExportBusiness.doSearchGoodsDebtConfirmDetail(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportGoodsDebtConfirmDetail(SynStockDailyImportExportRequest obj) {
        if (obj.getExportData() == null || obj.getExportData().isEmpty()) {
            return this.buildErrorResponse("Không có dữ liệu!");
        }
        Response res;
        try {
            String filePath = synStockDailyImportExportBusiness.exportGoodsDebtConfirmDetail(obj);
            res = Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (FileNotFoundException e) {
        	e.printStackTrace();
            res = this.buildErrorResponse("Không tìm thấy biểu mẫu");
        } catch (Exception e) {
        	e.printStackTrace();
            res = this.buildErrorResponse("Có lỗi xảy ra trong quá trình xuất file!");
        }
        return res;
    }

    @Override
    public Response doSearchGoodsDebtConfirmGeneral(SynStockDailyImportExportDTO obj) {
        DataListDTO data = synStockDailyImportExportBusiness.doSearchGoodsDebtConfirmGeneral(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportGoodsDebtConfirmGeneral(SynStockDailyImportExportRequest obj) {
        if (obj.getExportData() == null || obj.getExportData().isEmpty()) {
            return this.buildErrorResponse("Không có dữ liệu!");
        }
        Response res;
        try {
            String filePath = synStockDailyImportExportBusiness.exportGoodsDebtConfirmGeneral(obj);
            res = Response.ok(Collections.singletonMap("fileName", filePath)).build();
        } catch (FileNotFoundException e) {
        	e.printStackTrace();
            res = this.buildErrorResponse("Không tìm thấy biểu mẫu");
        } catch (Exception e) {
        	e.printStackTrace();
            res = this.buildErrorResponse("Có lỗi xảy ra trong quá trình xuất file!");
        }
        return res;
    }

    @Override
    public Response doSearchContractPerformance(SynStockDailyImportExportDTO obj) {
        DataListDTO data = synStockDailyImportExportBusiness.doSearchContractPerformance(obj);
        return Response.ok(data).build();
    }

    @Override
    public Response exportContractPerformance(SynStockDailyImportExportDTO obj) {
        Response res;
        try {
            String filePath = synStockDailyImportExportBusiness.exportExcelContractPerformance(obj);
            if (StringUtils.isEmpty(filePath)) {
            	res = this.buildErrorResponse("Không có dữ liệu!");
            } else {
                res = Response.ok(Collections.singletonMap("fileName", filePath)).build();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Không tìm thấy biểu mẫu");
        } catch (Exception e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Có lỗi xảy ra trong quá trình xuất file!");
        }
        return res;
    }

    @Override
    public Response doSearchRpDetailIERByConstructionCode(SynStockDailyImportExportDTO obj) {
        DataListDTO dataListDTO = synStockDailyImportExportBusiness.doSearchRpDetailIERByConstructionCode(obj);
        return Response.ok(dataListDTO).build();
    }

	@Override
	public Response getGoodsForAutoComplete(GoodsDTO obj) {
		return Response.ok(synStockDailyImportExportBusiness.getGoodsForAutoComplete(obj)).build();
	}

    @Override
    public Response exportDetailIERGoods(SynStockDailyImportExportDTO obj) {
        Response res;
        try {
            String filePath = synStockDailyImportExportBusiness.exportDetailIERGoods(obj);
            if (StringUtils.isEmpty(filePath)) {
            	res = this.buildErrorResponse("Không có dữ liệu!");
            } else {
                res = Response.ok(Collections.singletonMap("fileName", filePath)).build();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Không tìm thấy biểu mẫu");
        } catch (Exception e) {
            e.printStackTrace();
            res = this.buildErrorResponse("Có lỗi xảy ra trong quá trình xuất file!");
        }
        return res;
    }
}
