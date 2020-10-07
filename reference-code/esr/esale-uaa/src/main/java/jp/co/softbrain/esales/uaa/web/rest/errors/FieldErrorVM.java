package jp.co.softbrain.esales.uaa.web.rest.errors;

import java.io.Serializable;

/**
 * FieldError view mmodel
 */
public class FieldErrorVM implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * The FieldErrorVM objectName contain item error
     */
    private final String objectName;

    /**
     * The FieldErrorVM field error
     */
    private final String field;

    /**
     * The FieldErrorVM message error, contain message key
     */
    private final String message;

    public FieldErrorVM(String dto, String field, String message) {
        this.objectName = dto;
        this.field = field;
        this.message = message;
    }

    public String getObjectName() {
        return objectName;
    }

    public String getField() {
        return field;
    }

    public String getMessage() {
        return message;
    }

}
