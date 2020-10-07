package com.viettel.ktts2.filter;

import com.viettel.ktts.vps.VPSServiceWrapper;
import java.io.IOException;
import java.util.Date;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.log4j.Logger;

import com.viettel.ktts2.common.UDate;

import viettel.passport.client.ServiceTicketValidator;
import viettel.passport.client.UserToken;
//import viettel.passport.util.ModifyHeaderUtils;

import com.viettel.ktts.vps.VpsPermissionChecker;
import com.viettel.ktts.vps.VpsUserToken;

public class VpsRestConnector {

    private HttpServletRequest request;
    private HttpServletResponse response;
    private String ticket;
    private static String passportLoginURL;
    private static String serviceURL;
    private static String domainCode;
    private static String passportValidateURL;
    private static String errorUrl;
    private static String[] allowedUrls;
    private static final String FILE_URL = "cas";
    private static ResourceBundle rb;
    private static boolean modifyHeader = false;
    public String returnUrl;
    // add service VSA url
    // private static String serviceVsaURL;
    //vps webservice url
    private static String serviceVpsUrl;
    private static Logger LOG = Logger.getLogger(VpsRestConnector.class);
    private static Logger LOG_DANG_NHAP = Logger.getLogger("LogDangNhap");

    private int authenticateCode;

    public int getAuthenticateCode() {
        return authenticateCode;
    }

    public void setAuthenticateCode(int authenticateCode) {
        this.authenticateCode = authenticateCode;
    }

