package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UpdateMasterScenariosOutDTO for Api updateMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMasterScenariosOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -1222233827608029654L;

    /**
     * The scenarioId
     */
    private Long scenarioId;
}
