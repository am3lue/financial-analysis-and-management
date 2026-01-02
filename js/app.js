/**
 * Financial Analysis & Management - Main Application Logic
 */

// ===== Day Names =====
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_EMOJIS = ["🌅", "🌤️", "🌤️", "🌥️", "🎉", "🎊", "🌙"];

// ===== DOM Elements =====
const elements = {
    daysContainer: null,
    extraReason: null,
    extraAmount: null,
    result: null,
    toastContainer: null
};

// ===== Initialize Application =====
function initApp() {
    // Cache DOM elements
    elements.daysContainer = document.getElementById('daysContainer');
    elements.extraReason = document.getElementById('extraReason');
    elements.extraAmount = document.getElementById('extraAmount');
    elements.result = document.getElementById('result');
    elements.toastContainer = document.getElementById('toastContainer');
    
    // Initialize storage if not exists
    if (!localStorage.getItem('fintrack_weekData')) {
        const initialData = {
            incomes: [0, 0, 0, 0, 0, 0, 0],
            expenses: [0, 0, 0, 0, 0, 0, 0]
        };
        localStorage.setItem('fintrack_weekData', JSON.stringify(initialData));
    }
    
    if (!localStorage.getItem('fintrack_extras')) {
        localStorage.setItem('fintrack_extras', JSON.stringify({}));
    }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    if (!elements.toastContainer) {
        elements.toastContainer = document.getElementById('toastContainer');
    }
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeInUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Day Card Rendering =====
function renderDays() {
    if (!elements.daysContainer) return;
    
    const data = Storage.getWeekData();
    
    elements.daysContainer.innerHTML = DAY_NAMES.map((day, index) => `
        <div class="day-card animate-fade-in" style="animation-delay: ${index * 0.05}s;">
            <div class="day-name">
                ${DAY_EMOJIS[index]}
                ${day}
            </div>
            <div class="day-section income">
                <label>💰 Income</label>
                <div style="display: flex; gap: 8px;">
                    <input type="number" id="income${index}" value="${data.incomes[index]}" 
                        class="day-input" placeholder="0" min="0" step="0.01"
                        oninput="updateDayValue(${index}, 'income')">
                    <button onclick="window.addDayIncome(${index})" class="btn btn-success btn-sm">Add</button>
                </div>
                <div class="day-value income" id="incomeValue${index}">€${Number(data.incomes[index]).toFixed(2)}</div>
            </div>
            <div class="day-section expense">
                <label>💸 Expense</label>
                <div style="display: flex; gap: 8px;">
                    <input type="number" id="expense${index}" value="${data.expenses[index]}" 
                        class="day-input" placeholder="0" min="0" step="0.01"
                        oninput="updateDayValue(${index}, 'expense')">
                    <button onclick="window.addDayExpense(${index})" class="btn btn-danger btn-sm">Add</button>
                </div>
                <div class="day-value expense" id="expenseValue${index}">€${Number(data.expenses[index]).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// ===== Update Day Value =====
function updateDayValue(index, type) {
    const input = document.getElementById(`${type}${index}`);
    const display = document.getElementById(`${type}Value${index}`);
    if (input && display) {
        display.textContent = `€${(Number(input.value) || 0).toFixed(2)}`;
    }
    updateLiveSummary();
}

// ===== Add Income =====
window.addDayIncome = function(dayIndex) {
    const input = document.getElementById(`income${dayIndex}`);
    const value = Number(input.value);
    
    if (!value || value <= 0) {
        showToast('Please enter a valid income amount', 'error');
        return;
    }
    
    const data = Storage.getWeekData();
    data.incomes[dayIndex] += value;
    Storage.saveWeekData(data);
    
    input.value = data.incomes[dayIndex];
    document.getElementById(`incomeValue${dayIndex}`).textContent = `€${data.incomes[dayIndex].toFixed(2)}`;
    
    updateLiveSummary();
    showToast(`Added €${value.toFixed(2)} income for ${DAY_NAMES[dayIndex]}`, 'success');
};

// ===== Add Expense =====
window.addDayExpense = function(dayIndex) {
    const input = document.getElementById(`expense${dayIndex}`);
    const value = Number(input.value);
    
    if (!value || value <= 0) {
        showToast('Please enter a valid expense amount', 'error');
        return;
    }
    
    const data = Storage.getWeekData();
    data.expenses[dayIndex] += value;
    Storage.saveWeekData(data);
    
    input.value = data.expenses[dayIndex];
    document.getElementById(`expenseValue${dayIndex}`).textContent = `€${data.expenses[dayIndex].toFixed(2)}`;
    
    updateLiveSummary();
    showToast(`Added €${value.toFixed(2)} expense for ${DAY_NAMES[dayIndex]}`, 'success');
};

// ===== Extra Expenses Management =====
window.addExtra = function() {
    const reason = elements.extraReason ? elements.extraReason.value.trim() : '';
    const amount = elements.extraAmount ? Number(elements.extraAmount.value) : 0;
    
    if (!reason) {
        showToast('Please enter an expense reason', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    const extras = Storage.getExtras();
    if (extras[reason]) {
        extras[reason] += amount;
    } else {
        extras[reason] = amount;
    }
    Storage.saveExtras(extras);
    
    if (elements.extraReason) elements.extraReason.value = '';
    if (elements.extraAmount) elements.extraAmount.value = '';
    
    renderExtras();
    updateLiveSummary();
    showToast(`Added €${amount.toFixed(2)} for "${reason}"`, 'success');
};

// ===== Render Extras =====
function renderExtras() {
    const extraList = document.getElementById('extraList');
    const noExtras = document.getElementById('noExtras');
    const extraCount = document.getElementById('extraCount');
    
    if (!extraList) return;
    
    const extras = Storage.getExtras();
    const items = Object.entries(extras);
    
    if (extraCount) {
        extraCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
    }
    
    if (items.length === 0) {
        extraList.innerHTML = '';
        if (noExtras) noExtras.style.display = 'block';
        return;
    }
    
    if (noExtras) noExtras.style.display = 'none';
    
    extraList.innerHTML = items.map(([reason, amount], index) => `
        <li class="extra-item animate-fade-in" style="animation-delay: ${index * 0.05}s;">
            <div class="extra-item-info">
                <span>📝</span>
                <span class="extra-item-reason">${reason}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="extra-item-amount">€${amount.toFixed(2)}</span>
                <button onclick="window.deleteExtra('${reason}')" class="extra-item-delete" title="Delete">✕</button>
            </div>
        </li>
    `).join('');
}

// ===== Delete Extra =====
window.deleteExtra = function(reason) {
    const extras = Storage.getExtras();
    delete extras[reason];
    Storage.saveExtras(extras);
    renderExtras();
    updateLiveSummary();
    showToast(`Removed "${reason}"`, 'info');
};

// ===== Update Live Summary =====
function updateLiveSummary() {
    const liveIncome = document.getElementById('liveIncome');
    const liveExpenses = document.getElementById('liveExpenses');
    const liveExtras = document.getElementById('liveExtras');
    const liveProfit = document.getElementById('liveProfit');
    
    const income = Storage.getTotalIncome();
    const expenses = Storage.getTotalExpenses();
    const extrasTotal = Storage.getTotalExtras();
    const profit = Storage.getNetProfit();
    
    if (liveIncome) liveIncome.textContent = `€${income.toFixed(2)}`;
    if (liveExpenses) liveExpenses.textContent = `€${expenses.toFixed(2)}`;
    if (liveExtras) liveExtras.textContent = `€${extrasTotal.toFixed(2)}`;
    if (liveProfit) {
        liveProfit.textContent = `€${profit.toFixed(2)}`;
        liveProfit.style.color = profit >= 0 ? 'var(--success)' : 'var(--danger)';
    }
}

// ===== Weekly Analysis =====
window.analyze = function() {
    const summary = Storage.getWeekSummary();
    const extras = Storage.getExtras();
    
    // Generate extras HTML
    let extrasHTML = Object.entries(extras).map(([reason, amount]) => 
        `<li><span>${reason}</span><span>€${amount.toFixed(2)}</span></li>`
    ).join('');
    
    const reportHTML = `
        <div class="report-section animate-fade-in" id="weeklyReport">
            <div class="report-header">
                <div class="report-icon">📊</div>
                <div>
                    <h2 class="report-title">Weekly Financial Report</h2>
                    <p class="report-subtitle">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            
            <div class="summary-grid">
                <div class="summary-card income">
                    <div class="summary-icon">💰</div>
                    <div class="summary-value">€${summary.totalIncome.toFixed(2)}</div>
                    <div class="summary-label">Total Income</div>
                </div>
                <div class="summary-card expense">
                    <div class="summary-icon">💸</div>
                    <div class="summary-value">€${summary.grandTotalExpenses.toFixed(2)}</div>
                    <div class="summary-label">Total Expenses</div>
                </div>
                <div class="summary-card profit">
                    <div class="summary-icon">📈</div>
                    <div class="summary-value" style="color: ${summary.isProfitable ? 'var(--success)' : 'var(--danger)'}">€${summary.netProfit.toFixed(2)}</div>
                    <div class="summary-label">Net Profit</div>
                </div>
            </div>
            
            <div class="days-comparison">
                <div class="day-highlight best">
                    <div class="day-highlight-icon">⭐</div>
                    <div class="day-highlight-label">Best Day</div>
                    <div class="day-highlight-name">${DAY_EMOJIS[summary.bestDay.index]} ${summary.bestDay.name}</div>
                </div>
                <div class="day-highlight worst">
                    <div class="day-highlight-icon">⚠️</div>
                    <div class="day-highlight-label">Worst Day</div>
                    <div class="day-highlight-name">${DAY_EMOJIS[summary.worstDay.index]} ${summary.worstDay.name}</div>
                </div>
            </div>
            
            ${summary.totalExtras > 0 ? `
            <div class="extra-section" style="margin-top: 24px;">
                <h4 style="margin-bottom: 16px;">📋 Extra Expenses Breakdown</h4>
                <ul class="extra-list">
                    ${extrasHTML || '<li>No extra expenses</li>'}
                    <li style="font-weight: bold; border-left-color: var(--primary); margin-top: 12px;">
                        <span>Total Extra Expenses</span>
                        <span>€${summary.totalExtras.toFixed(2)}</span>
                    </li>
                </ul>
            </div>
            ` : ''}
            
            ${summary.profitMargin !== 0 ? `
            <div class="progress-section" style="margin-top: 24px;">
                <div class="progress-label">
                    <span>Profit Margin</span>
                    <span>${Number(summary.profitMargin).toFixed(2)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill profit" style="width: ${Math.min(Math.abs(summary.profitMargin), 100)}%"></div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    // Check if report already exists
    const existingReport = document.getElementById('weeklyReport');
    if (existingReport) {
        existingReport.innerHTML = reportHTML.replace('id="weeklyReport"', '');
    } else {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            const resultContainer = document.createElement('div');
            resultContainer.id = 'reportResult';
            resultContainer.innerHTML = reportHTML;
            actionButtons.insertAdjacentElement('beforebegin', resultContainer);
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback: append to result element
            if (elements.result) {
                elements.result.innerHTML = reportHTML;
            }
        }
    }
    
    showToast('Report generated successfully!', 'success');
};

// ===== End Week =====
window.endWeek = function() {
    if (confirm('Are you sure you want to end the current week? This will generate a report and reset all data for a new week.')) {
        // Save current week to history before clearing
        const weekData = Storage.getWeekData();
        Storage.saveToHistory(weekData);
        
        window.analyze();
        
        setTimeout(() => {
            Storage.clearAllData();
            renderDays();
            renderExtras();
            updateLiveSummary();
            
            // Remove report if exists
            const reportResult = document.getElementById('reportResult');
            if (reportResult) reportResult.remove();
            
            showToast('Week ended! Starting fresh for next week.', 'success');
        }, 1500);
    }
};

// ===== Clear All Data =====
window.clearAllData = function() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        Storage.clearAllData();
        renderDays();
        renderExtras();
        updateLiveSummary();
        
        const reportResult = document.getElementById('reportResult');
        if (reportResult) reportResult.remove();
        
        showToast('All data cleared', 'info');
    }
};

// ===== Mobile Menu Toggle =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// ===== Auto-save indicator =====
function showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '💾 Auto-saved';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--success);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.875rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    document.body.appendChild(indicator);
    
    return {
        show: function() {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 2000);
        }
    };
}

// ===== Export Data =====
window.exportData = function() {
    const data = Storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
};

// ===== Import Data =====
window.importData = function(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const success = Storage.importData(e.target.result);
        if (success) {
            renderDays();
            renderExtras();
            updateLiveSummary();
            showToast('Data imported successfully!', 'success');
        } else {
            showToast('Failed to import data. Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
};

// ===== Initialize on DOM ready =====
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    renderDays();
    renderExtras();
    updateLiveSummary();
    
    // Initialize auto-save indicator
    const autoSave = showAutoSaveIndicator();
    
    // Set up auto-save on input changes
    document.addEventListener('input', function(e) {
        if (e.target.id && (e.target.id.startsWith('income') || e.target.id.startsWith('expense'))) {
            Storage.updateLastSaved();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            window.analyze();
        }
        // Ctrl/Cmd + S to save (though it's automatic)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            autoSave.show();
        }
    });
    
    console.log('Financial Analysis & Management App initialized');
});