package jp.co.softbrain.esales.commons.service.mapper;

import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.TimezonesDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Timezones} and its DTO {@link TimezonesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TimezonesMapper extends EntityMapper<TimezonesDTO, Timezones> {



    default Timezones fromTimezoneId(Long id) {
        if (id == null) {
            return null;
        }
        Timezones timezones = new Timezones();
        timezones.setTimezoneId(id);
        return timezones;
    }
}
