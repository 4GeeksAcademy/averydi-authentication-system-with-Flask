"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route('/signup', methods=['POST'])
def signup():
    # Retrieve request data
    email = request.json.get('email')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    password = request.json.get('password')
    
    # Check if the email is already registered
    if User.query.filter_by(email=email).first():
        return jsonify(message='Email already registered'), 200

    # Create a new user object
    new_user = User(email=email, first_name=first_name, last_name=last_name, password=password, is_active=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify(message='Failed to register user'), 200

    return jsonify(message='User registered successfully'), 200


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Perform authentication
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"msg": "Incorrect email or password"}), 401

    # Generate access token
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)


@api.route('/logout', methods=['POST, GET'])
def logout():
    # Perform logout 
    return jsonify(message='User logged out successfully'), 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({"id": user.id, "username": user.username }), 200


# # Set up the Flask application
# app = Flask(__name__)
#  # Change this!
# app.register_blueprint(api, url_prefix='/api')  # Register the blueprint


# Additional configuration and app setup code goes here...

if __name__ == "__main__":
    api.run()