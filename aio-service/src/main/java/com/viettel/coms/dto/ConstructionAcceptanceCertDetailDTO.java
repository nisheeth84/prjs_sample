package com.viettel.coms.dto;

public class ConstructionAcceptanceCertDetailDTO extends ConstructionAcceptanceCertDTO {
    private Long workItemId;
    private String workItemName;
    private String constructionCode;
    private Long flag;
    private String statusAcceptance;
    private String statusConstruction;
    private String address;
    private Long countWorkItemComplete;
//	private List<ConstructionImageInfo> listImage;

//	public List<ConstructionImageInfo> getListImage() {
//		return listImage;
//	}
//	public void setListImage(List<ConstructionImageInfo> listImage) {
//		this.listImage = listImage;
//	}

    public String getStatusConstruction() {
        return statusConstruction;
    }

    public Long getCountWorkItemComplete() {
        return countWorkItemComplete;
    }

    public void setCountWorkItemComplete(Long countWorkItemComplete) {
        this.countWorkItemComplete = countWorkItemComplete;
    }

    public void setStatusConstruction(String statusConstruction) {
        this.statusConstruction = statusConstruction;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatusAcceptance() {
        return statusAcceptance;
    }

    public void setStatusAcceptance(String statusAcceptance) {
        this.statusAcceptance = statusAcceptance;
    }

    public Long getFlag() {
        return flag;
    }

    public void setFlag(Long flag) {
        this.flag = flag;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

}
