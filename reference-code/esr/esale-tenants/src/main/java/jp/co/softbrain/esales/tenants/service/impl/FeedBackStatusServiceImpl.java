package jp.co.softbrain.esales.tenants.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.tenants.domain.FeedbackStatusOpen;
import jp.co.softbrain.esales.tenants.repository.FeedbackStatusOpenRepository;
import jp.co.softbrain.esales.tenants.service.FeedBackStatusService;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackStatusOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackStatusOpenDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetFeedBackStatusOutDTO;
import jp.co.softbrain.esales.tenants.service.mapper.FeedbackStatusOpenMapper;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;

/**
 * FeedBackStatusServiceImpl
 *
 * @author DatDV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FeedBackStatusServiceImpl implements FeedBackStatusService {

    @Autowired
    private FeedbackStatusOpenRepository feedbackStatusOpenRepository;

    @Autowired
    private FeedbackStatusOpenMapper feedbackStatusOpenMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    @Transactional
    public FeedbackStatusOpenDTO save(FeedbackStatusOpenDTO feedbackStatusDTO) {
        FeedbackStatusOpen feedbackStatus = feedbackStatusOpenMapper.toEntity(feedbackStatusDTO);
        feedbackStatus = feedbackStatusOpenRepository.save(feedbackStatus);
        return feedbackStatusOpenMapper.toDto(feedbackStatus);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<FeedbackStatusOpenDTO> findAll() {
        return feedbackStatusOpenRepository.findAll().stream().map(feedbackStatusOpenMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<FeedbackStatusOpenDTO> findOne(Long id) {
        return feedbackStatusOpenRepository.findByEmployeeId(id).map(feedbackStatusOpenMapper::toDto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        feedbackStatusOpenRepository.deleteByEmployeeId(id);
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.FeedBackStatusService#createFeedBackStatusOpen(Long)
     */
    @Override
    @Transactional
    public CreateFeedBackStatusOutDTO createFeedBackStatusOpen(Long employeeId, String tenantName) {

        // 1. insert
        feedbackStatusOpenRepository.insertFeedbackStatusOpen(employeeId,employeeId,employeeId,tenantName);

        // 2.create response
        CreateFeedBackStatusOutDTO response = new CreateFeedBackStatusOutDTO();
        response.setEmployeeId(jwtTokenUtil.getEmployeeIdFromToken());
        response.setTenantName(jwtTokenUtil.getTenantIdFromToken());
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.tenants.service.FeedBackStatusService#getFeedBackStatusOpen(Long)
     */
    @Override
    public GetFeedBackStatusOutDTO getFeedBackStatusOpen(Long employeeId, String tenantName) {
        // get data feed back status open
        GetFeedBackStatusOutDTO response = new GetFeedBackStatusOutDTO();
        feedbackStatusOpenRepository.findByEmployeeIdAndTenantName(employeeId, tenantName).ifPresent(feed -> {
            response.setEmployeeId(feed.getEmployeeId());
            response.setTenantName(feed.getTenantName());
        });
        return response;
    }

}
