package com.viettel.aio.dto;

import com.viettel.coms.dto.AppParamDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

//VietNT_20190308_create
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageResponse {

    private List<AppParamDTO> engineCapacityList;
    private List<AppParamDTO> goodsList;
    private List<AppParamDTO> locationList;
    private List<AppParamDTO> saleChannelList;

    public List<AppParamDTO> getEngineCapacityList() {
        return engineCapacityList;
    }

    public void setEngineCapacityList(List<AppParamDTO> engineCapacityList) {
        this.engineCapacityList = engineCapacityList;
    }

    public List<AppParamDTO> getGoodsList() {
        return goodsList;
    }

    public void setGoodsList(List<AppParamDTO> goodsList) {
        this.goodsList = goodsList;
    }

    public List<AppParamDTO> getLocationList() {
        return locationList;
    }

    public void setLocationList(List<AppParamDTO> locationList) {
        this.locationList = locationList;
    }

    public List<AppParamDTO> getSaleChannelList() {
        return saleChannelList;
    }

    public void setSaleChannelList(List<AppParamDTO> saleChannelList) {
        this.saleChannelList = saleChannelList;
    }
}
