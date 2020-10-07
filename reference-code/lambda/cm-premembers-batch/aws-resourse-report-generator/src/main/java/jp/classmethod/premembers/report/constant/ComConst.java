package jp.classmethod.premembers.report.constant;

/**
 * Define constants for applications
 *
 * @author TuanDV
 */
public final class ComConst {
    //values mapping
    public static final String EMPTY = "(EMPTY)";
    public static final String JSON_FILE_EXT = ".json";

    // ReportStatus Division
    public static final Integer STANDBY = 0;
    public static final Integer COLLECTING_INFO = 1;
    public static final Integer COLLECT_COMPLETE = 2;
    public static final Integer CONVERSIONING = 3;
    public static final Integer CONVERSION_COMPLETE = 4;

    // ExcelOutputStatus Division
    public static final Integer WAITING = 0;
    public static final Integer PROCESSING = 1;
    public static final Integer FINISH = 2;
    public static final Integer ERROR = -1;

    // Effective Division
    public static final String EFFECTIVE_ENABLE = "1";

    // HTTP JSON
    public static final String SDK_RESPONSE_META_DATA = "sdkResponseMetadata";
    public static final String SDK_HTTP_META_DATA = "sdkHttpMetadata";

    //special chars
    public static final String BLANK = "";
    public static final String COMMA = ",";
    public static final String EQUAL = "=";
    public static final String SPACE = " ";
    public static final String HYPHEN = "-";
    public static final String TEXT_BREAK_LINE = "\n";

    // EC2
    public static final String EC2_RUNNING = "running";
    public static final String EC2_STOPPED = "stopped";
    public static final String GIBI_BYTE = "GiB";
    public static final String GIGA_BYTE = "GB";
    public static final String ACTIVE = "active";
    public static final String AVAILABLE = "available";
}
