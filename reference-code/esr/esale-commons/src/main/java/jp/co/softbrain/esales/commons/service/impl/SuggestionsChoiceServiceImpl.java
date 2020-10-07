package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.SuggestionsChoice;
import jp.co.softbrain.esales.commons.repository.SuggestionsChoiceRepository;
import jp.co.softbrain.esales.commons.service.SuggestionsChoiceService;
import jp.co.softbrain.esales.commons.service.dto.GetEmployeeSuggestionsChoiceDTO;
import jp.co.softbrain.esales.commons.service.dto.SaveSuggestionsChoiceOutDTO;
import jp.co.softbrain.esales.commons.service.dto.SuggestionsChoiceDTO;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;

/**
 * SuggestionsChoiceServiceImpl
 * 
 * @author HaiCN
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class SuggestionsChoiceServiceImpl implements SuggestionsChoiceService {

    @Autowired
    private SuggestionsChoiceRepository suggestionsChoiceRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * @see jp.co.softbrain.esales.commons.service.SuggestionsChoiceService#getEmployeeSuggestionsChoice(java.util.List,
     *      java.lang.Long, java.lang.Integer)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<SuggestionsChoiceDTO> getEmployeeSuggestionsChoice(List<String> index, Long employeeId, Integer limit) {
        List<SuggestionsChoiceDTO> responseDTO = new ArrayList<>();
        List<GetEmployeeSuggestionsChoiceDTO> suChoices = suggestionsChoiceRepository.getEmployeeSuggestionsChoice(index, employeeId,
                limit);
        if (suChoices != null) {
            suChoices.forEach(getSuggestChoice -> {
                SuggestionsChoiceDTO suChoiceDTO = new SuggestionsChoiceDTO();
                suChoiceDTO.setIdResult(getSuggestChoice.getIdResult());
                suChoiceDTO.setSuggestionsChoiceId(getSuggestChoice.getSuggestionsChoiceId());
                suChoiceDTO.setIndex(getSuggestChoice.getIndex());
                responseDTO.add(suChoiceDTO);
            });
        }
        return responseDTO;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.SuggestionsChoiceService#saveSuggestionsChoice(java.lang.String,
     *      java.lang.Integer, java.time.Instant)
     */
    @Override
    @Transactional
    public SaveSuggestionsChoiceOutDTO saveSuggestionsChoice(List<SuggestionsChoiceDTO> sugggestionsChoice) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1.Insert suggestionsChoice
        SaveSuggestionsChoiceOutDTO response = new SaveSuggestionsChoiceOutDTO();
        List<Long> suggestionChoiceIds = new ArrayList<>();
        sugggestionsChoice.forEach(suggestParam -> {
            SuggestionsChoice entity = new SuggestionsChoice();
            entity.setIndex(suggestParam.getIndex());
            entity.setIdResult(suggestParam.getIdResult());
            entity.setEmployeeId(employeeId);
            entity.setCreatedUser(employeeId);
            entity.setUpdatedUser(employeeId);
            suggestionChoiceIds.add(suggestionsChoiceRepository.save(entity).getSuggestionsChoiceId());
        });
        // 2.Response
        response.setSuggestionChoiceId(suggestionChoiceIds);

        return response;
    }
}
