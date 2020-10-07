package com.viettel.ktts2.rest;

import com.viettel.coms.business.SysUserCOMSBusinessImpl;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts.vps.IUserToken;
import com.viettel.ktts2.business.AuthenticateBusiness;
import com.viettel.ktts2.business.CommonSysGroupBusiness;
import com.viettel.ktts2.common.ResponseMessage;
import com.viettel.ktts2.common.UDate;
import com.viettel.ktts2.dto.KttsUserSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import viettel.passport.client.UserToken;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;

public class KttsAuthenRsServiceImpl implements KttsAuthenRsService {
    private static Logger LOGGER = Logger.getLogger(KttsAuthenRsServiceImpl.class);
    private static Logger LOG_DANG_NHAP = Logger.getLogger("LogDangNhap");
    @Context
    HttpServletRequest request;
    private static final String VPS_USER_TOKEN_KEY = "vpsUserToken";
    @Autowired
    CommonSysGroupBusiness commonSysGroupBusiness;
    @Autowired
    AuthenticateBusiness authenticateBusiness;
    @Autowired
    SysUserCOMSBusinessImpl sysUserQLKBusinessImpl;

    private static final String USER_SESSION_KEY = "kttsUserSession";

    private static String logout;
    private static String service;
    private static String domainCode;

    static {
        try {
            ResourceBundle rb = ResourceBundle.getBundle("cas");
            logout = rb.getString("logoutUrl");
            service = rb.getString("service");
            domainCode = rb.getString("domainCode");
        } catch (Exception ex) {
            LOGGER.error("Loi khoi tao ung dung", ex);
        }
    }

    //phuc vu chuyen tab menu khi chuyen sang tomcat khac
    @Override
    public Response login() {
        Map<String, Object> map = new HashMap<>();
        IUserToken vpsUserToken = (IUserToken) request.getSession().getAttribute(VPS_USER_TOKEN_KEY);
        String menuCode = (String) request.getSession().getAttribute("menuCode");
        String urlCallMenuCode = (String) request.getSession().getAttribute("urlCallMenuCode");
        // map.put("casUser", vsaUserToken);
        map.put("userToken", vpsUserToken);
        map.put("menuCode", menuCode);
        map.put("urlCallMenuCode", urlCallMenuCode);
//        hoanm1_20180916_start
        try{
        Long sysId=vpsUserToken.getSysUserId();
        SysUserCOMSDTO dto=(SysUserCOMSDTO) sysUserQLKBusinessImpl.getOneById(sysId);
        sysUserQLKBusinessImpl.RegisterLoginWeb(dto);
        }catch(Exception ex){
        	LOGGER.error("Loi login web", ex);
        }
//        hoanm1_20180916_end
        return Response.ok(map).build();
    }
    //end

    @Override
    public Response getUserInfo() {
        Map<String, Object> map = new HashMap<>();

        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
        IUserToken vpsUserToken = (IUserToken) request.getSession().getAttribute(VPS_USER_TOKEN_KEY);
        map.put("casUser", vsaUserToken);
        map.put("vpsUserToken", vpsUserToken);
        //hoanm1_0805_start
        String mnCode = (String) request.getSession().getAttribute("menuCode");
        String urlCallMenuCode = (String) request.getSession().getAttribute("urlCallMenuCode");
        map.put("menuCode", mnCode);
        map.put("urlCallMenuCode", urlCallMenuCode);
        KttsUserSession userSession2 = (KttsUserSession) request.getSession().getAttribute(USER_SESSION_KEY);
        //hoanm1_0805_end
        if (userSession2 == null) {
            userSession2 = new KttsUserSession();
            if (vsaUserToken != null) {
                userSession2.setUserToken(vpsUserToken);

                // Lay thong tin tu db
                try {
//					KttsSysUserDto sysUserDto = authenticateBusiness.getKttsSysUserById(vpsUserToken.getSysUserId());
//					userSession2.setKttsSysUserDto(sysUserDto);

                    SysUserCOMSDTO dto = sysUserQLKBusinessImpl.getUserInfoByLoginName(vpsUserToken.getUserName());
                    userSession2.setVpsUserInfo(dto);

                } catch (Exception ex) {
                    LOGGER.error("Loi khi truy van database", ex);
                }
                request.getSession().setAttribute(USER_SESSION_KEY, userSession2);
            }

        }
        if (userSession2.getUserToken() != null) {
            map.put("kttsUsertoken", userSession2.getKttsSysUserDto());

        }
        if (userSession2.getVpsUserInfo() != null) {
            map.put("VpsUserInfo", userSession2.getVpsUserInfo());
        }
        return Response.ok(map).build();
    }

    @Override
    public Response logout() throws Exception {

        ResponseMessage rs = new ResponseMessage();
        UserToken vsaUserToken = (UserToken) request.getSession().getAttribute("vsaUserToken");
        String username = vsaUserToken == null ? "" : vsaUserToken.getUserName();
        // build log dang xuat
        StringBuilder sb = new StringBuilder();
        sb.append("Logout|");
        sb.append(UDate.toLogDateFormat(new Date()) + "|");
        sb.append(username + "|");
        sb.append(request.getRemoteAddr() + "|");
        sb.append(request.getPathInfo() + "|");
        sb.append("SUCCESS" + "|");
        sb.append("" + "|");
        LOG_DANG_NHAP.warn(sb.toString());
        request.getSession().invalidate();

        rs.setStatus("499");// logout status

        StringBuilder logoutUrl = new StringBuilder();
        logoutUrl.append(logout).append("?service=" + URLEncoder.encode(service, "UTF-8")).append("&userName=")
                .append(username).append("&appCode=").append(domainCode);
        rs.setData(logoutUrl.toString());
        return Response.status(499).entity(rs).build();

    }
}
