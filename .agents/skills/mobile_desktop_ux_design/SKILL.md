---
name: mobile_desktop_ux_design
description: World-class UI/UX design standards for clutter-free, executive mobile (iPhone) and desktop (Mac) finance applications.
---

# Mobile & Desktop UX Design Principles

When building or refining executive personal finance applications for iPhone (PWA/Safari) and Mac (Chrome/Safari):

## 1. Visual De-cluttering & Information Hierarchy
- **Progressive Disclosure:** Hide secondary details inside collapsible sections, modals, or clean expandable rows to keep the main view clean and scannable.
- **Micro-Spacers & Padding:** Use consistent 8px/16px/24px grid spacing with subtle 1px border separators rather than heavy boxes.
- **Typography Hierarchy:** Limit font weights to 3 levels (800 for key metrics, 700 for subtitles/labels, 500 for secondary text). Ensure readable 14px+ body text on mobile.

## 2. Executive Mobile UX (iPhone PWA & Safari)
- **Thumb Zone Friendly:** Place primary CTA buttons, month switchers, and quick filters within easy reach at the bottom or comfortable tap zones.
- **Card-to-Row Optimization:** Use clean, compact touch cards for transactions with generous tap targets (minimum 44x44px for buttons).
- **Sticky Summary Pills:** Keep vital totals (Spent, Paid, Pending) in compact, high-contrast badges that don't crowd the viewport.

## 3. Executive Desktop UX (Mac Chrome & Safari)
- **Responsive Multi-Column Grids:** Utilize side-by-side card layouts (2-column grids) for charts and metrics to maximize widescreen utility without vertical scrolling overload.
- **Interactive Micro-animations:** Add subtle hover effects (`transform: translateY(-2px)`, `box-shadow`) to interactive elements to provide clear feedback.
