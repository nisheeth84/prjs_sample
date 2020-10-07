/**
 * 
 */
package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * View model for API UpdateFieldInfoTabPersonal
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFieldInfoTabPersonalRequest implements Serializable {
    private static final long serialVersionUID = 6511198430328421273L;

    /**
     * fieldInfoTabPersonalId
     */
    private Long fieldInfoTabPersonalId;

    /**
     * fieldInfoTabId
     */
    private Long fieldInfoTabId;

    /**
     * isColumnFixed
     */
    private boolean isColumnFixed;

    /**
     * columnWidth
     */
    private Integer columnWidth;

    /**
     * updatedDate
     */
    private Instant updatedDate;
}
