package com.viettel.vtpgw.persistence.dto.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ContactUpdateDto {

	@NotEmpty(message = "Id is required")
	private String id;
	
	@Email(message = "Email is invalid")
    @NotEmpty(message = "Email is required")
    private String email;
    private String createdBy;

	@NotEmpty(message = "Full name is required")
    private String fullname;
	
	@NotEmpty(message = "Phone is required")
    @Pattern(regexp="^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$",
            message="Mobile number is invalid")
    @Size(min=10, message = "Phone size must be at least 10 characters")
    private String phone;

    @NotEmpty(message = "Address is required")
    private String address;
    private Integer status;
    
    @NotEmpty(message = "Updated by is required")
    private String updatedBy;
    private Long updated;
}
