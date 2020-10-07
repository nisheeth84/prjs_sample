package com.viettel.aio.business;

import com.viettel.aio.bo.AIOQuestionBO;
import com.viettel.aio.dao.AIOQuestionDAO;
import com.viettel.aio.dto.AIOQuestionDTO;
import com.viettel.coms.dto.ExcelErrorDTO;
import com.viettel.ktts2.common.UEncrypt;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service("aioQuestionBussiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOQuestionBussinessImpl extends BaseFWBusinessImpl<AIOQuestionDAO, AIOQuestionDTO, AIOQuestionBO> implements AIOQuestionBussiness {

    @Autowired
    private AIOQuestionDAO aioQuestionDAO;

    protected final Logger log = Logger.getLogger(AIOQuestionBussinessImpl.class);

    private HashMap<Integer, String> colAlias = new HashMap<>();

    {
        colAlias.put(0, "A");
        colAlias.put(1, "B");
        colAlias.put(2, "C");
        colAlias.put(3, "D");
    }

    private HashMap<Integer, String> colName = new HashMap<>();

    {
        colName.put(0, "STT");
        colName.put(1, "Loại câu hỏi");
        colName.put(2, "Nội dung câu hỏi");
        colName.put(3, "Đáp án 1");
        colName.put(4, "Đáp án 2");
        colName.put(5, "Đáp án 3");
        colName.put(6, "Đáp án 4");
        colName.put(7, "Đáp án 5");
    }

    @Autowired
    public AIOQuestionBussinessImpl(AIOQuestionDAO aioQuestionDAO) {
        this.settDAO(aioQuestionDAO);
        this.settModel(new AIOQuestionBO());
    }

    @Override
    public List<AIOQuestionDTO> doSearch(AIOQuestionDTO obj) {
        return aioQuestionDAO.doSearch(obj);
    }

    @Override
    public void remove(Long questionId, Long userId) {
        aioQuestionDAO.updateStatus(questionId, AIOQuestionDTO.STATUS_DELETED, userId);
    }

    @Override
    public List<AIOQuestionDTO> doImportExcel(String filePath) {

        List<AIOQuestionDTO> dtoList = new ArrayList<>();
        List<ExcelErrorDTO> errorList = new ArrayList<>();

        try {
            File f = new File(filePath);
            XSSFWorkbook workbook = new XSSFWorkbook(f);
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            int rowCount = 0;

            for (Row row : sheet) {
                rowCount++;
                // data start from row 2
                if (rowCount < 2) {
                    continue;
                }

                AIOQuestionDTO dtoValidated = new AIOQuestionDTO();

                String type = formatter.formatCellValue(row.getCell(1)).trim();
                String questionContent = formatter.formatCellValue(row.getCell(2)).trim();
                String answer1 = formatter.formatCellValue(row.getCell(3)).trim();
                String answer2 = formatter.formatCellValue(row.getCell(4)).trim();
                String answer3 = formatter.formatCellValue(row.getCell(5)).trim();
                String answer4 = formatter.formatCellValue(row.getCell(6)).trim();
                String answer5 = formatter.formatCellValue(row.getCell(6)).trim();

                // type - required
                int errorCol = 1;
                if (StringUtils.isNotEmpty(type)) {
                    boolean isInput = AIOQuestionDTO.TYPE_INPUT_NAME.toUpperCase().equals(type.toUpperCase().trim());
                    boolean isSelect = AIOQuestionDTO.TYPE_SELECT_NAME.toUpperCase().equals(type.toUpperCase().trim());
                    if (!isInput && !isSelect) {
                        errorList.add(this.createError(rowCount, errorCol, "không tồn tại loại câu hỏi " + type));
                    } else {
                        if (isInput)
                            dtoValidated.setType(AIOQuestionDTO.TYPE_INPUT);

                        if (isSelect)
                            dtoValidated.setType(AIOQuestionDTO.TYPE_SELECT);
                    }
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // questionContent - required
                errorCol++;
                if (StringUtils.isNotEmpty(questionContent)) {
                    dtoValidated.setQuestionContent(questionContent);
                } else {
                    errorList.add(this.createError(rowCount, errorCol, "không được bỏ trống"));
                }

                // answer 1
                errorCol++;
                if (StringUtils.isNotEmpty(answer1)) {
                    if (AIOQuestionDTO.TYPE_INPUT.equals(dtoValidated.getType())) {
                        errorList.add(this.createError(rowCount, errorCol, "loại câu hỏi này ko cần đáp án"));
                    } else {
                        dtoValidated.setAnswer1(answer1);
                    }
                }

                // answer 2
                errorCol++;
                if (StringUtils.isNotEmpty(answer2)) {
                    if (AIOQuestionDTO.TYPE_INPUT.equals(dtoValidated.getType())) {
                        errorList.add(this.createError(rowCount, errorCol, "loại câu hỏi này ko cần đáp án"));
                    } else {
                        dtoValidated.setAnswer2(answer2);
                    }
                }

                // answer 3
                errorCol++;
                if (StringUtils.isNotEmpty(answer3)) {
                    if (AIOQuestionDTO.TYPE_INPUT.equals(dtoValidated.getType())) {
                        errorList.add(this.createError(rowCount, errorCol, "loại câu hỏi này ko cần đáp án"));
                    } else {
                        dtoValidated.setAnswer3(answer3);
                    }
                }

                // answer 4
                errorCol++;
                if (StringUtils.isNotEmpty(answer4)) {
                    if (AIOQuestionDTO.TYPE_INPUT.equals(dtoValidated.getType())) {
                        errorList.add(this.createError(rowCount, errorCol, "loại câu hỏi này ko cần đáp án"));
                    } else {
                        dtoValidated.setAnswer4(answer4);
                    }
                }

                // answer 5
                errorCol++;
                if (StringUtils.isNotEmpty(answer5)) {
                    if (AIOQuestionDTO.TYPE_INPUT.equals(dtoValidated.getType())) {
                        errorList.add(this.createError(rowCount, errorCol, "loại câu hỏi này ko cần đáp án"));
                    } else {
                        dtoValidated.setAnswer5(answer5);
                    }
                }

                if (AIOQuestionDTO.TYPE_SELECT.equals(dtoValidated.getType())
                        && StringUtils.isEmpty(answer1) && StringUtils.isEmpty(answer2)
                        && StringUtils.isEmpty(answer3) && StringUtils.isEmpty(answer4)
                        && StringUtils.isEmpty(answer5)) {
                    errorList.add(this.createError(rowCount, 3, "loại câu hỏi này cần có ít nhật 1 đáp án"));
                }

                if (errorList.size() == 0) {
                    dtoValidated.setStatus(AIOQuestionDTO.STATUS_ACTICE);
                    dtoList.add(dtoValidated);
                }
            }

            if (errorList.size() > 0) {
                String filePathError = UEncrypt.encryptFileUploadPath(filePath);
                this.doWriteError(errorList, dtoList, filePathError, 8);
            }
            workbook.close();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            ExcelErrorDTO errorDTO = createError(0, 0, e.toString());
            errorList.add(errorDTO);
            String filePathError = null;

            try {
                filePathError = UEncrypt.encryptFileUploadPath(filePath);
            } catch (Exception ex) {
                log.error(e.getMessage(), e);
                errorDTO = createError(0, 0, ex.toString());
                errorList.add(errorDTO);
            }
            this.doWriteError(errorList, dtoList, filePathError, 8);
        }

        return dtoList;

    }

    private ExcelErrorDTO createError(int row, int columnIndex, String detail) {
        ExcelErrorDTO err = new ExcelErrorDTO();
        err.setColumnError(colAlias.get(columnIndex));
        err.setLineError(String.valueOf(row));
        err.setDetailError(colName.get(columnIndex) + " " + detail);
        return err;
    }

    private void doWriteError(List<ExcelErrorDTO> errorList, List<AIOQuestionDTO> dtoList, String filePathError, int errColumn) {
        dtoList.clear();
        AIOQuestionDTO errorContainer = new AIOQuestionDTO();
        errorContainer.setErrorList(errorList);
        errorContainer.setMessageColumn(errColumn); // cột dùng để in ra lỗi
        errorContainer.setFilePathError(filePathError);
        dtoList.add(errorContainer);
    }
}
