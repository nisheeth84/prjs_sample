package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base DTO
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 9027186802082145191L;

    /**
     * The createdDate
     */
    private Instant createdDate;

    /**
     * The createdUser
     */
    private Long createdUser;

    /**
     * The updatedDate
     */
    private Instant updatedDate;

    /**
     * The updatedUser
     */
    private Long updatedUser;
}
