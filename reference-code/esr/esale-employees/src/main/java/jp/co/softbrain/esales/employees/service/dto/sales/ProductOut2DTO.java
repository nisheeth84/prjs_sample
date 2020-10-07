package jp.co.softbrain.esales.employees.service.dto.sales;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * A DTO for the getProductTradings
 *
 * @author Thanhdv
 */
@Data
@EqualsAndHashCode
public class ProductOut2DTO implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7054464291683558634L;

	/**
	 * productId
	 */
	private Long productId;

	/**
	 * productName
	 */
	private String productName;

    /**
     * productImageName
     */
    private String productImageName;

    /**
     * productImagePath
     */
    private String productImagePath;

    /**
     * productCategoryName
     */
    private String productCategoryName;

    /**
     * memo
     */
    private String memo;
}
