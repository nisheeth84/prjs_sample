package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * GetTaskTabSubType1DTO
 * 
 * @author nguyenductruong
 */
@Data
@EqualsAndHashCode
public class GetTaskTabSubType1DTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5323441896856140047L;

    /**
     * The taskId
     */
    private Long taskId;

    /**
     * taskData
     */
    private List<TaskDataJsonTypeDTO> taskData;

    /**
     * The taskName
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
     * countSubtask
     */
    private Integer countSubtask;

    /**
     * The TaskFiles
     */
    private List<GetTasksOutFileDTO> files = new ArrayList<>();

    /**
     * countFile
     */
    private Integer countFile;

    /**
     * The employees
     */
    private List<GetTasksOutEmployeeDTO> employees = new ArrayList<>();

    /**
     * countEmployee
     */
    private Integer countEmployee;

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
