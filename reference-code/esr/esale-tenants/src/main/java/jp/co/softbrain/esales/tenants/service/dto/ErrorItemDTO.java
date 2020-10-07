package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for error with item response API.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorItemDTO implements Serializable {

    private static final long serialVersionUID = -8377666910687710776L;

    private String item;

    private String errorMessage;
}
