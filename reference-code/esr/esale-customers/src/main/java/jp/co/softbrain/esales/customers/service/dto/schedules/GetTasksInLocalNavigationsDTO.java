package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Class input DTO for API getTasks - localNavigationConditons
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetTasksInLocalNavigationsDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8962593737619012732L;

    /**
     * コンストラクタ
     * 
     * @param employeeIds
     * @param groupIds
     * @param customerIds
     * @param startDate
     * @param finishDate
     */
    public GetTasksInLocalNavigationsDTO(List<Long> employeeIds, List<Long> groupIds, List<Long> customerIds,
            Instant startDate, Instant finishDate) {
        this.employeeIds = employeeIds;
        this.groupIds = groupIds;
        this.customerIds = customerIds;
        this.startDate = startDate;
        this.finishDate = finishDate;
    }

    /**
     * employeeIds
     */
    private List<Long> employeeIds;

    /**
     * groupIds
     */
    private List<Long> groupIds;

    /**
     * cutomerIds
     */
    private List<Long> customerIds;

    /**
     * startDate
     */
    private Instant startDate;

    /**
     * finishDate
     */
    private Instant finishDate;

    private List<Long> departmentOfEmployeeIds = new ArrayList<>();
    private List<Long> groupOfEmployeeIds = new ArrayList<>();
}
