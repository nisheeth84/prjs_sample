package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities - object businessCard.
 * 
 * @author TinhBV
 */

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class GetActivitiesSubType3DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -8725123467874126563L;

    private String          customerName;
    private Long            businessCardId;
    private String          firstName;
    private String          lastName;
    private String          firstNameKana;
    private String          lastNameKana;
    private String          position;
    private String          departmentName;
    private String          businessCardImagePath;
    private String          businessCardImageName;
}