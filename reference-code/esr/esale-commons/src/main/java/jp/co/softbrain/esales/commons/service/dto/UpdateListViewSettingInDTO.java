package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO input for API updateListViewSetting
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateListViewSettingInDTO extends BaseDTO implements Serializable {

    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = -5408032535260685772L;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * fieldBelong
     */
    private Integer fieldBelong;

    /**
     * selectedTargetType
     */
    private Integer selectedTargetType;

    /**
     * selectedTargetId
     */
    private Long selectedTargetId;

    /**
     * extraSettings
     */
    private List<KeyValue> extraSettings;

    /**
     * filterConditions
     */
    private List<SearchItem> filterConditions;

    /**
     * orderBy
     */
    private List<OrderValue> orderBy;
}
