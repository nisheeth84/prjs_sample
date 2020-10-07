package com.viettel.aio.business;

import com.viettel.aio.dto.report.AIORpBacklogContractDTO;

import java.io.IOException;
import java.util.List;

public interface AIORpBacklogContractBusiness {

    List<AIORpBacklogContractDTO> rpBacklogContractByArea(AIORpBacklogContractDTO obj);

    List<AIORpBacklogContractDTO> rpBacklogContractByProvince(AIORpBacklogContractDTO obj);

    List<AIORpBacklogContractDTO> rpBacklogContractByGroup(AIORpBacklogContractDTO obj);

    AIORpBacklogContractDTO rpBacklogContractTotal(AIORpBacklogContractDTO obj);

    String doExport(AIORpBacklogContractDTO obj) throws Exception;
}
