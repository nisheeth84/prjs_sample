package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Out DTO class for API initializeEditMode
 */
@Data
@EqualsAndHashCode
public class InitializeEditModeOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -188696360949715710L;

    /**
     * business
     */
    private List<InitializeEditModeOutSubTypeDTO> business = new ArrayList<>();
}
