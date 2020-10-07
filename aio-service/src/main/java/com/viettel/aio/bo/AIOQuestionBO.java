package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "AIO_QUESTION")
public class AIOQuestionBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_QUESTION_SEQ")})
    @Column(name = "AIO_QUESTION_ID", length = 10)
    private Long questionId;
    @Column(name = "TYPE", length = 2)
    private Integer type;
    @Column(name = "QUESTION_CONTENT", length = 2000)
    private String questionContent;
    @Column(name = "ANSWER1", length = 2000)
    private String answer1;
    @Column(name = "ANSWER2", length = 2000)
    private String answer2;
    @Column(name = "ANSWER3", length = 2000)
    private String answer3;
    @Column(name = "ANSWER4", length = 2000)
    private String answer4;
    @Column(name = "ANSWER5", length = 2000)
    private String answer5;
    @Column(name = "STATUS", length = 2)
    private Integer status;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_DATE")
    private Date createdDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;
    @Column(name = "UPDATED_DATE")
    private Date updatedDate;


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

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
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
    public BaseFWDTOImpl toDTO() {
        AIOQuestionDTO dto = new AIOQuestionDTO();
        dto.setQuestionId(questionId);
        dto.setType(type);
        dto.setQuestionContent(questionContent);
        dto.setAnswer1(answer1);
        dto.setAnswer2(answer2);
        dto.setAnswer3(answer3);
        dto.setAnswer4(answer4);
        dto.setAnswer5(answer5);
        dto.setStatus(status);
        dto.setCreatedDate(createdDate);
        dto.setCreatedUser(createdUser);
        dto.setUpdatedDate(updatedDate);
        dto.setUpdatedUser(updatedUser);
        return dto;
    }
}
