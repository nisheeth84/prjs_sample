package com.viettel.vtpgw.shared.utils;

import lombok.extern.log4j.Log4j2;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Log4j2
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    private LinkedHashMap<String, Object> genErrorResponse(HttpStatus status, List<String> errors) {
        LinkedHashMap<String, Object> body = new LinkedHashMap<>();
        body.put("statusCode", status.value());
        body.put("messages", errors);

        return body;
    }

    // error handle for @Valid
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        //Get all errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        Map<String, Object> resBody = this.genErrorResponse(status, errors);
        return new ResponseEntity<>(resBody, headers, status);
    }

    @ExceptionHandler(value = {Exception.class})
    protected ResponseEntity<Object> handleConflict(Exception ex, WebRequest request) {
        log.error(ex.getMessage(), ex);
        Map<String, Object> resBody =
                this.genErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, Collections.singletonList(ex.getMessage()));

        return handleExceptionInternal(ex, resBody, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

//    @ExceptionHandler(value = {BusinessException.class})
//    protected ResponseEntity<Object> handleBusinessException(RuntimeException ex, WebRequest request) {
//        ex.printStackTrace();
//        BaseResponse res = new BaseResponse();
//        res.setStatus(HttpStatus.BAD_REQUEST.value());
//        res.setError(ex.getCause().toString());
//        res.setMessage(ex.getMessage());
//
//        return handleExceptionInternal(ex, res, new HttpHeaders(), HttpStatus.CONFLICT, request);
//    }
}