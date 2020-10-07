package com.viettel.aio.dto;


import com.viettel.aio.bo.CatUnitBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;
//import com.viettel.erp.constant.ApplicationConstants;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CAT_UNITBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatUnitDTO extends ComsBaseFWDTO<CatUnitBO> {

	private Long catUnitId;
	private String code;
	private String name;
	private String status;
	private String text;
	private int start;
	private int maxResult;

    @Override
    public CatUnitBO toModel() {
        CatUnitBO catUnitBO = new CatUnitBO();
        catUnitBO.setCatUnitId(this.catUnitId);
        catUnitBO.setCode(this.code);
        catUnitBO.setName(this.name);
        catUnitBO.setStatus(this.status);
        return catUnitBO;
    }

    @Override
     public Long getFWModelId() {
        return catUnitId;
    }

    @Override
    public String catchName() {
        return getCatUnitId().toString();
    }

	@JsonProperty("catUnitId")
    public Long getCatUnitId(){
		return catUnitId;
    }

    public void setCatUnitId(Long catUnitId){
		this.catUnitId = catUnitId;
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

	@JsonProperty("status")
    public String getStatus(){
		return status;
    }

    public void setStatus(String status){
		this.status = status;
    }	
	
	@JsonProperty("start")
	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	@JsonProperty("maxResult")
	public int getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(int maxResult) {
		this.maxResult = maxResult;
	}
	

}
