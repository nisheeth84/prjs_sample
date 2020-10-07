package jp.co.softbrain.esales.uaa.repository;
import jp.co.softbrain.esales.uaa.domain.UaPasswords;

import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;

/**
 * Spring Data  repository for the UaPasswords entity.
 */
@SuppressWarnings("unused")
@Repository
@XRayEnabled
public interface UaPasswordsRepository extends JpaRepository<UaPasswords, Long> {

    /**
     * find one record by employee id, reference authorities data from table Authorities
     *
     * @param employeeId
     * @return UaPasswords
     */
    @EntityGraph(attributePaths = "authorities")
    Optional<UaPasswords> findOneWithAuthoritiesByEmployeeId(Long employeeId);

    /**
     * find one record by employee id
     *
     * @param employeeId
     * @return UaPasswords
     */
    Optional<UaPasswords> findOneByEmployeeId(Long employeeId);

}
