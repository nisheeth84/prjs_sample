package jp.co.softbrain.esales.commons.repository;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.domain.MenuFavorite;

/**
 * Spring Data repository for the MenuFavorite entity.
 */
@Repository
@XRayEnabled
public interface MenuFavoriteRepository extends JpaRepository<MenuFavorite, Long> {

    /**
     * find one by id
     *
     * @param serviceId
     * @return
     */
    Optional<MenuFavorite> findByServiceId(Long serviceId);

    /**
     * Delete By FavoriteId and serviceId
     *
     * @param serviceId and employeeId
     */
    @Modifying(clearAutomatically = true)
    List<MenuFavorite> deleteAllByServiceIdAndEmployeeId(Long serviceId, Long employeeId);

    /**
     * find All By Employee Id
     *
     * @param employeeId
     */
    List<MenuFavorite> findAllByEmployeeId(Long employeeId);
}
