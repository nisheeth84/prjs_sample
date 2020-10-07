package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import jp.co.softbrain.esales.commons.domain.Address;
import jp.co.softbrain.esales.commons.service.dto.AddressDTO;

/**
* Mapper for the entity {@link Address} and its DTO {@link AddressDTO}.
* 
* @author chungochai
*/
@Mapper(componentModel = "spring", uses = {})
public interface AddressMapper extends EntityMapper<AddressDTO, Address>{

}
