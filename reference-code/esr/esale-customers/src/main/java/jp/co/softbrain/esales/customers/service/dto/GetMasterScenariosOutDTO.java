package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * GetMasterScenariosOutDTO dto for GetMasterScenarios
 *
 * @author huandv
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetMasterScenariosOutDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1028931331123336550L;

    /**
     * scenarios list MasterScenariosSubType1DTO
     */
    private List<MasterScenariosSubType1DTO> scenarios;

}
