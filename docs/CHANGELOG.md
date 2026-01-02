### 🚀 Project Restructuring & UI Overhaul

#### 📂 File Structure Optimization
- **Refactored Directory Layout**: Moved core application pages (`operating.html`, `report.html`, `about.html`, `contacts.html`) into a dedicated `pages/` directory for better organization.
- **Asset Management**: Centralized styles in `css/`, scripts in `js/`, and documentation in `docs/`.
- **Path Updates**: Updated all relative paths in HTML files to ensure seamless navigation and asset loading.

#### 🎨 UI/UX Modernization
- **Complete Redesign**: Implemented a modern, card-based UI with a consistent color palette (Primary Blue, Success Green, Danger Red).
- **Responsive Layouts**: Fixed grid alignments and container centering across all pages (Home, Operating, Reports, About, Contacts).
- **Dark Mode**: Added full Dark Mode support with a persistent toggle button and theme-aware CSS variables.
- **Sticky Footer**: Engineered a sticky footer that stays at the bottom of the viewport on short pages.

#### 🛠️ Code Quality & Features
- **Modular JavaScript**: Decoupled monolithic inline scripts into specialized modules:
  - `js/app.js`: Core application logic.
  - `js/storage.js`: LocalStorage management.
  - `js/charts.js`: Custom charting library.
  - `js/report.js`: Report generation logic.
  - `js/theme.js`: Theme state management.
- **Data Formatting**: Enforced consistent 2-decimal precision (e.g., `€150.00`) for all financial figures across the app.
- **Chart Improvements**: Fixed messy pie/bar charts with better spacing, legends, and zero-value handling.

#### 🐛 Bug Fixes
- Fixed layout breakage in 'About' and 'Contacts' pages caused by unclosed HTML tags.
- Corrected alignment of hero stats on the landing page.
- Resolved 'no CSS applied' visual bugs by standardizing class names.

