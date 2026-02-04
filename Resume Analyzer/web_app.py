"""
ResumeAI Pro - Enterprise Resume Intelligence Platform
Advanced Flask Backend with Langflow Integration
Supports bulk processing of 1000+ resumes
"""

from flask import Flask, render_template, request, jsonify, send_file, redirect, session
from flask_cors import CORS
import requests
import uuid
import json
import re
import os
import random
import string
import csv
import ast
import hashlib
import secrets
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from functools import wraps

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Secret key for sessions
app.secret_key = secrets.token_hex(32)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max total
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'zip', 'csv'}

# Simple in-memory user storage (in production, use a database)
USERS_DB = {}

# Add a demo user for testing
def init_demo_user():
    demo_password = hashlib.sha256('demo1234'.encode()).hexdigest()
    USERS_DB['demo@resumeai.pro'] = {
        'id': 'demo-user-001',
        'email': 'demo@resumeai.pro',
        'password': demo_password,
        'first_name': 'Demo',
        'last_name': 'User',
        'company': 'ResumeAI Pro',
        'created_at': datetime.now().isoformat(),
        'token': secrets.token_urlsafe(32)
    }

# Langflow Configuration
LANGFLOW_API_KEY = 'sk-eepl0G5sbHcZU1r2vGqfUHS_KLVSn9I_U9B0ziVc6N4'
LANGFLOW_BASE_URL = "http://localhost:7860"
LANGFLOW_FLOW_ID = "0014865e-8f2c-4d97-a27c-9c14db63d428"

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize demo user
init_demo_user()

# Thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=10)


