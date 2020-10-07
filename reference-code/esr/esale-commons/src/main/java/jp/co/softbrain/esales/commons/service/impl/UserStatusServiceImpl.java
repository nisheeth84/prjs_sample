package jp.co.softbrain.esales.commons.service.impl;

import jp.co.softbrain.esales.commons.service.UserStatusService;
import jp.co.softbrain.esales.commons.domain.UserStatus;
import jp.co.softbrain.esales.commons.repository.UserStatusRepository;
import jp.co.softbrain.esales.commons.service.dto.UserStatusDTO;
import jp.co.softbrain.esales.commons.service.mapper.UserStatusMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link UserStatus}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class UserStatusServiceImpl implements UserStatusService {

    private final Logger log = LoggerFactory.getLogger(UserStatusServiceImpl.class);

    private final UserStatusRepository userStatusRepository;

    private final UserStatusMapper userStatusMapper;

    public UserStatusServiceImpl(UserStatusRepository userStatusRepository, UserStatusMapper userStatusMapper) {
        this.userStatusRepository = userStatusRepository;
        this.userStatusMapper = userStatusMapper;
    }

    /**
     * Save a userStatus.
     *
     * @param userStatusDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public UserStatusDTO save(UserStatusDTO userStatusDTO) {
        log.debug("Request to save UserStatus : {}", userStatusDTO);
        UserStatus userStatus = userStatusMapper.toEntity(userStatusDTO);
        userStatus = userStatusRepository.save(userStatus);
        return userStatusMapper.toDto(userStatus);
    }

    /**
     * Get all the userStatuses.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserStatusDTO> findAll() {
        log.debug("Request to get all UserStatuses");
        return userStatusRepository.findAll().stream()
            .map(userStatusMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one userStatus by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserStatusDTO> findOne(Long id) {
        log.debug("Request to get UserStatus : {}", id);
        return userStatusRepository.findById(id)
            .map(userStatusMapper::toDto);
    }

    /**
     * Delete the userStatus by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserStatus : {}", id);
        userStatusRepository.deleteById(id);
    }
}
