package com.viettel.erp.business;

import com.viettel.erp.dto.MonitorMissionAssignDTO;

import java.util.List;

public interface MonitorMissionAssignBusiness {

    long count();

    List<MonitorMissionAssignDTO> getMonitorMissionAssign(MonitorMissionAssignDTO obj);

    String autoGenCode();

    boolean updateIsActive(List<Long> monitorMissionAssignId);
}
