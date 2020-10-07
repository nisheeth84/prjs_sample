package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import jp.co.softbrain.esales.utils.dto.OrderValue;
import jp.co.softbrain.esales.utils.dto.SearchItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * View model of API updateListViewSetting
 * 
 * @author nguyentrunghieu
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateListViewSettingRequest implements Serializable {

    private static final long serialVersionUID = 3228807014626953481L;

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
