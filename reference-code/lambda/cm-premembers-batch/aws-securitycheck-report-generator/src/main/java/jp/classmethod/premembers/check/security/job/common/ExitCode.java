package jp.classmethod.premembers.check.security.job.common;

public enum ExitCode {
    SUCCESS(0), ERROR(1),;

    private final int code;

    private ExitCode(final int code) {
        this.code = code;
    }

    public int getInt() {
        return this.code;
    }
}
