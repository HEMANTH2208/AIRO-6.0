# Icon Reference Guide - AIRO 6.0

Quick reference for all Lucide React icons used in the project.

## 🧭 Navigation Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `Home` | Navbar, Footer | Home/Home Base links | 14-16px |
| `Calendar` | Navbar, Footer | Events/Calendar links | 14-16px |
| `UserPlus` | Navbar, Footer | Register/Sign up | 14-16px |
| `Info` | Navbar, Footer | About/Information | 14px |
| `LayoutDashboard` | Footer | Dashboard/Mission Log | 14px |

## 👤 User & Profile Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `User` | Navbar | Profile button | 16px |
| `LogOut` | Navbar | Logout action | 12px |
| `Users` | Multiple | Team/Group indicators | 12-16px |
| `Trophy` | Home page | Achievement/Registry | 14px |

## ⚡ Action Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `Zap` | Multiple | Primary actions, Energy theme | 12-20px |
| `Download` | Home page | Download ID button | 20px |
| `ArrowRight` | Multiple | Directional navigation | 14-20px |
| `ChevronRight` | Navbar | List item indicators | 14px |
| `Eye` | Events page | View details | 16px |

## ✅ Status & Feedback Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `CheckCircle` | Events, Home | Success/Confirmed status | 12px |
| `XCircle` | Events page | Closed/Inactive status | 12px |
| `Sparkles` | Home page | Special features, Free badge | 14-16px |

## 📍 Information Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `Calendar` | Home page | Date information | 16px |
| `MapPin` | Home, Footer | Location information | 14-16px |
| `Clock` | Events, Home | Duration/Time | 12-14px |
| `Mail` | Footer | Email contact | 14px |

## 🎯 Process & Flow Icons

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `Target` | Home page | Protocol/Goal section | 14px |
| `Rocket` | Home page | Launch/Activate step | 32px |
| `Globe` | Home page | Global/Network step | 32px |

## 🎮 Menu & Controls

| Icon | Component | Usage | Size |
|------|-----------|-------|------|
| `Menu` | Navbar | Open mobile menu | 20px |
| `X` | Navbar | Close mobile menu | 20px |

---

## 📦 Import Examples

### Single Icon Import
```typescript
import { Zap } from "lucide-react";

<Zap size={16} />
```

### Multiple Icons Import
```typescript
import { Home, Calendar, UserPlus, Info } from "lucide-react";

<Home size={16} />
<Calendar size={16} />
```

### Icon with Styling
```typescript
import { Trophy } from "lucide-react";

<Trophy 
  size={20} 
  style={{ color: "var(--primary)" }} 
/>
```

### Icon in Button
```typescript
import { Zap } from "lucide-react";

<button className="btn btn-primary">
  <Zap size={16} />
  Transform Now
</button>
```

---

## 🎨 Styling Guidelines

### Size Convention:
- **12px**: Small inline icons (badges, meta info)
- **14px**: Footer/navigation secondary icons
- **16px**: Primary navigation, buttons
- **20px**: Large buttons, CTAs
- **32px**: Feature icons, process steps

### Color Usage:
- `color: "var(--primary)"` - Primary actions, energy theme
- `color: "var(--text-secondary)"` - Informational icons
- `color: "var(--error)"` - Negative actions
- `color: "var(--success)"` - Success indicators

### Spacing:
- Use `gap: "0.35rem"` for tight spacing (12-14px icons)
- Use `gap: "0.5rem"` for standard spacing (16px icons)
- Use `gap: "0.75rem"` for loose spacing (20px+ icons)

---

## ♿ Accessibility

### Icons with Text (Recommended):
```typescript
<button>
  <Zap size={16} />
  Transform Now
</button>
```

### Icon-Only Buttons:
```typescript
<button aria-label="Close menu">
  <X size={20} />
</button>
```

### Decorative Icons:
```typescript
<span aria-hidden="true">
  <Sparkles size={14} />
</span>
```

---

## 🔄 Animation Examples

### Icon Rotation on Hover:
```typescript
<motion.div
  whileHover={{ rotate: 360, scale: 1.1 }}
  transition={{ duration: 0.5 }}
>
  <Zap size={32} />
</motion.div>
```

### Icon Scale on Interaction:
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Download size={20} />
  Download
</motion.button>
```

---

## 📊 Icon Usage by Component

| Component | Total Icons | Most Used |
|-----------|-------------|-----------|
| Navbar | 10 | `Home`, `User`, `Zap` |
| Footer | 7 | `Home`, `Mail`, `MapPin` |
| Home Page | 13 | `Zap`, `Users`, `Calendar` |
| Events Page | 6 | `Clock`, `Users`, `CheckCircle` |

---

## 💡 Best Practices

1. **Consistency**: Use the same icon for the same action across all pages
2. **Size**: Keep icons within 12-20px for UI elements
3. **Pairing**: Always pair icons with text labels for clarity
4. **Color**: Use theme colors for consistency
5. **Spacing**: Maintain consistent gaps between icons and text
6. **Performance**: Import only the icons you use
7. **Accessibility**: Provide labels for icon-only buttons

---

## 🚀 Quick Add Icon

To add a new icon to any component:

1. Import the icon:
```typescript
import { NewIcon } from "lucide-react";
```

2. Use it with proper sizing:
```typescript
<NewIcon size={16} />
```

3. Add it to a button/link:
```typescript
<button style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
  <NewIcon size={16} />
  Button Text
</button>
```

---

**Total Icons Used**: 24 unique Lucide React icons
**Total Icon Instances**: 50+ across the application
**Bundle Impact**: Minimal (tree-shaken imports)
