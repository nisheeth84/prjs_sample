/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author phamdongdong
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCustomerConnectionMapInDTO implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -7441113244807279912L;
    
    /**
     * deletedMasterMotivations
     */
    private List<Long> deletedMasterMotivations;

    /**
     * masterMotivations
     */
    private List<MasterMotivationInDTO> masterMotivations;

    /**
     * deletedMasterStands
     */
    private List<Long> deletedMasterStands;

    /**
     * masterStands
     */
    private List<MasterStandsInDTO> masterStands;

}
