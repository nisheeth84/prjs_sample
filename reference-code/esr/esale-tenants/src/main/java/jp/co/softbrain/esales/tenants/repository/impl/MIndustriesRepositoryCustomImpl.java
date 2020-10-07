package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.tenants.repository.MIndustriesRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.IndustryDTO;

/**
 * Repository implementation for {@link MIndustriesRepositoryCustom}
 *
 * @author tongminhcuong
 */
@Repository
public class MIndustriesRepositoryCustomImpl extends RepositoryCustomUtils implements MIndustriesRepositoryCustom {

    /**
     * @see MIndustriesRepositoryCustom#getIndustry(String)
     */
    @Override
    public IndustryDTO getIndustry(String industryTypeName) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT m_industry_id ");
        sqlBuilder.append("     , industry_type_name ");
        sqlBuilder.append("     , schema_name ");
        sqlBuilder.append("FROM m_industries ");
        sqlBuilder.append("WHERE industry_type_name = :industryTypeName ");
        sqlBuilder.append("LIMIT 1;");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("industryTypeName", industryTypeName);

        return getSingleResult(sqlBuilder.toString(), "IndustryMapping", parameters);
    }
}
