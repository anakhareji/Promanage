from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import Task, TaskComment, TaskAttachment, Status, Priority, Report, User, Project, Member
from datetime import datetime, date
from pydantic import BaseModel
from schemas import MemberCreate, MemberOut, TaskCreate, ProjectCreate
from sqlalchemy import text
import shutil, os
from fastapi.middleware.cors import CORSMiddleware

# ---------------- SCHEMAS ----------------

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    project_id: int | None = None  # 🔥 ADD


class ProjectCreate(BaseModel):
    name: str
    description: str
    status: str
    deadline: date

# ---------------- APP ----------------

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "ProManage Backend Running"}

# ---------------- TASK CRUD ----------------

@app.post("/tasks/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        project_id=task.project_id   # 🔥 ADD
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.get("/tasks/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()

    if not t:
        raise HTTPException(404, "Task not found")

    for k, v in task.dict().items():
        setattr(t, k, v)

    db.commit()
    db.refresh(t)
    return t


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(404,"Task not found")
    db.delete(t)
    db.commit()
    return {"message":"Task deleted"}

# ---------------- PROJECT CRUD ----------------

@app.post("/projects/")
def create_project(p: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**p.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@app.get("/projects/")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.put("/projects/{project_id}")
def update_project(project_id:int, p:ProjectCreate, db:Session=Depends(get_db)):
    pr = db.query(Project).filter(Project.id==project_id).first()
    if not pr:
        raise HTTPException(404,"Project not found")

    for k,v in p.dict().items():
        setattr(pr,k,v)

    db.commit()
    db.refresh(pr)
    return pr

@app.delete("/projects/{project_id}")
def delete_project(project_id:int, db:Session=Depends(get_db)):
    pr = db.query(Project).filter(Project.id==project_id).first()
    if not pr:
        raise HTTPException(404,"Project not found")
    db.delete(pr)
    db.commit()
    return {"message":"Project deleted successfully"}

# ---------------- LOGIN ----------------

@app.post("/login/")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    email = data.email.strip()
    password = data.password.strip()
    role = data.role.strip().lower()

    user = db.query(User).filter(User.email == email).first()

    print("FRONTEND →", email, password, role)

    if not user:
        print(f"Login failed: Email {email} not found")
        raise HTTPException(401,"Email not found")

    if user.password != password:
        print(f"Login failed: Password incorrect for {email}")
        raise HTTPException(401,"Password incorrect")

    if user.role != role:
        print(f"Login failed: Role mismatch. Expected {user.role}, got {role}")
        raise HTTPException(401,"Role incorrect")

    user.login_count = (user.login_count or 0) + 1
    user.is_logged_in = True
    user.last_login = datetime.now()

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "login_count": user.login_count,
        "is_logged_in": user.is_logged_in,
        "last_login": user.last_login
    }

# ---------------- LOGOUT ----------------

@app.post("/logout/{user_id}")
def logout(user_id:int, db:Session=Depends(get_db)):
    user = db.query(User).filter(User.id==user_id).first()
    user.is_logged_in = False
    db.commit()
    return {"message":"Logged out"}

# ---------------- REGISTER ----------------

@app.post("/register/")
def register(data: RegisterRequest, db:Session=Depends(get_db)):
    
    # Check if user exists
    if db.query(User).filter(User.email==data.email).first():
        raise HTTPException(400, "User already exists")

    new_user = User(
        name=data.name,
        email=data.email,
        password=data.password,
        role=data.role.lower()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@app.post("/members/", response_model=MemberOut)
def create_member(m: MemberCreate, db: Session = Depends(get_db)):

    if db.query(Member).filter(Member.email == m.email).first():
        raise HTTPException(400, "Email already exists")

    new_member = Member(
        name=m.name,
        email=m.email,
        password=m.password,
        role=m.role,
        position=m.position,
        is_active=m.is_active
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_member


@app.get("/members/")
def get_members(db: Session = Depends(get_db)):
    return db.query(Member).all()

@app.put("/members/{id}")
def update_member(id:int, member:dict, db:Session=Depends(get_db)):
    db.execute(text("""
        UPDATE members 
        SET name=:name,email=:email,position=:position,is_active=:is_active
        WHERE id=:id
    """),{**member,"id":id})
    db.commit()
    return {"message":"Updated"}


@app.delete("/members/{id}")
def delete_member(id:int, db:Session=Depends(get_db)):
    mem = db.query(Member).filter(Member.id==id).first()
    if not mem:
        raise HTTPException(404,"Member not found")

    db.delete(mem)
    db.commit()
    return {"message":"Member deleted"}

@app.post("/admin/create-task/")
def admin_create_task(title:str, description:str, priority:str, db:Session=Depends(get_db)):

    task = Task(
        title=title,
        description=description,
        priority=priority,
        status="Pending",
        created_by_role="admin"
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task

@app.get("/manager/members/")
def manager_members(db:Session=Depends(get_db)):
    return db.query(Member).all()


@app.put("/manager/assign-task/")
def assign_task(task_id:int, member_id:int, db:Session=Depends(get_db)):
    task = db.query(Task).filter(Task.id==task_id).first()
    task.assigned_to = member_id
    db.commit()
    return {"message":"Task assigned"}


from sqlalchemy import text

from sqlalchemy import text

@app.get("/manager/tasks-with-member/")
def get_tasks_with_member(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            t.id,
            t.title,
            t.status,
            t.priority,
            t.assigned_to,
            m.name AS member_name
        FROM tasks t
        LEFT JOIN members m ON t.assigned_to = m.id
    """))

    rows = result.fetchall()

    return [
        {
            "id": r.id,
            "title": r.title,
            "status": r.status,
            "priority": r.priority,
            "assigned_to": r.assigned_to,
            "member": r.member_name
        }
        for r in rows
    ]


@app.get("/manager/stats/")
def manager_stats(db:Session=Depends(get_db)):

    total = db.query(Task).filter(Task.created_by_role=="admin").count()
    pending = db.query(Task).filter(Task.status=="Pending").count()
    completed = db.query(Task).filter(Task.status=="Completed").count()
    progress = db.query(Task).filter(Task.status=="In Progress").count()

    return {
        "total": total,
        "pending": pending,
        "completed": completed,
        "progress": progress
    }

@app.get("/manager/tasks/")
def manager_tasks(db:Session=Depends(get_db)):
    return db.query(Task).filter(Task.created_by_role=="admin").all()


@app.get("/manager/projects/")
def manager_projects(db:Session=Depends(get_db)):
    return db.query(Project).all()

@app.put("/manager/update-task-status/{task_id}")
def update_task_status_manager(task_id:int, status:str, db:Session=Depends(get_db)):
    task = db.query(Task).filter(Task.id==task_id).first()
    if not task:
        raise HTTPException(404,"Task not found")

    task.status = status
    db.commit()
    db.refresh(task)
    return task

@app.put("/manager/update-task/{id}")
def update_task_manager(id:int, data:dict, db:Session=Depends(get_db)):
    t = db.query(Task).filter(Task.id==id).first()
    if not t:
         raise HTTPException(404,"Task not found")
         
    if "status" in data:
        t.status = data["status"]
    if "assigned_to" in data:
        t.assigned_to = data["assigned_to"]
    db.commit()
    
    if "comment" in data and data["comment"]:
        new_comment = TaskComment(
            task_id=id,
            user_id=1,  # Placeholder: In real app, get from current_user
            comment_text=data["comment"]
        )
        db.add(new_comment)
        db.commit()
    
    return {"message": "Updated"}

@app.delete("/manager/delete-task/{id}")
def delete_task_manager(id:int, db:Session=Depends(get_db)):
    t=db.query(Task).filter(Task.id==id).first()
    if not t:
        raise HTTPException(404, "Task not found")
    db.delete(t)
    db.commit()
    return {"msg":"deleted"}

@app.post("/manager/create-task-manager/")
def create_task_manager(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        project_id=task.project_id,
        created_by_role="manager"
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

