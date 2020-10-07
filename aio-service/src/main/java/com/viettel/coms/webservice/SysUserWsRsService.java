package com.viettel.coms.webservice;

import com.viettel.asset.business.AuthenticateWsBusiness;
import com.viettel.asset.dto.AuthenticationInfo;
import com.viettel.asset.dto.BaseWsRequest;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.business.SysUserCOMSBusinessImpl;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.coms.dto.SysUserDTOResponse;
import com.viettel.coms.dto.SysUserRequest;
import com.viettel.passport.ErrorCode;
import com.viettel.passport.PassportWS;
import com.viettel.passport.PassportWSService;
import com.viettel.passport.Response;
import com.viettel.utils.CryptoUtils;
import com.viettel.vps.webservice.AuthorizedData;
import com.viettel.vps.webservice.AuthorizedDataService;
import com.viettel.vps.webservice.SysUserBO;
import com.viettel.vps.webservice.UserPermissionBO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.w3c.dom.CharacterData;
import org.w3c.dom.*;
import org.xml.sax.InputSource;
import viettel.passport.client.UserToken;
import viettel.passport.service.SSOServiceUtils;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.ws.Service;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

//hoanm1_20180522_start
//hoanm1_20180522_end

@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
@Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
@Path("/service/")
public class SysUserWsRsService {
    private Logger LOGGER = Logger.getLogger(ConstructionTaskWsRsService.class);

    //  hoanm1_20180522_end
    /**
     * Ham tra ve danh sach cac permissions
     *
     * @param username
     * @param password
     * @return
     * @throws MalformedURLException
     */
    @Value("${login_wsUrl}")
    private String login_wsUrl;

    @Autowired
    SysUserCOMSBusinessImpl sysUserComBusiness;


    @Autowired
    AuthenticateWsBusiness authenticateWsBusiness;

//	@Autowired
//	private WebServiceTemplate webServiceTemplate;

    @POST
    @Path("/getListUserByDepartmentId/")
    public SysUserDTOResponse getListUserByDepartmentId(SysUserRequest request) {
        SysUserDTOResponse response = new SysUserDTOResponse();
        try {
            authenticateWsBusiness.validateRequest(request);
            List<SysUserCOMSDTO> data = sysUserComBusiness.getListUserByDepartment(request);
            response.setListUser(data);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;

    }

    @POST
    @Path("/Login/")
    public SysUserDTOResponse Login(BaseWsRequest request) {
        SysUserDTOResponse response = new SysUserDTOResponse();

        try {
            int result = sysUserComBusiness.LoginBusiness(request);
            if (result > 0) {
                List<SysUserCOMSDTO> data = sysUserComBusiness.getUserByUsernamePassword(request);
                response.setListUser(data);
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_OK);
                response.setResultInfo(resultInfo);
            } else {
                ResultInfo resultInfo = new ResultInfo();
                resultInfo.setStatus(ResultInfo.RESULT_NOK);
                response.setResultInfo(resultInfo);
            }

        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            resultInfo.setMessage(e.getMessage());
            response.setResultInfo(resultInfo);
        }
        return response;
    }
	
	/*@POST
		@Path("/auth/")
		public SysUserDTOResponse auth(BaseWsRequest request) throws MalformedURLException {
			SysUserDTOResponse response = new SysUserDTOResponse();
	
			
			String username = request.getAuthenticationInfo().getUsername();
			String password = request.getAuthenticationInfo().getPassword();
			
			if (authentication(username, password)) {
				SysUserBO user = getSysUserBo(username, password);
				SysUserCOMSDTO userDto = sysUserComBusiness.getSysUserByEmployee(user.getEmployeeCode());
	
				response.setUserLogin(userDto);
				ResultInfo resultInfo = new ResultInfo();
				resultInfo.setStatus(ResultInfo.RESULT_OK);
				response.setResultInfo(resultInfo);
				sysUserComBusiness.RegisterLoginTime(userDto);
				
			} else {
				ResultInfo resultInfo = new ResultInfo();
				resultInfo.setStatus(ResultInfo.RESULT_NOK);
				response.setResultInfo(resultInfo);
			}
	
			return response;
		}*/

