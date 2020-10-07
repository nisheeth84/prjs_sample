package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.MTemplateIndustryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.MTemplates;
import jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO;

/**
 * Spring Data repository for the {@link MTemplates} entity.
 *
 * @author tongminhcuong
 */
@Repository
@XRayEnabled
public interface MTemplatesRepository extends JpaRepository<MTemplates, Long>, MTemplatesRepositoryCustom {

    /**
     * Get template by Industry type name and service id
     *
     * @param mIndustryId mIndustryId
     * @param microServiceNameList List of micro service name
     * @return {@link MTemplateInfoDTO}
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.tenants.service.dto.MTemplateInfoDTO( "
            + "   microServiceName, "
            + "   fileName "
            + " ) "
            + " FROM MTemplates "
            + " WHERE mIndustryId = :mIndustryId "
            + "   AND microServiceName IN :microServiceNameList ")
    List<MTemplateInfoDTO> getMasterTemplates(@Param("mIndustryId") Long mIndustryId,
            @Param("microServiceNameList") List<String> microServiceNameList);

    /**
     * Get list templates
     *
     * @return list of industry type name
     */
    @Query("SELECT DISTINCT new jp.co.softbrain.esales.tenants.service.dto.MTemplateIndustryDTO("
            + "    mi.industryTypeName, "
            + "    mi.industryTypeNameJp "
            + ")"
            + " FROM MTemplates mt "
            + "     INNER JOIN MIndustries mi ON mt.mIndustryId = mi.mIndustryId"
            + " ORDER BY mi.industryTypeName ASC")
    List<MTemplateIndustryDTO> getListTemplates();
}
