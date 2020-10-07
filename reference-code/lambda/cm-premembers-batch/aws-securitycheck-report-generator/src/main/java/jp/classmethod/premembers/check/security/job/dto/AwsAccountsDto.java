package jp.classmethod.premembers.check.security.job.dto;

import java.io.Serializable;

/**
 * @author TuanDV
 */
public class AwsAccountsDto implements Serializable {
    private static final long serialVersionUID = -6456617781109890477L;
    private String awsAccount;
    private int okCount;
    private int criticalCount;
    private int ngCount;
    private int managedCount;

    public AwsAccountsDto() {
    }

    // Constructor
    public AwsAccountsDto(String awsAccount, int okCount, int criticalCount, int ngCount, int managedCount) {
        this.awsAccount = awsAccount;
        this.okCount = okCount;
        this.criticalCount = criticalCount;
        this.ngCount = ngCount;
        this.managedCount = managedCount;
    }

    // Getter & Setter
    public String getAwsAccount() {
        return awsAccount;
    }

    public void setAwsAccount(String awsAccount) {
        this.awsAccount = awsAccount;
    }

    public int getOkCount() {
        return okCount;
    }

    public void setOkCount(int okCount) {
        this.okCount = okCount;
    }

    public int getCriticalCount() {
        return criticalCount;
    }

    public void setCriticalCount(int criticalCount) {
        this.criticalCount = criticalCount;
    }

    public int getNgCount() {
        return ngCount;
    }

    public void setNgCount(int ngCount) {
        this.ngCount = ngCount;
    }

    public int getManagedCount() {
        return managedCount;
    }

    public void setManagedCount(int managedCount) {
        this.managedCount = managedCount;
    }
}