    //    hoanm1_20180522_start
//    @POST
//    @Path("/auth/")
//    public SysUserDTOResponse auth(BaseWsRequest request) throws MalformedURLException {
//        SysUserDTOResponse response = new SysUserDTOResponse();
//
//        //VietNT_16/09/2019_start
//        int type = request.getAuthenticationInfo().getType();
//        if (type > 0) {
//            return this.authLoginCTV(request.getAuthenticationInfo());
//        }
//        //VietNT_end
//
//        String username = request.getAuthenticationInfo().getUsername();
//        String password = request.getAuthenticationInfo().getPassword();
//        String staffCode = "";
//        staffCode = authentication(username, password, staffCode);
//        if (!staffCode.equals("")) {
//            SysUserBO user = getSysUserBo(staffCode, password);
//
//            // Cuongnv2 Modifield in getSysUserByEmployeeCode start
//            SysUserCOMSDTO userDto = sysUserComBusiness.getSysUserByEmployee(user.getEmployeeCode());
//            // Cuongnv2 Modifield in getSysUserByEmployeeCode end
//
//            response.setUserLogin(userDto);
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_OK);
//
//            response.setResultInfo(resultInfo);
//            sysUserComBusiness.RegisterLoginTime(userDto);
//        } else {
//            ResultInfo resultInfo = new ResultInfo();
//            resultInfo.setStatus(ResultInfo.RESULT_NOK);
//            response.setResultInfo(resultInfo);
//        }
//
//        return response;
//    }

    @POST
    @Path("/auth/")
    public SysUserDTOResponse auth(BaseWsRequest request) throws MalformedURLException {
        SysUserDTOResponse response = new SysUserDTOResponse();

        //VietNT_16/09/2019_start
//        int type = request.getAuthenticationInfo().getType();
//        if (type > 0) {
//            return this.authLoginCTV(request.getAuthenticationInfo());
//        }
        //VietNT_end

        String username = request.getAuthenticationInfo().getUsername();
        String password = request.getAuthenticationInfo().getPassword();
        UserToken userToken = SSOServiceUtils.validate(username, password);
        if (userToken != null && userToken.getStaffCode() != null && !"".equals(userToken.getStaffCode())) {
            SysUserCOMSDTO userDto = sysUserComBusiness.getSysUserByEmployee(userToken.getStaffCode());
            response.setUserLogin(userDto);
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_OK);

            response.setResultInfo(resultInfo);
            sysUserComBusiness.RegisterLoginTime(userDto);
        } else {
            ResultInfo resultInfo = new ResultInfo();
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            response.setResultInfo(resultInfo);
        }

        return response;
    }

    //VietNT_16/09/2019_start
    private SysUserDTOResponse authLoginCTV(AuthenticationInfo rq) {
        SysUserDTOResponse response = new SysUserDTOResponse();
        ResultInfo resultInfo = new ResultInfo();
        SysUserCOMSDTO userDto = sysUserComBusiness.getUserCTV(rq.getUsername());
        if (userDto != null && CryptoUtils.checkStringEqual(rq.getPassword(), userDto.getPassword())) {
            userDto.setPassword(null);
            response.setUserLogin(userDto);
            resultInfo.setStatus(ResultInfo.RESULT_OK);
            response.setResultInfo(resultInfo);
        } else {
            resultInfo.setStatus(ResultInfo.RESULT_NOK);
            response.setResultInfo(resultInfo);
        }

        return response;
    }
    //VietNT_end
    /**
     * Ham tra ve true neu dang nhap thanh cong
     * @param username
     * @param password
     * @return
     *//*
	private boolean authentication(String username, String password) {

		PassportWSService service = new PassportWSService();
		PassportWS pw = service.getPassportWSPort();
		//Response response = pw.authen("097159", "Doipass911@", "CTCT");
		Response response = pw.authen(username, password, "CTCT");
		ErrorCode errorCode = response.getErrorCode();

		if (errorCode.getCode() == 0) {
			return true;
		}

		return false;
	}*/
