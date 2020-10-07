/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for node lookupData.itemReflect of Response from API getEmployeeLayout
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
public class ItemReflectWrapperDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 7718103842243999462L;

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
