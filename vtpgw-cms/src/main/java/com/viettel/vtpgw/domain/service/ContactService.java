package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.domain.service.abs.BaseService;
import com.viettel.vtpgw.domain.service.abs.IContactService;
import com.viettel.vtpgw.persistence.dto.request.ChangeInfo;
import com.viettel.vtpgw.persistence.dto.request.ContactUpdateDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.ContactDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import com.viettel.vtpgw.persistence.entity.ContactEntity;
import com.viettel.vtpgw.persistence.repository.IAccountRepository;
import com.viettel.vtpgw.persistence.repository.IContactRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class ContactService extends BaseService implements IContactService {
    @Autowired
    public ContactService(ModelMapper modelMapper, IAccountRepository iAccountRepository, IContactRepository iContactRepository) {
        super(modelMapper);
        this.modelMapper = modelMapper;
        this.iAccountRepository = iAccountRepository;
        this.iContactRepository = iContactRepository;
    }

    private IAccountRepository iAccountRepository;

    private IContactRepository iContactRepository;

    private ModelMapper modelMapper;

    @Override
    public ArrayResultDto<ContactDto> findAll(Integer page, Integer pageSize) {
        ArrayResultDto<ContactDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ContactEntity> rawData = iContactRepository.findAll(pageable);
        result.setSuccess(super.toDtos(rawData, ContactDto.class), rawData.getTotalElements(), rawData.getTotalPages());
        return result;
    }

    @Override
    public ResultDto<ContactDto> findById(String id) {
        ResultDto<ContactDto> resultDto = new ResultDto<>();
        resultDto.setItemNotfound();
        Optional<ContactEntity> optionalContact = iContactRepository.findById(id);
        optionalContact.ifPresent(contact -> {
            ContactDto contactDto = modelMapper.map(contact, ContactDto.class);
            if (contact.getUpdated() != null) {
                Date updateTime = new Date(contact.getUpdated());
                contactDto.setUpdated(updateTime);
            }
            resultDto.setSuccess(contactDto);
        });
        return resultDto;
    }

    @Override
    public ResultDto<ContactUpdateDto> update(ContactUpdateDto contactDto) {
        ResultDto<ContactUpdateDto> resultDto = new ResultDto<>();
        try {
            Optional<ContactEntity> optionalContact = iContactRepository.findById(contactDto.getId());
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String idAccount = iAccountRepository.findByEmail(((UserDetails)principal).getUsername()).getEmail();
            optionalContact.ifPresent(contact -> {
                contact.setEmail(contactDto.getEmail().trim());
                contact.setPhone(contactDto.getPhone().trim());
                contact.setFullname(contactDto.getFullname().trim());
                contact.setAddress(contactDto.getAddress().trim());
                contact.setUpdatedBy(idAccount);
                contact.setUpdated(new Date().getTime());
                contact.setStatus(contactDto.getStatus());

                iContactRepository.save(contact);
                resultDto.setSuccess(contactDto);

                HttpEntity<ChangeInfo> request = new HttpEntity<>(new ChangeInfo("contact", "update"));
            });

        } catch (Exception e) {
            e.printStackTrace();
            resultDto.setError();
        }
        return resultDto;
    }

    @Override
    public ResultDto<ContactDto> add(ContactDto contactDto) {
        ResultDto<ContactDto> resultDto = new ResultDto<>();
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String idAccount = iAccountRepository.findByEmail(((UserDetails) principal).getUsername()).getEmail();
            modelMapper.getConfiguration().setAmbiguityIgnored(true);
            if (!checkExistEmail(contactDto.getEmail())) {
                contactDto.setId(String.valueOf(UUID.randomUUID()));
                contactDto.setCreatedBy(idAccount);
                iContactRepository.save(modelMapper.map(contactDto, ContactEntity.class));
                resultDto.setSuccess(contactDto);

                HttpEntity<ChangeInfo> request = new HttpEntity<>(new ChangeInfo("contact", "create"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            resultDto.setError();
        }
        return resultDto;
    }

    @Override
    public ArrayResultDto<ContactDto> findByEmailOrPhoneOrFullname(String keyword, Integer page, Integer pageSize) {
        ArrayResultDto<ContactDto> result = new ArrayResultDto<>();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<ContactEntity> rawData = iContactRepository
                .findByEmailContainingOrPhoneContainingOrFullnameContaining(keyword, keyword, keyword, pageable);
        result.setSuccess(super.toDtos(rawData, ContactDto.class), rawData.getTotalElements(), rawData.getTotalPages());
        return result;
    }

    @Override
    public List<ContactDto> findAll() {
        List<ContactEntity> rawData = iContactRepository.findAll();
        List<ContactDto> list = new ArrayList<>();
        if (!rawData.isEmpty()) {
            rawData.forEach(item -> {
                ContactDto contact = (modelMapper.map(item, ContactDto.class));
                list.add(contact);
            });
        }
        return list;
    }

    @Override
    public boolean checkExistEmail(String email) {
        ContactEntity contact = iContactRepository.findByEmail(email);
        return !Objects.isNull(contact);
    }


}
