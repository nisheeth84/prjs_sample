package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionScheduleDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_SCHEDULE")
public class ConstructionScheduleBO extends BaseFWModelImpl {

    private java.lang.Long constructionScheduleId;
    private java.lang.Long constructionId;
    private java.lang.String constructionCode;
    private java.lang.String constructionName;
    private java.lang.String stationCode;
    private java.lang.String status;
    private java.lang.String startingDate;
    private java.lang.Double progress;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_SCHEDULE_ID")})
    @Column(name = "CONSTRUCTION_SCHEDULE_ID", length = 11)
    public java.lang.Long getConstructionScheduleId() {
        return constructionScheduleId;
    }

    public void setConstructionScheduleId(java.lang.Long constructionScheduleId) {
        this.constructionScheduleId = constructionScheduleId;
    }

    @Column(name = "CONSTRUCTION_ID", length = 20)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "CONSTRUCTION_CODE", length = 20)
    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    @Column(name = "CONSTRUCTION_NAME", length = 20)
    public java.lang.String getConstructionName() {
        return constructionName;
    }

    public void setConstructionName(java.lang.String constructionName) {
        this.constructionName = constructionName;
    }

    @Column(name = "STATION_CODE", length = 20)
    public java.lang.String getStationCode() {
        return stationCode;
    }

    public void setStationCode(java.lang.String stationCode) {
        this.stationCode = stationCode;
    }

    @Column(name = "STATUS", length = 20)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "STARTING_DATE", length = 7)
    public java.lang.String getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.lang.String startingDate) {
        this.startingDate = startingDate;
    }

    @Column(name = "PROGRESS", length = 20)
    public java.lang.Double getProgress() {
        return progress;
    }

    public void setProgress(java.lang.Double progress) {
        this.progress = progress;
    }

    @Override
    public ConstructionScheduleDTO toDTO() {
        ConstructionScheduleDTO constructionScheduleDTO = new ConstructionScheduleDTO();
        constructionScheduleDTO.setConstructionScheduleId(this.constructionScheduleId);
        constructionScheduleDTO.setConstructionId(this.constructionId);
        constructionScheduleDTO.setConstructionName(this.constructionName);
        constructionScheduleDTO.setStationCode(this.stationCode);
        constructionScheduleDTO.setStatus(this.status);
        constructionScheduleDTO.setStatus(this.startingDate);
        constructionScheduleDTO.setProgress(this.progress);
        return constructionScheduleDTO;
    }
}
