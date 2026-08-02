package com.tigo;

import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

public class SpringSecurityTest {
    public static void main(String[] args) {
        try {
            System.out.println(SignatureAlgorithm.from("EdDSA"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
