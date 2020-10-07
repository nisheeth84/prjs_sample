/**
 *
 */
package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

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
