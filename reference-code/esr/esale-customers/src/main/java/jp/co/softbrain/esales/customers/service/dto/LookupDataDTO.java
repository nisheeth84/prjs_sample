/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * data of node data.lookupData of response from API getEmployeeLayout
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class LookupDataDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1295306408429860125L;

    /**
     * extensionBelong
     */
    private Integer extensionBelong;

    /**
     * searchKey
     */
    private Long searchKey;

    /**
     * itemReflect
     */
    private List<ItemReflectDTO> itemReflect = new ArrayList<>();

}