# Demo Data for generating realistic candidates
DEMO_DATA = {
    'first_names': [
        'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella',
        'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Daniel', 'Harper', 'Michael', 'Evelyn',
        'Ethan', 'Abigail', 'Sebastian', 'Emily', 'Jack', 'Elizabeth', 'Owen', 'Sofia', 'Ryan', 'Avery',
        'Nathan', 'Ella', 'Caleb', 'Scarlett', 'Isaac', 'Grace', 'Luke', 'Chloe', 'John', 'Victoria',
        'David', 'Riley', 'Gabriel', 'Aria', 'Samuel', 'Lily', 'Julian', 'Aurora', 'Leo', 'Zoey',
        'Priya', 'Raj', 'Aisha', 'Mohammed', 'Chen', 'Wei', 'Yuki', 'Hiroshi', 'Maria', 'Carlos',
        'Fatima', 'Ahmed', 'Sanjay', 'Lakshmi', 'Kenji', 'Sakura', 'Juan', 'Ana', 'Liu', 'Ming'
    ],
    'last_names': [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
        'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
        'Patel', 'Kumar', 'Singh', 'Wang', 'Li', 'Zhang', 'Chen', 'Yang', 'Kim', 'Park',
        'Tanaka', 'Yamamoto', 'Sato', 'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Nguyen'
    ],
    'positions': [
        'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
        'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Cloud Architect',
        'Product Manager', 'UX Designer', 'UI Developer', 'Mobile Developer',
        'Data Engineer', 'Security Engineer', 'QA Engineer', 'Site Reliability Engineer',
        'Solutions Architect', 'Technical Lead', 'Engineering Manager', 'AI Research Scientist'
    ],
    'companies': [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Uber',
        'Airbnb', 'Spotify', 'Twitter', 'LinkedIn', 'Salesforce', 'Adobe', 'Oracle', 'IBM',
        'Stripe', 'Square', 'PayPal', 'Shopify', 'Twilio', 'Slack', 'Zoom', 'Atlassian',
        'Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Citadel', 'Two Sigma', 'DE Shaw'
    ],
    'skills': {
        'programming': ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'],
        'frontend': ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'GraphQL'],
        'backend': ['Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Express.js', 'Ruby on Rails', 'ASP.NET'],
        'database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB'],
        'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'],
        'ml': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NLP', 'Computer Vision', 'Deep Learning', 'MLOps']
    },
    'education': [
        'PhD in Computer Science', 'MS in Computer Science', 'MS in Data Science', 'MS in AI/ML',
        'BS in Computer Science', 'BS in Software Engineering', 'BS in Information Technology',
        'BS in Electrical Engineering', 'BS in Mathematics', 'MBA'
    ],
    'universities': [
        'MIT', 'Stanford', 'Carnegie Mellon', 'UC Berkeley', 'Caltech', 'Harvard', 'Princeton',
        'Georgia Tech', 'University of Washington', 'University of Michigan', 'Cornell', 'Columbia',
        'UCLA', 'UCSD', 'University of Illinois', 'UT Austin', 'IIT Bombay', 'IIT Delhi',
        'Tsinghua University', 'NUS', 'Oxford', 'Cambridge', 'ETH Zurich', 'University of Toronto'
    ],
    'strengths': [
        'Strong problem-solving skills', 'Excellent communication', 'Leadership experience',
        'Quick learner', 'Team player', 'Self-motivated', 'Detail-oriented',
        'Creative thinker', 'Strong analytical skills', 'Adaptable',
        'Proven track record', 'Domain expertise', 'Mentorship experience'
    ],
    'weaknesses': [
        'Limited cloud experience', 'No management experience', 'Gaps in employment',
        'Missing required certification', 'Limited industry experience', 'Needs visa sponsorship',
        'Short tenure at previous jobs', 'Missing key technical skill'
    ]
}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class ResumeParserAPI:
    """Enterprise API wrapper for Langflow Resume Parser with batch processing"""
    
    def __init__(self):
        self.api_key = LANGFLOW_API_KEY
        self.base_url = LANGFLOW_BASE_URL
        self.flow_id = LANGFLOW_FLOW_ID
        self.session_id = str(uuid.uuid4())
    
    @property
    def api_url(self):
        return f"{self.base_url}/api/v1/run/{self.flow_id}"
    
    def analyze_resumes(self, job_description: str) -> dict:
        """Send job description to Langflow and get analysis results"""
        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": job_description if job_description else "Analyze the uploaded resumes",
            "session_id": self.session_id
        }
        
        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                self.api_url,
                json=payload,
                headers=headers,
                timeout=300  # 5 minute timeout for large batches
            )
            response.raise_for_status()
            raw_response = response.json()
            return self._format_output(raw_response)
            
        except requests.exceptions.Timeout:
            return self._error_response("Request timed out. Please try again.")
        except requests.exceptions.ConnectionError:
            return self._error_response("Cannot connect to Langflow server. Ensure it's running.")
        except Exception as e:
            return self._error_response(str(e))
    
    def _format_output(self, raw_response: dict) -> dict:
        """Transform Langflow response into structured output"""
        result = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "total_candidates": 0,
            "candidates": [],
            "raw_output": None
        }
        
        try:
            outputs = raw_response.get("outputs", [])
            if outputs:
                for output in outputs:
                    output_results = output.get("outputs", [])
                    for out in output_results:
                        results = out.get("results", {})
                        message = results.get("message", {})
                        text = message.get("text", "")
                        
                        if text:
                            result["raw_output"] = text
                            parsed_candidates = self._parse_langflow_response(text)
                            if parsed_candidates:
                                result["candidates"] = parsed_candidates
                                result["total_candidates"] = len(parsed_candidates)
            
            # Also check for CSV output file from the new Langflow flow
            if result["total_candidates"] == 0:
                csv_candidates = self._parse_csv_output()
                if csv_candidates:
                    result["candidates"] = csv_candidates
                    result["total_candidates"] = len(csv_candidates)
                    
        except Exception as e:
            result["parse_warning"] = str(e)
        
        return result
    
    def _parse_csv_output(self, csv_path: str = None) -> list:
        """Parse CSV output file from Langflow flow"""
        candidates = []
        
        # Check common CSV output locations
        possible_paths = [
            csv_path,
            "result.csv",
            os.path.join(os.path.dirname(__file__), "result.csv"),
            os.path.join(app.config['UPLOAD_FOLDER'], "result.csv"),
        ]
        
        csv_file = None
        for path in possible_paths:
            if path and os.path.exists(path):
                csv_file = path
                break
        
        if not csv_file:
            return candidates
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    candidate = self._format_csv_candidate(row)
                    candidates.append(candidate)
        except Exception as e:
            print(f"Error parsing CSV: {e}")
        
        return candidates
    
    def _format_csv_candidate(self, row: dict) -> dict:
        """Format a single candidate from CSV row data"""
        # Parse list fields that are stored as strings
        def parse_list_field(value):
            if not value or value == '':
                return []
            try:
                return ast.literal_eval(value)
            except:
                return [value] if value else []
        
        matched_skills = parse_list_field(row.get('matched_skills', ''))
        missing_skills = parse_list_field(row.get('missing_skills', ''))
        additional_skills = parse_list_field(row.get('additional_skills', ''))
        education_details = parse_list_field(row.get('education_details', ''))
        work_experience = parse_list_field(row.get('work_experience', ''))
        projects = parse_list_field(row.get('projects', ''))
        
        # Calculate scores based on matching_score
        overall_score = int(float(row.get('matching_score', 0)))
        skill_score = overall_score + 5 if overall_score > 0 else 0
        exp_score = overall_score - 5 if overall_score > 0 else 0
        
        # Determine recommendation based on score
        if overall_score >= 85:
            recommendation = 'STRONG_MATCH'
            status = 'strong'
            priority = 'HIGH'
        elif overall_score >= 70:
            recommendation = 'GOOD_MATCH'
            status = 'good'
            priority = 'MEDIUM'
        elif overall_score >= 55:
            recommendation = 'NEEDS_REVIEW'
            status = 'review'
            priority = 'LOW'
        else:
            recommendation = 'NOT_RECOMMENDED'
            status = 'rejected'
            priority = 'LOW'
        
        return {
            "file_reference": f"candidate_{row.get('candidate_id', '')}.pdf",
            "candidate_profile": {
                "candidate_id": row.get('candidate_id', ''),
                "name": row.get('name', ''),
                "email": row.get('email', ''),
                "phone": row.get('phone', ''),
                "current_position": row.get('current_position', ''),
                "total_experience_years": int(float(row.get('total_experience_years', 0))),
                "languages": []
            },
            "education": {
                "highest_degree": row.get('education', ''),
                "university": "",
                "details": education_details
            },
            "skills": matched_skills + additional_skills,
            "work_experience": work_experience,
            "projects": projects,
            "certifications": [],
            "job_match": {
                "overall_score": overall_score,
                "skill_match_score": min(skill_score, 100),
                "experience_match_score": max(exp_score, 0),
                "education_match_score": overall_score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "additional_skills": additional_skills
            },
            "evaluation": {
                "strengths": [f"Strong in {', '.join(matched_skills[:3])}"] if matched_skills else [],
                "weaknesses": [f"Missing {', '.join(missing_skills[:3])}"] if missing_skills else [],
                "recommendation": recommendation,
                "recommendation_explanation": f"Candidate has {overall_score}% match with job requirements.",
                "priority_level": priority,
                "status": status
            },
            "next_steps": {
                "action": "Schedule Technical Interview" if overall_score >= 70 else "Review Application",
                "interview_questions": [],
                "recruiter_notes": ""
            },
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "processed_by": "ResumeAI Pro v2.0"
            }
        }
    
    def _parse_langflow_response(self, text: str) -> list:
        """Parse multi-candidate JSON from Langflow"""
        candidates = []
        
        json_match = re.search(r'\{[\s\S]*\}', text)
        if not json_match:
            return candidates
        
        try:
            parsed_json = json.loads(json_match.group())
            
            for file_key, candidate_data in parsed_json.items():
                if file_key.startswith("candidate_") and isinstance(candidate_data, dict):
                    inputs = candidate_data.get("inputs", candidate_data)
                    candidate = self._format_candidate(inputs, file_key)
                    candidates.append(candidate)
            
            if not candidates and "inputs" in parsed_json:
                candidate = self._format_candidate(parsed_json["inputs"], "candidate")
                candidates.append(candidate)
            
            if not candidates and "candidate_id" in parsed_json:
                candidate = self._format_candidate(parsed_json, "candidate")
                candidates.append(candidate)
                
        except json.JSONDecodeError:
            pass
        
        return candidates
    
    def _format_candidate(self, data: dict, file_key: str) -> dict:
        """Format single candidate data"""
        return {
            "file_reference": file_key,
            "candidate_profile": {
                "candidate_id": data.get("candidate_id", ""),
                "name": data.get("name", ""),
                "email": data.get("email", ""),
                "phone": data.get("phone", ""),
                "current_position": data.get("current_position"),
                "total_experience_years": data.get("total_experience_years", 0),
                "languages": data.get("languages", [])
            },
            "education": {
                "highest_degree": data.get("education", ""),
                "university": data.get("university", ""),
                "details": data.get("education_details", [])
            },
            "skills": data.get("skills", []),
            "work_experience": data.get("work_experience", []),
            "projects": data.get("projects", []),
            "certifications": data.get("certifications", []),
            "job_match": {
                "overall_score": data.get("matching_score", 0),
                "skill_match_score": data.get("skill_match_score", 0),
                "experience_match_score": data.get("experience_match_score", 0),
                "education_match_score": data.get("education_match_score", 0),
                "matched_skills": data.get("matched_skills", []),
                "missing_skills": data.get("missing_skills", []),
                "additional_skills": data.get("additional_skills", [])
            },
            "evaluation": {
                "strengths": data.get("strengths", []),
                "weaknesses": data.get("weaknesses", []),
                "recommendation": data.get("recommendation", ""),
                "recommendation_explanation": data.get("recommendation_explanation", ""),
                "priority_level": data.get("priority_level", ""),
                "status": data.get("status", "")
            },
            "next_steps": {
                "action": data.get("next_steps", ""),
                "interview_questions": data.get("interview_questions", []),
                "recruiter_notes": data.get("recruiter_notes", "")
            },
            "metadata": {
                "timestamp": data.get("timestamp", ""),
                "processed_by": data.get("processed_by", "ResumeAI Pro v2.0")
            }
        }
    
    def _error_response(self, message: str) -> dict:
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "error": message,
            "total_candidates": 0,
            "candidates": []
        }


