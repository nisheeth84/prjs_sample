package jp.co.softbrain.esales.customers.service.dto.activities;

/**
 * A DTO for the response of API getActivities - object employeePhoto.
 * 
 * @author TinhBV
 */

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class GetActivitiesSubType13DTO implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 7320085633850922385L;

    private String           filePath;
    private String           fileName;
}