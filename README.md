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

## 🤝 Contributing

Contributions are welcome!

If you'd like to:

- add new cases
- improve existing scenarios
- fix bugs
- suggest features

Feel free to **open an issue** or submit a **pull request**.

Anyone is welcome to help improve Git Noir and expand the detective universe.
