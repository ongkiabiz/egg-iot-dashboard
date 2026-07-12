document.addEventListener('DOMContentLoaded', function() {
    // -----------------------------------------------------------
    // 1. Inisialisasi Data dari Local Storage & Profil Dummy
    // -----------------------------------------------------------
    let currentDevice = localStorage.getItem('selectedDevice') || 'TB01';
    
    // Update semua teks indikator ke perangkat yang sedang dipilih
    updateDeviceDisplay(currentDevice);
    loadUserProfile();

    // -----------------------------------------------------------
    // 2. Fungsionalitas Ganti Device (Dropdown)
    // -----------------------------------------------------------
    const deviceLinks = document.querySelectorAll('.dropdown-menu a.dropdown-item');
    deviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Abaikan klik pada tombol tambah
            if (this.innerText.includes('Tambah')) return;
            
            e.preventDefault();
            
            // Ambil nama device (TB01, TB02)
            const deviceText = this.innerText;
            const deviceMatch = deviceText.match(/TB\d{2}/);
            
            if (deviceMatch) {
                const newDevice = deviceMatch[0];
                localStorage.setItem('selectedDevice', newDevice);
                // Refresh halaman untuk mengupdate semua data 
                window.location.reload();
            }
        });
    });

    // -----------------------------------------------------------
    // 3. Fungsionalitas Update Profil (Offcanvas)
    // -----------------------------------------------------------
    const profileForm = document.querySelector('#profileOffcanvas form');
    if (profileForm) {
        // Hapus onsubmit bawaan (dummy) 
        profileForm.removeAttribute('onsubmit');
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil nilai dari input form
            const inputs = profileForm.querySelectorAll('input');
            const namaLengkap = inputs[0].value;
            const username = inputs[2].value;
            const password = inputs[3].value;

            // Mengirim request ke API
            fetch('api/update_profil.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_lengkap: namaLengkap,
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    alert('Profil berhasil diperbarui di database!');
                    
                    // Update tampilan profil di sudut atas
                    document.querySelector('.navbar-user span').innerText = data.data.nama_lengkap;
                    document.querySelector('.navbar-user .user-avatar').innerText = data.data.inisial;
                    document.querySelector('#profileOffcanvas .user-avatar').innerText = data.data.inisial;
                    
                    // Simpan sementara di localstorage jika ingin persisten (opsional)
                    localStorage.setItem('userNama', data.data.nama_lengkap);
                    localStorage.setItem('userInisial', data.data.inisial);
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Gagal menghubungi server. Pastikan sudah berjalan di XAMPP.');
            });
        });
    }

    // -----------------------------------------------------------
    // 4. Fungsionalitas Tombol Reset Berat (Halaman Penimbangan)
    // -----------------------------------------------------------
    const resetBtn = document.querySelector('button.btn-outline-danger');
    if (resetBtn && resetBtn.innerText.includes('Reset Berat')) {
        // Ganti onclick bawaan
        resetBtn.removeAttribute('onclick');
        resetBtn.addEventListener('click', function() {
            if(confirm('Apakah Anda yakin ingin mereset angka total berat ke 0.00 kg?')) {
                // Cari elemen angkanya
                const weightDisplay = this.previousElementSibling; // elemen h1 atau h3 di atasnya
                if (weightDisplay) {
                    weightDisplay.innerHTML = '0.00 <small class="text-muted">kg</small>';
                }
                alert('Berat berhasil di-reset.');
            }
        });
    }

    // -----------------------------------------------------------
    // 5. Fungsi Bantuan & UI 
    // -----------------------------------------------------------
    function updateDeviceDisplay(device) {
        // Update badge di header dan kartu
        const badges = document.querySelectorAll('.badge-online');
        badges.forEach(badge => {
            badge.innerHTML = `<span class="status-indicator indicator-online"></span> ${device}: Online`;
        });

        // Update judul (khusus halaman pengaturan)
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle && pageTitle.innerText.includes('Kalibrasi Manual')) {
            pageTitle.innerText = `Kalibrasi Manual ${device}`;
        }
        
        // Update list status di pengaturan
        const statusList = document.querySelector('li.list-group-item');
        if (statusList && statusList.innerText.includes('Status Koneksi')) {
            statusList.childNodes[0].nodeValue = `Status Koneksi ${device} `;
        }
    }

    function loadUserProfile() {
        const storedNama = localStorage.getItem('userNama');
        const storedInisial = localStorage.getItem('userInisial');
        
        if(storedNama && storedInisial) {
            const userNameSpan = document.querySelector('.navbar-user span');
            if(userNameSpan) userNameSpan.innerText = storedNama;
            
            const avatars = document.querySelectorAll('.user-avatar');
            avatars.forEach(av => av.innerText = storedInisial);
            
            // Set input form otomatis
            if (profileForm) {
                profileForm.querySelectorAll('input')[0].value = storedNama;
            }
        }
    }

    // Sidebar Toggle Logic for Mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            if (sidebar.style.display === 'none' || sidebar.style.display === '') {
                sidebar.style.display = 'flex';
                sidebar.style.position = 'absolute';
                sidebar.style.height = '100vh';
            } else {
                sidebar.style.display = 'none';
            }
        });
    }

    // -----------------------------------------------------------
    // 6. Filter Riwayat (Modal History)
    // -----------------------------------------------------------
    const historyForm = document.querySelector('#historyModal form');
    if (historyForm) {
        historyForm.removeAttribute('onsubmit');
        historyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const dateVal = this.querySelector('input[type="date"]').value;
            const idVal = this.querySelector('input[type="text"]').value;
            alert(`Menampilkan riwayat untuk Tanggal: ${dateVal} | ID Kandang: ${idVal || 'Semua'}`);
            // Di sini nanti bisa ditambahkan fetch() ke PHP untuk mengambil data sesuai filter
        });
    }

    // -----------------------------------------------------------
    // 7. Chart.js (Dummy Data for now)
    // -----------------------------------------------------------
    const ctx = document.getElementById('weightChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                datasets: [{
                    label: 'Total Berat Telur (kg)',
                    data: [12.5, 25.0, 38.2, 50.1, 65.5, 82.0, 95.5, 110.2, 124.5],
                    borderColor: '#2e7d32', 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }
});
