package com.nexforever.platform;

import com.nexforever.platform.config.AppProperties;
import com.nexforever.platform.dto.AdminAuthDto;
import com.nexforever.platform.dto.ChittiDto;
import com.nexforever.platform.dto.EnquiryDto;
import com.nexforever.platform.dto.ProjectDto;
import com.nexforever.platform.dto.SettingsDto;
import com.nexforever.platform.entity.ProjectStatus;
import com.nexforever.platform.repository.EnquiryRepository;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpCookie;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PlatformIntegrationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private AppProperties appProperties;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private CookieManager cookieManager;
    private HttpClient httpClient;
    private String baseUrl;

    @BeforeEach
    void setUp() {
        this.baseUrl = "http://localhost:" + port;
        this.cookieManager = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        this.httpClient = HttpClient.newBuilder()
                .cookieHandler(cookieManager)
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Test
    @DisplayName("Public: GET /api/services returns seeded services")
    void publicServicesEndpointReturnsData() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/services"))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(200);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        assertThat(root.get("data").isArray()).isTrue();
        assertThat(root.get("data").size()).isGreaterThanOrEqualTo(4);
        assertThat(root.get("data").get(0).get("serviceNumber").asText()).isEqualTo("01");
        assertThat(root.get("data").get(0).get("title").asText()).isEqualTo("Web Development");
    }

    @Test
    @DisplayName("Public: GET /api/projects returns empty list initially")
    void publicProjectsReturnsEmptyListInitially() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/projects"))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(200);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        assertThat(root.get("data").isArray()).isTrue();
    }

    @Test
    @DisplayName("Public: GET /api/faqs returns seeded studio questions")
    void publicFaqsReturnsSeededData() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/faqs"))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(200);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        assertThat(root.get("data").isArray()).isTrue();
        assertThat(root.get("data").size()).isGreaterThanOrEqualTo(4);

        List<String> questions = new java.util.ArrayList<>();
        List<Long> ids = new java.util.ArrayList<>();
        for (JsonNode item : root.get("data")) {
            questions.add(item.get("question").asText());
            ids.add(item.get("id").asLong());
        }

        assertThat(ids).contains(1L, 2L, 3L, 4L);
        assertThat(questions).contains(
                "How do we kick off a new project with NexForever?",
                "Can we combine multiple studio services or customize Launch, Grow & Elevate?",
                "How are scope, investment and schedule determined?",
                "Do you support responsive websites and interactive visual experiences?"
        );
    }

    @Test
    @DisplayName("Public: GET /api/settings returns brand and contact keys")
    void publicSettingsReturnsExpectedDefaults() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/settings"))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(200);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        assertThat(root.get("data").get("brand").get("name").asText()).isEqualTo("NexForever");
        assertThat(root.get("data").get("brand").get("tagline").asText()).isEqualTo("Built for What's Next. Made to Last.");
    }

    @Test
    @DisplayName("Public: POST /api/enquiries persists enquiry and rejects honeypot spam")
    void publicEnquirySubmissionAndHoneypot() throws Exception {
        long beforeCount = enquiryRepository.count();

        // Legitimate submission
        var validReq = new EnquiryDto.CreateRequest(
                "Alex Rivera",
                "alex@example.com",
                "Business / Brand",
                "Launch",
                "Web Development",
                "Starter Scope",
                "Priority Launch Goal",
                "We need a modern studio landing page for our new venture.",
                null
        );

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/enquiries"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(validReq)))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(201);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        long createdId = root.get("data").get("id").asLong();
        assertThat(root.get("data").get("referenceCode").asText()).startsWith("NF-");
        assertThat(enquiryRepository.count()).isEqualTo(beforeCount + 1);

        // Clean up test enquiry record
        enquiryRepository.deleteById(createdId);

        // Honeypot spam submission (should be rejected with 400 Bad Request)
        var spamReq = new EnquiryDto.CreateRequest(
                "Bot Spammer",
                "bot@spam.com",
                "Business / Brand",
                "Launch",
                "Web Development",
                "Starter Scope",
                "Priority Launch Goal",
                "Spamming links http://spam.com",
                "http://honeypot-trap.com"
        );

        HttpRequest spamHttpReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/enquiries"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(spamReq)))
                .build();

        HttpResponse<String> spamResp = httpClient.send(spamHttpReq, HttpResponse.BodyHandlers.ofString());
        assertThat(spamResp.statusCode()).isEqualTo(400);
    }

    @Test
    @DisplayName("Public: POST /api/chitti/chat responds with structured guidance")
    void publicChittiChatReturnsStructuredGuidance() throws Exception {
        var req = new ChittiDto.ChatRequest("Can you tell me about your services?", null, "home");

        HttpRequest httpReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(req)))
                .build();

        HttpResponse<String> resp = httpClient.send(httpReq, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(200);

        JsonNode root = objectMapper.readTree(resp.body());
        assertThat(root.get("success").asBoolean()).isTrue();
        assertThat(root.get("data").get("mode").asText()).isEqualTo("STRUCTURED_KNOWLEDGE");
        assertThat(root.get("data").get("aiConfigured").asBoolean()).isFalse();
        assertThat(root.get("data").get("reply").asText()).isNotEmpty();
    }

    @Test
    @DisplayName("Public: POST /api/chitti/chat conversational accuracy and intent routing")
    void publicChittiChatConversationalAccuracy() throws Exception {
        // 1. Identity & Name test ("What's your name?")
        var nameReq = new ChittiDto.ChatRequest("What's your name?", null, "home");
        HttpRequest httpNameReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(nameReq)))
                .build();

        HttpResponse<String> nameResp = httpClient.send(httpNameReq, HttpResponse.BodyHandlers.ofString());
        assertThat(nameResp.statusCode()).isEqualTo(200);
        JsonNode nameJson = objectMapper.readTree(nameResp.body());
        String nameReply = nameJson.get("data").get("reply").asText();
        assertThat(nameReply).containsIgnoringCase("Chitti");
        assertThat(nameReply).containsIgnoringCase("companion");
        assertThat(nameJson.get("data").get("matchedTopic").asText()).isEqualTo("Chitti Identity");

        // 2. Casual Greeting test ("Hi")
        var hiReq = new ChittiDto.ChatRequest("Hi", null, "home");
        HttpRequest httpHiReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(hiReq)))
                .build();

        HttpResponse<String> hiResp = httpClient.send(httpHiReq, HttpResponse.BodyHandlers.ofString());
        assertThat(hiResp.statusCode()).isEqualTo(200);
        JsonNode hiJson = objectMapper.readTree(hiResp.body());
        assertThat(hiJson.get("data").get("matchedTopic").asText()).isEqualTo("Greeting");

        // 3. Studio Identity test ("What does NexForever do?")
        var studioReq = new ChittiDto.ChatRequest("What does NexForever do?", null, "home");
        HttpRequest httpStudioReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(studioReq)))
                .build();

        HttpResponse<String> studioResp = httpClient.send(httpStudioReq, HttpResponse.BodyHandlers.ofString());
        assertThat(studioResp.statusCode()).isEqualTo(200);
        JsonNode studioJson = objectMapper.readTree(studioResp.body());
        assertThat(studioJson.get("data").get("matchedTopic").asText()).isEqualTo("About Studio");
        assertThat(studioJson.get("data").get("reply").asText()).containsIgnoringCase("creative technology studio");

        // 4. Follow-up query test ("Tell me more about web development")
        var webReq = new ChittiDto.ChatRequest("Tell me more about web development", null, "services");
        HttpRequest httpWebReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(webReq)))
                .build();

        HttpResponse<String> webResp = httpClient.send(httpWebReq, HttpResponse.BodyHandlers.ofString());
        assertThat(webResp.statusCode()).isEqualTo(200);
        JsonNode webJson = objectMapper.readTree(webResp.body());
        assertThat(webJson.get("data").get("matchedTopic").asText()).isEqualTo("Web Development");

        // 5. Unknown query fallback test ("Do you do plumbing?")
        var unknownReq = new ChittiDto.ChatRequest("Do you do plumbing?", null, "home");
        HttpRequest httpUnknownReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chitti/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(unknownReq)))
                .build();

        HttpResponse<String> unknownResp = httpClient.send(httpUnknownReq, HttpResponse.BodyHandlers.ofString());
        assertThat(unknownResp.statusCode()).isEqualTo(200);
        JsonNode unknownJson = objectMapper.readTree(unknownResp.body());
        assertThat(unknownJson.get("data").get("matchedTopic").asText()).isEqualTo("Companion Overview");
        assertThat(unknownJson.get("data").get("reply").asText()).containsIgnoringCase("specialize specifically in NexForever");
    }

    @Test
    @DisplayName("Security: Protected /api/admin endpoints reject unauthenticated access")
    void protectedAdminEndpointsRejectAnonymous() throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/dashboard"))
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertThat(resp.statusCode()).isEqualTo(401);
    }

    @Test
    @DisplayName("Admin Flow: CSRF token fetch, login, dashboard, project CRUD and settings update")
    void fullAdminAuthenticationAndCrudWorkflow() throws Exception {
        String adminEmail = appProperties.getAdmin().getBootstrap().getEmail();
        String adminPassword = appProperties.getAdmin().getBootstrap().getPassword();

        // 1. Fetch CSRF token
        HttpRequest csrfReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/auth/csrf"))
                .GET()
                .build();

        HttpResponse<String> csrfResp = httpClient.send(csrfReq, HttpResponse.BodyHandlers.ofString());
        assertThat(csrfResp.statusCode()).isEqualTo(200);

        JsonNode csrfNode = objectMapper.readTree(csrfResp.body());
        String xsrfToken = csrfNode.get("data").get("token").asText();

        // 2. Perform Admin Login
        var loginReq = new AdminAuthDto.LoginRequest(adminEmail, adminPassword);

        HttpRequest loginHttpReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(loginReq)))
                .build();

        HttpResponse<String> loginResp = httpClient.send(loginHttpReq, HttpResponse.BodyHandlers.ofString());
        assertThat(loginResp.statusCode()).isEqualTo(200);

        JsonNode loginNode = objectMapper.readTree(loginResp.body());
        assertThat(loginNode.get("success").asBoolean()).isTrue();
        assertThat(loginNode.get("data").get("email").asText()).isEqualTo(adminEmail);

        // Retrieve current XSRF cookie if updated by session
        for (HttpCookie cookie : cookieManager.getCookieStore().getCookies()) {
            if ("XSRF-TOKEN".equals(cookie.getName())) {
                xsrfToken = cookie.getValue();
            }
        }

        // 3. Access Protected Dashboard
        HttpRequest dashReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/dashboard"))
                .GET()
                .build();

        HttpResponse<String> dashResp = httpClient.send(dashReq, HttpResponse.BodyHandlers.ofString());
        assertThat(dashResp.statusCode()).isEqualTo(200);

        JsonNode dashNode = objectMapper.readTree(dashResp.body());
        assertThat(dashNode.get("data").get("totalServices").asInt()).isGreaterThanOrEqualTo(4);

        // 4. Create Project as Admin
        var projectReq = new ProjectDto.SaveRequest(
                "aurora-studio-platform",
                "Aurora Studio Platform",
                "Web Development",
                "Aurora Creative",
                "Next-generation digital studio web application.",
                "Comprehensive overview of Aurora Studio build.",
                "Integrating real-time 3D and high performance.",
                "Custom component pipeline.",
                List.of("45% increase in lead conversion"),
                List.of("React", "Three.js", "Spring Boot"),
                "/images/projects/aurora-cover.jpg",
                "https://aurora.example.com",
                "https://github.com/nexforever/aurora",
                ProjectStatus.PUBLISHED,
                true,
                1,
                List.of()
        );

        // Verify CSRF enforcement: authenticated mutation without X-XSRF-TOKEN must fail with 403
        HttpRequest noCsrfProjReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/projects"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(projectReq)))
                .build();
        HttpResponse<String> noCsrfResp = httpClient.send(noCsrfProjReq, HttpResponse.BodyHandlers.ofString());
        assertThat(noCsrfResp.statusCode()).isEqualTo(403);

        HttpRequest createProjReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/projects"))
                .header("Content-Type", "application/json")
                .header("X-XSRF-TOKEN", xsrfToken)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(projectReq)))
                .build();

        HttpResponse<String> createProjResp = httpClient.send(createProjReq, HttpResponse.BodyHandlers.ofString());
        assertThat(createProjResp.statusCode()).isEqualTo(201);
        long projectId = objectMapper.readTree(createProjResp.body()).get("data").get("id").asLong();

        // 5. Verify Project is now immediately visible on Public API
        HttpRequest pubProjReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/projects/aurora-studio-platform"))
                .GET()
                .build();

        HttpResponse<String> pubProjResp = httpClient.send(pubProjReq, HttpResponse.BodyHandlers.ofString());
        assertThat(pubProjResp.statusCode()).isEqualTo(200);

        JsonNode pubNode = objectMapper.readTree(pubProjResp.body());
        assertThat(pubNode.get("data").get("title").asText()).isEqualTo("Aurora Studio Platform");

        // 6. Update Site Settings as Admin
        var settingsReq = new SettingsDto.UpdateRequest(Map.of(
                "brand.availability", "Booking Q1 Projects",
                "contact.email", "hello@nexforever.studio"
        ));

        HttpRequest updateSetReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/settings"))
                .header("Content-Type", "application/json")
                .header("X-XSRF-TOKEN", xsrfToken)
                .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(settingsReq)))
                .build();

        HttpResponse<String> updateSetResp = httpClient.send(updateSetReq, HttpResponse.BodyHandlers.ofString());
        assertThat(updateSetResp.statusCode()).isEqualTo(200);

        // 7. Verify Public Settings reflect updated availability
        HttpRequest pubSetReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/settings"))
                .GET()
                .build();

        HttpResponse<String> pubSetResp = httpClient.send(pubSetReq, HttpResponse.BodyHandlers.ofString());
        assertThat(pubSetResp.statusCode()).isEqualTo(200);

        JsonNode pubSetNode = objectMapper.readTree(pubSetResp.body());
        assertThat(pubSetNode.get("data").get("brand").get("availability").asText()).isEqualTo("Booking Q1 Projects");
        assertThat(pubSetNode.get("data").get("contact").get("email").asText()).isEqualTo("hello@nexforever.studio");

        // 8. Clean up test project and restore baseline settings
        HttpRequest deleteProjReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/projects/" + projectId))
                .header("X-XSRF-TOKEN", xsrfToken)
                .DELETE()
                .build();
        assertThat(httpClient.send(deleteProjReq, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(200);

        var restoreReq = new SettingsDto.UpdateRequest(Map.of(
                "brand.availability", "Available for New Projects",
                "contact.email", ""
        ));
        HttpRequest restoreSetReq = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/admin/settings"))
                .header("Content-Type", "application/json")
                .header("X-XSRF-TOKEN", xsrfToken)
                .PUT(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(restoreReq)))
                .build();
        assertThat(httpClient.send(restoreSetReq, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(200);
    }
}
