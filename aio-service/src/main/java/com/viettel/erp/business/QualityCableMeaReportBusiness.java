package com.viettel.erp.business;

import com.viettel.erp.dto.*;

import java.util.List;

public interface QualityCableMeaReportBusiness {

    long count();

    List<QualityCableMeaReportModelDTO> getQualityReportList();

    List<QualityCableMeaReportModelDTO> findByConstructId(QualityCableMeaReportModelDTO qualityCableMeaReportModelDTO);

    List<CatEmployeeDTO> getListEmployeeByRole(SettlementRightDTO rightDTO);

    List<QualityCableMeaResultDTO> getListQualityResualt(Long qualityCableMeaReportId);

    boolean saveOrUpdate(QualityCableMeaReportDTO targetObject);

    boolean qualitySaveOrUpdate(QualityCableMeaReportDTO targetObject);

    boolean deleteReport(List<String> listReportID);

    boolean deleteResult(List<String> listString);

    String autoGenCode();

    List<CatEmployeeDTO> getAllListEmployeeByRole(SettlementRightDTO rightDTO);

    QualityCableMeaReportModelDTO getQualityReport(QualityCableMeaReportModelDTO dto);

    Long appro(approDTO obj);

    Long saveTable(QualityCableMeaReportDTO completionDrawing);

    String getUpdateConstrCompleteRecod(Long qualityID, String nameTable);
}
