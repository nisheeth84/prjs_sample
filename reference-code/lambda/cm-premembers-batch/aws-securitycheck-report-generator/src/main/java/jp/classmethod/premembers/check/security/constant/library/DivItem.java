package jp.classmethod.premembers.check.security.constant.library;

public class DivItem {
    private String value;
    private String name;
    private int displayOrder;

    public DivItem(String divisionValue, String divisionName, int displayOrder) {
        this.value = divisionValue;
        this.name = divisionName;
        this.displayOrder = displayOrder;
    }

    public String name() {
        return name;
    }

    public String getName() {
        return name;
    }

    public int displayOrder() {
        return displayOrder;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public String value() {
        return value;
    }

    public String getValue() {
        return value;
    }
}
