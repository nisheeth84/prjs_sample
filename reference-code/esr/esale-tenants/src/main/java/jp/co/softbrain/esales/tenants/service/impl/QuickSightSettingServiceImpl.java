package jp.co.softbrain.esales.tenants.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.tenants.domain.QuickSightSettings;
import jp.co.softbrain.esales.tenants.repository.QuickSightSettingsRepository;
import jp.co.softbrain.esales.tenants.service.QuickSightSettingService;
import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;
import jp.co.softbrain.esales.tenants.service.dto.QuickSightSettingsDTO;
import jp.co.softbrain.esales.tenants.service.mapper.QuickSightSettingsMapper;

/**
 * Service implementation for {@link QuickSightSettingService}
 *
 * @author tongminhcuong
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class QuickSightSettingServiceImpl implements QuickSightSettingService {

    @Autowired
    private QuickSightSettingsRepository quickSightSettingsRepository;

    @Autowired
    private QuickSightSettingsMapper quickSightSettingsMapper;

    /**
     * @see QuickSightSettingService#save(QuickSightSettingsDTO)
     */
    @Override
    @Transactional
    public QuickSightSettingsDTO save(QuickSightSettingsDTO quickSightSettingsDTO) {
        QuickSightSettings quickSightSettings = quickSightSettingsMapper.toEntity(quickSightSettingsDTO);
        quickSightSettings = quickSightSettingsRepository.save(quickSightSettings);
        return quickSightSettingsMapper.toDto(quickSightSettings);
    }

    /**
     * @see QuickSightSettingService#findQuickSightSettingByTenantName(String)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<GetQuickSightSettingDTO> findQuickSightSettingByTenantName(String tenantName) {
        return quickSightSettingsRepository.findQuickSightSettingByTenantName(tenantName);
    }
}
