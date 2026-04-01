import { useState, useEffect } from "react";
import "./gameDashboard.css";

export default function GamesDashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20&ordering=-rating`
        );
        const data = await res.json();
        setGames(data.results);
      } catch (err) {
        setError("Failed to fetch games.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const avgRating = (games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(2);

  const topGenre = Object.entries(
    games.flatMap((g) => g.genres.map((genre) => genre.name))
      .reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1])[0][0];

  const highMetacritic = games.filter((g) => g.metacritic >= 90).length;

  const allGenres = ["All", ...new Set(games.flatMap((g) => g.genres.map((genre) => genre.name)))];

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedGames = filteredGames.filter((g) =>
    selectedGenre === "" || selectedGenre === "All"
      ? true
      : g.genres.some((genre) => genre.name === selectedGenre)
  );

  return (
    <div className="dashboard">
      <h1>Game Dashboard</h1>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Avg Rating</span>
          <span className="stat-value">{avgRating} / 5</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Top Genre</span>
          <span className="stat-value">{topGenre}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Metacritic 90+</span>
          <span className="stat-value">{highMetacritic} games</span>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search (ex. Marvel Rivals...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Released</th>
            <th>Genres</th>
            <th>Platforms</th>
            <th>Metacritic</th>
          </tr>
        </thead>
        <tbody>
          {displayedGames.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.rating} / 5</td>
              <td>{game.released}</td>
              <td>{game.genres.map((g) => g.name).join(", ")}</td>
              <td>{game.platforms.map((p) => p.platform.name).join(", ")}</td>
              <td>{game.metacritic ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}