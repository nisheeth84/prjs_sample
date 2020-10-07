package jp.co.softbrain.esales.employees.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.utils.dto.KeyValue;

/**
 * Service Interface for download employee
 */
@XRayEnabled
public interface DownloadEmployeesService {

    /**
     * Download Employee on list
     *
     * @param employeeIds - list employeeId to download
     * @param orderBy - list orderBy
     * @param selectedTargetType
     * @param selectedTargetId
     * @return path save file.
     */
    public String downloadEmployees(List<Long> employeeIds, List<KeyValue> orderBy, Integer selectedTargetType,
            Long selectedTargetId);

}
