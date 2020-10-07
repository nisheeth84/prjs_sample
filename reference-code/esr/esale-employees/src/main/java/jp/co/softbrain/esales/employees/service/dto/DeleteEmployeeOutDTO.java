package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO out put for API deleteEmployee
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class DeleteEmployeeOutDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -14018668336475361L;

    /**
     * dataRelation
     */
    private List<DeleteEmployeeOutSubType1> dataRelation = new ArrayList<>();

}