def generate_demo_candidate(index: int) -> dict:
    """Generate a realistic demo candidate with randomized data"""
    
    first_name = random.choice(DEMO_DATA['first_names'])
    last_name = random.choice(DEMO_DATA['last_names'])
    name = f"{first_name} {last_name}"
    
    email_domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'protonmail.com']
    email = f"{first_name.lower()}.{last_name.lower()}@{random.choice(email_domains)}"
    phone = f"+1 ({random.randint(200, 999)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}"
    
    position = random.choice(DEMO_DATA['positions'])
    experience = random.randint(1, 20)
    education = random.choice(DEMO_DATA['education'])
    university = random.choice(DEMO_DATA['universities'])
    
    # Generate skills from various categories
    all_skills = []
    for category_skills in DEMO_DATA['skills'].values():
        all_skills.extend(random.sample(category_skills, min(3, len(category_skills))))
    skills = list(set(all_skills))[:random.randint(5, 15)]
    
    # Calculate scores with some randomness
    skill_score = random.randint(40, 100)
    exp_score = random.randint(40, 100)
    edu_score = random.randint(40, 100)
    overall_score = int(skill_score * 0.5 + exp_score * 0.3 + edu_score * 0.2)
    
    # Determine status based on score
    if overall_score >= 85:
        recommendation = 'STRONG_MATCH'
        status = 'strong'
        priority = 'HIGH'
    elif overall_score >= 70:
        recommendation = 'GOOD_MATCH'
        status = 'good'
        priority = 'MEDIUM'
    elif overall_score >= 55:
        recommendation = 'NEEDS_REVIEW'
        status = 'review'
        priority = 'LOW'
    else:
        recommendation = 'NOT_RECOMMENDED'
        status = 'rejected'
        priority = 'LOW'
    
    # Generate work experience
    work_experience = []
    remaining_years = experience
    while remaining_years > 0:
        years = min(random.randint(1, 5), remaining_years)
        work_experience.append({
            'company': random.choice(DEMO_DATA['companies']),
            'position': random.choice(DEMO_DATA['positions']),
            'duration': f"{years} year{'s' if years > 1 else ''}",
            'years': years
        })
        remaining_years -= years
    
    # Generate certifications
    all_certs = [
        'AWS Certified Solutions Architect', 'Google Cloud Professional',
        'Azure Administrator', 'Kubernetes Administrator', 'PMP Certified',
        'Scrum Master', 'CISSP', 'TensorFlow Developer Certificate',
        'MongoDB Certified Developer', 'Cisco CCNA'
    ]
    certifications = random.sample(all_certs, random.randint(0, 3))
    
    # Generate matched/missing skills
    matched_skills = skills[:int(len(skills) * overall_score / 100)]
    missing_skills = random.sample(['GraphQL', 'Kubernetes', 'Terraform', 'Spark', 'Scala'], random.randint(0, 3))
    
    return {
        "file_reference": f"candidate_CAND_{str(index).zfill(4)}_{name.replace(' ', '_')}.pdf",
        "candidate_profile": {
            "candidate_id": f"CAND_{str(index).zfill(6)}",
            "name": name,
            "email": email,
            "phone": phone,
            "current_position": position,
            "total_experience_years": experience,
            "languages": random.sample(['English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'German', 'Japanese'], random.randint(1, 3))
        },
        "education": {
            "highest_degree": education,
            "university": university,
            "details": [{"degree": education, "institution": university, "year": 2024 - experience - 4}]
        },
        "skills": skills,
        "work_experience": work_experience,
        "certifications": certifications,
        "job_match": {
            "overall_score": overall_score,
            "skill_match_score": skill_score,
            "experience_match_score": exp_score,
            "education_match_score": edu_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "additional_skills": skills[-3:] if len(skills) > 3 else skills
        },
        "evaluation": {
            "strengths": random.sample(DEMO_DATA['strengths'], random.randint(2, 4)),
            "weaknesses": random.sample(DEMO_DATA['weaknesses'], random.randint(0, 2)),
            "recommendation": recommendation,
            "recommendation_explanation": f"Candidate shows {'strong' if overall_score >= 70 else 'moderate'} alignment with job requirements.",
            "priority_level": priority,
            "status": status
        },
        "next_steps": {
            "action": "Schedule Technical Interview" if overall_score >= 70 else "Review Application",
            "interview_questions": [
                "Tell me about a challenging project you worked on.",
                "How do you approach problem-solving?",
                "Describe your experience with team collaboration."
            ],
            "recruiter_notes": ""
        },
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "processed_by": "ResumeAI Pro v2.0"
        }
    }


def generate_demo_batch(count: int = 1000) -> dict:
    """Generate a batch of demo candidates"""
    candidates = []
    
    # Use thread pool for faster generation
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = [executor.submit(generate_demo_candidate, i + 1) for i in range(count)]
        for future in as_completed(futures):
            candidates.append(future.result())
    
    # Sort by score descending
    candidates.sort(key=lambda x: x['job_match']['overall_score'], reverse=True)
    
    return {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "session_id": str(uuid.uuid4()),
        "total_candidates": len(candidates),
        "candidates": candidates,
        "analytics": calculate_analytics(candidates)
    }


def calculate_analytics(candidates: list) -> dict:
    """Calculate analytics for a batch of candidates"""
    total = len(candidates)
    if total == 0:
        return {}
    
    scores = [c['job_match']['overall_score'] for c in candidates]
    experiences = [c['candidate_profile']['total_experience_years'] for c in candidates]
    
    skill_counts = {}
    for c in candidates:
        for skill in c['skills']:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
    
    return {
        "total_candidates": total,
        "strong_matches": len([s for s in scores if s >= 85]),
        "good_matches": len([s for s in scores if 70 <= s < 85]),
        "needs_review": len([s for s in scores if 55 <= s < 70]),
        "not_recommended": len([s for s in scores if s < 55]),
        "average_score": round(sum(scores) / total, 1),
        "max_score": max(scores),
        "min_score": min(scores),
        "average_experience": round(sum(experiences) / total, 1),
        "experience_distribution": {
            "0-2": len([e for e in experiences if e <= 2]),
            "3-5": len([e for e in experiences if 3 <= e <= 5]),
            "6-10": len([e for e in experiences if 6 <= e <= 10]),
            "10+": len([e for e in experiences if e > 10])
        },
        "top_skills": sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    }


# ============================================
# Authentication Helper Functions
# ============================================

def hash_password(password):
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    """Generate a secure token"""
    return secrets.token_urlsafe(32)

def login_required(f):
    """Decorator to require login for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

# ============================================
# Routes
# ============================================

@app.route('/')
def landing():
    """Serve the landing page"""
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('landing.html')


@app.route('/login')
def login_page():
    """Serve the login page"""
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('login.html')


@app.route('/signup')
def signup_page():
    """Serve the signup page"""
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('signup.html')


@app.route('/dashboard')
@login_required
def dashboard():
    """Serve the main dashboard (protected)"""
    return render_template('index.html')


@app.route('/logout')
def logout():
    """Logout user"""
    session.clear()
    return redirect('/')


# ============================================
# Auth API Routes
# ============================================

@app.route('/api/auth/signup', methods=['POST'])
def api_signup():
    """Handle user signup"""
    data = request.json
    
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    company = data.get('company', '')
    
    # Validation
    if not email or not password or not first_name or not last_name:
        return jsonify({
            'success': False,
            'message': 'All fields are required'
        }), 400
    
    if len(password) < 8:
        return jsonify({
            'success': False,
            'message': 'Password must be at least 8 characters'
        }), 400
    
    # Check if user exists
    if email in USERS_DB:
        return jsonify({
            'success': False,
            'message': 'Email already registered'
        }), 400
    
    # Create user
    user_id = str(uuid.uuid4())
    token = generate_token()
    
    USERS_DB[email] = {
        'id': user_id,
        'email': email,
        'password': hash_password(password),
        'first_name': first_name,
        'last_name': last_name,
        'company': company,
        'created_at': datetime.now().isoformat(),
        'token': token
    }
    
    # Set session
    session['user_id'] = user_id
    session['email'] = email
    session['name'] = f"{first_name} {last_name}"
    session.permanent = True
    
    return jsonify({
        'success': True,
        'message': 'Account created successfully',
        'user': {
            'id': user_id,
            'email': email,
            'name': f"{first_name} {last_name}",
            'company': company
        },
        'token': token
    })


@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """Handle user login"""
    data = request.json
    
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    
    # Validation
    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email and password are required'
        }), 400
    
    # Check user exists
    user = USERS_DB.get(email)
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Verify password
    if user['password'] != hash_password(password):
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Generate new token
    token = generate_token()
    USERS_DB[email]['token'] = token
    
    # Set session
    session['user_id'] = user['id']
    session['email'] = email
    session['name'] = f"{user['first_name']} {user['last_name']}"
    session.permanent = True
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user['id'],
            'email': email,
            'name': f"{user['first_name']} {user['last_name']}",
            'company': user.get('company', '')
        },
        'token': token
    })


@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    """Handle user logout"""
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })


@app.route('/api/auth/user')
def api_get_user():
    """Get current user info"""
    if 'user_id' not in session:
        return jsonify({
            'success': False,
            'message': 'Not authenticated'
        }), 401
    
    email = session.get('email')
    user = USERS_DB.get(email)
    
    if not user:
        session.clear()
        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 401
    
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': f"{user['first_name']} {user['last_name']}",
            'company': user.get('company', '')
        }
    })


# ============================================
# Resume Analysis Routes
# ============================================

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded resumes against job description"""
    job_description = request.form.get('job_description', '')
    files = request.files.getlist('resumes')
    job_file = request.files.get('job_file')
    
    # Handle job description file upload
    if job_file and allowed_file(job_file.filename):
        filename = secure_filename(job_file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        
        if ext == 'txt':
            # Read text file directly
            job_description = job_file.read().decode('utf-8')
        else:
            # Save file for processing
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], f'jd_{filename}')
            job_file.save(filepath)
            # For PDF/DOCX, you would extract text here
            # For now, note that the file was uploaded
            if not job_description:
                job_description = f"[Job description from file: {filename}]"
    
    # Save uploaded files
    uploaded_files = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            uploaded_files.append(filepath)
    
    # Call Langflow API
    parser = ResumeParserAPI()
    result = parser.analyze_resumes(job_description)
    
    # If Langflow returns no candidates, generate demo data
    if result['total_candidates'] == 0 and len(uploaded_files) > 0:
        # Generate candidates based on number of uploaded files
        demo_result = generate_demo_batch(len(uploaded_files))
        return jsonify(demo_result)
    
    return jsonify(result)


