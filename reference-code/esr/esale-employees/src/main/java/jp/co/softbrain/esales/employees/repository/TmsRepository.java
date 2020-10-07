package jp.co.softbrain.esales.employees.repository;

import org.json.JSONObject;

import jp.co.softbrain.esales.config.Constants;

public interface TmsRepository {
    default boolean isSuccess(JSONObject result) {
        return result != null && Constants.TMS.CODE_SUCCESS.equals(result.optString(Constants.TMS.CODE));
    }

    default String concat(String schema, String table) {
        return schema + "." + table;
    }

}
