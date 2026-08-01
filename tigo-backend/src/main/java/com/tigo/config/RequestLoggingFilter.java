package com.tigo.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Enumeration;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        if (req.getRequestURI().startsWith("/api/users/me")) {
            logger.info("Incoming request to {}", req.getRequestURI());
            
            if (req.getCookies() != null) {
                for (Cookie cookie : req.getCookies()) {
                    logger.info("Cookie: {} = {}", cookie.getName(), cookie.getValue());
                }
            } else {
                logger.info("No cookies found");
            }
            
            Enumeration<String> headerNames = req.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.info("Header: {} = {}", headerName, req.getHeader(headerName));
            }
        }
        
        chain.doFilter(request, response);
    }
}
