package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.CheckDeletePositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetPositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.PositionsDTO;
import jp.co.softbrain.esales.employees.service.dto.UpdatePositionsOutDTO;

/**
 * Service Interface for managing Positions
 *
 * @author QuangLV
 */
@XRayEnabled
public interface PositionsService {

    /**
     * get Positions : get all Positions sort by position id ASC
     *
     * @return GetPositionsOutDTO : list DTO out of API getPositions
     */
    GetPositionsOutDTO getPositions();

    /**
     * updatePositions : insert or update Positions
     *
     * @param positions : data insert or update Positions
     * @param deletedPositions : list position deleted
     * @return UpdatePositionsOutDTO : DTO out of API updatePositions
     */
    UpdatePositionsOutDTO updatePositions(List<PositionsDTO> positions, List<Long> deletedPositions);

    /**
     * Get the "id" position.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PositionsDTO> findOne(Long id);

    /**
     * check delete positions : check delete position by list position id
     *
     * @param positionIds : list position id need delete
     * @return CheckDeletePositionsOutDTO : list position id
     */
    public CheckDeletePositionsOutDTO getCheckDeletePositions(List<Long> positionIds);
}
