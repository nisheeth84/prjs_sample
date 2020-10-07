package com.viettel.erp.business;

import com.viettel.erp.dto.CompletionDrawingDTO;

import java.util.List;

public interface CompletionDrawingBusiness {

    long count();

    //ngoccx
    List<CompletionDrawingDTO> getCompletionDrawingSearch(CompletionDrawingDTO obj);

    public boolean updateIsActive(List<Long> completionDrawingId);

    List<CompletionDrawingDTO> getDrawById(List<String> completionDrawingId);

    CompletionDrawingDTO getPathById(Long completionDrawingId);
}
