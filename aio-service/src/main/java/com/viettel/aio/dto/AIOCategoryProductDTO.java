package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOCategoryProductBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20191105_create
@XmlRootElement(name = "AIO_CATEGORY_PRODUCTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOCategoryProductDTO extends ComsBaseFWDTO<AIOCategoryProductBO> {

    private Long categoryProductId;
    private String code;
    private String name;
    private Long createUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createDate;
    private Long status;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private List<UtilAttachDocumentDTO> listImage;
    private List<AIOCategoryProductPriceDTO> listAioCategoryProductPriceDTO;
    private String createUserName;
    private List<String> imgSrc;

    public List<String> getImgSrc() {
        return imgSrc;
    }

    public void setImgSrc(List<String> imgSrc) {
        this.imgSrc = imgSrc;
    }

    public String getCreateUserName() {
        return createUserName;
    }

    public void setCreateUserName(String createUserName) {
        this.createUserName = createUserName;
    }

    public List<AIOCategoryProductPriceDTO> getListAioCategoryProductPriceDTO() {
        return listAioCategoryProductPriceDTO;
    }

    public void setListAioCategoryProductPriceDTO(List<AIOCategoryProductPriceDTO> listAioCategoryProductPriceDTO) {
        this.listAioCategoryProductPriceDTO = listAioCategoryProductPriceDTO;
    }

    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
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

    public Long getCategoryProductId() {
        return categoryProductId;
    }

    public void setCategoryProductId(Long categoryProductId) {
        this.categoryProductId = categoryProductId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    @Override
    public AIOCategoryProductBO toModel() {
        AIOCategoryProductBO bo = new AIOCategoryProductBO();
        bo.setCategoryProductId(this.getCategoryProductId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setCreateUser(this.getCreateUser());
        bo.setCreateDate(this.getCreateDate());
        bo.setStatus(this.getStatus());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return categoryProductId;
    }

    @Override
    public String catchName() {
        return categoryProductId.toString();
    }
    
    //tatph-start-10/12/2019
    private String nameImage;
    private String descriptionImage;
    private String filePathImage;

	public String getNameImage() {
		return nameImage;
	}

	public void setNameImage(String nameImage) {
		this.nameImage = nameImage;
	}

	public String getDescriptionImage() {
		return descriptionImage;
	}

	public void setDescriptionImage(String descriptionImage) {
		this.descriptionImage = descriptionImage;
	}

	public String getFilePathImage() {
		return filePathImage;
	}

	public void setFilePathImage(String filePathImage) {
		this.filePathImage = filePathImage;
	}
    
    //tatph-end-10/12/2019
}
