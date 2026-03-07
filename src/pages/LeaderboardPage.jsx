import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getLeaderboard, getUserProgress } from "../services/gameService";
import { Award, Trophy, ArrowLeft, Medal, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    void loadLeaderboard();
  }, []);

  const loadLeaderboard = async ({ forceRefresh = false } = {}) => {
    try {
      const [data, userProgress] = await Promise.all([
        getLeaderboard({ forceRefresh }),
        Promise.resolve(getUserProgress()),
      ]);
      setLeaderboard(data);
      setProgress(userProgress);
    } catch (error) {
      toast.error("Failed to load leaderboard");
      setLeaderboard([]);
      setProgress(getUserProgress());
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-[#ffb703]" />;
      case 2:
        return <Medal className="w-5 h-5 text-[#a8a8a8]" />;
      case 3:
        return <Medal className="w-5 h-5 text-[#cd7f32]" />;
      default:
        return <span className="font-mono text-lg text-[#666]">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {user ? (
        <Header reputation={progress?.reputation || 0} />
      ) : (
        <Header variant="landing" />
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-[#a3a3a3] mb-4 hover:text-[#ffb703] transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back</span>
          </Link>
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-2">
            HALL OF FAME
          </p>
          <h1 className="font-typewriter text-4xl text-[#e5e5e5] mb-4">
            TOP DETECTIVES
          </h1>
          <p className="text-[#a3a3a3]">
            The most skilled investigators in the agency. Will your name be
            here?
          </p>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-16">
            <div className="terminal-text text-lg animate-pulse-glow">
              Loading rankings...
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="case-file text-center py-16">
            <Users className="w-12 h-12 text-[#666] mx-auto mb-4" />
            <p className="font-typewriter text-xl text-[#666] mb-2">
              No detectives yet
            </p>
            <p className="text-sm text-[#444] mb-6">
              Be the first to join the agency!
            </p>
            <Link to="/register">
              <Button className="btn-primary" data-testid="join-btn">
                Start Your Career
              </Button>
            </Link>
          </div>
        ) : (
          <div className="case-card overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-140">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_100px_100px] gap-4 px-6 py-4 bg-[#0c0c0c] border-b border-[#333]">
                  <span className="font-mono text-xs text-[#666] tracking-wider">
                    RANK
                  </span>
                  <span className="font-mono text-xs text-[#666] tracking-wider">
                    DETECTIVE
                  </span>
                  <span className="font-mono text-xs text-[#666] tracking-wider text-right">
                    CASES
                  </span>
                  <span className="font-mono text-xs text-[#666] tracking-wider text-right">
                    REPUTATION
                  </span>
                </div>

                {/* Table Rows */}
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.username}
                    className={`leaderboard-row animate-fade-in ${
                      user?.username === entry.username ? "bg-[#1a1a1a]" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`leaderboard-row-${index + 1}`}
                  >
                    <div className="flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center border ${
                          entry.rank <= 3 ? "border-[#ffb703]" : "border-[#333]"
                        }`}
                      >
                        <span className="font-typewriter text-xs text-[#e5e5e5]">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`font-mono ${
                          user?.username === entry.username
                            ? "text-[#ffb703]"
                            : "text-[#e5e5e5]"
                        }`}
                      >
                        {entry.username}
                        {user?.username === entry.username && (
                          <span className="ml-2 text-xs text-[#666]">(you)</span>
                        )}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[#a3a3a3]">
                        {entry.cases_solved}
                      </span>
                    </div>
                    <div className="text-right flex items-center justify-end gap-2">
                      <Award className="w-4 h-4 text-[#ffb703]" />
                      <span className="font-mono text-[#ffb703]">
                        {entry.reputation ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA for non-logged users */}
        {!user && leaderboard.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-[#a3a3a3] mb-4">Ready to prove yourself?</p>
            <Link to="/register">
              <Button className="btn-primary" data-testid="cta-join-btn">
                Join The Agency
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
