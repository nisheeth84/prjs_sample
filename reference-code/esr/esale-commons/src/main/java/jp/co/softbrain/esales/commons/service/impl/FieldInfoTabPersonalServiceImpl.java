package jp.co.softbrain.esales.commons.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.FieldInfoTabPersonal;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabPersonalRepository;
import jp.co.softbrain.esales.commons.repository.FieldInfoTabRepository;
import jp.co.softbrain.esales.commons.service.FieldInfoTabPersonalService;
import jp.co.softbrain.esales.commons.service.dto.FieldInfoTabPersonalDTO;
import jp.co.softbrain.esales.commons.service.mapper.FieldInfoTabPersonalMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;

/**
 * FieldInfoTabPersonalServiceImpl
 *
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class FieldInfoTabPersonalServiceImpl implements FieldInfoTabPersonalService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();

    private final Logger log = LoggerFactory.getLogger(FieldInfoTabPersonalServiceImpl.class);

    @Autowired
    private FieldInfoTabPersonalMapper fieldInfoTabPersonalMapper;

    @Autowired
    private FieldInfoTabPersonalRepository fieldInfoTabPersonalRepository;

    @Autowired
    private FieldInfoTabRepository fieldInfoTabRepository;

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.FieldInfoTabPersonalService#save(
     * jp.co.softbrain.esales.commons.service.dto.FieldInfoTabPersonalDTO)
     */
    @Override
    public FieldInfoTabPersonalDTO save(FieldInfoTabPersonalDTO fieldInfoTabPersonalDTO) {
        FieldInfoTabPersonal fieldInfoTabPersonal = fieldInfoTabPersonalMapper.toEntity(fieldInfoTabPersonalDTO);
        fieldInfoTabPersonal = fieldInfoTabPersonalRepository.save(fieldInfoTabPersonal);
        return fieldInfoTabPersonalMapper.toDto(fieldInfoTabPersonal);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.FieldInfoTabPersonalService#
     * findOne(java.lang.Long)
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<FieldInfoTabPersonalDTO> findByFieldInfoTabPersonalId(Long id) {
        log.debug("Request to get FieldInfoTabPersonalDTO : {}", id);
        return fieldInfoTabPersonalRepository.findByFieldInfoTabPersonalId(id).map(fieldInfoTabPersonalMapper::toDto);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.FieldInfoTabPersonalService#
     * updateFieldInfoTabPersonal(java.lang.Long, java.lang.Long, boolean,
     * java.lang.Integer, java.time.Instant)
     */
    @Override
    @Transactional
    public Long updateFieldInfoTabPersonal(Long fieldInfoTabPersonalId, Long fieldInfoTabId, boolean isColumnFixed,
            Integer columnWidth, Instant updatedDate) {
        // 0. get employeeId
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1.validateParameter
        List<Long> rtn = new ArrayList<>();
        fieldInfoTabRepository.findByFieldInfoTabId(fieldInfoTabId).ifPresentOrElse(fieldInfoTab -> {
            if (fieldInfoTabPersonalId == null || fieldInfoTabPersonalId.longValue() <= 0) {
                createFieldInfoTabPersonal(fieldInfoTabId, isColumnFixed, columnWidth, employeeId, rtn);
            } else {
                this.findByFieldInfoTabPersonalId(fieldInfoTabPersonalId).ifPresentOrElse(fieldInfoTabPersonalDTO -> {
                    fieldInfoTabPersonalDTO.setColumnFixed(isColumnFixed);
                    fieldInfoTabPersonalDTO.setColumnWidth(columnWidth);
                    fieldInfoTabPersonalDTO.setUpdatedUser(employeeId);
                    fieldInfoTabPersonalDTO = this.save(fieldInfoTabPersonalDTO);
                    rtn.add(fieldInfoTabPersonalDTO.getFieldInfoTabPersonalId());
                }, () -> createFieldInfoTabPersonal(fieldInfoTabId, isColumnFixed, columnWidth, employeeId, rtn));
            }
        }, () -> {
            throw new CustomException("fieldInfoTabId not existed", ConstantsCommon.FIELD_INFO_TAB_ID,
                    Constants.RIQUIRED_CODE);
        });
        return rtn.isEmpty() ? null : rtn.get(0);
    }

    private void createFieldInfoTabPersonal(Long fieldInfoTabId, boolean isColumnFixed, Integer columnWidth,
            Long employeeId, List<Long> rtn) {
        FieldInfoTabPersonalDTO fieldInfoTabPersonalDTO = new FieldInfoTabPersonalDTO();
        fieldInfoTabPersonalDTO.setEmployeeId(employeeId);
        fieldInfoTabPersonalDTO.setFieldInfoTabId(fieldInfoTabId);
        fieldInfoTabPersonalDTO.setColumnFixed(isColumnFixed);
        fieldInfoTabPersonalDTO.setColumnWidth(columnWidth);
        fieldInfoTabPersonalDTO.setUpdatedUser(employeeId);
        fieldInfoTabPersonalDTO.setCreatedUser(employeeId);
        fieldInfoTabPersonalDTO = this.save(fieldInfoTabPersonalDTO);
        rtn.add(fieldInfoTabPersonalDTO.getFieldInfoTabPersonalId());
    }
}
