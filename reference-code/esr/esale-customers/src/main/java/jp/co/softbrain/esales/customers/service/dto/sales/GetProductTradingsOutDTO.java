package jp.co.softbrain.esales.customers.service.dto.sales;

import java.io.Serializable;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * A DTO for the {@link jp.co.softbrain.esales.sales.domain.ProductTradings}
 * entity.
 *
 * @author LocVX
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetProductTradingsOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3644651339712260530L;

    /**
     * productTradings
     */
    private List<ProductTradingsOutDTO> productTradings;

    /**
     * progresses
     */
    private List<ProgressesOutDTO> progresses;

    /**
     * initializeInfo
     */
    private InitializeInfoOutDTO initializeInfo;

    /**
     * fieldInfo
     */
    private List<FieldInfoOutDTO> fieldInfo;

    /**
     * total
     */
    private long total;

    /**
     * lastUpdateDate
     */
    private String lastUpdateDate;
}
