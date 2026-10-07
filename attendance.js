const profile = JSON.parse(localStorage.getItem('schoolProfileData') || '{}');
const role = (profile.role || '').toString().trim().toLowerCase();
const schoolName = (profile.schoolName || profile.schoolSearch || '').toString().trim();
const schoolKey = schoolName.toLowerCase();
const teacherId = (profile.email || profile.fullName || 'teacher').toString().trim().toLowerCase();
const attendanceStorageKey = 'schoolAttendance';
const classesStorageKey = 'schoolTeacherClasses';
const rosterStorageKey = 'schoolTeacherRosters';
const registryStorageKey = 'schoolUsersRegistry';
const dateLabel = document.getElementById('currentDate');
const monthInput = document.getElementById('monthSelect');
const classSelect = document.getElementById('classSelect');
const table = document.getElementById('registerTable');
const emptyMessage = document.getElementById('registerEmpty');
const saveButton = document.getElementById('saveAttendanceBtn');
const saveNotice = document.getElementById('saveNotice');
const addStudentDialog = document.getElementById('addStudentDialog');
const newNamesInput = document.getElementById('studentNamesInput');
const registerTitle = document.getElementById('registerTitle');
const printSchoolName = document.getElementById('printSchoolName');
const pendingRecords = {};
let attendanceRecords = readObject(attendanceStorageKey);

function localDateISO(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
}

function currentMonthValue() {
    return localDateISO(new Date()).slice(0, 7);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function readObject(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '{}');
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
        return {};
    }
}

function readRegistry() {
    try {
        const value = JSON.parse(localStorage.getItem(registryStorageKey) || '[]');
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}

function readSchoolStudents() {
    return readRegistry().filter(student =>
        (student.role || '').toString().trim().toLowerCase() === 'student' &&
        (student.schoolName || student.schoolSearch || '').toString().trim().toLowerCase() === schoolKey
    );
}

function studentId(student, index) {
    return (student.email || student.phone || student.attendanceId || student.id || student.fullName || `student-${index}`)
        .toString().trim().toLowerCase();
}

function readTeacherClasses() {
    const classes = readObject(classesStorageKey)[teacherId];
    return Array.isArray(classes) ? classes : [];
}

function rosterKey(className) {
    return `${teacherId}|${schoolKey}|${className}`;
}

function getClassRosterIds(className) {
    const rosters = readObject(rosterStorageKey);
    const key = rosterKey(className);
    if (Array.isArray(rosters[key])) return rosters[key];
    const students = readSchoolStudents();
    return students
        .map((student, index) => ({ student, index }))
        .filter(({ student }) => (student.grade || '').toString().trim().toLowerCase() === className.toLowerCase())
        .map(({ student, index }) => studentId(student, index));
}

function saveRoster(className, ids) {
    const rosters = readObject(rosterStorageKey);
    rosters[rosterKey(className)] = [...new Set(ids)];
    localStorage.setItem(rosterStorageKey, JSON.stringify(rosters));
}

function getRoster(className) {
    const students = readSchoolStudents();
    const ids = new Set(getClassRosterIds(className));
    return students.map((student, index) => ({ student, id: studentId(student, index) })).filter(item => ids.has(item.id));
}

function dateKey(className, date) {
    return `${schoolKey}|${className}|${date}`;
}

function pendingKey(className, date) {
    return `${className}|${date}`;
}

function readAttendance() {
    return readObject(attendanceStorageKey);
}

function getDayRecord(className, date) {
    const saved = attendanceRecords[dateKey(className, date)];
    return { ...(saved && typeof saved === 'object' ? saved : {}), ...(pendingRecords[pendingKey(className, date)] || {}) };
}

function selectedMonthBounds() {
    const [year, month] = monthInput.value.split('-').map(Number);
    if (!year || !month) return null;
    return { year, month, days: new Date(year, month, 0).getDate() };
}

function isWeekday(date) {
    const day = new Date(`${date}T12:00:00`).getDay();
    return day !== 0 && day !== 6;
}

function getDaysInMonth(bounds) {
    return Array.from({ length: bounds.days }, (_, index) => {
        const day = index + 1;
        const date = `${bounds.year}-${String(bounds.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return { day, date, weekday: new Date(`${date}T12:00:00`).getDay() };
    });
}

function formatStudentName(student) {
    const firstName = (student.firstName || '').toString().trim();
    const lastName = (student.lastName || '').toString().trim();
    if (firstName && lastName) return `${lastName}, ${firstName}`;
    const parts = (student.fullName || 'Unnamed student').toString().trim().split(/\s+/);
    return parts.length > 1 ? `${parts.slice(1).join(' ')}, ${parts[0]}` : parts[0];
}

function monthDateRange(bounds) {
    return getDaysInMonth(bounds).map(item => item.date);
}

function getMonthlyTotals(id, bounds) {
    let present = 0;
    let absent = 0;
    monthDateRange(bounds).forEach(date => {
        const status = getDayRecord(classSelect.value, date)[id];
        if (status === 'P') present += 1;
        if (status === 'A') absent += 1;
    });
    return { present, absent, days: getDaysInMonth(bounds).filter(item => item.weekday > 0 && item.weekday < 6).length };
}

function getYearToDateTotals(id, bounds) {
    let present = 0;
    let absent = 0;
    const end = new Date(bounds.year, bounds.month, 0);
    for (let month = 1; month <= bounds.month; month += 1) {
        const days = new Date(bounds.year, month, 0).getDate();
        for (let day = 1; day <= days; day += 1) {
            const date = `${bounds.year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = getDayRecord(classSelect.value, date)[id];
            if (status === 'P') present += 1;
            if (status === 'A') absent += 1;
        }
    }
    let daysSession = 0;
    const yearStart = new Date(bounds.year, 0, 1);
    for (const date = new Date(yearStart); date <= end; date.setDate(date.getDate() + 1)) {
        if (date.getDay() !== 0 && date.getDay() !== 6) daysSession += 1;
    }
    return { present, absent, days: daysSession };
}

function activeDateForMonth(bounds) {
    const today = localDateISO(new Date());
    const monthPrefix = `${bounds.year}-${String(bounds.month).padStart(2, '0')}`;
    if (today.startsWith(monthPrefix) && isWeekday(today)) return today;
    return getDaysInMonth(bounds).find(item => item.weekday > 0 && item.weekday < 6)?.date || '';
}

let activeDate = '';

function renderClassOptions() {
    const classes = readTeacherClasses();
    const savedClass = localStorage.getItem(`schoolTeacherSelectedClass:${teacherId}`) || '';
    classSelect.replaceChildren();
    classes.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelect.append(option);
    });
    if (classes.includes(savedClass)) classSelect.value = savedClass;
    else if (classes.length) classSelect.value = classes[0];
    const hasClasses = classes.length > 0;
    document.getElementById('classSetupLink').hidden = hasClasses;
    document.getElementById('openAddStudents').disabled = !hasClasses;
    document.getElementById('saveAttendanceBtn').disabled = true;
    return hasClasses;
}