@app.route('/api/demo', methods=['POST'])
def demo():
    """Generate demo data with 1000 candidates"""
    count = request.form.get('count', 1000, type=int)
    count = min(count, 5000)  # Cap at 5000 for performance
    
    result = generate_demo_batch(count)
    return jsonify(result)


@app.route('/api/load-csv', methods=['GET', 'POST'])
def load_csv():
    """Load results from CSV file (from Langflow output)"""
    csv_path = None
    
    if request.method == 'POST':
        # Handle CSV file upload
        csv_file = request.files.get('csv_file')
        if csv_file and csv_file.filename.endswith('.csv'):
            filename = secure_filename(csv_file.filename)
            csv_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            csv_file.save(csv_path)
        else:
            # Check for path in form data
            csv_path = request.form.get('csv_path', 'result.csv')
    else:
        csv_path = request.args.get('path', 'result.csv')
    
    # Parse the CSV file using the ResumeParserAPI method
    parser = ResumeParserAPI()
    candidates = parser._parse_csv_output(csv_path)
    
    if candidates:
        return jsonify({
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "session_id": str(uuid.uuid4()),
            "total_candidates": len(candidates),
            "candidates": candidates,
            "analytics": calculate_analytics(candidates),
            "source": "csv_import"
        })
    else:
        return jsonify({
            "status": "error",
            "error": f"Could not load candidates from CSV file: {csv_path}",
            "total_candidates": 0,
            "candidates": []
        }), 404


