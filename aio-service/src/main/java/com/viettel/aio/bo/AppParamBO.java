/* 
* Copyright 2011 Viettel Telecom. All rights reserved. 
* VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms. 
 */
package com.viettel.aio.bo;

import com.viettel.aio.dto.AppParamDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity
@Table(name = "APP_PARAM")
/**
 *
 * @author: HungNX
 * @version: 1.0
 * @since: 1.0
 */
public class AppParamBO extends BaseFWModelImpl {
     
private java.util.Date updatedDate;
private Long updatedBy;
private java.util.Date createdDate;
private Long createdBy;
private String description;
private Long appParamId;
private String parOrder;
private String parType;
private String name;
private String code;
private String status;

 public AppParamBO() {
        setColId("appParamId");
        setColName("appParamId");
        setUniqueColumn(new String[]{"appParamId"});
}

@Column(name = "UPDATED_DATE", length = 7)
public java.util.Date getUpdatedDate(){
return updatedDate;
}
public void setUpdatedDate(java.util.Date updatedDate)
{
this.updatedDate = updatedDate;
}
@Column(name = "UPDATED_BY", length = 22)
public Long getUpdatedBy(){
return updatedBy;
}
public void setUpdatedBy(Long updatedBy)
{
this.updatedBy = updatedBy;
}
@Column(name = "CREATED_DATE", length = 7)
public java.util.Date getCreatedDate(){
return createdDate;
}
public void setCreatedDate(java.util.Date createdDate)
{
this.createdDate = createdDate;
}
@Column(name = "CREATED_BY", length = 22)
public Long getCreatedBy(){
return createdBy;
}
public void setCreatedBy(Long createdBy)
{
this.createdBy = createdBy;
}
@Column(name = "DESCRIPTION", length = 2000)
public String getDescription(){
return description;
}
public void setDescription(String description)
{
this.description = description;
}
@Id
@GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence",
            parameters = {
                @Parameter(name = "sequence", value = "CAT_OWNER.APP_PARAM_SEQ")
            }
    )
@Column(name = "APP_PARAM_ID", length = 22)
public Long getAppParamId(){
return appParamId;
}
public void setAppParamId(Long appParamId)
{
this.appParamId = appParamId;
}
@Column(name = "PAR_ORDER", length = 4)
public String getParOrder(){
return parOrder;
}
public void setParOrder(String parOrder)
{
this.parOrder = parOrder;
}
@Column(name = "PAR_TYPE", length = 4)
public String getParType(){
return parType;
}
public void setParType(String parType)
{
this.parType = parType;
}
@Column(name = "NAME", length = 100)
public String getName(){
return name;
}
public void setName(String name)
{
this.name = name;
}
@Column(name = "CODE", length = 100)
public String getCode(){
return code;
}
public void setCode(String code)
{
this.code = code;
}
@Column(name = "STATUS", length = 20)
public String getStatus(){
return status;
}
public void setStatus(String status)
{
this.status = status;
}
   

    @Override
    public AppParamDTO toDTO() {
        AppParamDTO appParamDTO = new AppParamDTO();
        //set cac gia tri 
        appParamDTO.setUpdatedDate(this.updatedDate);
        appParamDTO.setUpdatedBy(this.updatedBy);
        appParamDTO.setCreatedDate(this.createdDate);
        appParamDTO.setCreatedBy(this.createdBy);
        appParamDTO.setDescription(this.description);
        appParamDTO.setAppParamId(this.appParamId);
        appParamDTO.setParOrder(this.parOrder);
        appParamDTO.setParType(this.parType);
        appParamDTO.setName(this.name);
        appParamDTO.setCode(this.code);
        appParamDTO.setStatus(this.status);
        return appParamDTO;
    }
}
