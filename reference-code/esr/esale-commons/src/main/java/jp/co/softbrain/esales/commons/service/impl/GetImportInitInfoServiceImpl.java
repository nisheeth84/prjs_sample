package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.repository.CommonFieldInfoRepository;
import jp.co.softbrain.esales.commons.service.GetImportInitInfoService;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoResponseDTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.GetImportInitInfoSubType3DTO;
import jp.co.softbrain.esales.commons.tenant.util.FieldBelongDefaultUtil.BUSINESS_CARD;
import jp.co.softbrain.esales.commons.tenant.util.FieldBelongDefaultUtil.PRODUCT;
import jp.co.softbrain.esales.utils.FieldBelongEnum;

/**
 * ServiceImpl for API getImportInitInfo
 * 
 * @author nguyenvanchien3
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class GetImportInitInfoServiceImpl implements GetImportInitInfoService {

    private final Logger log = LoggerFactory.getLogger(GetImportInitInfoServiceImpl.class);

    @Autowired
    private CommonFieldInfoRepository commonFieldInfoRepository;

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.GetImportInitInfoService#
     * getImportInitInfo(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetImportInitInfoResponseDTO getImportInitInfo(Long extensionBelong) {
        log.debug("getImportInitInfo API by extensionBelong");

        GetImportInitInfoResponseDTO responseDTO = new GetImportInitInfoResponseDTO();
        List<GetImportInitInfoSubType3DTO> matchingKeys = new ArrayList<>();

        // get info of default field keys
        List<GetImportInitInfoSubType2DTO> listDefaultKeys = commonFieldInfoRepository
                .getInfoDefaultFields(extensionBelong);
        if (!listDefaultKeys.isEmpty()) {
            GetImportInitInfoSubType3DTO matchingEmployee = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            GetImportInitInfoSubType3DTO matchingBusinessCardById = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            GetImportInitInfoSubType3DTO matchingBusinessCardByName = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            GetImportInitInfoSubType3DTO matchingBusinessCardByAdress = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            GetImportInitInfoSubType3DTO matchingProductById = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            GetImportInitInfoSubType3DTO matchingProductByName = new GetImportInitInfoSubType3DTO(
                    new ArrayList<GetImportInitInfoSubType2DTO>());
            listDefaultKeys.parallelStream().forEach(row -> {
                String fieldName = row.getFieldName();
                if (extensionBelong.intValue() == FieldBelongEnum.EMPLOYEE.getCode()) {
                    matchingEmployee.getMatchingKey().add(row);
                } else if (extensionBelong.intValue() == FieldBelongEnum.BUSINESS_CARD.getCode()) {
                    if (BUSINESS_CARD.BUSINESS_CARD_ID.toString().equalsIgnoreCase(fieldName)) {
                        matchingBusinessCardById.getMatchingKey().add(row);
                    } else if (BUSINESS_CARD.FIRST_NAME.toString().equalsIgnoreCase(fieldName)
                            || BUSINESS_CARD.LAST_NAME.toString().equalsIgnoreCase(fieldName)) {
                        matchingBusinessCardByName.getMatchingKey().add(row);
                    }
                    matchingBusinessCardByAdress.getMatchingKey().add(row);
                } else if (extensionBelong.intValue() == FieldBelongEnum.PRODUCT.getCode()) {
                    if (PRODUCT.PRODUCT_ID.toString().equalsIgnoreCase(fieldName)) {
                        matchingProductById.getMatchingKey().add(row);
                    }
                    matchingProductByName.getMatchingKey().add(row);
                }
            });
            matchingKeys.add(matchingEmployee);
            matchingKeys.add(matchingBusinessCardById);
            matchingKeys.add(matchingBusinessCardByName);
            matchingKeys.add(matchingBusinessCardByAdress);
            matchingKeys.add(matchingProductById);
            matchingKeys.add(matchingProductByName);
            matchingKeys.removeIf(matchingKey -> matchingKey.getMatchingKey().isEmpty());
        }

        // get info of text field keys
        List<GetImportInitInfoSubType2DTO> listTextFieldKeys = commonFieldInfoRepository
                .getInfoTextFields(extensionBelong);
        if (!listTextFieldKeys.isEmpty()) {
            listTextFieldKeys.stream().forEach(textField -> {
                GetImportInitInfoSubType3DTO matchingSingleTextField = new GetImportInitInfoSubType3DTO(
                        new ArrayList<GetImportInitInfoSubType2DTO>());
                matchingSingleTextField.getMatchingKey().add(textField);
                matchingKeys.add(matchingSingleTextField);
            });
        }
        List<GetImportInitInfoSubType1DTO> importMappings = new ArrayList<>();
        importMappings.add(new GetImportInitInfoSubType1DTO());

        responseDTO.setImportMappings(importMappings);
        responseDTO.setMatchingKeys(matchingKeys);
        return responseDTO;
    }

}
