package jp.co.softbrain.esales.customers.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The Response Get Field Info Tabs
 * @author phamdongdong
 *
 */
@Data
@EqualsAndHashCode
public class GetFieldInfoTabsResponseDTO implements Serializable {

    /**
     * The serialVersionUID
     */
    private static final long serialVersionUID = 2024558727991450177L;
    
    /**
     * fieldId
     */
    private List<GetFieldInfoTabsOutSubType2ResponseDTO> data;
    
    /**
     * fieldInfoTabId
     */
    private List<GetFieldInfoTabsOutSubType3ResponseDTO> fields;

}
