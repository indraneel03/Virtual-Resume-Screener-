/**
 * ResumeAI Pro - Enterprise Resume Intelligence Platform
 * Advanced Frontend JavaScript
 */

// ============================================
// Global State Management
// ============================================

const AppState = {
    selectedFiles: [],
    currentResults: null,
    filteredResults: [],
    currentPage: 1,
    perPage: 20,
    currentView: 'cards',
    currentFilter: 'all',
    currentSort: 'score-desc',
    isLoading: false,
    theme: 'dark'
};

// Demo Data - 1000 Candidates for showcasing
const DemoData = {
    firstNames: ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 
                 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Daniel', 'Harper', 'Michael', 'Evelyn',
                 'Ethan', 'Abigail', 'Sebastian', 'Emily', 'Jack', 'Elizabeth', 'Owen', 'Sofia', 'Ryan', 'Avery',
                 'Nathan', 'Ella', 'Caleb', 'Scarlett', 'Isaac', 'Grace', 'Luke', 'Chloe', 'John', 'Victoria',
                 'David', 'Riley', 'Gabriel', 'Aria', 'Samuel', 'Lily', 'Julian', 'Aurora', 'Leo', 'Zoey',
                 'Aiden', 'Penelope', 'Matthew', 'Layla', 'Jackson', 'Nora', 'Logan', 'Camila', 'Mason', 'Hannah',
                 'Priya', 'Raj', 'Aisha', 'Mohammed', 'Chen', 'Wei', 'Yuki', 'Hiroshi', 'Maria', 'Carlos',
                 'Fatima', 'Ahmed', 'Sanjay', 'Lakshmi', 'Kenji', 'Sakura', 'Juan', 'Ana', 'Liu', 'Ming'],
    
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
                'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
                'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
                'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Turner',
                'Patel', 'Kumar', 'Singh', 'Wang', 'Li', 'Zhang', 'Chen', 'Yang', 'Kim', 'Park',
                'Tanaka', 'Yamamoto', 'Sato', 'Suzuki', 'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer'],

    positions: [
        'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
        'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Cloud Architect',
        'Product Manager', 'UX Designer', 'UI Developer', 'Mobile Developer',
        'Data Engineer', 'Security Engineer', 'QA Engineer', 'Site Reliability Engineer',
        'Solutions Architect', 'Technical Lead', 'Engineering Manager', 'CTO',
        'AI Research Scientist', 'Blockchain Developer', 'IoT Engineer', 'Embedded Systems Engineer',
        'Database Administrator', 'Network Engineer', 'Systems Administrator', 'IT Consultant'
    ],

    companies: [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Uber',
        'Airbnb', 'Spotify', 'Twitter', 'LinkedIn', 'Salesforce', 'Adobe', 'Oracle', 'IBM',
        'Intel', 'Nvidia', 'AMD', 'Cisco', 'VMware', 'Dell', 'HP', 'Samsung',
        'Stripe', 'Square', 'PayPal', 'Shopify', 'Twilio', 'Slack', 'Zoom', 'Atlassian',
        'Dropbox', 'Box', 'Workday', 'ServiceNow', 'Splunk', 'Datadog', 'MongoDB', 'Snowflake',
        'Accenture', 'Deloitte', 'McKinsey', 'BCG', 'Bain', 'PwC', 'EY', 'KPMG',
        'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Citadel', 'Two Sigma', 'DE Shaw'
    ],

    skills: {
        programming: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R'],
        frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Redux', 'GraphQL'],
        backend: ['Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Express.js', 'Ruby on Rails', 'ASP.NET', 'Laravel', 'NestJS'],
        database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Neo4j', 'SQLite', 'Oracle DB'],
        cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD', 'Serverless', 'Lambda'],
        ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NLP', 'Computer Vision', 'Deep Learning', 'MLOps', 'Pandas', 'NumPy'],
        tools: ['Git', 'Jira', 'Confluence', 'Figma', 'VS Code', 'IntelliJ', 'Postman', 'Swagger', 'Linux', 'Agile/Scrum']
    },

    education: [
        'PhD in Computer Science', 'MS in Computer Science', 'MS in Data Science', 'MS in AI/ML',
        'BS in Computer Science', 'BS in Software Engineering', 'BS in Information Technology',
        'BS in Electrical Engineering', 'BS in Mathematics', 'MBA',
        'Bootcamp Graduate', 'Self-taught Developer'
    ],

    universities: [
        'MIT', 'Stanford', 'Carnegie Mellon', 'UC Berkeley', 'Caltech', 'Harvard', 'Princeton',
        'Georgia Tech', 'University of Washington', 'University of Michigan', 'Cornell', 'Columbia',
        'UCLA', 'UCSD', 'University of Illinois', 'UT Austin', 'University of Wisconsin',
        'IIT Bombay', 'IIT Delhi', 'Tsinghua University', 'Peking University', 'NUS', 'NTU',
        'Oxford', 'Cambridge', 'ETH Zurich', 'EPFL', 'TU Munich', 'University of Toronto'
    ],

    strengths: [
        'Strong problem-solving skills', 'Excellent communication', 'Leadership experience',
        'Quick learner', 'Team player', 'Self-motivated', 'Detail-oriented',
        'Creative thinker', 'Strong analytical skills', 'Adaptable',
        'Proven track record', 'Domain expertise', 'Mentorship experience',
        'Open source contributor', 'Patent holder', 'Published researcher'
    ],

    weaknesses: [
        'Limited cloud experience', 'No management experience', 'Gaps in employment',
        'Missing required certification', 'Limited industry experience', 'Needs visa sponsorship',
        'Overqualified for role', 'Salary expectations may be high', 'Remote only preference',
        'Short tenure at previous jobs', 'Missing key technical skill'
    ]
};

// ============================================
// DOM Elements
// ============================================

