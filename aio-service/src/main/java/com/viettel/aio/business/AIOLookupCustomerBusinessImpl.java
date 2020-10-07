package com.viettel.aio.business;

import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.aio.bo.AIOOrdersBO;
import com.viettel.aio.dao.AIOCustomerDAO;
import com.viettel.aio.dao.AIOOrdersDAO;
import com.viettel.aio.dto.AIOAcceptanceRecordsDetailDTO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.utils.ConvertData;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("aioLookupCustomerBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOLookupCustomerBusinessImpl extends BaseFWBusinessImpl<AIOCustomerDAO, AIOCustomerDTO, AIOCustomerBO> implements AIOLookupCustomerBusiness{
	
	static Logger LOGGER = LoggerFactory.getLogger(AIOLookupCustomerBusinessImpl.class);
    @Autowired
    private AIOCustomerDAO aioCustomerDAO;
    
    public DataListDTO doSearch(AIOContractDTO dto) {

        List<AIOAcceptanceRecordsDetailDTO> dtos = aioCustomerDAO.doSearchLookUpWarranty(dto);

        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }


    public AIOContractDTO viewDetail(Long id){
//    	return aioCustomerDAO.viewDetail(obj);
        return aioCustomerDAO.getDetailWarranty(id);
    }

    public DataListDTO doSearchContractDetail(AIOCustomerDTO dto) {

        List<AIOCustomerDTO> dtos = aioCustomerDAO.doSearchContractDetail(dto);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    public DataListDTO doSearchVTTBDetail(AIOCustomerDTO dto) {
        List<AIOCustomerDTO> dtos = aioCustomerDAO.doSearchVTTBDetail(dto);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }


    public AIOCustomerDTO viewDetailVTTB(AIOCustomerDTO obj){
        return aioCustomerDAO.viewDetailVTTB(obj);
    }

    public List<AIOContractDTO> getListContractLookupServiceTask(AIOContractMobileRequest request) {
        return aioCustomerDAO.getListContractLookupServiceTask(request);
    }

    public List<AIOContractDTO> getViewLookDetail(AIOContractMobileRequest request) {
        return aioCustomerDAO.getViewLookDetail(request);
    }
}
