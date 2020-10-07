package jp.co.softbrain.esales.commons.service.impl;

import java.lang.reflect.Type;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import jp.co.softbrain.esales.commons.domain.ImportSetting;
import jp.co.softbrain.esales.commons.repository.ImportSettingRepository;
import jp.co.softbrain.esales.commons.service.ImportSettingService;
import jp.co.softbrain.esales.commons.service.dto.ImportDataDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingGetDTO;
import jp.co.softbrain.esales.commons.service.mapper.ImportSettingGetDTOMapper;
import jp.co.softbrain.esales.commons.service.mapper.ImportSettingMapper;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportSettingRequest;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link ImportSetting}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ImportSettingServiceImpl implements ImportSettingService {

    private final ImportSettingRepository importSettingRepository;

    private final ImportSettingMapper importSettingMapper;
    
    private final ImportSettingGetDTOMapper importSettingGetDTOMapper;

    Gson gson = new Gson();

    public ImportSettingServiceImpl(ImportSettingRepository importSettingRepository,
            ImportSettingMapper importSettingMapper,
            ImportSettingGetDTOMapper importSettingGetDTOMapper) {
        this.importSettingRepository = importSettingRepository;
        this.importSettingMapper = importSettingMapper;
        this.importSettingGetDTOMapper = importSettingGetDTOMapper;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportSettingService#save(ImportSettingDTO)
     */
    @Override
    public ImportSettingDTO save(ImportSettingDTO dto) {
        ImportSetting importSetting = importSettingMapper.toEntity(dto);
        importSetting = importSettingRepository.save(importSetting);
        return importSettingMapper.toDto(importSetting);
        
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportSettingService#getImportSetting(GetImportSettingRequest req)
     */
    @Override
    public ImportSettingGetDTO getImportSetting(GetImportSettingRequest req) {
        
        // Step 1 Validate
        if (req.getImportId() == null) {
            throw new CustomRestException("param [importId] is null",
                    CommonUtils.putError("param [importId] is null", Constants.RIQUIRED_CODE));
        }
        
        // Step 2 get from DB
        ImportSetting entity = importSettingRepository.findByImportId(req.getImportId());
        if(entity == null)
            return null;
        ImportSettingDTO dto = importSettingMapper.toDto(entity);
        // Step 3 return
        return importSettingGetDTOMapper.toImportSettingGetDTO(dto);
    }
    
    // Convert json string to ImportDataDTO ()
    public List<ImportDataDTO> jsonbToImportDataDTO(String json) {
        Gson gsonObj = new Gson();
        Type type = new TypeToken<List<ImportDataDTO>>(){}.getType();
        return gsonObj.fromJson(json, type);
    }

}
