package jp.co.softbrain.esales.commons.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.AddressDTO;

/**
 * Service Interface for managing
 * {@link jp.co.softbrain.esales.commons.domain.DataChange}.
 * 
 * @author chungochai
 */
@XRayEnabled
public interface AddressService {

    /**
     * Get list address information from the zip code
     * @param zipCode : data need for get information
     * @param offset : data need for get information
     * @param limit : data need for get information
     * @return address information from the zip code
     */
    public List<AddressDTO> getAddressesFromZipCode(String zipCode, Long offset, Long limit);
    
}
