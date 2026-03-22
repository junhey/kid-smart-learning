# Accessibility - Reduced Motion Support

## Overview
This application respects user's motion preferences via the `prefers-reduced-motion` CSS media query. This is critical for:
- Children with vestibular disorders (motion sensitivity)
- Users with ADHD who are easily distracted by animations
- Users with epilepsy or seizure disorders
- Users on low-performance devices

## Implementation

### 1. Global CSS (app/globals.css)
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This automatically disables all CSS animations and transitions when the user has enabled "Reduce Motion" in their system settings.

### 2. React Hook (hooks/useReducedMotion.ts)
```tsx
const prefersReducedMotion = useReducedMotion();
```

Use this hook in components to conditionally apply JavaScript-based animations (Framer Motion, canvas-confetti, etc).

### 3. Usage Pattern

#### With Framer Motion:
```tsx
<motion.div
  animate={prefersReducedMotion ? {} : {
    y: [0, -20, 0],
    rotate: [0, 10, -10, 0],
  }}
  transition={prefersReducedMotion ? {} : {
    duration: 3,
    repeat: Infinity,
  }}
>
  {content}
</motion.div>
```

#### With canvas-confetti:
```tsx
if (!prefersReducedMotion) {
  confetti({
    particleCount: 100,
    spread: 70,
  });
}
```

## Testing

### On macOS:
1. Open System Preferences → Accessibility → Display
2. Check "Reduce motion"

### On Windows:
1. Settings → Ease of Access → Display
2. Turn on "Show animations in Windows"

### On iOS:
1. Settings → Accessibility → Motion
2. Enable "Reduce Motion"

### On Android:
1. Settings → Accessibility
2. Enable "Remove animations"

### In Browser DevTools:
Most modern browsers support emulating this:
- Chrome/Edge: DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion`
- Firefox: DevTools → Inspector → Simulate → prefers-reduced-motion: reduce

## What's Preserved vs. Disabled

### ✅ Preserved (Essential Feedback):
- Button hover states (color changes)
- Click/tap feedback (ripples reduced but still visible)
- Focus indicators
- Page transitions (instant instead of animated)

### ❌ Disabled (Decorative):
- Floating emoji animations
- Wiggle/bounce effects
- Star burst animations
- Confetti particles
- Background parallax scrolling

## WCAG Compliance
This implementation helps meet:
- **WCAG 2.1 Success Criterion 2.3.3** (Animation from Interactions) - Level AAA
- **WCAG 2.2 Success Criterion 2.3.3** (Animation from Interactions) - Level AAA

## Future Improvements
- [ ] Add toggle switch in settings panel for users to override system preference
- [ ] Create "Low Motion" mode (reduce intensity but keep some animations)
- [ ] Add telemetry to understand how many users prefer reduced motion
- [ ] Test with real users who have vestibular disorders
