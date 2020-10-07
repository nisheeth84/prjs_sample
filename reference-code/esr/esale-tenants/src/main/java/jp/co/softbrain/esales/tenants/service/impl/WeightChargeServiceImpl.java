package jp.co.softbrain.esales.tenants.service.impl;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.TENANT_ITEM;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.YEAR_MONTH_MAX_LENGTH;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.CountBusinessCardsDigitizedRequest;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants.PaymentStatus;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus;
import jp.co.softbrain.esales.tenants.repository.PaymentsManagementRepository;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.tenants.service.AbstractTenantService;
import jp.co.softbrain.esales.tenants.service.CommonService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.WeightChargeService;
import jp.co.softbrain.esales.tenants.service.dto.ErrorDTO;
import jp.co.softbrain.esales.tenants.service.dto.ErrorItemDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetWeightChargeDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PaymentsManagementDTO;
import jp.co.softbrain.esales.tenants.service.dto.SummaryWeightChargeResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.mapper.PaymentsManagementMapper;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.CountBusinessCardsDigitizedResponse;
import jp.co.softbrain.esales.tenants.service.dto.GetWeightChargeResponseDTO;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service implementation for function weight charge.
 *
 * @author nguyenvietloi
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class WeightChargeServiceImpl extends AbstractTenantService implements WeightChargeService {

    private final Logger log = LoggerFactory.getLogger(WeightChargeServiceImpl.class);

    @Autowired
    private TenantService tenantService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private PaymentsManagementRepository paymentsManagementRepository;

    @Autowired
    private PaymentsManagementMapper paymentsManagementMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;


    /**
     * @see WeightChargeService#getWeightCharge(String, String, String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GetWeightChargeResponseDTO getWeightCharge(String contractTenantId, String paramPaymentType, String yearMonth) {

        // 1. Validate parameter
        List<ErrorDTO> errors = validateParam(contractTenantId, paramPaymentType, yearMonth);

        if (!errors.isEmpty()) {
            return createGetWeightChargeResponseError(errors);
        }

        try {
            // check exist tenant
            if (!commonService.isExistTenant(null, contractTenantId)) {
                List<ErrorDTO> errorDTOs = Collections.singletonList(createErrorDTO(Constants.ITEM_NOT_EXIST, TENANT_ITEM));
                return createGetWeightChargeResponseError(errorDTOs);
            }

            // 2. calculate weight of number of used
            Integer paymentType = Integer.parseInt(paramPaymentType);
            Integer usedNumber = paymentsManagementRepository.getUsedNumber(contractTenantId, paymentType, yearMonth);

            // 3. create response
            GetWeightChargeResponseDTO responseDTO = new GetWeightChargeResponseDTO();
            responseDTO.setStatus(ResponseStatus.SUCCESS.getValue());
            responseDTO.setData(new GetWeightChargeDataDTO(usedNumber != null ? usedNumber : 0));
            return responseDTO;
        } catch (DataIntegrityViolationException e) {
            log.error(e.getMessage());
            List<ErrorDTO> errorDTOs = Collections.singletonList(createErrorDTO(Constants.INTERRUPT_API));
            return createGetWeightChargeResponseError(errorDTOs);
        }
    }

    /**
     * @see WeightChargeService#summaryWeightCharge(List)
     */
    @Override
    @Transactional
    public List<SummaryWeightChargeResponseDTO> summaryWeightCharge(List<Long> tenantIds) {
        List<SummaryWeightChargeResponseDTO> summaryResponses = new ArrayList<>();
        List<TenantActiveDTO> tenants = tenantService.getTenantActiveByIds(tenantIds);

        if (tenants.isEmpty()) {
            SummaryWeightChargeResponseDTO responseDTO = new SummaryWeightChargeResponseDTO();
            responseDTO.setError(new ErrorItemDTO("get_tenants", getMessage(Constants.ITEM_NOT_EXIST, TENANT_ITEM)));
            summaryResponses.add(responseDTO);
            return summaryResponses;
        }

        String yearMonth = getYearMonth();
        tenants.forEach(tenant -> {
            Long tenantId = tenant.getTenantId();
            SummaryWeightChargeResponseDTO summaryWeightChargeResponse = new SummaryWeightChargeResponseDTO();
            summaryWeightChargeResponse.setTenantId(tenantId);

            Integer usedNumber = callCountBusinessCardsDigitizedApi(tenant.getTenantName(), yearMonth);
            if (usedNumber == null) {
                // add error
                summaryWeightChargeResponse.setError(new ErrorItemDTO(
                    "count_business_cards_digitized", getMessage(Constants.INTERRUPT_API)));
            } else {
                int paymentType = PaymentStatus.BUSINESS_CARD.getValue();
                // delete old payments_management
                paymentsManagementRepository.deleteByTenantIdAndPaymentTypeAndYearMonth(tenantId,
                    paymentType, yearMonth);

                // 2. insert table payments_management
                PaymentsManagementDTO paymentsManagement = new PaymentsManagementDTO();
                paymentsManagement.setTenantId(tenantId);
                paymentsManagement.setPaymentType(paymentType);
                paymentsManagement.setYearMonth(yearMonth);
                paymentsManagement.setUsedNumber(usedNumber);
                long userId = getUserIdFromToken();
                paymentsManagement.setCreatedUser(userId);
                paymentsManagement.setUpdatedUser(userId);
                paymentsManagementRepository.save(paymentsManagementMapper.toEntity(paymentsManagement));
            }
            summaryResponses.add(summaryWeightChargeResponse);
        });

        return summaryResponses;
    }

    /**
     * Validate parameter.
     *
     * @param contractId  id of contract
     * @param paymentType type of payment
     * @param yearMonth   year-month payment
     * @return list of {@link ErrorDTO}.
     */
    private List<ErrorDTO> validateParam(String contractId, String paymentType, String yearMonth) {
        List<ErrorDTO> errors = new ArrayList<>();
        if (StringUtils.isBlank(contractId)) {
            errors.add(createErrorDTO(Constants.REQUIRED_PARAMETER, "contractId"));
        }

        if (StringUtils.isBlank(yearMonth)) {
            errors.add(createErrorDTO(Constants.REQUIRED_PARAMETER, "yearMonth"));
        } else if (yearMonth.length() > YEAR_MONTH_MAX_LENGTH) {
            errors.add(createErrorDTO(Constants.GREATER_LENGTH_CODE, "yearMonth_" + YEAR_MONTH_MAX_LENGTH));
        }

        if (StringUtils.isBlank(paymentType)) {
            errors.add(createErrorDTO(Constants.REQUIRED_PARAMETER, "paymentType"));
        } else if (!paymentType.matches("\\d+")) {
            errors.add(createErrorDTO(Constants.INTEGER_PARAMETER, "paymentType"));
        }

        return errors;
    }

    /**
     * Create {@link GetWeightChargeResponseDTO}.
     *
     * @param errors list error.
     * @return Create {@link GetWeightChargeResponseDTO}.
     */
    private GetWeightChargeResponseDTO createGetWeightChargeResponseError(List<ErrorDTO> errors) {
        GetWeightChargeResponseDTO responseDTO = new GetWeightChargeResponseDTO();
        responseDTO.setStatus(ResponseStatus.ERROR.getValue());
        responseDTO.setErrors(errors);
        return responseDTO;
    }

    /**
     * Get current year and current month - 1
     *
     * @return string year month with format YYYYMM
     */
    private static String getYearMonth() {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        return oneMonthAgo.getYear() + String.format("%02d", oneMonthAgo.getMonth().getValue());
    }

    /**
     * TODO: Call countBusinessCardsDigitized api.
     *
     * @param tenantName tenantName
     * @param digitalDate digitalDate
     * @return used number
     */
    private Integer callCountBusinessCardsDigitizedApi(String tenantName, String digitalDate) {
        // call api
        try {
            /*
            String apiName = "count-business-cards-digitized";
            String token = SecurityUtils.getTokenValue().orElse(null);
            CountBusinessCardsDigitizedRequest request = new CountBusinessCardsDigitizedRequest(digitalDate);
            CountBusinessCardsDigitizedResponse response = restOperationUtils.executeCallApi(
                    Constants.PathEnum.BUSINESSCARDS, apiName, HttpMethod.POST, request,
                    CountBusinessCardsDigitizedResponse.class, token, tenantName);
            return response.getNumberBusinessCardsDigitized();
            */
            log.info("TODO: callCountBusinessCardsDigitizedApi. tenant_name = {}, digitalDate = {},", tenantName, digitalDate);
            return 1;
        } catch (CustomRestException | IllegalStateException e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
