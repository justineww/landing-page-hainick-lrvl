module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // For React/Next.js
    "./index.html", // For standard HTML projects
  ],
  theme: {
    extend: {
      // --- TAMBAHKAN BAGIAN INI ---
      fontFamily: {
        coolvetica: ["Coolvetica", "sans-serif"],
        Francy: ["Francy", "sans-serif"],
      },
      // ----------------------------
    },
  },
  plugins: [],
};