const DOM = {
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingStatus: document.getElementById('loadingStatus'),
    loadingProgress: document.getElementById('loadingProgress'),
    progressText: document.getElementById('progressText'),
    processedCount: document.getElementById('processedCount'),
    remainingCount: document.getElementById('remainingCount'),
    matchesFound: document.getElementById('matchesFound'),

    // Upload
    uploadZone: document.getElementById('uploadZone'),
    resumeFiles: document.getElementById('resumeFiles'),
    uploadProgressSection: document.getElementById('uploadProgressSection'),
    selectedFilesSection: document.getElementById('selectedFilesSection'),
    filesGrid: document.getElementById('filesGrid'),
    fileCount: document.getElementById('fileCount'),
    totalFilesCount: document.getElementById('totalFilesCount'),
    estimatedTime: document.getElementById('estimatedTime'),

    // Job Description
    jobDescription: document.getElementById('jobDescription'),
    extractedRequirements: document.getElementById('extractedRequirements'),
    requirementsGrid: document.getElementById('requirementsGrid'),

    // Buttons
    analyzeBtn: document.getElementById('analyzeBtn'),
    demoBtn: document.getElementById('demoBtn'),

    // Results
    resultsDashboard: document.getElementById('resultsDashboard'),
    heroSection: document.getElementById('heroSection'),
    uploadSection: document.getElementById('uploadSection'),
    
    // Stats
    totalCandidates: document.getElementById('totalCandidates'),
    strongMatches: document.getElementById('strongMatches'),
    goodMatches: document.getElementById('goodMatches'),
    avgScore: document.getElementById('avgScore'),
    strongPercent: document.getElementById('strongPercent'),
    goodPercent: document.getElementById('goodPercent'),

    // Candidates
    candidatesGrid: document.getElementById('candidatesGrid'),
    candidatesList: document.getElementById('candidatesList'),
    candidatesTableBody: document.getElementById('candidatesTableBody'),

    // Pagination
    showingFrom: document.getElementById('showingFrom'),
    showingTo: document.getElementById('showingTo'),
    totalShowing: document.getElementById('totalShowing'),
    pageNumbers: document.getElementById('pageNumbers'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    perPage: document.getElementById('perPage'),

    // Charts
    scoreChart: document.getElementById('scoreChart'),
    experienceChart: document.getElementById('experienceChart'),
    skillsBreakdown: document.getElementById('skillsBreakdown'),

    // JSON
    jsonContent: document.getElementById('jsonContent'),

    // Modals
    candidateModal: document.getElementById('candidateModal'),
    modalBody: document.getElementById('modalBody'),
    exportModal: document.getElementById('exportModal'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupDragAndDrop();
    setupTheme();
    createParticles();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Upload
    DOM.uploadZone?.addEventListener('click', () => DOM.resumeFiles?.click());
    DOM.resumeFiles?.addEventListener('change', handleFileSelect);

    // Buttons
    DOM.analyzeBtn?.addEventListener('click', handleAnalyze);
    DOM.demoBtn?.addEventListener('click', handleDemo);

    // Job Description Input Toggle
    document.querySelectorAll('.toggle-input-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-input-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const inputType = btn.dataset.input;
            document.getElementById('jobTextInput').style.display = inputType === 'text' ? 'flex' : 'none';
            document.getElementById('jobFileUpload').style.display = inputType === 'file' ? 'block' : 'none';
            document.querySelector('.job-templates').style.display = inputType === 'text' ? 'flex' : 'none';
        });
    });

    // Job Description File Upload
    const jobFileZone = document.getElementById('jobFileZone');
    const jobDescFile = document.getElementById('jobDescFile');
    jobFileZone?.addEventListener('click', () => jobDescFile?.click());
    jobDescFile?.addEventListener('change', handleJobFileSelect);
    
    // Drag and drop for job file
    jobFileZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        jobFileZone.style.borderColor = 'var(--primary-500)';
        jobFileZone.style.background = 'rgba(99, 102, 241, 0.1)';
    });
    jobFileZone?.addEventListener('dragleave', (e) => {
        e.preventDefault();
        jobFileZone.style.borderColor = '';
        jobFileZone.style.background = '';
    });
    jobFileZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        jobFileZone.style.borderColor = '';
        jobFileZone.style.background = '';
        const file = e.dataTransfer.files[0];
        if (file) {
            jobDescFile.files = e.dataTransfer.files;
            handleJobFileSelect({ target: { files: [file] } });
        }
    });

    // Job Templates
    document.querySelectorAll('.template-chip').forEach(chip => {
        chip.addEventListener('click', () => loadJobTemplate(chip.dataset.template));
    });

    // View Toggles
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => filterCandidates(pill.dataset.filter));
    });

    // Sort Options
    document.querySelectorAll('.sort-menu button').forEach(btn => {
        btn.addEventListener('click', () => sortCandidates(btn.dataset.sort));
    });

    // Pagination
    DOM.prevPage?.addEventListener('click', () => changePage(-1));
    DOM.nextPage?.addEventListener('click', () => changePage(1));
    DOM.perPage?.addEventListener('change', () => {
        AppState.perPage = parseInt(DOM.perPage.value);
        AppState.currentPage = 1;
        renderCandidates();
    });

    // Modal Close
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('closeExportModal')?.addEventListener('click', () => {
        DOM.exportModal.classList.remove('active');
    });

    // Export
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        DOM.exportModal.classList.add('active');
    });

    // Export Options
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    document.getElementById('confirmExport')?.addEventListener('click', handleExport);

    // JSON Actions
    document.getElementById('copyJson')?.addEventListener('click', copyJsonToClipboard);
    document.getElementById('downloadJson')?.addEventListener('click', downloadJson);
    document.getElementById('downloadCsv')?.addEventListener('click', downloadCsv);

    // Theme Toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Global Search
    document.getElementById('globalSearch')?.addEventListener('input', debounce(handleGlobalSearch, 300));

    // Parse Job Button
    document.getElementById('parseJobBtn')?.addEventListener('click', parseJobDescription);
    document.getElementById('clearJobBtn')?.addEventListener('click', () => {
        DOM.jobDescription.value = '';
        DOM.extractedRequirements.classList.remove('active');
    });

    // File Actions
    document.getElementById('selectAllFiles')?.addEventListener('click', selectAllFiles);
    document.getElementById('removeSelectedFiles')?.addEventListener('click', removeSelectedFiles);
    document.getElementById('clearAllFiles')?.addEventListener('click', clearAllFiles);

    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.dataset.section;
            switchSection(section);
        });
    });

    // Auth Modal
    document.getElementById('signInBtn')?.addEventListener('click', () => openAuthModal('signin'));
    document.getElementById('signUpBtn')?.addEventListener('click', () => openAuthModal('signup'));
    document.getElementById('closeAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('showSignUp')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signup');
    });
    document.getElementById('showSignIn')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signin');
    });

    // Auth Forms
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('signOutBtn')?.addEventListener('click', handleSignOut);

    // Password Strength
    document.getElementById('registerPassword')?.addEventListener('input', checkPasswordStrength);

    // User Avatar Dropdown
    document.getElementById('userAvatar')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown')?.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        document.getElementById('userDropdown')?.classList.remove('active');
    });

    // Report Buttons
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', () => generateQuickReport(btn.dataset.report));
    });

    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('generateCustomReport')?.addEventListener('click', generateCustomReport);

    // Candidates Page Filters
    document.getElementById('candidateSearch')?.addEventListener('input', debounce(filterCandidatesPage, 300));
    document.getElementById('statusFilter')?.addEventListener('change', filterCandidatesPage);
    document.getElementById('expFilter')?.addEventListener('change', filterCandidatesPage);
    document.getElementById('scoreFilter')?.addEventListener('change', filterCandidatesPage);
    document.getElementById('bulkSelectBtn')?.addEventListener('click', toggleBulkSelect);
    document.getElementById('bulkExportBtn')?.addEventListener('click', exportSelectedCandidates);
}

// ============================================
// Drag and Drop
// ============================================

function setupDragAndDrop() {
    const zone = DOM.uploadZone;
    if (!zone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, preventDefaults);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.add('dragover'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.remove('dragover'));
    });

    zone.addEventListener('drop', handleDrop);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
}

function addFiles(files) {
    const validExtensions = ['pdf', 'doc', 'docx', 'txt', 'zip'];
    
    files.forEach(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (validExtensions.includes(ext)) {
            if (!AppState.selectedFiles.find(f => f.name === file.name)) {
                AppState.selectedFiles.push(file);
            }
        } else {
            showToast(`Invalid file type: ${file.name}`, 'error');
        }
    });

    updateFilesUI();
}

