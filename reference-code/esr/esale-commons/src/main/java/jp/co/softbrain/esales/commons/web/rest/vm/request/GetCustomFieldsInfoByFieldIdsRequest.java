/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCustomFieldsInfoByFieldIdsRequest implements Serializable {

    private static final long serialVersionUID = 1522768758081720765L;

    private List<Long> fieldIds;
}
