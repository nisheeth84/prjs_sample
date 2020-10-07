/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto.schedules;   

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Input DTO class for API getFilterWorkingDays
 * 
 * @author nguyentrunghieu
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class FilterWorkingDaysInDTO implements Serializable {

    private static final long serialVersionUID = 1436344413036640175L;

    /**
     * filterModeDate
     */
    private String filterModeDate;

    /**
     * dateFrom
     */
    private String countFrom;

    /**
     * dateTo
     */
    private String countTo;
}
