package jp.co.softbrain.esales.commons.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.config.ApplicationProperties;
import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.AccessLog;
import jp.co.softbrain.esales.commons.repository.AccessLogRepository;
import jp.co.softbrain.esales.commons.repository.AccessLogRepositoryCustom;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.AccessLogService;
import jp.co.softbrain.esales.commons.service.ListViewSettingsService;
import jp.co.softbrain.esales.commons.service.UploadFileService;
import jp.co.softbrain.esales.commons.service.dto.AccessLogDTO;
import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsInDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsSubType3DTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsSubType4DTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoSubType1DTO;
import jp.co.softbrain.esales.commons.service.dto.GetInitializeListInfoSubType2DTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultExportDataAccessLogsDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultGetDataAccessLogsDTO;
import jp.co.softbrain.esales.commons.service.mapper.AccessLogMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FileExtension;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.commons.ValidateResponse;

/**
 * Service Implementation for managing {@link AccessLog}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class AccessLogServiceImpl implements AccessLogService {

    private final Logger log = LoggerFactory.getLogger(AccessLogServiceImpl.class);

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AccessLogRepository accessLogRepository;

    @Autowired
    private ListViewSettingsService listViewSettingsService;

    @Autowired
    private AccessLogRepositoryCustom accessLogRepositoryCustom;

    @Autowired
    private AccessLogMapper accessLogMapper;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    UploadFileService uploadFileService;

    @Autowired
    private RestOperationUtils restOperationUtils;

    private static final Boolean FALSE = false;

    private static final Boolean TRUE = true;

    private static final String GET_ACCESS_LOGS = "getAccessLogs";
    private static final String ENCLOSURE = "\"";
    private static final String FILE_NAME_DOWNLOAD_ACCESS_LOG = "LOG_ACCESS";
    private static final String NEW_LINE_CHAR = "\n";
    private static final String VALIDATE_FAIL = "validate fail";
    private static final String URL_API_VALIDATE = "validate";

    /**
     * Save a accessLog.
     *
     * @param accessLogDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public AccessLogDTO save(AccessLogDTO accessLogDTO) {
        log.debug("Request to save AccessLog : {}", accessLogDTO);
        AccessLog accessLog = accessLogMapper.toEntity(accessLogDTO);
        accessLog = accessLogRepository.save(accessLog);
        return accessLogMapper.toDto(accessLog);
    }

    /**
     * Get all the accessLogs.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<AccessLogDTO> findAll() {
        log.debug("Request to get all AccessLogs");
        return accessLogRepository.findAll().stream().map(accessLogMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one accessLog by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<AccessLogDTO> findOne(Long id) {
        log.debug("Request to get AccessLog : {}", id);
        return accessLogRepository.findById(id).map(accessLogMapper::toDto);
    }

    /**
     * Delete the accessLog by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AccessLog : {}", id);
        accessLogRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      AccessLogService#exportAccessLogs(java.lang.String
     *      ,java.lang.String
     *      ,java.lang.String
     *      ,java.util.List<java.lang.String>
     *      ,java.util.List<java.lang.String>)
     */
    @Override
    public String exportAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions, List<OrderByDTO> orderBy) {
        // 1. get information header
        List<List<String>> lstResponse = new ArrayList<>();
        List<String> nameHeader = accessLogRepositoryCustom.getHeaderAccessLogs();

        // 2 get list access logs
        String dateFromCustom = null;
        String dateToCustom = null;
        String searchLocalCustom = null;
        if (dateFrom != null) {
            dateFromCustom = "'" + dateFrom + "'";
        }
        if (dateTo != null) {
            dateToCustom = "'" + dateTo + "'";
        }
        if (searchLocal != null) {
            searchLocalCustom = "'%" + searchLocal + "%'";
        }
        List<ResultExportDataAccessLogsDTO> accessLogs = accessLogRepositoryCustom.exportAccessLogs(dateFromCustom,
                dateToCustom, searchLocalCustom, filterConditions, orderBy);
        for (ResultExportDataAccessLogsDTO resultGetDataAccessLogsDTO : accessLogs) {
            List<String> resultAccessLogs = new ArrayList<>();
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getAccountName());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getAdditionalInformation());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getDateTime());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getEntityId());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getErrorInformation());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getEvent());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getIpAddress());
            resultAccessLogs.add(resultGetDataAccessLogsDTO.getResult());
            lstResponse.add(resultAccessLogs);
        }

        // 3 create data response
        List<String> responseCSV = new ArrayList<>();
        List<String> bodyCSV = new ArrayList<>();
        responseCSV.add(String.join(ConstantsCommon.COMMA, nameHeader));

        lstResponse.stream().forEach(contentItem -> {
            bodyCSV.clear();
            contentItem.stream().forEach(
                    field -> bodyCSV.add(ENCLOSURE + field.replace(ENCLOSURE, ENCLOSURE + ENCLOSURE) + ENCLOSURE));
            responseCSV.add(String.join(ConstantsCommon.COMMA, bodyCSV));
        });

        return uploadFileService.copyFileToS3(FILE_NAME_DOWNLOAD_ACCESS_LOG, FileExtension.CSV,
                String.join(NEW_LINE_CHAR, responseCSV));
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      AccessLogService#exportAccessLogs(jp.co.softbrain.esales.commons.service.dto.GetAccessLogsInDTO)
     */
    @Override
    public GetAccessLogsOutDTO getAccessLogs(GetAccessLogsInDTO accessLog) {
        GetAccessLogsOutDTO response = new GetAccessLogsOutDTO();
        // 1. Validate parameter
        // 1.1 Call API validate
        validateCommonParameter(accessLog.getLimit(), accessLog.getOffset());

        // 1.2. Validate dateFrom and dateTo
        if (accessLog.getDateFrom() != null && !StringUtils.isBlank(accessLog.getDateFrom())
                && !StringUtils.isBlank(accessLog.getDateTo()) && accessLog.getDateTo() != null
                && compareDate(accessLog.getDateFrom(), accessLog.getDateTo()).equals(FALSE)) {
            throw new CustomRestException("dateTo after dateFrom",
                    CommonUtils.putError(GET_ACCESS_LOGS, ConstantsCommon.DATE_TO_AFTER_DATE_FROM));
        }

        // 2. Call API getInitializeListInfo
        GetInitializeListInfoOutDTO initializeList = new GetInitializeListInfoOutDTO();
        if (!accessLog.getIsInitialInfo().equals(FALSE)) {
            try {
                Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
                String langCode = jwtTokenUtil.getLanguageCodeFromToken();
                initializeList = listViewSettingsService.getInitializeListInfo(FieldBelongEnum.LOG_ACCESS.getCode(),
                        employeeId, langCode);
            } catch (Exception e) {
                throw new CustomRestException("connect failed API getInitializeListInfo",
                        CommonUtils.putError(GET_ACCESS_LOGS, Constants.CONNECT_FAILED_CODE));
            }
        }

        // 3. Get list log access

        // 3.1. Get condition search.
        if (accessLog.getIsInitialInfo().equals(TRUE) && initializeList.getInitializeInfo() != null) {
            GetInitializeListInfoSubType1DTO initializeInfo = initializeList.getInitializeInfo();
            List<GetInitializeListInfoSubType2DTO> listFilter = initializeInfo.getFilterListConditions();
            if (listFilter != null) {
                listFilter.forEach(lstfil -> lstfil.getFilterConditions().forEach(fil -> {
                    FilterConditionsDTO filter = new FilterConditionsDTO();
                    filter.setFieldName(fil.getFieldName());
                    filter.setFieldType(fil.getFieldType().toString());
                    filter.setFieldValue(fil.getFieldValue());
                    filter.setFilterOption(fil.getSearchOption());
                    filter.setFilterType(fil.getSearchType());
                    accessLog.getFilterConditions().add(filter);
                }));
            }
        }
        // 3.2. Get total record satisfy condition parameter
        String searchLocalCustom = accessLog.getSearchLocal();
        if (accessLog.getSearchLocal() != null && !StringUtils.isBlank(accessLog.getSearchLocal())) {
            searchLocalCustom = "'%" + accessLog.getSearchLocal() + "%'";
        }
        Long totalCount = accessLogRepositoryCustom.countAccessLogs(accessLog.getDateFrom(), accessLog.getDateTo(),
                searchLocalCustom, accessLog.getFilterConditions());

        // 3.3. Get list accessLog

        List<GetAccessLogsSubType3DTO> lstSubType3DTO = new ArrayList<>();
        List<ResultGetDataAccessLogsDTO> accessLogs = accessLogRepositoryCustom.getAccessLogs(accessLog);
        accessLogs.forEach(dto -> {
            GetAccessLogsSubType3DTO subType3DTO = new GetAccessLogsSubType3DTO();
            GetAccessLogsSubType4DTO subType4DTO = new GetAccessLogsSubType4DTO();
            subType4DTO.setDateTime(dto.getDateTime());
            subType4DTO.setEmployeeId(dto.getEmployeeId());
            subType4DTO.setAccountName(dto.getAccountName());
            subType4DTO.setIpAddress(dto.getIpAddress());
            subType4DTO.setEvent(dto.getEvent());
            subType4DTO.setErrorInformation(dto.getErrorInformation());
            subType4DTO.setEntityId(dto.getEntityId());
            subType4DTO.setAdditionalInformation(dto.getAdditionalInformation());
            subType3DTO.setAccessLogId(dto.getAccessLogId());
            subType3DTO.setContent(subType4DTO);
            lstSubType3DTO.add(subType3DTO);
        });
        // 4. Create data response
        response.setAccessLogs(lstSubType3DTO);
        response.setTotalCount(totalCount);
        return response;
    }

    /**
     * compareDate : compare date
     *
     * @param dateFrom : date from
     * @param dateTo : date to
     * @return Boolean : true or false
     */
    private Boolean compareDate(String dateFrom, String dateTo) {
        Boolean response = TRUE;
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd");
            Date dateFromConvert = format.parse(dateFrom);
            Date dateToConvert = format.parse(dateTo);
            Boolean resultCompare = dateToConvert.after(dateFromConvert);
            if (resultCompare.equals(FALSE)) {
                response = FALSE;
            }
        } catch (Exception e) {
            throw new CustomRestException("Error convert Date", CommonUtils.putError(GET_ACCESS_LOGS, e.getMessage()));
        }
        return response;
    }

    /**
     * validateCommonParameter : call API validate common
     *
     * @param limit : limit
     * @param offet : offet
     */
    private void validateCommonParameter(Long limit, Long offet) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("limit", limit);
        fixedParams.put("offet", offet);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, validateJson, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, responseValidate.getErrors());
        }

    }
}
