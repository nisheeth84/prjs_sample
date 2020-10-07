package jp.co.softbrain.esales.commons.service.impl;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.Timezones;
import jp.co.softbrain.esales.commons.repository.TimezonesRepository;
import jp.co.softbrain.esales.commons.service.TimezonesService;
import jp.co.softbrain.esales.commons.service.dto.TimezonesDTO;
import jp.co.softbrain.esales.commons.service.mapper.TimezonesMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * Service Implementation for managing {@link Timezones}.
 * 
 * @author phamminhphu
 *
 */
@Service
@Transactional
public class TimezonesServiceImpl implements TimezonesService {

    private final Logger log = LoggerFactory.getLogger(TimezonesServiceImpl.class);

    private final TimezonesRepository timezonesRepository;

    private final TimezonesMapper timezonesMapper;

    private Map<String, List<TimezonesDTO>> timezoneMap = new HashMap<>();

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * The constructor
     * 
     * @param timezonesRepository repository of timezones
     * @param timezonesMapper mapper of timezones
     */
    public TimezonesServiceImpl(TimezonesRepository timezonesRepository, TimezonesMapper timezonesMapper) {
        this.timezonesRepository = timezonesRepository;
        this.timezonesMapper = timezonesMapper;
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TimezonesService#save(jp.co.softbrain.esales.commons.service.dto.TimezonesDTO)
     */
    @Override
    public TimezonesDTO save(TimezonesDTO timezonesDTO) {
        log.debug("Request to save Timezones : {}", timezonesDTO);
        Timezones timezones = timezonesMapper.toEntity(timezonesDTO);
        timezones = timezonesRepository.save(timezones);
        return timezonesMapper.toDto(timezones);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TimezonesService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<TimezonesDTO> findAll() {
        log.debug("Request to get all Timezones");
        return timezonesRepository.findAll().stream()
            .map(timezonesMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TimezonesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<TimezonesDTO> findOne(Long id) {
        log.debug("Request to get Timezones : {}", id);
        return timezonesRepository.findById(id)
            .map(timezonesMapper::toDto);
    }

    /* (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TimezonesService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Timezones : {}", id);
        timezonesRepository.deleteById(id);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.TimezonesService#
     * findAllDisplayOrder()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<TimezonesDTO> findAllDisplayOrder() {
        log.debug("Request to get all Timezones");

        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<TimezonesDTO> timezoneList = timezoneMap.getOrDefault(tenantName, null);
        if (timezoneList == null) {
            timezoneList = timezonesRepository.findAllByOrderByDisplayOrderAsc().stream().map(timezonesMapper::toDto)
                    .collect(Collectors.toCollection(LinkedList::new));
            timezoneMap.put(tenantName, timezoneList);
        }

        return timezoneList;
    }
}