function renderGrid() {
    const bounds = selectedMonthBounds();
    const className = classSelect.value;
    if (!bounds || !className) {
        table.innerHTML = '';
        table.hidden = true;
        emptyMessage.hidden = false;
        emptyMessage.textContent = className ? 'Choose a month to view the register.' : 'Add your classes in Settings to start a register.';
        saveButton.disabled = true;
        document.getElementById('downloadPdfBtn').disabled = true;
        return;
    }

    const days = getDaysInMonth(bounds);
    const roster = getRoster(className);
    const monthLabel = new Intl.DateTimeFormat('en-ZA', { month: 'long', year: 'numeric' }).format(new Date(bounds.year, bounds.month - 1, 1));
    table.hidden = roster.length === 0;
    emptyMessage.hidden = roster.length > 0;
    emptyMessage.textContent = roster.length ? '' : `No students are assigned to ${className}. Use the plus button to add students.`;

    if (activeDate && !activeDate.startsWith(`${bounds.year}-${String(bounds.month).padStart(2, '0')}`)) activeDate = activeDateForMonth(bounds);
    if (!activeDate) activeDate = activeDateForMonth(bounds);

    const dateHeaders = days.map(item => {
        const weekend = item.weekday === 0 || item.weekday === 6;
        const weekday = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'][item.weekday];
        const selected = item.date === activeDate ? ' active-date' : '';
        return `<th class="date-column${weekend ? ' weekend' : ''}${selected}"><span class="date-head">${item.day}<small>${weekday}</small></span></th>`;
    }).join('');

    const rows = roster.map(({ student, id }, rowIndex) => {
        const monthly = getMonthlyTotals(id, bounds);
        const ytd = getYearToDateTotals(id, bounds);
        const cells = days.map((item, dayIndex) => {
            const weekend = item.weekday === 0 || item.weekday === 6;
            if (weekend) return '<td class="weekend date-cell"><span aria-hidden="true">·</span></td>';
            const status = getDayRecord(className, item.date)[id] || '';
            const selected = item.date === activeDate ? ' active-date' : '';
            return `<td class="date-cell${selected}"><button type="button" class="status-cell status-${status.toLowerCase()}" data-date="${item.date}" data-student="${escapeHtml(id)}" data-row="${rowIndex}" data-day="${dayIndex}" aria-label="${escapeHtml(formatStudentName(student))}, ${item.date}: ${status || 'unmarked'}">${status}</button></td>`;
        }).join('');
        return `<tr><th class="student-name-cell" scope="row">${escapeHtml(formatStudentName(student))}</th><td class="homeroom-cell">${escapeHtml(className)}</td>${cells}<td class="total-cell">${monthly.present}</td><td class="total-cell">${monthly.absent}</td><td class="total-cell">${monthly.days}</td><td class="total-cell">${ytd.present}</td><td class="total-cell">${ytd.absent}</td><td class="total-cell">${ytd.days}</td></tr>`;
    }).join('');

    const activeDateText = activeDate ? new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${activeDate}T12:00:00`)) : '';
    table.innerHTML = `<caption class="print-caption">${escapeHtml(className)} · ${escapeHtml(monthLabel)}${activeDate ? ` · ${escapeHtml(activeDateText)}` : ''}</caption><thead><tr><th class="student-name-cell" rowspan="2">Name</th><th class="homeroom-head" rowspan="2">Hrm</th><th colspan="${days.length}">Dates</th><th colspan="3">Monthly Totals</th><th colspan="3">YTD Totals</th></tr><tr>${dateHeaders}<th>P</th><th>A</th><th>DS</th><th>P</th><th>A</th><th>DS</th></tr></thead><tbody>${rows}</tbody>`;
    document.getElementById('downloadPdfBtn').disabled = roster.length === 0;
    updateSaveState();
    scrollActiveDateIntoView();
}

function scrollActiveDateIntoView() {
    const wrap = table.closest('.register-table-wrap');
    const activeCell = table.querySelector('.date-cell.active-date');
    if (!wrap || !activeCell || table.hidden) return;
    const stickyWidth = ['thead .student-name-cell', 'thead .homeroom-head']
        .map(selector => table.querySelector(selector)?.getBoundingClientRect().width || 0)
        .reduce((total, width) => total + width, 0);
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = activeCell.getBoundingClientRect();
    const visibleLeft = wrapRect.left + stickyWidth + 6;
    const visibleRight = wrapRect.right - 6;
    if (cellRect.left >= visibleLeft && cellRect.right <= visibleRight) return;
    wrap.scrollLeft += cellRect.left - visibleLeft;
}

function updateSaveState() {
    const className = classSelect.value;
    const roster = getRoster(className);
    const dayRecord = activeDate ? getDayRecord(className, activeDate) : {};
    const isComplete = roster.length > 0 && roster.every(({ id }) => dayRecord[id] === 'P' || dayRecord[id] === 'A');
    saveButton.disabled = !isComplete;
    saveButton.title = isComplete ? 'Save this class register' : 'Mark every student P or A before saving';
}

function cycleStatus(button) {
    const date = button.dataset.date;
    const id = button.dataset.student;
    const row = button.dataset.row;
    const day = button.dataset.day;
    const className = classSelect.value;
    const key = pendingKey(className, date);
    const record = getDayRecord(className, date);
    const nextStatus = record[id] === 'P' ? 'A' : 'P';
    if (!pendingRecords[key]) pendingRecords[key] = { ...record };
    if (nextStatus) pendingRecords[key][id] = nextStatus;
    else delete pendingRecords[key][id];
    activeDate = date;
    saveNotice.classList.remove('visible');
    renderGrid();
    table.querySelector(`.status-cell[data-row="${row}"][data-day="${day}"]`)?.focus({ preventScroll: true });
}

function moveStatusFocus(button, key, event) {
    const row = Number(button.dataset.row);
    const day = Number(button.dataset.day);
    const movement = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[key];
    if (!movement) return;
    const targetRow = row + movement[0];
    const targetDay = day + movement[1];
    const target = table.querySelector(`.status-cell[data-row="${targetRow}"][data-day="${targetDay}"]`);
    if (target) {
        event.preventDefault();
        target.focus();
    }
}

function saveRegister() {
    const className = classSelect.value;
    const roster = getRoster(className);
    const record = getDayRecord(className, activeDate);
    const unmarked = roster.filter(({ id }) => record[id] !== 'P' && record[id] !== 'A');
    if (!roster.length || unmarked.length) {
        saveNotice.textContent = unmarked.length ? `Mark every student before saving. ${unmarked.length} still unmarked.` : 'Add students to this class before saving.';
        saveNotice.classList.add('visible');
        updateSaveState();
        return;
    }
    attendanceRecords = { ...attendanceRecords };
    attendanceRecords[dateKey(className, activeDate)] = Object.fromEntries(roster.map(({ id }) => [id, record[id]]));
    localStorage.setItem(attendanceStorageKey, JSON.stringify(attendanceRecords));
    delete pendingRecords[pendingKey(className, activeDate)];
    saveNotice.textContent = `Register saved for ${new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(`${activeDate}T12:00:00`))}.`;
    saveNotice.classList.add('visible');
    renderGrid();
}

function createAttendanceId() {
    return `teacher-added-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function addStudentsToClass() {
    const className = classSelect.value;
    if (!className) return;
    const registry = readRegistry();
    const schoolStudents = registry.filter(student =>
        (student.role || '').toString().trim().toLowerCase() === 'student' &&
        (student.schoolName || student.schoolSearch || '').toString().trim().toLowerCase() === schoolKey
    );
    const roster = new Set(getClassRosterIds(className));
    const names = [...new Set(newNamesInput.value.split(/[\n,]/).map(name => name.trim()).filter(Boolean))];
    names.forEach(fullName => {
        const existing = schoolStudents.find(student => (student.fullName || '').toString().trim().toLowerCase() === fullName.toLowerCase());
        if (existing) {
            const index = schoolStudents.indexOf(existing);
            roster.add(studentId(existing, index));
            return;
        }
        const parts = fullName.split(/\s+/);
        const attendanceId = createAttendanceId();
        const student = { id: attendanceId, attendanceId, firstName: parts[0], lastName: parts.slice(1).join(' '), fullName, role: 'student', grade: className, schoolName, email: '', phone: '' };
        registry.push(student);
        schoolStudents.push(student);
        roster.add(attendanceId.toLowerCase());
    });
    saveRoster(className, [...roster]);
    localStorage.setItem(registryStorageKey, JSON.stringify(registry));
    newNamesInput.value = '';
    addStudentDialog.close();
    saveNotice.classList.remove('visible');
    renderGrid();
}

