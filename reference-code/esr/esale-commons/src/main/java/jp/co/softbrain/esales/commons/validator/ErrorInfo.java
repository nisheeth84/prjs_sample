package jp.co.softbrain.esales.commons.validator;

import java.io.Serializable;

/**
 * Value class contain info error
 *
 */
public class ErrorInfo implements Serializable {

    private static final long serialVersionUID = 5552835254119417468L;

    /**
     * item ID
     */
    private String errorId = null;

    /**
     * error message
     */
    private String errorMessage = null;

    /**
     * errorMessageを取得します。
     *
     * @return errorMessage
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * errorMessageを設定します。
     *
     * @param errorMessage
     */
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    /**
     * errorIdを取得します。
     * @return errorId
     */
    public String getErrorId() {
        return errorId;
    }

    /**
     * errorIdを設定します。
     * @param errorId
     */
    public void setErrorId(String errorId) {
        this.errorId = errorId;
    }

}