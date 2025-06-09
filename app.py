# main flask app

from flask import Flask

app = Flask(__name__)


@app.route('/')
def check():
    return 'Hello world'


if __name__ == '__main__':
    app.run()
