package com.viettel.wms.business;

import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.dto.KttsUserSession;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.wms.bo.AppParamBO;
import com.viettel.wms.dao.AppParamDAO;
import com.viettel.wms.dto.AppParamDTO;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;

@Service("appParamBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AppParamBusinessImpl extends BaseFWBusinessImpl<AppParamDAO, AppParamDTO, AppParamBO>
        implements AppParamBusiness {
    @Value("${folder_upload}")
    private String folder2Upload;
    @Value("${folder_upload2}")
    private String folderUpload;
    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;

    @Autowired
    private AppParamDAO appParamDAO;


    public AppParamBusinessImpl() {
        tModel = new AppParamBO();
        tDAO = appParamDAO;
    }

    @Override
    public AppParamDAO gettDAO() {
        return appParamDAO;
    }

    @Override
    public long getTotal() {
        return appParamDAO.count("AdClientBO", null);
    }

    public DataListDTO doSearch(AppParamDTO obj) {
        List<AppParamDTO> ls = appParamDAO.doSearch(obj);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setTotal(obj.getTotalRecord());
        data.setSize(obj.getPageSize());
        data.setStart(1);
        return data;
    }

    public Boolean checkCode(String code, String parType, Long appParamId) {
        AppParamDTO obj = appParamDAO.getbycodeAndParType(code, parType);

        if (appParamId == null) {
            if (obj == null) {
                return true;
            } else {
                return false;
            }
        } else {
            if (obj == null) {
                return true;
            } else if (obj != null && obj.getAppParamId().longValue() == appParamId) {
                return true;
            } else {
                return false;
            }
        }

    }


    public Long updateAppParam(AppParamDTO obj, KttsUserSession objUser) throws Exception {
        if (objUser.getSysUserId() != null) {
            if (!objUser.getSysUserId().equals(obj.getCreatedBy())) {
                throw new IllegalArgumentException("Người dùng hiện tại không có quyền sửa bản ghi này !");
            }
        }


        boolean check = checkCode(obj.getCode(), obj.getParType(), obj.getAppParamId());
        if (!check) {
            throw new IllegalArgumentException("Mã tham số và loại tham số đã đồng thời tồn tại !");
        }
        return appParamDAO.updateObject(obj.toModel());
    }

    public Long createAppParam(AppParamDTO obj) throws Exception {


        boolean check = checkCode(obj.getCode(), obj.getParType(), null);
        if (!check) {
            throw new IllegalArgumentException("Mã tham số và loại tham số đã đồng thời tồn tại !");
        }
        return appParamDAO.saveObject(obj.toModel());
    }

    public Long deleteAppParam(AppParamDTO obj, KttsUserSession objUser) {
        if (!objUser.getSysUserId().equals(obj.getCreatedBy())) {
            throw new IllegalArgumentException("Người dùng hiện tại không có quyền sửa bản ghi này !");
        }

        return appParamDAO.updateObject(obj.toModel());
    }


    public DataListDTO getAll(AppParamDTO obj) {
        String status = obj.getStatus();
        List<AppParamDTO> ls = appParamDAO.getAll(status);
        DataListDTO data = new DataListDTO();
        data.setData(ls);
        data.setStart(1);
        return data;
    }

    public List<AppParamDTO> getForAutoComplete(AppParamDTO obj) {
        return appParamDAO.getForAutoComplete(obj);
    }

    public List<AppParamDTO> getForComboBox(AppParamDTO obj) {
        return appParamDAO.getForComboBox(obj);
    }

    public List<AppParamDTO> getForComboBox1(AppParamDTO obj) {
        return appParamDAO.getForComboBox1(obj);
    }


    @Override
    public List<AppParamDTO> getFileDrop() {
        //Hieunn
        //get list filedrop form APP_PARAM with PAR_TYPE = 'SHIPMENT_DOCUMENT_TYPE' and Status=1
        return appParamDAO.getFileDrop();
    }

    //Khong thay AppParamRsServiceIml goi den
    public String getCode(String tableName, String param) {
        return appParamDAO.getCode(tableName, param);
    }


    public String exportExcelTemplate(String fileName) throws Exception {
        // TODO Auto-generated method stub


        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName + ".xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        //chinhpxn_20180613_start
        String pathF = UFile.getFilePath(folderUpload, defaultSubFolderUpload) + File.separatorChar + fileName + ".xlsx";
        File out = new File(pathF);
//		File out = new File(folder2Upload + File.separatorChar +fileName +".xlsx");
        //chinhpxn_20180613
        FileOutputStream outFile = new FileOutputStream(out);
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(pathF);
        return path;
    }

    //	hungnx 140618 start
    public String exportExcelTemplate2(String fileName) throws Exception {
        // TODO Auto-generated method stub

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../" + "doc-template").getPath();
        InputStream file = new BufferedInputStream(new FileInputStream(filePath + fileName + ".xlsx"));
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        file.close();
        String pathF = UFile.getFilePath(folderUpload, defaultSubFolderUpload) + File.separatorChar + fileName + ".xlsx";
        File out = new File(pathF);
        FileOutputStream outFile = new FileOutputStream(out);
        workbook.write(outFile);
        workbook.close();
        outFile.close();
        String path = UEncrypt.encryptFileUploadPath(pathF.replace(folderUpload, ""));
        return path;
    }
//	hungnx 140618 end
}
