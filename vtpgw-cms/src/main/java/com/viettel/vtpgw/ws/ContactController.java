package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.abs.IContactService;
import com.viettel.vtpgw.persistence.dto.request.ContactUpdateDto;
import com.viettel.vtpgw.persistence.dto.request.ObjectsImportDto;
import com.viettel.vtpgw.persistence.dto.response.ArrayResultDto;
import com.viettel.vtpgw.persistence.dto.model.ContactDto;
import com.viettel.vtpgw.persistence.dto.response.ImportResultDto;
import com.viettel.vtpgw.persistence.dto.response.ResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@Controller
@RequestMapping("contact")
public class ContactController {

    @Autowired
    public ContactController(IContactService iContactService) {
        this.iContactService = iContactService;
    }

    private IContactService iContactService;

	@GetMapping("")
    public String index() {
        return "contact";
    }

    @GetMapping("/list")
    @ResponseBody
    public ArrayResultDto<ContactDto> getPage(@RequestParam("page") Optional<Integer> page,
                                              @RequestParam("size") Optional<Integer> size) {
        Integer currentPage = page.orElse(1);
        Integer pageSize = size.orElse(2);
        return iContactService.findAll(currentPage, pageSize);
    }

    @GetMapping("/search")
    @ResponseBody
    public ArrayResultDto<ContactDto> findByEmailOrPhoneOrFullname(@RequestParam("keyword") String keyword,
                                                                   @RequestParam("page") Optional<Integer> page,
                                                                   @RequestParam("size") Optional<Integer> size) {
        Integer currentPage = page.orElse(1);
        Integer pageSize = size.orElse(2);
        return iContactService.findByEmailOrPhoneOrFullname(keyword.trim(), currentPage, pageSize);
    }

    @PostMapping("/add")
    @ResponseBody
    public ResultDto<ContactDto> createContact(@Valid @RequestBody ContactDto contact){
        return iContactService.add(contact);
    }

    @GetMapping("/findById")
    @ResponseBody
    public ResultDto<ContactDto> findById(@RequestParam("id") String id){
        return iContactService.findById(id);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResultDto<ContactUpdateDto> updateContact(@Valid @RequestBody ContactUpdateDto contact){
        return iContactService.update(contact);
    }

    @PostMapping("/import")
    @ResponseBody
    public ImportResultDto<ContactDto> importExternalRecord(@Valid @RequestBody ObjectsImportDto<ContactDto> contactDtos) {
        ImportResultDto<ContactDto> resultDto = new ImportResultDto<>();
        for(ContactDto contactDto : contactDtos.getRecords()){
            if (iContactService.add(contactDto).getStatusCode().equals("200")) {
                resultDto.getDataSuccess().add(contactDto);
            } else {
                resultDto.getDataFail().add(contactDto);
            }
        }
        if (!resultDto.getDataSuccess().isEmpty()) {
            resultDto.setSuccess();
        } else {
            resultDto.setError();
        }
        return resultDto;
    }

    @GetMapping("/checkExistEmail")
    @ResponseBody
    public boolean checkExistEmail(@RequestParam String email) {
        return iContactService.checkExistEmail(email);
    }
}