function exportMonth(date) {
    if (!date) return;
    activeDate = date;
    renderGrid();
    document.body.classList.add('printing-register');
    window.print();
    document.body.classList.remove('printing-register');
}

function init() {
    document.body.classList.toggle('dark-mode', localStorage.getItem('schoolDarkMode') === 'true');
    if (role !== 'teacher') {
        document.getElementById('accessDenied').hidden = false;
        return;
    }
    document.getElementById('attendancePage').hidden = false;
    const pageTitle = schoolName || 'Monthly Attendance Register';
    registerTitle.textContent = pageTitle;
    printSchoolName.textContent = pageTitle;
    const today = new Date();
    dateLabel.textContent = new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today);
    dateLabel.dateTime = localDateISO(today);
    monthInput.value = currentMonthValue();
    renderClassOptions();
    if (classSelect.value) localStorage.setItem(`schoolTeacherSelectedClass:${teacherId}`, classSelect.value);
    activeDate = activeDateForMonth(selectedMonthBounds());
    renderGrid();

    classSelect.addEventListener('change', () => {
        localStorage.setItem(`schoolTeacherSelectedClass:${teacherId}`, classSelect.value);
        saveNotice.classList.remove('visible');
        renderGrid();
    });
    monthInput.addEventListener('change', () => {
        const bounds = selectedMonthBounds();
        activeDate = bounds ? activeDateForMonth(bounds) : '';
        saveNotice.classList.remove('visible');
        renderGrid();
    });
    table.addEventListener('click', event => {
        const statusCell = event.target.closest('.status-cell');
        if (statusCell) cycleStatus(statusCell);
    });
    table.addEventListener('keydown', event => {
        const statusCell = event.target.closest('.status-cell');
        if (statusCell) moveStatusFocus(statusCell, event.key, event);
    });
    saveButton.addEventListener('click', saveRegister);
    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        if (activeDate) exportMonth(activeDate);
    });
    document.getElementById('openAddStudents').addEventListener('click', () => addStudentDialog.showModal());
    document.getElementById('cancelAddStudents').addEventListener('click', () => addStudentDialog.close());
    document.getElementById('addStudentsForm').addEventListener('submit', event => {
        event.preventDefault();
        addStudentsToClass();
    });
}

init();