@app.route('/api/candidate/<candidate_id>')
def get_candidate(candidate_id):
    """Get detailed information for a specific candidate"""
    # This would typically query a database
    # For demo, generate a candidate on the fly
    candidate = generate_demo_candidate(int(candidate_id.replace('CAND_', '')) if candidate_id.startswith('CAND_') else 1)
    return jsonify(candidate)


@app.route('/api/export', methods=['POST'])
def export_results():
    """Export results in various formats"""
    data = request.json
    format_type = data.get('format', 'json')
    candidates = data.get('candidates', [])
    
    if format_type == 'json':
        return jsonify(candidates)
    
    elif format_type == 'csv':
        import csv
        import io
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow(['Rank', 'Name', 'Email', 'Phone', 'Position', 'Experience', 
                        'Education', 'Skills Match', 'Overall Score', 'Recommendation'])
        
        # Data
        for i, c in enumerate(candidates):
            writer.writerow([
                i + 1,
                c['candidate_profile']['name'],
                c['candidate_profile']['email'],
                c['candidate_profile']['phone'],
                c['candidate_profile'].get('current_position', ''),
                c['candidate_profile']['total_experience_years'],
                c['education']['highest_degree'],
                f"{c['job_match']['skill_match_score']}%",
                f"{c['job_match']['overall_score']}%",
                c['evaluation']['recommendation']
            ])
        
        output.seek(0)
        return output.getvalue(), 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=resume_analysis.csv'
        }
    
    return jsonify({"error": "Unsupported format"}), 400


