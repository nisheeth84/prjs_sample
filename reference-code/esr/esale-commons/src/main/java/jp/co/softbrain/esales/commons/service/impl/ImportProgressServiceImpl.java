package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.google.gson.Gson;
import jp.co.softbrain.esales.commons.domain.ImportProgress;
import jp.co.softbrain.esales.commons.repository.ImportProgressRepository;
import jp.co.softbrain.esales.commons.service.ImportProgressService;
import jp.co.softbrain.esales.commons.service.dto.ImportProgressDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;
import jp.co.softbrain.esales.commons.service.mapper.ImportProgressMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressBarRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetImportProgressRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.request.UpdateImportProgressRequest;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressBarResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.GetImportProgressResponse;
import jp.co.softbrain.esales.commons.web.rest.vm.response.UpdateImportProgressResponse;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link ImportProgress}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ImportProgressServiceImpl implements ImportProgressService {

    private final ImportProgressRepository importProgressRepository;

    private final ImportProgressMapper importProgressMapper;

    Gson gson = new Gson();
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public ImportProgressServiceImpl(ImportProgressRepository importProgressRepository,
            ImportProgressMapper importProgressMapper) {
        this.importProgressRepository = importProgressRepository;
        this.importProgressMapper = importProgressMapper;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportProgressService#save(ImportSettingDTO)
     */
    @Override
    public ImportProgressDTO save(ImportProgressDTO dto) {
        ImportProgress importSetting = importProgressMapper.toEntity(dto);
        importSetting = importProgressRepository.save(importSetting);
        return importProgressMapper.toDto(importSetting);

    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportProgressService#getImportProgress(GetImportProgressRequest req)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetImportProgressResponse getImportProgress(GetImportProgressRequest req) {
        List<ImportProgress> listImportProgress;
        if(req.getImportId() != null || req.getImportProgressId() != null )
            listImportProgress = 
                importProgressRepository.findByImportProgressIdOrImportId(req.getImportProgressId(), req.getImportId());
        else 
            listImportProgress = importProgressRepository.findAll();
        GetImportProgressResponse res = new GetImportProgressResponse();
        res.setImportProgress(listImportProgress);
        return res;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportProgressService#updateImportProgress(UpdateImportProgressRequest req)
     */
    @Override
    @Transactional
    public UpdateImportProgressResponse updateImportProgress(ImportProgressDTO dto) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // Step 1 Validate
        if (dto.getImportProgressId() == null) {
            throw new CustomRestException("param [importProgressId] is null",
                    CommonUtils.putError("param [importProgressId] is null", Constants.RIQUIRED_CODE));
        }

        // Step 2 Update
        ImportProgress importProgress = importProgressRepository.findByImportProgressId(dto.getImportProgressId());
        importProgress.setUpdatedDate(Instant.now());
        importProgress.setUpdatedUser(employeeId);
        if(dto.getImportId() != null)
            importProgress.setImportId(dto.getImportId());
        if(dto.getImportStatus() != null)
            importProgress.setImportStatus(dto.getImportStatus());
        if(dto.getImportRowFinish() != null)
            importProgress.setImportRowFinish(dto.getImportRowFinish());
        if(dto.getImportBatchStartTime() != null)
            importProgress.setImportBatchStartTime(dto.getImportBatchStartTime());
        if(dto.getImportBatchFinishTime() != null)
            importProgress.setImportBatchFinishTime(dto.getImportBatchFinishTime());
        
        importProgress = importProgressRepository.save(importProgress);
        
        UpdateImportProgressResponse res = new UpdateImportProgressResponse();
        res.setImportProgressId(importProgress.getImportProgressId());
        return res;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ImportProgressService#getImportProgressBar(GetImportProgressBarRequest)
     */
    @Override
    public GetImportProgressBarResponse getImportProgressBar(GetImportProgressBarRequest req) {
        // Step 1 Validate
        if (req.getImportId() == null) {
            throw new CustomRestException("param [importId] is null",
                    CommonUtils.putError("param [importId] is null", Constants.RIQUIRED_CODE));
        }
        
        Integer importRowFinish = 30;
        Integer importRowTotal = 100;
        
        GetImportProgressBarResponse res = new GetImportProgressBarResponse();
        res.setImportRowFinish(importRowFinish);
        res.setImportRowTotal(importRowTotal);
        return res;
    }

}
