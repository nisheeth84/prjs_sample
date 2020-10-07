/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Sub DTO for API initializeNetworkMap
 * 
 * @author phamminhphu
 *
 */
@AllArgsConstructor()
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class InitializeNetworkMapSubType8DTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -861536910374172963L;

    /**
     * iconName
     */
    private String iconName;

    /**
     * iconPath
     */
    private String iconPath;

    /**
     * backgroundColor
     */
    private Integer backgroundColor;
}
