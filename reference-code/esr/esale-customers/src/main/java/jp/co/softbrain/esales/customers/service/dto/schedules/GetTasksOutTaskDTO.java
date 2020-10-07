package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTasksOutTaskDTO
 *
 * @author TranTheDuy
 */
@Data
@EqualsAndHashCode
public class GetTasksOutTaskDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1209324956539729349L;

    /**
     * The task Id
     */
    private Long taskId;

    /**
     * The task name ID
     */
    private String taskName;

    /**
     * The status task Id
     */
    private Integer statusTaskId;

    /**
     * The parent task ID
     */
    private Long parentTaskId;

    /**
     * The status parent task ID
     */
    private Integer parentStatusTaskId;

    /**
     * The start Date
     */
    private Instant startDate;

    /**
     * The finish Date
     */
    private Instant finishDate;

    /**
     * The milestone ID
     */
    private Long milestoneId;

    /**
     * The milestone Name
     */
    private String milestoneName;

    /**
     * The memo
     */
    private String memo;

    /**
     * The isPublic
     */
    private Boolean isPublic;

    /**
     * isOperator
     */
    private Integer isOperator;

    /**
     * The countSubtask
     */
    private Integer countSubtask;

    /**
     * The countFile
     */
    private Integer countFile;

    /**
     * The count employee
     */
    private Integer countEmployee;

    /**
     * taskData
     */
    private List<TaskDataJsonTypeDTO> taskData;

    /**
     * The customers list
     */
    private List<GetTasksOutCustomerDTO> customers = new ArrayList<>();

    /**
     * The TaskProductTradings List
     */
    private List<GetTasksOutProductTradingDTO> productTradings = new ArrayList<>();

    /**
     * The SubTasksRespone List
     */
    private List<GetTasksOutSubTaskDTO> subtasks = new ArrayList<>();

    /**
     * The TaskFiles
     */
    private List<GetTasksOutFileDTO> files = new ArrayList<>();

    /**
     * The employees
     */
    private List<GetTasksOutEmployeeDTO> employees = new ArrayList<>();

    /**
     * operators
     */
    private GetOperatorsOfTasksSubType4DTO operators;

    /**
     * taskCreatedDate
     */
    private Instant taskCreatedDate;

    /**
     * taskUpdatedDate
     */
    private Instant taskUpdatedDate;

    /**
     * taskCreatedUser
     */
    private Long taskCreatedUser;

    /**
     * taskCreatedUser
     */
    private Long taskUpdatedUser;

    /**
     * taskCreatedUserName
     */
    private String taskCreatedUserName;

    /**
     * taskUpdatedUserName
     */
    private String taskUpdatedUserName;

    /**
     * employeeIds
     */
    private List<Long> employeeIds = new ArrayList<>();
    /**
     * groupIds
     */
    private List<Long> groupIds = new ArrayList<>();
    /**
     * departmentIds
     */
    private List<Long> departmentIds = new ArrayList<>();

}
