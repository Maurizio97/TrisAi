from flask import Flask, request
import flask
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

n_click = 0
last_index = ''

@app.route('/users', methods=["GET", "POST"])
def users():
    print("users endpoint reached...")
    if request.method == "GET":
        with open("users.json", "r") as f:
            data = json.load(f)
            data.append({
                "username": "user4",
                "pets": ["hamster"]
            })
            return flask.jsonify(data)
    if request.method == "POST":
        received_data = request.get_json()
        print(f"received data: {received_data}")
        message = received_data['data']
        return_data = {
            "status": "success",
            "message": f"received: {message}"
        }
        return flask.Response(response=json.dumps(return_data), status=201)

@app.route('/game', methods=["GET", "POST"])
def play():
    print("users endpoint reached...")
    if request.method == "POST":
        with open("tris.json", "r") as f:
            received_data = request.get_json()
            print('aaa', received_data)
            data = json.load(f)

            global n_click
            global last_index

            n_click += 1
            if received_data['firstMove']:
                last_index = int(list(data[0])[-1]) + 1

                data[0].update({
                    str(last_index): {
                        f"move_{n_click}": received_data['position']
                    }
                })
            else:
                data[0][str(last_index)].update({
                    f"move_{n_click}": received_data['position']
                })

            # write = open("tris.json", "w")
            # print('DATA[0]', data[0])
            # json.dump(data, write)

            # print('CLICK COUNTER', n_click)
            print(json.dumps(data[0], indent=4))
            return flask.jsonify(data)

if __name__ == "__main__":
    app.run("localhost", 6969)