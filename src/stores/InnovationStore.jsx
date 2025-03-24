import { create } from "zustand";

// Define a Zustand store with the list of innovation/ideation tools (including additional fields)
const useInnovationStore = create((set) => ({
  // Navigation state
  currentPage: "home", // 'home' or 'scamper'
  setCurrentPage: (page) => set({ currentPage: page }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  tools: [
    {
      id: 1,
      name: "Brainstorming",
      description: "Generate a large number of ideas rapidly.",
      category: "Group Ideation",
      origin: "Alex Osborn",
      active: false,
    },
    {
      id: 2,
      name: "Mind Mapping",
      description: "Visualize ideas and their connections.",
      category: "Visual Thinking",
      origin: "Tony Buzan",
      active: false,
    },
    {
      id: 3,
      name: "SCAMPER",
      description:
        "Explore ideas using Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.",
      category: "Creative Problem Solving",
      origin: "Bob Eberle",
      active: true,
    },
    {
      id: 4,
      name: "Design Thinking",
      description:
        "Empathize, define, ideate, prototype, and test to solve problems.",
      category: "Human-Centered",
      origin: "IDEO",
      active: false,
    },
    {
      id: 5,
      name: "TRIZ",
      description:
        "Theory of Inventive Problem Solving for breakthrough ideas.",
      category: "Systematic Innovation",
      origin: "Genrich Altshuller",
      active: true,
    },
    {
      id: 6,
      name: "Six Thinking Hats",
      description: "Adopt different perspectives for a rounded view.",
      category: "Parallel Thinking",
      origin: "Edward de Bono",
      active: false,
    },
    {
      id: 7,
      name: "Reverse Brainstorming",
      description: "Identify problems by considering how to cause them.",
      category: "Negative Brainstorming",
      origin: "Various",
      active: false,
    },
    {
      id: 8,
      name: "Role Storming",
      description: "Brainstorm ideas by stepping into someone else’s shoes.",
      category: "Role-based Ideation",
      origin: "Various",
      active: false,
    },
    {
      id: 9,
      name: "SWOT Analysis",
      description: "Analyze Strengths, Weaknesses, Opportunities, and Threats.",
      category: "Strategic Planning",
      origin: "Albert Humphrey",
      active: false,
    },
    {
      id: 10,
      name: "Blue Ocean Strategy",
      description:
        "Create uncontested market space and make competition irrelevant.",
      category: "Market Strategy",
      origin: "W. Chan Kim & Renée Mauborgne",
      active: false,
    },
    {
      id: 11,
      name: "Lean Startup",
      description: "Iterative, hypothesis-driven product development.",
      category: "Entrepreneurship",
      origin: "Eric Ries",
      active: false,
    },
    {
      id: 12,
      name: "Customer Journey Mapping",
      description: "Visualize and optimize the customer experience.",
      category: "User Experience",
      origin: "Various",
      active: false,
    },
    {
      id: 13,
      name: "Storyboarding",
      description: "Narratively visualize a process or idea.",
      category: "Visual Narrative",
      origin: "Various",
      active: false,
    },
    {
      id: 14,
      name: "The Five Whys",
      description: "Dig into the root cause by asking 'Why' multiple times.",
      category: "Root Cause Analysis",
      origin: "Taiichi Ohno",
      active: false,
    },
    {
      id: 15,
      name: "Creative Problem Solving",
      description: "Systematic methods for generating creative solutions.",
      category: "Problem Solving",
      origin: "Alex Osborn / Sidney Parnes",
      active: false,
    },
    {
      id: 16,
      name: "Lateral Thinking",
      description: "Break away from traditional linear thought patterns.",
      category: "Creative Thinking",
      origin: "Edward de Bono",
      active: false,
    },
    {
      id: 17,
      name: "Brainwriting",
      description: "Generate ideas in writing for quieter participation.",
      category: "Written Brainstorming",
      origin: "Various",
      active: false,
    },
    {
      id: 18,
      name: "Rapid Prototyping",
      description: "Quickly build and test ideas in a tangible form.",
      category: "Product Development",
      origin: "Various",
      active: false,
    },
    {
      id: 19,
      name: "SIT (Systematic Inventive Thinking)",
      description:
        "A structured method using innovation patterns to generate ideas.",
      category: "Structured Innovation",
      origin: "SIT Institute",
      active: true,
    },
  ],
}));

export default useInnovationStore;
