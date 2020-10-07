package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for ressponse message
 * @author phamhoainam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO implements Serializable {
    private static final long serialVersionUID = -6716754176206729700L;

    /**
     * Name of application or function call API delete
     */
    private  String item;

    /**
     * Message if delete has error
     */
    private String errorMessage;
}
