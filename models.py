# database models
from app import db
from datetime import datetime


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)  # optional for users
    status = db.Column(db.Boolean, default=False)  # True = done, False = not done
    creation_time = db.Column(db.Datetime, default=datetime.utcnow)
    due_date = db.Column(db.Datetime, nullable=True)  # optional for users
