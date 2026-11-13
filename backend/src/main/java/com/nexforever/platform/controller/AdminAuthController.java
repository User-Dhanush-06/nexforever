package com.nexforever.platform.controller;

import com.nexforever.platform.dto.AdminAuthDto;
import com.nexforever.platform.dto.ApiResponse;
import com.nexforever.platform.entity.AdminUser;
import com.nexforever.platform.repository.AdminUserRepository;
import com.nexforever.platform.security.AdminUserPrincipal;
import com.nexforever.platform.security.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.time.Duration;
import java.time.Instant;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUserRepository;
    private final RateLimiterService rateLimiterService;

    public AdminAuthController(
            AuthenticationManager authenticationManager,
            AdminUserRepository adminUserRepository,
            RateLimiterService rateLimiterService
    ) {
        this.authenticationManager = authenticationManager;
        this.adminUserRepository = adminUserRepository;
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/csrf")
    public ApiResponse<AdminAuthDto.CsrfTokenResponse> getCsrfToken(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (token == null) {
            token = (CsrfToken) request.getAttribute("_csrf");
        }
        if (token != null) {
            return ApiResponse.ok(new AdminAuthDto.CsrfTokenResponse(
                    token.getToken(),
                    token.getHeaderName(),
                    token.getParameterName()
            ));
        }
        return ApiResponse.ok(new AdminAuthDto.CsrfTokenResponse("", "X-XSRF-TOKEN", "_csrf"));
    }

    @PostMapping("/login")
    public ApiResponse<AdminAuthDto.AdminProfileResponse> login(
            @Valid @RequestBody AdminAuthDto.LoginRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse
    ) {
        String email = request.email().trim().toLowerCase();
        rateLimiterService.checkLimit(
                "admin-login",
                email,
                5,
                Duration.ofMinutes(15),
                "Too many login attempts. Please wait 15 minutes before trying again."
        );

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        SecurityContext sc = SecurityContextHolder.createEmptyContext();
        sc.setAuthentication(auth);
        SecurityContextHolder.setContext(sc);

        HttpSession session = servletRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

        AdminUserPrincipal principal = (AdminUserPrincipal) auth.getPrincipal();
        AdminUser admin = principal.getAdmin();
        admin.setLastLoginAt(Instant.now());
        adminUserRepository.save(admin);

        return ApiResponse.ok("Admin authenticated successfully.", new AdminAuthDto.AdminProfileResponse(
                admin.getId(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole(),
                admin.getLastLoginAt()
        ));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ApiResponse.ok("Logged out cleanly.", null);
    }

    @GetMapping("/me")
    public ApiResponse<AdminAuthDto.AdminProfileResponse> getCurrentAdmin(
            @AuthenticationPrincipal AdminUserPrincipal principal
    ) {
        AdminUser admin = principal.getAdmin();
        return ApiResponse.ok(new AdminAuthDto.AdminProfileResponse(
                admin.getId(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole(),
                admin.getLastLoginAt()
        ));
    }
}

