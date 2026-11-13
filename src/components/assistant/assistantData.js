/**
 * NexForever — CHITTI Companion Knowledge & Contextual Section Guidance
 * ─────────────────────────────────────────────────────────────
 * Natural, friendly companion knowledge base and contextual prompts for CHITTI.
 * Warm, playful, curious, and helpful studio guide (offline-safe, no external AI key needed).
 * ─────────────────────────────────────────────────────────────
 */

export const chittiWelcomeGreetings = [
  "Hey there! I'm Chitti, your friendly guide around NexForever! 🚀 Looking around the studio? I can show you our craft, match the right service to your vision, or walk you through starting a project!",
  "Hi friend! I'm Chitti. Exploring our creative technology space? Whether you're curious about our code, video storytelling, or planning a launch, I'm right here with you!",
  "Welcome! Chitti at your service. Take your time looking around — if you want to explore our capabilities or see how we work with brands and creators, just tap or ask!",
];

export const sectionWelcomePrompts = {
  home: "Hey! I'm Chitti. Looking around? Let me show you what we craft at NexForever!",
  about: "Curious how our small team unites engineering, design and visual storytelling?",
  services: "Exploring our capabilities? I can help find the perfect service blend for your project!",
  portfolio: "Checking out our work? Swipe through the showcase or tap any card for deep breakdowns!",
  approach: "Wondering how we work together? Here's our clear 4-stage path from Discover to Deliver.",
  contact: "Planning a project? I can help you pick the best track in our 2-minute inquiry wizard!",
};

export const sectionSuggestions = {
  home: [
    { id: 'identity', question: "Who are you, Chitti?" },
    { id: 'who', question: 'What is NexForever all about?' },
    { id: 'services', question: 'What kind of work do you do?' },
    { id: 'packages', question: 'How do Launch, Grow & Elevate work?' },
    { id: 'contact', question: 'How do we kick off a project?' },
  ],
  about: [
    { id: 'team', question: 'How does your collaborative model work?' },
    { id: 'audience', question: 'Who do you usually build for?' },
    { id: 'work', question: 'Show me your portfolio showcase' },
  ],
  services: [
    { id: 'service_pick', question: 'Which service fits my idea?' },
    { id: 'web_dev', question: 'Tell me about Web Development' },
    { id: 'video_prod', question: 'Tell me about Video Production' },
    { id: 'packages', question: 'How do Launch, Grow & Elevate work?' },
    { id: 'custom_scope', question: 'Can we combine multiple services?' },
  ],
  portfolio: [
    { id: 'work', question: 'How does the case study gallery work?' },
    { id: 'similar', question: 'Can we build something similar?' },
    { id: 'contact', question: 'Ready to start our own project!' },
  ],
  approach: [
    { id: 'stages', question: 'How do the 4 workflow stages work?' },
    { id: 'timeline', question: 'How are timeline and scope scoped?' },
    { id: 'contact', question: "Let's kick off stage 1 Discover" },
  ],
  contact: [
    { id: 'wizard_guide', question: 'How does the Inquiry Wizard work?' },
    { id: 'flexible_budget', question: 'What if our budget or scope is flexible?' },
    { id: 'whatsapp_direct', question: 'Can I message you on WhatsApp?' },
  ],
};

