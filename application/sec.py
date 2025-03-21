from flask_security import SQLAlchemyUserDatastore, Security
from .models import *

datastore=SQLAlchemyUserDatastore(db, User, Role)