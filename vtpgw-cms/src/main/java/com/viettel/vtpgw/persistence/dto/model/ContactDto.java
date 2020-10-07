package com.viettel.vtpgw.persistence.dto.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;

@Getter
@Setter
@ToString
public class ContactDto {

	private String id;
	
	@Email(message = "Email is invalid")
    @NotEmpty(message = "Email is required")
    private String email;

    @NotEmpty(message = "Full name is required")
    private String fullname;

    private String createdBy;

    @NotEmpty(message = "Phone is required")
    @Pattern(regexp="^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
            message="Mobile number is invalid")
    @Size(min=10, message = "Phone size must be at least 10 characters")
    private String phone;

    @NotEmpty(message = "Address is required")
    private String address;
    
    @NotNull(message = "Status is required")
    private Integer status;
    private String updatedBy;
    
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updated;
}
