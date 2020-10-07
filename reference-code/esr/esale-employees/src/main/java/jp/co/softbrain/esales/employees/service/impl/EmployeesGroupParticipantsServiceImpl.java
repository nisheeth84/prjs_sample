package jp.co.softbrain.esales.employees.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.employees.domain.EmployeesGroupParticipants;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupParticipantsRepository;
import jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupParticipantsDTO;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesGroupParticipantsMapper;

/**
 * Service Implementation for managing {@link EmployeesGroupParticipants}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesGroupParticipantsServiceImpl implements EmployeesGroupParticipantsService {

    private final EmployeesGroupParticipantsRepository employeesGroupParticipantsRepository;

    private final EmployeesGroupParticipantsMapper employeesGroupParticipantsMapper;

    public EmployeesGroupParticipantsServiceImpl(EmployeesGroupParticipantsRepository employeesGroupParticipantsRepository, EmployeesGroupParticipantsMapper employeesGroupParticipantsMapper) {
        this.employeesGroupParticipantsRepository = employeesGroupParticipantsRepository;
        this.employeesGroupParticipantsMapper = employeesGroupParticipantsMapper;
    }
    
    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupParticipantsDTO)
     */
    @Override
    public EmployeesGroupParticipantsDTO save(EmployeesGroupParticipantsDTO employeesGroupParticipantsDTO) {
        EmployeesGroupParticipants employeesGroupParticipants = employeesGroupParticipantsMapper.toEntity(employeesGroupParticipantsDTO);
        employeesGroupParticipants = employeesGroupParticipantsRepository.save(employeesGroupParticipants);
        return employeesGroupParticipantsMapper.toDto(employeesGroupParticipants);
    }

	/**
	 * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#saveAll(java.util.List)
	 */
	@Override
	public List<EmployeesGroupParticipantsDTO> saveAll(
			List<EmployeesGroupParticipantsDTO> employeesGroupParticipantsDTOList) {
		List<EmployeesGroupParticipants> employeesGroupParticipantsList = employeesGroupParticipantsMapper
				.toEntity(employeesGroupParticipantsDTOList);
		employeesGroupParticipantsRepository.saveAll(employeesGroupParticipantsList);
		return employeesGroupParticipantsMapper.toDto(employeesGroupParticipantsList);
	}

    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesGroupParticipantsDTO> findAll() {
        return employeesGroupParticipantsRepository.findAll().stream()
            .map(employeesGroupParticipantsMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }
    
    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesGroupParticipantsDTO> findOne(Long employeeGroupParticipantId) {
        EmployeesGroupParticipants employeesGroupParticipants = employeesGroupParticipantsRepository
                .findByEmployeeGroupParticipantId(employeeGroupParticipantId);
        if (employeesGroupParticipants != null) {
            return Optional.of(employeesGroupParticipants).map(employeesGroupParticipantsMapper::toDto);
        }
        return Optional.empty();
    }

    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long employeeGroupParticipantId) {
        employeesGroupParticipantsRepository.deleteById(employeeGroupParticipantId);
    }

    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#deleteByGroupId(java.lang.Long)
     */
    @Override
    public void deleteByGroupId(Long groupId) {
        employeesGroupParticipantsRepository.deleteByGroupId(groupId);
    }
    
    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#getGroupParticipants(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesGroupParticipantsDTO> getGroupParticipants(Long groupId) {
        List<EmployeesGroupParticipants> listEmployeesGroupParticipants ;
        listEmployeesGroupParticipants =  employeesGroupParticipantsRepository.findByGroupId(groupId);
        return employeesGroupParticipantsMapper.toDto(listEmployeesGroupParticipants);
    }
    
    /** 
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService#deleteByDepartmentId(java.lang.Long)
     */
    @Override
    public void deleteByDepartmentId(Long departmentId) {
        employeesGroupParticipantsRepository.deleteByDepartmentId(departmentId);
    }
}