function updateFilesUI() {
    const count = AppState.selectedFiles.length;
    
    DOM.fileCount.textContent = count;
    DOM.totalFilesCount.textContent = count;
    DOM.estimatedTime.textContent = `${Math.ceil(count * 0.5)} min`;
    
    DOM.analyzeBtn.disabled = count === 0;
    DOM.selectedFilesSection.classList.toggle('active', count > 0);

    DOM.filesGrid.innerHTML = AppState.selectedFiles.map((file, index) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const iconClass = ext === 'pdf' ? 'pdf' : ext === 'doc' || ext === 'docx' ? 'doc' : 'txt';
        const icon = ext === 'pdf' ? 'fa-file-pdf' : ext === 'doc' || ext === 'docx' ? 'fa-file-word' : 'fa-file-alt';
        
        return `
            <div class="file-item" data-index="${index}">
                <input type="checkbox" class="file-checkbox">
                <i class="fas ${icon} file-icon ${iconClass}"></i>
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
                <button class="file-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(index) {
    AppState.selectedFiles.splice(index, 1);
    updateFilesUI();
}

function selectAllFiles() {
    document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = true);
}

function removeSelectedFiles() {
    const checkboxes = document.querySelectorAll('.file-checkbox:checked');
    const indices = Array.from(checkboxes).map(cb => 
        parseInt(cb.closest('.file-item').dataset.index)
    ).sort((a, b) => b - a);
    
    indices.forEach(i => AppState.selectedFiles.splice(i, 1));
    updateFilesUI();
}

function clearAllFiles() {
    AppState.selectedFiles = [];
    updateFilesUI();
}

// Job Description File Upload
let selectedJobFile = null;

function handleJobFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const validExts = ['pdf', 'doc', 'docx', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExts.includes(ext)) {
        showToast('Invalid file type. Use PDF, DOCX, or TXT.', 'error');
        return;
    }
    
    selectedJobFile = file;
    const selectedDiv = document.getElementById('jobFileSelected');
    selectedDiv.innerHTML = `
        <i class="fas fa-file-alt file-icon"></i>
        <span class="file-name">${file.name}</span>
        <span class="file-remove" onclick="removeJobFile()"><i class="fas fa-times"></i></span>
    `;
    selectedDiv.style.display = 'flex';
    
    // Read file content if it's a text file
    if (ext === 'txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
            DOM.jobDescription.value = e.target.result;
            showToast('Job description loaded from file!', 'success');
        };
        reader.readAsText(file);
    } else {
        showToast('File selected. Content will be extracted during analysis.', 'info');
    }
}

function removeJobFile() {
    selectedJobFile = null;
    document.getElementById('jobFileSelected').innerHTML = '';
    document.getElementById('jobFileSelected').style.display = 'none';
    document.getElementById('jobDescFile').value = '';
}

window.removeJobFile = removeJobFile;

// ============================================
// Job Templates
// ============================================

const JobTemplates = {
    software: `Senior Software Engineer

We are looking for a Senior Software Engineer to join our team.

Required Skills:
• 5+ years of software development experience
• Proficiency in Python, JavaScript, or Java
• Experience with React, Node.js, or similar frameworks
• Strong understanding of databases (PostgreSQL, MongoDB)
• Cloud experience (AWS, GCP, or Azure)
• Experience with Docker and Kubernetes
• Strong problem-solving and communication skills

Nice to have:
• Experience with microservices architecture
• CI/CD pipeline experience
• Open source contributions

Education: BS in Computer Science or related field`,

    data: `Data Scientist

We are seeking a talented Data Scientist to join our analytics team.

Required Skills:
• 3+ years of data science experience
• Strong proficiency in Python and SQL
• Experience with machine learning frameworks (TensorFlow, PyTorch, Scikit-learn)
• Statistical analysis and modeling
• Data visualization (Tableau, Power BI, or similar)
• Experience with big data tools (Spark, Hadoop)

Nice to have:
• NLP or Computer Vision experience
• PhD in relevant field
• Published research papers

Education: MS or PhD in Data Science, Statistics, or related field`,

    product: `Product Manager

We are looking for an experienced Product Manager to lead our product development.

Required Skills:
• 4+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with Agile/Scrum methodologies
• Excellent communication and presentation skills
• Technical background or understanding
• User research and customer development experience

Nice to have:
• Experience with B2B SaaS products
• MBA or technical degree
• Previous startup experience

Education: Bachelor's degree required, MBA preferred`,

    design: `UX Designer

We are seeking a creative UX Designer to enhance our user experience.

Required Skills:
• 3+ years of UX/UI design experience
• Proficiency in Figma, Sketch, or Adobe XD
• Strong portfolio demonstrating user-centered design
• Experience with design systems
• User research and usability testing experience
• Prototyping and wireframing skills

Nice to have:
• Front-end development skills (HTML, CSS, JavaScript)
• Motion design experience
• Experience with accessibility guidelines

Education: Bachelor's degree in Design, HCI, or related field`
};

function loadJobTemplate(template) {
    DOM.jobDescription.value = JobTemplates[template] || '';
    
    document.querySelectorAll('.template-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.template === template);
    });

    parseJobDescription();
}

function parseJobDescription() {
    const text = DOM.jobDescription.value;
    if (!text.trim()) return;

    const skills = [];
    const allSkills = Object.values(DemoData.skills).flat();
    
    allSkills.forEach(skill => {
        if (text.toLowerCase().includes(skill.toLowerCase())) {
            skills.push(skill);
        }
    });

    if (skills.length > 0) {
        DOM.extractedRequirements.classList.add('active');
        DOM.requirementsGrid.innerHTML = skills.map(skill => 
            `<span class="skill-tag matched">${skill}</span>`
        ).join('');
    }
}

// ============================================
// Analysis Handlers
// ============================================

