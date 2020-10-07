package jp.classmethod.premembers.report.job.common;

public enum JobCode {
    COLLECT_AWS_RESOURCE_INFO("COLLECT_AWS_RESOURCE_INFO"), OUTPUT_REPORT_JSON(
            "OUTPUT_REPORT_JSON"), OUTPUT_REPORT_EXCEL("OUTPUT_REPORT_EXCEL"),;

    private final String code;

    private JobCode(final String code) {
        this.code = code;
    }

    public String getString() {
        return code;
    }
}
