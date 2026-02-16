const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#05060a",
        steel: "#12151d",
        graphite: "#1b1f2b",
        pearl: "#f8f9ff",
        mist: "#d6d9e2",
        platinum: "#c2ccd9",
        accent: "#a88b5d",
        "accent-soft": "#d0bc96",
        signal: "#8ab4ff",
      },
      boxShadow: {
        luxury: "0 38px 80px -44px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "metal-sheen":
          "linear-gradient(140deg, rgba(194, 204, 217, 0.12), rgba(168, 139, 93, 0.1), rgba(194, 204, 217, 0.04))",
      },
    },
  },
  plugins: [],
};

export default config;