export const companionResponses = {
  identity: {
    reply:
      "I'm Chitti! 🤖 Your friendly NexForever studio companion. I'm here to guide you through our services, showcase our work, answer studio questions, and help you start a project whenever you're ready.",
    action: { label: 'Explore Services', target: '#services' },
  },
  name: {
    reply:
      "I'm Chitti! 🤖 Your friendly NexForever studio companion. I'm here to guide you through our services, showcase our work, answer studio questions, and help you start a project whenever you're ready.",
    action: { label: 'Explore Services', target: '#services' },
  },
  who: {
    reply:
      "NexForever is an independent creative technology studio! We're a close-knit collaborative team combining web development, video production, creative design, and digital marketing. We help businesses and creators build digital experiences that feel next-generation and are built to last.",
    action: { label: 'Explore About Us', target: '#about' },
  },
  services: {
    reply:
      "We bring four core capabilities together under one roof: 💻 Web Development (modern platforms & web apps), 🎬 Video Production (cinematic storytelling & creator content), 🎨 Creative Design (identities & visual systems), and 📈 Digital Marketing (audience reach & growth). Which one caught your eye?",
    action: { label: 'Explore Services', target: '#services' },
  },
  web_dev: {
    reply:
      "Our Web Development covers responsive websites, web applications, landing pages, and business platforms. We build mobile-first with clean component architecture, snappy performance, and immersive 3D/interactive touches when they enhance the experience!",
    action: { label: 'View Web Dev in Services', target: '#services' },
  },
  video_prod: {
    reply:
      "From promotional videos and personal branding reels to cinematic videography and crisp post-production editing — we turn raw ideas into engaging visual stories crafted for modern digital platforms.",
    action: { label: 'View Video Production', target: '#services' },
  },
  design_brand: {
    reply:
      "We design complete visual identity systems: logos, typography, social media design suites, visiting cards, posters, and brand guidelines that give you a strong, memorable presence across print and digital touchpoints.",
    action: { label: 'View Creative Design', target: '#services' },
  },
  marketing_growth: {
    reply:
      "Our Digital Marketing focus is on strategic distribution: social media management, creative campaign execution, and optimization to help your brand stay visible, relevant, and consistently growing.",
    action: { label: 'View Digital Marketing', target: '#services' },
  },
  audience: {
    reply:
      "We build for two primary audiences: growing businesses and startups who need dependable full-stack digital foundations, plus content creators and independent professionals who want standout visual identities and media workflows. You get the best of both worlds!",
    action: { label: 'View Tailored Tracks', target: '#audience-solutions' },
  },
  packages: {
    reply:
      "Think of Launch, Grow, and Elevate as flexible starting points, never rigid monthly subscriptions! Launch gets you out the door with a solid foundation, Grow expands your footprint and media reach, and Elevate gives you comprehensive, high-touch platform execution tailored to your deliverables.",
    action: { label: 'Explore Packages', target: '#packages' },
  },
  work: {
    reply:
      "Our Work section is an interactive horizontal showcase! You can filter by category, drag or swipe through the carousel, and tap any card to open a full case study breakdown with challenges, tech stacks, and live preview links.",
    action: { label: 'Browse Our Work', target: '#portfolio' },
  },
  similar: {
    reply:
      "We love building custom solutions tailored to your unique brand! Share a few details in our Inquiry Wizard and we'll craft an architecture that matches your vision.",
    action: { label: 'Share Your Idea', target: '#contact' },
  },
  contact: {
    reply:
      "Whenever you're ready, our 3-step Project Inquiry Wizard in the Contact section makes sharing your idea effortless. Pick your track, choose your scope preference, and drop us a message — our studio team reviews every lead directly!",
    action: { label: 'Open Inquiry Wizard', target: '#contact' },
  },
  team: {
    reply:
      "We operate as a small, focused collaborative team. No middle management or bloated agency layers — you collaborate directly with the creators and engineers building your project.",
    action: { label: 'Read Our Story', target: '#about' },
  },
  service_pick: {
    reply:
      "Tell me a bit about what you're imagining! Need a web platform or interactive site? That's Web Development. Need video editing, YouTube production, or launch reels? Video Production. Need identity or social designs? Creative Design. We often blend multiple disciplines seamlessly!",
    action: { label: 'Check All Services', target: '#services' },
  },
  custom_scope: {
    reply:
      "Absolutely! Most of our favorite collaborations combine web engineering with visual video assets and brand design. We scope deliverables around your exact goals during our Discover stage.",
    action: { label: 'Configure Scope in Contact', target: '#contact' },
  },
  stages: {
    reply:
      "Our four-stage workflow is: 1. Discover (understanding goals & requirements), 2. Strategize (architecture & visual direction), 3. Create (development, design & production), and 4. Deliver (polish, testing & smooth launch). Clean, clear, and dependable.",
    action: { label: 'See Workflow', target: '#approach' },
  },
  timeline: {
    reply:
      "Timelines and scope are tailored during our Strategize phase based on what you actually need delivered, rather than fixed rigid assumptions. We move quickly and keep communication crystal clear.",
    action: { label: 'Learn About Scoping', target: '#approach' },
  },
  wizard_guide: {
    reply:
      "The Project Inquiry Wizard takes less than 2 minutes! Step 1 picks who you are and your primary service. Step 2 selects a flexible package framework and estimated timeline. Step 3 takes your name, email and project idea. Once submitted, it's saved straight to our studio desk!",
    action: { label: 'Try the Wizard', target: '#contact' },
  },
  flexible_budget: {
    reply:
      "Totally fine! Both our budget and planning window options include 'Flexible / To Be Discussed'. We believe in transparent scoping based on real deliverables rather than pushing rigid pricing packages.",
    action: { label: 'Start Flexible Inquiry', target: '#contact' },
  },
  whatsapp_direct: {
    reply:
      "Yes! If you prefer a quick direct conversation, our Contact section includes a direct WhatsApp link so you can chat right with our studio team.",
    action: { label: 'Go to Contact & WhatsApp', target: '#contact' },
  },
};
