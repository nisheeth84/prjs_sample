package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * ProductTradingProgressOutDTO
 *
 * @author LOCVU
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class GetProgressesOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -8862673335818900719L;

    /**
     * progresses
     */
    private List<ProductTradingProgressOutDTO> progresses;
}
