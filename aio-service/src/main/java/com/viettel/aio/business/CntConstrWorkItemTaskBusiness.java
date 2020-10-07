package com.viettel.aio.business;

import com.viettel.aio.dto.CntAppendixJobDTO;
import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.aio.dto.CntContractDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface CntConstrWorkItemTaskBusiness {

    CntConstrWorkItemTaskDTO findByIdentityKey(CntConstrWorkItemTaskDTO criteria);

    List<CntConstrWorkItemTaskDTO> doSearch(CntConstrWorkItemTaskDTO obj);

//	List<CntConstrWorkItemTaskDTO> doSearchForTab(CntConstrWorkItemTaskDTO obj);

    List<CntConstrWorkItemTaskDTO> getForAutoComplete(CntConstrWorkItemTaskDTO query);

    public List<CntConstrWorkItemTaskDTO> importCntConstruction(String fileInput, Long contractId, Long cntContractParentId, Long contractType);

//	 public List<CntConstrWorkItemTaskDTO> getConstructionTask(CntConstrWorkItemTaskDTO criteria);

    public List<CntConstrWorkItemTaskDTO> getConstructionWorkItem(CntConstrWorkItemTaskDTO criteria);

    //
    public List<CntConstrWorkItemTaskDTO> getTaskProgress(CntConstrWorkItemTaskDTO criteria);

    //
//	 public List<CntConstrWorkItemTaskDTO> doSearchContractProgress(CntContractDTO cntContractDTO);
//
//	List<CntConstrWorkItemTaskDTO> doSearchContractProgressDetail(
//            CntContractDTO cntContractDTO);
    List<CntConstrWorkItemTaskDTO> getConstructionByContractId(CntConstrWorkItemTaskDTO criteria);

    //hienvd: Start 8/7/2019
    public List<CntAppendixJobDTO> doSearchAppendixJob(CntAppendixJobDTO criteria);
    //hienvd: End

    String exportExcelTemplate(String fileName) throws Exception;
}
