// Calendar & Planner System
class CalendarSystem {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal dışına tıklama ile kapatma
        document.getElementById('eventModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeEventModal();
            }
        });
    }

    loadEvents() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        
        const userData = auth.getUserData();
        this.events = userData?.calendar?.events || [];
    }

    saveEvents() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        
        const userData = auth.getUserData();
        userData.calendar.events = this.events;
        auth.saveUserData(userData);
    }

    initializeCalendar() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const toolContainer = document.getElementById('tool-container');
        toolContainer.innerHTML = this.getCalendarHTML();
        
        this.renderCalendar();
        this.renderQuickActions();
        this.renderStats();
    }

    getCalendarHTML() {
        return `
            <div class="calendar-container">
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="btn btn-secondary" onclick="calendar.prevMonth()">← Önceki</button>
                        <h2 class="calendar-title" id="calendarTitle"></h2>
                        <button class="btn btn-secondary" onclick="calendar.nextMonth()">Sonraki →</button>
                    </div>
                    <div class="calendar-actions">
                        <button class="btn btn-primary" onclick="calendar.showAddEventModal()">+ Etkinlik Ekle</button>
                        <button class="btn btn-secondary" onclick="calendar.goToToday()">Bugün</button>
                    </div>
                </div>

                <div class="quick-actions" id="quickActions"></div>
                <div class="calendar-stats" id="calendarStats"></div>

                <div class="calendar-grid">
                    <div class="calendar-weekday">Paz</div>
                    <div class="calendar-weekday">Pzt</div>
                    <div class="calendar-weekday">Sal</div>
                    <div class="calendar-weekday">Çar</div>
                    <div class="calendar-weekday">Per</div>
                    <div class="calendar-weekday">Cum</div>
                    <div class="calendar-weekday">Cmt</div>
                    <div id="calendarDays"></div>
                </div>
            </div>

            <!-- Event Modal -->
            <div id="eventModal" class="event-modal">
                <div class="event-modal-content">
                    <span class="close-modal" onclick="calendar.closeEventModal()">&times;</span>
                    <div id="eventFormContainer"></div>
                </div>
            </div>
        `;
    }

    renderCalendar() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        document.getElementById('calendarTitle').textContent = 
            `${this.getMonthName(month)} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        let calendarHTML = '';
        const today = new Date();
        
        // Önceki ayın günleri
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            calendarHTML += this.getDayHTML(day, 'other-month');
        }

        // Bu ayın günleri
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDay(date, today);
            calendarHTML += this.getDayHTML(day, isToday ? 'today' : '');
        }

        // Sonraki ayın günleri
        const totalCells = 42; // 6 hafta
        const remainingCells = totalCells - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            calendarHTML += this.getDayHTML(day, 'other-month');
        }

        document.getElementById('calendarDays').innerHTML = calendarHTML;
    }

    getDayHTML(day, className = '') {
        const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dayEvents = this.getEventsForDate(date);
        
        return `
            <div class="calendar-day ${className}" onclick="calendar.selectDate(${date.getTime()})">
                <div class="calendar-day-number">${day}</div>
                <div class="calendar-events">
                    ${dayEvents.slice(0, 3).map(event => `
                        <div class="calendar-event ${event.type}" 
                             onclick="event.stopPropagation(); calendar.showEventModal(${event.id})"
                             title="${event.title}">
                            ${event.title}
                        </div>
                    `).join('')}
                    ${dayEvents.length > 3 ? `<div class="calendar-event">+${dayEvents.length - 3} more</div>` : ''}
                </div>
            </div>
        `;
    }

    getEventsForDate(date) {
        if (!auth.isAuthenticated()) return [];
        return this.events.filter(event => this.isSameDay(new Date(event.date), date));
    }

    isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    getMonthName(month) {
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        return months[month];
    }

    prevMonth() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    goToToday() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        this.currentDate = new Date();
        this.renderCalendar();
    }

    selectDate(timestamp) {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }
        this.selectedDate = new Date(timestamp);
        this.showAddEventModal();
    }

    showAddEventModal(eventId = null) {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const event = eventId ? this.events.find(e => e.id === eventId) : null;
        const modal = document.getElementById('eventModal');
        const formContainer = document.getElementById('eventFormContainer');

        formContainer.innerHTML = this.getEventFormHTML(event);
        modal.style.display = 'block';

        // Form submission
        this.setupEventForm(event);
    }

    getEventFormHTML(event) {
        const isEdit = !!event;
        const defaultDate = this.selectedDate.toISOString().split('T')[0];
        
        return `
            <h2>${isEdit ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}</h2>
            <form class="event-form" id="eventForm">
                <div class="form-group">
                    <label for="eventTitle">Başlık</label>
                    <input type="text" id="eventTitle" value="${event?.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="eventDescription">Açıklama</label>
                    <textarea id="eventDescription" rows="3">${event?.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="eventDate">Tarih</label>
                    <input type="date" id="eventDate" value="${event?.date ? new Date(event.date).toISOString().split('T')[0] : defaultDate}" required>
                </div>
                
                <div class="form-group">
                    <label for="eventTime">Saat</label>
                    <input type="time" id="eventTime" value="${event?.time || '09:00'}">
                </div>
                
                <div class="form-group">
                    <label for="eventType">Tip</label>
                    <select id="eventType">
                        <option value="personal" ${event?.type === 'personal' ? 'selected' : ''}>Kişisel</option>
                        <option value="work" ${event?.type === 'work' ? 'selected' : ''}>İş</option>
                        <option value="important" ${event?.type === 'important' ? 'selected' : ''}>Önemli</option>
                    </select>
                </div>
                
                <div class="event-actions">
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? 'Güncelle' : 'Oluştur'}
                    </button>
                    ${isEdit ? `
                    <button type="button" class="btn btn-delete" onclick="calendar.deleteEvent(${event.id})">
                        Sil
                    </button>
                    ` : ''}
                </div>
            </form>
        `;
    }

    setupEventForm(event) {
        const form = document.getElementById('eventForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (event) {
                this.updateEvent(event.id);
            } else {
                this.createEvent();
            }
        });
    }

    createEvent() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const formData = this.getFormData();
        
        const newEvent = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            userId: auth.getCurrentUser().id
        };

        this.events.push(newEvent);
        this.saveEvents();
        this.closeEventModal();
        this.renderCalendar();
        this.renderStats();
        
        this.showMessage('Etkinlik başarıyla oluşturuldu!', 'success');
    }

    updateEvent(eventId) {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const formData = this.getFormData();
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
            this.events[eventIndex] = {
                ...this.events[eventIndex],
                ...formData,
                updatedAt: new Date().toISOString()
            };
            
            this.saveEvents();
            this.closeEventModal();
            this.renderCalendar();
            this.renderStats();
            
            this.showMessage('Etkinlik başarıyla güncellendi!', 'success');
        }
    }

    deleteEvent(eventId) {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.closeEventModal();
            this.renderCalendar();
            this.renderStats();
            
            this.showMessage('Etkinlik başarıyla silindi!', 'success');
        }
    }

    getFormData() {
        return {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            type: document.getElementById('eventType').value
        };
    }

    closeEventModal() {
        document.getElementById('eventModal').style.display = 'none';
    }

    renderQuickActions() {
        if (!auth.isAuthenticated()) return;

        const quickActions = document.getElementById('quickActions');
        const actions = [
            {
                icon: '📅',
                title: 'Bugünün Planı',
                description: 'Bugünkü etkinlikleri görüntüle',
                action: () => this.showTodaysEvents()
            },
            {
                icon: '⚡',
                title: 'Hızlı Etkinlik',
                description: 'Hızlıca etkinlik ekle',
                action: () => this.quickAddEvent()
            },
            {
                icon: '📊',
                title: 'İstatistikler',
                description: 'Aylık istatistikleri gör',
                action: () => this.showStatistics()
            }
        ];

        quickActions.innerHTML = actions.map(action => `
            <div class="quick-action-card" onclick="calendar.quickActions['${action.title}']()">
                <div class="quick-action-icon">${action.icon}</div>
                <div class="quick-action-title">${action.title}</div>
                <div class="quick-action-desc">${action.description}</div>
            </div>
        `).join('');

        // Quick actions'ı global olarak kaydet
        this.quickActions = {};
        actions.forEach(action => {
            this.quickActions[action.title] = action.action;
        });
    }

    renderStats() {
        if (!auth.isAuthenticated()) return;

        const statsContainer = document.getElementById('calendarStats');
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const monthlyEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= monthStart && eventDate <= monthEnd;
        });

        const stats = [
            { number: monthlyEvents.length, label: 'Bu Ay' },
            { number: this.getEventsForDate(today).length, label: 'Bugün' },
            { number: this.events.filter(e => e.type === 'important').length, label: 'Önemli' },
            { number: this.events.filter(e => e.type === 'work').length, label: 'İş' }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    showTodaysEvents() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        this.selectedDate = new Date();
        const todaysEvents = this.getEventsForDate(this.selectedDate);
        
        if (todaysEvents.length === 0) {
            this.showMessage('Bugün için etkinlik bulunmuyor.', 'info');
        } else {
            let message = 'Bugünün etkinlikleri:\n';
            todaysEvents.forEach(event => {
                message += `• ${event.title} (${event.time || 'tüm gün'})\n`;
            });
            alert(message);
        }
    }

    quickAddEvent() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const title = prompt('Etkinlik başlığını girin:');
        if (title) {
            const newEvent = {
                id: Date.now(),
                title,
                description: '',
                date: new Date().toISOString().split('T')[0],
                time: '',
                type: 'personal',
                createdAt: new Date().toISOString(),
                userId: auth.getCurrentUser().id
            };

            this.events.push(newEvent);
            this.saveEvents();
            this.renderCalendar();
            this.renderStats();
            this.showMessage('Etkinlik hızlıca eklendi!', 'success');
        }
    }

    showStatistics() {
        if (!auth.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        const monthlyEvents = this.events.reduce((acc, event) => {
            const month = new Date(event.date).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        let statsMessage = 'Aylık Etkinlik İstatistikleri:\n\n';
        for (let month = 0; month < 12; month++) {
            const count = monthlyEvents[month] || 0;
            statsMessage += `${this.getMonthName(month)}: ${count} etkinlik\n`;
        }

        alert(statsMessage);
    }

    showLoginRequired() {
        // Tool container'ı temizle
        const toolContainer = document.getElementById('tool-container');
        if (toolContainer) {
            toolContainer.innerHTML = `
                <div class="tool-container">
                    <div class="auth-required-message">
                        <h2>🔒 Giriş Gerekli</h2>
                        <p>Takvim özelliğini kullanmak için giriş yapmalısınız.</p>
                        <button class="btn btn-primary" onclick="showLoginModal()">Giriş Yap</button>
                    </div>
                </div>
            `;
        }
    }

    showMessage(message, type = 'info') {
        // Basit mesaj gösterme (toast notification eklenebilir)
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '1000';
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// Global calendar instance
const calendar = new CalendarSystem();

// Main.js'de calendar tool için handler ekle
function initializeCalendar() {
    calendar.initializeCalendar();
}