package jp.co.softbrain.esales.commons.validator.errors;


public class ValidateBaseException extends Exception {

    private static final long serialVersionUID = -3130750938679514286L;

    /**
     * エラーコード
     */
    private String code = null;
    /**
     * エラー項目property
     */
    private String errorId = null;
    /**
     * エラーコードに対応するメッセージ引数
     */
    private String[] param = null;

    /**
     * 更新ログに出力するエラーかどうか判定するフラグ
     */
    private boolean logOutput = false;

    /**
     * @param e
     */
    public ValidateBaseException(Throwable e) {
        super(e);
    }

    /**
     * @see jp.co.ValidateBaseException.BaseException.exception.CSSException .CSSException (String
     *      code, String[] param, Throwable e)
     * @param code
     * @param param
     * @param e
     */
    public ValidateBaseException(String code, String[] param, String errorId, Throwable e) {
        super(e);
        this.code = code;
        this.param = param;
        this.errorId = errorId;
    }

    /**
     * @see jp.co.ValidateBaseException.BaseException.exception.CSSException .CSSException (String
     *      code, String[] param, Throwable e)
     * @param code
     * @param param
     * @param e
     */
    public ValidateBaseException(String code, String[] param, String errorId) {
        this.code = code;
        this.param = param;
        this.errorId = errorId;
    }

    /**
     * @see jp.co.ValidateBaseException.BaseException.exception.CSSException .CSSException (String
     *      code, String[] param, Throwable e)
     * @param code
     * @param param
     * @param e
     */
    public ValidateBaseException(String code, String[] param, Throwable e) {
        this(code, param, null, e);
    }

    /**
     * @see jp.co.ValidateBaseException.BaseException.exception.CSSException .CSSException (String
     *      code, String[] param, Throwable e)
     * @param code
     * @param param
     * @param e
     */
    public ValidateBaseException(String code, String errorId, Throwable e) {
        this(code, new String[] {}, errorId, e);
    }

    /**
     * init attribute code and param
     *
     * @param code
     * @param param
     */
    public ValidateBaseException(String code, String[] param) {
        this(code, param, "");
    }

    /**
     * @param code
     */
    public ValidateBaseException(String code, String errorId) {
        this(code, new String[] {}, errorId);
    }

    /**
     * @param code
     */
    public ValidateBaseException(String code) {
        this(code, new String[] {});
    }

    /**
     * get exception code
     *
     * @return
     */
    public String getCode() {
        return code;
    }

    /**
     * get error id
     * @return
     */
    public String getErrorId() {
        return errorId;
    }

    /**
     * Set Error ID
     *
     * @param errorId
     */
    public void setErrorId(String errorId) {
        this.errorId = errorId;
    }

    /**
     * get error parameter
     *
     * @return
     */
    public String[] getParam() {
        return param;
    }

    /**
     * set error code
     *
     * @param code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * set error parameter
     *
     * @param param
     */
    public void setParam(String[] param) {
        this.param = param;
    }

    /**
     * get value of attribute logOutput
     *
     * @return
     */
    public boolean isLogOutput() {
        return logOutput;
    }

    /**
     * set value of attribute logOutput
     *
     * @param logOutput
     */
    public void setLogOutput(boolean logOutput) {
        this.logOutput = logOutput;
    }

}