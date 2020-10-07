package jp.co.softbrain.esales.tenants.service.dto.externalservices;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Request entity for API create-product
 *
 * @author tongminhcuong
 */
@Data
public class CreateProductInfo implements Serializable {

    private static final long serialVersionUID = -8176766227989835347L;

    private String productName;
}
