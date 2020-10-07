package com.viettel.vtpgw.domain.service.abs;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
public abstract class BaseService {

    private ModelMapper modelMapper;

    protected <T, E> T map(E entity, Class<T> clazz) {
        return modelMapper.map(entity, clazz);
    }

    protected <T, E> List<T> toDtos(Page<E> rawData, Class<T> clazz) {
        return CollectionUtils.isEmpty(rawData.getContent()) ?
                Collections.emptyList() :
                rawData.getContent().stream()
                        .map(i -> modelMapper.map(i, clazz))
                        .collect(Collectors.toList());
    }

    protected <T, E> List<T> mapList(List<E> inputData, Class<T> clazz) {
        return CollectionUtils.isEmpty(inputData) ?
                Collections.emptyList() :
                inputData.stream()
                        .map(i -> modelMapper.map(i, clazz))
                        .collect(Collectors.toList());
    }

    public <T, H> void map(T source, H destination) {
        modelMapper.map(source, destination);
    }

    protected String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
