package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * BusinessCustomersDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GetCustomersOutBusinessDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -6097637894746807181L;

    /**
     * businessMainId
     */
    private Long businessMainId;

    /**
     * businessMainName
     */
    private String businessMainName;

    /**
     * businessSubId
     */
    private Long buisinessSubId;

    /**
     * businessSubName
     */
    private String businessSubname;
}
