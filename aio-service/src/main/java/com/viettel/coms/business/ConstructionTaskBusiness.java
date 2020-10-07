package com.viettel.coms.business;

import com.viettel.coms.ConstructionProgressDTO;
import com.viettel.coms.dto.ConstructionTaskAssignmentsGranttDTO;
import com.viettel.coms.dto.ConstructionTaskGranttDTO;
import com.viettel.coms.dto.ConstructionTaskResourcesGranttDTO;
import com.viettel.coms.dto.GranttDTO;
import com.viettel.ktts2.dto.KttsUserSession;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface ConstructionTaskBusiness {

    long count();

    public List<ConstructionProgressDTO> getConstructionTaskData();

    public List<ConstructionTaskGranttDTO> getDataForGrant(GranttDTO granttSearch, Long sysGroupId,
                                                           HttpServletRequest request);

    public List<ConstructionTaskResourcesGranttDTO> getDataResources();

    public List<ConstructionTaskAssignmentsGranttDTO> getDataAssignments(GranttDTO granttSearch);

    public int updateCompletePercent(ConstructionTaskGranttDTO dto, KttsUserSession objUser);

    public int deleteGrantt(ConstructionTaskGranttDTO dto);

    public int createTask(ConstructionTaskGranttDTO dto);

    public List<ConstructionTaskGranttDTO> getDataConstructionGrantt(GranttDTO granttSearch);
//hoanm1_20180815_start
//	List<ConstructionTaskDTO> rpSumTask(ConstructionTaskDTO dto);
//	hoanm1_20180815_end
}
