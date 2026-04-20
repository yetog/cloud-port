"""
Notes & Jobs API Routes
Personal notes and job tracking for admin dashboard
"""

import os
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

PORTFOLIO_DIR = "/var/www/zaylegend"
JOBS_FILE = f"{PORTFOLIO_DIR}/jobs/jobs.json"
NOTES_FILE = f"{PORTFOLIO_DIR}/jobs/notes.json"

# Ensure files exist
os.makedirs(f"{PORTFOLIO_DIR}/jobs", exist_ok=True)


def load_json(filepath: str) -> list:
    """Load JSON file or return empty list."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            return []
    return []


def save_json(filepath: str, data: list):
    """Save data to JSON file."""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)


# === Job Models ===

class JobCreate(BaseModel):
    company: str
    role: str
    url: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = []
    status: str = "saved"  # saved, applied, interview, offer, rejected
    notes: Optional[str] = None


class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    matching_projects: Optional[List[str]] = None
    skill_gaps: Optional[List[str]] = None


# === Note Models ===

class NoteCreate(BaseModel):
    title: str
    content: str
    category: str = "general"  # general, idea, todo, claude-review


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    resolved: Optional[bool] = None


# === Job Endpoints ===

@router.get("/jobs")
async def list_jobs():
    """List all saved jobs."""
    jobs = load_json(JOBS_FILE)
    return {
        "total": len(jobs),
        "jobs": jobs
    }


@router.post("/jobs")
async def create_job(job: JobCreate):
    """Save a new job posting."""
    jobs = load_json(JOBS_FILE)

    new_job = {
        "id": len(jobs) + 1,
        "company": job.company,
        "role": job.role,
        "url": job.url,
        "description": job.description,
        "requirements": job.requirements or [],
        "status": job.status,
        "notes": job.notes,
        "matching_projects": [],
        "skill_gaps": [],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    jobs.append(new_job)
    save_json(JOBS_FILE, jobs)

    return new_job


@router.get("/jobs/{job_id}")
async def get_job(job_id: int):
    """Get a specific job."""
    jobs = load_json(JOBS_FILE)
    for job in jobs:
        if job.get("id") == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")


@router.put("/jobs/{job_id}")
async def update_job(job_id: int, update: JobUpdate):
    """Update a job posting."""
    jobs = load_json(JOBS_FILE)

    for i, job in enumerate(jobs):
        if job.get("id") == job_id:
            # Update only provided fields
            update_data = update.dict(exclude_unset=True)
            for key, value in update_data.items():
                if value is not None:
                    jobs[i][key] = value
            jobs[i]["updated_at"] = datetime.now().isoformat()
            save_json(JOBS_FILE, jobs)
            return jobs[i]

    raise HTTPException(status_code=404, detail="Job not found")


@router.delete("/jobs/{job_id}")
async def delete_job(job_id: int):
    """Delete a job posting."""
    jobs = load_json(JOBS_FILE)

    for i, job in enumerate(jobs):
        if job.get("id") == job_id:
            deleted = jobs.pop(i)
            save_json(JOBS_FILE, jobs)
            return {"deleted": deleted}

    raise HTTPException(status_code=404, detail="Job not found")


# === Notes Endpoints ===

@router.get("/notes")
async def list_notes():
    """List all notes."""
    notes = load_json(NOTES_FILE)
    return {
        "total": len(notes),
        "notes": notes
    }


@router.post("/notes")
async def create_note(note: NoteCreate):
    """Create a new note."""
    notes = load_json(NOTES_FILE)

    new_note = {
        "id": len(notes) + 1,
        "title": note.title,
        "content": note.content,
        "category": note.category,
        "resolved": False,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    notes.append(new_note)
    save_json(NOTES_FILE, notes)

    return new_note


@router.get("/notes/{note_id}")
async def get_note(note_id: int):
    """Get a specific note."""
    notes = load_json(NOTES_FILE)
    for note in notes:
        if note.get("id") == note_id:
            return note
    raise HTTPException(status_code=404, detail="Note not found")


@router.put("/notes/{note_id}")
async def update_note(note_id: int, update: NoteUpdate):
    """Update a note."""
    notes = load_json(NOTES_FILE)

    for i, note in enumerate(notes):
        if note.get("id") == note_id:
            update_data = update.dict(exclude_unset=True)
            for key, value in update_data.items():
                if value is not None:
                    notes[i][key] = value
            notes[i]["updated_at"] = datetime.now().isoformat()
            save_json(NOTES_FILE, notes)
            return notes[i]

    raise HTTPException(status_code=404, detail="Note not found")


@router.delete("/notes/{note_id}")
async def delete_note(note_id: int):
    """Delete a note."""
    notes = load_json(NOTES_FILE)

    for i, note in enumerate(notes):
        if note.get("id") == note_id:
            deleted = notes.pop(i)
            save_json(NOTES_FILE, notes)
            return {"deleted": deleted}

    raise HTTPException(status_code=404, detail="Note not found")


@router.get("/notes/category/{category}")
async def get_notes_by_category(category: str):
    """Get notes by category."""
    notes = load_json(NOTES_FILE)
    filtered = [n for n in notes if n.get("category") == category]
    return {
        "total": len(filtered),
        "category": category,
        "notes": filtered
    }
