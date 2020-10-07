package com.viettel.aio.dto;

public class ConstructionImageInfo {

    private long utilAttachDocumentId;
    private long status;
    private Double longtitude;
    private Double latitude;
    private String imageName;
    private long obstructedId;

    private String base64String;

    private String imagePath;

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getBase64String() {
        return base64String;
    }

    public void setBase64String(String base64String) {
        this.base64String = base64String;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public long getStatus() {
        return status;
    }

    public void setStatus(long status) {
        this.status = status;
    }

    public long getUtilAttachDocumentId() {
        return utilAttachDocumentId;
    }

    public void setUtilAttachDocumentId(long utilAttachDocumentId) {
        this.utilAttachDocumentId = utilAttachDocumentId;
    }

    public Double getLongtitude() {
        return longtitude;
    }

    public void setLongtitude(Double longtitude) {
        this.longtitude = longtitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public long getObstructedId() {
        return obstructedId;
    }

    public void setObstructedId(long obstructedId) {
        this.obstructedId = obstructedId;
    }


}
