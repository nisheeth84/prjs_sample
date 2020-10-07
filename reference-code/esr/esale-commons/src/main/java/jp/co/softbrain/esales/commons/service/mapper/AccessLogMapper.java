package jp.co.softbrain.esales.commons.service.mapper;


import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.AccessLogDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link AccessLog} and its DTO {@link AccessLogDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AccessLogMapper extends EntityMapper<AccessLogDTO, AccessLog> {



    default AccessLog fromId(Long id) {
        if (id == null) {
            return null;
        }
        AccessLog accessLog = new AccessLog();
        accessLog.setAccessLogId(id);
        return accessLog;
    }
}
