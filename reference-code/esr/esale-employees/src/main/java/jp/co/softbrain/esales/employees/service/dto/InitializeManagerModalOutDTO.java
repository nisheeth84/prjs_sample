/**
 * 
 */
package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author nguyentrunghieu
 */
@Data
@EqualsAndHashCode
public class InitializeManagerModalOutDTO implements Serializable {

    private static final long serialVersionUID = 7449529375925384445L;

    /**
     * departments
     */
    private List<InitializeManagerModalSubType2> departments;

    /**
     * employee
     */
    private List<InitializeManagerModalSubType1> employees;

    /**
     * manager
     */
    private List<InitializeManagerModalSubType3> managers;
}
