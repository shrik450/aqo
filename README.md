# AQO (AI Query Optimizer)

Use an LLM to optimize your SQL queries. Ships with a CLI interface, an API and
a web UI.

This is a course project for CS 5614 (DBMS) at Virginia Tech. Our group consists
of:

- Parth Bapat - @bapatanuparth
- Shreyas Pawar - @Roarke-Rey
- Shrikanth Upadhayaya - @shrik450

## Introduction

This project is managed with [Poetry](https://python-poetry.org/). To install
dependencies, run:

```bash
poetry install
```

Then, to run the project, use:

```bash
poetry run aqo
```

As it will set up and manage a virtual environment for you. To add dependencies,
use:

```bash
poetry add <package>
```

## Web UI

To run the web UI, use:

```bash
poetry run aqo <path/to/config> serve
```

Then, head into the `ui/` directory and run:

```bash
npm install
npm run dev
```
