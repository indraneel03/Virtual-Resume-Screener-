"""
Test the parser with sample Langflow output
"""
import sys
sys.path.insert(0, 'd:/project')

from app import ResumeParser, print_formatted_result
import json

# Sample Langflow output (as provided by user)
SAMPLE_LANGFLOW_OUTPUT = {
  "candidate_CAND_20260130_001_IndraneelKalva.json": {
    "inputs": {
      "candidate_id": "CAND_20260130_001",
      "name": "Indraneel Kalva",
      "email": "peindraneelkalva@gmail.com",
      "phone": "+7730841030",
      "current_position": None,
      "education": "B.Tech",
      "education_details": [
        {
          "degree": "B.Tech",
          "field": "Artificial Intelligence",
          "institution": "Anurag University",
          "graduation_year": "2025",
          "gpa": "8.66"
        },
        {
          "degree": "Intermediate Education",
          "field": None,
          "institution": "Sarath Junior College",
          "graduation_year": "2021",
          "gpa": None
        },
        {
          "degree": "High School Education",
          "field": None,
          "institution": "St. Joseph's High School (ICSE)",
          "graduation_year": "2019",
          "gpa": None
        }
      ],
      "total_experience_years": 0.25,
      "skills": [
        "Python", "SQL", "JavaScript/TypeScript", "HTML/CSS", "TensorFlow",
        "PyTorch", "Hugging Face", "spaCy", "NLTK", "Scikit-learn", "CNNs",
        "Transformers", "Transfer Learning", "Computer Vision", "NLP",
        "OpenAI GPT", "Prompt Engineering", "LangChain", "Vibe Coding", "Git",
        "Docker", "VS Code", "Jupyter Notebook", "OpenCV", "Grad-CAM",
        "Matplotlib", "Seaborn", "Plotly", "Streamlit"
      ],
      "work_experience": [
        {
          "title": "Machine Learning Development Intern",
          "company": "Rinex Technologies",
          "duration": "July 2023 - Sept 2023",
          "responsibilities": [
            "Spent the summer building neural networks that could recognize objects in images and handwritten numbers",
            "Learned how real-world machine learning projects come together"
          ]
        }
      ],
      "projects": [
        {
          "title": "Deep Learning Driven Detection of Retinal Diseases",
          "description": "Developed a deep learning pipeline for automated detection and classification of retinal diseases from OCT images.",
          "technologies": ["PyTorch", "Grad-CAM", "TensorFlow"]
        },
        {
          "title": "Snap2Code AI Studio",
          "description": "Built an AI-powered platform that converts UI screenshots to production-ready code.",
          "technologies": ["React", "Tailwind CSS", "OpenAI", "Computer Vision"]
        }
      ],
      "certifications": [],
      "languages": ["English", "Hindi", "Telugu"],
      "matching_score": 85,
      "skill_match_score": 80,
      "experience_match_score": 75,
      "education_match_score": 90,
      "matched_skills": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "LangChain"],
      "missing_skills": ["Langflow", "Generative AI"],
      "additional_skills": ["Computer Vision", "Transfer Learning", "OpenAI GPT"],
      "strengths": [
        "Strong foundation in deep learning and AI technologies.",
        "Hands-on experience with relevant projects.",
        "Proficient in Python and machine learning frameworks."
      ],
      "weaknesses": [
        "Limited professional experience in the field.",
        "Lacks exposure to Langflow and generative AI."
      ],
      "recommendation": "GOOD_MATCH",
      "recommendation_explanation": "Indraneel has a strong background in deep learning and relevant projects.",
      "priority_level": "MEDIUM",
      "status": "REVIEW",
      "next_steps": "Schedule technical interview",
      "interview_questions": [
        "Can you explain your experience with LangChain?",
        "What deep learning frameworks are you most comfortable with?",
        "How do you approach learning new technologies?"
      ],
      "recruiter_notes": "Strong candidate with relevant projects and skills.",
      "timestamp": "2023-10-01T12:00:00Z",
      "processed_by": "Virtual Resume Screener v1.0"
    }
  },
  "candidate_CAND_20260130_002_AnumulaNymishaNandiniReddy.json": {
    "inputs": {
      "candidate_id": "CAND_20260130_002",
      "name": "Anumula Nymisha Nandini Reddy",
      "email": "penymisha79@gmail.com",
      "phone": "+7671992915",
      "current_position": None,
      "education": "B.Tech",
      "education_details": [
        {
          "degree": "B.Tech",
          "field": "CSE (AIML)",
          "institution": "Hyderabad Institute of Technology and Management",
          "graduation_year": None,
          "gpa": "7.14"
        }
      ],
      "total_experience_years": 0.5,
      "skills": [
        "Python", "Machine Learning", "Deep Learning", "NLP", "NumPy", "Pandas",
        "scikit-learn", "TensorFlow", "Keras", "Matplotlib", "Seaborn", "Linux",
        "GitHub", "Jupyter Notebook", "Google Colab", "VS Code"
      ],
      "work_experience": [
        {
          "title": "AI Intern",
          "company": "Skild",
          "duration": "Feb 2024 - May 2024",
          "responsibilities": ["Segmented raw floorplan images into structured room-level data"]
        },
        {
          "title": "NLP Research Intern",
          "company": "IIIT Hyderabad",
          "duration": "July 2024 - Nov 2024",
          "responsibilities": ["Researched emotion perception differences between depressed and non-depressed individuals"]
        }
      ],
      "projects": [
        {
          "title": "Deep Fake Detection",
          "description": "Fine-tuned CNN models (Inception-ResNetV2, VGG16) to classify real vs fake videos.",
          "technologies": []
        }
      ],
      "certifications": [],
      "languages": [],
      "matching_score": 80,
      "skill_match_score": 75,
      "experience_match_score": 70,
      "education_match_score": 85,
      "matched_skills": ["Python", "Deep Learning", "NLP", "TensorFlow", "Keras"],
      "missing_skills": ["Langflow", "LangChain", "Generative AI"],
      "additional_skills": ["Machine Learning", "Data Analysis", "Research Skills"],
      "strengths": ["Strong research background in NLP.", "Experience with deep learning models."],
      "weaknesses": ["Limited practical experience in industry.", "Lacks exposure to Langflow and generative AI."],
      "recommendation": "GOOD_MATCH",
      "recommendation_explanation": "Nymisha has relevant experience in AI and NLP but lacks specific experience with Langflow.",
      "priority_level": "MEDIUM",
      "status": "REVIEW",
      "next_steps": "Schedule technical interview",
      "interview_questions": ["What projects have you worked on that involved deep learning?"],
      "recruiter_notes": "Good candidate with relevant experience and skills.",
      "timestamp": "2023-10-01T12:00:00Z",
      "processed_by": "Virtual Resume Screener v1.0"
    }
  }
}

def test_parsing():
    """Test the parsing logic with sample data"""
    parser = ResumeParser(api_key="test", base_url="http://localhost:7860")
    
    # Simulate the text response from Langflow
    text_response = json.dumps(SAMPLE_LANGFLOW_OUTPUT)
    
    # Parse it
    candidates = parser._parse_langflow_response(text_response)
    
    # Create result structure
    result = {
        "status": "success",
        "timestamp": "2026-02-02T20:30:00",
        "session_id": parser.session_id,
        "total_candidates": len(candidates),
        "candidates": candidates,
        "raw_output": None
    }
    
    # Print formatted results
    print_formatted_result(result)
    
    # Save to JSON
    with open("resume_analysis_output.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print("\n💾 Results saved to resume_analysis_output.json")
    
    return result

if __name__ == "__main__":
    test_parsing()
