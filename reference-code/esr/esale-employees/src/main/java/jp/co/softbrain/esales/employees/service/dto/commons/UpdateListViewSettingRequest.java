package jp.co.softbrain.esales.employees.service.dto.commons;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.Data;

/**
 * View model of API updateListViewSetting
 * 
 * @author nguyentrunghieu
 */
@Data
public class UpdateListViewSettingRequest implements Serializable {

    private static final long serialVersionUID = 169655051912715360L;

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
     * 
     */
    private List<KeyValue> extraSettings;

    /**
     * 
     */
    private List<SearchItem> filterConditions;

    /**
     * 
     */
    private List<OrderValue> orderBy;
}
