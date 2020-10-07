package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListParticipants;

/**
 * CustomersRepository for managing {@link CustomersListParticipants}
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface CustomersListParticipantsRepository extends JpaRepository<CustomersListParticipants, Long> {

    /**
     * Get all CustomersListParticipants with customer_list_Id
     * 
     * @param customerListId the id of customer list
     * @return the entity of CustomersListParticipants
     */
    List<CustomersListParticipants> findByCustomerListId(Long customerListId);

    /**
     * Delete customers_list_participants by customer_list_id
     * 
     * @param cutomersListId the value of customer_list_id
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerListId(Long cutomersListId);

    /**
     * find by customerListParticipantId
     * 
     * @param customerListParticipantId
     * @return the optional DTO resposne
     */
    Optional<CustomersListParticipants> findByCustomerListParticipantId(Long customerListParticipantId);

    /**
     * delete by customerListParticipantId
     * 
     * @param customerListParticipantId
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerListParticipantId(Long customerListParticipantId);

    /**
     * Get all CustomersListParticipants with customer_list_Id and participant type is 2. <Br/>
     * To get owner of this list.
     * 
     * @param customerListId the id of customer list
     * @param participantType the participant type (owner = 2)
     * @return the entity of CustomersListParticipants
     */
    List<CustomersListParticipants> findByCustomerListIdAndParticipantType(Long customerListId,
            Integer participantType);
}
