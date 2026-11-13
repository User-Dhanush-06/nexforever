package com.nexforever.platform.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Cors cors = new Cors();
    private final Security security = new Security();
    private final Admin admin = new Admin();
    private final Media media = new Media();
    private final Chitti chitti = new Chitti();

    public Cors getCors() { return cors; }
    public Security getSecurity() { return security; }
    public Admin getAdmin() { return admin; }
    public Media getMedia() { return media; }
    public Chitti getChitti() { return chitti; }

    public static class Cors {
        private List<String> allowedOrigins = List.of("http://localhost:5173", "http://127.0.0.1:5173");
        public List<String> getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(List<String> allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    }

    public static class Security {
        private String ipHashSalt = "nexforever-local-dev-salt";
        public String getIpHashSalt() { return ipHashSalt; }
        public void setIpHashSalt(String ipHashSalt) { this.ipHashSalt = ipHashSalt; }
    }

    public static class Admin {
        private final Bootstrap bootstrap = new Bootstrap();
        public Bootstrap getBootstrap() { return bootstrap; }

        public static class Bootstrap {
            private String email = "";
            private String password = "";
            private String fullName = "NexForever Studio Admin";
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getPassword() { return password; }
            public void setPassword(String password) { this.password = password; }
            public String getFullName() { return fullName; }
            public void setFullName(String fullName) { this.fullName = fullName; }
        }
    }

    public static class Media {
        private String uploadDir = "";
        public String getUploadDir() { return uploadDir; }
        public void setUploadDir(String uploadDir) { this.uploadDir = uploadDir; }
    }

    public static class Chitti {
        private final Ai ai = new Ai();
        public Ai getAi() { return ai; }

        public static class Ai {
            private boolean enabled = false;
            private String provider = "none";
            public boolean isEnabled() { return enabled; }
            public void setEnabled(boolean enabled) { this.enabled = enabled; }
            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
        }
    }
}

