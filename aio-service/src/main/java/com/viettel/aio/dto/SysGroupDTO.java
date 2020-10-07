package com.viettel.aio.dto;

import com.viettel.aio.bo.SysGroupBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "SYS_GROUPBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SysGroupDTO extends ComsBaseFWDTO<SysGroupBO> {

	private Long sysGroupId;
	private String code;
	private String name;
	private Long parentId;
	private String parentName;
	private String status;
	private String path;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date effectDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date effectDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date effectDateTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endDateTo;

	private String groupLevel;
	private List<String> groupLevelLst;
	private String groupNameLevel1;
    private String groupNameLevel2;
    private String groupNameLevel3;

    public String getGroupNameLevel1() {
		return groupNameLevel1;
	}

	public void setGroupNameLevel1(String groupNameLevel1) {
		this.groupNameLevel1 = groupNameLevel1;
	}

	public String getGroupNameLevel2() {
		return groupNameLevel2;
	}

	public void setGroupNameLevel2(String groupNameLevel2) {
		this.groupNameLevel2 = groupNameLevel2;
	}

	public String getGroupNameLevel3() {
		return groupNameLevel3;
	}

	public void setGroupNameLevel3(String groupNameLevel3) {
		this.groupNameLevel3 = groupNameLevel3;
	}

	@Override
    public SysGroupBO toModel() {
        SysGroupBO sysGroupBO = new SysGroupBO();
        sysGroupBO.setSysGroupId(this.sysGroupId);
        sysGroupBO.setCode(this.code);
        sysGroupBO.setName(this.name);
        sysGroupBO.setParentId(this.parentId);
        sysGroupBO.setStatus(this.status);
        sysGroupBO.setPath(this.path);
        sysGroupBO.setEffectDate(this.effectDate);
        sysGroupBO.setEndDate(this.endDate);
        sysGroupBO.setGroupLevel(this.groupLevel);
        return sysGroupBO;
    }

    @Override
     public Long getFWModelId() {
        return sysGroupId;
    }

    @Override
    public String catchName() {
        return getSysGroupId().toString();
    }

	@JsonProperty("sysGroupId")
    public Long getSysGroupId(){
		return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId){
		this.sysGroupId = sysGroupId;
    }

	@JsonProperty("code")
    public String getCode(){
		return code;
    }

    public void setCode(String code){
		this.code = code;
    }

	@JsonProperty("name")
    public String getName(){
		return name;
    }

    public void setName(String name){
		this.name = name;
    }

	@JsonProperty("parentId")
    public Long getParentId(){
		return parentId;
    }

    public void setParentId(Long parentId){
		this.parentId = parentId;
    }

	@JsonProperty("parentName")
    public String getParentName(){
		return parentName;
    }

    public void setParentName(String parentName){
		this.parentName = parentName;
    }

	@JsonProperty("status")
    public String getStatus(){
		return status;
    }

    public void setStatus(String status){
		this.status = status;
    }

	@JsonProperty("path")
    public String getPath(){
		return path;
    }

    public void setPath(String path){
		this.path = path;
    }

	@JsonProperty("effectDate")
    public java.util.Date getEffectDate(){
		return effectDate;
    }

    public void setEffectDate(java.util.Date effectDate){
		this.effectDate = effectDate;
    }

	public java.util.Date getEffectDateFrom() {
    	return effectDateFrom;
    }

    public void setEffectDateFrom(java.util.Date effectDateFrom) {
    	this.effectDateFrom = effectDateFrom;
    }

	public java.util.Date getEffectDateTo() {
    	return effectDateTo;
    }

    public void setEffectDateTo(java.util.Date effectDateTo) {
    	this.effectDateTo = effectDateTo;
    }

	@JsonProperty("endDate")
    public java.util.Date getEndDate(){
		return endDate;
    }

    public void setEndDate(java.util.Date endDate){
		this.endDate = endDate;
    }

	public java.util.Date getEndDateFrom() {
    	return endDateFrom;
    }

    public void setEndDateFrom(java.util.Date endDateFrom) {
    	this.endDateFrom = endDateFrom;
    }

	public java.util.Date getEndDateTo() {
    	return endDateTo;
    }

    public void setEndDateTo(java.util.Date endDateTo) {
    	this.endDateTo = endDateTo;
    }

    @JsonProperty("groupLevel")
    public String getGroupLevel(){
		return groupLevel;
    }

    public void setGroupLevel(String groupLevel){
		this.groupLevel = groupLevel;
    }
    
    @JsonProperty("groupLevelLst")
	public List<String> getGroupLevelLst() {
		return groupLevelLst;
	}

	public void setGroupLevelLst(List<String> groupLevelLst) {
		this.groupLevelLst = groupLevelLst;
	}
	
}
