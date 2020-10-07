/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 * @author nguyentienquan
 */
@Data
public class GetImportInitInfoRequest implements Serializable {
    private static final long serialVersionUID = -8243198501064610165L;

    private Long extensionBelong;
}
