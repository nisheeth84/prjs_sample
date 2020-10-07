package jp.co.softbrain.esales.uaa.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomGraphQLException;
import jp.co.softbrain.esales.uaa.config.ConstantsUaa;
import jp.co.softbrain.esales.uaa.domain.IpAddress;
import jp.co.softbrain.esales.uaa.repository.IpAddressRepository;
import jp.co.softbrain.esales.uaa.security.SecurityUtils;
import jp.co.softbrain.esales.uaa.service.IpAddressService;
import jp.co.softbrain.esales.uaa.service.dto.CheckAccessIpAddressesOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.GetIpAddressesOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.IpAddressDTO;
import jp.co.softbrain.esales.uaa.service.dto.UpdatedIpAddressesOutDTO;
import jp.co.softbrain.esales.uaa.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.uaa.service.mapper.IpAddressMapper;
import jp.co.softbrain.esales.uaa.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Implementation for managing {@link IpAddress}.
 *
 * @author QuangLV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class IpAddressServiceImpl implements IpAddressService {

    private final IpAddressRepository ipAddressRepository;

    private IpAddressMapper ipAddressMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    private static final String VALIDATE_MSG_FAILED = "Validate failed";

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
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#save(jp.co.softbrain.esales.uaa.service.dto.IpAddressDTO)
     */
    @Override
    public IpAddressDTO save(IpAddressDTO ipAddressDTO) {
        IpAddress ipAddress = ipAddressMapper.toEntity(ipAddressDTO);
        ipAddress = ipAddressRepository.save(ipAddress);
        return ipAddressMapper.toDto(ipAddress);
    }

    /**
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<IpAddressDTO> findAll() {
        return ipAddressRepository.findAll().stream().map(ipAddressMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#findOne(Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<IpAddressDTO> findOne(Long id) {
        return ipAddressRepository.findById(id).map(ipAddressMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#delete(Long)
     */
    @Override
    public void delete(Long id) {
        ipAddressRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#getIpAddresses()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetIpAddressesOutDTO getIpAddresses() {

        GetIpAddressesOutDTO response = new GetIpAddressesOutDTO();

        // 1. Get list IPAddress
        List<IpAddress> lstIpAddresses = ipAddressRepository.findAll(Sort.by(Sort.Direction.ASC, "ipAddressId"));

        List<IpAddressDTO> ipAddresses = lstIpAddresses.stream().map(ipAddressMapper::toDto)
                .collect(Collectors.toList());

        // 2. Create data response
        response.setIpAddresses(ipAddresses);
        return response;

    }

    /**
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#updatePositions(List<jp.co.softbrain.esales.uaa.service.
     *      dto.IpAddressDTO>,List<Long>)
     */
    @Override
    @Transactional
    public UpdatedIpAddressesOutDTO updateIpAddresses(List<IpAddressDTO> data, List<Long> deletedIpAddresses) {

        UpdatedIpAddressesOutDTO response = new UpdatedIpAddressesOutDTO();
        List<Long> lstIdDelete = new ArrayList<>();
        List<Long> lstIdInsert = new ArrayList<>();
        List<Long> lstIdUpdate = new ArrayList<>();

        // 1. Check authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomGraphQLException("User does not have permision", ConstantsUaa.COLUMN_NAME_USER_ID,
                    Constants.USER_NOT_PERMISSION);
        }

        // 2. Validate parameter
        List<String> ipAddresses = new ArrayList<>();
        for (IpAddressDTO dto : data) {
            ipAddresses.add(dto.getIpAddress());
        }

        // Call API validate
        validateCommonParameter(ipAddresses);

        // Validate check duplicate IP
        for (IpAddressDTO dto : data) {
            if (checkDuplicateIpAddresses(dto).equals(FALSE))
                throw new CustomGraphQLException("duplicate IP address", UPDATE_IP_ADDRESSES, ConstantsUaa.DUPLICATE);
        }

        // 3. Delete IpAddresses
        if (deletedIpAddresses != null && !deletedIpAddresses.isEmpty()) {
            List<IpAddress> iPAddresses = ipAddressRepository.findByIpAddressIdIn(deletedIpAddresses);
            ipAddressRepository.deleteByIpAddresses(deletedIpAddresses);
            lstIdDelete = iPAddresses.stream().map(IpAddress::getIpAddressId).collect(Collectors.toList());
        }

        // 4. Insert Update IPAddresses
        if (data != null && !data.isEmpty()) {
            for (IpAddressDTO dto : data) {
                // 4.1. Insert IPAdresses
                if (NUMBER_ZERO.equals(dto.getIpAddressId())) {
                    lstIdInsert.add(saveToEntity(dto));
                }

                // 4.2. Update IPAdresses
                else {
                    this.findOne(dto.getIpAddressId())
                            .filter(ipAddressDTO -> ipAddressDTO.getUpdatedDate().equals(dto.getUpdatedDate()))
                            .ifPresentOrElse(ipAddressDTO -> lstIdUpdate.add(saveToEntity(dto)), () -> {
                                throw new CustomGraphQLException("error-exclusive", UPDATE_IP_ADDRESSES,
                                        Constants.EXCLUSIVE_CODE);
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
     * @see jp.co.softbrain.esales.uaa.service
     *      IpAddressService#checkAccessIpAddresses(String)
     */
    @Override
    public CheckAccessIpAddressesOutDTO checkAccessIpAddresses(String ipAddress) {
        CheckAccessIpAddressesOutDTO response = new CheckAccessIpAddressesOutDTO();

        // 1. Validate parameter input
        if (ipAddress == null || ipAddress.isEmpty()) {
            throw new CustomGraphQLException("Param [ipAddress] is null.", "checkAccessIPAddresses",
                    Constants.RIQUIRED_CODE);
        }

        // 2. Count IP address
        Long result = ipAddressRepository.countIpAddress(ipAddress).longValue();
        if (!NUMBER_ZERO.equals(result))
            response.setIsAccept(TRUE);
        else
            response.setIsAccept(FALSE);

        // 3. Create data response
        return response;
    }

    /**
     * checkDuplicateIpAddresses : check duplicate IP address
     *
     * @param dto : data parameter
     * @return Boolean : return false if IP address existed
     */
    private final Boolean checkDuplicateIpAddresses(IpAddressDTO dto) {
        Boolean checkExistIpAddress = true;
        Long resultCheck = ipAddressRepository.countIpAddress(dto.getIpAddress()).longValue();
        if (!NUMBER_ZERO.equals(dto.getIpAddressId())) {
            Optional<IpAddressDTO> ipAddress = this.findOne(dto.getIpAddressId());
            if (ipAddress.isPresent() && !dto.getIpAddress().equals(ipAddress.get().getIpAddress())
                    && resultCheck > NUMBER_ZERO) {
                checkExistIpAddress = FALSE;
            }
        } else {
            if (resultCheck > NUMBER_ZERO) {
                checkExistIpAddress = FALSE;
            }
        }
        return checkExistIpAddress;
    }

    /**
     * saveToEntity : insert or update IP addresses to entity
     *
     * @param dto : data insert or update IpAddress
     * @return Long : IP address id return when inserted or updated
     */
    private Long saveToEntity(IpAddressDTO dto) {
        IpAddress entity = ipAddressMapper.toEntity(dto);
        if (NUMBER_ZERO.equals(dto.getIpAddressId())) {
            entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            entity.setIpAddressId(null);
        } else {
            entity.setIpAddressId(dto.getIpAddressId());
        }
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
        // Validate commons
        ValidateResponse validateResponse = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS, "validate", HttpMethod.POST, validateJson,
                ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (validateResponse.getErrors() != null && !validateResponse.getErrors().isEmpty()) {
            throw new CustomGraphQLException(VALIDATE_MSG_FAILED, validateResponse.getErrors());
        }
    }
}
