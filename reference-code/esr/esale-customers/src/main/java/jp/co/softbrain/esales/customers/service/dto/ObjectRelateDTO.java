package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * ObjectRelateDTO
 *
 * @author lequyphuc
 */
@Data
@EqualsAndHashCode
public class ObjectRelateDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -4886634089765475861L;

    /**
     * objectRelateType
     */
    private Integer objectRelateType;
    /**
     * objectRelateData
     */
    private ObjectRelateDTO objectRelateData;

}
