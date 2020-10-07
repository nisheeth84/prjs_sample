package jp.classmethod.premembers.check.security.constant.library;

import java.util.EnumMap;

public class DivMap<K extends Enum<K>> extends EnumMap<K, DivItem> {
    private static final long serialVersionUID = 213423278728411587L;

    public DivMap(Class<K> keyType) {
        super(keyType);
    }

    public void put(K key, String divValue, String divName, int displayOrder) {
        super.put(key, new DivItem(divValue, divName, displayOrder));
    }

    public void put(K key, DivItem item, int displayOrder) {
        super.put(key, new DivItem(item.getValue(), item.getName(), displayOrder));
    }
}
