/**
 * Financial Analysis & Management - Storage Module
 * Handles all localStorage operations for data persistence
 */

const Storage = {
    // Storage keys
    KEYS: {
        WEEK_DATA: 'fintrack_weekData',
        EXTRAS: 'fintrack_extras',
        HISTORY: 'fintrack_history',
        SETTINGS: 'fintrack_settings',
        LAST_SAVED: 'fintrack_lastSaved'
    },

    /**
     * Get current week data
     * @returns {Object} Week data with incomes and expenses arrays
     */
    getWeekData: function() {
        const data = localStorage.getItem(this.KEYS.WEEK_DATA);
        if (data) {
            return JSON.parse(data);
        }
        // Initialize with empty week
        return {
            incomes: [0, 0, 0, 0, 0, 0, 0],
            expenses: [0, 0, 0, 0, 0, 0, 0],
            weekStart: Date.now()
        };
    },

    /**
     * Save week data
     * @param {Object} data - Week data to save
     */
    saveWeekData: function(data) {
        data.weekStart = Date.now();
        localStorage.setItem(this.KEYS.WEEK_DATA, JSON.stringify(data));
        this.updateLastSaved();
    },

    /**
     * Get extra expenses
     * @returns {Object} Extra expenses object
     */
    getExtras: function() {
        const data = localStorage.getItem(this.KEYS.EXTRAS);
        return data ? JSON.parse(data) : {};
    },

    /**
     * Save extra expenses
     * @param {Object} extras - Extra expenses object
     */
    saveExtras: function(extras) {
        localStorage.setItem(this.KEYS.EXTRAS, JSON.stringify(extras));
        this.updateLastSaved();
    },

    /**
     * Get historical data
     * @returns {Array} Array of past week data
     */
    getHistory: function() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Save current week to history
     * @param {Object} weekData - Week data to archive
     */
    saveToHistory: function(weekData) {
        const history = this.getHistory();
        history.unshift({
            ...weekData,
            savedAt: Date.now()
        });
        // Keep only last 52 weeks (1 year)
        if (history.length > 52) {
            history.pop();
        }
        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    },

    /**
     * Get user settings
     * @returns {Object} User settings
     */
    getSettings: function() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            currency: '€',
            weekStartDay: 1, // Monday
            theme: 'light'
        };
    },

    /**
     * Save user settings
     * @param {Object} settings - Settings object
     */
    saveSettings: function(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    /**
     * Get last saved timestamp
     * @returns {number|null} Timestamp or null
     */
    getLastSaved: function() {
        return localStorage.getItem(this.KEYS.LAST_SAVED);
    },

    /**
     * Update last saved timestamp
     */
    updateLastSaved: function() {
        localStorage.setItem(this.KEYS.LAST_SAVED, Date.now().toString());
    },

    /**
     * Calculate total income
     * @returns {number} Total income
     */
    getTotalIncome: function() {
        const data = this.getWeekData();
        return data.incomes.reduce((sum, val) => sum + val, 0);
    },

    /**
     * Calculate total regular expenses
     * @returns {number} Total expenses
     */
    getTotalExpenses: function() {
        const data = this.getWeekData();
        return data.expenses.reduce((sum, val) => sum + val, 0);
    },

    /**
     * Calculate total extra expenses
     * @returns {number} Total extras
     */
    getTotalExtras: function() {
        const extras = this.getExtras();
        return Object.values(extras).reduce((sum, val) => sum + val, 0);
    },

    /**
     * Calculate net profit
     * @returns {number} Net profit (can be negative)
     */
    getNetProfit: function() {
        return this.getTotalIncome() - (this.getTotalExpenses() + this.getTotalExtras());
    },

    /**
     * Get daily profits
     * @returns {Array} Array of daily profit values
     */
    getDailyProfits: function() {
        const data = this.getWeekData();
        return data.incomes.map((income, index) => income - data.expenses[index]);
    },

    /**
     * Get best performing day
     * @returns {Object} Day info with name and index
     */
    getBestDay: function() {
        const profits = this.getDailyProfits();
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const bestIndex = profits.indexOf(Math.max(...profits));
        return {
            name: dayNames[bestIndex],
            index: bestIndex,
            profit: profits[bestIndex]
        };
    },

    /**
     * Get worst performing day
     * @returns {Object} Day info with name and index
     */
    getWorstDay: function() {
        const profits = this.getDailyProfits();
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const worstIndex = profits.indexOf(Math.min(...profits));
        return {
            name: dayNames[worstIndex],
            index: worstIndex,
            profit: profits[worstIndex]
        };
    },

    /**
     * Get comprehensive week summary
     * @returns {Object} Complete week summary
     */
    getWeekSummary: function() {
        const data = this.getWeekData();
        const extras = this.getExtras();
        
        const income = this.getTotalIncome();
        const expenses = this.getTotalExpenses();
        const extrasTotal = this.getTotalExtras();
        const totalExpenses = expenses + extrasTotal;
        const profit = income - totalExpenses;
        const bestDay = this.getBestDay();
        const worstDay = this.getWorstDay();
        
        return {
            incomes: data.incomes,
            expenses: data.expenses,
            extras: extras,
            totalIncome: income,
            totalExpenses: expenses,
            totalExtras: extrasTotal,
            grandTotalExpenses: totalExpenses,
            netProfit: profit,
            bestDay: bestDay,
            worstDay: worstDay,
            dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            isProfitable: profit >= 0,
            profitMargin: income > 0 ? ((profit / income) * 100).toFixed(1) : 0
        };
    },

    /**
     * Export data as JSON string
     * @returns {string} JSON string of all data
     */
    exportData: function() {
        const exportData = {
            weekData: this.getWeekData(),
            extras: this.getExtras(),
            history: this.getHistory(),
            settings: this.getSettings(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(exportData, null, 2);
    },

    /**
     * Import data from JSON string
     * @param {string} jsonString - JSON string to import
     * @returns {boolean} Success status
     */
    importData: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.weekData) {
                this.saveWeekData(data.weekData);
            }
            if (data.extras) {
                this.saveExtras(data.extras);
            }
            if (data.history) {
                localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(data.history));
            }
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    },

    /**
     * Clear all stored data
     */
    clearAllData: function() {
        localStorage.removeItem(this.KEYS.WEEK_DATA);
        localStorage.removeItem(this.KEYS.EXTRAS);
        localStorage.removeItem(this.KEYS.LAST_SAVED);
        // Note: We keep history and settings
    },

    /**
     * Complete reset including history
     */
    completeReset: function() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    /**
     * Check if there's unsaved data
     * @returns {boolean} True if there's recent unsaved data
     */
    hasUnsavedChanges: function() {
        const lastSaved = this.getLastSaved();
        if (!lastSaved) return false;
        
        // Consider changes unsaved if less than 5 minutes have passed
        const fiveMinutes = 5 * 60 * 1000;
        return (Date.now() - Number(lastSaved)) < fiveMinutes;
    },

    /**
     * Get storage usage info
     * @returns {Object} Storage info with used and available bytes
     */
    getStorageInfo: function() {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += (localStorage[key].length + key.length) * 2; // UTF-16 encoding
            }
        }
        
        return {
            used: total,
            usedFormatted: this.formatBytes(total),
            available: 5 * 1024 * 1024 - total, // Approx 5MB limit
            availableFormatted: this.formatBytes(5 * 1024 * 1024 - total)
        };
    },

    /**
     * Format bytes to human readable string
     * @param {number} bytes - Bytes to format
     * @returns {string} Formatted string
     */
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Make Storage available globally
window.Storage = Storage;
