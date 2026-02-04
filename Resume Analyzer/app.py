"""
AI Resume Parser & Matcher Application
Connects to Langflow Virtual Resume Screener flow
"""

import requests
import uuid
import json
import re
import csv
import os
import ast
from datetime import datetime


class ResumeParser:
    """AI-powered Resume Parser using Langflow backend"""
    
    def __init__(self, api_key: str, base_url: str = "http://localhost:7860"):
        self.api_key = api_key
        self.base_url = base_url
        self.flow_id = "0014865e-8f2c-4d97-a27c-9c14db63d428"
        self.session_id = str(uuid.uuid4())
    
    @property
    def api_url(self) -> str:
        return f"{self.base_url}/api/v1/run/{self.flow_id}"
    
    def parse_resume(self, job_description: str = "", resume_text: str = "") -> dict:
        """
        Send resume/job description to Langflow and get parsed results
        
        Args:
            job_description: The job description to match against
            resume_text: Optional resume text (if not using uploaded files)
        
        Returns:
            Formatted JSON with resume details and match analysis
        """
        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": job_description if job_description else "Analyze the uploaded resume",
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
                timeout=120  # 2 minute timeout for LLM processing
            )
            response.raise_for_status()
            
            raw_response = response.json()
            return self._format_output(raw_response)
            
        except requests.exceptions.Timeout:
            return self._error_response("Request timed out. The server may be processing a large file.")
        except requests.exceptions.ConnectionError:
            return self._error_response("Cannot connect to Langflow server. Ensure it's running on port 7860.")
        except requests.exceptions.RequestException as e:
            return self._error_response(f"API request failed: {str(e)}")
        except json.JSONDecodeError:
            return self._error_response("Invalid JSON response from server")
    
    def _format_output(self, raw_response: dict) -> dict:
        """
        Transform Langflow response into structured resume parser output
        """
        result = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "total_candidates": 0,
            "candidates": [],
            "raw_output": None
        }
        
        # Extract the actual message from Langflow response
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
            result["parse_warning"] = f"Could not fully parse response: {str(e)}"
            result["raw_output"] = str(raw_response)
        
        return result
    
    def _parse_csv_output(self, csv_path: str = None) -> list:
        """Parse CSV output file from Langflow flow"""
        candidates = []
        
        # Check common CSV output locations
        possible_paths = [
            csv_path,
            "result.csv",
            os.path.join(os.path.dirname(__file__), "result.csv"),
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
        """
        Parse the Langflow Virtual Resume Screener response format
        Handles the multi-candidate JSON structure
        """
        candidates = []
        
        # Try to extract JSON from the response
        json_match = re.search(r'\{[\s\S]*\}', text)
        if not json_match:
            return candidates
            
        try:
            parsed_json = json.loads(json_match.group())
            
            # Handle the Langflow multi-candidate format
            # Keys are like "candidate_CAND_20260130_001_Name.json"
            for file_key, candidate_data in parsed_json.items():
                if file_key.startswith("candidate_") and isinstance(candidate_data, dict):
                    # Extract from "inputs" nested structure
                    inputs = candidate_data.get("inputs", candidate_data)
                    candidate = self._format_candidate(inputs, file_key)
                    candidates.append(candidate)
            
            # If no candidates found with that format, try direct parsing
            if not candidates and "inputs" in parsed_json:
                candidate = self._format_candidate(parsed_json["inputs"], "candidate")
                candidates.append(candidate)
            
            # Single candidate without nesting
            if not candidates and "candidate_id" in parsed_json:
                candidate = self._format_candidate(parsed_json, "candidate")
                candidates.append(candidate)
                
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
        
        return candidates
    
    def _format_candidate(self, data: dict, file_key: str) -> dict:
        """
        Format a single candidate's data into structured output
        """
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
                "processed_by": data.get("processed_by", "")
            }
        }
    
    def _error_response(self, message: str) -> dict:
        """Create standardized error response"""
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "session_id": self.session_id,
            "error": message,
            "resume_analysis": None,
            "job_match": None
        }


