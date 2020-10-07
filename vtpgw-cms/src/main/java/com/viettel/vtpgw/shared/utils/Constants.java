package com.viettel.vtpgw.shared.utils;

public class Constants {
    public interface ApiStatusCode {
        String ERROR = "400";
        String SUCCESS = "200";
        String NOT_FOUND = "204";
    }

    public interface ApiStatusDesc {
        String ERROR = "ERROR";
        String SUCCESS = "SUCCESS";
        String NOT_FOUND = "NOT_FOUND";
    }

    public interface StatusLogin {
        Integer ACTIVATE = 1;
        Integer DISABLE = 0;
    }
    //Cache keys
    public static final String ACCOUNT_CACHE_KEY = "accountKey";
    public static final String APPLICATION_CACHE_KEY = "applicationtKey";
    public static final String SERVICE_CACHE_KEY = "serviceKey";
    public static final String PERMISSION_CACHE_KEY = "permissionKey";

    public static final String DIVIDER = "//";
    public static final String BACKUP_FILE_PATH = "/backup/";

    public static final String ACCOUNT_FILE = "account.json";
    public static final String APPLICATION_FILE = "application.json";
    public static final String CONTACT_FILE = "contact.json";
    public static final String NODES_FILE = "nodes.json";
    public static final String PERMISSION_FILE = "permission.json";
    public static final String REPORT_FILE = "report.json";
    public static final String SERVICE_FILE = "service.json";
    public static final String DEFAULT_STRING = " ";
}
