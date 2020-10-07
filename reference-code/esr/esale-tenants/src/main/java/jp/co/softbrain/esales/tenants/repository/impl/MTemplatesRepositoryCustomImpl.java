package jp.co.softbrain.esales.tenants.repository.impl;

import com.amazonaws.util.CollectionUtils;
import jp.co.softbrain.esales.tenants.repository.MTemplatesRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.TemplateMicroServiceDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implement query for  MTemplates repository.
 *
 * @author nguyenvietloi
 */
@Repository
public class MTemplatesRepositoryCustomImpl extends RepositoryCustomUtils implements MTemplatesRepositoryCustom {

    /**
     * @see MTemplatesRepositoryCustom#getTemplateMicroServices(Long, List)
     */
    @Override
    public List<TemplateMicroServiceDTO> getTemplateMicroServices(Long mIndustryId, List<String> microServiceNames) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT mt.m_template_id ");
        sqlBuilder.append("      , mt.file_name ");
        sqlBuilder.append("      , mt.updated_date ");
        sqlBuilder.append("      , mt.micro_service_name ");
        sqlBuilder.append(" FROM m_templates mt ");
        sqlBuilder.append(" WHERE mt.m_industry_id = :mIndustryId ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("mIndustryId", mIndustryId);
        if (!CollectionUtils.isNullOrEmpty(microServiceNames)) {
            sqlBuilder.append("AND mt.micro_service_name IN :microServiceNames ");
            parameters.put("microServiceNames", microServiceNames);
        }
        sqlBuilder.append(" ORDER BY mt.m_template_id ASC;");

        return this.getResultList(sqlBuilder.toString(), "TemplateMicroServiceMapping", parameters);
    }
}
