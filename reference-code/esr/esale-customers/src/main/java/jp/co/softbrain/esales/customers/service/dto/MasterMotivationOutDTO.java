package jp.co.softbrain.esales.customers.service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Master Motivation Out DTO
 *
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class MasterMotivationOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6171463389549952057L;

    /**
     * deletedMasterMotivations
     */
    private List<Long> deletedMasterMotivations;

    /**
     * insertedMasterMotivations
     */
    private List<Long> insertedMasterMotivations;

    /**
     * updatedMasterMotivations
     */
    private List<Long> updatedMasterMotivations;
}
