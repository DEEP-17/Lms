import LayoutModel from "../models/layout.model";
import connectDB from "./db";

const initializeLayoutData = async () => {
  try {
    await connectDB();

    // Check if layout data already exists
    const existingLayout = await LayoutModel.findOne();

    if (existingLayout) {
      console.log("Layout data already exists. Skipping initialization.");
      return;
    }

    // Default layout data for cyber security platform
    const defaultLayout = {
      type: "layout",
      faq: [
        {
          question: "What cyber security courses do you offer?",
          answer:
            "We offer comprehensive cyber security courses including ethical hacking, penetration testing, network security, incident response, security analysis, and compliance training like CISSP, CEH, and CompTIA Security+.",
        },
        {
          question: "Are your cyber security courses hands-on?",
          answer:
            "Yes! All our courses include practical labs, real-world scenarios, and hands-on exercises using industry-standard tools and techniques. You'll work with actual security tools and practice on our secure lab environment.",
        },
        {
          question: "Do you provide cyber security certifications?",
          answer:
            "Absolutely! Our courses prepare you for major cyber security certifications including CEH, CISSP, CompTIA Security+, OSCP, and more. We provide exam preparation materials and practice tests.",
        },
        {
          question: "What if I'm new to cyber security?",
          answer:
            "We have courses for all skill levels, from complete beginners to advanced professionals. Our foundational courses cover basic concepts before moving to advanced topics. No prior experience required!",
        },
        {
          question: "Do you offer live cyber security training?",
          answer:
            "Yes, we offer both self-paced online courses and live instructor-led training sessions. Our live sessions include real-time Q&A, group discussions, and hands-on guided practice.",
        },
        {
          question: "What tools and software will I learn?",
          answer:
            "You'll learn industry-standard tools including Wireshark, Metasploit, Nmap, Burp Suite, Kali Linux, and many others. We provide access to these tools in our virtual lab environment.",
        },
        {
          question: "Can I download course materials for offline study?",
          answer:
            "Yes! All our courses include downloadable PDF guides, cheat sheets, tool configurations, and practice scenarios. You can study offline and access materials anytime.",
        },
        {
          question: "What downloadable resources do you provide?",
          answer:
            "We provide comprehensive downloadable resources including security tool guides, penetration testing checklists, incident response playbooks, compliance frameworks, and certification study materials.",
        },
      ],
      categories: [
        { icon: "🔒", title: "Network Security", count: 12 },
        { icon: "🛡️", title: "Penetration Testing", count: 8 },
        { icon: "🔍", title: "Security Analysis", count: 10 },
        { icon: "⚡", title: "Incident Response", count: 6 },
        { icon: "📋", title: "Compliance & Audit", count: 7 },
        { icon: "🌐", title: "Web Security", count: 9 },
        { icon: "📱", title: "Mobile Security", count: 5 },
        { icon: "☁️", title: "Cloud Security", count: 8 },
      ],
      testimonials: [
        {
          name: "Sarah Chen - Security Analyst",
          text: "The penetration testing course completely transformed my career. The hands-on labs were incredible - I learned more in 3 months than in 2 years of self-study. The downloadable tools and guides are invaluable!",
          rating: 5,
          avatar: "/penetration-testing.svg",
          date: "Mar 2024",
        },
        {
          name: "Mike Rodriguez - IT Manager",
          text: "As someone managing a corporate network, the network security course gave me the skills to protect our infrastructure. The downloadable security checklists and incident response playbooks are now part of our daily operations.",
          rating: 5,
          avatar: "/network-security.svg",
          date: "Apr 2024",
        },
        {
          name: "Alex Thompson - Ethical Hacker",
          text: "The CEH preparation course was outstanding. The instructors are industry experts who actually work in the field. The downloadable study materials and practice tests helped me pass my CEH exam on the first try!",
          rating: 5,
          avatar: "/ethical-hacker.svg",
          date: "May 2024",
        },
        {
          name: "Dr. Emily Watson - CISO",
          text: "I've taken many cyber security courses, but this platform stands out for its practical approach. The downloadable compliance frameworks and security policies have been directly implemented in our organization.",
          rating: 5,
          avatar: "/security-analyst.svg",
          date: "Jun 2024",
        },
        {
          name: "David Kim - Security Consultant",
          text: "The web application security course was eye-opening. I learned about vulnerabilities I never knew existed. The downloadable tool configurations and security scripts are now part of my consulting toolkit.",
          rating: 4,
          avatar: "/incident-response.svg",
          date: "Jul 2024",
        },
      ],
      features: [
        { title: "Industry Expert Instructors", icon: "👨‍💻" },
        { title: "Hands-on Lab Environment", icon: "🔬" },
        { title: "Real-world Scenarios", icon: "🎯" },
        { title: "Certification Preparation", icon: "🏆" },
        { title: "24/7 Learning Access", icon: "⏰" },
        { title: "Career Support Services", icon: "🚀" },
        { title: "Downloadable Resources", icon: "📥" },
        { title: "Offline Study Materials", icon: "📚" },
      ],
      bannerImage: {
        title: "Master Cyber Security with Expert-Led Training",
        subTitle: "10K+ SECURITY PROFESSIONALS TRUST US",
      },
      whyTrustUs: {
        title: "Why Choose Our Cyber Security Training?",
        description:
          "We're not just another online learning platform. Our cyber security courses are designed by industry experts who actively work in the field. We provide hands-on training with real tools, live environments, practical scenarios, and comprehensive downloadable resources that prepare you for real-world security challenges. Join thousands of professionals who have advanced their careers with our comprehensive security training programs.",
        image: "/penetration-testing.svg",
        features: [
          { title: "Industry Expert Instructors", icon: "👨‍💻" },
          { title: "Hands-on Lab Environment", icon: "🔬" },
          { title: "Real-world Scenarios", icon: "🎯" },
          { title: "Certification Preparation", icon: "🏆" },
          { title: "24/7 Learning Access", icon: "⏰" },
          { title: "Career Support Services", icon: "🚀" },
          { title: "Downloadable Resources", icon: "📥" },
          { title: "Offline Study Materials", icon: "📚" },
        ],
      },
      newsletter: {
        title: "Stay Updated with Latest Cyber Security Trends",
        description:
          "Get exclusive access to new cyber security courses, industry insights, threat intelligence updates, downloadable security tools, and special discounts on advanced training programs. Join our community of security professionals!",
        buttonText: "Subscribe Now",
        visitorCount: "+10,000 security professionals worldwide",
      },
      knowledgeGuarantee: {
        title: "Your Cyber Security Career Starts Here",
        description:
          "We've trained thousands of security professionals who now work at top companies worldwide. Our courses are constantly updated with the latest threats, tools, and techniques. From beginners to advanced practitioners, we provide the knowledge, skills, and downloadable resources you need to succeed in the fast-evolving world of cyber security.",
        buttonText: "Explore Security Courses",
        image: "/ethical-hacker.svg",
      },
    };

    // Create the layout document
    const layout = new LayoutModel(defaultLayout);
    await layout.save();

    console.log("Cyber Security Layout data initialized successfully!");
    console.log("Content-matched SVGs added to testimonials and sections.");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing layout data:", error);
    process.exit(1);
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeLayoutData();
}

export default initializeLayoutData;
