package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * CreateFeedBackOutDTO
 * 
 * @author DatDV
 */
@Data
@EqualsAndHashCode
public class CreateFeedBackOutDTO implements Serializable{

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = -2768592950294789943L;
    
    /**
     * feedbackId
     */
    private Long feedbackId;

}
