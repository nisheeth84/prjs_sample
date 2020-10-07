package com.viettel.coms.business;

import com.google.common.collect.Lists;
import com.viettel.coms.bo.SignVofficeBO;
import com.viettel.coms.dao.GoodsPlanDAO;
import com.viettel.coms.dao.SignVofficeDAO;
import com.viettel.coms.dto.CommonDTO;
import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.coms.dto.SignVofficeDTO;
import com.viettel.coms.dto.UserConfigDTO;
import com.viettel.coms.dto.VofficeUserDTO;
import com.viettel.coms.utils.EncryptionUtils;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.security.PassTranformer;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.util.PassWordUtil;
import com.viettel.voffice.ws_autosign.service.*;
import com.viettel.wms.bo.SignVofficeDetailBO;
import com.viettel.wms.dao.SignVofficeDetailDAO;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.xml.ws.BindingProvider;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("signVofficeBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SignVofficeBusinessImpl extends BaseFWBusinessImpl<SignVofficeDAO, SignVofficeDTO, SignVofficeBO>
        implements SignVofficeBusiness {
    static Logger LOGGER = LoggerFactory.getLogger(BaseFWBusinessImpl.class);
    @Autowired
    private SignVofficeDAO signVofficeDAO;
    
    @Autowired
	private SignVofficeDetailDAO signVofficeDetailDAO;
    
    @Autowired
	private GoodsPlanDAO goodsPlanDAO;
    
    @Autowired
	private UserConfigBusinessImpl userConfigBusinessImpl;

    // @Autowired
    // private DepartmentBusinessImpl departmentBusinessImpl;

    @Value("${par_code}")
    private String par_code;

    @Value("${par_type_ex}")
    private String par_type_ex;

    @Value("${par_type_im}")
    private String par_type_im;

    @Value("${ca_wsUrl}")
    private String ca_wsUrl;

    @Value("${ca_appCode}")
    private String ca_appCode;

    @Value("${ca_appPass}")
    private String ca_appPass;

    @Value("${ca_sender}")
    private String ca_sender;

    @Value("${ca_encrypt_key}")
    private String ca_encrypt_key;

    public SignVofficeBusinessImpl() {
        tModel = new SignVofficeBO();
        tDAO = signVofficeDAO;
    }

    @Override
    public SignVofficeDAO gettDAO() {
        return signVofficeDAO;
    }

    @Override
    public long count() {
        return signVofficeDAO.count("SignVofficeBO", null);
    }

    private HashMap<Long, String> mapStatus() {
        HashMap<Long, String> statusVO = new HashMap<Long, String>();
        statusVO.put(1l, "Trình kí thành công");
        statusVO.put(3l, "File trình kí không đúng định dạng");
        statusVO.put(4l, "Đã tồn tại mã giao dịch này.");
        statusVO.put(5l, "Mã giao dịch null");
        statusVO.put(6l, "Danh sách email người ký rỗng!");
        statusVO.put(8l, "Danh sách file trình kí null");
        statusVO.put(9l, "AppCode không đúng");
        statusVO.put(11l, "Lỗi phía WebService");
        statusVO.put(12l, "Thiếu thông tin trình kí");
        statusVO.put(13l, "Account null");
        statusVO.put(14l, "Mã đơn vị null");
        statusVO.put(15l, "Danh sách người ký null");
        statusVO.put(16l, "Mã nhân viên ban hành null");
        statusVO.put(17l, "Lỗi không có thông tin tài khoản Voffice");
        statusVO.put(18l, "Lỗi không truyền tham số tài khoản đăng nhập");
        statusVO.put(20l, "Lỗi ATTT tên file đính kèm");
        statusVO.put(22l, "Lỗi file đính kèm không có dung lượng");
        statusVO.put(28l, "Lỗi không tài khoản Voffice có mail trong danh sách mail trình ký");
        statusVO.put(102l, "Lỗi đăng nhập tài khoản tập trung SSO");
        statusVO.put(103l, "Lỗi trình ký cho văn thư");
        statusVO.put(104l, "Lấy sai đơn vị ban hành");
        statusVO.put(105l, "Lỗi dữ liệu rỗng");
        statusVO.put(106l, "Lỗi file đính kèm không hợp lệ");
        statusVO.put(107l, "Lỗi mail trình ký không tồn tại trên hệ thống Voffice");
        statusVO.put(108l, "Lỗi tiêu đề văn bản quá dài");
        statusVO.put(109l, "Lỗi giải mã mật khẩu");
        statusVO.put(110l, "Lỗi thiếu thông tin đơn vị hoặc Id người ký");

        return statusVO;

    }

    @Transactional
    public String signVoffice(List<CommonDTO> list, KttsUserSession objUser, HttpServletRequest request)
            throws Exception {
        String err = "";
        for (CommonDTO conmonDTO : list) {
            HashMap<Long, String> statusVO = mapStatus();
            GoodsPlanDTO goodsPlanDTO = goodsPlanDAO.getByCode(conmonDTO.getCode());
            // danh sach nguoi ky van ban

            // thong tin trinh ky

            // SignVofficeDTO
            // vofficeDTO=signVofficeDAO.getPassWordByUserId(objUser.getSysUserId());
            
            if (objUser.getVpsUserInfo().getSysUserId() != null
                    && objUser.getVpsUserInfo().getSysUserId().equals(goodsPlanDTO.getCreatedUserId())) {
                String code = conmonDTO.getObjectCode();

                String type = "0";

                String date = (new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(new Date()));
                String[] arr = date.split(" ");

                String dmy = arr[0].replace("/", "");
                String hms = arr[1].replace(":", "");

                String transactionCode = objUser.getVpsUserInfo().getSysUserId().toString() + "_"
                        + conmonDTO.getObjectId() + "_" + dmy + "_" + hms;
                // Lay userName, pass vOffice
                // TODO
                // String vOfficeName = objUser.getUserName();
                // String vOfficePass = vofficeDTO.getVofficePass();
                // transactionCode chinh la ID bang document_CA
                Long status = 0L;

                try {
                    // Goi service ben vOffice, chuyen cac tham so tuong ung
                    // Tao service ket noi
                    Vo2AutoSignSystemImplService sv = new Vo2AutoSignSystemImplService(new URL(ca_wsUrl));
                    Vo2AutoSignSystemImpl service = sv.getVo2AutoSignSystemImplPort();

                    // Set timeout params
                    int connectionTimeOutInMs = 20000; // Thoi gian timeout 10s

                    Map<String, Object> requestContext = ((BindingProvider) service).getRequestContext();
                    requestContext.put("com.sun.xml.internal.ws.connect.timeout", connectionTimeOutInMs);
                    requestContext.put("com.sun.xml.internal.ws.request.timeout", connectionTimeOutInMs);
                    requestContext.put("com.sun.xml.ws.request.timeout", connectionTimeOutInMs);
                    requestContext.put("com.sun.xml.ws.connect.timeout", connectionTimeOutInMs);

                    // Truyen cac tham so cho webservice Voffice
                    KttsVofficeCommInpuParam param = new KttsVofficeCommInpuParam();
                    String appCodeEnc = EncryptionUtils.encrypt(ca_appCode, EncryptionUtils.getKey());
                    param.setAppCode(appCodeEnc); // tên app account đăng nhập
                    // nhap
                    // tren giao dien trinh ky
                    String appPassEnc1 = PassWordUtil.getInstance().encrypt(ca_appPass);
                    String appPassEnc2 = EncryptionUtils.encrypt(appPassEnc1, EncryptionUtils.getKey());
                    param.setAppPass(appPassEnc2); // mật khẩu appaccount đăng nhập nhap tren giao dien trinh ky
                    
                    
                    UserConfigDTO ucDto = userConfigBusinessImpl.findBySysUserId(objUser.getSysUserId());
					LOGGER.error("hoangnh - Log 1: Lay size query " + ucDto.getVofficeUser() + ucDto.getVofficePass());
					if(ucDto == null){
						throw new Exception("UNAUTHEN");
					}
					if (ucDto == null) {
						param.setAccountName("vof_test_tp2");
						param.setAccountPass(PassTranformer.encrypt("Asdfgh@123"));// ma hoa password
					} else {
						param.setAccountName(ucDto.getVofficeUser());
						param.setAccountPass(ucDto.getVofficePass());
					}
                    PassTranformer.setInputKey(ca_encrypt_key);// set key to
                    param.setTransCode(String.valueOf(transactionCode));
                    param.setSender(ca_sender); // tên hệ thống trình kí văn
                    // bản. ->
                    // QLDTKTTS
                    param.setRegisterNumber(code); // ma bien ban trinh ky = Ma
                    // BB
                    // ben HCQT
                    param.setDocTitle(code);
                    param.setIsCanVanthuXetduyet(false);// Khong can van thu xet
                    // duyet
//                   param.setHinhthucVanban(signVofficeDAO.getHinhThucVanBanFromAppParam()); // Test
                     param.setHinhthucVanban(520L); //That
                    // Danh sach file
                    // Lay file export pdf (attach hoac export tu man hinh bien
                    // ban
                    // trinh ky)
                    List<FileAttachTranfer> lstFileAttach = conmonDTO.getLstFileAttach();
                    param.setLstFileAttach(lstFileAttach);
                    param.setIsCanBanhanh(true);
                    List<String> listEmail = Lists.newArrayList();

                    // Lay danh sach user ky theo dinh nghia cua Voffice
                    List<Vof2EntityUser> vofficeUserLstParam = new ArrayList<Vof2EntityUser>();

                    List<SignVofficeDTO> signVofficeDTOs = conmonDTO.getListSignVoffice();
                    Long index = 1l;
                    for (SignVofficeDTO signVofficeDTO : signVofficeDTOs) {
                        List<Vof2EntityUser> listUser = service
                                .getListVof2UserByMail(Arrays.asList(signVofficeDTO.getEmail()));
                        for (Vof2EntityUser entityUser2 : listUser) {
                            if (entityUser2.getAdOrgId().equals(signVofficeDTO.getAdOrgId())) {
                                entityUser2.setSignImageIndex(index++);
                                vofficeUserLstParam.add(entityUser2);
                            }
                        }

                        listEmail.add(signVofficeDTO.getEmail());
                    }

                    param.setEmailPublishGroup(listEmail.get(listEmail.size() - 1));
                    // TODO
                    // truyen param danh sach user ky
                    param.setLstUserVof2(vofficeUserLstParam);

                    // goi webservice trinh ky Voffice
                    status = service.vo2RegDigitalDocByEmail(param);

                } catch (Exception e) {
                	LOGGER.error(e.getMessage(), e);
					if(e.getMessage().equals("UNAUTHEN"))
						return "Bạn chưa nhập mật khẩu Voffice";
					else
					return "Lỗi xảy ra trong quá trình trình ký";

                }

                // Sau khi trinh ky xong, update ban ghi vua trinh ky, set
                // status_ca
                // = 1
                LOGGER.error("Hoangnh log status " + status);
                if (status == 1) {
                    /* update bang SIGN_VOFFICE */
                    SignVofficeBO signVofficeBO = new SignVofficeBO();
                    signVofficeBO.setSysUserId(objUser.getVpsUserInfo().getSysUserId());
                    signVofficeBO.setObjectId(conmonDTO.getObjectId());
                    signVofficeBO.setBussTypeId(conmonDTO.getType());
                    signVofficeBO.setStatus("1");
                    signVofficeBO.setCreatedDate(new Date());
                    signVofficeBO.setErrorCode(status.toString());
                    signVofficeBO.setTransCode(transactionCode);
                    Long signId = signVofficeDAO.saveObject(signVofficeBO);
                    /* update bang goc */
                    String tableName = MapTable.get(conmonDTO.getType());
                    String sql = SqlUpdate(tableName, "2");
                    signVofficeDAO.updateStatus("2", conmonDTO);
                    
                    /* update bang SIGN_VOFFICE_DETAIL */
                    LOGGER.error("Hoangnh log size ListSignVoffice " + conmonDTO.getListSignVoffice().size());
					for (SignVofficeDTO dto : conmonDTO.getListSignVoffice()) {
						SignVofficeDetailBO signVofficeDetailBO = new SignVofficeDetailBO();
						if(dto.getOder() != null){
							signVofficeDetailBO.setOdrerType(dto.getOder());
						}
						if(dto.getOderName() != null){
							signVofficeDetailBO.setOrderName(dto.getOderName());
						}
						signVofficeDetailBO.setRoleId(dto.getSysRoleId());
						signVofficeDetailBO.setRoleName(dto.getSysRoleName());
						signVofficeDetailBO.setSignVofficeId(signId);
						signVofficeDetailBO.setSysUserId(dto.getSysUserId());
						signVofficeDetailBO.setObjectId(dto.getObjectId());
						signVofficeDetailBO.setBussTypeId(50L);
						signVofficeDetailDAO.saveObject(signVofficeDetailBO);
						LOGGER.error("Hoangnh Save SignVO " + signId);
					}
                } else if (status == 9l) {
                    err = statusVO.get(status);
                } else {
                    SignVofficeBO signVofficeBO = new SignVofficeBO();

                    signVofficeBO.setSysUserId(conmonDTO.getUserId());
                    signVofficeBO.setObjectId(conmonDTO.getObjectId());
                    signVofficeBO.setBussTypeId(conmonDTO.getType());
                    signVofficeBO.setStatus("0");
                    signVofficeBO.setErrorCode(status.toString());
                    signVofficeBO.setTransCode(transactionCode);
                    Long signId = signVofficeDAO.saveObject(signVofficeBO);

                    if (!StringUtils.isNotEmpty(err)) {
                        err = "Các bản ghi trình ký thất bại: " + conmonDTO.getObjectCode() + "lỗi -"
                                + statusVO.get(status);
                    } else {
                        err = err + "; " + conmonDTO.getObjectCode() + "lỗi -" + statusVO.get(status);
                    }

                }

            } else {
                if (!StringUtils.isNotEmpty(err)) {
                    err = "Bạn không có quyền trình ký văn bản có mã :" + conmonDTO.getObjectCode();
                } else {
                    err = err + ";" + conmonDTO.getObjectCode();
                }

            }

        }

        return err;
    }

    private String SqlUpdate(String tableName, String signState) {
        String sql = "UPDATE " + "\"" + tableName + "\"" + " SET SIGN_STATE=" + signState + " WHERE " + tableName
                + "_ID =:id";

        return sql;
    }

    public static final Map<String, String> MapTable = new HashMap<String, String>();

    static {
        MapTable.put("10", "YEAR_PLAN");
        MapTable.put("11", "TOTAL_MONTH_PLAN");
        MapTable.put("12", "DETAIL_MONTH_PLAN");
        MapTable.put("50", "GOODS_PLAN");
    }

    private String createSQL(String tableName, String type) {
        StringBuilder sql = new StringBuilder();
        sql.append(" SELECT OD.").append(tableName).append("_ID objectId,");
        sql.append("OD.CODE objectCode," + "OD.CREATED_USER_ID createdBy," + "OD.SIGN_STATE signState ");
        sql.append(" FROM ");
        sql.append("\"" + tableName + "\" OD ");
        sql.append(" WHERE  OD.").append(tableName).append("_ID in :listId ");
        sql.append(" ORDER BY OD.").append(tableName).append("_ID DESC");

        return sql.toString();
    }

    /**
     * @param listId
     * @param type
     * @param reportName
     * @return
     * @throws Exception
     */
    public List<CommonDTO> getdataSign(List<Long> listId, String type, String reportName)
            throws IllegalArgumentException {
        List<CommonDTO> listReturn = Lists.newArrayList();
        String tableName = MapTable.get(type);
        String sql = createSQL(tableName, type);
        List<SignVofficeDTO> ls = signVofficeDAO.getDataSign(sql, listId, type);
        String err = "";
        CommonDTO ab = new CommonDTO();
        for (Iterator<SignVofficeDTO> interator = ls.iterator(); interator.hasNext(); ) {
            SignVofficeDTO wi = interator.next();

            if (ab.getObjectId() == null) {
                ab = new CommonDTO();
                ab.setObjectId(wi.getObjectId());
                ab.setObjectCode(wi.getObjectCode());
                ab.setReportName(reportName);
                ab.setType(type);
                ab.setTotalPrice(wi.getTotalPrice());
                ab.setCreatedBy(wi.getCreatedBy());
                if (!("1".equals(wi.getSignState()) || "4".equals(wi.getSignState()))) {
                    err = StringUtils.isNotEmpty(err) ? (err + "; " + wi.getObjectCode())
                            : ("Bản ghi có mã: " + wi.getObjectCode());
                }
                listReturn.add(ab);

            }
            if (ab.getObjectId().compareTo(wi.getObjectId()) != 0) {
                ab = new CommonDTO();
                ab.setObjectId(wi.getObjectId());
                ab.setObjectCode(wi.getObjectCode());
                ab.setReportName(reportName);
                ab.setType(type);
                ab.setTotalPrice(wi.getTotalPrice());
                ab.setCreatedBy(wi.getCreatedBy());
                if (!("1".equals(wi.getSignState()) || "4".equals(wi.getSignState()))) {
                    err = StringUtils.isNotEmpty(err) ? (err + "; " + wi.getObjectCode())
                            : ("Bản ghi có mã: " + wi.getObjectCode());
                }
                listReturn.add(ab);
            }
            if (ab.getObjectId().compareTo(wi.getObjectId()) == 0) {
                ab.getListSignVoffice().add(wi);
            }
        }

        if (StringUtils.isNotEmpty(err)) {
            throw new IllegalArgumentException(err + " không đúng trạng thái ký!");
        }

        return listReturn;

    }

    /**
     * @param lstEmail
     * @return
     */
    public List<VofficeUserDTO> getRoleByEmail(List<String> lstEmail) {
        Vo2AutoSignSystemImplService sv;
        List<VofficeUserDTO> vofficeUserDTOs = Lists.newArrayList();
        try {
            sv = new Vo2AutoSignSystemImplService(new URL(ca_wsUrl));
            Vo2AutoSignSystemImpl service = sv.getVo2AutoSignSystemImplPort();
            List<Vof2EntityUser> entityUsers = service.getListVof2UserByMail(lstEmail);
            for (Vof2EntityUser entityUser : entityUsers) {
                VofficeUserDTO vofficeUserDTO = new VofficeUserDTO();
                vofficeUserDTO.setAdOrgId(entityUser.getAdOrgId());
                vofficeUserDTO.setAdOrgName(entityUser.getAdOrgName());
                vofficeUserDTO.setSysOrgId(entityUser.getSysOrgId());
                vofficeUserDTO.setSysOrgName(entityUser.getSysOrgName());
                vofficeUserDTO.setSysRoleId(entityUser.getSysRoleId());
                vofficeUserDTO.setSysRoleName(entityUser.getJobTile() + "_" + entityUser.getAdOrgName());
                vofficeUserDTO.setStrEmail(entityUser.getStrEmail());
                vofficeUserDTOs.add(vofficeUserDTO);
            }
            return vofficeUserDTOs;
        } catch (MalformedURLException e) {
            return Lists.newArrayList();
        }

    }

    @Transactional
    public void updateStatus(SignVofficeDTO dto, String statusVo) throws Exception {
        String tableName = MapTable.get(dto.getBussTypeId());
        String sql = null;
        CommonDTO commonDTO = new CommonDTO();
        commonDTO.setObjectId(dto.getObjectId());
        commonDTO.setType(dto.getBussTypeId());
        if ("3".equals(statusVo)) {
            signVofficeDAO.updateStatus("3", commonDTO);
        } else {
            signVofficeDAO.updateStatus("4", commonDTO);
        }

    }

    public SignVofficeDTO getByTransCode(String transCode) {
        return signVofficeDAO.getByTransCode(transCode);
    }

    @Transactional
    public void updateOderChange(Long id) throws Exception {

    }

    private final static String Config_Code_One = "{VALUE}{STOCK}_{ORG}/{YY}/";
    private final static String Config_Code_Two = "{VALUE}_{STOCK}/{YY}/";

    private String genCode(CommonDTO obj) {
        String code = null;
        return code;
    }

    private model getTable(String value) {

        switch (value) {
            case "YCNK": {
                model obj = new model();
                obj.setTableName("WMS_OWNER_KTTS.\"ORDER\"");
                obj.setValue(Config_Code_One);
                return obj;
            }
            case "YCXK": {
                model obj = new model();
                obj.setTableName("WMS_OWNER_KTTS.\"ORDER\"");
                obj.setValue(Config_Code_One);
                return obj;
            }
            case "PNK_": {
                model obj = new model();
                obj.setTableName("WMS_OWNER_KTTS.\"STOCK_TRANS\"");
                obj.setValue(Config_Code_Two);
                return obj;
            }
            case "PXK_": {
                model obj = new model();
                obj.setTableName("WMS_OWNER_KTTS.\"STOCK_TRANS\"");
                obj.setValue(Config_Code_Two);
                return obj;
            }
            case "YCTD": {
                model obj = new model();
                obj.setTableName("WMS_OWNER_KTTS.\"ORDER_CHANGE_GOODS\"");
                obj.setValue(Config_Code_Two);
                return obj;
            }
            default:
                return null;
        }

    }

    public class model {
        private String value;

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getTableName() {
            return tableName;
        }

        public void setTableName(String tableName) {
            this.tableName = tableName;
        }

        private String tableName;
    }

    public SignVofficeDTO getByObjIdAndType(Long objectId, String type) {
        // TODO Auto-generated method stub
        return signVofficeDAO.getByObjIdAndType(objectId, type);
    }

    public FileAttachTranferList viewSignedDoc(SignVofficeDTO docSign) throws MalformedURLException {
        // TODO Auto-generated method stub
        Vo2AutoSignSystemImplService sv = new Vo2AutoSignSystemImplService(new URL(ca_wsUrl));
        Vo2AutoSignSystemImpl service = sv.getVo2AutoSignSystemImplPort();
        return service.getFile(ca_appCode, docSign.getTransCode(), true);
    }
}
