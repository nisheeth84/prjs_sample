package com.viettel.aio.bo;

import com.viettel.aio.dto.SysUserDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.SysUserBO")
@Table(name = "SYS_USER")
/**
 *
 * @author: hailh10
 */
public class SysUserBO extends BaseFWModelImpl {
     
	@Column(name = "SYS_GROUP_ID", length = 22)
	private Double sysGroupId;
	@Column(name = "NEED_CHANGE_PASSWORD", length = 22)
	private Long needChangePassword;
	@Column(name = "CHANGE_PASSWORD_DATE", length = 7)
	private java.util.Date changePasswordDate;
	@Column(name = "NEW_ID", length = 22)
	private Long newId;
	@Column(name = "STATUS", length = 22)
	private Long status;
	@Column(name = "PHONE_NUMBER", length = 100)
	private String phoneNumber;
	@Column(name = "EMAIL", length = 100)
	private String email;
	@Column(name = "EMPLOYEE_CODE", length = 100)
	private String employeeCode;
	@Column(name = "PASSWORD", length = 400)
	private String password;
	@Column(name = "FULL_NAME", length = 400)
	private String fullName;
	@Column(name = "LOGIN_NAME", length = 100)
	private String loginName;
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "SYS_USER_SEQ") })
	@Column(name = "SYS_USER_ID", length = 22)
	private Long sysUserId;


	public Double getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(Double sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public Long getNeedChangePassword(){
		return needChangePassword;
	}

	public void setNeedChangePassword(Long needChangePassword)
	{
		this.needChangePassword = needChangePassword;
	}

	public java.util.Date getChangePasswordDate(){
		return changePasswordDate;
	}

	public void setChangePasswordDate(java.util.Date changePasswordDate)
	{
		this.changePasswordDate = changePasswordDate;
	}

	public Long getNewId(){
		return newId;
	}

	public void setNewId(Long newId)
	{
		this.newId = newId;
	}

	public Long getStatus(){
		return status;
	}

	public void setStatus(Long status)
	{
		this.status = status;
	}

	public String getPhoneNumber(){
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber)
	{
		this.phoneNumber = phoneNumber;
	}

	public String getEmail(){
		return email;
	}

	public void setEmail(String email)
	{
		this.email = email;
	}

	public String getEmployeeCode(){
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode)
	{
		this.employeeCode = employeeCode;
	}

	public String getPassword(){
		return password;
	}

	public void setPassword(String password)
	{
		this.password = password;
	}

	public String getFullName(){
		return fullName;
	}

	public void setFullName(String fullName)
	{
		this.fullName = fullName;
	}

	public String getLoginName(){
		return loginName;
	}

	public void setLoginName(String loginName)
	{
		this.loginName = loginName;
	}

	public Long getSysUserId(){
		return sysUserId;
	}

	public void setSysUserId(Long sysUserId)
	{
		this.sysUserId = sysUserId;
	}
   
    @Override
    public SysUserDTO toDTO() {
        SysUserDTO sysUserDTO = new SysUserDTO(); 
        sysUserDTO.setSysGroupId(this.sysGroupId);		
        sysUserDTO.setNeedChangePassword(this.needChangePassword);		
        sysUserDTO.setChangePasswordDate(this.changePasswordDate);		
        sysUserDTO.setNewId(this.newId);		
        sysUserDTO.setStatus(this.status);		
        sysUserDTO.setPhoneNumber(this.phoneNumber);		
        sysUserDTO.setEmail(this.email);		
        sysUserDTO.setEmployeeCode(this.employeeCode);		
        sysUserDTO.setPassword(this.password);		
        sysUserDTO.setFullName(this.fullName);		
        sysUserDTO.setLoginName(this.loginName);		
        sysUserDTO.setSysUserId(this.sysUserId);		
        return sysUserDTO;
    }
}
