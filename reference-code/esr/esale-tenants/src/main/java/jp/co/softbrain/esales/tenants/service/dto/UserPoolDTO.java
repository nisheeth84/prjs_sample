package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * UserPoolDTO
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UserPoolDTO implements Serializable{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8330212600465837822L;
    
    private Long tenantId;
    private String clientId;
    private String userPoolId;
    private Boolean isPc;
    private Boolean isApp;
    private String issuer;

}
