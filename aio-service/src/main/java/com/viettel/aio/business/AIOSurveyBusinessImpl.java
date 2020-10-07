package com.viettel.aio.business;

import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.aio.dao.AIOCustomerDAO;
import com.viettel.aio.dao.AIOQuestionDAO;
import com.viettel.aio.dao.AIOSurveyCustomerDAO;
import com.viettel.aio.dao.AIOSurveyDAO;
import com.viettel.aio.dto.*;

import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service("aioSurveyBusiness")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOSurveyBusinessImpl extends BaseFWBusinessImpl<AIOSurveyDAO, AIOSurveyDTO, AIOSurveyBO> implements AIOSurveyBusiness {
    @Autowired
    AIOSurveyDAO aioSurveyDAO;

    @Autowired
    AIOCustomerDAO aioCustomerDAO;

    @Autowired
    AIOQuestionDAO aioQuestionDAO;

    @Autowired
    AIOSurveyCustomerDAO surveyCustomerDAO;

    @Autowired
    AIOContractManagerBusinessImpl aioContractManagerBusiness;

    @Autowired
    private CommonServiceAio commonService;

    @Autowired
    public AIOSurveyBusinessImpl(AIOSurveyDAO aioSurveyDAO) {
        tDAO = aioSurveyDAO;
        tModel = new AIOSurveyBO();
    }

    private static final String ATTACHMENT_TYPE = "103";
    private static final String IMG_PLACEHOLDER = "__attachment_id_{0}__";
    private static final String BASE64_PREFFIX = "data:image/jpeg;base64,";

    @Override
    public DataListDTO doSearch(AIOSurveyDTO obj, Long sysUserId) {
        List<AIOSurveyDTO> dtos = aioSurveyDAO.doSearch(obj);

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date today = cal.getTime();
        List<Long> surveyIds = dtos.stream().map(i -> i.getSurveyId()).collect(Collectors.toList());
        if (!surveyIds.isEmpty()) {
            List<AIOSurveyCustomerDTO> customerDtos = aioSurveyDAO.getPerformers(surveyIds);
            for (AIOSurveyDTO dto : dtos) {
                if (dto.getStartDate().before(today)) {
                    dto.setEditable(false);
                    continue;
                }
                if (AIOSurveyDTO.STATUS_INACTIVE.equals(dto.getStatus())) {
                    dto.setEditable(false);
                    continue;
                }
                List<AIOSurveyCustomerDTO> customerDtosOfItem = customerDtos.stream()
                        .filter(i -> dto.getSurveyId().equals(i.getSurveyId()))
                        .collect(Collectors.toList());
                List<Long> performerIds = customerDtos.stream()
                        .filter(i -> dto.getSurveyId().equals(i.getSurveyId()))
                        .map(i -> i.getPerformerId())
                        .distinct()
                        .collect(Collectors.toList());
                if (!performerIds.contains(sysUserId) && !sysUserId.equals(dto.getCreatedUser())) {
                    dto.setEditable(false);
                    continue;
                }

                List<AIOSurveyCustomerDTO> performers = new ArrayList<>();
                for(AIOSurveyCustomerDTO sc : customerDtosOfItem) {
                    Optional<AIOSurveyCustomerDTO> ckSc = performers.stream().filter(
                            p -> p.getPerformerId().equals(sc.getPerformerId())
                    ).findFirst();
                    if (ckSc.isPresent()) continue;
                    performers.add(sc);
                }

                dto.setSurveyCustomers(performers);
                dto.setEditable(true);
            }
        }
        DataListDTO dataListDTO = new DataListDTO();
        dataListDTO.setData(dtos);
        dataListDTO.setTotal(obj.getTotalRecord());
        dataListDTO.setSize(obj.getPageSize());
        dataListDTO.setStart(1);
        return dataListDTO;
    }

    @Override
    public Long doDelete(AIOSurveyDTO obj) {
        Long res = aioSurveyDAO.doDelete(obj);
        return res;
    }

    @Override
    public List<AIOQuestionDTO> getQuestions(Long surveyId) {
        return aioSurveyDAO.getQuestions(surveyId);
    }

    @Override
    public List<AIOSurveyCustomerDTO> getPerformers(Long surveyId) {
        return aioSurveyDAO.getPerformers(Collections.singletonList(surveyId));
    }

    @Override
    public void removeQuestions(Long surveyId) {
        aioSurveyDAO.removeQuestions(surveyId);
    }

    @Override
    public void removeSurveyCustomer(Long surveyId) {
        aioSurveyDAO.removeSurveyCustomer(surveyId);
    }

    @Override
    public AIOSurveyDTO checkPerformers(InputStream is) throws Exception {
        List<String> employeeCodes = new ArrayList<>();
        List<String> validList = new ArrayList<>();
        List<String> invalidList = new ArrayList<>();
        List<AIOSurveyCustomerDTO> surveyCustomers = new ArrayList<>();

        XSSFWorkbook workbook = new XSSFWorkbook(is);
        XSSFSheet sheet = workbook.getSheetAt(0);
        DataFormatter formatter = new DataFormatter();
        int rowCount = 0;

        for (Row row : sheet) {
            rowCount++;
            // data start from row 2
            if (rowCount < 2) {
                continue;
            }

            String employeeCode = formatter.formatCellValue(row.getCell(0)).trim();

            if (StringUtils.isNotEmpty(employeeCode)) {
                employeeCodes.add(employeeCode);
            }
        }

        workbook.close();
        if (!employeeCodes.isEmpty()) {
            surveyCustomers = aioSurveyDAO.getNewPerformersByCodes(employeeCodes);
            validList = surveyCustomers.stream()
                    .map(u -> u.getPerformerCode())
                    .collect(Collectors.toList());
            List<String> temp = validList;
            invalidList = employeeCodes.stream()
                    .filter(c -> !temp.contains(c))
                    .collect(Collectors.toList());
        }
        AIOSurveyDTO ret = new AIOSurveyDTO();
        ret.setEmployeeCodes(validList);
        ret.setInvalidCodes(invalidList);
        ret.setSurveyCustomers(surveyCustomers);
        return ret;
    }

    @Override
    public List<AIOSurveyDTO> getAioSurveyCustomer(Long performerId){
        return aioSurveyDAO.getAioSurvey(performerId);
    }
    @Override
    public QuestionForCustomerDTO getQuestionForCustomer(Long performerId, Long surveyId){
        List<AIOQuestionDTO> aioQuestionDTOS=aioQuestionDAO.getQuestion(surveyId);
        List<AIOCustomerDTO> aioCustomerDTOS=aioCustomerDAO.getListCustomer(performerId);

        for (AIOQuestionDTO question : aioQuestionDTOS) {
            List<UtilAttachDocumentDTO> images = commonService.getListImagesByIdAndType(Collections.singletonList(question.getQuestionId()), ATTACHMENT_TYPE);
            String html = question.getQuestionContent();
            for (UtilAttachDocumentDTO img : images) {
                String placeHolderId = StringUtils.replace(IMG_PLACEHOLDER, "{0}", img.getUtilAttachDocumentId().toString());
                html = StringUtils.replaceAll(html, placeHolderId, BASE64_PREFFIX + img.getBase64String());
            }

            question.setQuestionContent(html);
        }

        QuestionForCustomerDTO questionForCustomerDTO=new QuestionForCustomerDTO();

        questionForCustomerDTO.setAioCustomers(aioCustomerDTOS);
        questionForCustomerDTO.setAioQuestions(aioQuestionDTOS);

        return questionForCustomerDTO;
    }

    @Transactional
    @Override
    public void updateQuestionForCustomer(Long sysGroupId, Long performerId, Long surveyId,Long surveyCustomerId, AIOCustomerDTO customerDTO,List<AIOQuestionDTO> questionDTOs) throws Exception{
        AIOCustomerBO customerBO=aioCustomerDAO.checkExistCustomer(customerDTO);
        if(customerBO==null){
            //tao khach hang
            customerDTO=aioContractManagerBusiness.createNewCustomer(customerDTO,performerId,sysGroupId);
        }else{
            customerDTO.setCustomerId(customerBO.getCustomerId());
        }

        surveyCustomerDAO.updateAioSurveyCustomer(performerId,surveyId,surveyCustomerId,customerDTO);

        surveyCustomerDAO.saveSurveyCustomerDetail(performerId,surveyId,surveyCustomerId,questionDTOs);

    }

}
