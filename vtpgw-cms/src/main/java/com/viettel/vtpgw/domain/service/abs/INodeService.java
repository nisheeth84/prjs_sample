package com.viettel.vtpgw.domain.service.abs;

import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.NodeDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;

public interface INodeService {
    ResultDto<NodeDto> findById(String id);
    ResultDto<NodeDto> update(NodeDto dto);
    ResultDto<NodeDto> add(NodeDto dto);
    ArrayResultDto<NodeDto> findByServiceId(String id);
    Long deleteNodesByServiceId(Long id);
}
