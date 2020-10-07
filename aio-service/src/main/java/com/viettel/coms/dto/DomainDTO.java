package com.viettel.coms.dto;

public class DomainDTO {
    private java.lang.String dataCode;
    private java.lang.Long dataId;
    private java.lang.String adResource;
//    hoanm1_20190122_start
    private java.lang.String catStationHouseId;
    private java.lang.String cntContractId;
    private java.lang.String receivedGoodsDate;
    
    public java.lang.String getCatStationHouseId() {
		return catStationHouseId;
	}

	public void setCatStationHouseId(java.lang.String catStationHouseId) {
		this.catStationHouseId = catStationHouseId;
	}

	public java.lang.String getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(java.lang.String cntContractId) {
		this.cntContractId = cntContractId;
	}

	public java.lang.String getReceivedGoodsDate() {
		return receivedGoodsDate;
	}

	public void setReceivedGoodsDate(java.lang.String receivedGoodsDate) {
		this.receivedGoodsDate = receivedGoodsDate;
	}

	//    hoanm1_20190122_end
    public java.lang.String getDataCode() {
        return dataCode;
    }

    public void setDataCode(java.lang.String dataCode) {
        this.dataCode = dataCode;
    }

    public java.lang.Long getDataId() {
        return dataId;
    }

    public void setDataId(java.lang.Long dataId) {
        this.dataId = dataId;
    }

    public java.lang.String getAdResource() {
        return adResource;
    }

    public void setAdResource(java.lang.String adResource) {
        this.adResource = adResource;
    }

    @Override
    public boolean equals(Object obj) {
        return (this.dataId.compareTo(((DomainDTO) obj).dataId) == 0);
    }
}
