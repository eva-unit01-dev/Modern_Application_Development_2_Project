from main import app
from application.sec import datastore
from application.models import db
from application.models import *
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is the Admin")
    datastore.find_or_create_role(name="inf", description="User is an Influencer")
    datastore.find_or_create_role(name="spon", description="User is a Sponsor")
    db.session.commit()
    if not datastore.find_user(username="satyaki452"):
        datastore.create_user(username="satyaki452", password=generate_password_hash("150894sg"), roles=["admin"])
    if not datastore.find_user(username="inf1"):
        datastore.create_user(username="inf1", password=generate_password_hash("12345"), roles=["inf"])
    if not datastore.find_user(username="spon1"):
        datastore.create_user(username="spon1", password=generate_password_hash("12345"), roles=["spon"], active=False)
    if not datastore.find_user(username="spon2"):
        datastore.create_user(username="spon2", password=generate_password_hash("12345"), roles=["spon"], active=False)
    
    db.session.commit()









    # admin=Role(name="admin", description="Admin Description")
    # db.session.add(admin)
    # inf=Role(name="inf", description="Influencer Description")
    # db.session.add(inf)
    # spon=Role(name="spon", description="Sponsor Description")
    # db.session.add(spon)
    # try:
    #     db.session.commit()
    # except:
    #     pass

