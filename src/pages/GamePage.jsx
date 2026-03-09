import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCaseById,
  getUserProgress,
  isCaseUnlocked,
  validateCommand,
} from "../services/gameService";
import {
  Terminal,
  ArrowLeft,
  Award,
  CheckCircle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { toast } from "sonner";

export default function GamePage() {
  const { caseId } = useParams();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const scrollToCaseTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  
  const [caseData, setCaseData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [caseCompleted, setCaseCompleted] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isReplay, setIsReplay] = useState(false);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const focusCommandInput = () => {
    const input = inputRef.current;
    if (!input) return;

    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;

    setTimeout(() => {
      input.focus({ preventScroll: true });

      if (isMobileViewport) {
        const rect = input.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (!isVisible) {
          input.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      }
    }, 60);
  };

  useEffect(() => {
    scrollToCaseTop();
    loadCase();
  }, [caseId]);

  useEffect(() => {
    if (!loading && caseData) {
      scrollToCaseTop();
    }
  }, [loading, caseData]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (caseCompleted) {
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
    const isInitialStep = currentStep === 0 && history.length === 0;

    if (isMobileViewport && isInitialStep) {
      return;
    }

    focusCommandInput();
  }, [currentStep, history.length, caseCompleted]);

  useEffect(() => {
    if (!caseCompleted) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [caseCompleted]);

  const loadCase = () => {
    try {
      const caseInfo = getCaseById(caseId);
      const progress = getUserProgress();
      
      if (!caseInfo) {
        toast.error("Case not found");
        navigate("/dashboard");
        return;
      }

      if (!isCaseUnlocked(caseId)) {
        toast.error("You need more reputation to access this case.");
        navigate("/cases");
        return;
      }

      setCaseData(caseInfo);
      
      // Check if case is already completed (replay mode)
      if (progress?.completed_cases?.includes(caseId)) {
        setIsReplay(true);
        setCaseCompleted(false); // Allow replay
        setCurrentStep(0);
      } else {
        // Resume from saved progress
        const savedProgress = progress?.case_progress?.[caseId];
        if (savedProgress) {
          setCurrentStep(savedProgress.current_step || 0);
          setTotalEarned(savedProgress.earned_points || 0);
        }
      }
    } catch (error) {
      console.error("Failed to load case:", error);
      toast.error("Failed to load case");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const restartCase = () => {
    setCaseCompleted(false);
    setCurrentStep(0);
    setHistory([]);
    setTotalEarned(0);
    setShowHint(false);
    // Keep isReplay true if it was already completed before
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim() || submitting) return;

    const userCommand = command.trim();
    setCommand("");
    setSubmitting(true);
    setShowHint(false);

    // Add command to history
    setHistory(prev => [...prev, { type: "command", text: userCommand }]);

    try {
      const result = validateCommand(caseId, currentStep, userCommand);

      if (result.is_correct) {
        setHistory(prev => [...prev, { 
          type: "success", 
          text: result.feedback,
          points: result.points_earned,
          isReplay: isReplay
        }]);
        setTotalEarned(prev => prev + result.points_earned);

        if (result.case_completed) {
          setCaseCompleted(true);
          refreshUser();
          if (!isReplay) {
            toast.success("Case solved! Your reputation has increased.");
          } else {
            toast.info("Case replayed! Practice makes perfect.");
          }
        } else {
          setCurrentStep(result.next_step);
          // Add narrative for next step
          setTimeout(() => {
            setHistory(prev => [...prev, { 
              type: "narrative", 
              text:
                result.next_step_narrative ||
                caseData.steps[result.next_step].narrative,
              instruction:
                result.next_step_instruction ||
                caseData.steps[result.next_step].instruction,
            }]);

            focusCommandInput();
          }, 500);
        }
      } else {
        setHistory(prev => [...prev, { type: "error", text: result.feedback }]);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setHistory(prev => [...prev, { type: "error", text: "Command validation failed. Try again." }]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="terminal-text text-lg animate-pulse-glow">Loading case file...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="font-typewriter text-xl text-[#d00000] mb-4">Case not found</p>
          <Link to="/dashboard">
            <Button className="btn-outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const step = caseData.steps[currentStep];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#333] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/cases" className="flex items-center gap-2 text-[#a3a3a3] hover:text-[#ffb703] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Exit Case</span>
            </Link>
            <span className="text-[#333]">|</span>
          </div>
          <div className="flex items-center gap-6">
            {isReplay && (
              <span className="font-mono text-xs text-[#666] px-2 py-1 border border-[#444] bg-[#1a1a1a]">
                REPLAY MODE
              </span>
            )}
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ffb703]" />
              <span className={`font-mono text-sm ${isReplay ? 'text-[#666]' : 'text-[#ffb703]'}`} data-testid="earned-points">
                {isReplay ? 'NO PTS' : `+${totalEarned} PTS`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#666]">STEP</span>
              <span className="font-mono text-sm text-[#e5e5e5]" data-testid="current-step">
                {currentStep + 1}/{caseData.steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress 
        value={((currentStep + (caseCompleted ? 1 : 0)) / caseData.steps.length) * 100}
        className="h-1 bg-[#1a1a1a] rounded-none"
      />

      {/* Main Content - Split Layout */}
      <div className="split-layout">
        {/* Left Panel - Narrative */}
        <div className="narrative-panel">
          <div className="max-w-xl mx-auto lg:mx-0">
            {/* Case Header */}
            <div className="mb-8">
              <span className={`badge-difficulty mb-4 inline-block ${
                caseData.difficulty === 'Beginner' ? 'badge-beginner' :
                caseData.difficulty === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
              }`}>
                {caseData.difficulty}
              </span>
              <h1 className="font-typewriter text-3xl text-[#e5e5e5] mb-2">
                {caseData.title}
              </h1>
              <p className="text-sm text-[#666]">{caseData.description}</p>
            </div>

            {caseCompleted ? (
              /* Case Completed Screen */
              <div className="space-y-6 animate-fade-in" data-testid="case-completed">
                {/* Success Header */}
                <div className="case-file text-center py-6">
                  <CheckCircle className="w-16 h-16 text-[#00ff41] mx-auto mb-4" />
                  <h2 className="font-typewriter text-2xl text-[#e5e5e5] mb-2">
                    {isReplay ? 'CASE REPLAYED' : 'CASE CLOSED'}
                  </h2>
                  <p className="text-[#a3a3a3]">
                    {isReplay 
                      ? 'Good practice, Detective!'
                      : 'Excellent work, Detective.'}
                  </p>
                  {!isReplay && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Award className="w-5 h-5 text-[#ffb703]" />
                      <span className="font-mono text-xl text-[#ffb703]">
                        +{totalEarned} REPUTATION
                      </span>
                    </div>
                  )}
                </div>

                {/* Case Summary */}
                <div className="case-file">
                  <h3 className="font-mono text-xs text-[#ffb703] tracking-wider mb-3">
                    CASE SUMMARY
                  </h3>
                  <h4 className="font-typewriter text-lg text-[#e5e5e5] mb-2">
                    {caseData.title}
                  </h4>
                  <p className="text-sm text-[#a3a3a3] leading-relaxed mb-4">
                    {caseData.description}
                  </p>
                  <div className="p-3 bg-[#0c0c0c] border border-[#222]">
                    <p className="font-typewriter text-sm text-[#666] italic">
                      "{caseData.story_intro.split('\n')[0]}"
                    </p>
                  </div>
                </div>

                {/* Commands Learned + Quick Reference */}
                <div className="case-file">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="commands-learned" className="border-[#333]">
                      <AccordionTrigger className="font-mono text-xs text-[#ffb703] tracking-wider hover:no-underline">
                        COMMANDS LEARNED
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {caseData.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-[#0c0c0c] border border-[#222]">
                              <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-[#00ff41]/20 border border-[#00ff41]">
                                <span className="font-mono text-xs text-[#00ff41]">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <code className="font-mono text-sm text-[#00ff41] block mb-1">
                                  {step.expected_commands[0]}
                                </code>
                                <p className="text-xs text-[#666]">{step.hint}</p>
                              </div>
                              <div className="shrink-0">
                                <span className="font-mono text-xs text-[#ffb703]">+{step.points}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="quick-reference" className="border-[#333]">
                      <AccordionTrigger className="font-mono text-xs text-[#ffb703] tracking-wider hover:no-underline">
                        QUICK REFERENCE
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="terminal-container p-4">
                          <div className="font-mono text-sm space-y-1">
                            {caseData.steps.map((step, index) => (
                              <p key={index} className="text-[#00ff41]">
                                <span className="text-[#666]">$</span> {step.expected_commands[0]}
                              </p>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#666] mt-3">
                          Copy these commands to practice in a real terminal!
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Link to="/cases">
                    <Button className="btn-primary w-full" data-testid="next-case-btn">
                      Next Case <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button className="btn-outline w-full" onClick={restartCase} data-testid="replay-btn">
                    Replay Case
                  </Button>
                </div>
              </div>
            ) : (
              /* Current Step */
              <div className="space-y-6">
                {/* Story Intro (first step only) */}
                {currentStep === 0 && history.length === 0 && (
                  <div className="case-file mb-6 animate-fade-in">
                    <p className="story-text whitespace-pre-line">
                      {caseData.story_intro}
                    </p>
                  </div>
                )}

                {/* Current Narrative */}
                <div className="case-file animate-fade-in" data-testid="current-narrative">
                  <p className="story-text mb-6">
                    {step.narrative}
                  </p>
                  <div className="pt-4 border-t border-[#333]">
                    <p className="font-mono text-xs text-[#ffb703] tracking-wider mb-2">
                      OBJECTIVE
                    </p>
                    <p className="text-[#e5e5e5]" data-testid="step-instruction">
                      {step.instruction}
                    </p>
                  </div>
                </div>

                {/* Hint Button */}
                <div>
                  <Button
                    className="btn-outline text-xs"
                    onClick={() => setShowHint(!showHint)}
                    data-testid="hint-btn"
                  >
                    <Lightbulb className="w-3 h-3 mr-2" />
                    {showHint ? 'Hide Hint' : 'Need a Hint?'}
                  </Button>
                  {showHint && (
                    <div className="mt-3 p-4 bg-[#1a1a1a] border border-[#333] animate-fade-in" data-testid="hint-text">
                      <p className="font-mono text-sm text-[#a3a3a3]">
                        {step.hint}
                      </p>
                    </div>
                  )}
                </div>

                {/* Points Available */}
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#666]" />
                  <span className="font-mono text-xs text-[#666]">
                    {step.points} points available
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Terminal */}
        <div className="terminal-panel">
          {/* Terminal Header */}
          <div className="terminal-header px-4">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="ml-3 font-mono text-xs text-[#666]">git-detective-terminal</span>
          </div>

          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto font-mono text-sm"
            data-testid="terminal-output"
          >
            {/* Welcome Message */}
            <div className="mb-4 text-[#666]">
              <p>Git Noir Detective Terminal v1.0</p>
              <p>Type your git commands below.</p>
              {isReplay && (
                <p className="text-[#ffb703] mt-2">⚠ REPLAY MODE - No points will be earned</p>
              )}
              <p className="text-[#333]">────────────────────────────────</p>
            </div>

            {/* Command History */}
            {history.map((item, index) => (
              <div key={index} className="mb-3 animate-fade-in">
                {item.type === "command" && (
                  <p className="text-[#a3a3a3]">
                    <span className="text-[#ffb703]">$</span> {item.text}
                  </p>
                )}
                {item.type === "success" && (
                  <div className={`pl-2 border-l-2 ${item.isReplay ? 'border-[#666]' : 'border-[#00ff41]'}`}>
                    <p className={item.isReplay ? 'text-[#666]' : 'terminal-text'}>{item.text}</p>
                    {item.points > 0 && !item.isReplay && (
                      <p className="text-[#ffb703] text-xs mt-1">+{item.points} reputation</p>
                    )}
                  </div>
                )}
                {item.type === "error" && (
                  <div className="pl-2 border-l-2 border-[#d00000]">
                    <p className="text-[#d00000]">{item.text}</p>
                  </div>
                )}
                {item.type === "narrative" && (
                  <div className="pl-2 border-l-2 border-[#333] my-4">
                    <p className="text-[#666] italic">{item.text}</p>
                    {item.instruction && (
                      <div className="mt-3">
                        <p className="font-mono text-xs text-[#ffb703] tracking-wider mb-1">
                          OBJECTIVE
                        </p>
                        <p className="text-[#e5e5e5]">{item.instruction}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Input Line */}
            {!caseCompleted && (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-[#ffb703]">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="terminal-input flex-1"
                  placeholder="Enter git command..."
                  disabled={submitting}
                  autoComplete="off"
                  spellCheck="false"
                  data-testid="terminal-input"
                />
                {submitting && (
                  <span className="terminal-text animate-pulse">...</span>
                )}
              </form>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 border-t border-[#333] bg-[#0a0a0a]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#444]">
                Press Enter to execute
              </span>
              <span className="font-mono text-xs text-[#444]">
                {caseData.steps.length - currentStep} steps remaining
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
