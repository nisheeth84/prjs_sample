package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * FeedbackDTO
 *
 * @author DatDV
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class FeedbackDTO extends BaseDTO implements Serializable {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 3340531278513660701L;

    /**
     * feedbackId
     */
    private Long feedbackId;

    /**
     * tenantName
     */
    private String tenantName;

    /**
     * companyName
     */
    private String companyName;

    /**
     * employeeId
     */
    private Long employeeId;

    /**
     * feedbackType
     */
    private String feedbackType;

    /**
     * feedbackContent
     */
    private String feedbackContent;

    /**
     * displayType
     */
    private String displayType;

    /**
     * terminalType
     */
    private String terminalType;

    /**
     * content
     */
    private String content;
}
