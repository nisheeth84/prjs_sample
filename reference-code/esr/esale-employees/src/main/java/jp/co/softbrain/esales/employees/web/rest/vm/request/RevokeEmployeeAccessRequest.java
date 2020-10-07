package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The RevokeEmployeeAccessRequest class
 *
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
public class RevokeEmployeeAccessRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3103428373020640507L;

    /**
     * packageIds
     */
    private List<Long> packageIds;
}
