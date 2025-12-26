# Apollo Mission Scroll Animation

## Project Overview
An interactive scroll-based animation that visualizes the stages of an Apollo-style lunar mission. As users scroll through the page, they follow the spacecraft from Earth launch to Moon landing and back.

## Tech Stack
- **Three.js** (r128) - 3D graphics via CDN
- **Vanilla HTML/CSS/JS** - No build tools or frameworks
- **No dependencies** - Everything runs directly in the browser

## File Structure
```
space-simulation/
├── index.html      # Main HTML with UI elements
├── styles.css      # Styling for overlays and UI
├── main.js         # Three.js scene and scroll animation
└── CLAUDE.md       # This file
```

## Key Architecture Decisions

### Camera
- **Fixed overview camera** - Shows Earth, Moon, and full trajectory simultaneously
- Camera position: `(500, 800, 1400)` looking at center of Earth-Moon system
- User requested this over following/cinematic cameras

### Visual Style
- **Minimalist/Flat** - Clean shapes, solid colors, no textures
- Educational content displayed in semi-transparent overlay panels
- Progress indicator on right side shows mission stages

### Mission Stages (12 total)
1. Launch
2. Stage Separation
3. Earth Orbit
4. TLI Burn
5. CSM/LM Docking
6. Lunar Transit
7. Lunar Orbit Insertion
8. LM Descent
9. Moon Landing
10. LM Ascent
11. Trans-Earth Injection
12. Splashdown

### 3D Objects
- Earth (radius: 100) with atmosphere glow and clouds
- Moon (radius: 27) at position x=1000
- Command/Service Module spacecraft
- Lunar Module (visible only during lunar phases)
- Trajectory paths (outbound: blue, return: cyan)
- Orbit rings around Earth and Moon

## Development

### Run locally
```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

### Code Conventions
- All 3D objects created in dedicated `create*()` functions
- Scroll progress (0-1) drives all animations
- Stage-specific logic in `updateSpacecraftPosition()` switch statement
- Educational content stored in `missionStages` array at top of main.js

## UI Elements
- `#stage-label` - Current stage number and name (top-left)
- `#info-panel` - Educational content with live stats (bottom-left)
- `#progress-container` - Vertical progress bar with stage markers (right)
- `#scroll-indicator` - Initial prompt to scroll (hidden after scrolling)

## Constants
```javascript
CAMERA_DISTANCE = 1400
CAMERA_HEIGHT = 800
CENTER_X = 500
```
