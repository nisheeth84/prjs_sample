package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackStatusOutDTO;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackStatusOpenDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetFeedBackStatusOutDTO;

/**
 * FeedBackStatusService
 *
 * @author DatDV
 */
@XRayEnabled
public interface FeedBackStatusService {

    /**
     * save : Save a ipAddress.
     *
     * @param ipAddressDTO : the entity to save.
     * @return the persisted entity.
     */
    FeedbackStatusOpenDTO save(FeedbackStatusOpenDTO feedbackDTO);

    /**
     * findAll : Get all the ipAddresses.
     *
     * @return the list of entities.
     */
    List<FeedbackStatusOpenDTO> findAll();

    /**
     * findOne : Get the "id" ipAddress.
     *
     * @param id : the id of the entity.
     * @return the entity.
     */
    Optional<FeedbackStatusOpenDTO> findOne(Long id);

    /**
     * delete : Delete the "id" ipAddress.
     *
     * @param id : the id of the entity.
     */
    void delete(Long id);

    /**
     * createFeedBackStatusOpen
     * 
     * @param employeeId
     * @return CreateFeedBackStatusOutDTO : DTO out of API
     *         createFeedBackStatusOpen
     */
    CreateFeedBackStatusOutDTO createFeedBackStatusOpen(Long employeeId, String tenantName);

    /**
     * getFeedBackStatusOpen
     * 
     * @param employeeId
     * @return GetFeedBackStatusOutDTO : DTO out of API getFeedBackStatusOpen
     */
    GetFeedBackStatusOutDTO getFeedBackStatusOpen(Long employeeId, String tenantName);
}
