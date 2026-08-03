package com.tigo.config;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URL;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Value("${app.auth.issuer-uri:}")
    private String configuredIssuerUri;

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    public SecurityConfig(CustomJwtAuthenticationConverter customJwtAuthenticationConverter) {
        this.customJwtAuthenticationConverter = customJwtAuthenticationConverter;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        try {
            // Use DefaultResourceRetriever with extended timeouts — the Neon JWKS endpoint
            // can take several seconds to respond. Default Nimbus timeout is 3s which is too short.
            com.nimbusds.jose.util.DefaultResourceRetriever resourceRetriever =
                new com.nimbusds.jose.util.DefaultResourceRetriever(
                    15_000, // connect timeout ms
                    15_000  // read timeout ms
                );
            JWKSource<SecurityContext> jwkSource = new RemoteJWKSet<>(new URL(jwkSetUri), resourceRetriever);
            
            // Neon Auth JWKS uses EdDSA (OKP/Ed25519) keys.
            // Nimbus's built-in selectors (JWSVerificationKeySelector) attempt to convert OKP to java.security.PublicKey,
            // which throws "Export to java.security.PublicKey not supported" and fails the verification.
            // By implementing a completely custom JWTProcessor, we bypass KeyConverter entirely
            // and feed the OctetKeyPair directly into Nimbus's native Ed25519Verifier.
            com.nimbusds.jwt.proc.JWTProcessor<SecurityContext> customProcessor = new com.nimbusds.jwt.proc.JWTProcessor<>() {
                @Override
                public com.nimbusds.jwt.JWTClaimsSet process(String jwtString, SecurityContext context) 
                        throws java.text.ParseException, com.nimbusds.jose.proc.BadJOSEException, com.nimbusds.jose.JOSEException {
                    return process(com.nimbusds.jwt.JWTParser.parse(jwtString), context);
                }

                @Override
                public com.nimbusds.jwt.JWTClaimsSet process(com.nimbusds.jwt.JWT jwt, SecurityContext context) 
                        throws com.nimbusds.jose.proc.BadJOSEException, com.nimbusds.jose.JOSEException {
                    
                    if (!(jwt instanceof com.nimbusds.jwt.SignedJWT signedJwt)) {
                        throw new com.nimbusds.jose.proc.BadJOSEException("JWT is not signed");
                    }
                    
                    String kid = signedJwt.getHeader().getKeyID();
                    com.nimbusds.jose.jwk.JWKSelector selector = new com.nimbusds.jose.jwk.JWKSelector(
                        new com.nimbusds.jose.jwk.JWKMatcher.Builder().keyID(kid).build()
                    );
                    
                    List<com.nimbusds.jose.jwk.JWK> jwks = jwkSource.get(selector, context);
                    if (jwks.isEmpty()) {
                        throw new com.nimbusds.jose.proc.BadJOSEException("No key found in JWKS for kid: " + kid);
                    }
                    
                    com.nimbusds.jose.jwk.JWK jwk = jwks.get(0);
                    if (!(jwk instanceof com.nimbusds.jose.jwk.OctetKeyPair okp)) {
                        throw new com.nimbusds.jose.proc.BadJOSEException("Expected Ed25519 OctetKeyPair, got: " + jwk.getClass());
                    }
                    
                    // Natively verify Ed25519 using Nimbus's Ed25519Verifier
                    com.nimbusds.jose.JWSVerifier verifier = new com.nimbusds.jose.crypto.Ed25519Verifier(okp);
                    if (!signedJwt.verify(verifier)) {
                        throw new com.nimbusds.jose.proc.BadJOSEException("Ed25519 signature verification failed");
                    }
                    
                    try {
                        return signedJwt.getJWTClaimsSet();
                    } catch (java.text.ParseException e) {
                        throw new com.nimbusds.jose.proc.BadJOSEException("Invalid claims set", e);
                    }
                }

                @Override
                public com.nimbusds.jwt.JWTClaimsSet process(com.nimbusds.jwt.SignedJWT signedJWT, SecurityContext context) 
                        throws com.nimbusds.jose.proc.BadJOSEException, com.nimbusds.jose.JOSEException {
                    return process((com.nimbusds.jwt.JWT) signedJWT, context);
                }

                @Override
                public com.nimbusds.jwt.JWTClaimsSet process(com.nimbusds.jwt.PlainJWT plainJWT, SecurityContext context) 
                        throws com.nimbusds.jose.proc.BadJOSEException, com.nimbusds.jose.JOSEException {
                    throw new com.nimbusds.jose.proc.BadJOSEException("Plain JWTs are rejected");
                }

                @Override
                public com.nimbusds.jwt.JWTClaimsSet process(com.nimbusds.jwt.EncryptedJWT encryptedJWT, SecurityContext context) 
                        throws com.nimbusds.jose.proc.BadJOSEException, com.nimbusds.jose.JOSEException {
                    throw new com.nimbusds.jose.proc.BadJOSEException("Encrypted JWTs are not supported");
                }
            };

            NimbusJwtDecoder decoder = new NimbusJwtDecoder(customProcessor);

            // Issuer is sourced from app.auth.issuer-uri (env: AUTH_ISSUER_URI) when set.
            // Otherwise it's derived from the JWKS URI on the assumption that Neon Auth
            // follows the standard OIDC discovery convention (issuer + "/.well-known/jwks.json").
            // Set AUTH_ISSUER_URI explicitly if the real "iss" claim in issued tokens
            // doesn't match that derived value.
            String issuer = (configuredIssuerUri != null && !configuredIssuerUri.isBlank())
                ? configuredIssuerUri
                : jwkSetUri.replace("/.well-known/jwks.json", "");

            OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefaultWithIssuer(issuer);
            OAuth2TokenValidator<Jwt> loggingValidator = token -> {
                OAuth2TokenValidatorResult result = defaultValidator.validate(token);
                if (result.hasErrors()) {
                    log.warn("JWT validation failed. expectedIssuer=[{}] actualIssuerClaim=[{}] errors={}",
                        issuer, token.getIssuer(), result.getErrors());
                }
                return result;
            };
            decoder.setJwtValidator(loggingValidator);

            return decoder;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to configure JwtDecoder: " + e.getMessage(), e);
        }
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/categories").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET,
                    "/api/posts",
                    "/api/posts/**"
                ).permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(customJwtAuthenticationConverter)
                )
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
