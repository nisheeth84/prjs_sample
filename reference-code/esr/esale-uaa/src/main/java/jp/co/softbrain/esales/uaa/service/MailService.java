package jp.co.softbrain.esales.uaa.service;

import org.springframework.scheduling.annotation.Async;
import jp.co.softbrain.esales.uaa.service.dto.UserDTO;

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
    @Async
    void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml);

    /**
     * send mail with mail body get from template
     *
     * @param user
     * @param templateName
     * @param titleKey
     */
    @Async
    public void sendEmailFromTemplate(UserDTO user, String templateName, String titleKey);

    /**
     * send mail for reset password
     *
     * @param user
     */
    @Async
    public void sendPasswordResetMail(UserDTO user);
}
