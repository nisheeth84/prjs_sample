package jp.co.softbrain.esales.uaa.service.errors;

/**
 * Duplicate Histtory Password Exception
 */
public class DuplicateHisttoryPasswordException extends RuntimeException {

    private static final long serialVersionUID = -8537896087585771294L;

    public DuplicateHisttoryPasswordException() {
        super("3世代前までのパスワードは使用できません。");
    }

    public DuplicateHisttoryPasswordException(String msg) {
        super(msg);
    }

}