async function handleAnalyze() {
    if (AppState.selectedFiles.length === 0 && !DOM.jobDescription.value.trim()) {
        showToast('Please upload resumes or enter a job description', 'error');
        return;
    }

    const totalFiles = Math.max(AppState.selectedFiles.length, 1);
    showLoading(true, totalFiles);
    
    // Simulate initial progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress < 90) {
            updateLoadingProgress(Math.floor(progress * totalFiles / 100), totalFiles);
        }
    }, 300);
    
    const formData = new FormData();
    formData.append('job_description', DOM.jobDescription.value);
    
    // Add job description file if selected
    if (selectedJobFile) {
        formData.append('job_file', selectedJobFile);
    }
    
    AppState.selectedFiles.forEach(file => formData.append('resumes', file));

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);
        updateLoadingProgress(totalFiles, totalFiles);
        await sleep(300);

        const data = await response.json();
        
        if (data.status === 'success') {
            AppState.currentResults = data;
            AppState.filteredResults = data.candidates;
            renderResults(data);
            showToast('Analysis complete!', 'success');
        } else {
            showToast(data.error || 'Analysis failed', 'error');
        }
    } catch (error) {
        clearInterval(progressInterval);
        showToast('Network error. Please try again.', 'error');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

async function handleDemo() {
    // Get candidate count from user or default to 100 for fast demo
    const totalCandidates = parseInt(prompt('How many resumes to analyze? (1-1000)', '100')) || 100;
    const candidateCount = Math.min(Math.max(1, totalCandidates), 1000);
    
    showLoading(true, candidateCount);
    
    const candidates = [];
    
    // Animated batch generation with live progress
    const batchSize = Math.max(1, Math.floor(candidateCount / 20)); // ~20 updates
    
    for (let i = 0; i < candidateCount; i += batchSize) {
        const batchEnd = Math.min(i + batchSize, candidateCount);
        
        for (let j = i; j < batchEnd; j++) {
            candidates.push(generateDemoCandidate(j + 1));
        }
        
        // Update progress with animation
        updateLoadingProgress(batchEnd, candidateCount);
        
        // Small delay for visible animation
        await sleep(50);
    }
    
    // Final update to ensure 100%
    updateLoadingProgress(candidateCount, candidateCount);
    await sleep(300);

    const demoData = {
        status: 'success',
        timestamp: new Date().toISOString(),
        total_candidates: candidates.length,
        candidates: candidates.sort((a, b) => b.job_match.overall_score - a.job_match.overall_score)
    };

    AppState.currentResults = demoData;
    AppState.filteredResults = demoData.candidates;
    renderResults(demoData);
    
    showLoading(false);
    showToast(`Successfully analyzed ${candidateCount} resumes!`, 'success');
}

function generateDemoCandidate(index) {
    const firstName = randomItem(DemoData.firstNames);
    const lastName = randomItem(DemoData.lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'])}`;
    const phone = `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
    
    const position = randomItem(DemoData.positions);
    const experience = randomInt(1, 20);
    const education = randomItem(DemoData.education);
    const university = randomItem(DemoData.universities);
    
    // Generate skills
    const numSkills = randomInt(5, 15);
    const skills = [];
    const allSkillCategories = Object.values(DemoData.skills);
    while (skills.length < numSkills) {
        const category = randomItem(allSkillCategories);
        const skill = randomItem(category);
        if (!skills.includes(skill)) skills.push(skill);
    }
    
    // Calculate scores
    const skillScore = randomInt(40, 100);
    const expScore = randomInt(40, 100);
    const eduScore = randomInt(40, 100);
    const overallScore = Math.round((skillScore * 0.5 + expScore * 0.3 + eduScore * 0.2));
    
    // Determine status
    let recommendation, status;
    if (overallScore >= 85) {
        recommendation = 'STRONG_MATCH';
        status = 'strong';
    } else if (overallScore >= 70) {
        recommendation = 'GOOD_MATCH';
        status = 'good';
    } else if (overallScore >= 55) {
        recommendation = 'NEEDS_REVIEW';
        status = 'review';
    } else {
        recommendation = 'NOT_RECOMMENDED';
        status = 'rejected';
    }

    // Generate work experience
    const workExp = [];
    let remainingExp = experience;
    while (remainingExp > 0) {
        const years = Math.min(randomInt(1, 5), remainingExp);
        workExp.push({
            company: randomItem(DemoData.companies),
            position: randomItem(DemoData.positions),
            duration: `${years} year${years > 1 ? 's' : ''}`,
            years: years
        });
        remainingExp -= years;
    }

    return {
        file_reference: `candidate_CAND_${String(index).padStart(4, '0')}_${name.replace(' ', '_')}.pdf`,
        candidate_profile: {
            candidate_id: `CAND_${String(index).padStart(6, '0')}`,
            name: name,
            email: email,
            phone: phone,
            current_position: position,
            total_experience_years: experience,
            languages: randomItems(['English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'German', 'Japanese'], randomInt(1, 3))
        },
        education: {
            highest_degree: education,
            university: university,
            details: [{ degree: education, institution: university, year: 2024 - experience - 4 }]
        },
        skills: skills,
        work_experience: workExp,
        certifications: randomItems([
            'AWS Certified Solutions Architect',
            'Google Cloud Professional',
            'Azure Administrator',
            'Kubernetes Administrator',
            'PMP Certified',
            'Scrum Master',
            'CISSP',
            'TensorFlow Developer Certificate'
        ], randomInt(0, 3)),
        job_match: {
            overall_score: overallScore,
            skill_match_score: skillScore,
            experience_match_score: expScore,
            education_match_score: eduScore,
            matched_skills: skills.slice(0, Math.floor(skills.length * overallScore / 100)),
            missing_skills: randomItems(['GraphQL', 'Kubernetes', 'Terraform', 'Spark'], randomInt(0, 3)),
            additional_skills: skills.slice(-3)
        },
        evaluation: {
            strengths: randomItems(DemoData.strengths, randomInt(2, 4)),
            weaknesses: randomItems(DemoData.weaknesses, randomInt(0, 2)),
            recommendation: recommendation,
            recommendation_explanation: `Candidate shows ${overallScore >= 70 ? 'strong' : 'moderate'} alignment with job requirements.`,
            priority_level: overallScore >= 85 ? 'HIGH' : overallScore >= 70 ? 'MEDIUM' : 'LOW',
            status: status
        },
        next_steps: {
            action: overallScore >= 70 ? 'Schedule Technical Interview' : 'Review Application',
            interview_questions: [
                'Tell me about a challenging project you worked on.',
                'How do you approach problem-solving?',
                'Describe your experience with team collaboration.'
            ],
            recruiter_notes: ''
        },
        metadata: {
            timestamp: new Date().toISOString(),
            processed_by: 'ResumeAI Pro v2.0'
        }
    };
}

// ============================================
// Results Rendering
// ============================================

function renderResults(data) {
    // Hide hero and show results
    DOM.heroSection.style.display = 'none';
    DOM.resultsDashboard.classList.add('active');

    // Update stats
    updateStats(data);
    
    // Render charts
    renderCharts(data);
    
    // Render candidates
    AppState.currentPage = 1;
    renderCandidates();
    
    // Render JSON
    DOM.jsonContent.textContent = JSON.stringify(data, null, 2);
}

function updateStats(data) {
    const candidates = data.candidates;
    const total = candidates.length;
    
    const strong = candidates.filter(c => c.job_match.overall_score >= 85).length;
    const good = candidates.filter(c => c.job_match.overall_score >= 70 && c.job_match.overall_score < 85).length;
    const avgScore = Math.round(candidates.reduce((sum, c) => sum + c.job_match.overall_score, 0) / total);

    // Animate numbers
    animateNumber(DOM.totalCandidates, 0, total, 1500);
    animateNumber(DOM.strongMatches, 0, strong, 1500);
    animateNumber(DOM.goodMatches, 0, good, 1500);
    
    setTimeout(() => {
        DOM.avgScore.textContent = avgScore + '%';
    }, 1500);
    
    DOM.strongPercent.textContent = Math.round(strong / total * 100) + '%';
    DOM.goodPercent.textContent = Math.round(good / total * 100) + '%';
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.round(start + (end - start) * easeProgress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function renderCharts(data) {
    renderScoreChart(data);
    renderExperienceChart(data);
    renderSkillsBreakdown(data);
}

function renderScoreChart(data) {
    const candidates = data.candidates;
    
    const excellent = candidates.filter(c => c.job_match.overall_score >= 85).length;
    const good = candidates.filter(c => c.job_match.overall_score >= 70 && c.job_match.overall_score < 85).length;
    const average = candidates.filter(c => c.job_match.overall_score >= 55 && c.job_match.overall_score < 70).length;
    const poor = candidates.filter(c => c.job_match.overall_score < 55).length;

    const ctx = DOM.scoreChart.getContext('2d');
    
    // Destroy existing chart if exists
    if (window.scoreChartInstance) {
        window.scoreChartInstance.destroy();
    }

    window.scoreChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent (85%+)', 'Good (70-84%)', 'Average (55-69%)', 'Below Average (<55%)'],
            datasets: [{
                data: [excellent, good, average, poor],
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        }
    });

    // Update legend
    document.getElementById('scoreLegend').innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background:#22c55e"></span>Excellent: ${excellent}</div>
        <div class="legend-item"><span class="legend-color" style="background:#3b82f6"></span>Good: ${good}</div>
        <div class="legend-item"><span class="legend-color" style="background:#f59e0b"></span>Average: ${average}</div>
        <div class="legend-item"><span class="legend-color" style="background:#ef4444"></span>Below: ${poor}</div>
    `;
}

function renderExperienceChart(data) {
    const candidates = data.candidates;
    
    const expRanges = {
        '0-2 years': 0,
        '3-5 years': 0,
        '6-10 years': 0,
        '10+ years': 0
    };

    candidates.forEach(c => {
        const exp = c.candidate_profile.total_experience_years;
        if (exp <= 2) expRanges['0-2 years']++;
        else if (exp <= 5) expRanges['3-5 years']++;
        else if (exp <= 10) expRanges['6-10 years']++;
        else expRanges['10+ years']++;
    });

    const ctx = DOM.experienceChart.getContext('2d');
    
    if (window.experienceChartInstance) {
        window.experienceChartInstance.destroy();
    }

    window.experienceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(expRanges),
            datasets: [{
                data: Object.values(expRanges),
                backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#71717a' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#71717a' }
                }
            }
        }
    });
}

