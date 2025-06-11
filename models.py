# database models
from extensions import db
from datetime import datetime


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)  # optional for users
    status = db.Column(db.Boolean, default=False)  # True = done, False = not done
    creation_time = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)  # optional for users

    # need a to_dict() method to convert rows to into Python dicts
    def to_dict(self):
        return {"id": self.id, "title": self.title, "description": self.description, "status": self.status,
                "creation_time": self.creation_time.isoformat() if self.creation_time else None,
                "due_date": self.due_date.isoformat() if self.due_date else None}
