package com.viettel.aio.business;

import com.viettel.aio.dao.AIORpSurveyDAO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.aio.dto.report.AIORpSurveyDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by HaiND on 9/25/2019 11:50 PM.
 */
@Service("aioRpSurveyBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIORpSurveyBusinessImpl extends BaseFWBusinessImpl<AIORpSurveyDAO, AIOSurveyDTO, BaseFWModelImpl> {

    @Autowired
    private AIORpSurveyDAO aioRpSurveyDAO;

    @Autowired
    private CommonServiceAio commonService;

    public List<AIORpSurveyDTO> doSearchSurvey(AIORpSurveyDTO dto) {
        return aioRpSurveyDAO.doSearchSurvey(dto);
    }

    public DataListDTO doSearch(AIORpSurveyDTO dto) {

        List<AIORpSurveyDTO> dtoList = aioRpSurveyDAO.doSearch(dto);
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtoList);
        dataListDTO.setTotal(dto.getTotalRecord());
        dataListDTO.setSize(dto.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }
}
