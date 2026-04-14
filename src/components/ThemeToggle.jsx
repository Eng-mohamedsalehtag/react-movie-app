export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-btn"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
