/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.commons;

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
    private static final long serialVersionUID = 2284642499889201719L;

    private Integer fieldBelong;
}
