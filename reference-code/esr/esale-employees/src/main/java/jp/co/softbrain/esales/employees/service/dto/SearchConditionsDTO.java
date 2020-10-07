package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderByOption;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The SearchConditionsDTO class
 *
 */
@Data
@EqualsAndHashCode
public class SearchConditionsDTO implements Serializable {

    private static final long serialVersionUID = -7252712834627676834L;

    /**
     * The search conditions
     */
    private List<SearchItem> searchConditions = new ArrayList<>();

    /**
     * The filter conditions
     */
    private List<SearchItem> filterConditions = new ArrayList<>();

    /**
     * The local search keyword
     */
    private String localSearchKeyword;

    /**
     * The list filter type
     */
    private List<KeyValue> filterType = new ArrayList<>();

    /**
     * The list orderBy
     */
    private List<KeyValue> orderBy = new ArrayList<>();

    /**
     * The offset
     */
    private Long offset;

    /**
     * The limit
     */
    private Long limit;
    
    private List<Long> elasticResultIds = new ArrayList<>();

    /**
     * The language code
     */
    private String languageCode;

    /**
     * The list calculator formular
     */
    private List<CalculatorFormularDTO> calculatorFormular = new ArrayList<>();
    
    /**
     * list option map
     */
    private Map<String, OrderByOption> optionMap = new HashMap<>();
    
}
