package com.viettel.aio.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.aio.dto.SendSmsEmailDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "SEND_SMS_EMAIL")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SendSmsEmailBO extends BaseFWModelImpl{
	private Long sendSmsEmailId;
	private String subject;
	private String content;
	private String type;
	private String status;
	private String resend;
	private String reason;
	private String receivePhoneNumber;
	private String receiveEmail;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date createdDate;
	private Long createdUserId;
	private Long createdGroupId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date updateDate;
	private Long updateUserId;
	private Long updateGroupId;
	private Long workItemId;

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
	@Parameter(name = "sequence", value = "SEND_SMS_EMAIL_SEQ") })
	@Column(name = "SEND_SMS_EMAIL_ID", unique = true, nullable = false, precision = 10, scale = 0)
	public Long getSendSmsEmailId() {
		return sendSmsEmailId;
	}

	public void setSendSmsEmailId(Long sendSmsEmailId) {
		this.sendSmsEmailId = sendSmsEmailId;
	}

	@Column(name = "SUBJECT", length = 100)
	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	@Column(name = "CONTENT", length = 2000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "TYPE", length = 2)
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "RESEND", length = 100)
	public String getResend() {
		return resend;
	}

	public void setResend(String resend) {
		this.resend = resend;
	}

	@Column(name = "REASON", length = 100)
	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	@Column(name = "RECEIVE_PHONE_NUMBER", length = 20)
	public String getReceivePhoneNumber() {
		return receivePhoneNumber;
	}

	public void setReceivePhoneNumber(String receivePhoneNumber) {
		this.receivePhoneNumber = receivePhoneNumber;
	}

	@Column(name = "RECEIVE_EMAIL", length = 50)
	public String getReceiveEmail() {
		return receiveEmail;
	}

	public void setReceiveEmail(String receiveEmail) {
		this.receiveEmail = receiveEmail;
	}

	@Column(name = "CREATED_DATE")
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "CREATED_USER_ID", length = 10)
	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	@Column(name = "CREATED_GROUP_ID", length = 10)
	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	@Column(name = "UPDATED_DATE")
	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	@Column(name = "UPDATED_USER_ID", length = 10)
	public Long getUpdateUserId() {
		return updateUserId;
	}

	public void setUpdateUserId(Long updateUserId) {
		this.updateUserId = updateUserId;
	}

	@Column(name = "UPDATED_GROUP_ID", length = 10)
	public Long getUpdateGroupId() {
		return updateGroupId;
	}

	public void setUpdateGroupId(Long updateGroupId) {
		this.updateGroupId = updateGroupId;
	}

	@Column(name = "WORK_ITEM_ID", length = 10)
	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}
	
	@Override
	public SendSmsEmailDTO toDTO() {
		SendSmsEmailDTO dto = new SendSmsEmailDTO();
		dto.setSendSmsEmailId(this.sendSmsEmailId);
		dto.setSubject(this.subject);
		dto.setContent(this.content);
		dto.setType(this.type);
		dto.setStatus(this.status);
		dto.setResend(this.resend);
		dto.setReason(this.reason);
		dto.setReceivePhoneNumber(this.receivePhoneNumber);
		dto.setReceiveEmail(this.receiveEmail);
		dto.setCreatedDate(this.createdDate);
		dto.setCreatedUserId(this.createdUserId);
		dto.setCreatedGroupId(this.createdGroupId);
		dto.setUpdateDate(this.updateDate);
		dto.setUpdateUserId(this.updateUserId);
		dto.setUpdateGroupId(this.updateGroupId);
		dto.setWorkItemId(this.workItemId);
		return dto;
	}
}
