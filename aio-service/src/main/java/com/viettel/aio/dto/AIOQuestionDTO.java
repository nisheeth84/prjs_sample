package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOQuestionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.codehaus.jackson.map.annotate.JsonDeserialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@XmlRootElement(name = "AIO_QUESTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOQuestionDTO extends ComsBaseFWDTO<AIOQuestionBO> {

    public static final Integer STATUS_DELETED = 0;
    public static final Integer STATUS_ACTICE = 1;
    public static final Integer TYPE_SELECT = 1;
    public static final String TYPE_SELECT_NAME = "Câu hỏi lựa chọn";
    public static final Integer TYPE_INPUT = 2;
    public static final String TYPE_INPUT_NAME = "Câu hỏi nhập đáp án";

    public AIOQuestionDTO() {
        images = new ArrayList<>();
    }

    private Long questionId;
    private Integer type;
    private String questionContent;
    private String answer1;
    private String answer2;
    private String answer3;
    private String answer4;
    private String answer5;
    private Integer status;
    private Long createdUser;
    private String createdUserName;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long updatedUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updatedDate;

    private List<UtilAttachDocumentDTO> images;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getQuestionContent() {
        return questionContent;
    }

    public void setQuestionContent(String questionContent) {
        this.questionContent = questionContent;
    }

    public String getAnswer1() {
        return answer1;
    }

    public void setAnswer1(String answer1) {
        this.answer1 = answer1;
    }

    public String getAnswer2() {
        return answer2;
    }

    public void setAnswer2(String answer2) {
        this.answer2 = answer2;
    }

    public String getAnswer3() {
        return answer3;
    }

    public void setAnswer3(String answer3) {
        this.answer3 = answer3;
    }

    public String getAnswer4() {
        return answer4;
    }

    public void setAnswer4(String answer4) {
        this.answer4 = answer4;
    }

    public String getAnswer5() {
        return answer5;
    }

    public void setAnswer5(String answer5) {
        this.answer5 = answer5;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public List<UtilAttachDocumentDTO> getImages() {
        return images;
    }

    public void setImages(List<UtilAttachDocumentDTO> images) {
        this.images = images;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Override
    public AIOQuestionBO toModel() {
        AIOQuestionBO bo = new AIOQuestionBO();
        bo.setQuestionId(questionId);
        bo.setType(type);
        bo.setQuestionContent(questionContent);
        bo.setAnswer1(answer1);
        bo.setAnswer2(answer2);
        bo.setAnswer3(answer3);
        bo.setAnswer4(answer4);
        bo.setAnswer5(answer5);
        bo.setStatus(status);
        bo.setCreatedDate(createdDate);
        bo.setCreatedUser(createdUser);
        bo.setUpdatedDate(updatedDate);
        bo.setUpdatedUser(updatedUser);
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return questionId;
    }

    @Override
    public String catchName() {
        return questionId.toString();
    }
}
