package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response DTO for API InitializeListModal
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class InitializeListModalResponseDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4782439702219569739L;

    /**
     * list
     */
    private CustomersListDTO list;

    /**
     * listParticipants
     */
    private List<CustomersListParticipantsDTO> listParticipants;

    /**
     * participantEmployees
     */
    private List<ParticipantEmployeesDTO> participantEmployees;

    /**
     * participantDepartments
     */
    private List<ParticipantDepartmentDTO> participantDepartments;

    /**
     * participantsGroups
     */
    private List<EmployeesGroupsDTO> participantGroups;

    /**
     * searchConditions
     */
    private List<CustomersListSearchConditionsDTO> searchConditions;

    /**
     * fields
     */
    private List<FieldsResponseDTO> fields;

    /**
     * listUpdateTime
     */
    private String listUpdateTime;

}
