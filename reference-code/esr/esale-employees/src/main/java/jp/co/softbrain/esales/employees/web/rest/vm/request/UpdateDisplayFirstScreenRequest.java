package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Update Display First Screen Request
 * @author TuanLV
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDisplayFirstScreenRequest implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2866986535871887714L;
    /**
     * daemployeeIdta
     */
    private Long employeeId;

    /**
     * isDisplayFirstScreen
     */
    private Boolean isDisplayFirstScreen;
    /**
     * updatedDate
     */
    private Instant updatedDate;
}
