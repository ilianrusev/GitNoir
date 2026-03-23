import Header from "../components/Header";
import SecondaryHeader from "../components/SecondaryHeader";
import { useAuth } from "../context/AuthContext";

const sections = [
  {
    title: "SETUP",
    description:
      "Configuring user information used across all local repositories",
    commands: [
      {
        cmd: 'git config --global user.name "[firstname lastname]"',
        desc: "set a name that is identifiable for credit when review version history",
      },
      {
        cmd: 'git config --global user.email "[valid-email]"',
        desc: "set an email address that will be associated with each history marker",
      },
      {
        cmd: "git config --global color.ui auto",
        desc: "set automatic command line coloring for Git for easy reviewing",
      },
    ],
  },
  {
    title: "SETUP & INIT",
    description:
      "Configuring user information, initializing and cloning repositories",
    commands: [
      {
        cmd: "git init",
        desc: "initialize an existing directory as a Git repository",
      },
      {
        cmd: "git clone [url]",
        desc: "retrieve an entire repository from a hosted location via URL",
      },
    ],
  },
  {
    title: "STAGE & SNAPSHOT",
    description: "Working with snapshots and the Git staging area",
    commands: [
      {
        cmd: "git status",
        desc: "show modified files in working directory, staged for your next commit",
      },
      {
        cmd: "git add [file]",
        desc: "add a file as it looks now to your next commit (stage)",
      },
      {
        cmd: "git reset [file]",
        desc: "unstage a file while retaining the changes in working directory",
      },
      { cmd: "git diff", desc: "diff of what is changed but not staged" },
      {
        cmd: "git diff --staged",
        desc: "diff of what is staged but not yet committed",
      },
      {
        cmd: 'git commit -m "[descriptive message]"',
        desc: "commit your staged content as a new commit snapshot",
      },
    ],
  },
  {
    title: "BRANCH & MERGE",
    description:
      "Isolating work in branches, changing context, and integrating changes",
    commands: [
      {
        cmd: "git branch",
        desc: "list your branches. a * will appear next to the currently active branch",
      },
      {
        cmd: "git branch [branch-name]",
        desc: "create a new branch at the current commit",
      },
      {
        cmd: "git checkout",
        desc: "switch to another branch and check it out into your working directory",
      },
      {
        cmd: "git merge [branch]",
        desc: "merge the specified branch’s history into the current one",
      },
      {
        cmd: "git log",
        desc: "show all commits in the current branch’s history",
      },
    ],
  },
  {
    title: "INSPECT & COMPARE",
    description: "Examining logs, diffs and object information",
    commands: [
      {
        cmd: "git log",
        desc: "show the commit history for the currently active branch",
      },
      {
        cmd: "git log branchB..branchA",
        desc: "show the commits on branchA that are not on branchB",
      },
      {
        cmd: "git log --follow [file]",
        desc: "show the commits that changed file, even across renames",
      },
      {
        cmd: "git diff branchB...branchA",
        desc: "show the diff of what is in branchA that is not in branchB",
      },
      {
        cmd: "git show [SHA]",
        desc: "show any object in Git in human-readable format",
      },
    ],
  },
  {
    title: "TRACKING PATH CHANGES",
    description: "Versioning file removes and path changes",
    commands: [
      {
        cmd: "git rm [file]",
        desc: "delete the file from project and stage the removal for commit",
      },
      {
        cmd: "git mv [existing-path] [new-path]",
        desc: "change an existing file path and stage the move",
      },
      {
        cmd: "git log --stat -M",
        desc: "show all commit logs with indication of any paths that moved",
      },
    ],
  },
  {
    title: "SHARE & UPDATE",
    description:
      "Retrieving updates from another repository and updating local repos",
    commands: [
      {
        cmd: "git remote add [alias] [url]",
        desc: "add a git URL as an alias",
      },
      {
        cmd: "git fetch [alias]",
        desc: "fetch down all the branches from that Git remote",
      },
      {
        cmd: "git merge [alias]/[branch]",
        desc: "merge a remote branch into your current branch to bring it up to date",
      },
      {
        cmd: "git push [alias] [branch]",
        desc: "Transmit local branch commits to the remote repository branch",
      },
      {
        cmd: "git pull",
        desc: "fetch and merge any commits from the tracking remote branch",
      },
    ],
  },
  {
    title: "REWRITE HISTORY",
    description: "Rewriting branches, updating commits and clearing history",
    commands: [
      {
        cmd: "git rebase [branch]",
        desc: "apply any commits of current branch ahead of specified one",
      },
      {
        cmd: "git reset --hard [commit]",
        desc: "clear staging area, rewrite working tree from specified commit",
      },
    ],
  },
  {
    title: "TEMPORARY COMMITS",
    description:
      "Temporarily store modified, tracked files in order to change branches",
    commands: [
      {
        cmd: "git stash",
        desc: "Save modified and staged changes",
      },
      {
        cmd: "git stash list",
        desc: "list stack-order of stashed file changes",
      },
      {
        cmd: "git stash pop",
        desc: "write working from top of stash stack",
      },
      {
        cmd: "git stash drop",
        desc: "discard the changes from top of stash stack",
      },
    ],
  },
  {
    title: "SUBMODULES",
    description: "Managing repositories within repositories",
    commands: [
      {
        cmd: "git submodule add [url] [path]",
        desc: "add a repository as a submodule at the specified path",
      },
      {
        cmd: "git submodule init",
        desc: "initialize all submodules recorded in the index",
      },
      {
        cmd: "git submodule update",
        desc: "fetch and checkout the committed submodule versions",
      },
      {
        cmd: "git submodule update --init --recursive",
        desc: "initialize and update all submodules, including nested ones",
      },
      {
        cmd: "git submodule update --remote",
        desc: "update submodules to the latest commit on their remote tracking branch",
      },
      {
        cmd: "git clone --recurse-submodules [url]",
        desc: "clone a repository and all its submodules in one command",
      },
      {
        cmd: "git submodule status",
        desc: "show the current commit, path, and branch of each submodule",
      },
      {
        cmd: "git submodule summary",
        desc: "show a summary of changes between committed and checked-out submodule versions",
      },
    ],
  },
  {
    title: "WORKTREES",
    description:
      "Working on multiple branches simultaneously in separate directories",
    commands: [
      {
        cmd: "git worktree add [path] [branch]",
        desc: "create a new worktree at the given path for the specified branch",
      },
      {
        cmd: "git worktree add -b [new-branch] [path]",
        desc: "create a new worktree with a new branch at the given path",
      },
      {
        cmd: "git worktree list",
        desc: "list all worktrees associated with the repository",
      },
      {
        cmd: "git worktree remove [path]",
        desc: "remove a worktree and its administrative files",
      },
      {
        cmd: "git worktree prune",
        desc: "clean up stale worktree tracking information",
      },
    ],
  },
];

export default function CheatSheetPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-(--background)">
      <Header reputation={user?.reputation ?? 0} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <SecondaryHeader
          backTo="/dashboard"
          backLabel="Back to Dashboard"
          eyebrow="QUICK REFERENCE"
          title="GIT CHEAT SHEET"
          description="A compact set of commands for common Git tasks during your investigations."
        />

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="case-card p-5 md:p-6">
              <h2 className="font-typewriter text-xl text-(--primary) mb-4">
                {section.title}
              </h2>
              <p className="text-sm text-(--foreground-muted) mb-4">
                {section.description}
              </p>

              <div className="space-y-2">
                {section.commands.map((item) => (
                  <div
                    key={`${section.title}-${item.cmd}`}
                    className="grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr] gap-2 md:gap-4 p-3 bg-(--background-terminal) border border-[#222]"
                  >
                    <code className="font-mono text-sm text-(--foreground-terminal) break-all">
                      {item.cmd}
                    </code>
                    <p className="text-sm text-(--foreground-muted) self-center">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