function renderSkillsBreakdown(data) {
    const skillCounts = {};
    
    // Count skills from all candidates
    data.candidates.forEach(c => {
        // Get skills from multiple possible sources
        const candidateSkills = c.skills || [];
        const matchedSkills = c.job_match?.matched_skills || [];
        const additionalSkills = c.job_match?.additional_skills || [];
        
        // Combine all skills
        const allSkills = [...new Set([...candidateSkills, ...matchedSkills, ...additionalSkills])];
        
        allSkills.forEach(skill => {
            if (skill && typeof skill === 'string') {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            }
        });
    });

    const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    if (sortedSkills.length === 0) {
        DOM.skillsBreakdown.innerHTML = `
            <div class="no-skills-message">
                <i class="fas fa-info-circle"></i>
                <span>No skills data available</span>
            </div>
        `;
        return;
    }
    
    const maxCount = sortedSkills[0]?.[1] || 1;
    const totalCandidates = data.candidates.length;

    DOM.skillsBreakdown.innerHTML = sortedSkills.map(([skill, count]) => {
        const percentage = Math.round(count / maxCount * 100);
        const candidatePercentage = Math.round((count / totalCandidates) * 100);
        return `
            <div class="skill-bar">
                <div class="skill-bar-header">
                    <span class="skill-bar-name">${escapeHtml(skill)}</span>
                    <span class="skill-bar-value">${count} (${candidatePercentage}%)</span>
                </div>
                <div class="skill-bar-track">
                    <div class="skill-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Candidates Rendering
// ============================================

function renderCandidates() {
    const candidates = AppState.filteredResults;
    const start = (AppState.currentPage - 1) * AppState.perPage;
    const end = start + AppState.perPage;
    const paginated = candidates.slice(start, end);

    // Update pagination info
    DOM.showingFrom.textContent = start + 1;
    DOM.showingTo.textContent = Math.min(end, candidates.length);
    DOM.totalShowing.textContent = candidates.length;

    // Render based on view
    if (AppState.currentView === 'cards') {
        DOM.candidatesGrid.innerHTML = paginated.map((c, i) => renderCandidateCard(c, start + i + 1)).join('');
    } else if (AppState.currentView === 'list') {
        DOM.candidatesList.innerHTML = paginated.map((c, i) => renderCandidateListItem(c, start + i + 1)).join('');
    } else {
        DOM.candidatesTableBody.innerHTML = paginated.map((c, i) => renderCandidateTableRow(c, start + i + 1)).join('');
    }

    // Update pagination
    renderPagination();

    // Add click handlers
    document.querySelectorAll('[data-candidate-id]').forEach(el => {
        el.addEventListener('click', () => openCandidateModal(el.dataset.candidateId));
    });
}

function renderCandidateCard(candidate, rank) {
    const c = candidate;
    const score = c.job_match.overall_score;
    const scoreClass = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 55 ? 'average' : 'poor';
    const statusClass = c.evaluation.status || (score >= 85 ? 'strong' : score >= 70 ? 'good' : score >= 55 ? 'review' : 'rejected');
    const statusText = statusClass === 'strong' ? 'Strong Match' : statusClass === 'good' ? 'Good Match' : statusClass === 'review' ? 'Needs Review' : 'Not Recommended';
    const initials = c.candidate_profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const circumference = 2 * Math.PI * 15.9155;
    const offset = circumference - (score / 100) * circumference;

    return `
        <div class="candidate-card" data-candidate-id="${c.candidate_profile.candidate_id}">
            <div class="candidate-card-header">
                <div class="candidate-avatar">${initials}</div>
                <div class="candidate-info">
                    <div class="candidate-name">#${rank} ${c.candidate_profile.name}</div>
                    <div class="candidate-position">${c.candidate_profile.current_position || 'Not specified'}</div>
                    <div class="candidate-meta">
                        <span><i class="fas fa-briefcase"></i> ${c.candidate_profile.total_experience_years} yrs</span>
                        <span><i class="fas fa-graduation-cap"></i> ${c.education.highest_degree}</span>
                    </div>
                </div>
                <div class="candidate-score">
                    <svg viewBox="0 0 36 36">
                        <circle class="score-bg" cx="18" cy="18" r="15.9155"/>
                        <circle class="score-fill ${scoreClass}" cx="18" cy="18" r="15.9155"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                            transform="rotate(-90 18 18)"/>
                    </svg>
                    <div class="score-text">
                        <span class="score-value">${score}%</span>
                        <span class="score-label">Match</span>
                    </div>
                </div>
            </div>
            <div class="candidate-skills">
                ${c.job_match.matched_skills.slice(0, 4).map(s => `<span class="candidate-skill matched">${s}</span>`).join('')}
                ${c.job_match.missing_skills.slice(0, 2).map(s => `<span class="candidate-skill missing">${s}</span>`).join('')}
                ${c.skills.length > 6 ? `<span class="candidate-skill">+${c.skills.length - 6} more</span>` : ''}
            </div>
            <div class="candidate-card-footer">
                <span class="candidate-status ${statusClass}">
                    <i class="fas fa-${statusClass === 'strong' ? 'trophy' : statusClass === 'good' ? 'star' : statusClass === 'review' ? 'clock' : 'times-circle'}"></i>
                    ${statusText}
                </span>
                <div class="candidate-actions">
                    <button class="candidate-action" title="View Profile"><i class="fas fa-eye"></i></button>
                    <button class="candidate-action" title="Shortlist"><i class="fas fa-bookmark"></i></button>
                    <button class="candidate-action" title="Download"><i class="fas fa-download"></i></button>
                </div>
            </div>
        </div>
    `;
}

function renderCandidateListItem(candidate, rank) {
    const c = candidate;
    const score = c.job_match.overall_score;
    const statusClass = c.evaluation.status || (score >= 85 ? 'strong' : score >= 70 ? 'good' : score >= 55 ? 'review' : 'rejected');
    const initials = c.candidate_profile.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return `
        <div class="candidate-list-item" data-candidate-id="${c.candidate_profile.candidate_id}">
            <span style="width: 40px; text-align: center; font-weight: 600; color: var(--text-muted);">#${rank}</span>
            <div class="candidate-avatar" style="width: 40px; height: 40px; font-size: 0.875rem;">${initials}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${c.candidate_profile.name}</div>
                <div style="font-size: 0.813rem; color: var(--text-muted);">${c.candidate_profile.current_position || 'Not specified'}</div>
            </div>
            <div style="width: 100px; text-align: center;">${c.candidate_profile.total_experience_years} years</div>
            <div style="width: 100px; text-align: center;">${c.job_match.skill_match_score}%</div>
            <div style="width: 80px; text-align: center; font-weight: 700; color: var(--primary-400);">${score}%</div>
            <span class="candidate-status ${statusClass}" style="width: 120px;">${statusClass}</span>
        </div>
    `;
}

function renderCandidateTableRow(candidate, rank) {
    const c = candidate;
    const score = c.job_match.overall_score;
    const statusClass = c.evaluation.status || (score >= 85 ? 'strong' : score >= 70 ? 'good' : score >= 55 ? 'review' : 'rejected');

    return `
        <tr data-candidate-id="${c.candidate_profile.candidate_id}">
            <td><input type="checkbox" class="candidate-checkbox"></td>
            <td>#${rank}</td>
            <td>
                <div style="font-weight: 500;">${c.candidate_profile.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${c.candidate_profile.email}</div>
            </td>
            <td>${c.candidate_profile.total_experience_years} years</td>
            <td>${c.job_match.skill_match_score}%</td>
            <td style="font-weight: 700; color: var(--primary-400);">${score}%</td>
            <td><span class="candidate-status ${statusClass}">${statusClass}</span></td>
            <td>
                <button class="candidate-action"><i class="fas fa-eye"></i></button>
                <button class="candidate-action"><i class="fas fa-download"></i></button>
            </td>
        </tr>
    `;
}

function renderPagination() {
    const totalPages = Math.ceil(AppState.filteredResults.length / AppState.perPage);
    
    DOM.prevPage.disabled = AppState.currentPage === 1;
    DOM.nextPage.disabled = AppState.currentPage === totalPages;

    let pages = [];
    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        if (AppState.currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (AppState.currentPage >= totalPages - 3) {
            pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', AppState.currentPage - 1, AppState.currentPage, AppState.currentPage + 1, '...', totalPages];
        }
    }

    DOM.pageNumbers.innerHTML = pages.map(page => {
        if (page === '...') {
            return '<span class="page-number" style="cursor: default;">...</span>';
        }
        return `<button class="page-number ${page === AppState.currentPage ? 'active' : ''}" onclick="goToPage(${page})">${page}</button>`;
    }).join('');
}

function changePage(delta) {
    const totalPages = Math.ceil(AppState.filteredResults.length / AppState.perPage);
    const newPage = AppState.currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        AppState.currentPage = newPage;
        renderCandidates();
        window.scrollTo({ top: document.querySelector('.candidates-section').offsetTop - 100, behavior: 'smooth' });
    }
}

function goToPage(page) {
    AppState.currentPage = page;
    renderCandidates();
    window.scrollTo({ top: document.querySelector('.candidates-section').offsetTop - 100, behavior: 'smooth' });
}

// ============================================
// View, Filter, and Sort
// ============================================

function switchView(view) {
    AppState.currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    const container = document.querySelector('.candidates-container');
    container.setAttribute('data-view', view);

    DOM.candidatesGrid.style.display = view === 'cards' ? 'grid' : 'none';
    DOM.candidatesList.style.display = view === 'list' ? 'block' : 'none';
    document.getElementById('candidatesTableWrapper').style.display = view === 'table' ? 'block' : 'none';

    renderCandidates();
}

function filterCandidates(filter) {
    AppState.currentFilter = filter;
    
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.filter === filter);
    });

    if (filter === 'all') {
        AppState.filteredResults = AppState.currentResults.candidates;
    } else {
        AppState.filteredResults = AppState.currentResults.candidates.filter(c => {
            const score = c.job_match.overall_score;
            switch (filter) {
                case 'strong': return score >= 85;
                case 'good': return score >= 70 && score < 85;
                case 'review': return score >= 55 && score < 70;
                case 'rejected': return score < 55;
                default: return true;
            }
        });
    }

    AppState.currentPage = 1;
    renderCandidates();
}

function sortCandidates(sort) {
    AppState.currentSort = sort;
    
    const [field, direction] = sort.split('-');
    
    AppState.filteredResults.sort((a, b) => {
        let valA, valB;
        
        switch (field) {
            case 'score':
                valA = a.job_match.overall_score;
                valB = b.job_match.overall_score;
                break;
            case 'name':
                valA = a.candidate_profile.name.toLowerCase();
                valB = b.candidate_profile.name.toLowerCase();
                break;
            case 'experience':
                valA = a.candidate_profile.total_experience_years;
                valB = b.candidate_profile.total_experience_years;
                break;
            default:
                return 0;
        }

        if (direction === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });

    renderCandidates();
}

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
        AppState.filteredResults = AppState.currentResults?.candidates || [];
    } else {
        AppState.filteredResults = (AppState.currentResults?.candidates || []).filter(c => {
            return c.candidate_profile.name.toLowerCase().includes(query) ||
                   c.candidate_profile.email.toLowerCase().includes(query) ||
                   c.candidate_profile.current_position?.toLowerCase().includes(query) ||
                   c.skills.some(s => s.toLowerCase().includes(query));
        });
    }

    AppState.currentPage = 1;
    renderCandidates();
}

// ============================================
// Modal
// ============================================

function openCandidateModal(candidateId) {
    const candidate = AppState.currentResults.candidates.find(
        c => c.candidate_profile.candidate_id === candidateId
    );
    
    if (!candidate) return;

    const c = candidate;
    const score = c.job_match.overall_score;
    const initials = c.candidate_profile.name.split(' ').map(n => n[0]).join('').toUpperCase();

    DOM.modalBody.innerHTML = `
        <div class="modal-profile">
            <div class="profile-header">
                <div class="profile-avatar">${initials}</div>
                <div class="profile-info">
                    <h3>${c.candidate_profile.name}</h3>
                    <p>${c.candidate_profile.current_position || 'Position not specified'}</p>
                    <div class="profile-contact">
                        <span><i class="fas fa-envelope"></i> ${c.candidate_profile.email}</span>
                        <span><i class="fas fa-phone"></i> ${c.candidate_profile.phone}</span>
                    </div>
                </div>
                <div class="profile-score">
                    <div class="big-score">${score}%</div>
                    <div class="score-label">Match Score</div>
                </div>
            </div>

            <div class="profile-sections">
                <div class="profile-section">
                    <h4><i class="fas fa-chart-bar"></i> Match Analysis</h4>
                    <div class="score-breakdown">
                        <div class="score-item">
                            <span>Skills Match</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${c.job_match.skill_match_score}%"></div>
                            </div>
                            <span>${c.job_match.skill_match_score}%</span>
                        </div>
                        <div class="score-item">
                            <span>Experience Match</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${c.job_match.experience_match_score}%"></div>
                            </div>
                            <span>${c.job_match.experience_match_score}%</span>
                        </div>
                        <div class="score-item">
                            <span>Education Match</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${c.job_match.education_match_score}%"></div>
                            </div>
                            <span>${c.job_match.education_match_score}%</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-code"></i> Skills</h4>
                    <div class="skills-grid">
                        ${c.job_match.matched_skills.map(s => `<span class="skill-badge matched"><i class="fas fa-check"></i> ${s}</span>`).join('')}
                        ${c.job_match.missing_skills.map(s => `<span class="skill-badge missing"><i class="fas fa-times"></i> ${s}</span>`).join('')}
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-briefcase"></i> Work Experience</h4>
                    <div class="experience-list">
                        ${c.work_experience.map(exp => `
                            <div class="experience-item">
                                <div class="exp-company">${exp.company}</div>
                                <div class="exp-position">${exp.position}</div>
                                <div class="exp-duration">${exp.duration}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-graduation-cap"></i> Education</h4>
                    <div class="education-info">
                        <strong>${c.education.highest_degree}</strong>
                        <span>${c.education.university || ''}</span>
                    </div>
                </div>

                ${c.certifications.length > 0 ? `
                <div class="profile-section">
                    <h4><i class="fas fa-certificate"></i> Certifications</h4>
                    <div class="cert-list">
                        ${c.certifications.map(cert => `<span class="cert-badge">${cert}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="profile-section">
                    <h4><i class="fas fa-star"></i> Evaluation</h4>
                    <div class="evaluation-grid">
                        <div class="eval-card strengths">
                            <h5>Strengths</h5>
                            <ul>${c.evaluation.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                        </div>
                        ${c.evaluation.weaknesses.length > 0 ? `
                        <div class="eval-card weaknesses">
                            <h5>Areas to Probe</h5>
                            <ul>${c.evaluation.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-question-circle"></i> Suggested Interview Questions</h4>
                    <ol class="questions-list">
                        ${c.next_steps.interview_questions.map(q => `<li>${q}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    addModalStyles();

    DOM.candidateModal.classList.add('active');
}

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .profile-header {
            display: flex;
            align-items: center;
            gap: var(--space-6);
            padding-bottom: var(--space-6);
            border-bottom: 1px solid var(--border-default);
            margin-bottom: var(--space-6);
        }
        .profile-avatar {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-primary);
            border-radius: var(--radius-full);
            font-size: 2rem;
            font-weight: 700;
            color: white;
        }
        .profile-info { flex: 1; }
        .profile-info h3 { font-size: 1.5rem; margin-bottom: var(--space-1); }
        .profile-info p { color: var(--text-secondary); margin-bottom: var(--space-2); }
        .profile-contact { display: flex; gap: var(--space-4); font-size: 0.875rem; color: var(--text-muted); }
        .profile-contact i { margin-right: var(--space-1); }
        .profile-score { text-align: center; }
        .big-score { font-size: 3rem; font-weight: 800; color: var(--primary-400); }
        .profile-section { margin-bottom: var(--space-6); }
        .profile-section h4 { display: flex; align-items: center; gap: var(--space-2); font-size: 1rem; margin-bottom: var(--space-4); color: var(--text-primary); }
        .profile-section h4 i { color: var(--primary-400); }
        .score-breakdown { display: flex; flex-direction: column; gap: var(--space-3); }
        .score-item { display: flex; align-items: center; gap: var(--space-3); }
        .score-item span:first-child { width: 140px; font-size: 0.875rem; }
        .score-item span:last-child { width: 50px; font-size: 0.875rem; font-weight: 600; }
        .score-bar { flex: 1; height: 8px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; }
        .score-fill { height: 100%; background: var(--gradient-primary); border-radius: var(--radius-full); }
        .skills-grid { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .skill-badge { display: inline-flex; align-items: center; gap: var(--space-1); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.813rem; }
        .skill-badge.matched { background: rgba(34, 197, 94, 0.15); color: var(--success-400); }
        .skill-badge.missing { background: rgba(239, 68, 68, 0.15); color: var(--danger-400); }
        .experience-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .experience-item { padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-lg); }
        .exp-company { font-weight: 600; }
        .exp-position { font-size: 0.875rem; color: var(--text-secondary); }
        .exp-duration { font-size: 0.75rem; color: var(--text-muted); }
        .education-info { padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-lg); }
        .education-info strong { display: block; margin-bottom: var(--space-1); }
        .education-info span { font-size: 0.875rem; color: var(--text-secondary); }
        .cert-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .cert-badge { padding: var(--space-2) var(--space-3); background: rgba(99, 102, 241, 0.15); color: var(--primary-400); border-radius: var(--radius-md); font-size: 0.813rem; }
        .evaluation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .eval-card { padding: var(--space-4); background: var(--bg-elevated); border-radius: var(--radius-lg); }
        .eval-card h5 { margin-bottom: var(--space-3); font-size: 0.875rem; }
        .eval-card.strengths h5 { color: var(--success-400); }
        .eval-card.weaknesses h5 { color: var(--warning-400); }
        .eval-card ul { list-style: none; font-size: 0.875rem; color: var(--text-secondary); }
        .eval-card li { padding: var(--space-1) 0; }
        .eval-card li::before { content: "•"; margin-right: var(--space-2); }
        .questions-list { padding-left: var(--space-5); font-size: 0.875rem; color: var(--text-secondary); }
        .questions-list li { margin-bottom: var(--space-2); }
    `;
    document.head.appendChild(style);
}

function closeModal() {
    DOM.candidateModal.classList.remove('active');
}

// ============================================
// Export Functions
// ============================================

function handleExport() {
    const format = document.querySelector('.export-option.selected')?.dataset.format || 'json';
    
    switch (format) {
        case 'json':
            downloadJson();
            break;
        case 'csv':
            downloadCsv();
            break;
        case 'pdf':
            showToast('PDF export coming soon!', 'info');
            break;
        case 'excel':
            showToast('Excel export coming soon!', 'info');
            break;
    }
    
    DOM.exportModal.classList.remove('active');
}

function copyJsonToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(AppState.currentResults, null, 2));
    showToast('JSON copied to clipboard!', 'success');
}

function downloadJson() {
    const blob = new Blob([JSON.stringify(AppState.currentResults, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'resume_analysis.json');
}

function downloadCsv() {
    const candidates = AppState.currentResults.candidates;
    const headers = ['Rank', 'Name', 'Email', 'Phone', 'Position', 'Experience', 'Education', 'Skills Match', 'Overall Score', 'Recommendation'];
    
    const rows = candidates.map((c, i) => [
        i + 1,
        c.candidate_profile.name,
        c.candidate_profile.email,
        c.candidate_profile.phone,
        c.candidate_profile.current_position || '',
        c.candidate_profile.total_experience_years,
        c.education.highest_degree,
        c.job_match.skill_match_score + '%',
        c.job_match.overall_score + '%',
        c.evaluation.recommendation
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, 'resume_analysis.csv');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
}

// ============================================
// Loading & Toast
// ============================================

function showLoading(show, totalResumes = 100) {
    AppState.isLoading = show;
    DOM.loadingOverlay.classList.toggle('active', show);
    
    if (show) {
        // Reset counters
        DOM.processedCount.textContent = '0';
        DOM.remainingCount.textContent = totalResumes.toString();
        DOM.matchesFound.textContent = '0';
        DOM.loadingProgress.style.width = '0%';
        DOM.progressText.textContent = '0%';
    }
}

function updateLoadingProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    const matches = Math.round(current * 0.35); // ~35% match rate
    
    // Animate the counters
    animateCounter(DOM.processedCount, current);
    animateCounter(DOM.remainingCount, total - current);
    animateCounter(DOM.matchesFound, matches);
    
    DOM.loadingProgress.style.width = `${percentage}%`;
    DOM.progressText.textContent = `${percentage}%`;
    
    const messages = [
        'Initializing AI engine...',
        'Scanning resume documents...',
        'Extracting skills and experience...',
        'Matching with job requirements...',
        'Calculating compatibility scores...',
        'Generating recommendations...'
    ];
    const messageIndex = Math.min(Math.floor(percentage / 17), messages.length - 1);
    DOM.loadingStatus.textContent = messages[messageIndex];
}

function animateCounter(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== targetValue) {
        element.textContent = targetValue;
        element.classList.add('counter-pulse');
        setTimeout(() => element.classList.remove('counter-pulse'), 200);
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ============================================
// Theme
// ============================================

function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    AppState.theme = savedTheme;
    updateThemeIcon();
}

function toggleTheme() {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    AppState.theme = newTheme;
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============================================
// Particles
// ============================================

function createParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * -20}s;
        `;
        container.appendChild(particle);
    }
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes toastSlideOut {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Utility Functions
// ============================================

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make goToPage globally available
window.goToPage = goToPage;
window.removeFile = removeFile;
// ============================================
// Navigation & Sections
// ============================================

function switchSection(sectionName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.section === sectionName);
    });

    // Hide all sections
    document.getElementById('heroSection')?.style.setProperty('display', 'none');
    document.getElementById('uploadSection')?.style.setProperty('display', 'none');
    document.getElementById('resultsDashboard')?.style.setProperty('display', 'none');
    document.getElementById('analyticsPage')?.style.setProperty('display', 'none');
    document.getElementById('candidatesPage')?.style.setProperty('display', 'none');
    document.getElementById('reportsPage')?.style.setProperty('display', 'none');

    // Show selected section
    switch(sectionName) {
        case 'dashboard':
            document.getElementById('heroSection')?.style.setProperty('display', 'flex');
            document.getElementById('uploadSection')?.style.setProperty('display', 'grid');
            if (AppState.currentResults) {
                document.getElementById('resultsDashboard')?.style.setProperty('display', 'block');
            }
            break;
        case 'analytics':
            document.getElementById('analyticsPage')?.style.setProperty('display', 'block');
            updateAnalyticsPage();
            break;
        case 'candidates':
            document.getElementById('candidatesPage')?.style.setProperty('display', 'block');
            updateCandidatesPage();
            break;
        case 'reports':
            document.getElementById('reportsPage')?.style.setProperty('display', 'block');
            break;
    }
}

function updateAnalyticsPage() {
    const results = AppState.currentResults;
    if (!results || !results.candidates) {
        document.getElementById('analyticsTotalCandidates').textContent = '0';
        document.getElementById('analyticsQualified').textContent = '0';
        document.getElementById('analyticsAvgTime').textContent = '0s';
        document.getElementById('analyticsMatchRate').textContent = '0%';
        return;
    }

    const candidates = results.candidates;
    const totalCandidates = candidates.length;
    const qualified = candidates.filter(c => c.overall_score >= 70).length;
    const avgScore = totalCandidates > 0 
        ? Math.round(candidates.reduce((sum, c) => sum + c.overall_score, 0) / totalCandidates) 
        : 0;

    document.getElementById('analyticsTotalCandidates').textContent = totalCandidates;
    document.getElementById('analyticsQualified').textContent = qualified;
    document.getElementById('analyticsAvgTime').textContent = '0.3s';
    document.getElementById('analyticsMatchRate').textContent = avgScore + '%';

    // Update funnel
    document.getElementById('funnelApplied').textContent = totalCandidates;
    document.getElementById('funnelScreened').textContent = Math.round(totalCandidates * 0.7);
    document.getElementById('funnelShortlisted').textContent = Math.round(totalCandidates * 0.3);
    document.getElementById('funnelHired').textContent = Math.round(totalCandidates * 0.1);

    // Create/update analytics charts
    createAnalyticsCharts(candidates);
}

function createAnalyticsCharts(candidates) {
    // Score Distribution Chart
    const scoreCtx = document.getElementById('analyticsScoreChart')?.getContext('2d');
    if (scoreCtx) {
        const scoreBuckets = [0, 0, 0, 0, 0];
        candidates.forEach(c => {
            if (c.overall_score >= 90) scoreBuckets[4]++;
            else if (c.overall_score >= 80) scoreBuckets[3]++;
            else if (c.overall_score >= 70) scoreBuckets[2]++;
            else if (c.overall_score >= 60) scoreBuckets[1]++;
            else scoreBuckets[0]++;
        });

        if (window.analyticsScoreChart) window.analyticsScoreChart.destroy();
        window.analyticsScoreChart = new Chart(scoreCtx, {
            type: 'bar',
            data: {
                labels: ['< 60%', '60-69%', '70-79%', '80-89%', '90-100%'],
                datasets: [{
                    label: 'Candidates',
                    data: scoreBuckets,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(99, 102, 241, 0.7)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Experience Distribution Chart
    const expCtx = document.getElementById('analyticsExpChart')?.getContext('2d');
    if (expCtx) {
        const expBuckets = { '0-2': 0, '3-5': 0, '6-10': 0, '10+': 0 };
        candidates.forEach(c => {
            const exp = c.experience_years || 0;
            if (exp <= 2) expBuckets['0-2']++;
            else if (exp <= 5) expBuckets['3-5']++;
            else if (exp <= 10) expBuckets['6-10']++;
            else expBuckets['10+']++;
        });

        if (window.analyticsExpChart) window.analyticsExpChart.destroy();
        window.analyticsExpChart = new Chart(expCtx, {
            type: 'doughnut',
            data: {
                labels: ['0-2 years', '3-5 years', '6-10 years', '10+ years'],
                datasets: [{
                    data: Object.values(expBuckets),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

function updateCandidatesPage() {
    const results = AppState.currentResults;
    const tbody = document.getElementById('candidatesFullTableBody');
    if (!tbody) return;

    if (!results || !results.candidates || results.candidates.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No candidates analyzed yet</p>
                        <span>Run an analysis to see candidates here</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    renderCandidatesTable(results.candidates);
}

function renderCandidatesTable(candidates) {
    const tbody = document.getElementById('candidatesFullTableBody');
    if (!tbody) return;

    tbody.innerHTML = candidates.map((c, i) => {
        const status = c.overall_score >= 85 ? 'strong' : c.overall_score >= 70 ? 'good' : c.overall_score >= 50 ? 'review' : 'rejected';
        const statusLabels = { strong: 'Strong Match', good: 'Good Match', review: 'Needs Review', rejected: 'Not Recommended' };
        const skills = (c.skills || []).slice(0, 3).join(', ');

        return `
            <tr data-candidate-id="${c.id || i}">
                <td><input type="checkbox" class="candidate-checkbox"></td>
                <td>
                    <div class="candidate-cell">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff&size=40" alt="${c.name}">
                        <div>
                            <strong>${c.name}</strong>
                            <span>${c.email || 'N/A'}</span>
                        </div>
                    </div>
                </td>
                <td>${c.current_position || 'N/A'}</td>
                <td>${c.experience_years || 0} years</td>
                <td><span class="skills-preview">${skills || 'N/A'}</span></td>
                <td><span class="score-badge ${status}">${c.overall_score}%</span></td>
                <td><span class="status-badge ${status}">${statusLabels[status]}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" onclick="viewCandidate('${c.id || i}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="shortlistCandidate('${c.id || i}')" title="Shortlist"><i class="fas fa-bookmark"></i></button>
                        <button class="action-btn" onclick="emailCandidate('${c.email}')" title="Email"><i class="fas fa-envelope"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Update pagination info
    document.getElementById('candidatesShowingFrom').textContent = '1';
    document.getElementById('candidatesShowingTo').textContent = Math.min(50, candidates.length);
    document.getElementById('candidatesTotal').textContent = candidates.length;
}

function filterCandidatesPage() {
    const search = document.getElementById('candidateSearch')?.value.toLowerCase() || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const exp = document.getElementById('expFilter')?.value || '';
    const score = document.getElementById('scoreFilter')?.value || '';

    if (!AppState.currentResults?.candidates) return;

    let filtered = [...AppState.currentResults.candidates];

    if (search) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(search) ||
            (c.skills || []).some(s => s.toLowerCase().includes(search)) ||
            (c.current_company || '').toLowerCase().includes(search)
        );
    }

    if (status) {
        filtered = filtered.filter(c => {
            const s = c.overall_score;
            if (status === 'strong') return s >= 85;
            if (status === 'good') return s >= 70 && s < 85;
            if (status === 'review') return s >= 50 && s < 70;
            if (status === 'rejected') return s < 50;
            return true;
        });
    }

    if (exp) {
        filtered = filtered.filter(c => {
            const e = c.experience_years || 0;
            if (exp === '0-2') return e <= 2;
            if (exp === '3-5') return e >= 3 && e <= 5;
            if (exp === '6-10') return e >= 6 && e <= 10;
            if (exp === '10+') return e > 10;
            return true;
        });
    }

    if (score) {
        filtered = filtered.filter(c => {
            const s = c.overall_score;
            if (score === '90-100') return s >= 90;
            if (score === '80-89') return s >= 80 && s < 90;
            if (score === '70-79') return s >= 70 && s < 80;
            if (score === 'below-70') return s < 70;
            return true;
        });
    }

    renderCandidatesTable(filtered);
}

function toggleBulkSelect() {
    const checkboxes = document.querySelectorAll('.candidate-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
}

function exportSelectedCandidates() {
    const selected = document.querySelectorAll('.candidate-checkbox:checked');
    if (selected.length === 0) {
        showToast('Please select candidates to export', 'warning');
        return;
    }
    showToast(`Exporting ${selected.length} candidates...`, 'info');
    // Trigger export
    setTimeout(() => showToast('Export complete!', 'success'), 1000);
}

// ============================================
// Auth Functions
// ============================================

let currentUser = JSON.parse(localStorage.getItem('resumeai_user') || 'null');

function openAuthModal(mode) {
    document.getElementById('authModal')?.classList.add('active');
    switchAuthForm(mode);
}

function closeAuthModal() {
    document.getElementById('authModal')?.classList.remove('active');
}

function switchAuthForm(mode) {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    if (mode === 'signin') {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
    } else {
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login (in production, call your backend)
    if (email && password) {
        const user = {
            email: email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff`
        };
        
        localStorage.setItem('resumeai_user', JSON.stringify(user));
        currentUser = user;
        updateAuthUI();
        closeAuthModal();
        showToast('Welcome back! Signed in successfully.', 'success');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    // Simulate registration
    const user = {
        email: email,
        name: `${firstName} ${lastName}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=6366f1&color=fff`
    };
    
    localStorage.setItem('resumeai_user', JSON.stringify(user));
    currentUser = user;
    updateAuthUI();
    closeAuthModal();
    showToast('Account created successfully! Welcome to ResumeAI Pro.', 'success');
}

function handleSignOut(e) {
    e.preventDefault();
    localStorage.removeItem('resumeai_user');
    currentUser = null;
    updateAuthUI();
    showToast('Signed out successfully.', 'info');
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');

    if (currentUser) {
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        
        // Update avatar and info
        const avatarImg = userProfile.querySelector('.user-avatar img');
        const dropdownImg = userProfile.querySelector('.dropdown-header img');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (avatarImg) avatarImg.src = currentUser.avatar;
        if (dropdownImg) dropdownImg.src = currentUser.avatar;
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strength = document.getElementById('passwordStrength');
    
    if (!strength) return;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    strength.className = 'password-strength';
    if (score >= 4) strength.classList.add('strong');
    else if (score >= 2) strength.classList.add('medium');
    else if (score >= 1) strength.classList.add('weak');
}

// ============================================
// Reports Functions
// ============================================

function generateQuickReport(reportType) {
    if (!AppState.currentResults?.candidates) {
        showToast('Please analyze some resumes first', 'warning');
        return;
    }

    showToast(`Generating ${reportType} report...`, 'info');

    setTimeout(() => {
        const candidates = AppState.currentResults.candidates;
        let reportData;

        switch(reportType) {
            case 'summary':
                reportData = {
                    type: 'Executive Summary',
                    total: candidates.length,
                    qualified: candidates.filter(c => c.overall_score >= 70).length,
                    avgScore: Math.round(candidates.reduce((s, c) => s + c.overall_score, 0) / candidates.length)
                };
                break;
            case 'top10':
                reportData = {
                    type: 'Top 10 Candidates',
                    candidates: [...candidates].sort((a, b) => b.overall_score - a.overall_score).slice(0, 10)
                };
                break;
            case 'skills':
                const skillCount = {};
                candidates.forEach(c => (c.skills || []).forEach(s => skillCount[s] = (skillCount[s] || 0) + 1));
                reportData = {
                    type: 'Skills Analysis',
                    topSkills: Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
                };
                break;
            default:
                reportData = { type: reportType };
        }

        // Download as JSON
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${reportType}_${Date.now()}.json`;
        a.click();

        addReportToHistory(reportType, candidates.length);
        showToast('Report generated and downloaded!', 'success');
    }, 500);
}

function generateCustomReport() {
    const reportName = document.getElementById('customReportName')?.value || 'Custom Report';
    if (!AppState.currentResults?.candidates) {
        showToast('Please analyze some resumes first', 'warning');
        return;
    }

    showToast(`Generating "${reportName}"...`, 'info');
    
    setTimeout(() => {
        const format = document.querySelector('.format-btn.active')?.dataset.format || 'json';
        addReportToHistory(reportName, AppState.currentResults.candidates.length);
        showToast(`${reportName} generated successfully!`, 'success');
    }, 1000);
}

function addReportToHistory(name, candidateCount) {
    const tbody = document.getElementById('reportHistoryBody');
    if (!tbody) return;

    // Clear empty state if exists
    if (tbody.querySelector('.empty-cell')) {
        tbody.innerHTML = '';
    }

    const now = new Date();
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>PDF</td>
        <td>${now.toLocaleDateString()} ${now.toLocaleTimeString()}</td>
        <td>${candidateCount}</td>
        <td>
            <button class="btn-sm" onclick="showToast('Downloading...', 'info')"><i class="fas fa-download"></i></button>
            <button class="btn-sm" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button>
        </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
}

// Global functions
window.viewCandidate = function(id) {
    const candidate = AppState.currentResults?.candidates?.find(c => c.id === id || c.id === parseInt(id));
    if (candidate) {
        showCandidateModal(candidate);
    }
};

window.shortlistCandidate = function(id) {
    showToast('Candidate shortlisted!', 'success');
};

window.emailCandidate = function(email) {
    if (email && email !== 'N/A') {
        window.open(`mailto:${email}`, '_blank');
    } else {
        showToast('No email available for this candidate', 'warning');
    }
};

// Initialize auth state on load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});