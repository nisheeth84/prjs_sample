package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOCategoryProductBusinessImpl;
import com.viettel.aio.business.AIOProductInfoBusinessImpl;
import com.viettel.aio.dto.AIOBaseRequest;
import com.viettel.aio.dto.AIOBaseResponse;
import com.viettel.aio.dto.AIOCategoryProductDTO;
import com.viettel.aio.dto.AIOPackageDetailDTO;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
public class AIOCategoryProductWsRsService {

    @Autowired
    public AIOCategoryProductWsRsService(AIOCategoryProductBusinessImpl categoryProductBusiness,
                                         AIOProductInfoBusinessImpl productInfoBusiness) {
        this.categoryProductBusiness = categoryProductBusiness;
        this.productInfoBusiness = productInfoBusiness;
    }

    private AIOCategoryProductBusinessImpl categoryProductBusiness;
    private AIOProductInfoBusinessImpl productInfoBusiness;

    @POST
    @Path("/getProductsMenu/")
    public AIOBaseResponse<List<AIOCategoryProductDTO>> getProductsMenu() {
        AIOBaseResponse<List<AIOCategoryProductDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            List<AIOCategoryProductDTO> data = categoryProductBusiness.getProductsMenu();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }

    @POST
    @Path("/getHighlightProducts/")
    public AIOBaseResponse<List<AIOProductInfoDTO>> getHighlightProducts() {
        AIOBaseResponse<List<AIOProductInfoDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            List<AIOProductInfoDTO> data = productInfoBusiness.getHighlightProducts();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }

    @POST
    @Path("/getProductsInCategory/")
    public AIOBaseResponse<List<AIOProductInfoDTO>> getProductsInCategory(AIOBaseRequest<AIOProductInfoDTO> rq) {
        AIOBaseResponse<List<AIOProductInfoDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            List<AIOProductInfoDTO> data = productInfoBusiness.getProductsInCategory(rq.getData());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }

    @POST
    @Path("/getAmountStock/")
    public AIOBaseResponse<AIOProductInfoDTO> getAmountStock(AIOBaseRequest<Long> rq) {
        AIOBaseResponse<AIOProductInfoDTO> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            AIOProductInfoDTO data = productInfoBusiness.getAmountStock(rq.getData());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }

    @POST
    @Path("/getPackageFromProduct/")
    public AIOBaseResponse<List<AIOPackageDetailDTO>> getPackageFromProduct(AIOBaseRequest<Long> rq) {
        AIOBaseResponse<List<AIOPackageDetailDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            List<AIOPackageDetailDTO> data = productInfoBusiness.getPackageFromProduct(rq.getData());
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }


    @POST
    @Path("/getListProductName/")
    public AIOBaseResponse<List<AIOProductInfoDTO>> getListProductName() {
        AIOBaseResponse<List<AIOProductInfoDTO>> res = new AIOBaseResponse<>();
        ResultInfo resultInfo = new ResultInfo();
        res.setResultInfo(resultInfo);
        try {
            List<AIOProductInfoDTO> data = productInfoBusiness.getListProductName();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            res.setData(data);
        } catch (BusinessException e) {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage("Có lỗi xảy ra");
        }
        return res;
    }
}
