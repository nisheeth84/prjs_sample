package com.viettel.aio.bo;

import com.viettel.aio.dto.CatUnitDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.ims.bo.CatUnitBO")
@Table(name = "CTCT_CAT_OWNER.CAT_UNIT")
/**
 *
 * @author: hailh10
 */
public class CatUnitBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CTCT_CAT_OWNER.CAT_UNIT_SEQ") })
	@Column(name = "CAT_UNIT_ID", length = 22)
	private Long catUnitId;
	@Column(name = "CODE", length = 100)
	private String code;
	@Column(name = "NAME", length = 100)
	private String name;
	@Column(name = "STATUS", length = 20)
	private String status;


	public Long getCatUnitId(){
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId)
	{
		this.catUnitId = catUnitId;
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

	public String getStatus(){
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}
   
    @Override
    public CatUnitDTO toDTO() {
        CatUnitDTO catUnitDTO = new CatUnitDTO(); 
        catUnitDTO.setCatUnitId(this.catUnitId);		
        catUnitDTO.setCode(this.code);		
        catUnitDTO.setName(this.name);		
        catUnitDTO.setStatus(this.status);		
        return catUnitDTO;
    }
}
