package jp.co.softbrain.esales.employees.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.employees.service.dto.commons.TabsInfoSubTypeDTO;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetFollowedsOutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for response from API getEmployee
 *
 * @author nguyentienquan
 */
@Data
@EqualsAndHashCode()
@AllArgsConstructor
@NoArgsConstructor
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
    private List<TabsInfoSubTypeDTO> tabsInfo = new ArrayList<>();

    /**
     * data of node dataTabs
     */
    private List<GetEmployeeDataTabDTO> dataTabs;

    /**
     * data of node dataListFavoriteGroup
     */
    private String dataListFavoriteGroup;

    /**
     * data of node dataWatch
     */
    private GetFollowedsOutDTO dataWatchs;
}
