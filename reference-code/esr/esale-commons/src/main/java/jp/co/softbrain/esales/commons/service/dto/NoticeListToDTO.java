package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity of import APIs
 *
 * @author Trungnd
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeListToDTO implements Serializable {
    /**
     * 
     */
    private List<Long> employeeIds;
    /**
     * 
     */
    private List<Long> groupIds;
    /**
     * 
     */
    private List<Long> departmentIds;
}
