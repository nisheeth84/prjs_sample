package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOCategoryProductPriceBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//StephenTrung__20191105_create
@XmlRootElement(name = "AIO_CATEGORY_PRODUCT_PRICEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOCategoryProductPriceDTO extends ComsBaseFWDTO<AIOCategoryProductPriceBO> {

    private Long aioCategoryProductPriceId;
    private Long aioCategoryProductId;
    private Long type;
    private Long valueTo;
    private Long valueFrom;
    private String valueBetween;
    private Long valueFromV2;
    private Long valueToV2;


    public Long getAioCategoryProductPriceId() {
        return aioCategoryProductPriceId;
    }

    public void setAioCategoryProductPriceId(Long aioCategoryProductPriceId) {
        this.aioCategoryProductPriceId = aioCategoryProductPriceId;
    }

    public Long getAioCategoryProductId() {
        return aioCategoryProductId;
    }

    public void setAioCategoryProductId(Long aioCategoryProductId) {
        this.aioCategoryProductId = aioCategoryProductId;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Long getValueTo() {
        return valueTo;
    }

    public void setValueTo(Long valueTo) {
        this.valueTo = valueTo;
    }

    public Long getValueFrom() {
        return valueFrom;
    }

    public void setValueFrom(Long valueFrom) {
        this.valueFrom = valueFrom;
    }

    public String getValueBetween() {
		return valueBetween;
	}

	public void setValueBetween(String valueBetween) {
		this.valueBetween = valueBetween;
	}

	public Long getValueFromV2() {
		return valueFromV2;
	}

	public void setValueFromV2(Long valueFromV2) {
		this.valueFromV2 = valueFromV2;
	}

	public Long getValueToV2() {
		return valueToV2;
	}

	public void setValueToV2(Long valueToV2) {
		this.valueToV2 = valueToV2;
	}

	@Override
    public AIOCategoryProductPriceBO toModel() {
        AIOCategoryProductPriceBO bo = new AIOCategoryProductPriceBO();
        bo.setAioCategoryProductPriceId(this.getAioCategoryProductPriceId());
        bo.setAioCategoryProductId(this.getAioCategoryProductId());
        bo.setType(this.getType());
        bo.setValueTo(this.getValueTo());
        bo.setValueFrom(this.getValueFrom());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioCategoryProductPriceId;
    }

    @Override
    public String catchName() {
        return aioCategoryProductPriceId.toString();
    }
}
