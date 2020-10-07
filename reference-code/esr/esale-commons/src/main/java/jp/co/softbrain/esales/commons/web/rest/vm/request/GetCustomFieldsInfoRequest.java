/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCustomFieldsInfoRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2284642499889201719L;

    private Integer fieldBelong;
}