def print_formatted_result(result: dict):
    """Pretty print the parsed result with multiple candidates support"""
    print("\n" + "="*70)
    print("🤖 AI RESUME PARSER & MATCHER - ANALYSIS RESULTS")
    print("="*70)
    
    if result["status"] == "error":
        print(f"\n❌ Error: {result['error']}")
        return
    
    print(f"\n📅 Processed: {result['timestamp']}")
    print(f"🔑 Session: {result['session_id'][:8]}...")
    print(f"👥 Total Candidates Analyzed: {result.get('total_candidates', 0)}")
    
    candidates = result.get("candidates", [])
    
    for idx, candidate in enumerate(candidates, 1):
        print("\n" + "="*70)
        print(f"📋 CANDIDATE {idx}")
        print("="*70)
        
        # Candidate Profile
        profile = candidate.get("candidate_profile", {})
        print("\n👤 CANDIDATE PROFILE")
        print("-"*40)
        print(f"   🆔 ID: {profile.get('candidate_id', 'N/A')}")
        print(f"   📛 Name: {profile.get('name', 'N/A')}")
        print(f"   📧 Email: {profile.get('email', 'N/A')}")
        print(f"   📱 Phone: {profile.get('phone', 'N/A')}")
        print(f"   💼 Current Position: {profile.get('current_position') or 'Not specified'}")
        print(f"   ⏱️  Experience: {profile.get('total_experience_years', 0)} years")
        languages = profile.get('languages', [])
        if languages:
            print(f"   🌐 Languages: {', '.join(languages)}")
        
        # Education
        edu = candidate.get("education", {})
        print("\n🎓 EDUCATION")
        print("-"*40)
        print(f"   Highest Degree: {edu.get('highest_degree', 'N/A')}")
        for detail in edu.get("details", []):
            degree = detail.get('degree', '')
            field = detail.get('field', '')
            institution = detail.get('institution', '')
            year = detail.get('graduation_year', '')
            gpa = detail.get('gpa', '')
            print(f"   • {degree}{f' in {field}' if field else ''}")
            print(f"     📍 {institution}")
            if year: print(f"     📅 Graduation: {year}")
            if gpa: print(f"     📊 GPA: {gpa}")
        
        # Skills
        skills = candidate.get("skills", [])
        if skills:
            print("\n🛠️  SKILLS")
            print("-"*40)
            # Group skills into rows of 5
            for i in range(0, len(skills), 5):
                print(f"   {', '.join(skills[i:i+5])}")
        
        # Work Experience
        work_exp = candidate.get("work_experience", [])
        if work_exp:
            print("\n💼 WORK EXPERIENCE")
            print("-"*40)
            for exp in work_exp:
                print(f"   • {exp.get('title', 'N/A')} @ {exp.get('company', 'N/A')}")
                print(f"     📅 {exp.get('duration', 'N/A')}")
                for resp in exp.get('responsibilities', []):
                    print(f"     ➤ {resp[:80]}{'...' if len(resp) > 80 else ''}")
        
        # Projects
        projects = candidate.get("projects", [])
        if projects:
            print("\n🚀 PROJECTS")
            print("-"*40)
            for proj in projects:
                print(f"   • {proj.get('title', 'N/A')}")
                desc = proj.get('description', '')
                if desc:
                    print(f"     {desc[:100]}{'...' if len(desc) > 100 else ''}")
                techs = proj.get('technologies', [])
                if techs:
                    print(f"     🔧 Tech: {', '.join(techs)}")
        
        # Job Match Analysis
        match = candidate.get("job_match", {})
        print("\n🎯 JOB MATCH ANALYSIS")
        print("-"*40)
        
        overall = match.get("overall_score", 0)
        skill_score = match.get("skill_match_score", 0)
        exp_score = match.get("experience_match_score", 0)
        edu_score = match.get("education_match_score", 0)
        
        def score_bar(score):
            filled = int(score / 10)
            return "█" * filled + "░" * (10 - filled)
        
        print(f"   📊 Overall Match:    [{score_bar(overall)}] {overall}%")
        print(f"   🛠️  Skill Match:      [{score_bar(skill_score)}] {skill_score}%")
        print(f"   💼 Experience Match: [{score_bar(exp_score)}] {exp_score}%")
        print(f"   🎓 Education Match:  [{score_bar(edu_score)}] {edu_score}%")
        
        matched = match.get("matched_skills", [])
        if matched:
            print(f"\n   ✅ Matched Skills: {', '.join(matched)}")
        
        missing = match.get("missing_skills", [])
        if missing:
            print(f"   ⚠️  Missing Skills: {', '.join(missing)}")
        
        additional = match.get("additional_skills", [])
        if additional:
            print(f"   ➕ Additional Skills: {', '.join(additional)}")
        
        # Evaluation
        evaluation = candidate.get("evaluation", {})
        print("\n📝 EVALUATION")
        print("-"*40)
        
        rec = evaluation.get("recommendation", "")
        rec_emoji = {"STRONG_MATCH": "🌟", "GOOD_MATCH": "✅", "AVERAGE_MATCH": "⚠️", "POOR_MATCH": "❌"}.get(rec, "📋")
        print(f"   {rec_emoji} Recommendation: {rec}")
        print(f"   📊 Priority: {evaluation.get('priority_level', 'N/A')}")
        print(f"   📌 Status: {evaluation.get('status', 'N/A')}")
        
        explanation = evaluation.get("recommendation_explanation", "")
        if explanation:
            print(f"\n   💬 {explanation}")
        
        strengths = evaluation.get("strengths", [])
        if strengths:
            print("\n   💪 Strengths:")
            for s in strengths:
                print(f"      • {s}")
        
        weaknesses = evaluation.get("weaknesses", [])
        if weaknesses:
            print("\n   📉 Areas for Improvement:")
            for w in weaknesses:
                print(f"      • {w}")
        
        # Next Steps
        next_steps = candidate.get("next_steps", {})
        action = next_steps.get("action", "")
        questions = next_steps.get("interview_questions", [])
        notes = next_steps.get("recruiter_notes", "")
        
        if action or questions or notes:
            print("\n📋 NEXT STEPS")
            print("-"*40)
            if action:
                print(f"   🎬 Action: {action}")
            if notes:
                print(f"   📝 Notes: {notes}")
            if questions:
                print("\n   ❓ Suggested Interview Questions:")
                for q in questions:
                    print(f"      • {q}")
    
    if not candidates:
        print("\n⚠️  No candidates were parsed from the response.")
        if result.get("raw_output"):
            print("\n📝 Raw output preview:")
            print(result["raw_output"][:500])
    
    print("\n" + "="*70)


def main():
    """Main application entry point"""
    # Configuration
    API_KEY = 'sk-eepl0G5sbHcZU1r2vGqfUHS_KLVSn9I_U9B0ziVc6N4'
    BASE_URL = "http://localhost:7860"
    
    # Sample job description for testing
    JOB_DESCRIPTION = """
    We are looking for a Senior Software Engineer with:
    - 5+ years of Python experience
    - Experience with machine learning and AI
    - Strong knowledge of REST APIs
    - Experience with cloud platforms (AWS/GCP/Azure)
    - Good communication skills
    """
    
    print("\n🚀 Starting AI Resume Parser...")
    print(f"📡 Connecting to Langflow at {BASE_URL}")
    
    # Initialize parser
    parser = ResumeParser(api_key=API_KEY, base_url=BASE_URL)
    
    # Parse resume and match against job description
    print("📤 Sending request to Virtual Resume Screener flow...")
    result = parser.parse_resume(job_description=JOB_DESCRIPTION)
    
    # Display formatted results
    print_formatted_result(result)
    
    # Also save to JSON file
    output_file = "resume_analysis_output.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Full results saved to: {output_file}")
    
    # Return the result for programmatic use
    return result


if __name__ == "__main__":
    result = main()