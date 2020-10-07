package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO mapping for the entity at
 * {@link jp.co.softbrain.esales.commons.domain.ListViewSettingsFiltersDTO}
 * 
 * @author nguyenvanchien3
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class ListViewSettingsFiltersDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -1166828500109997973L;

    /**
     * listViewSettingFilterId
     */
    private Long listViewSettingFilterId;

    /**
     * listViewSettingId
     */
    private Long listViewSettingId;

    /**
     * targetType
     */
    private Integer targetType;

    /**
     * targetId
     */
    private Long targetId;

    /**
     * filterValue
     */
    private String filterValue;
}
