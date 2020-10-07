package jp.co.softbrain.esales.employees.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;

import jp.co.softbrain.esales.employees.service.dto.EmployeesDataDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;

/**
 * Utils for Employees
 *
 * @author lediepoanh
 */
public final class UtilsEmployees {

    private UtilsEmployees() {
        // do nothing
    }

    /**
     * convert string employeeData to Object EmployeesDataDTO
     *
     * @param strEmpData
     * @return
     * @throws IOException
     */
    public static List<EmployeesDataDTO> convertEmployeeDataFromString(ObjectMapper objectMapper, String strEmpData,
            Map<String, Object> mapData, List<CustomFieldsInfoOutDTO> fieldsList)
            throws IOException {
        final Logger log = LoggerFactory.getLogger(UtilsEmployees.class);
        List<EmployeesDataDTO> employeeDataList = new ArrayList<>();
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true);
        objectMapper.configure(JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN, true);
        objectMapper.setNodeFactory(JsonNodeFactory.withExactBigDecimals(true));
        if (mapData == null && StringUtils.isNotBlank(strEmpData)) {
            TypeReference<Map<String, Object>> typeRef = new TypeReference<Map<String, Object>>() {};
            mapData = objectMapper.readValue(strEmpData, typeRef);

        }
        if (mapData != null) {
            Map<String, CustomFieldsInfoOutDTO> mapFields = new HashMap<>();
            if (!CollectionUtils.isEmpty(fieldsList)) {
                for (CustomFieldsInfoOutDTO fields : fieldsList) {
                    mapFields.put(fields.getFieldName(), fields);
                }
            }
            mapData.forEach((empDataKey, empDataValue) -> {
                EmployeesDataDTO dataField = new EmployeesDataDTO();
                dataField.setKey(empDataKey);
                if (empDataValue != null) {
                    if (empDataValue instanceof Map || empDataValue instanceof List) {
                        try {
                            dataField.setValue(objectMapper.writeValueAsString(empDataValue));
                        } catch (JsonProcessingException e) {
                            log.error(e.getLocalizedMessage());
                        }
                    }
                    else {
                        dataField.setValue(String.valueOf(empDataValue));
                    }
                }
                CustomFieldsInfoOutDTO fields = mapFields.get(empDataKey);
                if (fields != null) {
                    dataField.setFieldType(fields.getFieldType());
                }
                employeeDataList.add(dataField);
            });
        }
        return employeeDataList;
    }
}
