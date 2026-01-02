/**
 * Financial Analysis & Management - Theme Manager
 * Handles Light/Dark mode toggling and persistence
 */

const ThemeManager = {
    // Storage Key
    KEY: 'fintrack_theme',

    // Initialize theme
    init: function() {
        // Create toggle button
        this.createToggleButton();

        // Check saved preference or system preference
        const savedTheme = localStorage.getItem(this.KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    },

    // Create the floating toggle button
    createToggleButton: function() {
        const btn = document.createElement('button');
        btn.className = 'theme-toggle-btn';
        btn.title = 'Toggle Dark/Light Mode';
        btn.innerHTML = '🌓'; // Default icon
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
        this.updateButtonIcon(btn);
    },

    // Toggle theme
    toggle: function() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    // Set theme
    setTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.KEY, theme);
        
        // Update button icon if it exists
        const btn = document.querySelector('.theme-toggle-btn');
        if (btn) {
            this.updateButtonIcon(btn, theme);
        }
    },

    // Update button icon based on state
    updateButtonIcon: function(btn, theme) {
        const currentTheme = theme || document.documentElement.getAttribute('data-theme');
        btn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    ThemeManager.init();
});
