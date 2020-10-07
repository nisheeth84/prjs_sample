package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.employees.domain.Positions;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;

/**
 * Mapper for the entity {@link Positions} and its DTO {@link PositionsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PositionsMapper extends EntityMapper<PositionsDTO, Positions> {

    default Positions fromId(Long positionId) {
        if (positionId == null) {
            return null;
        }
        Positions positions = new Positions();
        positions.setPositionId(positionId);
        return positions;
    }
}
