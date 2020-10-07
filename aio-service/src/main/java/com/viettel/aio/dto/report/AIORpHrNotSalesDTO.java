package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;

/**
 * Created by HaiND on 9/28/2019 1:38 AM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIORpHrNotSalesDTO extends ComsBaseFWDTO {

    private Long sysUserId;
    private String areaCode;
    private String provinceCode;
    private String groupNameLv3;
    private String employeeCode;
    private String fullName;
    private String text;
    private Long areaId;
    private Long groupId;
    private String groupCode;
    private String groupName;
    private Integer reportType;
    private Integer tradeFlg;
    private Integer serviceFlg;
    private Integer allFlg;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private Long nationwideTradeTotal, area1TradeTotal, area2TradeTotal, area3TradeTotal;
    private Long nationwideServiceTotal, area1ServiceTotal, area2ServiceTotal, area3ServiceTotal;
    private Long nationwideAllTotal, area1AllTotal, area2AllTotal, area3AllTotal;

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getGroupNameLv3() {
        return groupNameLv3;
    }

    public void setGroupNameLv3(String groupNameLv3) {
        this.groupNameLv3 = groupNameLv3;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getReportType() {
        return reportType;
    }

    public void setReportType(Integer reportType) {
        this.reportType = reportType;
    }

    public Integer getTradeFlg() {
        return tradeFlg;
    }

    public void setTradeFlg(Integer tradeFlg) {
        this.tradeFlg = tradeFlg;
    }

    public Integer getServiceFlg() {
        return serviceFlg;
    }

    public void setServiceFlg(Integer serviceFlg) {
        this.serviceFlg = serviceFlg;
    }

    public Integer getAllFlg() {
        return allFlg;
    }

    public void setAllFlg(Integer allFlg) {
        this.allFlg = allFlg;
    }

    public Long getNationwideTradeTotal() {
        return nationwideTradeTotal;
    }

    public void setNationwideTradeTotal(Long nationwideTradeTotal) {
        this.nationwideTradeTotal = nationwideTradeTotal;
    }

    public Long getArea1TradeTotal() {
        return area1TradeTotal;
    }

    public void setArea1TradeTotal(Long area1TradeTotal) {
        this.area1TradeTotal = area1TradeTotal;
    }

    public Long getArea2TradeTotal() {
        return area2TradeTotal;
    }

    public void setArea2TradeTotal(Long area2TradeTotal) {
        this.area2TradeTotal = area2TradeTotal;
    }

    public Long getArea3TradeTotal() {
        return area3TradeTotal;
    }

    public void setArea3TradeTotal(Long area3TradeTotal) {
        this.area3TradeTotal = area3TradeTotal;
    }

    public Long getNationwideServiceTotal() {
        return nationwideServiceTotal;
    }

    public void setNationwideServiceTotal(Long nationwideServiceTotal) {
        this.nationwideServiceTotal = nationwideServiceTotal;
    }

    public Long getArea1ServiceTotal() {
        return area1ServiceTotal;
    }

    public void setArea1ServiceTotal(Long area1ServiceTotal) {
        this.area1ServiceTotal = area1ServiceTotal;
    }

    public Long getArea2ServiceTotal() {
        return area2ServiceTotal;
    }

    public void setArea2ServiceTotal(Long area2ServiceTotal) {
        this.area2ServiceTotal = area2ServiceTotal;
    }

    public Long getArea3ServiceTotal() {
        return area3ServiceTotal;
    }

    public void setArea3ServiceTotal(Long area3ServiceTotal) {
        this.area3ServiceTotal = area3ServiceTotal;
    }

    public Long getNationwideAllTotal() {
        return nationwideAllTotal;
    }

    public void setNationwideAllTotal(Long nationwideAllTotal) {
        this.nationwideAllTotal = nationwideAllTotal;
    }

    public Long getArea1AllTotal() {
        return area1AllTotal;
    }

    public void setArea1AllTotal(Long area1AllTotal) {
        this.area1AllTotal = area1AllTotal;
    }

    public Long getArea2AllTotal() {
        return area2AllTotal;
    }

    public void setArea2AllTotal(Long area2AllTotal) {
        this.area2AllTotal = area2AllTotal;
    }

    public Long getArea3AllTotal() {
        return area3AllTotal;
    }

    public void setArea3AllTotal(Long area3AllTotal) {
        this.area3AllTotal = area3AllTotal;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    @Override
    public String getText() {
        return text;
    }

    @Override
    public void setText(String text) {
        this.text = text;
    }

    @Override
    public BaseFWModelImpl toModel() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }
}
