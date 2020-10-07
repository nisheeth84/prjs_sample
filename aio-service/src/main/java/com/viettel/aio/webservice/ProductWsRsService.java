package com.viettel.aio.webservice;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.aio.business.AIOContractServiceMobileBusinessImpl;
import com.viettel.aio.business.AIOProductInfoBusinessImpl;
import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOContractMobileResponse;
import com.viettel.aio.dto.AIOProductInfoDTO;
import com.viettel.aio.dto.AIOProductMobileResponse;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.dto.UtilAttachDocumentDTO;

@Consumes({ MediaType.APPLICATION_JSON + ";charset=utf-8",
		MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON + ";charset=utf-8",
		MediaType.APPLICATION_XML })
@Path("/service")
public class ProductWsRsService {
	private Logger LOGGER = Logger.getLogger(ProductWsRsService.class);
	@Autowired
	AIOContractServiceMobileBusinessImpl aioContractBusiness;

	@Autowired
	AIOProductInfoBusinessImpl aioProductBusiness;

	@POST
	@Path("/doSearch/")
	public ResultInfo doSearch(AIOContractMobileRequest obj) {
		if (obj.getPerformTogether().equals("1")) {
			ResultInfo res = new ResultInfo();
			res.setStatus(ResultInfo.RESULT_OK);
			res.setMessage("Ok");
			return res;
		} else {
			ResultInfo res = new ResultInfo();
			res.setStatus(ResultInfo.RESULT_NOK);
			res.setMessage("NOk");
			return res;
		}

	}

	// Lấy tỉnh/thành phố
	@POST
	@Path("/getDataProvinceCity/")
	public AIOContractMobileResponse getDataProvinceCity() {
		AIOContractMobileResponse response = new AIOContractMobileResponse();
		try {
			List<AIOAreaDTO> data = aioContractBusiness.getDataProvinceCity();
			response.setAreaProvinceCity(data);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_OK);
			response.setResultInfo(resultInfo);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_NOK);
			resultInfo.setMessage(e.getMessage());
			response.setResultInfo(resultInfo);
		}
		return response;
	}

	// Lấy thông tin hạng mục
	@POST
	@Path("/getDataGroupProduct/")
	public AIOProductMobileResponse getDataGroupProduct() {
		AIOProductMobileResponse response = new AIOProductMobileResponse();
		try {
			List<AIOAreaDTO> dataArea = aioContractBusiness
					.getDataProvinceCity();
			response.setAreaProvinceCity(dataArea);

			List<AIOProductInfoDTO> data = aioProductBusiness
					.getDataGroupProduct();
			response.setLstProductInfoDTO(data);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_OK);
			response.setResultInfo(resultInfo);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_NOK);
			resultInfo.setMessage(e.getMessage());
			response.setResultInfo(resultInfo);
		}
		return response;
	}

	// Tra cuu thong tin san pham
	@POST
	@Path("/doSeachInfoProduct/")
	public AIOProductMobileResponse doSeachInfoProduct(
			AIOProductInfoDTO aioProductInfoDTO) {
		AIOProductMobileResponse response = new AIOProductMobileResponse();
		try {
			List<AIOProductInfoDTO> data = aioProductBusiness
					.doSeachInfoProduct(aioProductInfoDTO);
			response.setLstProductInfoDTO(data);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_OK);
			response.setResultInfo(resultInfo);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_NOK);
			resultInfo.setMessage(e.getMessage());
			response.setResultInfo(resultInfo);
		}
		return response;
	}

	// Hinh anh thong tin chi tiet
	@POST
	@Path("/doSeachImageDetail/")
	public AIOProductMobileResponse doSeachImageDetail(
			AIOProductInfoDTO aioProductInfoDTO) {
		AIOProductMobileResponse response = new AIOProductMobileResponse();
		try {
			response = aioProductBusiness.getDetailProduct(aioProductInfoDTO);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_OK);
			response.setResultInfo(resultInfo);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_NOK);
			resultInfo.setMessage(e.getMessage());
			response.setResultInfo(resultInfo);
		}
		return response;
	}
}
