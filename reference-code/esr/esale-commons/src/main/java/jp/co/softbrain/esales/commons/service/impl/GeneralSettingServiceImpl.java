/**
 *
 */
package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.GeneralSetting;
import jp.co.softbrain.esales.commons.repository.GeneralSettingRepository;
import jp.co.softbrain.esales.commons.security.SecurityUtils;
import jp.co.softbrain.esales.commons.service.GeneralSettingService;
import jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.UpdateGeneralSettingOutDTO;
import jp.co.softbrain.esales.commons.service.mapper.GeneralSettingMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Class handle the service method, implement from
 * {@link GeneralSettingService}
 *
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class GeneralSettingServiceImpl implements GeneralSettingService {

    private static final Long NUMBER_ZERO = 0L;

    private static final String ERR_COM_0007 = "ERR_COM_0007";

    private static final String CUSTOMER_CAPTION = "customerCaption";

    private static final String UPDATED_DATE = "updatedDate";

    @Autowired
    private GeneralSettingMapper generalSettingMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private GeneralSettingRepository generalSettingRepository;

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#save(jp.co.softbrain.esales.commons.service.dto.GeneralSettingDTO)
     */
    @Override
    public GeneralSettingDTO save(GeneralSettingDTO generalSettingDTO) {
        GeneralSetting entity = generalSettingMapper.toEntity(generalSettingDTO);
        entity = generalSettingRepository.save(entity);
        return generalSettingMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<GeneralSettingDTO> findAll(Pageable pageable) {
        return generalSettingRepository.findAll(pageable).map(generalSettingMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<GeneralSettingDTO> findOne(Long id) {
        return generalSettingRepository.findByGeneralSettingId(id).map(generalSettingMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        generalSettingRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#getGeneralSetting(java.lang.String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public GeneralSettingDTO getGeneralSetting(String settingName) {
        return generalSettingRepository.findBySettingName(settingName) != null ? generalSettingMapper.toDto(generalSettingRepository.findBySettingName(settingName)) : new GeneralSettingDTO();
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.GeneralSettingService#updateGeneralSetting(java.lang.Long
     *      ,java.lang.String
     *      ,java.lang.String
     *      ,java.time.Instant)
     */
    @Override
    @Transactional
    public UpdateGeneralSettingOutDTO updateGeneralSetting(Long generalSettingId, String settingName,
                                                           String settingValue , Instant updatedDate) {
        UpdateGeneralSettingOutDTO response = new UpdateGeneralSettingOutDTO();
        // 1. check authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permission.", CommonUtils.putError(CUSTOMER_CAPTION, ERR_COM_0007));
        }
        // 2. Validate parameter
        if (settingValue == null || settingValue.isEmpty()) {
            throw new CustomRestException("param [settingValue] is null", CommonUtils.putError(ConstantsCommon.SETTING_VALUE, Constants.RIQUIRED_CODE));
        }
        // 3. Insert data general setting
        GeneralSettingDTO generalSetting = new GeneralSettingDTO();
        if (generalSettingId == null || generalSettingId.equals(NUMBER_ZERO)) {
            generalSetting.setSettingName(settingName);
            generalSetting.setSettingValue(settingValue);
            generalSetting.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            generalSetting.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            response.setGeneralSettingId(this.save(generalSetting).getGeneralSettingId());
        }
        // 4. Update data general setting
        else{
            this.findOne(generalSettingId)
                .filter(generalSettingDTO -> generalSettingDTO.getUpdatedDate().equals(updatedDate))
                .ifPresentOrElse(generalSettingDTO -> {
                    generalSettingDTO.setSettingValue(settingValue);
                    generalSettingDTO.setSettingName(settingName);
                    generalSettingDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                    response.setGeneralSettingId(this.save(generalSettingDTO).getGeneralSettingId());
                }, () -> {
                    throw new CustomRestException("error-exclusive", CommonUtils.putError(UPDATED_DATE, Constants.EXCLUSIVE_CODE));
                });
            }
        return response;
    }
}
