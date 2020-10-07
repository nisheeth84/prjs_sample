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
public class GetInitializeListInfoRequest implements Serializable {
    private static final long serialVersionUID = -4123451260277148461L;

    private Integer fieldBelong;
}
