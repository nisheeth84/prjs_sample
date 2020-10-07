package jp.classmethod.premembers.report.exception;

public class PremembersApplicationException extends RuntimeException {
    private static final long serialVersionUID = 4596982310289491318L;
    private String code;

    public PremembersApplicationException(String code, Throwable cause) {
        super(cause);
        this.code = code;
    }

    public PremembersApplicationException(String code, String message) {
        super(message);
        this.code = code;
    }

    public PremembersApplicationException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return "[" + getCode() + "] " + super.getMessage();
    }

}
