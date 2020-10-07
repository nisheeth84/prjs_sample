package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response of CountBusinessCardsDigitized api
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountBusinessCardsDigitizedResponse implements Serializable {

    private static final long serialVersionUID = 1111168758091720465L;

    private Integer numberBusinessCardsDigitized;
}
