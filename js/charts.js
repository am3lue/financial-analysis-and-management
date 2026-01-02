/**
 * Simple Chart Library (Improved Implementation)
 */
const ChartLib = {
    // Draw a bar chart
    drawBarChart: function(canvasId, data, labels, colors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Get container dimensions
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = rect.height;
        const padding = 50; // Increased padding
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Find max value
        const maxValue = Math.max(...data, 1);
        
        // Dynamic bar sizing
        const barWidth = (chartWidth / data.length) * 0.5;
        const gap = (chartWidth / data.length) * 0.5;
        
        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + gap) + gap / 2;
            const y = height - padding - barHeight;
            
            // Draw bar shadow
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(x + 2, y + 2, barWidth, barHeight);

            // Draw bar
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
            } else {
                ctx.fillRect(x, y, barWidth, barHeight);
            }
            ctx.fill();
            
            // Draw value on top (2 decimal places)
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-main').trim() || '#1e293b';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('€' + value.toFixed(2), x + barWidth / 2, y - 10);
            
            // Draw label
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-muted').trim() || '#64748b';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(labels[index], x + barWidth / 2, height - padding + 20);
        });
        
        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-border').trim() || '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
    },
    
    // Draw a pie chart
    drawPieChart: function(canvasId, data, labels, colors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = rect.height;
        
        // Split canvas: Chart on left (60%), Legend on right (40%)
        const chartAreaWidth = width * 0.6;
        const centerX = chartAreaWidth / 2;
        const centerY = height / 2;
        const radius = Math.min(chartAreaWidth, height) / 2 - 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const total = data.reduce((a, b) => a + b, 0);
        if (total === 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        let startAngle = -Math.PI / 2;
        
        // Draw Pie Slices
        data.forEach((value, index) => {
            if (value === 0) return; // Skip zero values
            
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Separator line
            ctx.lineWidth = 2;
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-bg-card').trim() || '#ffffff';
            ctx.stroke();
            
            startAngle = endAngle;
        });
        
        // Draw center hole (Donut)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-bg-card').trim() || '#ffffff';
        ctx.fill();
        
        // Draw Total in Center (2 decimal places)
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-main').trim() || '#1e293b';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('€' + total.toFixed(2), centerX, centerY + 5);
        
        // Draw Legend on the Right
        const legendX = chartAreaWidth + 20;
        const legendYStart = (height - (data.filter(v => v > 0).length * 25)) / 2;
        
        let currentLegendY = legendYStart;
        
        data.forEach((value, index) => {
            if (value === 0) return;
            
            // Color Box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(legendX, currentLegendY, 15, 15);
            
            // Text (2 decimal places for percentage)
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-muted').trim() || '#64748b';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'left';
            const percentage = ((value / total) * 100).toFixed(2) + '%';
            ctx.fillText(`${labels[index]} (${percentage})`, legendX + 25, currentLegendY + 12);
            
            currentLegendY += 25;
        });
    }
};

window.ChartLib = ChartLib;
