package jp.co.softbrain.esales.commons.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.commons.domain.Address}
 * entity.
 * 
 * @author chungochai
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO extends BaseDTO{
    
    private static final long serialVersionUID = 6568226640463033412L;
    
    private Long addressId;

    private String zipCode;

    private String prefectureName;

    private String cityName;
    
    private String areaName;

}
