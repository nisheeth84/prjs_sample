package com.viettel.aio.business;

import com.viettel.aio.dto.report.AIORpImplementDTO;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

public interface AIORpImplementBusiness {

    List<AIORpImplementDTO> implementByProvince(AIORpImplementDTO obj);

    List<AIORpImplementDTO> implementByGroup(AIORpImplementDTO obj);

    AIORpImplementDTO implementTotal(AIORpImplementDTO obj);

    List<AIORpImplementDTO> implementByArea(AIORpImplementDTO obj);

    String doExport(AIORpImplementDTO obj) throws Exception;
}
