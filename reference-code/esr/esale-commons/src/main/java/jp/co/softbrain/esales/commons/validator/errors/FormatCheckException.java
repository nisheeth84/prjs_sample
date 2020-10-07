package jp.co.softbrain.esales.commons.validator.errors;

/**
 * FormatCheck入出力例外
 */
public class FormatCheckException extends ValidateBaseException {

    private static final long serialVersionUID = -8112289242331712613L;

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (Throwable)
     * @param e
     */
    public FormatCheckException(Throwable e) {
        super(e);
    }

    /**
     * @see jp.co.tap.common.exception.FileException(String, String[], Throwable)
     * @param code
     * @param param
     * @param e
     */
    public FormatCheckException(String code, String[] param, Throwable e) {
        super(code, param, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], String)
     * @param code
     * @param param
     * @param errorId
     */
    public FormatCheckException(String code, String[] param, String errorId) {
        super(code, param, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String, Throwable)
     * @param code
     * @param param
     * @param e
     */
    public FormatCheckException(String code, String errorId, Throwable e) {
        super(code, errorId, e);
    }

    /**
     * @see ValidateBaseException.co.tap.mms.common.exception.MMSException (String, String[])
     * @param code
     * @param param
     */
    public FormatCheckException(String code, String[] param) {
        super(code, param);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String)
     * @param code
     * @param errorId
     */
    public FormatCheckException(String code, String errorId) {
        super(code, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String)
     * @param code
     */
    public FormatCheckException(String code) {
        super(code);
    }

}