package com.viettel.coms.dto;

public class ConstructionStationWorkItemDTO {

    private String name;

    private Long constructionId;
    private String constructionCode;

    private String workItemCode;
    private Long workItemId;

    private String catTaskCode;
    private Long catTaskId;

    public Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public String getWorkItemCode() {
        return workItemCode;
    }

    public void setWorkItemCode(String workItemCode) {
        this.workItemCode = workItemCode;
    }

    public String getCatTaskCode() {
        return catTaskCode;
    }

    public void setCatTaskCode(String catTaskCode) {
        this.catTaskCode = catTaskCode;
    }

}
