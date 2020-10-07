package com.viettel.aio.dto;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.aio.bo.SendSmsEmailBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.wms.dto.wmsBaseDTO;

@XmlRootElement(name = "sendSmsEmailDTO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SendSmsEmailDTO extends wmsBaseDTO<SendSmsEmailBO> {

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

	public Long getSendSmsEmailId() {
		return sendSmsEmailId;
	}

	public void setSendSmsEmailId(Long sendSmsEmailId) {
		this.sendSmsEmailId = sendSmsEmailId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getResend() {
		return resend;
	}

	public void setResend(String resend) {
		this.resend = resend;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getReceivePhoneNumber() {
		return receivePhoneNumber;
	}

	public void setReceivePhoneNumber(String receivePhoneNumber) {
		this.receivePhoneNumber = receivePhoneNumber;
	}

	public String getReceiveEmail() {
		return receiveEmail;
	}

	public void setReceiveEmail(String receiveEmail) {
		this.receiveEmail = receiveEmail;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getUpdateUserId() {
		return updateUserId;
	}

	public void setUpdateUserId(Long updateUserId) {
		this.updateUserId = updateUserId;
	}

	public Long getUpdateGroupId() {
		return updateGroupId;
	}

	public void setUpdateGroupId(Long updateGroupId) {
		this.updateGroupId = updateGroupId;
	}

	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}
	
	@Override
	public SendSmsEmailBO toModel() {
		SendSmsEmailBO bo = new SendSmsEmailBO();
		bo.setSendSmsEmailId(this.sendSmsEmailId);
		bo.setSubject(this.subject);
		bo.setContent(this.content);
		bo.setType(this.type);
		bo.setStatus(this.status);
		bo.setResend(this.resend);
		bo.setReason(this.reason);
		bo.setReceivePhoneNumber(this.receivePhoneNumber);
		bo.setReceiveEmail(this.receiveEmail);
		bo.setCreatedDate(this.createdDate);
		bo.setCreatedUserId(this.createdUserId);
		bo.setCreatedGroupId(this.createdGroupId);
		bo.setUpdateDate(this.updateDate);
		bo.setUpdateUserId(this.updateUserId);
		bo.setUpdateGroupId(this.updateGroupId);
		bo.setWorkItemId(this.workItemId);
		return bo;
	}

	@Override
	public String catchName() {
		return null;
	}

	@Override
	public Long getFWModelId() {
		return null;
	}


}
