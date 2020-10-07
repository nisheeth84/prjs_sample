package com.viettel.coms.dto;

import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "APPVERSION")
public class AppVersionBO extends BaseFWModelImpl {

    private java.lang.Long appParamId;
    private java.lang.String name;
    private java.lang.String link;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "APP_PARAM_ID")})
    @Column(name = "APP_PARAM_ID", length = 11)
    public java.lang.Long getAppParamId() {
        return appParamId;
    }

    public void setAppParamId(java.lang.Long appParamId) {
        this.appParamId = appParamId;
    }

    @Column(name = "NAME", length = 11)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "LINK", length = 11)
    public java.lang.String getLink() {
        return link;
    }

    public void setLink(java.lang.String Link) {
        this.link = Link;
    }

    @Override
    public AppVersionDTO toDTO() {
        AppVersionDTO appVersionDTO = new AppVersionDTO();
        appVersionDTO.setAppParamId(this.appParamId);
        appVersionDTO.setName(this.name);
        appVersionDTO.setLink(this.link);
        return appVersionDTO;
    }

}
