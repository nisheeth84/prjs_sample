package jp.co.softbrain.esales.commons.web.rest.vm.request;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

@Data
public class ImportRequest implements Serializable {

    private Integer importBelong;
    private String importFile;
    private Integer importAction;
    private boolean isDuplicatedAllowed;
    private boolean isSimulationMode;
    private String mappingItem;
    private String matchingKey;
    private String matchingRelation;
    private EgdList noticeList;
    private boolean isAutoPostTimeline;
    private ListInfo listInfo;


    @Data
    public static class EgdList implements Serializable {

        private List<Long> employeeIds;
        private List<Long> groupIds;
        private List<Long> departmentIds;

        @Override
        public String toString() {
            return "EgdList{" +
                "employeeIds=" + employeeIds +
                ", groupIds=" + groupIds +
                ", departmentIds=" + departmentIds +
                '}';
        }
    }

    @Data
    public static class ListInfo implements Serializable {
        private Integer listType;
        private String listName;
        private EgdList ownerList;
        private EgdList viewerList;
    }
}
