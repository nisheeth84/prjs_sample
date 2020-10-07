package jp.co.softbrain.esales.tenants.service.impl;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FileExtension;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.tenants.config.ApplicationProperties;
import jp.co.softbrain.esales.tenants.domain.Feedback;
import jp.co.softbrain.esales.tenants.repository.FeedbackRepository;
import jp.co.softbrain.esales.tenants.service.FeedBackService;
import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackInDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackDTO;
import jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO;
import jp.co.softbrain.esales.tenants.service.mapper.FeedbackMapper;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.DateUtil;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.S3CloudStorageClient;

/**
 * FeedBackServiceImpl
 *
 * @author DatDV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FeedBackServiceImpl implements FeedBackService {

    private static final String COPY_FILE_ERROR = "Copy file error";
    private static final String JOIN_CHAR = ", ";

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FeedbackMapper feedbackMapper;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    /**
     * save : save feed back data to DB
     *
     * @param FeedbackDTO : DTO for save
     * @return FeedbackDTO
     */
    @Override
    public FeedbackDTO save(FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackMapper.toEntity(feedbackDTO);
        feedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(feedback);
    }

    /**
     * findAll : find all feed back data
     *
     * @return List<FeedbackDTO>
     */
    @Override
    public List<FeedbackDTO> findAll() {
        return feedbackRepository.findAll().stream().map(feedbackMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * findOne : find one feed back data
     *
     * @param id : feed back id for find one
     * @return FeedbackDTO
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<FeedbackDTO> findOne(Long id) {
        return feedbackRepository.findByFeedbackId(id).map(feedbackMapper::toDto);
    }

    /**
     * delete
     *
     * @param id : id for delete
     */
    @Override
    public void delete(Long id) {
        feedbackRepository.deleteByFeedbackId(id);
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.FeedBackService#createFeedback(CreateFeedBackInDTO)
     */
    @Override
    @Transactional
    public CreateFeedBackOutDTO createFeedback(CreateFeedBackInDTO createFeedbackInDTO) {
        CreateFeedBackOutDTO response = new CreateFeedBackOutDTO();
        Map<Integer, String> constract = new HashMap<>();
        Map<String , String> feedbackTypes = new HashMap<>();
        constract.put(1, "起動");
        constract.put(2, "停止");
        constract.put(3, "削除");
        feedbackTypes.put("0", "気に入らない");
        feedbackTypes.put("1", "気に入った");
        
        // 2. Insert table feedback
        FeedbackDTO feedbackDto = feedbackMapper.toFeedbackDTO(createFeedbackInDTO);
        feedbackDto.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        feedbackDto.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        feedbackDto.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        response.setFeedbackId(this.save(feedbackDto).getFeedbackId());

        // 2.1 call API getStatusContract
        StatusContractDataDTO statusContractDataDTO = tenantService
                .getStatusContract(jwtTokenUtil.getTenantIdFromToken());

        // 3. Create file csv to S3
        StringBuilder fileName = new StringBuilder();
        List<String> responseCSV = new ArrayList<>();
        responseCSV.add(jwtTokenUtil.getTenantIdFromToken());
        responseCSV.add(feedbackDto.getCompanyName());
        responseCSV.add(constract.get(statusContractDataDTO.getContractStatus()));
        responseCSV.add(jwtTokenUtil.getEmployeeIdFromToken().toString());
        responseCSV.add(feedbackTypes.get(feedbackDto.getFeedbackType()));
        responseCSV.add(feedbackDto.getFeedbackContent());
        responseCSV.add(jwtTokenUtil.getEmailFromToken());
        responseCSV.add(DateUtil.convertDateToString(new Date(), DateUtil.FORMAT_YYYYMMDDHHMMSSSSS));
        fileName.append(jwtTokenUtil.getTenantIdFromToken());
        this.copyFileToS3(fileName.toString(), FileExtension.CSV, String.join(JOIN_CHAR, responseCSV));
        // 4. Create response
        return response;
    }

    /**
     * copyFileToS3 : copyFileToS3
     *
     * @param fileName : file name
     * @param fileExtension : file extension
     * @param content : content
     * @return String : url file
     */
    private String copyFileToS3(String fileName, String fileExtension, String content) {
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        String serviceName = FieldBelongEnum.TENANT.name().toLowerCase();
        String bucketName = applicationProperties.getUploadBucket();
        String toDay = DateUtil.convertDateToString(new Date(), "yyyyMMddHHmmssSSS");

        String keyName = String.format("tenants/%s/service_data/%s/%s_%s.%s", tenantId, serviceName,
                fileName, toDay, fileExtension);

        if (!S3CloudStorageClient.putObject(bucketName, keyName,
                new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)))) {
            throw new CustomException(COPY_FILE_ERROR, COPY_FILE_ERROR, Constants.SAVE_FILE_TO_S3_FAILED);
        }
        return S3CloudStorageClient.generatePresignedURL(bucketName, keyName,
                applicationProperties.getExpiredSeconds());
    }

}
