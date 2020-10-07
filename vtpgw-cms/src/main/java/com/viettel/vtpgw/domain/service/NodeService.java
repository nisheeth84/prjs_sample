package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.persistence.dto.request.ChangeInfo;
import com.viettel.vtpgw.persistence.dto.model.NodeDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.NodeEntity;
import com.viettel.vtpgw.persistence.repository.INodeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NodeService extends BaseService {

    @Autowired
    public NodeService(ModelMapper modelMapper, INodeRepository iNodeRepository) {
        super(modelMapper);
        this.iNodeRepository = iNodeRepository;
        this.modelMapper = modelMapper;
    }

    private INodeRepository iNodeRepository;

    private ModelMapper modelMapper;

    public ResultDto<NodeDto> add(NodeDto dto) {
        ResultDto<NodeDto> resultDto = new ResultDto<>();
        try {
            dto.setNodeId(String.valueOf(UUID.randomUUID()));
            modelMapper.getConfiguration().setAmbiguityIgnored(true);
            iNodeRepository.save(modelMapper.map(dto, NodeEntity.class));
            resultDto.setSuccess();
            HttpEntity<ChangeInfo> request = new HttpEntity<>(new ChangeInfo("nodes", "create"));
        } catch (Exception e) {
            e.printStackTrace();
            resultDto.setError();
        }
        return resultDto;
    }
}
