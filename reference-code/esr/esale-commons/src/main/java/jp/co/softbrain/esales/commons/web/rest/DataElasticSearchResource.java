package jp.co.softbrain.esales.commons.web.rest;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.commons.web.rest.vm.response.SelectDetailElasticSearchResponse;
import jp.co.softbrain.esales.commons.service.ElasticSearchService;
import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchInDTO;
import jp.co.softbrain.esales.commons.service.dto.SelectDetailElasticSearchOutDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.GetDetailElasticSearchRequest;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.errors.CustomException;
import jp.co.softbrain.esales.utils.MapUtils;
import jp.co.softbrain.esales.utils.dto.DataField;
import jp.co.softbrain.esales.utils.dto.DataRow;

/**
 * DataElasticSearchQuery class process GraphQL query
 *
 */
@RestController
@RequestMapping("/api")
public class DataElasticSearchResource {
    private final Logger log = LoggerFactory.getLogger(DataElasticSearchResource.class);

    @Autowired
    private ElasticSearchService elasticSearchService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * search detail elasticsearch
     *
     * @param index
     * @param offset
     * @param limit
     * @param searchConditions
     * @param filterConditions
     * @param orderBy
     * @param languageCode
     * @return
     */
    @PostMapping(path = "/get-detail-elastic-search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SelectDetailElasticSearchResponse> getDetailElasticSearch(
            @RequestBody GetDetailElasticSearchRequest request) {

        // validate input
        if (StringUtils.isEmpty(request.getIndex())) {
            throw new CustomException("Elasticsearch index is required", Constants.Elasticsearch.INDEX_FIELD,
                    Constants.RIQUIRED_CODE);
        }

        SelectDetailElasticSearchInDTO inputDto = new SelectDetailElasticSearchInDTO();
        inputDto.setIndex(request.getIndex());
        inputDto.setOffset(request.getOffset());
        inputDto.setLimit(request.getLimit());
        inputDto.setSearchConditions(request.getSearchConditions());
        inputDto.setFilterConditions(request.getFilterConditions());
        inputDto.setOrderBy(request.getOrderBy());
        if (StringUtils.isNotEmpty(request.getLanguageCode())) {
            inputDto.setLanguageCode(request.getLanguageCode());
        }
        if (StringUtils.isNotBlank(request.getColumnId())) {
            inputDto.setColumnId(request.getColumnId());
        }

        SelectDetailElasticSearchOutDTO outDto = new SelectDetailElasticSearchOutDTO();
        try {
            outDto = elasticSearchService.getDetailElasticSearch(inputDto);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return ResponseEntity.ok(convertDataResponse(outDto));
    }

    /**
     * convert data response
     *
     * @param outDto
     * @return
     */
    @SuppressWarnings("unchecked")
    private SelectDetailElasticSearchResponse convertDataResponse(SelectDetailElasticSearchOutDTO outDto) {
        SelectDetailElasticSearchResponse response = new SelectDetailElasticSearchResponse();

        if (outDto != null && outDto.getTotal() > 0) {
            response.setTotal(outDto.getTotal());

            List<DataRow> rowList = new ArrayList<>();
            // set data to response
            outDto.getData().forEach(row -> {

                List<DataField> itemList = new ArrayList<>();
                Iterator<Entry<String, Object>> iterator = row.entrySet().iterator();
                while (iterator.hasNext()) {
                    Entry<String, Object> entry = iterator.next();
                    if (entry.getKey().endsWith(Constants.Elasticsearch.SUFFIX_FIELD_FULLTEXT)) {
                        continue;
                    }
                    Object value = entry.getValue();
                    if (value == null) {
                        value = "";
                    }
                    DataField keyValue = new DataField();
                    keyValue.setKey(entry.getKey());

                    if (value instanceof Map) {
                        try {

                            Map<String, Object> newMap = MapUtils.removeItemMap((Map<String, Object>) value);
                            keyValue.setValue(objectMapper.writeValueAsString(newMap));
                        } catch (JsonProcessingException e) {
                            log.warn("Convert Map to json failed");
                        }
                    } else if (value instanceof List) {
                        try {
                            List<Map<String, Object>> newList = new ArrayList<>();
                            ((List<Map<String, Object>>) value)
                                    .forEach(item -> newList.add(MapUtils.removeItemMap(item)));
                            keyValue.setValue(objectMapper.writeValueAsString(newList));

                        } catch (JsonProcessingException e) {
                            log.warn("Convert List to json failed");
                        }
                    } else {
                        keyValue.setValue(value.toString());
                    }
                    itemList.add(keyValue);
                }

                DataRow dataRow = new DataRow();
                dataRow.setRow(itemList);
                rowList.add(dataRow);
            });
            response.setDataElasticSearch(rowList);
            response.setOrganizationSearchConditions(outDto.getOrganizationSearchConditions());
            response.setOrganizationFilterConditions(outDto.getOrganizationFilterConditions());
            response.setRelationSearchConditions(outDto.getRelationSearchConditions());
            response.setRelationFilterConditions(outDto.getRelationFilterConditions());
        }
        return response;
    }
}
