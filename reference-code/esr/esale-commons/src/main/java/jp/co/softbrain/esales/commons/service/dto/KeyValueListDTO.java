package jp.co.softbrain.esales.commons.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.utils.dto.KeyValue;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Class contain a list key-value
 * 
 * @author nguyenvanchien3
 */
@Data
@EqualsAndHashCode
public class KeyValueListDTO implements Serializable {
    /**
     * @serialVersionUID
     */
    private static final long serialVersionUID = 1710446494806057371L;

    /**
     * keyValues
     */
    private List<KeyValue> keyValues = new ArrayList<>();
}
