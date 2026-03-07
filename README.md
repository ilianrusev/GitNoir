# 🕵️ Git Noir

**Git Noir** is a detective-themed game where you learn Git by solving mysteries inside real repositories.

Instead of memorizing commands, players investigate suspicious commits, lost branches, broken merges, and missing files. Each case presents a Git problem that must be solved using real Git commands.

You are the detective.  
The repository is the crime scene.

---

## 🎮 How the Game Works

Each **case** is a mystery scenario where something has gone wrong inside a Git repository.

Your job is to investigate the situation and fix it using Git commands.

Every case contains:

- A detective-style story introduction
- Step-by-step investigation tasks
- Real Git commands that solve the problem
- Points for completing steps
- Increasing difficulty as you progress

The goal is to learn Git through **problem solving and exploration**, just like real development situations.

---


## 🚧 Project Goals

Git Noir aims to make learning Git:

- 🎮 **Interactive**
- 🧠 **Memorable**
- 🕵️ **Fun**

Instead of tutorials, players learn by **investigating problems and fixing repositories**.

---

## ✅ Case Validation

Before opening a pull request that changes case files, run local schema validation:

```bash
npm run validate:cases
```

This validates all JSON files in `src/data/cases` against the schemas in `src/data/schemas`.
If any file is invalid, the command exits with an error and prints the validation details.

---

## 🧩 Tutorial: Add a New Case

Follow these steps to add a case that works with the current data structure and schemas.

1. Pick a difficulty folder:
	 - `src/data/cases/beginner`
	 - `src/data/cases/intermediate`
	 - `src/data/cases/advanced`

2. Create a new file using this naming pattern:
	 - `case-beginner-00X.json`
	 - `case-intermediate-00X.json`
	 - `case-advanced-00X.json`

3. Use this JSON structure (all fields are required):

```json
{
	"id": "case-021",
	"title": "THE BRANCH ALIBI",
	"description": "A suspect branch disappeared after a rushed investigation.",
	"difficulty": "Beginner",
	"unlock_cost": 0,
	"total_points": 100,
	"story_intro": "A short detective-style intro to the scenario.",
	"steps": [
		{
			"instruction": "Check all local branches.",
			"narrative": "I needed to see every lead before making a move.",
			"expected_commands": ["git branch"],
			"hint": "List branches",
			"points": 50
		},
		{
			"instruction": "Switch to the suspect branch.",
			"narrative": "Time to chase the main lead.",
			"expected_commands": ["git switch feature/alibi", "git checkout feature/alibi"],
			"hint": "Move to the branch",
			"points": 50
		}
	]
}
```

4. Keep values valid:
	 - `id` must match `case-###` (example: `case-021`)
	 - `difficulty` must be exactly `Beginner`, `Intermediate`, or `Advanced`
	 - `unlock_cost` must be `0` or higher
	 - `total_points` must be at least `1`
	 - each step needs: `instruction`, `narrative`, `expected_commands`, `hint`, `points`

5. Validate before committing:

```bash
npm run validate:cases
```

If validation passes, your case is ready for PR review.

---

## 🤝 Contributing

Contributions are welcome!

If you'd like to:

- add new cases
- improve existing scenarios
- fix bugs
- suggest features

Feel free to **open an issue** or submit a **pull request**.

Anyone is welcome to help improve Git Noir and expand the detective universe.
