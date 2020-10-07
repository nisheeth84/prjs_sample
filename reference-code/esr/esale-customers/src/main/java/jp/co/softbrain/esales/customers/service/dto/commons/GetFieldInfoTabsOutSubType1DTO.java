package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Field Info Tabs
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class GetFieldInfoTabsOutSubType1DTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = -6045985156185777904L;
    
    /**
     * itemId
     */
    private Long itemId;
    
    /**
     * itemLabel
     */
    private String itemLabel;
}
