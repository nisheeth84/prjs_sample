package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ImportProgress;
import jp.co.softbrain.esales.commons.service.dto.ImportProgressDTO;

/**
 * @author dohuyhai
 * Mapper for the entity {@link ImportProgress} and its DTO {@link ImportProgressDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ImportProgressMapper extends EntityMapper<ImportProgressDTO, ImportProgress> {



    default ImportProgress fromId(Long importProgressId) {
        if (importProgressId == null) {
            return null;
        }
        ImportProgress importProgress = new ImportProgress();
        importProgress.setImportProgressId(importProgressId);
        return importProgress;
    }
}
