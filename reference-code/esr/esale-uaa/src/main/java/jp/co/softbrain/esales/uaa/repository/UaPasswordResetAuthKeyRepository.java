package jp.co.softbrain.esales.uaa.repository;
import jp.co.softbrain.esales.uaa.domain.UaPasswordResetAuthKey;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;


/**
 * Spring Data  repository for the UaPasswordResetAuthKey entity.
 */
@SuppressWarnings("unused")
@Repository
@XRayEnabled
public interface UaPasswordResetAuthKeyRepository extends JpaRepository<UaPasswordResetAuthKey, Long> {

    /**
     * find one record by employee id
     *
     * @param employeeId
     * @return UaPasswordResetAuthKey
     */
    Optional<UaPasswordResetAuthKey> findOneByEmployeeId(Long employeeId);

    /**
     * find one record by Auth Key Number
     *
     * @param authKeyNumber
     * @return UaPasswordResetAuthKey
     */
    Optional<UaPasswordResetAuthKey> findOneByAuthKeyNumber(String authKeyNumber);
}
