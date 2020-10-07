package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO parameter for API updateTask
 * 
 * @author BuiThiNgocAnh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CreateUpdateTaskInDTO implements Serializable {

    private static final long serialVersionUID = 7101844048715852555L;

    private String taskName;
    private Integer statusTaskId;
    private List<CustomerInput> customers;
    private List<Long> productTradingIds;
    private List<OperatorsInput> operators;
    private Instant startDate;
    private Instant finishDate;
    private String memo;
    private Integer isPublic;
    private Long parentTaskId;
    private List<SubTasksInput> subTasks;
    private Long milestoneId;
    private String milestoneName;
    private Integer updateFlg;
    private List<Long> deleteSubtaskIds;
    private Integer processFlg;
    private List<TaskDataJsonTypeDTO> taskData;
    private Instant updatedDate;
    private List<String> fileNameOlds;
}
