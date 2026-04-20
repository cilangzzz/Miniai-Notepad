# Design System Specification: Editorial Neo-Brutalism

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Editor"**

This design system rejects the "safe" constraints of standard web architecture in favor of a high-energy, editorial aesthetic. It is built on the friction between **rigid geometry and intentional instability**. By utilizing skewed containers, heavy stroke weights, and a jarringly high-contrast palette, we create a digital experience that feels tactile, urgent, and premium. 

Unlike traditional "flat" design, "The Kinetic Editor" uses **intentional asymmetry** and **overlapping layers** to command attention. Every element is designed to feel as though it was physically cut and pasted onto the screen, breaking the fourth wall of the digital grid.

---

## 2. Colors & Surface Architecture

The palette is anchored by an uncompromising black (`#131313`), providing a void-like canvas that allows our primary and secondary signals to vibrate with maximum intensity.

### Color Tokens
- **Primary (Vibrant Signal):** `primary_container` (`#FFD700`) — Used for hero highlights and critical action states.
- **Secondary (Teal Depth):** `secondary_container` (`#007F7F`) — Used for content blocks and structural differentiation.
- **Background:** `background` (`#131313`) — The absolute baseline.

### The "No-Line" Rule
While the system uses thick 4px borders for core component definition, **never use 1px hairlines to separate sections.** Sectioning must be achieved through:
1. **Background Contrast:** A `surface_container_low` section sitting directly against the `background`.
2. **Negative Space:** Aggressive vertical margins that allow the black void to act as the primary separator.

### Surface Hierarchy & Nesting
Instead of traditional drop shadows, we use "Tonal Nesting." To create depth:
- **Layer 0 (Base):** `surface` (`#131313`)
- **Layer 1 (Recessed):** `surface_container_lowest` (`#0E0E0E`) for secondary input areas.
- **Layer 2 (Elevated):** `surface_container_high` (`#2A2A2A`) for interactive cards that do not use a secondary color fill.

---

## 3. Typography
The type system is a dialogue between the technical precision of **Space Grotesk** and the accessible clarity of **Manrope**.

- **Display & Headlines (Space Grotesk):** These should be treated as graphic elements. Use `display-lg` (3.5rem) with tight letter-spacing for a "poster-like" feel. Headlines must be bold and unapologetic.
- **Body & Titles (Manrope):** Provides the functional counterpoint. `body-lg` at 1rem ensures legibility against high-contrast backgrounds.
- **Hierarchy through Contrast:** To convey brand identity, always pair a `display` headline with a `label-md` in all-caps. This "Big/Small" pairing creates an editorial rhythm seen in high-end print magazines.

---

## 4. Elevation & Depth: The Neo-Brutalist Stack

We move away from the "shadow-physics" of Material Design. In this system, depth is a matter of **physical displacement.**

### The Layering Principle (Offset Containers)
Depth is achieved by offsetting the `primary` or `secondary` fill from its white container stroke.
- **The Skew:** Headers and primary cards should utilize a -1 to -2 degree rotation/skew to break the horizontal plane.
- **Ambient Shadows:** Standard shadows are forbidden. If a floating element (like a FAB) requires lift, use a **Hard-Stop Shadow**: a solid block of `surface_container_highest` offset by 8px, rather than a soft blur.

### The "Ghost Border"
When an element needs to be subtly defined without the "noise" of a heavy white border, use the `outline_variant` (`#4D4732`) at **20% opacity**. This creates a "etched" look that feels premium rather than "default."

### Glassmorphism
For floating navigation or overlays, use `surface` colors at 80% opacity with a `20px` backdrop-blur. This ensures the vibrant yellow and teal highlights "bleed" through the dark UI, maintaining tonal depth.

---

## 5. Components

### Buttons
- **Primary:** `primary_container` (#FFD700) fill, 4px solid white border, black text. On hover, the container skews by an additional 1 degree.
- **Secondary:** Transparent fill, 4px solid white border, white text.
- **Tertiary:** Text-only with a heavy underline (`4px`) using the `secondary` token.

### Cards (The "Stamp" Style)
Cards must not use rounded corners (`radius: 0px`). 
- **Structure:** A `secondary_container` fill with a white 4px border. 
- **Interaction:** On hover, the card "lifts" by moving 4px up and 4px left, revealing a solid black "shadow" underneath.

### Input Fields
- **State:** Solid black background, 4px white border. 
- **Focus State:** Border color shifts to `primary_container` (#FFD700) with a 2px offset "ghost" border in white.

### Selection Chips
- Rectangular, 0px radius. Use `secondary_fixed_dim` for unselected and `primary_container` for selected. Use aggressive 16px horizontal padding.

---

## 6. Do's and Don'ts

### Do
- **Do** overlap elements. Let a button "break" the border of the card it sits inside.
- **Do** use `0px` border radius everywhere. Sharp edges are a requirement, not a suggestion.
- **Do** use high-contrast type scales. If a headline is big, make it *huge*.
- **Do** use the Teal (`#008080`) as a "calming" structural element to balance the aggressive Yellow (`#FFD700`).

### Don't
- **Don't** use soft gradients. All transitions must be stepped or hard-edged.
- **Don't** use 1px lines or dividers. Use vertical space or color-blocking.
- **Don't** center-align long-form text. Keep it left-aligned to maintain the "grid-breaking" editorial feel.
- **Don't** use standard "drop shadows." They dilute the high-contrast impact of the black background.