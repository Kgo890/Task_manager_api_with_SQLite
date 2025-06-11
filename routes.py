# API routes/endpoints
from flask import jsonify, Blueprint, request
from models import Task

# Blueprint object
tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route("/tasks", methods=["GET"])
def get_multiple_task():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])
