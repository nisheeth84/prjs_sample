package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.FieldInfo;

/**
 * Spring Data repository for the FieldInfo entity.
 */
@Repository
@XRayEnabled
public interface FieldInfoRepository extends JpaRepository<FieldInfo, Long> {

    /**
     * get field_name by fieldBelong, fieldType
     *
     * @param fieldBelong data need for get
     * @param fieldType data need for get
     * @return string after get
     */
    @Query(value = "SELECT fir.* FROM field_info_view fi "
            + " INNER JOIN field_info_view fir ON (fi.relation_data->>'display_field_id')\\:\\:int8 = fir.field_id "
            + " WHERE fi.field_type= 17 AND fi.field_name = :fieldName "
            + "     AND fir.field_belong = (fi.relation_data->>'field_belong')\\:\\:int8", nativeQuery = true)
    List<FieldInfo> getRealationData(@Param("fieldName") String fieldName);
}
