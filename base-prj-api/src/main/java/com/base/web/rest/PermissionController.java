package com.base.web.rest;

import com.base.service.dto.UsersDto;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class PermissionController {
    @RequestMapping(value = {"/get-data"}, method = RequestMethod.POST)
    @PreAuthorize("@appAuthorizer.authorize(authentication, 'VIEW', this)")
    public @ResponseBody
    ResponseEntity<?> getData() {
        System.out.println("Success!");
        System.out.println("-------------------------------------------");
        return null;
    }

    @RequestMapping(value = {"/insert"}, method = RequestMethod.POST)
    @PreAuthorize("{@appAuthorizer.authorize(authentication, 'INSERT', this)}")
    public @ResponseBody
    ResponseEntity<?> insert() {
        //Xử lý nghiệp vụ Insert
        System.out.println("Success!");
        System.out.println("-------------------------------------------");
        return null;
    }

    @RequestMapping(value = {"/update"}, method = RequestMethod.POST)
    @PreAuthorize("{@appAuthorizer.authorize(authentication, 'UPDATE', this)}")
    public @ResponseBody
    ResponseEntity<?> update() {
        //Xử lý nghiệp vụ Update
        System.out.println("Success!");
        System.out.println("-------------------------------------------");
        return null;
    }

    @RequestMapping(value = {"/delete"}, method = RequestMethod.POST)
    @PreAuthorize("{@appAuthorizer.authorize(authentication, 'DELETE', this)}")
    public @ResponseBody
    ResponseEntity<?> delete() {
        //Xử lý nghiệp vụ Delete
        System.out.println("Success!");
        System.out.println("-------------------------------------------");
        return null;
    }
}
