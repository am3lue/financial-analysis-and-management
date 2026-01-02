/**
 * Financial Analysis & Management - Report Page Logic
 */

// Day configuration
const DAY_CONFIG = [
    { name: 'Monday', emoji: '🌅' },
    { name: 'Tuesday', emoji: '🌤️' },
    { name: 'Wednesday', emoji: '🌤️' },
    { name: 'Thursday', emoji: '🌥️' },
    { name: 'Friday', emoji: '🎉' },
    { name: 'Saturday', emoji: '🎊' },
    { name: 'Sunday', emoji: '🌙' }
];

const CHART_COLORS = [
    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#14b8a6', '#f97316'
];

// Generate report
window.generateReport = function() {
    const summary = Storage.getWeekSummary();
    
    // Update summary cards
    const totalIncomeEl = document.getElementById('totalIncome');
    if (totalIncomeEl) totalIncomeEl.textContent = `€${summary.totalIncome.toFixed(2)}`;
    
    const totalExpensesEl = document.getElementById('totalExpenses');
    if (totalExpensesEl) totalExpensesEl.textContent = `€${summary.grandTotalExpenses.toFixed(2)}`;
    
    const netProfitEl = document.getElementById('netProfit');
    if (netProfitEl) {
        netProfitEl.textContent = `€${summary.netProfit.toFixed(2)}`;
        netProfitEl.style.color = summary.isProfitable ? 'var(--success)' : 'var(--danger)';
    }
    
    const totalExtrasEl = document.getElementById('totalExtras');
    if (totalExtrasEl) totalExtrasEl.textContent = `€${summary.totalExtras.toFixed(2)}`;
    
    // Update best/worst days
    const bestDayNameEl = document.getElementById('bestDayName');
    if (bestDayNameEl) bestDayNameEl.textContent = `${summary.bestDay.emoji || ''} ${summary.bestDay.name}`;
    
    const bestDayAmountEl = document.getElementById('bestDayAmount');
    if (bestDayAmountEl) bestDayAmountEl.textContent = `€${summary.bestDay.profit.toFixed(2)}`;
    
    const worstDayNameEl = document.getElementById('worstDayName');
    if (worstDayNameEl) worstDayNameEl.textContent = `${summary.worstDay.emoji || ''} ${summary.worstDay.name}`;
    
    const worstDayAmountEl = document.getElementById('worstDayAmount');
    if (worstDayAmountEl) worstDayAmountEl.textContent = `€${summary.worstDay.profit.toFixed(2)}`;
    
    // Draw bar chart
    if (window.ChartLib) {
        const dailyProfits = summary.incomes.map((inc, i) => inc - summary.expenses[i]);
        ChartLib.drawBarChart('dailyChart', dailyProfits, 
            DAY_CONFIG.map(d => d.name), CHART_COLORS);
        
        // Draw pie charts
        ChartLib.drawPieChart('incomePieChart', summary.incomes,
            DAY_CONFIG.map(d => d.name), CHART_COLORS);
        ChartLib.drawPieChart('expensePieChart', summary.expenses,
            DAY_CONFIG.map(d => d.name), CHART_COLORS);
    }
    
    // Generate daily breakdown
    const dailyBreakdown = document.getElementById('dailyBreakdown');
    if (dailyBreakdown) {
        let dailyHTML = '';
        summary.incomes.forEach((income, index) => {
            const expense = summary.expenses[index];
            
            dailyHTML += `
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 16px; border-bottom: 1px solid var(--border-color); align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.5rem;">${DAY_CONFIG[index].emoji}</span>
                        <span style="font-weight: 600;">${DAY_CONFIG[index].name}</span>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--success); font-weight: 600;">€${income.toFixed(2)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-light);">Income</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--danger); font-weight: 600;">€${expense.toFixed(2)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-light);">Expense</div>
                    </div>
                </div>
            `;
        });
        
        // Add total row
        const totalIncome = summary.incomes.reduce((a, b) => a + b, 0);
        const totalExpense = summary.expenses.reduce((a, b) => a + b, 0);
        
        dailyHTML += `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 16px; background: var(--bg-main); border-radius: 8px; margin-top: 8px; align-items: center;">
                <div style="font-weight: 700;">TOTAL</div>
                <div style="text-align: center;">
                    <div style="color: var(--success); font-weight: 700;">€${totalIncome.toFixed(2)}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: var(--danger); font-weight: 700;">€${totalExpense.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        dailyBreakdown.innerHTML = dailyHTML;
    }
    
    // Generate extras breakdown
    const extras = summary.extras;
    const extrasEntries = Object.entries(extras);
    const extrasCard = document.getElementById('extrasCard');
    const noExtrasMsg = document.getElementById('noExtrasMsg');
    const extrasBreakdown = document.getElementById('extrasBreakdown');
    
    if (extrasEntries.length === 0) {
        if (extrasCard && extrasCard.querySelector('ul')) extrasCard.querySelector('ul').remove();
        if (noExtrasMsg) noExtrasMsg.style.display = 'block';
    } else {
        if (noExtrasMsg) noExtrasMsg.style.display = 'none';
        if (extrasBreakdown) {
            extrasBreakdown.innerHTML = `
                <ul class="extra-list">
                    ${extrasEntries.map(([reason, amount]) => `
                        <li class="extra-item">
                            <div class="extra-item-info">
                                <span>📝</span>
                                <span class="extra-item-reason">${reason}</span>
                            </div>
                            <span class="extra-item-amount">€${amount.toFixed(2)}</span>
                        </li>
                    `).join('')}
                    <li style="font-weight: bold; border-left-color: var(--primary); margin-top: 12px;">
                        <span>Total Extra Expenses</span>
                        <span>€${summary.totalExtras.toFixed(2)}</span>
                    </li>
                </ul>
            `;
        }
    }
    
    // Generate weekly summary
    const weeklySummary = document.getElementById('weeklySummary');
    if (weeklySummary) {
        const profitMargin = summary.profitMargin;
        const totalIncome = summary.incomes.reduce((a, b) => a + b, 0);
        const totalExpense = summary.expenses.reduce((a, b) => a + b, 0);
        
        const summaryHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="padding: 20px; background: var(--bg-main); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px;">Profit Margin</div>
                    <div style="font-size: 2rem; font-weight: 800; color: ${profitMargin >= 0 ? 'var(--success)' : 'var(--danger)'}">${Number(profitMargin).toFixed(2)}%</div>
                </div>
                <div style="padding: 20px; background: var(--bg-main); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px;">Daily Average Income</div>
                    <div style="font-size: 2rem; font-weight: 800; color: var(--success);">€${(totalIncome / 7).toFixed(2)}</div>
                </div>
                <div style="padding: 20px; background: var(--bg-main); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px;">Daily Average Expense</div>
                    <div style="font-size: 2rem; font-weight: 800; color: var(--danger);">€${(totalExpense / 7).toFixed(2)}</div>
                </div>
                <div style="padding: 20px; background: var(--bg-main); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 8px;">Financial Status</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: ${summary.isProfitable ? 'var(--success)' : 'var(--danger)'}">
                        ${summary.isProfitable ? '✅ Profitable' : '⚠️ Loss'}
                    </div>
                </div>
            </div>
            
            ${profitMargin !== 0 ? `
            <div class="progress-section" style="margin-top: 24px;">
                <div class="progress-label">
                    <span>Profit vs Income</span>
                    <span>${Number(profitMargin).toFixed(2)}%</span>
                </div>
                <div class="progress-bar" style="height: 16px;">
                    <div class="progress-fill profit" style="width: ${Math.min(Math.abs(profitMargin), 100)}%; background: ${profitMargin >= 0 ? 'linear-gradient(90deg, var(--success), #34d399)' : 'linear-gradient(90deg, var(--danger), #f87171)'}"></div>
                </div>
            </div>
            ` : ''}
        `;
        
        weeklySummary.innerHTML = summaryHTML;
    }
    
    if (typeof showToast === 'function') {
        showToast('Report generated!', 'success');
    }
};

// Print report
window.printReport = function() {
    window.print();
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateReport();
    
    // Redraw charts on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(generateReport, 250);
    });
});
