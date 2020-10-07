package jp.co.softbrain.esales.employees.web.rest.vm.request;

import java.io.Serializable;

import lombok.Data;

/**
 *  DTO for query getServices API.
 *
 * @author lehuuhoa
 */
@Data
public class GetServicesRequest implements Serializable {
    
    private static final long serialVersionUID = -5100829061705607192L;
    
    private Long employeeId;
}
