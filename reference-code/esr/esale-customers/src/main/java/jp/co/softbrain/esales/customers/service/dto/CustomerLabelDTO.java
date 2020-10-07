package jp.co.softbrain.esales.customers.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for label for API getDataSyncElasticSearch
 * 
 * @author buithingocanh
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class CustomerLabelDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 8212734304999100350L;

    /**
     * value
     */
    private Long value;

    private String labelJaJp;

    private String labelEnUs;

    private String labelZhCn;

}
