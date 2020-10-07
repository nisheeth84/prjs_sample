package jp.co.softbrain.esales.uaa.config;

/**
 * Application constants.
 */
public final class ConstantsUaa {

    public static final String SERVICE_NAME = "uaa";

    // Regex for acceptable password
    public static final String PASSWORD_REGEX = "((?=.*[0-9a-zA-Z])(?=.*[@#$%!^&+=])(?=\\S+$).{8,32}|(?=.*[0-9@#$%!^&+=])(?=.*[a-zA-Z])(?=\\S+$).{8,32})";

    public static final String DEFAULT_LANGUAGE = "ja";

    public static final String IAT = "iat";

    public static final String REMAINING_DAYS = "remainingDays";

    public static final String VALIDATE_MSG_FAILED = "Validate failded";

    public static final String COLUMN_NAME_USER_ID = "user_id";

    public static final String DUPLICATE = "ERR_COM_0058";

    private ConstantsUaa() {
    }
}
