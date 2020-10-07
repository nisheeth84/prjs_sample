package com.viettel.aio.dto;

import com.viettel.aio.bo.SysUserBO;
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
@XmlRootElement(name = "SYS_USERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SysUserDTO extends ComsBaseFWDTO<SysUserBO> {

	private Double sysGroupId;
	private String sysGroupName;
	private Long needChangePassword;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date changePasswordDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date changePasswordDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date changePasswordDateTo;
	private Long newId;
	private String newName;
	private Long status;
	private String phoneNumber;
	private String email;
	private String employeeCode;
	private String password;
	private String fullName;
	private String loginName;
	private Long sysUserId;
	private String sysUserName;
	private List<String> groupLevelLst;

    @Override
    public SysUserBO toModel() {
        SysUserBO sysUserBO = new SysUserBO();
        sysUserBO.setSysGroupId(this.sysGroupId);
        sysUserBO.setNeedChangePassword(this.needChangePassword);
        sysUserBO.setChangePasswordDate(this.changePasswordDate);
        sysUserBO.setNewId(this.newId);
        sysUserBO.setStatus(this.status);
        sysUserBO.setPhoneNumber(this.phoneNumber);
        sysUserBO.setEmail(this.email);
        sysUserBO.setEmployeeCode(this.employeeCode);
        sysUserBO.setPassword(this.password);
        sysUserBO.setFullName(this.fullName);
        sysUserBO.setLoginName(this.loginName);
        sysUserBO.setSysUserId(this.sysUserId);
        return sysUserBO;
    }


    @JsonProperty("groupLevelLst")
	public List<String> getGroupLevelLst() {
		return groupLevelLst;
	}

	public void setGroupLevelLst(List<String> groupLevelLst) {
		this.groupLevelLst = groupLevelLst;
	}

	@JsonProperty("sysGroupId")
    public Double getSysGroupId(){
		return sysGroupId;
    }

    public void setSysGroupId(Double sysGroupId){
		this.sysGroupId = sysGroupId;
    }

	@JsonProperty("sysGroupName")
    public String getSysGroupName(){
		return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName){
		this.sysGroupName = sysGroupName;
    }

	@JsonProperty("needChangePassword")
    public Long getNeedChangePassword(){
		return needChangePassword;
    }

    public void setNeedChangePassword(Long needChangePassword){
		this.needChangePassword = needChangePassword;
    }

	@JsonProperty("changePasswordDate")
    public java.util.Date getChangePasswordDate(){
		return changePasswordDate;
    }

    public void setChangePasswordDate(java.util.Date changePasswordDate){
		this.changePasswordDate = changePasswordDate;
    }

	public java.util.Date getChangePasswordDateFrom() {
    	return changePasswordDateFrom;
    }

    public void setChangePasswordDateFrom(java.util.Date changePasswordDateFrom) {
    	this.changePasswordDateFrom = changePasswordDateFrom;
    }

	public java.util.Date getChangePasswordDateTo() {
    	return changePasswordDateTo;
    }

    public void setChangePasswordDateTo(java.util.Date changePasswordDateTo) {
    	this.changePasswordDateTo = changePasswordDateTo;
    }

	@JsonProperty("newId")
    public Long getNewId(){
		return newId;
    }

    public void setNewId(Long newId){
		this.newId = newId;
    }

	@JsonProperty("newName")
    public String getNewName(){
		return newName;
    }

    public void setNewName(String newName){
		this.newName = newName;
    }

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
    }

	@JsonProperty("phoneNumber")
    public String getPhoneNumber(){
		return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber){
		this.phoneNumber = phoneNumber;
    }

	@JsonProperty("email")
    public String getEmail(){
		return email;
    }

    public void setEmail(String email){
		this.email = email;
    }

	@JsonProperty("employeeCode")
    public String getEmployeeCode(){
		return employeeCode;
    }

    public void setEmployeeCode(String employeeCode){
		this.employeeCode = employeeCode;
    }

	@JsonProperty("password")
    public String getPassword(){
		return password;
    }

    public void setPassword(String password){
		this.password = password;
    }

	@JsonProperty("fullName")
    public String getFullName(){
		return fullName;
    }

    public void setFullName(String fullName){
		this.fullName = fullName;
    }

	@JsonProperty("loginName")
    public String getLoginName(){
		return loginName;
    }

    public void setLoginName(String loginName){
		this.loginName = loginName;
    }

	@JsonProperty("sysUserId")
    public Long getSysUserId(){
		return sysUserId;
    }

    public void setSysUserId(Long sysUserId){
		this.sysUserId = sysUserId;
    }

	@JsonProperty("sysUserName")
    public String getSysUserName(){
		return sysUserName;
    }

    public void setSysUserName(String sysUserName){
		this.sysUserName = sysUserName;
    }

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		return this.sysUserId;
	}	
	

}
