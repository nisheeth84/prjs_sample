package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.TimezonesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetTimezonesResponse implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4175900147759709135L;
    private List<TimezonesDTO> timezones;
}