//  hoanm1_20180522_start

    /**
     * Ham tra ve true neu dang nhap thanh cong
     *
     * @param username
     * @param password
     * @return
     */
    private String authentication(String username, String password, String staffCode) {

        PassportWSService service = new PassportWSService();
        PassportWS pw = service.getPassportWSPort();
        //Response response = pw.authen("097159", "Doipass911@", "CTCT");
        Response response = pw.authen(username, password, "CTCT");
        ErrorCode errorCode = response.getErrorCode();
        //start
        try {
            String xml = errorCode.getDescription();
            DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            InputSource is = new InputSource();
            is.setCharacterStream(new StringReader(xml));
            Document doc = db.parse(is);
            NodeList nodes = ((org.w3c.dom.Document) doc)
                    .getElementsByTagName("STAFF_CODE");
            Element element2 = (Element) nodes.item(0);
            Node child = element2.getFirstChild();
            if (child instanceof CharacterData) {
                CharacterData cd = (CharacterData) child;
                staffCode = cd.getData();
            }
        } catch (Exception ex) {
        }
        return staffCode;
    }

    private List<UserPermissionBO> getAuthorizedData(String username, String password) throws MalformedURLException {

//        URL wsdlUrl = new URL("http://10.58.71.134:8202/vps/AuthorizedDataService?wsdl");
//        QName qname = new QName("http://webservice.vps.viettel.com/", "AuthorizedDataService");
        URL wsdlUrl = new URL(login_wsUrl);
        QName qname = new QName("http://webservice.vps.viettel.com/", "AuthorizedDataService");
        Service service = Service.create(wsdlUrl, qname);
        AuthorizedDataService ads = service.getPort(AuthorizedDataService.class);
        AuthorizedData authorizedData = ads.getAuthorizedData(username, "CTCT", password);
        com.viettel.vps.webservice.SysUserBO user = authorizedData.getUser();
        List<UserPermissionBO> businessUserPermissions = authorizedData.getBusinessUserPermissions();

        return businessUserPermissions;
    }

    private SysUserBO getSysUserBo(String username, String password) throws MalformedURLException {

//    	"http://10.58.71.134:8202/vps/AuthorizedDataService?wsdl"
        URL wsdlUrl = new URL(login_wsUrl);
        QName qname = new QName("http://webservice.vps.viettel.com/", "AuthorizedDataService");
        Service service = Service.create(wsdlUrl, qname);
        AuthorizedDataService ads = service.getPort(AuthorizedDataService.class);
        AuthorizedData authorizedData = ads.getAuthorizedData(username, "CTCT", password);

        SysUserBO user = authorizedData.getUser();
        return user;
    }
	
	
	/*@POST
	@Path("/auth/")
	public SysUserDTOResponse auth(BaseWsRequest request) throws MalformedURLException {
		SysUserDTOResponse response = new SysUserDTOResponse();

		
		String username = request.getAuthenticationInfo().getUsername();
		String password = request.getAuthenticationInfo().getPassword();
		
		if (authentication(username, password)) {
			SysUserBO user = getSysUserBo(username, password);
			SysUserCOMSDTO userDto = sysUserComBusiness.getSysUserByEmployee(user.getEmployeeCode());

			response.setUserLogin(userDto);
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_OK);
			response.setResultInfo(resultInfo);
			sysUserComBusiness.RegisterLoginTime(userDto);
			
		} else {
			ResultInfo resultInfo = new ResultInfo();
			resultInfo.setStatus(ResultInfo.RESULT_NOK);
			response.setResultInfo(resultInfo);
		}

		return response;
	}*/
}
