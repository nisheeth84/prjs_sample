/**
 * 
 */
package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO out for the API initializeNetworkMap
 * 
 * @author phamminhphu
 */
@Data
@EqualsAndHashCode
public class InitializeNetworkMapOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 5343206356261519814L;

    /**
     * companyId
     */
    private Long companyId;

    /**
     * departments
     */
    private List<InitializeNetworkMapSubType12DTO> departments;

    /**
     * businessCardDatas
     */
    private List<InitializeNetworkMapSubType13DTO> businessCardDatas;

    /**
     * employeeDatas
     */
    private List<InitializeNetworkMapSubType3DTO> employeeDatas;

    /**
     * standDatas
     */
    private List<MastersStandsType1DTO> standDatas;

    /**
     * motivationDatas
     */
    private List<InitializeNetworkMapSubType4DTO> motivationDatas;

    /**
     * customer
     */
    private InitializeNetworkMapSubType9DTO customer;

    /**
     * customerParent
     */
    private InitializeNetworkMapSubType9DTO customerParent;

    /**
     * customerChilds
     */
    private List<InitializeNetworkMapSubType9DTO> customerChilds;
}
