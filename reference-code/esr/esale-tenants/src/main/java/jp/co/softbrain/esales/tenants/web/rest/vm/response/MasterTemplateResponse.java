package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Response for Update/Rollback MasterTemplate api
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MasterTemplateResponse implements Serializable {

    private static final long serialVersionUID = 1888868758091720465L;

    private String message;
}
