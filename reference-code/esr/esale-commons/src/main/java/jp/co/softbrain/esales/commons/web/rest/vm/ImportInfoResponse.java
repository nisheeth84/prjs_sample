package jp.co.softbrain.esales.commons.web.rest.vm;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ImportInfoResponse implements Serializable {

    private ImportInfo importInfo;

    public ImportInfoResponse(Long importHistoryId) {
        this.importInfo = new ImportInfo(importHistoryId);
    }

    @Data
    @AllArgsConstructor
    public static class ImportInfo implements Serializable{

        private Long importHistoryId;
    }

}

