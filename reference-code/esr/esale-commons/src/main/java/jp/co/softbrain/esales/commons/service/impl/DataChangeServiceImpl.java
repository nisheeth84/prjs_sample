package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.DataChange;
import jp.co.softbrain.esales.commons.repository.DataChangeRepository;
import jp.co.softbrain.esales.commons.service.DataChangeService;
import jp.co.softbrain.esales.commons.service.dto.DataChangeDTO;
import jp.co.softbrain.esales.commons.service.mapper.DataChangeMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * DataChangeServiceImpl
 * 
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DataChangeServiceImpl implements DataChangeService {


    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private final DataChangeRepository dataChangeRepository;

    private final DataChangeMapper dataChangeMapper;

    public DataChangeServiceImpl(DataChangeRepository dataChangeRepository, DataChangeMapper dataChangeMapper) {
        this.dataChangeRepository = dataChangeRepository;
        this.dataChangeMapper = dataChangeMapper;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.DataChangeService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<DataChangeDTO> findAll() {
        return dataChangeRepository.findAll().stream().map(dataChangeMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.DataChangeService#createDataChange
     * (java.lang.Integer, java.util.List<Long>, java.lang.Integer)
     */
    @Override
    @Transactional
    public List<Long> createDataChange(Integer extensionBelong, List<Long> dataIds, Integer action) {
        // Get employee id from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();

        List<Long> dataChangeIds = new ArrayList<>();
        if (dataIds != null) {
            dataIds.forEach(dataId -> {
                DataChange dataChange = new DataChange();
                dataChange.setExtensionBelong(extensionBelong);
                dataChange.setDataId(dataId);
                dataChange.setAction(action);
                dataChange.setCreatedUser(employeeId);
                dataChange.setUpdatedUser(employeeId);
                DataChange dataChangeOut = dataChangeRepository.save(dataChange);
                dataChangeIds.add(dataChangeOut.getDataChangeId());
            });
        }
        return dataChangeIds;
    }

    /*
     * (non-Javadoc)
     * @see
     * jp.co.softbrain.esales.commons.service.DataChangeService#deleteDataChange
     * (java.util.List<Long>)
     */
    @Override
    @Transactional
    public Integer deleteDataChange(List<Long> dataChangeIds) {
        Integer result = 0;
        if (dataChangeIds != null) {
            result = dataChangeRepository.deleteDataChangeWithDataChangeIds(dataChangeIds);
        }
        return result;
    }
}
