document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle Logic for Mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            // For simple mobile toggle, we can just slide it in/out using a class
            // But since this is a basic demo, we'll just toggle display or width
            if (sidebar.style.display === 'none' || sidebar.style.display === '') {
                sidebar.style.display = 'flex';
                sidebar.style.position = 'absolute';
                sidebar.style.height = '100vh';
            } else {
                sidebar.style.display = 'none';
            }
        });
    }

    // Chart.js Integration for Dashboard
    const ctx = document.getElementById('weightChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                datasets: [{
                    label: 'Total Berat Telur (kg)',
                    data: [12.5, 25.0, 38.2, 50.1, 65.5, 82.0, 95.5, 110.2, 124.5],
                    borderColor: '#2e7d32', // Deep Green
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2e7d32',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#333333',
                        titleFont: { size: 13, family: 'Inter' },
                        bodyFont: { size: 13, family: 'Inter' },
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: { family: 'Inter', size: 12 },
                            color: '#6c757d'
                        }
                    },
                    y: {
                        grid: {
                            color: '#e0e0e0',
                            borderDash: [5, 5],
                            drawBorder: false
                        },
                        ticks: {
                            font: { family: 'Inter', size: 12 },
                            color: '#6c757d',
                            stepSize: 30
                        }
                    }
                }
            }
        });
    }
});
