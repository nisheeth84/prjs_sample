package jp.classmethod.premembers.check.security.constant;

import java.util.List;

import jp.classmethod.premembers.check.security.util.CommonUtil;

/**
 * Define constants for applications
 *
 * @author TuanDV
 */
public final class ComConst {
    public static final List<String> LIST_LANG = CommonUtil.toUnmodifiableList("en", "ja");

    // values mapping
    public static final String EMPTY = "(EMPTY)";
    public static final String JSON_FILE_EXT = ".json";
    public static final String ERROR_CODE = "ERROR";

    // ReportStatus Division
    public static final Integer CHECK_WAITING = 0;
    public static final Integer CHECK_PROGRESS = 1;
    public static final Integer CHECK_COMPLETED = 2;
    public static final Integer SUMMARY_PROGRESS = 3;
    public static final Integer SUMMARY_COMPLETED = 4;
    public static final Integer REPORT_PROGRESS = 5;
    public static final Integer REPORT_COMPLETED = 6;

    // AssessmentFlag Division
    public static final Integer IS_ASSESSMENT = 1;

    // ExclusionFlag Division
    public static final Integer IS_EXCLUSION = 1;

    // special chars
    public static final String BLANK = "";
    public static final String SLASH = "/";
    public static final String JASPER_REPORT_FILE_EXT = ".jasper";
    public static final String JASPER_PATH = "template/";
    public static final String PDF_REPORT_FILE_EXT = ".pdf";
    public static final String SPACE = " ";
    public static final String VERTICAL_BAR = "|";
    public static final String ELLIPSES = "...";

    // PATH S3
    public static final String PATH_BATCH_CHECK_LOG = "check_batch/%s/";
    public static final String PATH_FILE_REPORT = "%s/report/";

    // constant number
    public static final int NUM_8 = 8;
    public static final int NUM_30 = 30;
}
