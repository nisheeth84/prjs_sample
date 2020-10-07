package jp.co.softbrain.esales.tenants.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.domain.IpAddress;
import jp.co.softbrain.esales.tenants.repository.IpAddressRepository;
import jp.co.softbrain.esales.tenants.repository.IpAddressRepositoryCustom;
import jp.co.softbrain.esales.tenants.repository.TenantsRepository;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.tenants.service.IpAddressService;
import jp.co.softbrain.esales.tenants.service.dto.CheckAccessIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.IpAddressDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdatedIpAddressesOutDTO;
import jp.co.softbrain.esales.tenants.service.mapper.IpAddressMapper;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.tenants.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import jp.co.softbrain.esales.utils.dto.commons.ValidateResponse;

/**
 * Service Implementation for managing {@link IpAddress}.
 *
 * @author QuangLV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class IpAddressServiceImpl implements IpAddressService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private final IpAddressRepository ipAddressRepository;

    @Autowired
    private IpAddressMapper ipAddressMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private IpAddressRepositoryCustom ipAddressRepositoryCustom;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private TenantsRepository tenantsRepository;

    private static final Long NUMBER_ZERO = 0L;

    private static final Boolean FALSE = false;

    private static final Boolean TRUE = true;

    private static final String UPDATE_IP_ADDRESSES = "updateIpAddresses";

    /**
     * function constructor of IpAddressServiceImpl class
     *
     * @param ipAddressRepository
     * @param ipAddressMapper
     */
    public IpAddressServiceImpl(IpAddressRepository ipAddressRepository, IpAddressMapper ipAddressMapper) {
        this.ipAddressRepository = ipAddressRepository;
        this.ipAddressMapper = ipAddressMapper;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#save(jp.co.softbrain.esales.employees.service.dto.IpAddressDTO)
     */
    @Override
    public IpAddressDTO save(IpAddressDTO ipAddressDTO) {
        IpAddress ipAddress = ipAddressMapper.toEntity(ipAddressDTO);
        ipAddress = ipAddressRepository.save(ipAddress);
        return ipAddressMapper.toDto(ipAddress);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<IpAddressDTO> findAll() {
        return ipAddressRepository.findAll().stream().map(ipAddressMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#findOne(Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<IpAddressDTO> findOne(Long id) {
        return ipAddressRepository.findByIpAddressId(id).map(ipAddressMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#delete(Long)
     */
    @Override
    public void delete(Long id) {
        ipAddressRepository.deleteByIpAddressId(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#getIpAddresses()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetIpAddressesOutDTO getIpAddresses() {

        GetIpAddressesOutDTO response = new GetIpAddressesOutDTO();
        List<GetIpAddressesResponseDTO> lstIpAddress = new ArrayList<>();
        // 1. Get list IPAddress
        // 1.1. Get information tenant
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        // 1.2. Get list IPAddress
        List<GetIpAddressesResponseDTO> lstIp = ipAddressRepositoryCustom.getIpAddresses(tenantName);

        lstIp.forEach(ip -> {
            GetIpAddressesResponseDTO dto = new GetIpAddressesResponseDTO();
            dto.setIpAddressId(ip.getIpAddressId());
            dto.setIpAddress(ip.getIpAddress());
            dto.setUpdatedDate(ip.getUpdatedDate());
            lstIpAddress.add(dto);
        });

        // 2. Create data response
        response.setIpAddresses(lstIp);
        return response;

    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#updatePositions(List<jp.co.softbrain.esales.employees.service.
     *      dto.IpAddressDTO>,List<Long>)
     */
    @Override
    @Transactional
    public UpdatedIpAddressesOutDTO updateIpAddresses(List<IpAddressDTO> dataInput, List<Long> deletedIpAddresses) {
        // 1. Check authority
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permision",
                    CommonUtils.putError(ConstantsTenants.COLUMN_NAME_USER_ID, Constants.USER_NOT_PERMISSION));
        }

        UpdatedIpAddressesOutDTO response = new UpdatedIpAddressesOutDTO();
        if ((dataInput == null || dataInput.isEmpty()) && (deletedIpAddresses == null || deletedIpAddresses.isEmpty())) {
            return response;
        }

        List<Long> lstIdDelete = new ArrayList<>();
        List<Long> lstIdInsert = new ArrayList<>();
        List<Long> lstIdUpdate = new ArrayList<>();

        List<IpAddressDTO> data = new ArrayList<>(dataInput);
        List<IpAddressDTO> ipRemove = new ArrayList<>();
        for (IpAddressDTO ip : data) {
            if (StringUtils.isEmpty(ip.getIpAddress()) && ip.getIpAddressId() != 0) {
                deletedIpAddresses.add(ip.getIpAddressId());
            }
            if (StringUtils.isEmpty(ip.getIpAddress()) || deletedIpAddresses.contains(ip.getIpAddressId())) {
                ipRemove.add(ip);
            }
        }
        data.removeAll(ipRemove);

        // 2. Validate parameter
        List<String> ipAddresses = new ArrayList<>();
        for (IpAddressDTO dto : data) {
            ipAddresses.add(dto.getIpAddress());
        }

        // Call API validate
        validateCommonParameter(ipAddresses);

        // Validate check duplicate IP
        Set<String> ipAddressSet = new HashSet<>(ipAddresses);
        if (ipAddressSet.size() != ipAddresses.size()) {
            throw new CustomRestException("duplicate IP address",
                    CommonUtils.putError(UPDATE_IP_ADDRESSES, ConstantsTenants.DUPLICATE));
        }

        // 3. Delete IpAddresses
        if (deletedIpAddresses != null && !deletedIpAddresses.isEmpty()) {
            List<IpAddress> iPAddresses = ipAddressRepository.findByIpAddressIdIn(deletedIpAddresses);
            ipAddressRepository.deleteByIpAddresses(deletedIpAddresses);
            lstIdDelete = iPAddresses.stream().map(IpAddress::getIpAddressId).collect(Collectors.toList());
        }

        // 4. Insert Update IPAddresses
        // 4.1. Insert IPAddresses
        // 4.1. Get information tenant_id
        Long tenantId = tenantsRepository.getByTenantName(tenantName);
        if (data != null && !data.isEmpty()) {
            for (IpAddressDTO dto : data) {
                // 4.1. Insert IPAdresses
                if (NUMBER_ZERO.equals(dto.getIpAddressId())) {
                    lstIdInsert.add(saveToEntity(dto, tenantId));
                }

                // 4.2. Update IPAdresses
                else {
                    this.findOne(dto.getIpAddressId())
                            .filter(ipAddressDTO -> ipAddressDTO.getUpdatedDate().equals(dto.getUpdatedDate()))
                            .ifPresent(ipAddressDTO -> {
                                IpAddress entity = new IpAddress();
                                entity.setIpAddressId(ipAddressDTO.getIpAddressId());
                                entity.setTenantId(ipAddressDTO.getTenantId());
                                entity.setIpAddress(dto.getIpAddress());
                                entity.setCreatedUser(dto.getCreatedUser());
                                entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                                ipAddressRepository.save(entity);
                                lstIdUpdate.add(entity.getIpAddressId());
                            });
                }
            }
        }

        // 5. Create data response
        response.setDeletedIpAddresses(lstIdDelete);
        response.setInsertedIpAddresses(lstIdInsert);
        response.setUpdatedIpAddresses(lstIdUpdate);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service
     *      IpAddressService#checkAccessIpAddresses(String)
     */
    @Override
    public CheckAccessIpAddressesOutDTO checkAccessIpAddresses(String ipAddress) {
        CheckAccessIpAddressesOutDTO response = new CheckAccessIpAddressesOutDTO();

        // 1. Validate parameter input
        if (ipAddress == null || ipAddress.isEmpty()) {
            throw new CustomRestException("Param [ipAddress] is null.",
                    CommonUtils.putError("checkAccessIPAddresses", Constants.RIQUIRED_CODE));
        }

        // 2. Count IP address
        Long result = ipAddressRepository.countIpAddress(ipAddress);
        if (!NUMBER_ZERO.equals(result))
            response.setIsAccept(TRUE);
        else
            response.setIsAccept(FALSE);

        // 3. Create data response
        return response;
    }

    /**
     * saveToEntity : insert or update IP addresses to entity
     *
     * @param dto : data insert or update IpAddress
     * @param tenantId : tenant id
     * @return Long : IP address id return when inserted or updated
     */
    private Long saveToEntity(IpAddressDTO dto, Long tenantId) {
        IpAddress entity = new IpAddress();
        entity.setIpAddressId(null);
        entity.setTenantId(tenantId);
        entity.setIpAddress(dto.getIpAddress());
        entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        ipAddressRepository.save(entity);
        return entity.getIpAddressId();
    }

    /**
     * validateCommonParameter : call API validate common
     *
     * @param ipAddress : list IP address
     */
    private void validateCommonParameter(List<String> ipAddress) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("ipAddress", ipAddress);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        // json for validate common and call method validate common

        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse response = null;
        try {
            // Validate commons
            ValidateRequest validateRequest = new ValidateRequest(validateJson);
            response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, ConstantsTenants.URL_API_VALIDATE,
                    HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
        } catch (RuntimeException e) {
            log.error(e.getLocalizedMessage());
        }
        if (response != null && response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsTenants.VALIDATE_MSG_FAILED, response.getErrors().get(0));
        }
    }
}
