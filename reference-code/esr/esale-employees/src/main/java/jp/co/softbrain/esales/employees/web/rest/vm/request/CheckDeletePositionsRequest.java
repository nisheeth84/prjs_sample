/**
 *
 */
package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Check delete positions view modal
 *
 * @author phamminhphu
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CheckDeletePositionsRequest implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3060008562454950019L;
    private List<Long> positionIds;
}
