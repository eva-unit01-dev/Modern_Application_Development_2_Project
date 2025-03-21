# from flask_sqlalchemy import SQLAlchemy
# from flask_security import Security, UserMixin, RoleMixin
# from flask_security.models import fsqla_v3 as fsq

# db = SQLAlchemy()
# security = Security()
# fsq.FsModels.set_db_info(db)


# class RoleUsers(db.Model):
#     __tablename__="roles_users"
#     id=db.Column(db.Integer, primary_key=True)
#     user_id=db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
#     role_id=db.Column("role_id", db.Integer, db.ForeignKey("role.id"))

# class User(db.Model, UserMixin):
#     __tablename__ = "user"
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String, nullable=False, unique=True)
#     password = db.Column(db.String, nullable=False)
#     active = db.Column(db.Boolean)
#     fs_uniquifier = db.Column(db.String, nullable=False)
#     roles= db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
#     influencer = db.relationship('Influencer', uselist=False, back_populates='user')
#     sponsor = db.relationship('Sponsor', uselist=False, back_populates='user')

# class Role(db.Model, RoleMixin):
#     __tablename__ = "role"
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String, unique=True, nullable=False)
#     description = db.Column(db.String)

# # class UserRoles(db.Model):
# #     __tablename__ = "userroles"
# #     id = db.Column(db.Integer, primary_key=True)
# #     user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
# #     role_id = db.Column(db.Integer, db.ForeignKey("role.id"))

# class Influencer(db.Model):
#     __tablename__ = "influencer"
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String, nullable=False)
#     full_name = db.Column(db.String, nullable=False)
#     category = db.Column(db.String, nullable=False)
#     niche = db.Column(db.String, nullable=False, default="N/A")
#     no_of_followers = db.Column(db.Integer, nullable=False)
#     flag_status = db.Column(db.String, default="Unflagged")
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     adrequests = db.relationship('Adreq', backref='influencer', lazy=True)
#     user = db.relationship('User', back_populates='influencer')

# class Sponsor(db.Model):
#     __tablename__ = "sponsor"
#     id = db.Column(db.Integer, primary_key=True)
#     spon_type = db.Column(db.String, nullable=False)
#     email = db.Column(db.String, nullable=False)
#     full_name = db.Column(db.String, nullable=False)
#     industry = db.Column(db.String, nullable=False)
#     evaluation = db.Column(db.Integer, nullable=False)
#     flag_status = db.Column(db.String, default="Unflagged")
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     campaigns = db.relationship('Campaign', backref='sponsor', lazy=True)
#     user = db.relationship('User', back_populates='sponsor')

# class Campaign(db.Model):
#     __tablename__ = "campaign"
#     id = db.Column(db.Integer, primary_key=True)
#     spon_id = db.Column(db.Integer, db.ForeignKey("sponsor.id"), nullable=False)
#     name = db.Column(db.String, nullable=False)
#     description = db.Column(db.Text, nullable=False)
#     sdate = db.Column(db.Date, nullable=False)
#     edate = db.Column(db.Date, nullable=False)
#     budget = db.Column(db.Integer, nullable=False)
#     visibility = db.Column(db.String, nullable=False)
#     completion_status = db.Column(db.String, default="Active")
#     flag_status = db.Column(db.String, default="Unflagged")
#     ad_requests = db.relationship('Adreq', backref='campaign', cascade="all, delete-orphan", lazy=True)

# class Adreq(db.Model):
#     __tablename__ = "adreq"
#     id = db.Column(db.Integer, primary_key=True)
#     camp_id = db.Column(db.Integer, db.ForeignKey("campaign.id"), nullable=False)
#     inf_id = db.Column(db.Integer, db.ForeignKey("influencer.id"), nullable=False)
#     messeges = db.Column(db.Text, default="DEFAULT TEMPLATE")
#     requirements = db.Column(db.Text, nullable=False)
#     payment = db.Column(db.Integer, nullable=False)
#     req_status = db.Column(db.String, default="PENDING")
#     sender = db.Column(db.String, default="WAIT")


