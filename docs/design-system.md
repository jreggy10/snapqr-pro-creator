# SnapQR Design System: Bevel

A bright, consumer-app look: a white canvas, pale blue-gray step panels, fully rounded controls, and a single charcoal action. The shell stays almost monochrome. Saturated color is reserved for small indicators and quick-style swatches.

## Tokens

Colors come in three layers. **Components use only role tokens.** To retheme, change the palette or the role mapping in `src/index.css`, not the components.

```
palette (Bevel names)  →  roles  →  Tailwind classes in components
#ebf0f8 --cloud        →  --panel  →  bg-panel
```

### Roles

| Role | Light | Class | Use for |
|---|---|---|---|
| `canvas` | Paper White `#ffffff` | `bg-canvas` | Page background |
| `panel` | Cloud Card `#ebf0f8` | `bg-panel` | Step panels, segmented groups, the icon button next to the main action |
| `surface` | Paper White `#ffffff` | `bg-surface` | Anything raised on a panel: chips, inputs, the preview card |
| `ink` | Ink `#222326` | `text-ink` | Headings, primary text |
| `ink-muted` | Body Gray `#747679` | `text-ink-muted` | Body copy, helper text, inactive options |
| `action` | Charcoal `#1f2025` | `bg-action text-action-foreground` | The one main action, and selected segmented options |
| `selected` | Metric Blue `#415eee` | `bg-selected text-selected-foreground` | The active QR type, small icon accents |
| `success` | Recovery Green `#31ce01` | `text-success`, `bg-success/10` | "Scans well" |

Standard shadcn variables (`--background`, `--primary`, `--card`...) point at these roles, so stock `ui/` components follow the theme.

Dark mode overrides the palette under `.dark`, and the roles follow automatically.

### Shape and space

- 8px base unit. Panels: 32px padding on desktop, 24px on phones. Gaps between panels: 40px.
- Corners: 28px panels, 24px preview card, 16–20px inner images, full pills for buttons and options.
- Type: system font stack (SF Pro on Apple devices). Headings weight 600 with -0.03em tracking. Hero 60px, panel titles 24px.

## Components

| Component | File | Rules |
|---|---|---|
| Step panel | `components/qr/Panel.tsx` (`Panel`) | `bg-panel`, no border, no shadow. Numbered title in `ink` with the number in `ink-muted`. |
| Option pill | `components/qr/Panel.tsx` (`PillOption`) | Surface pill; `action` fill when selected. Use for every segmented choice. |
| Type selector | `components/qr/ContentPanel.tsx` | Pill row; the active type uses `selected` (the only blue fill). |
| Preview card | `components/qr/QRPreview.tsx` | `bg-surface` plus `shadow-hero`, the **only** shadow on the page. |
| Export row | `components/qr/ExportBar.tsx` | PNG/SVG/PDF share one `bg-panel` pill group. "Save phone card" is the single `bg-action` pill. |
| Header | `pages/Index.tsx` | `hero-backdrop` gradient (sky to cream), used only behind the header. |

## Rules

**Do**
- Keep exactly one `action`-filled button on the page ("Save phone card").
- Put raised controls on `surface`, and separate sections with `panel` fill, not borders.
- Keep body copy `ink-muted`, never pure black.

**Don't**
- Don't use saturated accents as backgrounds for sections or panels.
- Don't add shadows anywhere except the preview card.
- Don't square off buttons; pills are the signature shape.
- **Don't use a Bevel accent as a QR code color as is.** Lilac, coral, and green on white are about 2:1 contrast and fail the scan check. Quick-style chips show the pure accent as the swatch, while the code gets a deeper shade with at least 4.5:1 contrast (`PRESETS` in `components/qr/StylePanel.tsx`).

## Layout

- The preview column is sticky only on viewports at least 760px tall, so the download buttons can't get stuck below the fold.
- Panels stack in one column below 1024px; the preview and downloads come after them.