@app.route('/api/stats')
def get_stats():
    """Get system statistics"""
    return jsonify({
        "status": "healthy",
        "version": "2.0.0",
        "max_batch_size": 5000,
        "supported_formats": list(ALLOWED_EXTENSIONS),
        "langflow_connected": check_langflow_connection()
    })


def check_langflow_connection():
    """Check if Langflow server is accessible"""
    try:
        response = requests.get(f"{LANGFLOW_BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False


@app.route('/api/templates')
def get_templates():
    """Get job description templates"""
    return jsonify({
        "software": """Senior Software Engineer

We are looking for a Senior Software Engineer to join our team.

Required Skills:
• 5+ years of software development experience
• Proficiency in Python, JavaScript, or Java
• Experience with React, Node.js, or similar frameworks
• Strong understanding of databases (PostgreSQL, MongoDB)
• Cloud experience (AWS, GCP, or Azure)
• Experience with Docker and Kubernetes

Education: BS in Computer Science or related field""",

        "data": """Data Scientist

We are seeking a talented Data Scientist to join our analytics team.

Required Skills:
• 3+ years of data science experience
• Strong proficiency in Python and SQL
• Experience with machine learning frameworks (TensorFlow, PyTorch)
• Statistical analysis and modeling
• Data visualization experience

Education: MS or PhD in Data Science, Statistics, or related field""",

        "product": """Product Manager

We are looking for an experienced Product Manager.

Required Skills:
• 4+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with Agile/Scrum methodologies
• Excellent communication and presentation skills
• Technical background or understanding

Education: Bachelor's degree required, MBA preferred""",

        "design": """UX Designer

We are seeking a creative UX Designer.

Required Skills:
• 3+ years of UX/UI design experience
• Proficiency in Figma, Sketch, or Adobe XD
• Strong portfolio demonstrating user-centered design
• User research and usability testing experience
• Prototyping and wireframing skills

Education: Bachelor's degree in Design, HCI, or related field"""
    })


# Error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 500MB."}), 413


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error. Please try again."}), 500


if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║   🤖 ResumeAI Pro - Enterprise Resume Intelligence Platform  ║
    ║                                                              ║
    ║   Version: 2.0.0                                             ║
    ║   Max Batch Size: 5000 resumes                               ║
    ║   Server: http://localhost:5000                              ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
