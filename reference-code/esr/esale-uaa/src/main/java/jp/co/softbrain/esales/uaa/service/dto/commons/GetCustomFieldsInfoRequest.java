/**
 * 
 */
package jp.co.softbrain.esales.uaa.service.dto.commons;

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
    private static final long serialVersionUID = 5914194248279374853L;

    private Integer fieldBelong;
}
