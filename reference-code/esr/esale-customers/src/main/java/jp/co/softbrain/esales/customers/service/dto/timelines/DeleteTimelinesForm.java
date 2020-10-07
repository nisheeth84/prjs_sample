package jp.co.softbrain.esales.customers.service.dto.timelines;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class DeleteTimelinesForm implements Serializable {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 2444341425225244702L;

    /**
     * The serviceType
     */
    private Integer serviceType;
    
    /**
     * The objectIds
     */
    private List<Long> objectIds;
}
