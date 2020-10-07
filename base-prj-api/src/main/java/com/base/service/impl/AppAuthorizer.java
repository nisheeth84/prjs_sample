package com.base.service.impl;

import com.base.entities.MenusEntity;
import com.base.entities.PermissionEntity;
import com.base.entities.UsersEntity;
import com.base.repositories.IMenusRepository;
import com.base.repositories.IPermissionRepository;
import com.base.repositories.IUsersRepository;
import com.base.service.CustomUserDetails;
import com.base.service.IAppAuthorizer;
import com.base.service.dto.MenusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ResolvableType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Service("appAuthorizer")
public class AppAuthorizer implements IAppAuthorizer {

    private final IUsersRepository usersRepository;
    private final IMenusRepository menusRepository;
    private final IPermissionRepository permissionRepository;

    @Autowired
    public AppAuthorizer(IUsersRepository usersRepository, IMenusRepository menusRepository,
                         IPermissionRepository permissionRepository) {
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean authorize(Authentication authentication, String action, Object callerObj) throws Exception {
        String securedPath = extractSecuredPath(callerObj);
//        if (securedPath == null || "".equals(securedPath.trim())) {//login, logout
//            return true;
//        }
//        String menuCode = securedPath.substring(1);//Bỏ dấu "/" ở đầu Path
        AtomicBoolean isAllow = new AtomicBoolean(false);
        try {
            UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken) authentication;
            if (user == null) {
                return isAllow.get();
            }
//            UsersEntity entity = user.getPrincipal();
            CustomUserDetails customUserDetails = (CustomUserDetails) user.getPrincipal();
            Long userId = customUserDetails.getUserId();
            if (userId == null ) {
                return isAllow.get();
            }
            //Truy vấn vào CSDL theo userId + menuCode + action
            this.getAllPermissionByUserId(userId).forEach(e -> {
                if (action.equals(e.getMenuAction())) isAllow.set(true);
            });
        } catch (Exception e) {
//            logger.error(e.toString(), e);
            throw e;
        }
        return isAllow.get();
    }

    // Lay ra securedPath duoc Annotate RequestMapping trong Controller
    private String extractSecuredPath(Object callerObj) {
        Class<?> clazz = ResolvableType.forClass(callerObj.getClass()).getRawClass();
        Optional<Annotation> annotation = Arrays.asList(clazz.getAnnotations()).stream().filter((ann) -> {
            return ann instanceof RequestMapping;
        }).findFirst();
//        logger.debug("FOUND CALLER CLASS: {}", ResolvableType.forClass(callerObj.getClass()).getType().getTypeName());
        if (annotation.isPresent()) {
            return ((RequestMapping) annotation.get()).value()[0];
        }
        return null;
    }

    private List<MenusDto> getAllPermissionByUserId(Long userId) throws Exception {
        Optional<UsersEntity> opt = usersRepository.findById(userId);

        if (!opt.isPresent()) {
            throw new Exception("user not found");
        }
        List<MenusEntity> menusEntities = new ArrayList<>();
        UsersEntity entity = opt.get();
        Integer role = entity.getRole();
        List<PermissionEntity> permissionEntities = permissionRepository.findByGroupId(role);
        permissionEntities.forEach(e -> menusEntities
                        .add(menusRepository.findById(e.getMenuId()).get()));

        List<MenusDto> dtos = new ArrayList<>();
        menusEntities.forEach(e -> {
            dtos.add(new MenusDto(e.getId(), e.getMenuCode(), e.getMenuAction()));
        });

        return dtos;
    }
}
