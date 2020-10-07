/**
 * 
 */
package jp.co.softbrain.esales.customers.web.rest.vm.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request for API getListSearchConditionInfo
 * 
 * @author nguyenhaiduong
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetListSearchConditionInfoRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8116992570071746658L;

    /**
     * groupId
     */
    private Long listId;
}
