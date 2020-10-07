package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.customers.service.dto.schedules.RelationsWithCustomersDTO;
import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The CustomersSearchConditionsDTO class
 */
@Data
@EqualsAndHashCode
public class CustomersSearchConditionsDTO implements Serializable {

    private static final long serialVersionUID = -7252712834627676834L;

    /**
     * The searchConditions
     */
    private List<SearchItem> searchConditions = new ArrayList<>();

    /**
     * The filterItemConditions
     */
    private List<SearchItem> filterConditions = new ArrayList<>();

    /**
     * The local search keyword
     */
    private String localSearchKeyword;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType = 0;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId = 0L;

    /**
     * isUpdateListView
     */
    private Boolean isUpdateListView;

    /**
     * orderBy
     */
    private List<OrderValue> orderBy = new ArrayList<>();

    /**
     * The offset
     */
    private Integer offset;

    /**
     * The limit
     */
    private Integer limit;

    private List<KeyValue> listOrders = new ArrayList<>();

    private List<Long> elasticSearchResultIds = new ArrayList<>();

    private int indexParam = 0;

    private List<CalculatorFormularDTO> calculatorFormular = new ArrayList<>();
    private Map<String, OrderByOption> optionMap = new HashMap<>();

    private boolean isDisplayCutomerChilds = false;
    private boolean isSearchNonPersonInCharge = false;
    private boolean isSearchCreatedUser = false;
    private boolean isSearchUpdatedUser = false;
    private boolean isSearchNullScenarioId = false;
    private boolean isSearchPersonInCharge = false;
    private boolean isSearchNonBussiness = false;

    private boolean isSearchNonBusinessMain = false;
    private String searchBusinessMain;
    private boolean isSearchNonBusinessSub = false;
    private String searchBusinessSub;

    private boolean isTrueCondition = true;

    private boolean isSortSchedules = false;
    private String schedulesSortType;
    private boolean isSearchSchedule = false;
    private List<Long> customerIdsBySchedules = new ArrayList<>();
    private boolean isSearchNonSchedule = false;

    private boolean isSearchTask = false;
    private List<Long> customerIdsByTasks = new ArrayList<>();
    private boolean isSortTask = false;
    private String taskSortType;
    private boolean isSearchNonTask = false;

    private String sortUrlType;

    private boolean isSearchLastContactDate = false;
    private List<Long> customerIdsByLastContactDate = new ArrayList<>();

    private List<Long> employeesCreated = new ArrayList<>();
    private List<Long> employeesUpdated = new ArrayList<>();
    private List<Long> businessIds = new ArrayList<>();

    private List<SearchItem> elasticSearchConditions = new ArrayList<>();

    private List<Long> employeeIds = new ArrayList<>();
    private List<Long> departmentIds = new ArrayList<>();
    private List<Long> groupIds = new ArrayList<>();

    private String token;
    private String tenantName;
    private Long userId;
    private String languageCode;

    private StringBuilder sqlOutSideGroup = new StringBuilder();

    private List<PersonsInChargeDTO> listAllPersonInCharge = new ArrayList<>();

    private List<RelationsWithCustomersDTO> listTaskAndSchedules = new ArrayList<>();

    private Map<Long, Instant> mapContactDate;

    private List<Long> parentIds;

}
