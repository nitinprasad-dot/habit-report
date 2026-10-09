// ZenithHabit Mobile App - Focused Engine & UI/UX Controller

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Workout & Stretch', category: 'Health', goal: 26, color: '#F43F5E' },
  { id: 'h2', name: '10,000 Daily Steps', category: 'Health', goal: 26, color: '#10B981' },
  { id: 'h3', name: 'Drink 2.5L Pure Water', category: 'Health', goal: 30, color: '#06B6D4' },
  { id: 'h4', name: 'Deep Work Session (90 mins)', category: 'Productivity', goal: 25, color: '#8B5CF6' },
  { id: 'h5', name: 'Read 20 Pages Non-Fiction', category: 'Learning', goal: 26, color: '#EC4899' },
  { id: 'h6', name: 'Clean Nutrition (No Sugar)', category: 'Health', goal: 25, color: '#14B8A6' },
  { id: 'h7', name: '15 Min Mindful Meditation', category: 'Mind', goal: 28, color: '#8B5CF6' },
  { id: 'h8', name: 'Plan Top 3 Priorities Tomorrow', category: 'Productivity', goal: 28, color: '#F59E0B' },
  { id: 'h9', name: 'Posture & Ergonomics Check', category: 'Health', goal: 26, color: '#3B82F6' },
  { id: 'h10', name: '8 Hours Restful Sleep', category: 'Health', goal: 28, color: '#6366F1' }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class ZenithMobileApp {
  constructor() {
    this.currentYear = 2026;
    this.currentMonth = 9; // October (0-indexed)
    
    // Core State
    this.userProfile = null;
    this.habits = [];
    this.records = {};
    this.submissions = {};
    this.streakState = {
      currentStreak: 5,
      freezeAvailable: true,
      freezeUsed: false,
      frozenDate: null,
      lastSubmittedDate: null
    };

    // UI State
    this.isTasksCollapsed = false;
    this.activeTaskFilter = 'all'; // 'all' or 'pending'
    this.isEditMode = false;
    this.activeAnalyticsTab = 'weekly';

    this.initElements();
    this.loadState();
    this.bindEvents();
    this.startClock();
    this.render();
  }

  initElements() {
    // Status Bar & Header
    this.statusBarClock = document.getElementById('statusBarClock');
    this.islandStreakPill = document.getElementById('islandStreakPill');
    this.openProfileHeaderBtn = document.getElementById('openProfileHeaderBtn');
    this.headerAvatarImg = document.getElementById('headerAvatarImg');
    this.headerGreetingName = document.getElementById('headerGreetingName');
    this.headerSubGoal = document.getElementById('headerSubGoal');
    this.dedicatedStreakBadge = document.getElementById('dedicatedStreakBadge');
    this.badgeStreakCount = document.getElementById('badgeStreakCount');
    this.badgeFreezeSnippet = document.getElementById('badgeFreezeSnippet');
    this.headerReminderBtn = document.getElementById('headerReminderBtn');

    // 3. Top-Placed Progress Round Chart
    this.topRoundProgressCanvas = document.getElementById('topRoundProgressCanvas');
    this.roundCenterPct = document.getElementById('roundCenterPct');
    this.roundChartTopBadge = document.getElementById('roundChartTopBadge');
    this.statCompletedCount = document.getElementById('statCompletedCount');
    this.statLeftCount = document.getElementById('statLeftCount');
    this.roundCardStreakText = document.getElementById('roundCardStreakText');

    // 2. Collapsible 'Today's Tasks' Section
    this.todayTasksSection = document.getElementById('todayTasksSection');
    this.toggleCollapseTasksBtn = document.getElementById('toggleCollapseTasksBtn');
    this.collapseIcon = document.getElementById('collapseIcon');
    this.collapseLabel = document.getElementById('collapseLabel');
    this.collapsibleTasksContent = document.getElementById('collapsibleTasksContent');
    this.collapsedSummaryPill = document.getElementById('collapsedSummaryPill');
    this.collapsedSnippetText = document.getElementById('collapsedSnippetText');
    this.pendingBadgePill = document.getElementById('pendingBadgePill');

    // 1. Clean List-View Habit Layout
    this.cleanListViewHabitsContainer = document.getElementById('cleanListViewHabitsContainer');
    this.countFilterAll = document.getElementById('countFilterAll');
    this.countFilterPending = document.getElementById('countFilterPending');
    this.quickCheckAllToday = document.getElementById('quickCheckAllToday');
    this.openInlineAddBtn = document.getElementById('openInlineAddBtn');
    this.inlineAddRow = document.getElementById('inlineAddRow');
    this.inputNewTaskTitle = document.getElementById('inputNewTaskTitle');
    this.inputNewTaskGoal = document.getElementById('inputNewTaskGoal');
    this.saveInlineAddBtn = document.getElementById('saveInlineAddBtn');
    this.cancelInlineAddBtn = document.getElementById('cancelInlineAddBtn');
    this.homeSubmitDailyBtn = document.getElementById('homeSubmitDailyBtn');
    this.homeSubmitBtnText = document.getElementById('homeSubmitBtnText');

    // Views
    this.viewHomePage = document.getElementById('viewHomePage');
    this.viewMarksheetPage = document.getElementById('viewMarksheetPage');
    this.viewAnalyticsPage = document.getElementById('viewAnalyticsPage');

    // Marksheet Tab Elements
    this.marksheetMonthLabel = document.getElementById('marksheetMonthLabel');
    this.marksheetToggleEditBtn = document.getElementById('marksheetToggleEditBtn');
    this.marksheetEditIcon = document.getElementById('marksheetEditIcon');
    this.marksheetEditText = document.getElementById('marksheetEditText');
    this.marksheetTable = document.getElementById('marksheetTable');
    this.marksheetTableHead = document.getElementById('marksheetTableHead');
    this.marksheetTableBody = document.getElementById('marksheetTableBody');
    this.marksheetTableFoot = document.getElementById('marksheetTableFoot');

    // Analytics Tab Elements
    this.analyticsWeeklyCardsRow = document.getElementById('analyticsWeeklyCardsRow');
    this.analyticsChartTabs = document.getElementById('analyticsChartTabs');
    this.paneWeeklyBar = document.getElementById('paneWeeklyBar');
    this.paneTrendCurve = document.getElementById('paneTrendCurve');
    this.analyticsWeeklyCanvas = document.getElementById('analyticsWeeklyCanvas');
    this.analyticsTrendCanvas = document.getElementById('analyticsTrendCanvas');
    this.analyticsTrendAvg = document.getElementById('analyticsTrendAvg');
    this.analyticsTop10List = document.getElementById('analyticsTop10List');

    // Bottom Navigation Bar & FAB
    this.mobileBottomNav = document.querySelector('.mobile-bottom-nav');
    this.mobileCenterFabBtn = document.getElementById('mobileCenterFabBtn');

    // 5. Dedicated Profile Screen / Modal
    this.dedicatedProfileModal = document.getElementById('dedicatedProfileModal');
    this.closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
    this.modalAvatarImg = document.getElementById('modalAvatarImg');
    this.modalAvatarFileInput = document.getElementById('modalAvatarFileInput');
    this.modalRandomAvatarBtn = document.getElementById('modalRandomAvatarBtn');
    this.currentThemeLabel = document.getElementById('currentThemeLabel');
    this.themeSwitchGrid = document.getElementById('themeSwitchGrid');
    this.modalNameInput = document.getElementById('modalNameInput');
    this.modalMobileInput = document.getElementById('modalMobileInput');
    this.modalRelaunchSetupBtn = document.getElementById('modalRelaunchSetupBtn');
    this.modalSaveProfileBtn = document.getElementById('modalSaveProfileBtn');

    // Reminders Sheet
    this.remindersSheet = document.getElementById('remindersSheet');
    this.closeRemindersSheetBtn = document.getElementById('closeRemindersSheetBtn');
    this.remindersPhoneDisplay = document.getElementById('remindersPhoneDisplay');
    this.triggerTestAlertBtn = document.getElementById('triggerTestAlertBtn');

    this.toast = document.getElementById('toast');
  }

  startClock() {
    const update = () => {
      const now = new Date();
      let h = now.getHours();
      let m = now.getMinutes();
      m = m < 10 ? '0' + m : m;
      this.statusBarClock.textContent = `${h}:${m}`;
    };
    update();
    setInterval(update, 10000);
  }

  loadState() {
    // Theme
    const savedTheme = localStorage.getItem('zenith_theme') || 'dark';
    this.applyTheme(savedTheme);

    // Profile
    const profile = localStorage.getItem('zenith_profile');
    if (profile) {
      try { this.userProfile = JSON.parse(profile); } catch (e) { this.initDefaultProfile(); }
    } else {
      this.initDefaultProfile();
    }

    // Habits
    const habits = localStorage.getItem('zenith_habits');
    if (habits) {
      try { this.habits = JSON.parse(habits); } catch (e) { this.habits = [...DEFAULT_HABITS]; }
    } else {
      this.habits = [...DEFAULT_HABITS];
    }

    // Records
    const records = localStorage.getItem('zenith_records');
    if (records) {
      try { this.records = JSON.parse(records); } catch (e) { this.records = {}; }
    } else {
      this.records = {};
      this.seedSampleRecords();
    }

    // Submissions
    const submissions = localStorage.getItem('zenith_submissions');
    if (submissions) {
      try { this.submissions = JSON.parse(submissions); } catch (e) { this.submissions = {}; }
    }

    // Streak
    const streak = localStorage.getItem('zenith_streak_state');
    if (streak) {
      try { this.streakState = JSON.parse(streak); } catch (e) { this.initDefaultStreak(); }
    } else {
      this.initDefaultStreak();
    }

    // Collapse preference
    const collapsePref = localStorage.getItem('zenith_tasks_collapsed');
    if (collapsePref === 'true') {
      this.isTasksCollapsed = true;
    }
  }

  initDefaultProfile() {
    this.userProfile = {
      name: 'Nitin',
      mobile: '+91 98765 43210',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nitin',
      goal: 'Health & Fitness'
    };
  }

  initDefaultStreak() {
    this.streakState = {
      currentStreak: 5,
      freezeAvailable: true,
      freezeUsed: false,
      frozenDate: null,
      lastSubmittedDate: null
    };
  }

  seedSampleRecords() {
    const todayDay = this.getTodayDay();
    this.habits.forEach((habit, hIdx) => {
      for (let day = 1; day < todayDay; day++) {
        const pseudo = Math.sin(day * 19 + hIdx * 7) * 10000;
        if ((pseudo - Math.floor(pseudo)) < 0.74) {
          this.setRecord(habit.id, day, true);
        }
      }
      // Check 7 out of 10 for today
      if (hIdx < 7) {
        this.setRecord(habit.id, todayDay, true);
      }
    });

    for (let day = todayDay - 5; day < todayDay; day++) {
      if (day > 0) {
        this.submissions[`${this.currentYear}-${this.currentMonth}-${day}`] = { submitted: true };
      }
    }
  }

  saveState() {
    if (this.userProfile) localStorage.setItem('zenith_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('zenith_habits', JSON.stringify(this.habits));
    localStorage.setItem('zenith_records', JSON.stringify(this.records));
    localStorage.setItem('zenith_submissions', JSON.stringify(this.submissions));
    localStorage.setItem('zenith_streak_state', JSON.stringify(this.streakState));
    localStorage.setItem('zenith_tasks_collapsed', this.isTasksCollapsed ? 'true' : 'false');
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenith_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenith_theme', 'dark');
    }
    this.updateThemeCardsUI(theme);
  }

  updateThemeCardsUI(theme) {
    if (!this.themeSwitchGrid) return;
    this.themeSwitchGrid.querySelectorAll('.theme-choice-card').forEach(card => {
      const isCardTheme = card.getAttribute('data-set-theme') === theme;
      card.classList.toggle('active', isCardTheme);
    });
    this.currentThemeLabel.textContent = theme === 'dark' ? 'Dark Obsidian' : 'Light Porcelain';
  }

  getTodayDay() {
    const today = new Date();
    if (today.getFullYear() === this.currentYear && today.getMonth() === this.currentMonth) {
      return today.getDate();
    }
    return 9;
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  getRecordKey(habitId, day) {
    return `${this.currentYear}-${this.currentMonth}-${habitId}-${day}`;
  }

  getRecord(habitId, day) {
    return !!this.records[this.getRecordKey(habitId, day)];
  }

  setRecord(habitId, day, value) {
    const key = this.getRecordKey(habitId, day);
    if (value) this.records[key] = true;
    else delete this.records[key];
  }

  bindEvents() {
    // 2. Collapsible 'Today's Tasks' Section Toggle
    const toggleCollapse = () => {
      this.isTasksCollapsed = !this.isTasksCollapsed;
      this.saveState();
      this.updateCollapseUI();
    };

    this.toggleCollapseTasksBtn.addEventListener('click', toggleCollapse);
    this.collapsedSummaryPill.addEventListener('click', toggleCollapse);

    // 1. Task Filter (All vs Pending)
    document.querySelectorAll('.task-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.task-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTaskFilter = btn.getAttribute('data-filter');
        this.renderCleanHabitList();
      });
    });

    // Quick Check All for Today
    this.quickCheckAllToday.addEventListener('click', () => {
      const todayDay = this.getTodayDay();
      this.habits.forEach(h => this.setRecord(h.id, todayDay, true));
      this.saveState();
      this.render();
      this.showToast('All today tasks ticked! ✨');
    });

    // Add Task Inline
    this.openInlineAddBtn.addEventListener('click', () => {
      this.inlineAddRow.classList.remove('hidden');
      this.inputNewTaskTitle.focus();
    });

    this.cancelInlineAddBtn.addEventListener('click', () => {
      this.inlineAddRow.classList.add('hidden');
      this.inputNewTaskTitle.value = '';
    });

    this.saveInlineAddBtn.addEventListener('click', () => {
      const name = this.inputNewTaskTitle.value.trim();
      const goal = parseInt(this.inputNewTaskGoal.value, 10) || 26;
      if (!name) return;

      this.habits.push({
        id: `h_${Date.now()}`,
        name,
        category: 'Personal',
        goal,
        color: '#8B5CF6'
      });

      this.inputNewTaskTitle.value = '';
      this.inlineAddRow.classList.add('hidden');
      this.saveState();
      this.render();
      this.showToast(`Added habit "${name}"!`);
    });

    // Submit Daily Progress
    this.homeSubmitDailyBtn.addEventListener('click', () => {
      this.submitDailyProgress();
    });

    // Dedicated Streak Badge Click
    this.dedicatedStreakBadge.addEventListener('click', () => {
      alert(`🔥 Streak Status: Day ${this.streakState.currentStreak}\n\n1-Chance Freeze Shield is ACTIVE.\nSubmit your progress before 11:59 PM to keep your streak!`);
    });

    // 5. Dedicated Profile Modal Trigger
    const openProfileModal = () => {
      if (this.userProfile) {
        this.modalAvatarImg.src = this.userProfile.avatar || this.headerAvatarImg.src;
        this.modalNameInput.value = this.userProfile.name || '';
        this.modalMobileInput.value = this.userProfile.mobile || '';
      }
      const curTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      this.updateThemeCardsUI(curTheme);
      this.dedicatedProfileModal.classList.remove('hidden');
    };

    this.openProfileHeaderBtn.addEventListener('click', openProfileModal);
    this.closeProfileModalBtn.addEventListener('click', () => this.dedicatedProfileModal.classList.add('hidden'));

    // 5. Theme Choice Toggles in Profile Screen
    this.themeSwitchGrid.querySelectorAll('.theme-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const selectedTheme = card.getAttribute('data-set-theme');
        this.applyTheme(selectedTheme);
        this.renderTopRoundProgressChart();
      });
    });

    // Avatar upload & randomizer in profile modal
    this.modalAvatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        this.modalAvatarImg.src = url;
        if (this.userProfile) {
          this.userProfile.avatar = url;
          this.headerAvatarImg.src = url;
          this.saveState();
        }
        this.showToast('Profile photo updated! 📸');
      };
      reader.readAsDataURL(file);
    });

    this.modalRandomAvatarBtn.addEventListener('click', () => {
      const seed = Math.random().toString(36).substring(7);
      const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
      this.modalAvatarImg.src = url;
      if (this.userProfile) {
        this.userProfile.avatar = url;
        this.headerAvatarImg.src = url;
        this.saveState();
      }
    });

    this.modalSaveProfileBtn.addEventListener('click', () => {
      if (this.userProfile) {
        this.userProfile.name = this.modalNameInput.value.trim() || this.userProfile.name;
        this.userProfile.mobile = this.modalMobileInput.value.trim() || this.userProfile.mobile;
        this.userProfile.avatar = this.modalAvatarImg.src;
        this.saveState();
        this.renderHeader();
        this.dedicatedProfileModal.classList.add('hidden');
        this.showToast('Profile & preferences saved!');
      }
    });

    this.modalRelaunchSetupBtn.addEventListener('click', () => {
      if (confirm('Reset tracker data and re-run initial setup?')) {
        this.habits = [...DEFAULT_HABITS];
        this.records = {};
        this.initDefaultStreak();
        this.saveState();
        this.dedicatedProfileModal.classList.add('hidden');
        this.render();
        this.showToast('Tracker reset to defaults.');
      }
    });

    // Reminders Sheet
    this.headerReminderBtn.addEventListener('click', () => {
      if (this.userProfile) this.remindersPhoneDisplay.textContent = this.userProfile.mobile || '+91 98765 43210';
      this.remindersSheet.classList.remove('hidden');
    });

    this.closeRemindersSheetBtn.addEventListener('click', () => this.remindersSheet.classList.add('hidden'));

    this.triggerTestAlertBtn.addEventListener('click', () => {
      this.showToast(`📲 Simulated reminder alert sent to ${this.userProfile.mobile || '+91 98765 43210'}!`);
      this.remindersSheet.classList.add('hidden');
    });

    // Marksheet Edit Mode Toggle
    this.marksheetToggleEditBtn.addEventListener('click', () => {
      if (!this.isEditMode) {
        if (confirm('⚠️ Enable Edit Mode:\nEditing past marks alters historical discipline. Confirm to unlock?')) {
          this.isEditMode = true;
          this.updateMarksheetEditUI();
          this.showToast('🔓 Edit Mode Unlocked.');
        }
      } else {
        this.isEditMode = false;
        this.updateMarksheetEditUI();
        this.showToast('🔒 Read-Only Locked.');
      }
    });

    // Analytics Chart Tabs
    this.analyticsChartTabs.querySelectorAll('.mobile-chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.analyticsChartTabs.querySelectorAll('.mobile-chart-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeAnalyticsTab = tab.getAttribute('data-chart');
        this.paneWeeklyBar.classList.toggle('hidden', this.activeAnalyticsTab !== 'weekly');
        this.paneTrendCurve.classList.toggle('hidden', this.activeAnalyticsTab !== 'trend');
        this.renderAnalyticsCharts();
      });
    });

    // Bottom Navigation Bar
    this.mobileBottomNav.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.mobileBottomNav.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const nav = btn.getAttribute('data-nav');
        this.switchNavView(nav);
      });
    });

    // FAB Button (Center checkmark)
    this.mobileCenterFabBtn.addEventListener('click', () => {
      this.quickCheckAllToday.click();
    });
  }

  switchNavView(nav) {
    if (nav === 'home') {
      this.viewHomePage.classList.remove('hidden');
      this.viewMarksheetPage.classList.add('hidden');
      this.viewAnalyticsPage.classList.add('hidden');
    } else if (nav === 'marksheet') {
      this.viewHomePage.classList.add('hidden');
      this.viewMarksheetPage.classList.remove('hidden');
      this.viewAnalyticsPage.classList.add('hidden');
      this.renderMarksheet();
    } else if (nav === 'analytics') {
      this.viewHomePage.classList.add('hidden');
      this.viewMarksheetPage.classList.add('hidden');
      this.viewAnalyticsPage.classList.remove('hidden');
      this.renderAnalyticsPage();
    } else if (nav === 'profile') {
      this.openProfileHeaderBtn.click();
    }
  }

  updateCollapseUI() {
    if (this.isTasksCollapsed) {
      this.collapsibleTasksContent.classList.add('collapsed');
      this.collapsedSummaryPill.classList.remove('hidden');
      this.collapseIcon.textContent = '▼';
      this.collapseLabel.textContent = 'Expand';
    } else {
      this.collapsibleTasksContent.classList.remove('collapsed');
      this.collapsedSummaryPill.classList.add('hidden');
      this.collapseIcon.textContent = '▲';
      this.collapseLabel.textContent = 'Collapse';
    }
  }

  updateMarksheetEditUI() {
    if (this.isEditMode) {
      this.marksheetEditIcon.textContent = '🔓';
      this.marksheetEditText.textContent = 'Editing Active';
      this.marksheetTable.classList.remove('mobile-read-only');
      this.marksheetTable.classList.add('mobile-edit-mode');
    } else {
      this.marksheetEditIcon.textContent = '🔒';
      this.marksheetEditText.textContent = 'Read-Only';
      this.marksheetTable.classList.add('mobile-read-only');
      this.marksheetTable.classList.remove('mobile-edit-mode');
    }
  }

  // Master Render
  render() {
    this.renderHeader();
    this.renderTopRoundProgressChart();
    this.renderCleanHabitList();
    this.updateCollapseUI();
  }

  renderHeader() {
    if (!this.userProfile) return;
    this.headerGreetingName.textContent = this.userProfile.name;
    this.headerAvatarImg.src = this.userProfile.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Nitin';
    this.headerSubGoal.textContent = this.userProfile.goal || 'Health & Fitness';
    this.badgeStreakCount.textContent = `Day ${this.streakState.currentStreak}`;
    this.islandStreakPill.textContent = `Day ${this.streakState.currentStreak} Streak 🔥`;
    this.roundCardStreakText.textContent = `Day ${this.streakState.currentStreak} 🔥`;

    if (this.streakState.freezeUsed) {
      this.badgeFreezeSnippet.textContent = '❄️ Grace Used';
      this.badgeFreezeSnippet.className = 'text-[9px] text-amber-300 font-bold block animate-pulse';
    } else if (this.streakState.freezeAvailable) {
      this.badgeFreezeSnippet.textContent = '❄️ Shield On';
      this.badgeFreezeSnippet.className = 'text-[9px] text-cyan-300 font-bold block';
    } else {
      this.badgeFreezeSnippet.textContent = 'Shield Expired';
      this.badgeFreezeSnippet.className = 'text-[9px] text-slate-500 font-bold block';
    }
  }

  // ========================================================
  // 3. TOP-PLACED PROGRESS ROUND CHART (UPPERMOST PART)
  // ========================================================
  renderTopRoundProgressChart() {
    const todayDay = this.getTodayDay();
    const totalHabits = this.habits.length;
    let completedCount = 0;

    this.habits.forEach(h => {
      if (this.getRecord(h.id, todayDay)) completedCount++;
    });

    const leftCount = Math.max(0, totalHabits - completedCount);
    const compPct = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    // Numerical stats
    this.roundCenterPct.textContent = `${compPct}%`;
    this.roundChartTopBadge.textContent = `${compPct}% Completed`;
    this.statCompletedCount.textContent = `${completedCount} Tasks`;
    this.statLeftCount.textContent = `${leftCount} Tasks`;
    this.collapsedSnippetText.textContent = `${completedCount} of ${totalHabits} habits completed today`;

    // Canvas Circular Progress Gauge Drawing
    const ctx = this.topRoundProgressCanvas.getContext('2d');
    const w = this.topRoundProgressCanvas.width;
    const h = this.topRoundProgressCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.classList.contains('dark');
    const cX = w / 2;
    const cY = h / 2;
    const radius = 54;
    const strokeW = 14;

    // Background track
    ctx.beginPath();
    ctx.arc(cX, cY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
    ctx.lineWidth = strokeW;
    ctx.stroke();

    // Progress arc
    if (totalHabits > 0 && completedCount > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * Math.min(1, completedCount / totalHabits));

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#8B5CF6');
      grad.addColorStop(0.5, '#EC4899');
      grad.addColorStop(1, '#10B981');

      ctx.beginPath();
      ctx.arc(cX, cY, radius, startAngle, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  // ========================================================
  // 1. CLEAN LIST-VIEW HABIT LAYOUT (DIRECT CHECKBOXES)
  // 6. FOCUSED HOME PAGE CONTENT (ONLY TODAY'S TASKS)
  // ========================================================
  renderCleanHabitList() {
    const todayDay = this.getTodayDay();
    let totalAll = this.habits.length;
    let pendingCount = 0;

    this.habits.forEach(h => {
      if (!this.getRecord(h.id, todayDay)) pendingCount++;
    });

    this.countFilterAll.textContent = totalAll;
    this.countFilterPending.textContent = pendingCount;
    this.pendingBadgePill.textContent = `${pendingCount} Pending`;

    if (totalAll === 0) {
      this.cleanListViewHabitsContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl">
          No habits configured. Tap <strong>"+ Task"</strong> above to add one!
        </div>
      `;
      return;
    }

    let html = '';
    this.habits.forEach(habit => {
      const isChecked = this.getRecord(habit.id, todayDay);

      // Filter: if 'pending', skip checked
      if (this.activeTaskFilter === 'pending' && isChecked) return;

      html += `
        <div class="clean-habit-list-item ${isChecked ? 'completed' : ''}" data-id="${habit.id}">
          <div class="flex items-center gap-3 min-w-0">
            <!-- DIRECT CHECK-BOX NEXT TO HABIT NAME FOR QUICK TICKING -->
            <div class="direct-habit-checkbox">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <!-- Habit Name & Details -->
            <div class="min-w-0">
              <span class="habit-item-title font-heading font-bold text-xs text-white block truncate" title="${this.escapeHtml(habit.name)}">
                ${this.escapeHtml(habit.name)}
              </span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                  ${habit.category}
                </span>
                <span class="text-[10px] text-slate-500">Goal: ${habit.goal}d</span>
              </div>
            </div>
          </div>

          <!-- Status Text -->
          <div class="text-right shrink-0">
            <span class="text-[11px] font-bold ${isChecked ? 'text-emerald-400' : 'text-slate-500'}">
              ${isChecked ? 'Done ✓' : 'Pending'}
            </span>
          </div>
        </div>
      `;
    });

    this.cleanListViewHabitsContainer.innerHTML = html;

    // Attach click events on items
    this.cleanListViewHabitsContainer.querySelectorAll('.clean-habit-list-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const cur = this.getRecord(id, todayDay);
        this.setRecord(id, todayDay, !cur);
        this.saveState();
        this.render();
      });
    });

    // Check submission status for button
    const subKey = `${this.currentYear}-${this.currentMonth}-${todayDay}`;
    if (this.submissions[subKey]) {
      this.homeSubmitBtnText.textContent = 'Submitted for Tonight (Update)';
    } else {
      this.homeSubmitBtnText.textContent = 'Submit Daily Progress';
    }
  }

  submitDailyProgress() {
    const todayDay = this.getTodayDay();
    const totalHabits = this.habits.length;
    let completed = 0;

    this.habits.forEach(h => {
      if (this.getRecord(h.id, todayDay)) completed++;
    });

    const rate = totalHabits > 0 ? (completed / totalHabits) : 0;
    const subKey = `${this.currentYear}-${this.currentMonth}-${todayDay}`;

    this.submissions[subKey] = {
      submitted: true,
      timestamp: Date.now(),
      count: completed
    };

    if (rate >= 0.4) {
      if (this.streakState.freezeUsed) {
        this.streakState.currentStreak += 1;
        this.streakState.freezeUsed = false;
        this.streakState.freezeAvailable = false;
        this.showToast(`❄️ Streak saved via Freeze Shield! Now at Day ${this.streakState.currentStreak} 🔥`);
      } else {
        this.streakState.currentStreak += 1;
        this.showToast(`🚀 Daily submission locked! Streak is now Day ${this.streakState.currentStreak} 🔥`);
      }
    } else {
      if (this.streakState.freezeAvailable && !this.streakState.freezeUsed) {
        this.streakState.freezeUsed = true;
        this.streakState.freezeAvailable = false;
        this.showToast(`⚠️ 1-Chance Streak Freeze activated for 1 grace day.`);
      } else if (this.streakState.freezeUsed) {
        this.streakState.currentStreak = 0;
        this.streakState.freezeUsed = false;
        this.showToast(`❌ Streak lost: Consecutive missed days. Streak reset to 0.`);
      }
    }

    this.streakState.lastSubmittedDate = subKey;
    this.saveState();
    this.render();
  }

  // ========================================================
  // HISTORICAL MARKSHEET (TAB VIEW 2)
  // ========================================================
  renderMarksheet() {
    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
    const todayDay = this.getTodayDay();
    this.marksheetMonthLabel.textContent = `Historical Matrix — ${MONTH_NAMES[this.currentMonth]} ${this.currentYear}`;

    let headHtml = `
      <tr>
        <th rowspan="2" class="mob-col-habit">Habit (${this.habits.length})</th>
        <th rowspan="2" class="w-10 text-[9px] text-slate-400">Goal</th>
        <th colspan="7" class="mob-th-week border-t-2 border-purple-500">W1</th>
        <th colspan="7" class="mob-th-week border-t-2 border-indigo-500">W2</th>
        <th colspan="7" class="mob-th-week border-t-2 border-emerald-500">W3</th>
        <th colspan="7" class="mob-th-week border-t-2 border-amber-500">W4</th>
        <th colspan="${31 - 28}" class="mob-th-week border-t-2 border-rose-500">W5</th>
        <th rowspan="2" class="w-10 text-[9px] text-emerald-400 font-bold">Done</th>
        <th rowspan="2" class="w-10 text-[9px] text-purple-400 font-bold">%</th>
      </tr>
      <tr>
    `;

    for (let day = 1; day <= 31; day++) {
      if (day <= daysInMonth) {
        const dObj = new Date(this.currentYear, this.currentMonth, day);
        const dow = WEEK_NAMES[dObj.getDay()];
        const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
        const isToday = day === todayDay;

        headHtml += `
          <th class="mob-th-day ${isWeekend ? 'weekend' : ''} ${isToday ? 'today-col' : ''}">
            <span class="d-num">${day}</span>
            <span class="d-dow">${dow.slice(0, 1)}</span>
          </th>
        `;
      } else {
        headHtml += `<th class="mob-th-day opacity-20"><span class="d-num">${day}</span></th>`;
      }
    }
    headHtml += `</tr>`;
    this.marksheetTableHead.innerHTML = headHtml;

    let bodyHtml = '';
    this.habits.forEach(habit => {
      let done = 0;
      let checkCols = '';

      for (let day = 1; day <= 31; day++) {
        if (day <= daysInMonth) {
          const dObj = new Date(this.currentYear, this.currentMonth, day);
          const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;
          const isTicked = this.getRecord(habit.id, day);
          if (isTicked) done++;

          checkCols += `
            <td class="mob-ms-cell ${isWeekend ? 'weekend' : ''} ${isTicked ? 'ticked' : ''}" 
                data-id="${habit.id}" data-day="${day}">
              <div class="mob-tick-box">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </td>
          `;
        } else {
          checkCols += `<td class="mob-ms-cell disabled-day"></td>`;
        }
      }

      const rate = habit.goal > 0 ? Math.round((done / habit.goal) * 100) : 0;

      bodyHtml += `
        <tr>
          <td class="mob-col-habit">
            <span class="text-white font-semibold truncate block" title="${this.escapeHtml(habit.name)}">${this.escapeHtml(habit.name)}</span>
          </td>
          <td class="text-slate-400 font-medium">${habit.goal}</td>
          ${checkCols}
          <td class="text-emerald-400 font-bold">${done}</td>
          <td class="text-purple-400 font-bold">${rate}%</td>
        </tr>
      `;
    });

    this.marksheetTableBody.innerHTML = bodyHtml;

    this.marksheetTableBody.querySelectorAll('.mob-ms-cell:not(.disabled-day)').forEach(cell => {
      cell.addEventListener('click', () => {
        const day = parseInt(cell.getAttribute('data-day'), 10);
        const id = cell.getAttribute('data-id');

        if (!this.isEditMode && day !== todayDay) {
          this.showToast('🔒 Marksheet is in Read-Only Mode. Tap "Unlock" above to adjust past days.');
          return;
        }

        const cur = this.getRecord(id, day);
        this.setRecord(id, day, !cur);
        this.saveState();
        this.renderMarksheet();
      });
    });

    // Footers
    let sumDone = 0;
    let sumGoal = 0;
    let dailyDone = '';

    for (let day = 1; day <= 31; day++) {
      if (day <= daysInMonth) {
        let count = 0;
        this.habits.forEach(h => { if (this.getRecord(h.id, day)) count++; });
        sumDone += count;
        sumGoal += this.habits.length;
        dailyDone += `<td class="font-bold text-slate-200">${count}</td>`;
      } else {
        dailyDone += `<td class="opacity-20">-</td>`;
      }
    }

    const pct = sumGoal > 0 ? Math.round((sumDone / sumGoal) * 100) : 0;
    this.marksheetTableFoot.innerHTML = `
      <tr class="bg-slate-900 font-semibold text-[10px]">
        <td class="mob-col-habit">Daily Completed</td>
        <td>-</td>
        ${dailyDone}
        <td class="text-emerald-400 font-bold">${sumDone}</td>
        <td class="text-purple-400 font-bold">${pct}%</td>
      </tr>
    `;
    this.updateMarksheetEditUI();
  }

  // ========================================================
  // ANALYTICS & TOP 10 (TAB VIEW 3)
  // ========================================================
  renderAnalyticsPage() {
    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
    const totalHabits = this.habits.length;

    const weeks = [
      { name: 'Week 1', range: [1, 7], label: 'D 1–7', color: '#8B5CF6' },
      { name: 'Week 2', range: [8, 14], label: 'D 8–14', color: '#6366F1' },
      { name: 'Week 3', range: [15, 21], label: 'D 15–21', color: '#10B981' },
      { name: 'Week 4', range: [22, 28], label: 'D 22–28', color: '#F59E0B' },
      { name: 'Week 5', range: [29, 31], label: 'D 29–31', color: '#F43F5E' }
    ];

    let cardsHtml = '';
    weeks.forEach(w => {
      let daysCount = 0;
      let completed = 0;
      for (let d = w.range[0]; d <= w.range[1]; d++) {
        if (d <= daysInMonth) {
          daysCount++;
          this.habits.forEach(h => { if (this.getRecord(h.id, d)) completed++; });
        }
      }
      const totalGoal = totalHabits * daysCount;
      const left = Math.max(0, totalGoal - completed);
      const pct = totalGoal > 0 ? Math.round((completed / totalGoal) * 100) : 0;

      cardsHtml += `
        <div class="mob-week-snap-card">
          <div class="flex items-center justify-between text-xs mb-1">
            <strong class="text-white">${w.name}</strong>
            <span class="text-[10px] font-bold text-purple-300">${pct}%</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Done: <strong class="text-emerald-400">${completed}</strong></span>
            <span>Left: <strong class="text-amber-400">${left}</strong></span>
          </div>
          <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full" style="width: ${pct}%; background-color: ${w.color}"></div>
          </div>
        </div>
      `;
    });
    this.analyticsWeeklyCardsRow.innerHTML = cardsHtml;

    this.renderAnalyticsCharts();
    this.renderTop10Habits();
  }

  renderAnalyticsCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
    const totalHabits = this.habits.length;

    // Weekly Bars
    const ctxBar = this.analyticsWeeklyCanvas.getContext('2d');
    const bW = this.analyticsWeeklyCanvas.width;
    const bH = this.analyticsWeeklyCanvas.height;
    ctxBar.clearRect(0, 0, bW, bH);

    const weeks = [
      { name: 'W1', range: [1, 7] },
      { name: 'W2', range: [8, 14] },
      { name: 'W3', range: [15, 21] },
      { name: 'W4', range: [22, 28] },
      { name: 'W5', range: [29, 31] }
    ];

    const weeklyData = weeks.map(w => {
      let daysCount = 0;
      let completed = 0;
      for (let d = w.range[0]; d <= w.range[1]; d++) {
        if (d <= daysInMonth) {
          daysCount++;
          this.habits.forEach(h => { if (this.getRecord(h.id, d)) completed++; });
        }
      }
      return { name: w.name, completed, goal: totalHabits * daysCount };
    });

    const maxVal = Math.max(...weeklyData.map(d => Math.max(d.completed, d.goal)), 10);
    const pLeft = 28;
    const pRight = 10;
    const pTop = 10;
    const pBottom = 22;
    const plotW = bW - pLeft - pRight;
    const plotH = bH - pTop - pBottom;

    ctxBar.strokeStyle = gridColor;
    ctxBar.lineWidth = 1;
    ctxBar.fillStyle = textColor;
    ctxBar.font = '9px Plus Jakarta Sans, sans-serif';
    ctxBar.textAlign = 'right';

    for (let i = 0; i <= 3; i++) {
      const val = Math.round((maxVal / 3) * i);
      const y = bH - pBottom - (plotH * (i / 3));
      ctxBar.beginPath();
      ctxBar.moveTo(pLeft, y);
      ctxBar.lineTo(bW - pRight, y);
      ctxBar.stroke();
      ctxBar.fillText(val, pLeft - 5, y + 3);
    }

    const groupW = plotW / weeklyData.length;
    const barW = 14;

    weeklyData.forEach((d, i) => {
      const gX = pLeft + (i * groupW);
      const center = gX + (groupW / 2);

      const hComp = (d.completed / maxVal) * plotH;
      const hGoal = (d.goal / maxVal) * plotH;

      ctxBar.fillStyle = '#F59E0B';
      ctxBar.beginPath();
      ctxBar.roundRect(center - barW - 2, bH - pBottom - hGoal, barW, hGoal, [3, 3, 0, 0]);
      ctxBar.fill();

      ctxBar.fillStyle = '#10B981';
      ctxBar.beginPath();
      ctxBar.roundRect(center + 2, bH - pBottom - hComp, barW, hComp, [3, 3, 0, 0]);
      ctxBar.fill();

      ctxBar.fillStyle = textColor;
      ctxBar.textAlign = 'center';
      ctxBar.fillText(d.name, center, bH - 6);
    });

    // Trend Curve
    const ctxTrend = this.analyticsTrendCanvas.getContext('2d');
    const tW = this.analyticsTrendCanvas.width;
    const tH = this.analyticsTrendCanvas.height;
    ctxTrend.clearRect(0, 0, tW, tH);

    const tpLeft = 28;
    const tpRight = 10;
    const tpTop = 10;
    const tpBottom = 22;
    const tplotW = tW - tpLeft - tpRight;
    const tplotH = tH - tpTop - tpBottom;

    ctxTrend.strokeStyle = gridColor;
    ctxTrend.lineWidth = 1;
    ctxTrend.fillStyle = textColor;
    ctxTrend.font = '9px Plus Jakarta Sans, sans-serif';
    ctxTrend.textAlign = 'right';

    for (let p = 0; p <= 100; p += 33.3) {
      const y = tH - tpBottom - (tplotH * (p / 100));
      ctxTrend.beginPath();
      ctxTrend.moveTo(tpLeft, y);
      ctxTrend.lineTo(tW - tpRight, y);
      ctxTrend.stroke();
      ctxTrend.fillText(`${Math.round(p)}%`, tpLeft - 4, y + 3);
    }

    const points = [];
    let sumRates = 0;

    for (let d = 1; d <= 31; d++) {
      let rate = 0;
      if (d <= daysInMonth) {
        let done = 0;
        this.habits.forEach(h => { if (this.getRecord(h.id, d)) done++; });
        rate = totalHabits > 0 ? (done / totalHabits) * 100 : 0;
        sumRates += rate;
      }
      const x = tpLeft + ((d - 1) / 30) * tplotW;
      const y = tH - tpBottom - (tplotH * (rate / 100));
      points.push({ x, y, inMonth: d <= daysInMonth });
    }

    const avg = daysInMonth > 0 ? Math.round(sumRates / daysInMonth) : 0;
    this.analyticsTrendAvg.textContent = `Average Consistency: ${avg}%`;

    const activePoints = points.filter(p => p.inMonth);
    if (activePoints.length > 0) {
      ctxTrend.beginPath();
      ctxTrend.moveTo(activePoints[0].x, tH - tpBottom);
      activePoints.forEach(p => ctxTrend.lineTo(p.x, p.y));
      ctxTrend.lineTo(activePoints[activePoints.length - 1].x, tH - tpBottom);
      ctxTrend.closePath();

      const areaGrad = ctxTrend.createLinearGradient(0, tpTop, 0, tH - tpBottom);
      areaGrad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
      areaGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      ctxTrend.fillStyle = areaGrad;
      ctxTrend.fill();

      ctxTrend.beginPath();
      ctxTrend.moveTo(activePoints[0].x, activePoints[0].y);
      for (let i = 1; i < activePoints.length; i++) {
        ctxTrend.lineTo(activePoints[i].x, activePoints[i].y);
      }
      ctxTrend.strokeStyle = '#8B5CF6';
      ctxTrend.lineWidth = 2;
      ctxTrend.stroke();

      for (let d = 1; d <= 31; d += 6) {
        const x = tpLeft + ((d - 1) / 30) * tplotW;
        ctxTrend.fillStyle = textColor;
        ctxTrend.textAlign = 'center';
        ctxTrend.fillText(`D${d}`, x, tH - 6);
      }
    }
  }

  renderTop10Habits() {
    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);

    const ranked = this.habits.map(h => {
      let done = 0;
      let streak = 0;
      let maxStreak = 0;

      for (let d = 1; d <= daysInMonth; d++) {
        if (this.getRecord(h.id, d)) {
          done++;
          streak++;
          if (streak > maxStreak) maxStreak = streak;
        } else {
          streak = 0;
        }
      }

      const rate = h.goal > 0 ? Math.round((done / h.goal) * 100) : 0;
      return { ...h, done, rate, streak: maxStreak };
    });

    ranked.sort((a, b) => b.rate - a.rate || b.done - a.done);

    let html = '';
    ranked.slice(0, 10).forEach((item, idx) => {
      const rankNum = idx + 1;
      let badge = `${rankNum}`;
      if (rankNum === 1) badge = '🥇';
      else if (rankNum === 2) badge = '🥈';
      else if (rankNum === 3) badge = '🥉';

      html += `
        <div class="mob-top-habit-row">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-6 text-center text-xs font-bold">${badge}</span>
            <div class="min-w-0">
              <span class="text-xs font-bold text-white block truncate">${this.escapeHtml(item.name)}</span>
              <span class="text-[10px] text-slate-400 block">${item.done}/${item.goal}d • 🔥 ${item.streak}d streak</span>
            </div>
          </div>
          <span class="text-xs font-extrabold text-purple-300 shrink-0">${item.rate}%</span>
        </div>
      `;
    });
    this.analyticsTop10List.innerHTML = html;
  }

  showToast(msg) {
    if (!this.toast) return;
    this.toast.textContent = msg;
    this.toast.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
    this.toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toast.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');
      this.toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3000);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.zenithMobileApp = new ZenithMobileApp();
});
