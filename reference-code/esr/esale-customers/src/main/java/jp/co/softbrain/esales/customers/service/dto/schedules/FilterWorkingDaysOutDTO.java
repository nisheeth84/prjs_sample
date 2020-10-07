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
 * Output DTO class for API getFilterWorkingDays
 * 
 * @author nguyentrunghieu
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class FilterWorkingDaysOutDTO implements Serializable {

    private static final long serialVersionUID = 4105378510208875640L;

    /**
     * dateFrom
     */
    private String dateFrom;

    /**
     * dateTo
     */
    private String dateTo;
}
