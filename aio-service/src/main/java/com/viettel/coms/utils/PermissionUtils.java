package com.viettel.coms.utils;

import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.utils.ConvertData;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class PermissionUtils {

    public static List<String> getListIdInDomainData(String operationKey, String adResourceKey,
                                                     HttpServletRequest request) {
        // TODO Auto-generated method stub
        String groupId = VpsPermissionChecker.getDomainDataItemIds(
                operationKey,
                adResourceKey, request);
        return ConvertData
                .convertStringToList(groupId, ",");
    }

}

