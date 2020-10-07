package com.base.web.rest;

import com.base.entities.UsersEntity;
import com.base.payload.LoginRequest;
import com.base.payload.LoginResponse;
import com.base.payload.RandomStuff;
import com.base.security.jwt.JwtTokenProvider;
import com.base.service.CustomUserDetails;
import com.base.service.dto.UsersDto;
import com.base.validator.Add;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class HomeController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public LoginResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Xác thực từ username và password.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Nếu không xảy ra exception tức là thông tin hợp lệ
        // Set thông tin authentication vào Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Trả về jwt cho người dùng.
        String jwt = tokenProvider.generateToken((CustomUserDetails) authentication.getPrincipal());
        return new LoginResponse(jwt);
    }

    // Api /api/random yêu cầu phải xác thực mới có thể request
    @GetMapping("/random")
    public RandomStuff randomStuff() {
        return new RandomStuff("JWT Hợp lệ mới có thể thấy được message này");
    }

//    @PostMapping("/users")
//    public ResponseEntity<UsersEntity> addUser(@Validated(value = Add.class) @RequestBody UsersDto dto){
//        UsersEntity entity = new UsersEntity();
//        entity.setEmail(dto.getEmail());
//        return ResponseEntity.ok(entity);
//    }

    //    @GetMapping("/random")
//    public RandomStuff randomStuff(){
//        return new RandomStuff("JWT Hợp lệ mới có thể thấy được message này");
//    }
//
//    @GetMapping("/random")
//    public RandomStuff randomStuff(){
//        return new RandomStuff("JWT Hợp lệ mới có thể thấy được message này");
//    }
    @GetMapping("/user")
    public RandomStuff getUsers() {
        return new RandomStuff("User mới có thể thấy được message này");
    }

    @GetMapping("/admin")
    public RandomStuff getAdmins() {
        return new RandomStuff("Admin mới có thể thấy được message này");
    }

    @GetMapping("/all-view")
    public RandomStuff allView() {
        return new RandomStuff("Everyone đều thấy được message này");
    }
}
