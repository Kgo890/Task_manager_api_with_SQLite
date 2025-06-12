# API routes/endpoints
from flask import jsonify, Blueprint, request
from models import Task
from datetime import datetime
from extensions import db

# Blueprint object
tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route("/tasks", methods=["GET"])
def get_multiple_task():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


@tasks_bp.route("/tasks", methods=["POST"])
def create_tasks():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    status = data.get("status", False)
    due_date = data.get("due_date")
    if due_date:
        due_date = datetime.fromisoformat(due_date)
    else:
        due_date = None

    task = Task(title, description, status, due_date)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict())


@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    title = data.get("title")
    description = data.get("description")
    status = data.get("status", False)
    due_date = data.get("due_date")
    if task is None:
        return jsonify({"error": "Task not found"})
    else:
        task.title = title
        task.description = description
        task.status = status
        task.due_date = due_date
        db.session.commit()
    return jsonify(task.to_dict())


@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({"error": "Task not found"})
    else:
        db.session.delete(task)
        db.session.commit()
    return jsonify({"message": "Task deleted successfully"})


@tasks_bp.route("/tasks/filter", methods=["GET"])
def filtering_task():
    pass
