package jp.co.softbrain.esales.commons.service.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.Address;
import jp.co.softbrain.esales.commons.repository.AddressRepossitory;
import jp.co.softbrain.esales.commons.service.AddressService;
import jp.co.softbrain.esales.commons.service.dto.AddressDTO;
import jp.co.softbrain.esales.commons.service.mapper.AddressMapper;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * AddressesServiceImpl
 * 
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepossitory addressesRepossitory;

    @Autowired
    private AddressMapper addressesMapper;

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.AddressesService#
     * getAddressesFromZipCode(java.lang.String, java.lang.Long, java.lang.Long)
     */
    @Override
    public List<AddressDTO> getAddressesFromZipCode(String zipCode, Long offset, Long limit) {
        if (StringUtils.isEmpty(zipCode)) {
            throw new CustomException("zipCode must have data", ConstantsCommon.ZIP_CODE,
                    Constants.RIQUIRED_CODE);
        }
        if (offset == null) {
            throw new CustomException("offset must have data", ConstantsCommon.OFFSET, Constants.RIQUIRED_CODE);
        }
        if (limit == null) {
            throw new CustomException("limit must have data", ConstantsCommon.LIMIT, Constants.RIQUIRED_CODE);
        }
        if (offset < 0) {
            throw new CustomException("Invalid offset ", ConstantsCommon.OFFSET, Constants.INVALID_PARAMETER);
        }
        if (limit < 0) {
            throw new CustomException("Invalid limit ", ConstantsCommon.LIMIT, Constants.INVALID_PARAMETER);
        }
        zipCode = zipCode.replace("%", "\\%").replace("_", "\\_");
        zipCode = "%" + zipCode + "%";
        List<Address> addresses = addressesRepossitory.getAddressesFromZipCode(zipCode, offset, limit);
        return addressesMapper.toDto(addresses);
    }

}
