---
name: skill-manager
description: "Use when you need to manage, create, or update skills in this project. Includes instructions for editing the skills index, creating new skills from scratch, updating existing skills, and consolidating knowledge. This skill helps maintain the project's knowledge base."
---

# Skill Manager

## When to Use This Skill

- Creating a new skill to capture developer knowledge
- Updating skills index
- Consolidating code patterns into reusable skills
- Refactoring existing skills

---

## Skills Index

When adding a new skill, update the index file to include it:

```markdown
| Task | Skill | Description |
|------|-------|-------------|
| What this skill does | skill-name | Brief description |
```

---

## Creating a New Skill

### Step 1: Create Directory

```bash
mkdir .agents/skills/[skill-name]/
```

### Step 2: Write SKILL.md

Every skill needs a SKILL.md with this structure:

```markdown
---
name: skill-name
description: "Use when [when to use this skill]. Includes [what it contains]."
---

# Skill Title

## When to Use This Skill

Specific use cases for this skill.

## [Main Content]

Detailed instructions, patterns, code examples

## Common Issues

Troubleshooting tips

## Related Skills

Links to other skills
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (kebab-case) |
| `description` | Yes | When to trigger, what it does |

### Description Guidelines

The description is the triggering mechanism. Be descriptive:

**Good**:
```yaml
description: "Use when creating Gutenberg blocks with InspectorControls organized in tabs, responsive device switching, and custom CSS editors."
```

**Bad**:
```yaml
description: "Gutenberg blocks help"
```

---

## Skill Content Guidelines

### When to Use This Skill

Start with clear use cases. Helps the AI know when to invoke the skill.

### Main Content

1. Conceptual overview
2. Code patterns with examples
3. Configuration options
4. Common issues

### Related Skills

End with links to other skills for context.

---

## Updating an Existing Skill

When discovering new patterns or fixing issues:

1. Read the current skill
2. Identify what needs to change
3. Update the relevant section
4. Add new code examples if needed

---

## Consolidating Knowledge into Skills

When repeating patterns:

1. **Identify the pattern**: What code/approach gets reused?
2. **Extract to skill**: Create a new skill or extend existing
3. **Document thoroughly**: Include edge cases and gotchas
4. **Update index**: Add to skills index if new

---

## Best Practices

1. **One skill per concern**: Don't bundle too much in one skill
2. **Link skills**: Reference related skills for context
3. **Keep updated**: Update skills when patterns change
4. **Test examples**: Code examples should work as shown
5. **Concept-focused**: Focus on patterns, not file paths

## Skill Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Block patterns | kebab-case | `kadence-style-blocks` |
| Domain skills | kebab-case | `skill-manager` |

---

## Pro Tips

- **Progressive disclosure**: Skills can reference other skills
- **Code examples**: Include copy-paste ready code
- **Troubleshooting**: Add common issues section
- **Concept over structure**: Don't assume file paths

---

## Related Skills

- `gutenberg-blocks-development` - Overview of block development
- `kadence-style-blocks` - Professional UI patterns
- `server-side-render-blocks` - PHP server rendering
