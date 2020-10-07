package jp.co.softbrain.esales.employees.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import io.github.jhipster.config.JHipsterProperties;
import jp.co.softbrain.esales.employees.service.MailService;
import jp.co.softbrain.esales.employees.service.dto.CreateUserInputDTO;
import jp.co.softbrain.esales.employees.service.dto.ForgotPasswordInputDTO;
import jp.co.softbrain.esales.employees.service.dto.InviteEmployeesInDTO;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;

/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class MailServiceImpl implements MailService {
    private static final String TEMPLATE_MAIL_INVITE_EMPLOYEE = "mail/inviteEmployees";
    private static final String TEMPLATE_MAIL_CREATE_EMPLOYEE = "mail/createUserLogin";
    private static final String TEMPLATE_MAIL_FORGOT_PASSWORD = "mail/forgotPassword";

    @Autowired
    private JHipsterProperties jHipsterProperties;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Send mail for invite employee
     * 
     * @param dto {@link InviteEmployeesInDTO}
     */
    public void sendInviteEmployeeMail(InviteEmployeesInDTO dto) throws MessagingException {
        String userLanguage = jwtTokenUtil.getLanguageKeyFromToken().replace("_", "-");
        Locale locale = Locale.forLanguageTag(userLanguage);

        Context context = new Context(locale);
        context.setVariable("dto", dto);

        String content = templateEngine.process(TEMPLATE_MAIL_INVITE_EMPLOYEE, context);
        String subject = messageSource.getMessage("email.invite.employee.subject",
                new String[] { dto.getCompanyName() }, locale);

        String email = dto.getEmail();
        sendEmail(email, subject, content, false, true);
    }

    /**
     * Send mail for createEmployee
     *
     * @param createUserInput {@link CreateUserInputDTO}
     */
    public void sendMailForCreateUser(CreateUserInputDTO createUserInput) throws MessagingException {
        String userLanguage = jwtTokenUtil.getLanguageKeyFromToken().replace("_", "-");
        Locale locale = Locale.forLanguageTag(userLanguage);

        Context context = new Context(locale);
        context.setVariable("dto", createUserInput);

        String content = templateEngine.process(TEMPLATE_MAIL_CREATE_EMPLOYEE, context);
        String subject = messageSource.getMessage("email.create.user.title", null, locale);

        String email = createUserInput.getEmail();
        sendEmail(email, subject, content, false, true);
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.MailService#
     * sendMailForgotPassword(jp.co.softbrain.esales.employees.service.dto.
     * ForgotPasswordInputDTO, java.lang.String)
     */
    public void sendMailForgotPassword(ForgotPasswordInputDTO forgotInput, String languageCode)
            throws MessagingException {
        String userLanguage = languageCode.replace("_", "-");
        Locale locale = Locale.forLanguageTag(userLanguage);

        Context context = new Context(locale);
        context.setVariable("dto", forgotInput);

        String content = templateEngine.process(TEMPLATE_MAIL_FORGOT_PASSWORD, context);
        String subject = messageSource.getMessage("email.forgot.title", null, locale);

        String email = forgotInput.getEmail();
        sendEmail(email, subject, content, false, true);
    }

    /**
     * Send mail
     *
     * @param to To address
     * @param subject The subject mail
     * @param content The content mail
     * @param isMultipart flag multipart
     * @param isHtml flag HTML
     * @throws MessagingException Messaging exception
     */
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml)
            throws MessagingException {

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
        message.setTo(to);
        message.setFrom(jHipsterProperties.getMail().getFrom());
        message.setSubject(subject);
        message.setText(content, isHtml);
        javaMailSender.send(mimeMessage);
    }
}
