package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.Address;

/**
 * Spring Data repository for the Address entity.
 * 
 * @author chungochai
 */
@Repository
@XRayEnabled
public interface AddressRepossitory extends JpaRepository<Address, String> {

    /**
     * Get list address information from the zip code
     * 
     * @param zipCode : data need for get information
     * @param offset : data need for get information
     * @param limit : data need for get information
     * @return address information from the zip code
     */
    @Query(value = "SELECT * "
                 + "FROM address "
                 + "WHERE zip_code LIKE :zipCode "
                 + "ORDER BY zip_code ASC "
                 + "LIMIT :limit OFFSET :offset " ,nativeQuery = true)
    List<Address> getAddressesFromZipCode(@Param("zipCode") String zipCode, @Param("offset") Long offset,
            @Param("limit") Long limit);

}
