package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request of CountBusinessCardsDigitized api
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountBusinessCardsDigitizedRequest implements Serializable {

    private static final long serialVersionUID = -8237651317273958108L;

    private String digitalDate;
}
