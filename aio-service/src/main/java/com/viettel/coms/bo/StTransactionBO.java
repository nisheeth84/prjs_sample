package com.viettel.coms.bo;

import com.viettel.coms.dto.StTransactionDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ST_TRANSACTION")
public class StTransactionBO extends BaseFWModelImpl {

    private Long stTransactionId;
    private String confirmDate;
    private String description;
    private String updatedDate;
    private Long updatedUserId;
    private Long oldLastShipperId;
    private Long newLastShipperId;
    private Long stockTransId;
    private String type;
    private String confirm;
    private String createdDate;
    private Long createdUserId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ST_TRANSACTION_ID")})
    @Column(name = "ST_TRANSACTION_ID", length = 10)
    public Long getStTransactionId() {
        return stTransactionId;
    }

    public void setStTransactionId(Long stTransactionId) {
        this.stTransactionId = stTransactionId;
    }

    @Column(name = "CONFIRM_DATE", length = 7)
    public String getConfirmDate() {
        return confirmDate;
    }

    public void setConfirmDate(String confirmDate) {
        this.confirmDate = confirmDate;
    }

    @Column(name = "DESCRIPTION", length = 500)
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "UPDATED_DATE", length = 7)
    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "UPDATED_USER_ID", length = 10)
    public Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    @Column(name = "OLD_LAST_SHIPPER_ID", length = 10)
    public Long getOldLastShipperId() {
        return oldLastShipperId;
    }

    public void setOldLastShipperId(Long oldLastShipperId) {
        this.oldLastShipperId = oldLastShipperId;
    }

    @Column(name = "NEW_LAST_SHIPPER_ID", length = 10)
    public Long getNewLastShipperId() {
        return newLastShipperId;
    }

    public void setNewLastShipperId(Long newLastShipperId) {
        this.newLastShipperId = newLastShipperId;
    }

    @Column(name = "STOCK_TRANS_ID", length = 10)
    public Long getStockTransId() {
        return stockTransId;
    }

    public void setStockTransId(Long stockTransId) {
        this.stockTransId = stockTransId;
    }

    @Column(name = "TYPE", length = 2)
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Column(name = "CONFIRM", length = 20)
    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CREATED_USER_ID", length = 7)
    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Override
    public StTransactionDTO toDTO() {
        // TODO Auto-generated method stub
        return null;
    }

}
