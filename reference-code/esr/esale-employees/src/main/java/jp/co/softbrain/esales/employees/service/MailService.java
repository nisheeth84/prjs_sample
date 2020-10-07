package jp.co.softbrain.esales.employees.service;

import javax.mail.MessagingException;

import org.springframework.scheduling.annotation.Async;

import jp.co.softbrain.esales.employees.service.dto.CreateUserInputDTO;
import jp.co.softbrain.esales.employees.service.dto.ForgotPasswordInputDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;

/**
 * MailService Interface for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
public interface MailService {

    /**
     * Send mail
     *
     * @param to
     * @param subject
     * @param content
     * @param isMultipart
     * @param isHtml
     */
    void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) throws MessagingException;


    /**
     * Send invite mail to employee
     * @param dto
     */
    public void sendInviteEmployeeMail(InviteEmployeesInDTO dto) throws MessagingException;

    /**
     * Send mail for createEmployee
     *
     * @param createUserInput {@link CreateUserInputDTO}
     */
    public void sendMailForCreateUser(CreateUserInputDTO createUserInput) throws MessagingException;
    
    /**
     * send mail forgot password
     * 
     * @param forgotInput
     * @param languageCode
     * @throws MessagingException
     */
    public void sendMailForgotPassword(ForgotPasswordInputDTO forgotInput, String languageCode) throws MessagingException;

}