    static {
        try {
            rb = ResourceBundle.getBundle("cas");
            passportLoginURL = rb.getString("loginUrl");
            serviceURL = rb.getString("service");
            domainCode = rb.getString("domainCode");
            passportValidateURL = rb.getString("validateUrl");
            errorUrl = rb.getString("errorUrl");
            modifyHeader = "true".equalsIgnoreCase(rb.getString("useModifyHeader"));
            serviceVpsUrl = rb.getString("vpsServiceUrl");
            String allowedUrlStr = rb.getString("AllowUrl");
            if (allowedUrlStr != null) {
                allowedUrls = allowedUrlStr.split(",");
            }

        } catch (MissingResourceException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    public VpsRestConnector(HttpServletRequest req, HttpServletResponse res) {
        this.request = req;
        this.response = res;
    }

    public Boolean isAuthenticate() {
        return (this.request != null) && (this.request.getSession() != null) && (this.request.getSession().getAttribute("vpsUserToken") != null);
    }

    public Boolean hadTicket() {
        String st = getTicketFromRequest();
        return (st != null) && (st.trim().length() > 0);
    }

    private String getTicketFromRequest() {
        String referer = (String) this.request.getHeader("referer");//check refer
        if (referer != null) {
            int indexRefferr = referer.lastIndexOf("ticket");
            if (indexRefferr >= 0) {
                return referer.substring(indexRefferr + 7);
            }
        }
        return this.request.getHeader("ticket");
    }

    public Boolean getAuthenticate()
            throws IOException {
        try {
            String tmpTicket = getTicketFromRequest();

            String ip = this.request.getHeader("VTS-IP");
            String ipwan = this.request.getRemoteAddr();
            String mac = this.request.getHeader("VTS-MAC");
//            try {
//                if ((ip != null) && (ip.length() > 0)) {
//                    ip = ModifyHeaderUtils.parseIP(ip);
//                } else {
//                    ip = null;
//                }
//                if ((mac != null) && (mac.length() > 0)) {
//                    mac = ModifyHeaderUtils.parseMAC(mac);
//                } else {
//                    mac = null;
//                }
//            } catch (Exception e) {
//                ip = null;
//                mac = null;
//                LOG.error("Giai ma modify header that bai " + e.getMessage(), e);
//            }
            ServiceTicketValidator stValidator = new ServiceTicketValidator();
            stValidator.setCasValidateUrl(passportValidateURL);
            stValidator.setServiceTicket(tmpTicket);
            stValidator.setService(serviceURL);
            stValidator.setDomainCode(domainCode);
            stValidator.validate();

            HttpSession session = this.request.getSession();
            session.invalidate();
            session = this.request.getSession(true);

//            authenticateCode = stValidator.getAuthenticateCode();
            if (!stValidator.isAuthenticationSuccesful() || stValidator.getUser() ==null) {
                session.setAttribute("vsaUserToken", null);
                session.setAttribute("netID", null);

                //Build log dang nhap fail
                StringBuilder sb = new StringBuilder();
                sb.append("Login|");
                sb.append(UDate.toLogDateFormat(new Date()) + "|");
                sb.append("|");
                sb.append(ip + "|");
                sb.append(request.getPathInfo() + "|");
                sb.append("FAIL" + "|");
                sb.append("" + "|");
                LOG_DANG_NHAP.warn(sb.toString());
                //end log dang nhap fail
                return false;
            }
            UserToken usr = stValidator.getUserToken();
            VpsUserToken vpsUserToken = null;
            if (usr != null && (usr.getStaffCode() != null) && (!"".equals(usr.getStaffCode().trim()))) {
                try {
                    LOG.info("Lay thong tin nguoi dung tu vpsService tap trung");
                    vpsUserToken = getVpsUserToken(usr.getStaffCode(), "CTCT");
                    session.setAttribute("vpsUserToken", vpsUserToken);//du lieu vps
                } catch (Throwable e) {
                    LOG.error("Loi khi update role cho tai khoan", e);
                }
            }
//            VpsUserToken vpsUserToken = stValidator.getVpsUserToken();
            session.setAttribute("vsaUserToken", usr);//du lieu vsa cu
            //Đẩy thông tin phiên người dùng vào
            VpsPermissionChecker.putAuthorizedToSession(session, vpsUserToken);
            //Ghi log dang nhap
            StringBuilder sb = new StringBuilder();
            sb.append("Login|");
            sb.append(UDate.toLogDateFormat(new Date()) + "|");
            sb.append(usr.getUserName() + "|");
            sb.append(request.getRemoteAddr() + "|");
            sb.append(request.getPathInfo() + "|");
            sb.append("SUCCESS" + "|");
            sb.append("" + "|");
            LOG_DANG_NHAP.warn(sb.toString());

            //endlog dang nhap
            session.setAttribute("netID", stValidator.getUser());
            session.setAttribute("VTS-IP", ip);
            session.setAttribute("VTS-MAC", mac);
            //  CacheManagement.getInstance().putCache(session.getId(),session);
            if (ipwan == null) {
                LOG.error("IP WAN get from request is NULL!!!");
                System.out.println("IP WAN get from request is NULL!!!");
            } else {
                LOG.info("IP WAN is: " + ipwan);
                System.out.println("IP WAN is: " + ipwan);
            }
            session.setAttribute("VTS-IPWAN", ipwan);
            if ((this.returnUrl != null) && (this.returnUrl.trim().length() > 0)) {
                session.setAttribute("return_url", this.returnUrl);
            }
            if ((modifyHeader) || (ip != null) || (mac != null)) {
                LOG.info(String.format("User %s logined at ip %s and mac %s ipwan %s session %s - %s modifyHeader", new Object[]{stValidator.getUser(), ip, mac, ipwan, session.getId(), modifyHeader ? "with" : "without"}));
            } else {
                LOG.info(String.format("User %s logined at ipwan %s without modifyHeader", new Object[]{stValidator.getUser(), ipwan}));
            }
            return true;
        } catch (ParserConfigurationException e) {
            LOG.error(e.getMessage(), e);
        }
        return false;
    }

    public String getPassportLoginURL() {
        return passportLoginURL;
    }

    public synchronized static void setPassportLoginURL(String passportLoginURLs) {
        passportLoginURL = passportLoginURLs;
    }

    public String getServiceURL() {
        return serviceURL;
    }

    public synchronized static void setServiceURL(String serviceURLs) {
        serviceURL = serviceURLs;
    }

    public String getDomainCode() {
        return domainCode;
    }

    public synchronized static void setDomainCode(String domainCodes) {
        domainCode = domainCodes;
    }

    public String getPassportValidateURL() {
        return passportValidateURL;
    }

    public synchronized static void setPassportValidateURL(String passportValidateURLs) {
        passportValidateURL = passportValidateURLs;
    }

    public String getTicket() {
        return this.ticket;
    }

    public void setTicket(String tickets) {
        this.ticket = tickets;
    }

    public static String getErrorUrl() {
        return errorUrl;
    }

    public synchronized static void setErrorUrl(String errorUrls) {
        errorUrl = errorUrls;
    }

    public static boolean isModifyHeader() {
        return modifyHeader;
    }

    public synchronized static void setModifyHeader(boolean usemodifyHeaders) {
        modifyHeader = usemodifyHeaders;
    }

    public synchronized static void setAllowedUrls(String[] strs) {
        allowedUrls = new String[strs.length];
        System.arraycopy(strs, 0, allowedUrls, 0, strs.length);
    }

    public static String[] getAllowedUrls() {
        if (allowedUrls != null) {
            String[] tmps = new String[allowedUrls.length];
            System.arraycopy(allowedUrls, 0, tmps, 0, allowedUrls.length);
            return tmps;
        }
        return new String[0];
    }

    public VpsUserToken getVpsUserToken(String staffCode, String appCode) throws Throwable {
        LOG.info(new StringBuilder().append("VPS:call du lieu sang vps, content: vpsUrl=").append(serviceVpsUrl).append(",staffCode=").append(staffCode).append(",domain_code=").append(appCode).toString());
        VpsUserToken data = new VpsUserToken(VPSServiceWrapper.getAuthorizedData(serviceVpsUrl, staffCode, appCode, null));
        if ((data.getErrorCode() == null)) {
            LOG.info("Gọi dữ liệu sang VPS thành công");
            if ((data.getParentMenu() == null) && (data.getParentMenu().isEmpty())) {
                LOG.error("Loi khi goi sang vps");
                LOG.info("nguoi dung chua duoc phan quyen voi");
                this.authenticateCode = 2;
            } else {
                this.authenticateCode = 1;
            }
        } else {
            LOG.error("Loi khi goi sang vps");
            this.authenticateCode = 3;
        }
        return data;
    }
}
