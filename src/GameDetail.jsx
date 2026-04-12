import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameDetail.css";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        const data = await res.json();
        setGame(data);
      } catch (err) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="detail">
      <Link to="/">← Back to Dashboard</Link>

      <div className="detail-hero" style={{ backgroundImage: `url(${game.background_image})` }}>
        <h1>{game.name}</h1>
      </div>

        <div className="detail-body">
        <div className="detail-card">
            <div className="detail-row">
            <span className="detail-label">Rating</span>
            <span className="detail-value">{game.rating} / 5</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Released</span>
            <span className="detail-value">{game.released}</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Metacritic</span>
            <span className="detail-value">{game.metacritic ?? "N/A"}</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Playtime</span>
            <span className="detail-value">{game.playtime} hrs</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Genres</span>
            <span className="detail-value">{game.genres.map((g) => g.name).join(", ")}</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Developers</span>
            <span className="detail-value">{game.developers.map((d) => d.name).join(", ")}</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Publishers</span>
            <span className="detail-value">{game.publishers.map((p) => p.name).join(", ")}</span>
            </div>
            <div className="detail-row">
            <span className="detail-label">Platforms</span>
            <span className="detail-value">{game.platforms.map((p) => p.platform.name).join(", ")}</span>
            </div>
            <div className="detail-row description">
            <span className="detail-label">About</span>
            <span className="detail-value">{game.description_raw}</span>
            </div>
        </div>
        </div>
        </div>
  );
}