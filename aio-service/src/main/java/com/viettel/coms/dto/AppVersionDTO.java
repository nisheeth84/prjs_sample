package com.viettel.coms.dto;

public class AppVersionDTO extends ComsBaseFWDTO<AppVersionBO> {

    private java.lang.String name;
    private java.lang.String link;
    private java.lang.Long appParamId;

    @Override
    public AppVersionBO toModel() {
        AppVersionBO appVersionBO = new AppVersionBO();
        appVersionBO.setName(this.name);
        appVersionBO.setLink(this.link);
        appVersionBO.setAppParamId(this.appParamId);
        return appVersionBO;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getLink() {
        return link;
    }

    public void setLink(java.lang.String link) {
        this.link = link;
    }

    public java.lang.Long getAppParamId() {
        return appParamId;
    }

    public void setAppParamId(java.lang.Long appParamId) {
        this.appParamId = appParamId;
    }

    @Override
    public Long getFWModelId() {
        return appParamId;
    }

    @Override
    public String catchName() {
        return getAppParamId().toString();
    }
}
