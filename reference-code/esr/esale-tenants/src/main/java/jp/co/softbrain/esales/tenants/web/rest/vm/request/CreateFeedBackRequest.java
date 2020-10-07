package jp.co.softbrain.esales.tenants.web.rest.vm.request;

import java.io.Serializable;

import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackInDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * CreateFeedBackRequest
 *
 * @author DatDV
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CreateFeedBackRequest implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 6257428807274167587L;

    /**
     * feedBack
     */
    private CreateFeedBackInDTO createFeedBack;
}
