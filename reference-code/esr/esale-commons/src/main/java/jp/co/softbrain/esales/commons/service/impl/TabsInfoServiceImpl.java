package jp.co.softbrain.esales.commons.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import jp.co.softbrain.esales.commons.domain.TabsInfo;
import jp.co.softbrain.esales.commons.repository.TabsInfoRepository;
import jp.co.softbrain.esales.commons.service.TabsInfoService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO;
import jp.co.softbrain.esales.commons.service.mapper.TabsInfoMapper;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;

/**
 * Service Implementation for managing {@link TabsInfo}.
 *
 * @author buithingocanh
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class TabsInfoServiceImpl implements TabsInfoService {
    private final Logger log = LoggerFactory.getLogger(TabsInfoServiceImpl.class);

    @Autowired
    private TabsInfoRepository tabsInfoRepository;

    @Autowired
    private TabsInfoMapper tabsInfoMapper;

    private static final String VALIDATE_FAIL = "Validate failded.";

    @Autowired
    private ValidateService validateService;

    Gson gson = new Gson();

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TabsInfoService#save(jp.co.softbrain.esales.commons.service.dto.TabsInfoDTO)
     */
    @Override
    public TabsInfoDTO save(TabsInfoDTO tabsInfoDTO) {
        log.debug("Request to save TabsInfo : {}", tabsInfoDTO);
        TabsInfo tabsInfo = tabsInfoMapper.toEntity(tabsInfoDTO);
        tabsInfo = tabsInfoRepository.save(tabsInfo);
        return tabsInfoMapper.toDto(tabsInfo);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TabsInfoService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    public Page<TabsInfoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all TabsInfo");
        return tabsInfoRepository.findAll(pageable).map(tabsInfoMapper::toDto);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TabsInfoService#findOne(java.lang.Long)
     */
    @Override
    public Optional<TabsInfoDTO> findByTabInfoId(Long id) {
        log.debug("Request to get TabsInfo : {}", id);
        return tabsInfoRepository.findByTabInfoId(id).map(tabsInfoMapper::toDto);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TabsInfoService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete TabsInfo : {}", id);
        tabsInfoRepository.deleteById(id);

    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TabsInfoService#getTabsInfo(java.lang.Integer, java.lang.String)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<TabsInfoDTO> getTabsInfo(Integer tabBelong) {
        // 1. validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("tabBelong", tabBelong);

        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> errors = validateService.validate(validateJson);
        if (errors != null && !errors.isEmpty()) {
            throw new CustomException(VALIDATE_FAIL, errors);
        }

        List<TabsInfo> lstTabsInfo = tabsInfoRepository.getTabsInfo(tabBelong);
        // 2. Get list fieldInfoTabs
        return tabsInfoMapper.toDto(lstTabsInfo);
    }
}
