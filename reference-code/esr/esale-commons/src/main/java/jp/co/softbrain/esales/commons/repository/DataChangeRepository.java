package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.DataChange;

/**
 * Spring Data repository for the DataChange entity.
 */
@Repository
@XRayEnabled
public interface DataChangeRepository extends JpaRepository<DataChange, Long> {

    /**
     * Delete all data_change with dataChangeIds specified in {@code dataChangeIds} parameter
     * 
     * @param dataChangeIds - condition to delete
     */
    @Modifying
    @Query("DELETE FROM DataChange d WHERE d.dataChangeId IN :dataChangeIds")
    Integer deleteDataChangeWithDataChangeIds(@Param("dataChangeIds") List<Long> dataChangeIds);
}
