from flask import Flask
from config import db_url
from extensions import db
from routes import tasks_bp


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(tasks_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
