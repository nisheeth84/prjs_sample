package com.viettel.coms.business;

import com.viettel.coms.dto.AssignHandoverDTO;
import com.viettel.service.base.dto.DataListDTO;

import java.util.List;

//VietNT_20181210_created
public interface AssignHandoverBusiness {

    Long addNewAssignHandover(AssignHandoverDTO dto) throws Exception;

    List<AssignHandoverDTO> doImportExcel(String filePath, Long sysUserId);

    String downloadTemplate() throws Exception;

    DataListDTO doSearch(AssignHandoverDTO criteria);

    Long removeAssignHandover(Long assignHandoverId, Long sysUserId);

    Long updateAttachFileDesign(AssignHandoverDTO dto) throws Exception;

    DataListDTO getAttachFile(Long id) throws Exception;
}
