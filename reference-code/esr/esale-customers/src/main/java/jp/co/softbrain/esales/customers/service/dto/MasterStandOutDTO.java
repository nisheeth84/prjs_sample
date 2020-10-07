package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Master Stand Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class MasterStandOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7730033290750014405L;

    /**
     * deletedMasterStands
     */
    private List<Long> deletedMasterStands;

    /**
     * insertedMasterStands
     */
    private List<Long> insertedMasterStands;

    /**
     * updatedMasterStands
     */
    private List<Long> updatedMasterStands;
}
