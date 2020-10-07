package jp.co.softbrain.esales.employees.web.rest.vm;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A Auth check login state
 */
@Data
@EqualsAndHashCode
public class AuthCheckVM implements Serializable {

    private static final long serialVersionUID = 7263221772270213930L;
    
    /**
     * contract site request
     */
    private String site;
}
