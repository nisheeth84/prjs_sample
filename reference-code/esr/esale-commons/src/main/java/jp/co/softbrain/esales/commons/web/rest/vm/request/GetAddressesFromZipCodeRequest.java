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
public class GetAddressesFromZipCodeRequest implements Serializable {

    private static final long serialVersionUID = 2284642499811111719L;

    private String zipCode;
    private Long offset;
    private Long limit;
}
