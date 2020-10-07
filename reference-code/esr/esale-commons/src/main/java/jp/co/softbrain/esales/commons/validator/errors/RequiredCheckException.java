package jp.co.softbrain.esales.commons.validator.errors;

/**
 * RequiredCheck入出力例外
 */
public class RequiredCheckException extends ValidateBaseException {

    private static final long serialVersionUID = 7560615102221681934L;

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (Throwable)
     * @param e
     */
    public RequiredCheckException(Throwable e) {
        super(e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], Throwable)
     * @param code
     * @param param
     */
    public RequiredCheckException(String code, String[] param, Throwable e) {
        super(code, param, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], String)
     * @param code
     * @param param
     * @param errorId
     */
    public RequiredCheckException(String code, String[] param, String errorId) {
        super(code, param, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String, Throwable)
     * @param code
     * @param param
     * @param e
     */
    public RequiredCheckException(String code, String errorId, Throwable e) {
        super(code, errorId, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[])
     * @param code
     * @param param
     */
    public RequiredCheckException(String code, String[] param) {
        super(code, param);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String)
     * @param code
     * @param errorId
     */
    public RequiredCheckException(String code, String errorId) {
        super(code, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String)
     * @param code
     */
    public RequiredCheckException(String code) {
        super(code);
    }

}
