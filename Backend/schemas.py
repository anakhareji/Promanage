from pydantic import BaseModel
from typing import Optional
from datetime import date

# -------- TASK --------
class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    project_id: Optional[int] = None

# -------- PROJECT --------
class ProjectCreate(BaseModel):
    name: str
    description: str
    status: str
    deadline: date

from pydantic import BaseModel

class MemberCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    position: str
    is_active: bool = True

class MemberOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    position: str
    is_active: bool

    class Config:
        from_attributes = True
