package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;

import jp.classmethod.premembers.check.security.constant.SecurityCheckReportConst;

/**
 * @author TuanDV
 */
public class SecurityCheckItemDetailsDto implements Serializable {
    private static final long serialVersionUID = 8499327057086771672L;
    private String checkCode;
    private String checkNumber;
    private String control;
    private String correctly;
    private boolean headerFlg = false;
    private int checkResult;
    private int exclusionFlag;
    private String comment;
    private String createdAt;
    private String mailAddress;

    // Default constructor
    public SecurityCheckItemDetailsDto() {
    }

    // Constructor
    public SecurityCheckItemDetailsDto(String checkCode, String checkNumber, String control, boolean headerFlg) {
        this.checkCode = checkCode;
        this.checkNumber = checkNumber;
        this.control = control;
        this.correctly = SecurityCheckReportConst.NA;
        this.headerFlg = headerFlg;
    }

    // Getter & Setter
    public String getCheckCode() {
        return checkCode;
    }

    public void setCheckCode(String checkCode) {
        this.checkCode = checkCode;
    }

    public String getControl() {
        return control;
    }

    public void setControl(String control) {
        this.control = control;
    }

    public String getCorrectly() {
        return headerFlg ? SecurityCheckReportConst.THREE_HYPHEN_HALFSIZE : correctly;
    }

    public void setCorrectly(String correctly) {
        this.correctly = correctly;
    }

    public boolean isHeaderFlg() {
        return headerFlg;
    }

    public void setHeaderFlg(boolean headerFlg) {
        this.headerFlg = headerFlg;
    }

    public String getCheckNumber() {
        return checkNumber;
    }

    public void setCheckNumber(String checkNumber) {
        this.checkNumber = checkNumber;
    }

    public int getCheckResult() {
        return checkResult;
    }

    public void setCheckResult(int checkResult) {
        this.checkResult = checkResult;
    }

    public int getExclusionFlag() {
        return exclusionFlag;
    }

    public void setExclusionFlag(int exclusionFlag) {
        this.exclusionFlag = exclusionFlag;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getMailAddress() {
        return mailAddress;
    }

    public void setMailAddress(String mailAddress) {
        this.mailAddress = mailAddress;
    }
}
