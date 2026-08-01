package com.tigo.config;

import com.tigo.service.UserSyncService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtAuthenticationConverter defaultConverter = new JwtAuthenticationConverter();
    private final UserSyncService userSyncService;

    public CustomJwtAuthenticationConverter(UserSyncService userSyncService) {
        this.userSyncService = userSyncService;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        AbstractAuthenticationToken token = defaultConverter.convert(jwt);
        userSyncService.syncUser(jwt);
        return token;
    }
}
