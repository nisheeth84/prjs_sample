package com.viettel.aio.business;

import com.viettel.aio.dto.AIORpSynthesisGenCodeForChannelDTO;
import com.viettel.service.base.dto.DataListDTO;

public interface AIORpSynthesisGenCodeForChannelBusiness {
    DataListDTO doSearch(AIORpSynthesisGenCodeForChannelDTO criteria);

    String exportExcel(AIORpSynthesisGenCodeForChannelDTO dto) throws Exception;
}
