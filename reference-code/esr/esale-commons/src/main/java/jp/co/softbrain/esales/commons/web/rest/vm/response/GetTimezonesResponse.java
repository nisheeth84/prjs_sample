package jp.co.softbrain.esales.commons.web.rest.vm.response;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.commons.service.dto.TimezonesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * response for API create/update employee
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
public class GetTimezonesResponse implements Serializable {
    private static final long serialVersionUID = 2590176148249707402L;

    private List<TimezonesDTO> timezones;
}
