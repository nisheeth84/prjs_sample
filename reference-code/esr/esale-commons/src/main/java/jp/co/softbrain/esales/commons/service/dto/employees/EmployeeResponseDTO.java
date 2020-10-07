package jp.co.softbrain.esales.commons.service.dto.employees;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for response from API getEmployee
 * 
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode()
public class EmployeeResponseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8074941906093394828L;

    /**
     * data of node fields
     */
    private List<EmployeeLayoutDTO> fields = new ArrayList<>();

    /**
     * data of node data
     */
    private EmployeeDataDTO data;

    /**
     * data of node tabsInfo
     */
    private List<TabsInfoDTO> tabsInfo = new ArrayList<>();

    /**
     * data of node dataTabs
     */
    private String dataTabs;

    /**
     * data of node dataListFavoriteGroup
     */
    private String dataListFavoriteGroup;

    /**
     * data of node dataWatchs
     */
    private String dataWatchs;
}
