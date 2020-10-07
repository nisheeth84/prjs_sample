/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class CreateDataChangeElasticSearchRequest implements Serializable {

    private static final long serialVersionUID = 1280274844366552422L;

    private Integer extensionBelong;

    private List<Long> dataIds;

    private Integer action;
}
