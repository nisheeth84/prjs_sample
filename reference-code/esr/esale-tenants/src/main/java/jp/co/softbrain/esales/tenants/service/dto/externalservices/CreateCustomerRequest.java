package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;

import lombok.Data;

/**
 * Request entity for API create-customer
 *
 * @author tongminhcuong
 */
@Data
public class CreateCustomerRequest implements Serializable {

    private static final long serialVersionUID = -4405317697880746756L;

    private String customerName;

    private Long businessMainId;

    private Long businessSubId;
}
