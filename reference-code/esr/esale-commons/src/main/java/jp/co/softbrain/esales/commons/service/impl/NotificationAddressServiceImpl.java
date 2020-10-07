package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.NotificationAddress;
import jp.co.softbrain.esales.commons.repository.NotificationAddressRepository;
import jp.co.softbrain.esales.commons.service.NotificationAddressService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.NotificationAddressDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateNotificationAddressOutDTO;
import jp.co.softbrain.esales.commons.service.mapper.NotificationAddressMapper;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;

/**
 * Service Implementation for managing {@link NotificationAddress}.
 *
 * @author QuangLV
 */
@Service
@Transactional
public class NotificationAddressServiceImpl implements NotificationAddressService {

    private final NotificationAddressRepository notificationAddressRepository;

    private final NotificationAddressMapper notificationAddressMapper;

    @Autowired
    private ValidateService validateService;

    private static final String UPDATE_NOTIFICATION_ADDRESS = "updateNotificationAddress";
    private static final String VALIDATE_FAIL = "validate fail";
    private static final String DATA_NOT_EXISTED = "DATA_NOT_EXISTED";

    /**
     * function constructor of class NotificationAddressServiceImpl
     *
     * @param notificationAddressRepository : NotificationAddressRepository
     * @param notificationAddressMapper : NotificationAddressMapper
     */
    public NotificationAddressServiceImpl(NotificationAddressRepository notificationAddressRepository,
            NotificationAddressMapper notificationAddressMapper) {
        this.notificationAddressRepository = notificationAddressRepository;
        this.notificationAddressMapper = notificationAddressMapper;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationAddressService#save(jp.co.softbrain.esales.commons.service.dto.NotificationAddressDTO)
     */
    @Override
    public NotificationAddressDTO save(NotificationAddressDTO notificationAddressDTO) {
        NotificationAddress notificationAddress = notificationAddressMapper.toEntity(notificationAddressDTO);
        notificationAddress = notificationAddressRepository.save(notificationAddress);
        return notificationAddressMapper.toDto(notificationAddress);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationAddressService#findAll()
     */
    @Override
    @Transactional(readOnly = true)
    public List<NotificationAddressDTO> findAll() {
        return notificationAddressRepository.findAll().stream().map(notificationAddressMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationAddressService#findOne(Long)
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationAddressDTO> findOne(Long id) {
        return notificationAddressRepository.findById(id).map(notificationAddressMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationAddressService#delete(Long)
     */
    @Override
    public void delete(Long id) {
        notificationAddressRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service
     *      NotificationAddressService#updateNotificationAddress(Long, Long,
     *      Instant, Instant)
     */
    @Override
    @Transactional
    public UpdateNotificationAddressOutDTO updateNotificationAddress(Long employeeId, Long notificationId,
            Instant updatedDate) {

        // 1. Validate parameter

        // 1.1. Call API common validate
        validateCommonParameter(employeeId, notificationId);

        UpdateNotificationAddressOutDTO response = new UpdateNotificationAddressOutDTO();

        // 1.2. Validate other
        NotificationAddress notificationAddress = notificationAddressRepository
                .findByEmployeeIdAndNotificationId(employeeId, notificationId);
        if (notificationAddress == null) {
            throw new CustomException("data not existed", UPDATE_NOTIFICATION_ADDRESS, DATA_NOT_EXISTED);
        }

        // 2. Update notification address

        if (notificationAddress.getUpdatedDate().equals(updatedDate)) {
            notificationAddressRepository.updateConfirmDateNotificationAddress(employeeId, notificationId, employeeId);
            response.setEmployeeId(employeeId);
        } else {
            throw new CustomException("error-exclusive", UPDATE_NOTIFICATION_ADDRESS, Constants.EXCLUSIVE_CODE);
        }

        // 3. Create data response
        return response;
    }

    /**
     * validateCommonParameter : call API validate common
     *
     * @param employeeId : employee id
     * @param notificationId : notification id
     */
    private void validateCommonParameter(Long employeeId, Long notificationId) {
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("employeeId", employeeId);
        fixedParams.put("notificationId", notificationId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        // json for validate common and call method validate common
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomException(VALIDATE_FAIL, lstError);
        }
    }
}