from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq

db = SQLAlchemy()
security = Security()
fsq.FsModels.set_db_info(db)

class RoleUsers(db.Model):
   # __tablename__ = "roles_users"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
    role_id = db.Column("role_id", db.Integer, db.ForeignKey("role.id"))
    

class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    influencer = db.relationship('Influencer', uselist=False, back_populates='user')
    sponsor = db.relationship('Sponsor', uselist=False, back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'active': self.active,
            'roles': [role.name for role in self.roles]
        }

class Role(db.Model, RoleMixin):
    __tablename__ = "role"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
    

##############TABLE FOR INFLUENCER INFO##############


class Influencer(db.Model):
    __tablename__ = "influencer"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    niche = db.Column(db.String, nullable=False, default="N/A")
    no_of_followers = db.Column(db.Integer, nullable=False)
    flag_status = db.Column(db.String, default="Unflagged")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    adrequests = db.relationship('Adreq', backref='influencer', lazy=True)
    user = db.relationship('User', back_populates='influencer')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'category': self.category,
            'niche': self.niche,
            'no_of_followers': self.no_of_followers,
            'flag_status': self.flag_status
        }


##############TABLE FOR SPONSOR INFO##############

class Sponsor(db.Model):
    __tablename__ = "sponsor"
    id = db.Column(db.Integer, primary_key=True)
    spon_type = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    industry = db.Column(db.String, nullable=False)
    evaluation = db.Column(db.Integer, nullable=False)
    flag_status = db.Column(db.String, default="Unflagged")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    campaigns = db.relationship('Campaign', backref='sponsor', lazy=True)
    user = db.relationship('User', back_populates='sponsor')

    def to_dict(self):
        return {
            'id': self.id,
            'spon_type': self.spon_type,
            'email': self.email,
            'full_name': self.full_name,
            'industry': self.industry,
            'evaluation': self.evaluation,
            'flag_status': self.flag_status
        }


##############TABLE FOR CAMPAIGN INFO##############


class Campaign(db.Model):
    __tablename__ = "campaign"
    id = db.Column(db.Integer, primary_key=True)
    spon_id = db.Column(db.Integer, db.ForeignKey("sponsor.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    sdate = db.Column(db.Date, nullable=False)
    edate = db.Column(db.Date, nullable=False)
    budget = db.Column(db.Integer, nullable=False)
    visibility = db.Column(db.String, nullable=False)
    completion_status = db.Column(db.String, default="Active")
    flag_status = db.Column(db.String, default="Unflagged")
    ad_requests = db.relationship('Adreq', backref='campaign', cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'spon_id': self.spon_id,
            'name': self.name,
            'description': self.description,
            'sdate': self.sdate.isoformat(),
            'edate': self.edate.isoformat(),
            'budget': self.budget,
            'visibility': self.visibility,
            'completion_status': self.completion_status,
            'flag_status': self.flag_status
        }


##############TABLE FOR AD-REQUEST INFO##############

class Adreq(db.Model):
    __tablename__ = "adreq"
    id = db.Column(db.Integer, primary_key=True)
    camp_id = db.Column(db.Integer, db.ForeignKey("campaign.id"), nullable=False)
    inf_id = db.Column(db.Integer, db.ForeignKey("influencer.id"), nullable=False)
    messeges = db.Column(db.Text, default="DEFAULT TEMPLATE")
    requirements = db.Column(db.Text, nullable=False)
    payment = db.Column(db.Integer, nullable=False)
    req_status = db.Column(db.String, default="PENDING")
    sender = db.Column(db.String, default="WAIT")

    def to_dict(self):
        return {
            'id': self.id,
            'camp_id': self.camp_id,
            'inf_id': self.inf_id,
            'messeges': self.messeges,
            'requirements': self.requirements,
            'payment': self.payment,
            'req_status': self.req_status,
            'sender': self.sender
        }
