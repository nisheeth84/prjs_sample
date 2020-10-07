package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetTasksByIdsOutDTO
 *
 * @author lequyphuc
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetTasksByIdsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1634623463253453L;

    /**
     * taskId
     */
    private Long taskId;
    /**
     * taskData
     */
    private List<TaskDataJsonTypeDTO> taskData = new ArrayList<>();
    /**
     * taskName
     */
    private String taskName;
    /**
     * memo
     */
    private String memo;
    /**
     * operators
     */
    private List<GetOperatorsOfTasksSubType2DTO> operators = new ArrayList<>();

    /**
     * countEmployee
     */
    private Integer countEmployee;
    /**
     * startDate
     */
    private String startDate;
    /**
     * finishDate
     */
    private String finishDate;
    /**
     * parentTaskId
     */
    private Long parentTaskId;
    /**
     * statusParentTaskId
     */
    private Integer statusParentTaskId;
    /**
     * customers
     */
    private List<GetTasksByIdsOutSubType6DTO> customers = new ArrayList<>();
    /**
     * productTradings
     */
    private List<GetTasksByIdsOutSubType7DTO> productTradings = new ArrayList<>();
    /**
     * milestoneId
     */
    private Long milestoneId;
    /**
     * milestoneName
     */
    private String milestoneName;
    /**
     * milestoneFinishDate
     */
    private String milestoneFinishDate;
    /**
     * milestoneParentCustomerName
     */
    private String milestoneParentCustomerName;
    /**
     * milestoneCustomerName
     */
    private String milestoneCustomerName;
    /**
     * files
     */
    private List<GetTasksByIdsOutSubType8DTO> files = new ArrayList<>();
    /**
     * statusTaskId
     */
    private Integer statusTaskId;
    /**
     * isPublic
     */
    private Integer isPublic;
    /**
     * subtasks
     */
    private List<GetTasksByIdsOutSubType9DTO> subtasks = new ArrayList<>();
    /**
     * registDate
     */
    private String registDate;
    /**
     * refixDate
     */
    private String refixDate;
    /**
     * registPersonNameName
     */
    private String registPersonName;
    /**
     * refixPersonNameName
     */
    private String refixPersonName;
    
    private List<Long> personalCustomerIds = new ArrayList<>();
    
    private List<Long> personalProductIds = new ArrayList<>();
    
    private List<Long> creUpUser = new ArrayList<>(); 
    private Long createdUser;
    private Long updateUser;
     }
