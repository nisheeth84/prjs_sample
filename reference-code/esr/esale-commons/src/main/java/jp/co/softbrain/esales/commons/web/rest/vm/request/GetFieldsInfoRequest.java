package jp.co.softbrain.esales.commons.web.rest.vm.request;

import lombok.Data;

/**
 * Get fieldsInfo request
 * @author lediepoanh
 *
 */
@Data
public class GetFieldsInfoRequest {
    private Integer fieldBelong;
    private Integer fieldType;
    private Long fieldId;
}
