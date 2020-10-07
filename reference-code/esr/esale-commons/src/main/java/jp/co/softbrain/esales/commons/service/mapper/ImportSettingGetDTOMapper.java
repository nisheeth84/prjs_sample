package jp.co.softbrain.esales.commons.service.mapper;

import java.lang.reflect.Type;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import jp.co.softbrain.esales.commons.service.dto.ImportMappingItemDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingDTO;
import jp.co.softbrain.esales.commons.service.dto.ImportSettingGetDTO;
import jp.co.softbrain.esales.commons.service.dto.NoticeListToDTO;

/**
 * ImportSettingGetDTOMapper
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface ImportSettingGetDTOMapper {
    
    @Mapping(target = "mappingItem", source = "mappingItem", qualifiedByName = "jsonbToListImportMappingItemDTO")
    @Mapping(target = "matchingKey", source = "matchingKey", qualifiedByName = "jsonbToImportMappingItemDTO")
    @Mapping(target = "matchingRelation", source = "matchingRelation", qualifiedByName = "jsonbToListImportMappingItemDTO")
    @Mapping(target = "noticeList", source = "noticeList", qualifiedByName = "jsonbToNoticeListToDTO")
    ImportSettingGetDTO toImportSettingGetDTO(ImportSettingDTO entity);
    
    @Named("jsonbToListImportMappingItemDTO") 
    public static List<ImportMappingItemDTO> jsonbToImportDataDTO(String json) {
        Gson gson = new Gson();
        Type type = new TypeToken<List<ImportMappingItemDTO>>(){}.getType();
        return gson.fromJson(json, type);
    }
    
    @Named("jsonbToImportMappingItemDTO") 
    public static ImportMappingItemDTO jsonbToListImportDataDTO(String json) {
        Gson gson = new Gson();
        Type type = new TypeToken<ImportMappingItemDTO>(){}.getType();
        return gson.fromJson(json, type);
    }

    @Named("jsonbToNoticeListToDTO")
    public static NoticeListToDTO jsonbToNoticeListToDTO(String json) {
        Gson gson = new Gson();
        Type type = new TypeToken<NoticeListToDTO>() {
        }.getType();
        return gson.fromJson(json, type);
    }
}
