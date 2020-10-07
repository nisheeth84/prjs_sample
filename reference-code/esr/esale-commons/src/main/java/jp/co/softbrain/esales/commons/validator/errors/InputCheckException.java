package jp.co.softbrain.esales.commons.validator.errors;

public class InputCheckException extends ValidateBaseException {

    private static final long serialVersionUID = 1920098082744310558L;

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (Throwable)
     * @param e
     */
    public InputCheckException(Throwable e) {
        super(e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], String, Throwable)
     * @param code
     * @param param
     * @param e
     */
    public InputCheckException(String code, String[] param, String errorId, Throwable e) {
        super(code, param, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], String)
     * @param code
     * @param param
     * @param errorId
     */
    public InputCheckException(String code, String[] param, String errorId) {
        super(code, param, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[], Throwable)
     * @param code
     * @param param
     * @param e
     */
    public InputCheckException(String code, String[] param, Throwable e) {
        super(code, param, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String, Throwable)
     * @param code
     * @param param
     * @param e
     */
    public InputCheckException(String code, String errorId, Throwable e) {
        super(code, errorId, e);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String[])
     * @param code
     * @param param
     */
    public InputCheckException(String code, String[] param) {
        super(code, param);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String, String)
     * @param code
     * @param errorId
     */
    public InputCheckException(String code, String errorId) {
        super(code, errorId);
    }

    /**
     * @see com.ValidateBaseException.springboot.common.exception.BaseException (String)
     * @param code
     */
    public InputCheckException(String code) {
        super(code);
    }

}