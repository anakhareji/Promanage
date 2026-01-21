from sqlalchemy import Column, Integer, String,DateTime,Boolean, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from db import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    status = Column(String)
    priority = Column(String)
    project_id = Column(Integer)
    created_by_role = Column(String)

    assigned_to = Column(Integer, ForeignKey("members.id"), nullable=True)

    member = relationship("Member", back_populates="tasks")


class TaskComment(Base):
    __tablename__ = "task_comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer)
    user_id = Column(Integer)
    comment_text = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskAttachment(Base):
    __tablename__ = "task_attachments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer)
    file_name = Column(String(255))
    file_path = Column(String(255))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
class Status(Base):
    __tablename__ = "status_master"

    id = Column(Integer, primary_key=True, index=True)
    status_name = Column(String(50))

class Priority(Base):
    __tablename__ = "priority_master"

    id = Column(Integer, primary_key=True, index=True)
    priority_name = Column(String(50))

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_title = Column(String(150))
    report_type = Column(String(100))
    generated_by = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(100))
    role = Column(String(50))

    login_count = Column(Integer, default=0)
    is_logged_in = Column(Boolean, default=False)
    last_login = Column(DateTime)

from sqlalchemy import Date

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    description = Column(String(255))
    status = Column(String(50))
    deadline = Column(Date)   # 👈 NEW
    created_at = Column(DateTime, default=datetime.utcnow)

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(150), unique=True, index=True)
    password = Column(String(200))
    role = Column(String(50))      # admin / manager / member
    position = Column(String(100))  # Developer, Tester, Designer, etc
    is_active = Column(Boolean, default=True)  # Add this
    tasks = relationship("Task", back_populates="member")
