package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOCategoryProductPriceDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//StephenTrung_20191105_start
@Entity
@Table(name = "AIO_CATEGORY_PRODUCT_PRICE")
public class AIOCategoryProductPriceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CATEGORY_PRODUCT_PRICE_SEQ")})
    @Column(name = "AIO_CATEGORY_PRODUCT_PRICE_ID", length = 10)
    private Long aioCategoryProductPriceId;
    @Column(name = "AIO_CATEGORY_PRODUCT_ID", length = 10)
    private Long aioCategoryProductId;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "VALUE_TO", length = 30)
    private Long valueTo;
    @Column(name = "VALUE_FROM", length = 30)
    private Long valueFrom;

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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOCategoryProductPriceDTO dto = new AIOCategoryProductPriceDTO();
        dto.setAioCategoryProductPriceId(this.getAioCategoryProductPriceId());
        dto.setAioCategoryProductId(this.getAioCategoryProductId());
        dto.setType(this.getType());
        dto.setValueTo(this.getValueTo());
        dto.setValueFrom(this.getValueFrom());
        return dto;
    }
}
