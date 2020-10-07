package com.viettel.aio.business;

import com.viettel.aio.bo.AIOQuestionBO;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.service.base.business.BaseFWBusiness;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AIOQuestionBussiness extends BaseFWBusiness<AIOQuestionDTO, AIOQuestionBO> {

    List<AIOQuestionDTO> doSearch(AIOQuestionDTO obj);

    void remove(Long questionId, Long userId);

    List<AIOQuestionDTO> doImportExcel(String filePath);
}
