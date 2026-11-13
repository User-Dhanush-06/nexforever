package com.nexforever.platform.config;

import com.nexforever.platform.entity.AdminUser;
import com.nexforever.platform.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;

    public AdminBootstrapRunner(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            AppProperties appProperties
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminUserRepository.count() > 0) {
            return;
        }

        AppProperties.Admin.Bootstrap cfg = appProperties.getAdmin().getBootstrap();
        String email = cfg.getEmail() != null ? cfg.getEmail().trim().toLowerCase() : "";
        String rawPassword = cfg.getPassword() != null ? cfg.getPassword() : "";

        if (email.isBlank() || rawPassword.isBlank()) {
            log.warn("No admins exist and ADMIN_EMAIL / ADMIN_PASSWORD are not set; skipping admin bootstrap.");
            return;
        }

        AdminUser admin = new AdminUser();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(rawPassword));
        admin.setFullName(
                cfg.getFullName() != null && !cfg.getFullName().isBlank()
                        ? cfg.getFullName().trim()
                        : "NexForever Studio Admin"
        );
        admin.setRole("ADMIN");
        admin.setActive(true);

        adminUserRepository.save(admin);
        log.info("Bootstrapped initial NexForever admin account for {}", email);
    }
}

