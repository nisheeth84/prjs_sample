package com.viettel.coms.dto;

import java.util.List;

public class ExportPxkDTO {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private List<stockListDTO> stockList;
    private String nameDVYC;
    private String namePetitioner; /* tên người yêu cầu */
    private String shipper; /* người giao */
    private Double totalMonney;

    public Double getTotalMonney() {
        return totalMonney;
    }

    public void setTotalMonney(Double totalMonney) {
        this.totalMonney = totalMonney;
    }

    public List<stockListDTO> getStockList() {
        return stockList;
    }

    public void setStockList(List<stockListDTO> stockList) {
        this.stockList = stockList;
    }

    public String getNameDVYC() {
        return nameDVYC;
    }

    public void setNameDVYC(String nameDVYC) {
        this.nameDVYC = nameDVYC;
    }

    public String getNamePetitioner() {
        return namePetitioner;
    }

    public void setNamePetitioner(String namePetitioner) {
        this.namePetitioner = namePetitioner;
    }

    public String getShipper() {
        return shipper;
    }

    public void setShipper(String shipper) {
        this.shipper = shipper;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
