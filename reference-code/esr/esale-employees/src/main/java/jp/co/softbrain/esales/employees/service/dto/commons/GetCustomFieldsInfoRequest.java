package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;

import lombok.Data;

/**
 * @author nguyentienquan
 */
@Data
public class GetCustomFieldsInfoRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7732384492964416051L;

    private Integer fieldBelong;
}
