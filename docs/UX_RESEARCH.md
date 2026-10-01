# HAAFIZ EDU — UX research and design direction

Research date: 1 October 2026

## Product experience principles

1. **One clear next action.** The home screen prioritizes `Continue learning`; analytics support that action instead of competing with it.
2. **Actionable mastery, not vanity charts.** Every mastery signal links to a recommended activity and explains why it was selected.
3. **Student agency.** Recommendations offer 2–3 bounded choices and allow plan editing. Adaptation assists rather than traps the learner.
4. **Progressive disclosure.** The default surface stays calm; concept evidence, model reasoning, and detailed analytics open on demand.
5. **Visible learning loop.** Every lesson follows Learn → Recall → Feedback → Explain back → Schedule review.
6. **Calm motivation.** Streaks and milestones provide encouragement without casino-like rewards, shame, or punitive loss aversion.
7. **Mobile and low-bandwidth first.** Text-first screens, system icons, compressed assets, resilient loading states, and offline-ready navigation.
8. **Trust through transparency.** Low-data mastery is labeled as an estimate. The interface exposes evidence count and “Why this?” reasoning.
9. **Accessible by default.** WCAG 2.2 AA target, semantic landmarks, keyboard operation, visible focus, minimum 24×24 targets (44×44 preferred), sufficient contrast, reduced-motion support, and no color-only meaning.
10. **Language is a setting, not a separate product.** Roman Urdu and English can be switched without losing context; tutor responses mirror the learner naturally.

## Information architecture

### Student navigation
- Today
- Learn
- Practice
- Tutor
- Progress
- Library

Secondary items (planner settings, notifications, profile, support) do not crowd primary learning navigation.

### Teacher navigation
- Class pulse
- Students
- Concepts
- Assignments
- Content
- Interventions

## Visual direction

HAAFIZ should not imitate Maahir. The intended visual character is **calm, credible, warm, and academically focused**:

- warm off-white canvas rather than sterile white everywhere;
- deep ink typography for high legibility;
- indigo as the primary action color, emerald for established mastery, amber for attention;
- generous spacing and restrained shadows;
- data visualizations accompanied by text summaries;
- clear Urdu-compatible typography and no tiny dashboard labels;
- purposeful motion only for status feedback and transitions.

## Research translated into requirements

- Recent learning-dashboard research emphasizes student agency, current/past outcomes, completion of required tasks, clear hierarchy, and support for planning, performance, and self-evaluation.
- Explainable study-planning research favors editable plans, reasons for sequence choices, and expandable explanations to avoid overload.
- Dashboard literature finds that descriptive metrics alone are insufficient; recommendations must become concrete next steps and predictive claims should explain their basis.
- W3C mobile accessibility guidance applies WCAG to mobile web applications; HAAFIZ therefore treats keyboard support, target sizing, orientation, labels, and focus visibility as release criteria.

## UX acceptance checklist

- A returning learner can begin the recommended activity in two interactions or fewer.
- Every recommendation has a “Why this?” explanation.
- Every chart has an equivalent text summary.
- Empty, loading, offline, permission-denied, and error states are designed.
- AI-generated content is visibly identified and can be reported.
- Mastery displays attempts/evidence and never presents unsupported certainty.
- Main workflows work at 320px width and with keyboard only.
- The interface remains usable with 200% text zoom and reduced motion.

## Sources reviewed

- W3C, Mobile Accessibility: https://www.w3.org/WAI/standards-guidelines/mobile/
- WCAG 2.2 overview and mobile/cognitive additions: https://www.wcag.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/
- Student dashboard preferences and self-regulation (2026): https://link.springer.com/article/10.1007/s10758-026-09969-4
- Explainable, controllable study planning (PlanGlow, 2025): https://www.xiameng.org/2025%20PlanGlow.pdf
- Actionable and explainable learning analytics dashboards: https://pmc.ncbi.nlm.nih.gov/articles/PMC8853217/
