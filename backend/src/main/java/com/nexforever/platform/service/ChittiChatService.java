package com.nexforever.platform.service;

import com.nexforever.platform.config.AppProperties;
import com.nexforever.platform.dto.ChittiDto;
import com.nexforever.platform.entity.Faq;
import com.nexforever.platform.entity.StudioService;
import com.nexforever.platform.repository.FaqRepository;
import com.nexforever.platform.repository.StudioServiceRepository;
import com.nexforever.platform.service.ai.AiProviderAdapter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChittiChatService {

    private static final List<ChittiDto.SuggestionItem> DEFAULT_SUGGESTIONS = List.of(
            new ChittiDto.SuggestionItem("name", "Who are you, Chitti?"),
            new ChittiDto.SuggestionItem("who", "What is NexForever all about?"),
            new ChittiDto.SuggestionItem("services", "What kind of work do you do?"),
            new ChittiDto.SuggestionItem("packages", "How do Launch, Grow & Elevate work?"),
            new ChittiDto.SuggestionItem("audience", "Who do you build for?"),
            new ChittiDto.SuggestionItem("work", "Show me your portfolio showcase"),
            new ChittiDto.SuggestionItem("contact", "How do we start a project?")
    );

    private static final java.util.Set<String> STOP_WORDS = java.util.Set.of(
            "what", "when", "where", "which", "who", "whom", "whose", "why", "how",
            "was", "were", "with", "for", "the", "and", "that", "this", "from",
            "have", "has", "had", "does", "done", "your", "ours", "their", "about",
            "into", "over", "after", "been", "being", "will", "would", "shall", "should"
    );

    private final StudioServiceRepository serviceRepository;
    private final FaqRepository faqRepository;
    private final AiProviderAdapter aiProviderAdapter;
    private final AppProperties appProperties;

    public ChittiChatService(
            StudioServiceRepository serviceRepository,
            FaqRepository faqRepository,
            AiProviderAdapter aiProviderAdapter,
            AppProperties appProperties
    ) {
        this.serviceRepository = serviceRepository;
        this.faqRepository = faqRepository;
        this.aiProviderAdapter = aiProviderAdapter;
        this.appProperties = appProperties;
    }

    @Transactional(readOnly = true)
    public ChittiDto.ChatResponse chat(ChittiDto.ChatRequest request) {
        String questionId = request.questionId() != null ? request.questionId().trim().toLowerCase(Locale.ROOT) : "";
        String text = request.message() != null ? request.message().trim() : "";

        // 1. Direct question chip matching
        if (!questionId.isBlank()) {
            ChittiDto.ChatResponse canned = handleKnownId(questionId);
            if (canned != null) return canned;
        }

        // 2. Keyword & Intent matching against studio companion knowledge
        String lower = text.toLowerCase(Locale.ROOT);

        // A. Bot Identity & Name (Handled FIRST to prevent misrouting)
        if (lower.matches(".*\\b(what('?s|\\s+is)\\s+(your|ur)\\s+name|who\\s+are\\s+you|who\\s+is\\s+chitti|what\\s+are\\s+you\\s+called|call\\s+you|your\\s+name)\\b.*")
                || lower.equals("chitti")
                || lower.equals("who are you")
                || lower.equals("what is your name")
                || lower.equals("what's your name")) {
            return new ChittiDto.ChatResponse(
                    "I'm Chitti! 🤖 Your friendly NexForever studio companion. I'm here to guide you through our services, showcase our work, answer studio questions, and help you start a project whenever you're ready.",
                    new ChittiDto.ActionLink("Explore Services", "#services"),
                    "Chitti Identity",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // B. Casual Greetings
        if (lower.matches("^\\s*(hi|hello|hey|hey there|greetings|good morning|good afternoon|good evening|yo|what's up|howdy)\\b.*") && lower.length() < 30) {
            return new ChittiDto.ChatResponse(
                    "Hey there! Great to meet you. I'm Chitti, your studio guide. Whether you're curious about our code, video storytelling, or planning a launch, I'm right here with you!",
                    new ChittiDto.ActionLink("Explore Services", "#services"),
                    "Greeting",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // C. Studio Identity (What is NexForever / About Us)
        if (lower.matches(".*\\b(what\\s+is\\s+nexforever|what\\s+does\\s+nexforever\\s+do|about\\s+nexforever|who\\s+is\\s+nexforever|about\\s+the\\s+studio|what\\s+is\\s+this\\s+studio)\\b.*")
                || (lower.contains("nexforever") && (lower.contains("about") || lower.contains("what") || lower.contains("do") || lower.contains("is")))
                || (lower.contains("about") && (lower.contains("studio") || lower.contains("company") || lower.contains("team") || lower.contains("us")))) {
            return new ChittiDto.ChatResponse(
                    "NexForever is an independent creative technology studio combining web development, video production, creative design, and digital marketing. We help businesses and creators build digital experiences that feel next-generation and are made to last.",
                    new ChittiDto.ActionLink("Explore About Us", "#about"),
                    "About Studio",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // D. Specific Service Queries & Follow-ups
        if (lower.contains("web development") || lower.contains("web dev") || lower.contains("website") || lower.contains("frontend") || lower.contains("full stack") || lower.contains("react") || lower.contains("web app")) {
            return new ChittiDto.ChatResponse(
                    "Our Web Development covers responsive websites, web applications, landing pages, and business platforms. We build mobile-first with clean component architecture, snappy performance, and smooth interactive touches.",
                    new ChittiDto.ActionLink("View Web Development", "#services"),
                    "Web Development",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        if (lower.contains("video production") || lower.contains("video editing") || lower.contains("cinematic") || lower.contains("reels") || lower.contains("youtube") || lower.contains("videography") || (lower.contains("video") && !lower.contains("game"))) {
            return new ChittiDto.ChatResponse(
                    "Our Video Production turns ideas into engaging visual stories crafted for modern digital platforms. From promotional videos and personal branding reels to cinematic videography and crisp post-production editing.",
                    new ChittiDto.ActionLink("View Video Production", "#services"),
                    "Video Production",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        if (lower.contains("creative design") || lower.contains("branding") || lower.contains("logo") || lower.contains("visual identity") || lower.contains("poster") || lower.contains("graphic design")) {
            return new ChittiDto.ChatResponse(
                    "Our Creative Design builds complete visual identity systems: logos, typography, social media design suites, visiting cards, posters, and brand guidelines that give you a strong, memorable presence across print and digital.",
                    new ChittiDto.ActionLink("View Creative Design", "#services"),
                    "Creative Design",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        if (lower.contains("digital marketing") || lower.contains("social media management") || lower.contains("campaign") || lower.contains("marketing") || lower.contains("seo") || lower.contains("growth")) {
            return new ChittiDto.ChatResponse(
                    "Our Digital Marketing focuses on strategic distribution and growth: social media management, creative campaign execution, and optimization to help your brand stay visible, relevant, and consistently growing.",
                    new ChittiDto.ActionLink("View Digital Marketing", "#services"),
                    "Digital Marketing",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // E. Contact & Inquiry (Prioritized to capture "start a project", "kick off", "hire")
        if (lower.matches(".*\\b(contact|enquir|enquiry|enquiries|hire|start\\s+(a\\s+)?project|kick\\s*off|touch|quote|wizard|work\\s+together)\\b.*")) {
            return new ChittiDto.ChatResponse(
                    "Whenever you're ready, our 3-step Project Inquiry Wizard in the Contact section makes sharing your idea effortless. Pick your track, choose your scope preference, and drop us a message — our studio desk reviews every inquiry directly!",
                    new ChittiDto.ActionLink("Open Inquiry Wizard", "#contact"),
                    "Project Inquiry",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // F. Direct WhatsApp
        if (lower.contains("whatsapp") || lower.contains("chat directly") || lower.matches(".*\\b(phone|call\\s+you)\\b.*")) {
            return new ChittiDto.ChatResponse(
                    "Yes! If you prefer a quick direct conversation, our Contact section includes a direct WhatsApp link so you can chat right with our studio team.",
                    new ChittiDto.ActionLink("Go to Contact & WhatsApp", "#contact"),
                    "Direct Contact",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // G. General Services & Capabilities
        if (lower.contains("service") || lower.contains("offer") || lower.contains("capabilit") || lower.contains("what can you do") || lower.contains("what do you do") || lower.contains("kind of work")) {
            List<String> titles = serviceRepository.findAllByPublishedTrueOrderByDisplayOrderAscIdAsc().stream()
                    .map(StudioService::getTitle)
                    .toList();
            String listStr = !titles.isEmpty() ? String.join(", ", titles) : "Web Development, Video Production & Content Creation, Creative Design & Branding, and Digital Marketing";
            return new ChittiDto.ChatResponse(
                    "We bring four core capabilities together under one roof: " + listStr + ". We blend code, visual design, and storytelling so your digital presence feels completely cohesive.",
                    new ChittiDto.ActionLink("Explore Services", "#services"),
                    "Studio Services",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // H. Packages & Pricing (Uses word boundaries to avoid false positives like "collaborate" -> "rate")
        if (lower.matches(".*\\b(package|packages|launch|grow|elevate|pricing|price|prices|cost|costs|rate|rates|how much|fee|fees)\\b.*")) {
            return new ChittiDto.ChatResponse(
                    "We offer three flexible starting frameworks: Launch, Grow, and Elevate — never rigid subscriptions! Launch gets you out the door with a strong foundation, Grow expands your audience and reach, and Elevate gives you high-touch platform execution tailored to your deliverables.",
                    new ChittiDto.ActionLink("Explore Packages", "#packages"),
                    "Studio Packages",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // I. Target Audience & Clients (Strict intent checking to prevent false positives)
        if (lower.matches(".*\\b(who\\s+do\\s+you\\s+(build|work|create)\\s+for|target\\s+audience|clients|who\\s+are\\s+your\\s+clients|who\\s+is\\s+this\\s+for|who\\s+do\\s+you\\s+serve|customer|creator|business\\s+or\\s+creator)\\b.*")) {
            return new ChittiDto.ChatResponse(
                    "We build for two main groups under one roof: growing businesses and startups establishing dependable digital platforms, plus content creators and personal brands building distinctive visual identities and content workflows.",
                    new ChittiDto.ActionLink("View Tailored Tracks", "#audience-solutions"),
                    "Target Audiences",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // J. Portfolio & Projects
        if (lower.matches(".*\\b(portfolio|showcase|case\\s+stud(y|ies)|past\\s+work|recent\\s+work|client\\s+work|previous\\s+projects|featured\\s+projects)\\b.*")
                || (lower.contains("work") && !lower.contains("network") && !lower.contains("how you work") && !lower.contains("work together"))
                || (lower.contains("project") && (lower.contains("show") || lower.contains("view") || lower.contains("see") || lower.contains("past") || lower.contains("example")))) {
            return new ChittiDto.ChatResponse(
                    "Our Work section is an interactive showcase of our featured projects. You can filter by category, swipe through the gallery, or tap any card for a full case study breakdown with challenges, tech stacks, and live previews.",
                    new ChittiDto.ActionLink("Browse Our Work", "#portfolio"),
                    "Portfolio",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // K. Workflow & Approach
        if (lower.matches(".*\\b(approach|process|stages|workflow|deliver|methodology|how\\s+do\\s+you\\s+work|collaborat)\\b.*")) {
            return new ChittiDto.ChatResponse(
                    "Our four-stage workflow is: 1. Discover (understanding goals & requirements), 2. Strategize (architecture & visual direction), 3. Create (development, design & production), and 4. Deliver (polish, testing & smooth launch). Clean, clear, and dependable.",
                    new ChittiDto.ActionLink("Explore Our Approach", "#approach"),
                    "Workflow Approach",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // L. Team & Studio Model
        if (lower.contains("team") || lower.contains("collaborat") || lower.contains("agency") || lower.contains("how you work") || lower.contains("who runs")) {
            return new ChittiDto.ChatResponse(
                    "We operate as a small, focused collaborative team. No middle management or bloated agency layers — you collaborate directly with the creators and engineers building your project.",
                    new ChittiDto.ActionLink("Read Our Story", "#about"),
                    "Studio Team",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
        }

        // 3. Match against dynamic FAQs in MySQL
        List<Faq> faqs = faqRepository.findAllByPublishedTrueOrderByDisplayOrderAscIdAsc();
        for (Faq faq : faqs) {
            String q = faq.getQuestion().toLowerCase(Locale.ROOT);
            if (isFaqMatch(lower, q)) {
                return new ChittiDto.ChatResponse(
                        faq.getAnswer(),
                        new ChittiDto.ActionLink("Explore Our Approach", "#approach"),
                        "FAQ: " + faq.getCategory(),
                        "STRUCTURED_KNOWLEDGE",
                        aiProviderAdapter.isAvailable(),
                        aiProviderAdapter.getProviderName(),
                        DEFAULT_SUGGESTIONS
                );
            }
        }

        // 4. Fallback to modular AI adapter (if configured in future)
        if (appProperties.getChitti().getAi().isEnabled() && aiProviderAdapter.isAvailable()) {
            Optional<String> aiReply = aiProviderAdapter.generateReply(text, "NexForever Studio");
            if (aiReply.isPresent()) {
                return new ChittiDto.ChatResponse(
                        aiReply.get(),
                        new ChittiDto.ActionLink("Open Inquiry Wizard", "#contact"),
                        "AI Assisted",
                        "AI_PROVIDER",
                        true,
                        aiProviderAdapter.getProviderName(),
                        DEFAULT_SUGGESTIONS
                );
            }
        }

        // 5. Friendly companion structured fallback
        return new ChittiDto.ChatResponse(
                "I specialize specifically in NexForever's creative technology studio services. I can guide you through our Web Development, Video Production, Creative Design, Digital Marketing, or flexible Launch, Grow, and Elevate packages. Would you like to explore our capabilities or discuss a custom project?",
                new ChittiDto.ActionLink("Explore Services", "#services"),
                "Companion Overview",
                "STRUCTURED_KNOWLEDGE",
                false,
                "none",
                DEFAULT_SUGGESTIONS
        );
    }

    private ChittiDto.ChatResponse handleKnownId(String id) {
        return switch (id) {
            case "name", "identity", "chitti" -> new ChittiDto.ChatResponse(
                    "I'm Chitti! 🤖 Your friendly NexForever studio companion. I'm here to guide you through our services, showcase our work, answer studio questions, and help you start a project whenever you're ready.",
                    new ChittiDto.ActionLink("Explore Services", "#services"),
                    "Chitti Identity",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "who", "intro" -> new ChittiDto.ChatResponse(
                    "NexForever is an independent creative technology studio combining web development, video production, creative design and digital marketing. We operate as a close collaborative team helping businesses and creators build digital experiences that feel next-generation and are made to last.",
                    new ChittiDto.ActionLink("Explore About Us", "#about"),
                    "About Studio",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "team" -> new ChittiDto.ChatResponse(
                    "We operate as a small, focused collaborative team. No middle management or bloated agency layers — you collaborate directly with the creators and engineers building your project.",
                    new ChittiDto.ActionLink("Read Our Story", "#about"),
                    "Studio Team",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "audience" -> new ChittiDto.ChatResponse(
                    "We build for two main groups under one roof: growing businesses and startups establishing dependable digital platforms, plus content creators and personal brands building distinctive visual identities and content workflows.",
                    new ChittiDto.ActionLink("View Tailored Tracks", "#audience-solutions"),
                    "Target Audiences",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "services", "service_pick" -> new ChittiDto.ChatResponse(
                    "We bring four core capabilities together: Web Development, Video Production & Content Creation, Creative Design & Branding, and Digital Marketing. Tell me about your idea, and we can match the right scope!",
                    new ChittiDto.ActionLink("Explore Services", "#services"),
                    "Studio Services",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "web_dev" -> new ChittiDto.ChatResponse(
                    "Our Web Development covers responsive websites, web applications, landing pages, and business platforms. We build mobile-first with clean component architecture and smooth performance!",
                    new ChittiDto.ActionLink("Explore Web Development", "#services"),
                    "Web Development",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "video_prod" -> new ChittiDto.ChatResponse(
                    "From promotional videos and personal branding reels to cinematic videography and crisp post-production editing — we turn raw ideas into engaging visual stories crafted for modern digital platforms.",
                    new ChittiDto.ActionLink("Explore Video Production", "#services"),
                    "Video Production",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "design_brand" -> new ChittiDto.ChatResponse(
                    "We design complete visual identity systems: logos, typography, social media design suites, visiting cards, posters, and brand guidelines that give you a strong, memorable presence across print and digital touchpoints.",
                    new ChittiDto.ActionLink("Explore Creative Design", "#services"),
                    "Creative Design",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "marketing_growth" -> new ChittiDto.ChatResponse(
                    "Our Digital Marketing focus is on strategic distribution: social media management, creative campaign execution, and optimization to help your brand stay visible, relevant, and consistently growing.",
                    new ChittiDto.ActionLink("Explore Digital Marketing", "#services"),
                    "Digital Marketing",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "packages" -> new ChittiDto.ChatResponse(
                    "Think of Launch, Grow and Elevate as flexible starting points, never rigid subscriptions! Launch gets you out the door with a strong foundation, Grow expands your audience and reach, and Elevate gives you high-touch platform execution tailored to your deliverables.",
                    new ChittiDto.ActionLink("Explore Packages", "#packages"),
                    "Studio Packages",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "custom_scope" -> new ChittiDto.ChatResponse(
                    "Most of our favorite collaborations combine web engineering with visual video assets and brand design. We scope deliverables around your exact goals during our Discover stage.",
                    new ChittiDto.ActionLink("Configure Scope in Contact", "#contact"),
                    "Custom Scope",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "work", "similar" -> new ChittiDto.ChatResponse(
                    "Our Work section is an interactive horizontal showcase. You can filter by category, drag or swipe through the carousel, and tap any card to open a full case study breakdown with challenges, tech stacks, and preview links.",
                    new ChittiDto.ActionLink("Browse Our Work", "#portfolio"),
                    "Portfolio",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "stages", "timeline" -> new ChittiDto.ChatResponse(
                    "Our four-stage workflow is: 1. Discover (understanding goals & requirements), 2. Strategize (architecture & visual direction), 3. Create (development, design & production), and 4. Deliver (polish, testing & smooth launch). Clean, clear, and dependable.",
                    new ChittiDto.ActionLink("Explore Our Approach", "#approach"),
                    "Workflow Stages",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "contact", "wizard_guide", "flexible_budget" -> new ChittiDto.ChatResponse(
                    "Whenever you're ready, our 3-step Project Inquiry Wizard in the Contact section makes sharing your idea effortless. Pick your track, choose your scope preference, and drop us a message — our studio desk reviews every lead directly!",
                    new ChittiDto.ActionLink("Open Inquiry Wizard", "#contact"),
                    "Project Inquiry",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            case "whatsapp_direct" -> new ChittiDto.ChatResponse(
                    "Yes! If you prefer a quick direct conversation, our Contact section includes a direct WhatsApp link so you can chat right with our studio team.",
                    new ChittiDto.ActionLink("Go to Contact & WhatsApp", "#contact"),
                    "Direct Contact",
                    "STRUCTURED_KNOWLEDGE",
                    aiProviderAdapter.isAvailable(),
                    aiProviderAdapter.getProviderName(),
                    DEFAULT_SUGGESTIONS
            );
            default -> null;
        };
    }

    private boolean isFaqMatch(String userQuery, String faqQuestion) {
        String cleanFaq = faqQuestion.trim().toLowerCase(Locale.ROOT);
        String cleanUser = userQuery.trim().toLowerCase(Locale.ROOT);
        if (cleanUser.equals(cleanFaq)) {
            return true;
        }

        String[] tokens = cleanFaq.split("[^a-zA-Z0-9]+");
        int matches = 0;
        int meaningful = 0;
        for (String t : tokens) {
            if (t.length() > 3 && !STOP_WORDS.contains(t)) {
                meaningful++;
                if (cleanUser.contains(t)) {
                    matches++;
                }
            }
        }
        if (meaningful >= 2) {
            return ((double) matches / meaningful) >= 0.5 && matches >= 2;
        } else if (meaningful == 1) {
            return matches == 1 && cleanUser.contains(tokens[0]) && cleanUser.length() > 10;
        }
        return false;
    }
}
