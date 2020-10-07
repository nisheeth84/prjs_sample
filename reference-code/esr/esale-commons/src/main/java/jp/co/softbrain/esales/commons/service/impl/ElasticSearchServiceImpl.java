package jp.co.softbrain.esales.commons.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.ElasticsearchStatusException;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.NestedSortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.commons.domain.FieldInfo;
import jp.co.softbrain.esales.commons.repository.FieldInfoRepository;
import jp.co.softbrain.esales.commons.service.ElasticSearchService;
import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchInDTO;
import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchOutDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.QueryUtils;
import jp.co.softbrain.esales.utils.dto.SearchConditionDTO;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Service elasticSearch Interface for communicate with ElasticSearch
 */
@Service
public class ElasticSearchServiceImpl implements ElasticSearchService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private static final String ARRAY_EMPTY = "[]";
    private static final String FIELD_SEPARATE = ".";
    private static final String HAS_MUST = "has_must";
    private static final String HAS_SHOULD = "has_should";
    private static final String EMPLOYEE_INDEX = "%s_employee";

    private static final String SEARCH_LIKE = "1";
    private static final String SEARCH_LIKE_FIRST = "2";
    private static final String OR_CONDITION = "1";
    private static final String AND_CONDITION = "2";
    private static final String ALL_WORD = "3";
    private static final String WILDCARD_LIKE = "*%s*";
    private static final String SEARCH_KEYWORD_TYPE = "%s.keyword";
    private static final String SEARCH_ADDRESS_ZIP_CODE = "%s.zip_code";
    private static final String SEARCH_ADDRESS_NAME = "%s.address_name";
    private static final String SEARCH_ADDRESS_BUILDING_NAME = "%s.building_name";
    private static final String SEARCH_FILE_NAME_KEY = "%s.file_name";
    private static final String SELECT_ORGANIZATION_KEY = "select_organization_";
    private static final String SELECT_RELATION_KEY = "relation_";
    private static final String SEARCH_EMPLOYEE_ID_KEY = "employee_id";
    private static final String SEARCH_EMPLOYEE_FULL_NAME_KEY = "employee_full_name.keyword";
    private static final String SEARCH_EMPLOYEE_DEPARTMENTS_KEY = "employee_departments";
    private static final String SEARCH_EMPLOYEE_GROUP_KEY = "employee_groups_id";
    private static final String DOCUMENT_ID = "_id";
    private static final String SEARCH_LINK_URL_TEXT = "%s.url_text";
    private static final String SEARCH_LINK_URL_TARGET = "%s.url_target";
    private static final String SEARCH_LINK_URL_TEXT_KEYWORD = "%s.url_text.keyword";
    private static final String SEARCH_LINK_URL_TARGET_KEYWORD = "%s.url_target.keyword";
    private static final String KEYWWORD_POSTFIX = ".keyword";

    public enum SORT_TYPE {
        ASC, DESC
    }

    @Autowired
    private FieldInfoRepository fieldInfoRepository;

    @Autowired
    private RestHighLevelClient client;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.commons.service.ElasticSearchService#
     * getDetailElasticSearch(jp.co.softbrain.esales.commons.service.dto.
     * SelectDetailElasticSearchInDTO)
     */
    public SelectDetailElasticSearchOutDTO getDetailElasticSearch(SelectDetailElasticSearchInDTO inputDto)
            throws IOException {

        // bool query
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();

        if (inputDto.getSearchConditions() != null && !inputDto.getSearchConditions().isEmpty()) {
            List<SearchConditionDTO> searchConditions = inputDto.getSearchConditions();
            queryBuilder(boolQueryBuilder, searchConditions);
        }

        // filter query
        if (inputDto.getFilterConditions() != null && !inputDto.getFilterConditions().isEmpty()) {
            List<SearchConditionDTO> filterConditions = inputDto.getFilterConditions();
            BoolQueryBuilder filterQueryBuilder = QueryBuilders.boolQuery();
            boolQueryBuilder.filter(queryBuilder(filterQueryBuilder, filterConditions));
        }

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

        boolQueryBuilder.mustNot(QueryBuilders.termQuery(DOCUMENT_ID, 0));
        searchSourceBuilder.query(boolQueryBuilder);

        if (inputDto.getOrderBy() != null) {
            inputDto.getOrderBy().forEach(item -> {

                // not user Nested field
                item.setIsNested(false);
                boolean isDefault = Constants.Elasticsearch.TRUE_VALUE.equals(item.getIsDefault());
                if (StringUtils.isEmpty(item.getKey()) || StringUtils.isEmpty(item.getValue())
                        || !(SORT_TYPE.ASC.toString().equalsIgnoreCase(item.getValue())
                                || SORT_TYPE.DESC.toString().equalsIgnoreCase(item.getValue()))
                        || !isDefault) {
                    return;
                }
                setOrder(searchSourceBuilder, item.getIsNested(), item.getKey(), item.getValue());
            });
        }

        if (inputDto.getLimit() != null && inputDto.getLimit() > 0) {
            searchSourceBuilder.size(inputDto.getLimit().intValue());
        }
        else {
            searchSourceBuilder.size(Constants.Elasticsearch.DEFAULT_LIMIT);
        }
        searchSourceBuilder.from(inputDto.getOffset() != null ? inputDto.getOffset() : 0);

        SearchRequest searchRequest = buildSearchRequest(inputDto.getIndex());
        searchRequest.source(searchSourceBuilder);
        SearchResponse response = null;
        try {
            response = client.search(searchRequest, RequestOptions.DEFAULT);
        } catch (ElasticsearchStatusException | IOException ex) {
            log.warn(ex.getLocalizedMessage());
        }

        SelectDetailElasticSearchOutDTO output = null;
        if (StringUtils.isNotBlank(inputDto.getColumnId())) {
            output = getSearchResultId(response, inputDto.getColumnId());
        }
        else {
            output = getSearchResult(response);
        }

        if (output.getTotal() > 0 && inputDto.getSearchConditions() != null
                && !inputDto.getSearchConditions().isEmpty()) {
            // select organization
            output.setOrganizationSearchConditions(getOrganizationCondition(inputDto.getSearchConditions()));
            // output.setRelationSearchConditions(getRealationCondition(inputDto.getSearchConditions()))
        }

        // filter query
        if (output.getTotal() > 0 && inputDto.getFilterConditions() != null
                && !inputDto.getFilterConditions().isEmpty()) {
            // select organization
            output.setOrganizationFilterConditions(getOrganizationCondition(inputDto.getFilterConditions()));
            // output.setRelationFilterConditions(getRealationCondition(inputDto.getFilterConditions()))
        }

        return output;
    }

    /**
     * get select organization condition
     *
     * @param searchConditions
     * @return
     */
    @SuppressWarnings("unchecked")
    private List<SearchItem> getOrganizationCondition(List<SearchConditionDTO> searchConditions) {
        List<SearchItem> newSearchConditions = new ArrayList<>();
        String indexEmployee = String.format(EMPLOYEE_INDEX, jwtTokenUtil.getTenantIdFromToken());
        // check item select_organization_*
        searchConditions.forEach(condition -> {
            if (StringUtils.isNotEmpty(condition.getFieldName())
                    && condition.getFieldName().contains(SELECT_ORGANIZATION_KEY)) {
                String employeeName = condition.getFieldValue();
                String fieldType = String.valueOf(condition.getFieldType());

                String[] columnItems = condition.getFieldName()
                        .split(Constants.PartNameSection.SECTION_SPLIT_CHAR_REGEX);

                if (columnItems.length < 2 || StringUtils.isBlank(employeeName)) {
                    return;
                }
                SearchRequest searchEmployeeRequest = buildSearchRequest(indexEmployee);
                SearchSourceBuilder employeeSourceBuilder = new SearchSourceBuilder();

                BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
                queryBuilderForKeyword(queryBuilder, fieldType, employeeName, SEARCH_EMPLOYEE_FULL_NAME_KEY,
                        condition.getSearchType(), condition.getSearchOption(), true);

                BoolQueryBuilder queryBuilderEmployee = QueryBuilders.boolQuery();
                queryBuilderEmployee.should(queryBuilder);

                employeeSourceBuilder.query(queryBuilderEmployee);
                searchEmployeeRequest.source(employeeSourceBuilder);

                SearchResponse employeeResponse = null;
                try {
                    employeeResponse = client.search(searchEmployeeRequest, RequestOptions.DEFAULT);
                } catch (ElasticsearchStatusException | IOException ex) {
                    log.warn(ex.getLocalizedMessage());
                }
                List<Long> employeeIds = new ArrayList<>();
                List<Long> departmentIds = new ArrayList<>();
                List<Long> groupIds = new ArrayList<>();
                if (employeeResponse != null && employeeResponse.getHits().getTotalHits().value > 0) {

                    TypeReference<Map<String, String>> typeDepartment = new TypeReference<>() {};
                    employeeResponse.getHits()
                            .forEach(employee -> employee.getSourceAsMap().forEach((key, employeeInfo) -> {
                                switch (key) {
                                case SEARCH_EMPLOYEE_ID_KEY:
                                    employeeIds.add(Double.valueOf(String.valueOf(employeeInfo)).longValue());
                                    break;
                                case SEARCH_EMPLOYEE_DEPARTMENTS_KEY:
                                    Map<String, String> departments = null;
                                    try {
                                        departments = (Map<String, String>) employeeInfo;
                                    } catch (Exception ex1) {
                                        log.warn(ex1.getLocalizedMessage());
                                        try {
                                            departments = objectMapper.readValue(String.valueOf(employeeInfo),
                                                    typeDepartment);
                                        } catch (ElasticsearchStatusException | IOException ex) {
                                            log.warn(ex.getLocalizedMessage());
                                        }
                                    }
                                    if (departments != null
                                            && StringUtils.isNotBlank(departments.get("department_id"))) {
                                        String[] ids = departments.get("department_id").split(",");
                                        for (String departmentId : ids) {
                                            if (StringUtils.isNotBlank(departmentId)) {
                                                departmentIds.add(Long.parseLong(departmentId));
                                            }
                                        }
                                    }
                                    break;
                                case SEARCH_EMPLOYEE_GROUP_KEY:
                                    if (employeeInfo != null && StringUtils.isNotBlank(String.valueOf(employeeInfo))) {
                                        String[] ids = employeeInfo.toString().split(",");
                                        for (String groupId : ids) {
                                            if (StringUtils.isNotBlank(groupId)) {
                                                groupIds.add(Long.parseLong(groupId));
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                                }
                            }));

                    Map<String, List<Long>> mapSearchId = new HashMap<>();
                    if (!employeeIds.isEmpty()) {
                        mapSearchId.put(Constants.ORGANIZATION_KEY_LIST.get(0), employeeIds);
                    }
                    if (!departmentIds.isEmpty()) {
                        mapSearchId.put(Constants.ORGANIZATION_KEY_LIST.get(1), departmentIds);
                    }
                    if (!groupIds.isEmpty()) {
                        mapSearchId.put(Constants.ORGANIZATION_KEY_LIST.get(2), groupIds);
                    }

                    SearchItem searchItem = new SearchItem();
                    searchItem.setFieldName(condition.getFieldName());
                    searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.SELECT_ORGANIZATION.getCode()));
                    searchItem.setSearchOption(OR_CONDITION);
                    try {
                        searchItem.setFieldValue(objectMapper.writeValueAsString(mapSearchId));
                    } catch (JsonProcessingException ex) {
                        log.warn(ex.getLocalizedMessage());
                    }
                    newSearchConditions.add(searchItem);
                }
            }
        });
        return newSearchConditions;
    }

    /**
     * get relation condition
     *
     * @param searchConditions
     * @return
     */
    @SuppressWarnings("unused")
    private List<SearchItem> getRelationCondition(List<SearchConditionDTO> searchConditions) {
        List<SearchItem> newSearchConditions = new ArrayList<>();
        String tenantId = jwtTokenUtil.getTenantIdFromToken();
        // check item select_organization_*
        searchConditions.forEach(condition -> {
            if (StringUtils.isNotEmpty(condition.getFieldName())
                    && condition.getFieldName().contains(SELECT_RELATION_KEY)) {

                String[] columnItems = condition.getFieldName()
                        .split(Constants.PartNameSection.SECTION_SPLIT_CHAR_REGEX);

                if (columnItems.length < 2) {
                    return;
                }

                // get relation fieldBelong, fieldName, fieldType
                List<FieldInfo> fieldInfoList = fieldInfoRepository.getRealationDataByFieldName(columnItems[1]);
                if (fieldInfoList == null || fieldInfoList.isEmpty()) {
                    return;
                }

                FieldInfo relationFieldInfo = fieldInfoList.get(0);
                String relationFieldName = relationFieldInfo.getFieldName();

                boolean isDynamicItem = new QueryUtils().checkJsonOrderFieldname(relationFieldName);

                // check search text
                if (!(CommonUtils.isTextType(relationFieldInfo.getFieldType())
                        || FieldTypeEnum.ADDRESS.getCode().equals(String.valueOf(relationFieldInfo.getFieldType()))
                        || (FieldTypeEnum.OTHER.getCode().equals(String.valueOf(relationFieldInfo.getFieldType()))
                                && CommonUtils.isDefaultTextType(relationFieldName)))) {
                    return;
                }

                String columnData = Constants.Elasticsearch.getColumnData(relationFieldInfo.getFieldBelong());

                SearchConditionDTO searchConditionDto = new SearchConditionDTO();
                if (FieldTypeEnum.OTHER.getCode().equals(String.valueOf(relationFieldInfo.getFieldType()))
                        && CommonUtils.isDefaultTextType(relationFieldName)) {
                    searchConditionDto.setFieldType(Integer.valueOf(FieldTypeEnum.TEXT.getCode()));
                }
                else {
                    searchConditionDto.setFieldType(relationFieldInfo.getFieldType());
                }
                String isDefault = "";
                String strFormat = "%s.%s";
                if (!isDynamicItem) {
                    isDefault = Constants.Elasticsearch.TRUE_VALUE;
                    strFormat = "%s.%s.keyword";
                }
                searchConditionDto.setFieldName(String.format(strFormat, columnData, relationFieldName));
                searchConditionDto.setIsDefault(isDefault);
                searchConditionDto.setFieldValue(condition.getFieldValue());
                searchConditionDto.setSearchType(condition.getSearchType());
                searchConditionDto.setSearchOption(condition.getSearchOption());

                List<SearchConditionDTO> relationSearchConditions = new ArrayList<>();
                relationSearchConditions.add(searchConditionDto);

                BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
                queryBuilder(boolQueryBuilder, relationSearchConditions);
                boolQueryBuilder.mustNot(QueryBuilders.termQuery(DOCUMENT_ID, 0));

                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                searchSourceBuilder.query(boolQueryBuilder);

                searchSourceBuilder.size(Constants.Elasticsearch.DEFAULT_LIMIT);
                searchSourceBuilder.from(0);

                String indexElasticsearch = String.format("%s_%s", tenantId,
                        Constants.Elasticsearch.getIndexName(relationFieldInfo.getFieldBelong()));
                SearchRequest searchRequest = buildSearchRequest(indexElasticsearch);
                searchRequest.source(searchSourceBuilder);
                SearchResponse response = null;
                try {
                    response = client.search(searchRequest, RequestOptions.DEFAULT);
                } catch (ElasticsearchStatusException | IOException ex) {
                    log.warn(ex.getLocalizedMessage());
                }

                List<Long> targetIds = new ArrayList<>();
                if (response != null && response.getHits().getTotalHits().value > 0) {

                    response.getHits().forEach(target -> target.getSourceAsMap().forEach((key, value) -> {
                        if (Constants.Elasticsearch.getColumnPrimary(relationFieldInfo.getFieldBelong()).equals(key)) {
                            targetIds.add(Double.valueOf(String.valueOf(value)).longValue());
                        }
                    }));

                    SearchItem searchItem = new SearchItem();
                    searchItem.setFieldName(condition.getFieldName());
                    searchItem.setFieldType(Integer.valueOf(FieldTypeEnum.CHECKBOX.getCode()));
                    searchItem.setFieldValue(targetIds.toString());
                    searchItem.setSearchOption(OR_CONDITION);

                    newSearchConditions.add(searchItem);
                }
            }
        });
        return newSearchConditions;
    }

    /**
     * set order
     *
     * @param orderBuilder
     * @param isNested
     * @param fieldName
     * @param order
     */
    private void setOrder(SearchSourceBuilder orderBuilder, boolean isNested, String fieldName, String order) {
        FieldSortBuilder sortField = SortBuilders.fieldSort(fieldName).order(SortOrder.valueOf(order.toUpperCase()));
        if (isNested) {
            String nestedPath = StringUtils.substringBefore(fieldName, FIELD_SEPARATE);
            sortField.setNestedSort(new NestedSortBuilder(nestedPath));
            orderBuilder.sort(sortField);
        }
        else {
            orderBuilder.sort(sortField);
        }
    }

    /**
     * query builder for elasticsearch
     *
     * @param searchConditions list object search condition
     * @param isMust is true if search with must
     * @return
     */
    private BoolQueryBuilder queryBuilder(BoolQueryBuilder boolQueryBuilder,
            List<SearchConditionDTO> searchConditions) {
        BoolQueryBuilder mustQueryBuilder = QueryBuilders.boolQuery();
        BoolQueryBuilder shouldQueryBuilder = QueryBuilders.boolQuery();
        Map<String, Boolean> checkQuery = new HashMap<>();
        checkQuery.put(HAS_MUST, false);
        checkQuery.put(HAS_SHOULD, false);
        searchConditions.forEach(item -> {
            String fieldValue = item.getFieldValue();
            String fromValue = item.getFromValue();
            String toValue = item.getToValue();
            String fieldName = item.getFieldName();
            String fieldType = String.valueOf(item.getFieldType());
            boolean isMust = Constants.Elasticsearch.Operator.AND.getValue() == item.getFieldOperator();
            boolean isDefault = Constants.Elasticsearch.TRUE_VALUE.equals(item.getIsDefault());
            boolean isFullText = false;
            QueryBuilder matchQuery = null;

            // not user Nested field
            item.setIsNested(false);

            if (StringUtils.isEmpty(fieldType) || StringUtils.isEmpty(fieldName)) {
                return;
            }
            if (StringUtils.isEmpty(item.getSearchType()) && StringUtils.isEmpty(item.getSearchOption())) {
                isFullText = true;
            }

            BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
            // for search null
            if ((StringUtils.isEmpty(fieldValue) || ARRAY_EMPTY.equals(fieldValue)) && StringUtils.isEmpty(fromValue)
                    && StringUtils.isEmpty(toValue)
                    && ((CommonUtils.isTextType(item.getFieldType())
                            || (FieldTypeEnum.OTHER.getCode().equals(String.valueOf(item.getFieldType()))
                                    && CommonUtils.isDefaultTextType(fieldName)))
                            || FieldTypeEnum.ADDRESS.getCode().equals(fieldType)
                            || FieldTypeEnum.LINK.getCode().equals(fieldType))) {
                if (StringUtils.isEmpty(fieldValue)) {
                    if (FieldTypeEnum.LINK.getCode().equals(fieldType) && StringUtils.isEmpty(fieldValue)) {
                        BoolQueryBuilder emptyLinkQueryBuilder = QueryBuilders.boolQuery();
                        emptyLinkQueryBuilder.must(matchQuery(String.format(SEARCH_LINK_URL_TEXT_KEYWORD, fieldName), ""));
                        emptyLinkQueryBuilder.must(matchQuery(String.format(SEARCH_LINK_URL_TARGET_KEYWORD, fieldName), ""));
                        queryBuilder.should(emptyLinkQueryBuilder);
                    } else {
                        queryBuilder.should(matchQuery(addKeyWordPostfix(fieldName), ""));
                    }
                } else {
                    queryBuilder.should(matchQuery(fieldName, fieldValue));
                }
                queryBuilder.should(QueryBuilders.boolQuery().mustNot(QueryBuilders.existsQuery(fieldName)));
            }
            // for TEXT, TEXTAREA, LINK, FILE, PHONE, EMAIL
            else if (CommonUtils.isTextType(item.getFieldType())
                    || (FieldTypeEnum.OTHER.getCode().equals(String.valueOf(item.getFieldType()))
                            && CommonUtils.isDefaultTextType(fieldName))) {
                if (FieldTypeEnum.FILE.getCode().equals(fieldType)) {
                    fieldName = String.format(SEARCH_FILE_NAME_KEY, fieldName);
                }

                // check search full text
                if (isFullText) {
                    matchQuery = matchQuery(fieldName, fieldValue);
                }
                else {
                    queryBuilder = queryBuilderForKeyword(queryBuilder, fieldType, fieldValue, fieldName,
                            item.getSearchType(), item.getSearchOption(), isDefault);
                }
            }
            // for ADDRESS
            else if (FieldTypeEnum.ADDRESS.getCode().equals(fieldType)) {
                BoolQueryBuilder queryBuilderAddress = QueryBuilders.boolQuery();

                // zip_code
                String zipCode = String.format(SEARCH_ADDRESS_ZIP_CODE, fieldName);
                queryBuilderAddress.should(queryBuilderForKeyword(null, fieldType, fieldValue, zipCode,
                        item.getSearchType(), item.getSearchOption(), isDefault));

                // address_name
                String addressName = String.format(SEARCH_ADDRESS_NAME, fieldName);
                queryBuilderAddress.should(queryBuilderForKeyword(null, fieldType, fieldValue, addressName,
                        item.getSearchType(), item.getSearchOption(), isDefault));

                // building_name
                String buildingName = String.format(SEARCH_ADDRESS_BUILDING_NAME, fieldName);
                queryBuilderAddress.should(queryBuilderForKeyword(null, fieldType, fieldValue, buildingName,
                        item.getSearchType(), item.getSearchOption(), isDefault));
                queryBuilder.should(queryBuilderAddress);
            }
            // for LINK
            else if (FieldTypeEnum.LINK.getCode().equals(fieldType)) {
                BoolQueryBuilder queryBuilderLink = QueryBuilders.boolQuery();

                // url target
                String urlTarget = String.format(SEARCH_LINK_URL_TARGET, fieldName);
                queryBuilderLink.should(queryBuilderForKeyword(null, fieldType, fieldValue, urlTarget,
                        item.getSearchType(), item.getSearchOption(), isDefault));

                // url text
                String urlText = String.format(SEARCH_LINK_URL_TEXT, fieldName);
                queryBuilderLink.should(queryBuilderForKeyword(null, fieldType, fieldValue, urlText,
                        item.getSearchType(), item.getSearchOption(), isDefault));
                queryBuilder.should(queryBuilderLink);
            }

            QueryBuilder lastQueryBuilder;
            if (isFullText && matchQuery != null) {
                lastQueryBuilder = matchQuery;
                if (item.getIsNested() && fieldName.contains(FIELD_SEPARATE)) {
                    String path = StringUtils.substringBefore(fieldName, FIELD_SEPARATE);
                    lastQueryBuilder = QueryBuilders.nestedQuery(path, matchQuery, ScoreMode.None);
                }
            }
            else {
                lastQueryBuilder = queryBuilder;
                if (item.getIsNested() && fieldName.contains(FIELD_SEPARATE)) {
                    String path = StringUtils.substringBefore(fieldName, FIELD_SEPARATE);
                    lastQueryBuilder = QueryBuilders.nestedQuery(path, queryBuilder, ScoreMode.None);
                }
            }
            if (isMust) {
                mustQueryBuilder.must(lastQueryBuilder);
                checkQuery.put(HAS_MUST, true);
            }
            else {
                shouldQueryBuilder.should(lastQueryBuilder);
                checkQuery.put(HAS_SHOULD, true);
            }
        });

        if (checkQuery.get(HAS_MUST)) {
            boolQueryBuilder.must(mustQueryBuilder);
        }
        if (checkQuery.get(HAS_SHOULD)) {
            boolQueryBuilder.should(shouldQueryBuilder);
        }
        return boolQueryBuilder;
    }
    
    /**
     * add .keyword postfix to fieldName if it doesn't have it
     * 
     * @param fieldName fieldname string
     * @return fieldName with .keyword postfix added
     */
    private String addKeyWordPostfix(String fieldName) {
        if (!fieldName.endsWith(KEYWWORD_POSTFIX)) {
            return String.format(SEARCH_KEYWORD_TYPE, fieldName);
        }
        return fieldName;
    }

    /**
     * build match query
     *
     * @param fieldValue
     * @param fieldName
     * @return
     */
    private MatchQueryBuilder matchQuery(String fieldName, String fieldValue) {
        return QueryBuilders.matchQuery(fieldName, fieldValue);
    }

    /**
     * build query for multi value (TEXT, TEXTAREA, LINK, FILE, PHONE, ADDRESS,
     * EMAIL)
     * Ex:
     * FILE: employee_data.file_*.file_name
     *
     * @param queryBuilder
     * @param fieldValue
     * @param fieldName
     * @param searchType
     * @param searchOption
     * @return
     */
    private BoolQueryBuilder queryBuilderForKeyword(BoolQueryBuilder queryBuilder, String fieldType, String fieldValue,
            String fieldName, String searchType, String searchOption, boolean isDefault) {

        // search keyword
        if (!isDefault) {
            fieldName = String.format(SEARCH_KEYWORD_TYPE, fieldName);
        }
        if (FieldTypeEnum.ADDRESS.getCode().equals(fieldType) || FieldTypeEnum.LINK.getCode().equals(fieldType)) {
            queryBuilder = QueryBuilders.boolQuery();
        }
        String[] words = fieldValue.split(StringUtils.SPACE);
        switch (searchType) {
        case SEARCH_LIKE_FIRST:
            switch (searchOption) {
            case ALL_WORD:
                mustPrefixQuery(queryBuilder, fieldName, new String[] { fieldValue });
                break;
            case AND_CONDITION:
                mustPrefixQuery(queryBuilder, fieldName, words);
                break;
            case OR_CONDITION:
            default:
                shouldPrefixQuery(queryBuilder, fieldName, words);
                break;
            }
            break;
        case SEARCH_LIKE:
        default:
            switch (searchOption) {
            case ALL_WORD:
                mustWildcard(queryBuilder, fieldName, new String[] { fieldValue }, WILDCARD_LIKE);
                break;
            case AND_CONDITION:
                mustWildcard(queryBuilder, fieldName, words, WILDCARD_LIKE);
                break;
            case OR_CONDITION:
            default:
                shouldWildcard(queryBuilder, fieldName, words, WILDCARD_LIKE);
                break;
            }
            break;
        }
        return queryBuilder;
    }

    /**
     * build should query with prefix data
     *
     * @see org.elasticsearch.index.query.BoolQueryBuilder#should(org.elasticsearch.index.query.QueryBuilder)
     * @see org.elasticsearch.index.query.QueryBuilders#prefixQuery(java.lang.String,
     *      java.lang.String)
     * @param queryBuilder
     * @param name elasticsearch attribute
     * @param words list keyword
     */
    private void shouldPrefixQuery(BoolQueryBuilder queryBuilder, String name, String[] words) {
        for (String word : words) {
            if (StringUtils.isEmpty(word)) {
                continue;
            }
            queryBuilder.should(QueryBuilders.prefixQuery(name, word));
        }
    }

    /**
     * build must query with prefix data
     *
     * @see org.elasticsearch.index.query.BoolQueryBuilder#must(org.elasticsearch.index.query.QueryBuilder)
     * @see org.elasticsearch.index.query.QueryBuilders#prefixQuery(java.lang.String,
     *      java.lang.String)
     * @param queryBuilder
     * @param name elasticsearch attribute
     * @param words list keyword
     */
    private void mustPrefixQuery(BoolQueryBuilder queryBuilder, String name, String[] words) {
        for (String word : words) {
            if (StringUtils.isEmpty(word)) {
                continue;
            }
            queryBuilder.must(QueryBuilders.prefixQuery(name, word));
        }
    }

    /**
     * escaping special char for wildcard
     *
     * @param word
     * @return
     */
    private String escapeChar(String word) {
        String[] listChar = { "*", "?" };
        String keyword = word;
        for (String str : listChar) {
            keyword = keyword.replace(str, "\\" + str);
        }
        return keyword;
    }

    /**
     * build should query with wildcard data
     *
     * @see org.elasticsearch.index.query.BoolQueryBuilder#should(org.elasticsearch.index.query.QueryBuilder)
     * @see org.elasticsearch.index.query.QueryBuilders#wildcardQuery(java.lang.String,
     *      java.lang.String)
     * @param queryBuilder
     * @param name elasticsearch attribute
     * @param words list keyword
     * @param format template format keyword
     */
    private void shouldWildcard(BoolQueryBuilder queryBuilder, String name, String[] words, String format) {
        for (String word : words) {
            if (StringUtils.isEmpty(word)) {
                continue;
            }
            queryBuilder.should(QueryBuilders.wildcardQuery(name, String.format(format, escapeChar(word))));
        }
    }

    /**
     * build must query with wildcard data
     *
     * @see org.elasticsearch.index.query.BoolQueryBuilder#must(org.elasticsearch.index.query.QueryBuilder)
     * @see org.elasticsearch.index.query.QueryBuilders#wildcardQuery(java.lang.String,
     *      java.lang.String)
     * @param queryBuilder
     * @param name elasticsearch attribute
     * @param words list keyword
     * @param format template format keyword
     */
    private void mustWildcard(BoolQueryBuilder queryBuilder, String name, String[] words, String format) {
        for (String word : words) {
            if (StringUtils.isEmpty(word)) {
                continue;
            }
            queryBuilder.must(QueryBuilders.wildcardQuery(name, String.format(format, escapeChar(word))));
        }
    }

    /**
     * builde SearchRequest, set index for search request
     *
     * @param index elasticsearch index
     * @return
     */
    private SearchRequest buildSearchRequest(String index) {
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices(index);
        return searchRequest;
    }

    /**
     * convert result to SelectDetailElasticSearchOutDTO
     *
     * @param response elasticsearch SearchResponse
     * @return
     */
    private SelectDetailElasticSearchOutDTO getSearchResultId(SearchResponse response, String columnId) {
        SelectDetailElasticSearchOutDTO outDto = new SelectDetailElasticSearchOutDTO();
        if (response != null) {
            outDto.setTotal(response.getHits().getTotalHits().value);
            if (outDto.getTotal() <= 0) {
                return outDto;
            }
            SearchHit[] searchHit = response.getHits().getHits();
            for (SearchHit hit : searchHit) {
                hit.getSourceAsMap().forEach((key, value) -> {
                    Map<String, Object> resultMap = new HashMap<>();
                    if (key != null && key.equals(columnId)) {
                        resultMap.put(key, value);
                        outDto.getData().add(resultMap);
                    }
                });
            }
        }
        return outDto;
    }

    /**
     * convert result to SelectDetailElasticSearchOutDTO
     *
     * @param response elasticsearch SearchResponse
     * @return
     */
    private SelectDetailElasticSearchOutDTO getSearchResult(SearchResponse response) {
        SelectDetailElasticSearchOutDTO outDto = new SelectDetailElasticSearchOutDTO();
        if (response != null) {
            outDto.setTotal(response.getHits().getTotalHits().value);
            if (outDto.getTotal() <= 0) {
                return outDto;
            }
            SearchHit[] searchHit = response.getHits().getHits();
            for (SearchHit hit : searchHit) {
                outDto.getData().add(hit.getSourceAsMap());
            }
        }
        return outDto;
    }
}
