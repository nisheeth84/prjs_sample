/**
 *
 */
package com.viettel.erp.rest;

import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.ktts2.common.UFile;
import com.viettel.ktts2.common.UString;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import javax.activation.DataHandler;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.*;
import java.util.*;

/**
 * @author Huy
 */
public class FileServiceImpl implements IFileService {

    @Value("${folder_upload2}")
    private String folderUpload;

    @Value("${folder_upload}")
    private String folderTemp;

    @Value("${default_sub_folder_upload}")
    private String defaultSubFolderUpload;
    @Value("${input_sub_folder_upload}")
    private String input_sub_folder_upload;
    @Value("${temp_sub_folder_upload}")
    private String tempFileFolderUpload;

    @Value("${allow.file.ext}")
    private String allowFileExt;
    @Value("${allow.folder.dir}")
    private String allowFolderDir;

    static Logger LOGGER = LoggerFactory.getLogger(FileServiceImpl.class);

    @Override
    public Response uploadATTT(List<Attachment> attachments, HttpServletRequest request) {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));

        String filePathReturn;
        Map<String, List> returnMap = new HashMap();
        List<String> listFilePathReturn = new ArrayList<String>();
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if(folderParam.equalsIgnoreCase(input_sub_folder_upload)){
                folderParam = input_sub_folder_upload;
            } else if (folderParam.equalsIgnoreCase(tempFileFolderUpload)){
                folderParam = tempFileFolderUpload;
            }
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

        for (Attachment attachment : attachments) {
            DataHandler dataHandler = attachment.getDataHandler();

            // get filename to be uploadedR
            MultivaluedMap<String, String> multivaluedMap = attachment.getHeaders();
            String fileName = UFile.getFileName(multivaluedMap);

            if (!isExtendAllowSave(fileName)) {
                throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
            }
            // write & upload file to server
            try (InputStream inputStream = dataHandler.getInputStream();) {
                String filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
                filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
                listFilePathReturn.add(filePathReturn);
            } catch (Exception ex) {
                throw new BusinessException("Loi khi save file", ex);
            }
        }
        returnMap.put("data", listFilePathReturn);
        return Response.ok(listFilePathReturn).build();
    }

    //chinhpxn 20180608 start
    @Override
    public Response exportExcelError(ExcelErrorDTO errorContainer) {

        try {
            String filePath = UEncrypt.decryptFileUploadPath(errorContainer.getFilePathError());
            InputStream file = new BufferedInputStream(new FileInputStream(filePath));
            File f = new File(filePath);
            String fileName = f.getName();
            XSSFWorkbook workbook = new XSSFWorkbook(file);
            XSSFSheet sheet = workbook.getSheetAt(0);

            for (int i = 0; i < errorContainer.getErrorList().size(); i++) {
                XSSFRow row = sheet.getRow(Integer.parseInt(((ExcelErrorDTO) errorContainer.getErrorList().get(i)).getLineError()) - 1);
                if (row == null) {
                    row = sheet.createRow(Integer.parseInt(((ExcelErrorDTO) errorContainer.getErrorList().get(i)).getLineError()) - 1);
                }
                XSSFCell cell = row.getCell(errorContainer.getMessageColumn());

                if (cell == null) {
                    cell = row.createCell(errorContainer.getMessageColumn());
                }
                if (!cell.getStringCellValue().isEmpty()) {
                    cell.setCellValue(cell.getStringCellValue() + "," + ((ExcelErrorDTO) errorContainer.getErrorList().get(i)).getDetailError());
                } else {
                    cell.setCellValue(((ExcelErrorDTO) errorContainer.getErrorList().get(i)).getDetailError());
                }
            }
            file.close();
            String dowloadPath = UFile.getFilePath(folderTemp, defaultSubFolderUpload) + File.separatorChar;
            File out = new File(dowloadPath + "Error" + fileName);

            FileOutputStream outFile = new FileOutputStream(out);
            workbook.write(outFile);
            workbook.close();
            outFile.close();

            String path = UEncrypt.encryptFileUploadPath(dowloadPath.replace(folderTemp + File.separatorChar, "") + "Error" + fileName);


            String strReturn = path;
            return Response.ok(Collections.singletonMap("fileName", strReturn)).build();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    //chinhpxn 20180608 end

    @Override
    public Response uploadATTT2(MultipartFile multipartFile, HttpServletRequest request) {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));

        String filePathReturn;
        Map<String, List> returnMap = new HashMap();
        List<String> listFilePathReturn = new ArrayList<String>();
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

//		for (Attachment attachment : fileUpload) {
//			DataHandler dataHandler = attachment.getDataHandler();
//
//			// get filename to be uploadedR
//			MultivaluedMap<String, String> multivaluedMap = attachment.getHeaders();
//			String fileName = UFile.getFileName(multivaluedMap);
//
//			if (!isExtendAllowSave(fileName)) {
//				throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
//			}
//			// write & upload file to server
//			try (InputStream inputStream = dataHandler.getInputStream();) {
//				String filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
//				filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
//				listFilePathReturn.add(filePathReturn);
//			} catch (Exception ex) {
//				throw new BusinessException("Loi khi save file", ex);
//			}
//		}
        returnMap.put("data", listFilePathReturn);
        return Response.ok(listFilePathReturn).build();
    }

    @Override
    public Response uploadTemp(List<Attachment> attachments, HttpServletRequest request) {
        String folderParam = request.getParameter("folder");
        String filePathReturn;
        Map<String, List> returnMap = new HashMap();
        List<String> listFilePathReturn = new ArrayList<String>();
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = defaultSubFolderUpload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

        for (Attachment attachment : attachments) {
            DataHandler dataHandler = attachment.getDataHandler();
            try (InputStream inputStream = dataHandler.getInputStream();) {
                // get filename to be uploaded
                MultivaluedMap<String, String> multivaluedMap = attachment.getHeaders();
                String fileName = UFile.getFileName(multivaluedMap);

                if (!isExtendAllowSave(fileName)) {
                    throw new BusinessException(
                            "File extension khong nam trong list duoc up load, file_name:" + fileName);
                }
                // write & upload file to server
                String filePath = UFile.writeToFileServerATTT(inputStream, fileName, folderParam, folderTemp);
                filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
                listFilePathReturn.add(filePathReturn);
            } catch (Exception ex) {
                throw new BusinessException("Loi khi save file", ex);
            }
        }
        returnMap.put("data", listFilePathReturn);
        return Response.ok(listFilePathReturn).build();
    }

    @Override
    public Response downloadFileATTT(HttpServletRequest request) throws Exception {
        String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
        File file = new File(folderTemp + File.separatorChar + fileName);
        if (!file.exists()) {
            file = new File(folderUpload + File.separatorChar + fileName);
            if (!file.exists()) {
                LOGGER.warn("File {} is not found", fileName);
                return Response.status(Response.Status.BAD_REQUEST).build();
            }

        }
        int lastIndex = fileName.lastIndexOf(File.separatorChar);
        String fileNameReturn = fileName.substring(lastIndex + 1);

        return Response.ok((Object) file)
                .header("Content-Disposition", "attachment; filename=\"" + fileNameReturn + "\"").build();
    }

    @Override
    public Response downloadFileImport(HttpServletRequest request) throws Exception {
        String fileName = UEncrypt.decryptFileUploadPath(request.getQueryString());
        if (StringUtils.isEmpty(fileName)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        File file;
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        String filePath = classloader.getResource("../").getPath();
        file = new File(filePath + "/doc-template" + File.separatorChar + fileName);

        if (!file.exists()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        return Response.ok((Object) file)
                .header("Content-Disposition", "attachment; filename=\"" + FilenameUtils.getName(fileName) + "\"")
                .build();
    }

    private boolean isFolderAllowFolderSave(String folderDir) {
        return UString.isFolderAllowFolderSave(folderDir, allowFolderDir);

    }

    private boolean isExtendAllowSave(String fileName) {
        return UString.isExtendAllowSave(fileName, allowFileExt);
    }


    @Override
    public Response uploadATTTInput(List<Attachment> attachments,
                                    HttpServletRequest request) {
        String folderParam = UString.getSafeFileName(request.getParameter("folder"));

        String filePathReturn;
        Map<String, List> returnMap = new HashMap();
        List<String> listFilePathReturn = new ArrayList<String>();
        if (UString.isNullOrWhitespace(folderParam)) {
            folderParam = input_sub_folder_upload;
        } else {
            if (!isFolderAllowFolderSave(folderParam)) {
                throw new BusinessException("folder khong nam trong white list: folderParam=" + folderParam);
            }
        }

        for (Attachment attachment : attachments) {
            DataHandler dataHandler = attachment.getDataHandler();

            // get filename to be uploadedR
            MultivaluedMap<String, String> multivaluedMap = attachment.getHeaders();
            String fileName = UFile.getFileName(multivaluedMap);

            if (!isExtendAllowSave(fileName)) {
                throw new BusinessException("File extension khong nam trong list duoc up load, file_name:" + fileName);
            }
            // write & upload file to server
            try (InputStream inputStream = dataHandler.getInputStream();) {
                String filePath = UFile.writeToFileServerATTT2(inputStream, fileName, folderParam, folderUpload);
                filePathReturn = UEncrypt.encryptFileUploadPath(filePath);
                listFilePathReturn.add(filePathReturn);
            } catch (Exception ex) {
                throw new BusinessException("Loi khi save file", ex);
            }
        }
        returnMap.put("data", listFilePathReturn);
        return Response.ok(listFilePathReturn).build();
    }


}
