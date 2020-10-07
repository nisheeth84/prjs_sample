package jp.co.softbrain.esales.customers.service.dto.schedules;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.customers.domain.Tasks;
import jp.co.softbrain.esales.customers.service.dto.CalculatorFormularDTO;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for APi getTasksTab
 * 
 * @author buithingocanh
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
public class GetTasksTabRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8700045815510848944L;

    private List<Long> employeeIds;
    private List<Long> customerIds;
    private Integer filterByUserLoginFlg = 1;
    private List<SearchConditionDTO> filterConditions = new ArrayList<>();
    private List<OrderValue> orderBy = new ArrayList<>();
    private Long limit;
    private Long offset;

    private List<Long> listTaskIdFromElasticSearch = new ArrayList<>();
    private List<SearchItem> newListFilterConditions = new ArrayList<>();
    private List<CalculatorFormularDTO> calculatorFormular = new ArrayList<>();
    private transient Map<String, OrderByOption> orderByOptionMap;
    private List<Long> listCustomerId;
    private List<Long> listEmployeeId;
    private List<Long> listMilestoneId;
    private List<Long> listProductTradingId;
    private boolean createdUserCheck = false;
    private boolean updatedUserCheck = false;
    private boolean operatorIdCheck = false;
    private List<Long> listLocalDepartmentIds;
    private List<Long> listLocalGroupIds;
    private List<FileByTaskDTO> fileByTaskIdlist = new ArrayList<>();
    private List<Tasks> subTaskList;

}
