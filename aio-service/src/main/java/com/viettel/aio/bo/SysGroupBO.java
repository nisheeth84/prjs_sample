package com.viettel.aio.bo;

import com.viettel.aio.dto.SysGroupDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.SysGroupBO")
@Table(name = "SYS_GROUP")
/**
 *
 * @author: hailh10
 */
public class SysGroupBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "SYS_GROUP_SEQ") })
	@Column(name = "SYS_GROUP_ID", length = 22)
	private Long sysGroupId;
	@Column(name = "CODE", length = 100)
	private String code;
	@Column(name = "NAME", length = 100)
	private String name;
	@Column(name = "PARENT_ID", length = 22)
	private Long parentId;
	@Column(name = "STATUS", length = 20)
	private String status;
	@Column(name = "PATH", length = 1000)
	private String path;
	@Column(name = "EFFECT_DATE", length = 7)
	private java.util.Date effectDate;
	@Column(name = "END_DATE", length = 7)
	private java.util.Date endDate;
	@Column(name = "GROUP_LEVEL", length = 3)
	private String groupLevel;

	public String getGroupLevel(){
		return groupLevel;
	}

	public void setGroupLevel(String groupLevel)
	{
		this.groupLevel = groupLevel;
	}

	public Long getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public String getCode(){
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public String getName(){
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Long getParentId(){
		return parentId;
	}

	public void setParentId(Long parentId)
	{
		this.parentId = parentId;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public String getPath(){
		return path;
	}

	public void setPath(String path)
	{
		this.path = path;
	}
	
	public java.util.Date getEffectDate(){
		return effectDate;
	}
	
	public void setEffectDate(java.util.Date effectDate)
	{
		this.effectDate = effectDate;
	}
	
	public java.util.Date getEndDate(){
		return endDate;
	}
	
	public void setEndDate(java.util.Date endDate)
	{
		this.endDate = endDate;
	}
   
    @Override
    public SysGroupDTO toDTO() {
        SysGroupDTO sysGroupDTO = new SysGroupDTO(); 
        sysGroupDTO.setSysGroupId(this.sysGroupId);		
        sysGroupDTO.setCode(this.code);		
        sysGroupDTO.setName(this.name);		
        sysGroupDTO.setParentId(this.parentId);		
        sysGroupDTO.setStatus(this.status);		
        sysGroupDTO.setPath(this.path);		
        sysGroupDTO.setEffectDate(this.effectDate);		
        sysGroupDTO.setEndDate(this.endDate);	
        sysGroupDTO.setGroupLevel(this.groupLevel);	
        return sysGroupDTO;
    }
}
