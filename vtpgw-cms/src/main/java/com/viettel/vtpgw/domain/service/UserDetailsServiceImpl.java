package com.viettel.vtpgw.domain.service;

import com.viettel.vtpgw.persistence.entity.AccountEntity;
import com.viettel.vtpgw.persistence.repository.IAccountRepository;
import com.viettel.vtpgw.shared.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    public UserDetailsServiceImpl(IAccountRepository iAccountRepository) {
        this.accountRepository = iAccountRepository;
    }

    private IAccountRepository accountRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        AccountEntity user = accountRepository.findByEmailAndStatus(username, Constants.StatusLogin.ACTIVATE);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(),
                AuthorityUtils.commaSeparatedStringToAuthorityList("Admin"));
    }
}
