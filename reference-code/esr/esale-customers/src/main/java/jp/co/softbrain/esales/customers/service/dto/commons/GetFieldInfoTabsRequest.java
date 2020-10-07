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
public class GetFieldInfoTabsRequest implements Serializable {

    private static final long serialVersionUID = 1527889038081720565L;

    private Integer tabBelong;
    private Integer tabId;
}
