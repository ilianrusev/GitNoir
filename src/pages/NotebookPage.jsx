import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getCases, getUserProgress } from "../services/gameService";
import { BookOpen, ArrowLeft, Lock, Search, Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { toast } from "sonner";
import Header from "../components/Header";

export default function NotebookPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [progress, setProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCommand, setCopiedCommand] = useState(null);
  const [viewMode, setViewMode] = useState("flat"); // "flat", "by-case" or "by-category"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCases = getCases();
    const userProgress = getUserProgress();
    setCases(allCases);
    setProgress(userProgress);
  };

  const isCaseCompleted = (caseId) => {
    return progress?.completed_cases?.includes(caseId);
  };

  const isCaseUnlocked = (caseData) => {
    if (caseData.unlock_cost === 0) return true;
    if (progress?.completed_cases?.includes(caseData.id)) return true;
    if (progress?.case_progress?.[caseData.id]) return true;
    return (progress?.available_reputation || 0) >= caseData.unlock_cost;
  };

  const copyCommand = (command) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    toast.success("Command copied!");
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  // Get all learned commands from completed cases
  const getLearnedCommands = () => {
    const commands = [];
    cases.forEach((caseData) => {
      if (isCaseCompleted(caseData.id)) {
        caseData.steps.forEach((step) => {
          commands.push({
            command: step.expected_commands[0],
            description: step.hint,
            instruction: step.instruction,
            caseId: caseData.id,
            caseTitle: caseData.title,
            difficulty: caseData.difficulty,
          });
        });
      }
    });
    return commands;
  };

  // Categorize commands
  const categorizeCommands = (commands) => {
    const categories = {
      "Basic Operations": [],
      Branching: [],
      "Merging & Rebasing": [],
      "Remote Operations": [],
      "History & Inspection": [],
      "Stashing & Cleaning": [],
      Advanced: [],
    };

    commands.forEach((cmd) => {
      const command = cmd.command.toLowerCase();
      if (
        command.includes("branch") ||
        command.includes("checkout") ||
        command.includes("switch")
      ) {
        categories["Branching"].push(cmd);
      } else if (command.includes("merge") || command.includes("rebase")) {
        categories["Merging & Rebasing"].push(cmd);
      } else if (
        command.includes("remote") ||
        command.includes("push") ||
        command.includes("pull") ||
        command.includes("fetch") ||
        command.includes("clone")
      ) {
        categories["Remote Operations"].push(cmd);
      } else if (
        command.includes("log") ||
        command.includes("status") ||
        command.includes("diff") ||
        command.includes("blame") ||
        command.includes("reflog") ||
        command.includes("show")
      ) {
        categories["History & Inspection"].push(cmd);
      } else if (command.includes("stash") || command.includes("clean")) {
        categories["Stashing & Cleaning"].push(cmd);
      } else if (
        command.includes("bisect") ||
        command.includes("worktree") ||
        command.includes("submodule") ||
        command.includes("archive") ||
        command.includes("reset --hard")
      ) {
        categories["Advanced"].push(cmd);
      } else {
        categories["Basic Operations"].push(cmd);
      }
    });

    return categories;
  };

  const learnedCommands = getLearnedCommands();
  const categorizedCommands = categorizeCommands(learnedCommands);

  // Filter commands based on search
  const filterCommands = (commands) => {
    if (!searchQuery) return commands;
    return commands.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const filteredLearnedCommands = filterCommands(learnedCommands);

  // Stats
  const totalCommands = cases.reduce((sum, c) => sum + c.steps.length, 0);
  const learnedCount = learnedCommands.length;
  const completedCases = progress?.completed_cases?.length || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header reputation={progress?.available_reputation || 0} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-[#a3a3a3] mb-4 hover:text-[#ffb703] transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#ffb703] bg-[#ffb703]/10">
              <BookOpen className="w-6 h-6 text-[#ffb703]" />
            </div>
            <div>
              <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em]">
                DETECTIVE'S
              </p>
              <h1 className="font-typewriter text-3xl md:text-4xl text-[#e5e5e5]">
                NOTEBOOK
              </h1>
            </div>
          </div>
          <p className="text-[#a3a3a3] max-w-2xl">
            Your personal collection of Git commands learned throughout your
            investigations. Complete more cases to unlock additional commands.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="case-card p-4 text-center">
            <div className="font-mono text-2xl text-[#00ff41]">
              {learnedCount}
            </div>
            <div className="font-mono text-xs text-[#666] tracking-wider">
              COMMANDS LEARNED
            </div>
          </div>
          <div className="case-card p-4 text-center">
            <div className="font-mono text-2xl text-[#ffb703]">
              {completedCases}
            </div>
            <div className="font-mono text-xs text-[#666] tracking-wider">
              CASES SOLVED
            </div>
          </div>
          <div className="case-card p-4 text-center">
            <div className="font-mono text-2xl text-[#e5e5e5]">
              {totalCommands - learnedCount}
            </div>
            <div className="font-mono text-xs text-[#666] tracking-wider">
              TO DISCOVER
            </div>
          </div>
        </div>

        {/* Search & View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
            <Input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-terminal pl-10 w-full"
              data-testid="notebook-search"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className={`font-mono text-xs ${viewMode === "flat" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("flat")}
              data-testid="view-flat"
            >
              All Commands
            </Button>
            <Button
              className={`font-mono text-xs ${viewMode === "by-case" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("by-case")}
              data-testid="view-by-case"
            >
              By Case
            </Button>
            <Button
              className={`font-mono text-xs ${viewMode === "by-category" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("by-category")}
              data-testid="view-by-category"
            >
              By Category
            </Button>
          </div>
        </div>

        {learnedCount === 0 ? (
          /* Empty State */
          <div className="case-file text-center py-16">
            <BookOpen className="w-16 h-16 text-[#333] mx-auto mb-6" />
            <h2 className="font-typewriter text-2xl text-[#666] mb-4">
              NOTEBOOK EMPTY
            </h2>
            <p className="text-[#666] mb-8 max-w-md mx-auto">
              Your notebook is waiting to be filled. Complete cases to learn Git
              commands and build your reference collection.
            </p>
            <Link to="/cases">
              <Button className="btn-primary" data-testid="start-first-case">
                Start Your First Case
              </Button>
            </Link>
          </div>
        ) : viewMode === "flat" ? (
          /* Flat View - All Commands */
          <div className="case-card p-6">
            <div className="space-y-3">
              {filteredLearnedCommands.map((cmd, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[#0c0c0c] border border-[#222] group"
                  data-testid={`command-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#00ff41]/20 border border-[#00ff41]/50">
                    <span className="font-mono text-xs text-[#00ff41]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <code className="font-mono text-sm text-[#00ff41]">
                        {cmd.command}
                      </code>
                      <button
                        onClick={() => copyCommand(cmd.command)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1a1a1a]"
                        title="Copy command"
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="w-3 h-3 text-[#00ff41]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#666]" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#a3a3a3]">{cmd.description}</p>
                  </div>
                </div>
              ))}
              {filteredLearnedCommands.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-[#666] font-mono text-sm">
                    No commands match your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : viewMode === "by-case" ? (
          /* View by Case */
          <div className="space-y-4">
            {cases.map((caseData) => {
              const completed = isCaseCompleted(caseData.id);
              const unlocked = isCaseUnlocked(caseData);
              const caseCommands = filterCommands(
                caseData.steps.map((step) => ({
                  command: step.expected_commands[0],
                  description: step.hint,
                  instruction: step.instruction,
                  caseId: caseData.id,
                  caseTitle: caseData.title,
                  difficulty: caseData.difficulty,
                })),
              );

              if (searchQuery && caseCommands.length === 0 && completed)
                return null;

              return (
                <div
                  key={caseData.id}
                  className="case-card overflow-hidden"
                  data-testid={`notebook-case-${caseData.id}`}
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={caseData.id} className="border-none">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#1a1a1a]">
                        <div className="flex items-center gap-4 w-full">
                          {completed ? (
                            <div className="w-8 h-8 flex items-center justify-center bg-[#00ff41]/20 border border-[#00ff41]">
                              <Check className="w-4 h-4 text-[#00ff41]" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-[#333] border border-[#444]">
                              <Lock className="w-4 h-4 text-[#666]" />
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-typewriter text-lg ${completed ? "text-[#e5e5e5]" : "text-[#666]"}`}
                              >
                                {caseData.title}
                              </span>
                              <span
                                className={`badge-difficulty text-[10px] ${
                                  caseData.difficulty === "Beginner"
                                    ? "badge-beginner"
                                    : caseData.difficulty === "Intermediate"
                                      ? "badge-intermediate"
                                      : "badge-advanced"
                                }`}
                              >
                                {caseData.difficulty}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-[#666]">
                              {completed
                                ? `${caseData.steps.length} commands`
                                : "Complete case to unlock"}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        {completed ? (
                          <div className="space-y-3 mt-2">
                            {caseCommands.map((cmd, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-[#0c0c0c] border border-[#222] group"
                              >
                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#00ff41]/20 border border-[#00ff41]/50">
                                  <span className="font-mono text-xs text-[#00ff41]">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <code className="font-mono text-sm text-[#00ff41]">
                                      {cmd.command}
                                    </code>
                                    <button
                                      onClick={() => copyCommand(cmd.command)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1a1a1a]"
                                      title="Copy command"
                                    >
                                      {copiedCommand === cmd.command ? (
                                        <Check className="w-3 h-3 text-[#00ff41]" />
                                      ) : (
                                        <Copy className="w-3 h-3 text-[#666]" />
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-xs text-[#a3a3a3]">
                                    {cmd.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Lock className="w-8 h-8 text-[#444] mx-auto mb-3" />
                            <p className="text-[#666] text-sm mb-4">
                              {unlocked
                                ? "Complete this case to add commands to your notebook"
                                : `Unlock this case (${caseData.unlock_cost} REP) to learn these commands`}
                            </p>
                            <Link
                              to={unlocked ? `/game/${caseData.id}` : "/cases"}
                            >
                              <Button className="btn-outline text-xs">
                                {unlocked ? "Start Case" : "View Cases"}
                              </Button>
                            </Link>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        ) : (
          /* View by Category */
          <div className="space-y-4">
            {Object.entries(categorizedCommands).map(([category, commands]) => {
              const filteredCmds = filterCommands(commands);
              if (filteredCmds.length === 0) return null;

              return (
                <div
                  key={category}
                  className="case-card overflow-hidden"
                  data-testid={`notebook-category-${category}`}
                >
                  <Accordion type="single" collapsible defaultValue={category}>
                    <AccordionItem value={category} className="border-none">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#1a1a1a]">
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#ffb703]/20 border border-[#ffb703]">
                            <span className="font-mono text-sm text-[#ffb703]">
                              {filteredCmds.length}
                            </span>
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-typewriter text-lg text-[#e5e5e5]">
                              {category}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-3 mt-2">
                          {filteredCmds.map((cmd, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-[#0c0c0c] border border-[#222] group"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="font-mono text-sm text-[#00ff41]">
                                    {cmd.command}
                                  </code>
                                  <button
                                    onClick={() => copyCommand(cmd.command)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1a1a1a]"
                                    title="Copy command"
                                  >
                                    {copiedCommand === cmd.command ? (
                                      <Check className="w-3 h-3 text-[#00ff41]" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-[#666]" />
                                    )}
                                  </button>
                                  <span className="font-mono text-[10px] text-[#444] ml-auto">
                                    from {cmd.caseTitle}
                                  </span>
                                </div>
                                <p className="text-xs text-[#a3a3a3]">
                                  {cmd.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        )}

        {/* Locked Commands Preview */}
        {learnedCount > 0 && learnedCount < totalCommands && (
          <div className="mt-12">
            <h2 className="font-typewriter text-xl text-[#666] mb-4">
              COMMANDS TO DISCOVER
            </h2>
            <div className="case-card p-6">
              <div className="flex flex-wrap gap-2">
                {cases
                  .filter((c) => !isCaseCompleted(c.id))
                  .slice(0, 3)
                  .map((caseData) => (
                    <div
                      key={caseData.id}
                      className="flex items-center gap-2 px-3 py-2 bg-[#0c0c0c] border border-[#222]"
                    >
                      <Lock className="w-3 h-3 text-[#444]" />
                      <span className="font-mono text-xs text-[#666]">
                        {caseData.title}
                      </span>
                      <span className="font-mono text-xs text-[#444]">
                        ({caseData.steps.length} cmds)
                      </span>
                    </div>
                  ))}
                {cases.filter((c) => !isCaseCompleted(c.id)).length > 3 && (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="font-mono text-xs text-[#666]">
                      +{cases.filter((c) => !isCaseCompleted(c.id)).length - 3}{" "}
                      more cases
                    </span>
                  </div>
                )}
              </div>
              <Link to="/cases" className="inline-block mt-4">
                <Button className="btn-outline text-xs">View All Cases</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
