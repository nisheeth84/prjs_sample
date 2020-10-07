package com.viettel.erp.business;

import com.viettel.erp.dto.UtilAttachedDocumentsDTO;

import java.util.List;

public interface UtilAttachedDocumentsBusiness {

    long count();

    Long insert(String documentName, Long parentId, String documentPath, Long type);

    void updateUtilByParentIdAndType(String documentName, Long parentId, String documentPath, Long type);

    UtilAttachedDocumentsDTO findByParentIdAndType(Long parentId, Long type);

    List<UtilAttachedDocumentsDTO> getListByParentIdAndType(Long parentId);

    List<UtilAttachedDocumentsDTO> getListByParentIdAndTypeOrgan(Long parentId);

    List<UtilAttachedDocumentsDTO> getListByParentIdCA(Long parentId);

    List<UtilAttachedDocumentsDTO> getListOrganizationByParentId(Long parentId);

    void deleteDocument(List<String> listAttachId);

    boolean checkType(String attachId);
}
