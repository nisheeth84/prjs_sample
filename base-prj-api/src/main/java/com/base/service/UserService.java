package com.base.service;

import com.base.entities.UsersEntity;
import com.base.repositories.IUsersRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private IUsersRepository userRepository;

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username) {
        // Kiểm tra xem user có tồn tại trong database không?
        UsersEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new Exception("not found");
        }
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserById(Long id) throws Exception {
        // Kiểm tra xem user có tồn tại trong database không?
        Optional<UsersEntity> opt = userRepository.findById(id);
        if (!opt.isPresent()) {
            throw new Exception("not found");
        }
        return new CustomUserDetails(opt.get());
    }
}
