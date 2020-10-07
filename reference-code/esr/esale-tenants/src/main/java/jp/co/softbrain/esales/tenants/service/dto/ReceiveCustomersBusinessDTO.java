package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO table {customers_business} database customers
 * 
 * @author lehuuhoa
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiveCustomersBusinessDTO implements Serializable {

    private static final long serialVersionUID = -3847840247065798324L;

    /**
     * ID 顧客サービス
     */
    private Long customerBusinessId;
    /**
     * Name 顧客サービス
     */

    private String customerBusinessName;
    /**
     * ID Industry relations
     */

    private Long customerBusinessParent;

}
