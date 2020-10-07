package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackInDTO;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackDTO;

/**
 * FeedBackService
 *
 * @author DatDV
 */
@XRayEnabled
public interface FeedBackService {

    /**
     * save : Save a ipAddress.
     *
     * @param ipAddressDTO : the entity to save.
     * @return the persisted entity.
     */
    FeedbackDTO save(FeedbackDTO feedbackDTO);

    /**
     * findAll : Get all the ipAddresses.
     *
     * @return the list of entities.
     */
    List<FeedbackDTO> findAll();

    /**
     * findOne : Get the "id" ipAddress.
     *
     * @param id : the id of the entity.
     * @return the entity.
     */
    Optional<FeedbackDTO> findOne(Long id);

    /**
     * delete : Delete the "id" ipAddress.
     *
     * @param id : the id of the entity.
     */
    void delete(Long id);

    /**
     * createFeedback
     * 
     * @param createFeedbackInDTO
     * @return CreateFeedBackOutDTO : DTO out of API createFeedBack
     */
    CreateFeedBackOutDTO createFeedback(CreateFeedBackInDTO createFeedbackInDTO);
}
