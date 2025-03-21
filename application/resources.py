from datetime import datetime
from flask import jsonify
from flask_restful import Resource, Api, reqparse, marshal_with, fields
from flask_security import auth_required, roles_required, login_required, current_user, roles_accepted
from .sec import datastore
from .models import *
from.instances import cache


api=Api(prefix='/api')


##UTILITY FIELD TO FORMAT ROLE NAMES FROM THE ROLES LIST##
class ListField(fields.Raw):
    def format(self, value):
        return ",".join([x.name for x in value])

#xyz_parser=reqparse.RequestParser()



########################PARSING########################

#1. USER
user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=False, help='Username required')
user_parser.add_argument('password', type=str, required=False, help='Password required')
user_parser.add_argument('active', type=bool, required=False, help='Active required')
user_parser.add_argument('roles', type=str, required=False, help='Role required')



#2. INFLUENCER
influencer_parser = reqparse.RequestParser()
influencer_parser.add_argument('email', type = str, required = False, help = 'Email required')
influencer_parser.add_argument('full_name', type = str, required = False, help = 'Full name required')
influencer_parser.add_argument('category', type = str, required = False, help = 'Category required')
influencer_parser.add_argument('niche', type=str, default="N/A")
influencer_parser.add_argument('no_of_followers', type = int, required = False, help = 'Number of Followers required')
influencer_parser.add_argument('flag_status', type=str, default="Unflagged")
influencer_parser.add_argument('user_id', type = int, required = False, help = 'User ID required')



#3. SPONSOR
sponsor_parser = reqparse.RequestParser()
sponsor_parser.add_argument('spon_type', type=str, required=False, help='Sponsor type required')
sponsor_parser.add_argument('email', type=str, required=False, help='Email required')
sponsor_parser.add_argument('full_name', type=str, required=False, help='Full name required')
sponsor_parser.add_argument('industry', type=str, required=False, help='Industry required')
sponsor_parser.add_argument('evaluation', type=int, required=False, help='Evaluation required')
sponsor_parser.add_argument('flag_status', type=str, default="Unflagged")
sponsor_parser.add_argument('user_id', type = int, required = False, help = 'User ID required')


#4. CAMPAIGN
campaign_parser = reqparse.RequestParser()
campaign_parser.add_argument('spon_id', type=int, required=False, help='Sponsor ID required')
campaign_parser.add_argument('name', type=str, required=False, help='Name required')
campaign_parser.add_argument('description', type=str, required=False, help='Description required')
campaign_parser.add_argument('sdate', type=str, required=False, help='Start date required')
campaign_parser.add_argument('edate', type=str, required=False, help='End date required')
campaign_parser.add_argument('budget', type=int, required=False, help='Budget required')
campaign_parser.add_argument('visibility', type=str, required=False, help='Visibility required')
campaign_parser.add_argument('completion_status', type=str, default="Active")
campaign_parser.add_argument('flag_status', type=str, default="Unflagged")


#5. AD REQUEST
adreq_parser = reqparse.RequestParser()
adreq_parser.add_argument('camp_id', type=int, required=False, help='Campaign ID required')
adreq_parser.add_argument('inf_id', type=int, required=False, help='Influencer ID required')
adreq_parser.add_argument('messeges', type=str, default="DEFAULT TEMPLATE")
adreq_parser.add_argument('requirements', type=str, required=False, help='Requirements required')
adreq_parser.add_argument('payment', type=int, required=False, help='Payment required')
adreq_parser.add_argument('req_status', type=str, default="PENDING")
adreq_parser.add_argument('sender', type=str, default="WAIT")




########################RESPONSE FIELDS########################

#1. USER
user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'password': fields.String,
    'active': fields.Boolean,
    'roles': fields.List(fields.String)
    #'roles': ListField(attribute='roles'),
}


#2. INFLUENCER
influencer_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'full_name': fields.String,
    'category': fields.String,
    'niche': fields.String,
    'no_of_followers': fields.Integer,
    'flag_status': fields.String,
    'user_id': fields.Integer
}


#3. SPONSOR
sponsor_fields = {
    'id': fields.Integer,
    'spon_type': fields.String,
    'email': fields.String,
    'full_name': fields.String,
    'industry': fields.String,
    'evaluation': fields.Integer,
    'flag_status': fields.String,
    'user_id': fields.Integer
}


#4. CAMPAIGN
campaign_fields = {
    'id': fields.Integer,
    'spon_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'sdate': fields.String,
    'edate': fields.String,
    'budget': fields.Integer,
    'visibility': fields.String,
    'completion_status': fields.String,
    'flag_status': fields.String
}


#5. ADREQUEST
adreq_fields = {
    'id': fields.Integer,
    'camp_id': fields.Integer,
    'inf_id': fields.Integer,
    'messeges': fields.String,
    'requirements': fields.String,
    'payment': fields.Integer,
    'req_status': fields.String,
    'sender': fields.String
}




########################RESOURCES########################

#1. USER
class UserResource(Resource):
    @auth_required('token')
    @cache.cached(timeout =5)
    @marshal_with(user_fields)
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {'message': 'User is not found'}, 404
        return user

    @marshal_with(user_fields)
    def post(self):
        args = user_parser.parse_args()
        user = User(username=args['username'], password=args['password'], active=args['active'])
        for role_name in args['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                datastore.add_role_to_user(user, role)
                #user.roles.append(role)
        db.session.add(user)
        db.session.commit()
        return user, 201

    @marshal_with(user_fields)
    def put(self, id):
        args = user_parser.parse_args()
        user = User.query.get(id)
        if not user:
            return {'message': 'User is not found'}, 404
        if args['username']:
            user.username = args['username']
        if args['password']:
            user.password = args['password']
        if args['active']:
            user.active = args['active']
        # user.active = args['active']
        # user.roles = []
        for role_name in args['roles']:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                datastore.add_role_to_user(user, role)
                #user.roles.append(role)
        db.session.commit()
        return user
    
    @marshal_with(user_fields)
    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return {'message': 'User is not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return '', 204
    


#2. INFLUENCER
class InfluencerResource(Resource):
    @auth_required('token')
    @cache.cached(timeout =5)
    @marshal_with(influencer_fields)
    def get(self, id):
        influencer = Influencer.query.get(id)
        if not influencer:
            return {'message': 'Influencer is not found'}, 404
        return influencer

    @marshal_with(influencer_fields)
    def post(self):
        args = influencer_parser.parse_args()
        influencer = Influencer(email=args['email'], full_name=args['full_name'], category=args['category'], niche=args['niche'], no_of_followers=args['no_of_followers'], flag_status=args['flag_status'], user_id = args['user_id'])
        db.session.add(influencer)
        db.session.commit()
        return influencer, 201

    @marshal_with(influencer_fields)
    def put(self, id):
        args = influencer_parser.parse_args()
        influencer = Influencer.query.get(id)
        if not influencer:
            return {'message': 'Influencer is not found'}, 404
        if args['email']:
            influencer.email = args['email']
        if args['full_name']:
            influencer.full_name = args['full_name']
        if args['category']:
            influencer.category = args['category']
        if args['niche']:
            influencer.niche = args['niche']
        if args['no_of_followers']:
            influencer.no_of_followers = args['no_of_followers']
        if args['flag_status']:
            influencer.flag_status = args['flag_status']
        if args['user_id']:
            influencer.user_id = args['user_id']
        db.session.commit()
        return influencer

    @marshal_with(influencer_fields)
    def delete(self, id):
        influencer = Influencer.query.get(id)
        if not influencer:
            return {'message': 'Influencer is not found'}, 404
        db.session.delete(influencer)
        db.session.commit()
        return '', 204
    


#3. SPONSOR
class SponsorResource(Resource):
    @auth_required('token')
    @cache.cached(timeout =5)
    @marshal_with(sponsor_fields)
    def get(self, id):
        sponsor = Sponsor.query.get(id)
        if not sponsor:
            return {'message': 'Sponsor is not found'}, 404
        return sponsor

    @marshal_with(sponsor_fields)
    def post(self):
        args = sponsor_parser.parse_args()
        sponsor = Sponsor(spon_type=args['spon_type'], email=args['email'], full_name=args['full_name'], industry=args['industry'], evaluation=args['evaluation'], flag_status=args['flag_status'], user_id = args['user_id'])
        db.session.add(sponsor)
        db.session.commit()
        return sponsor, 201

    @marshal_with(sponsor_fields)
    def put(self, id):
        args = sponsor_parser.parse_args()
        sponsor = Sponsor.query.get(id)
        if not sponsor:
            return {'message': 'Sponsor is not found'}, 404
        if args['spon_type']:
            sponsor.spon_type = args['spon_type']
        if args['email']:
            sponsor.email = args['email']
        if args['full_name']:
            sponsor.full_name = args['full_name']
        if args['industry']:
            sponsor.industry = args['industry']
        if args['evaluation']:
            sponsor.evaluation = args['evaluation']
        if args['flag_status']:
            sponsor.flag_status = args['flag_status']
        if args['user_id']:
            sponsor.user_id = args['user_id']
        db.session.commit()
        return sponsor
    

    @marshal_with(sponsor_fields)
    def delete(self, id):
        sponsor = Sponsor.query.get(id)
        if not sponsor:
            return {'message': 'Sponsor is not found'}, 404
        db.session.delete(sponsor)
        db.session.commit()
        return '', 204
    
    # def get_sponsor_by_id(sponsor_id):
    #     sponsor = Sponsor.query.get(sponsor_id)
    #     return sponsor.to_dict() if sponsor else None



#4. CAMPAIGN
class CampaignResource(Resource):
    @auth_required('token')
    @cache.cached(timeout =5)
    @marshal_with(campaign_fields)
    def get(self, id):
        campaign = Campaign.query.get(id)
        # if campaign:
        #     return jsonify({'campaign': campaign.to_dict()})
        # else:
        #     return {'message': 'Campaign not found'}, 404
        if not campaign:
            return {'message': 'Campaign is not found'}, 404
        return campaign

    @marshal_with(campaign_fields)
    def post(self):
        args = campaign_parser.parse_args()

        try:
            sdate = args['sdate']
            edate = args['edate']
            if sdate is None or edate is None:
              return {'message': 'Start date and end date are required.'}, 400
            sdate = datetime.strptime(args['sdate'], '%Y-%m-%d').date()
            edate = datetime.strptime(args['edate'], '%Y-%m-%d').date()

        except ValueError:
            return {'message': 'Invalid date format. Use YYYY-MM-DD.'}, 400
        except TypeError:
            return {'message': 'Start date and end date must be strings.'}, 400

        #campaign = Campaign(spon_id=args['spon_id'], name=args['name'], description=args['description'], sdate=sdate, edate=edate, budget=args['budget'], visibility=args['visibility'], completion_status=args['completion_status'], flag_status=args['flag_status'])
        campaign = Campaign(spon_id=args['spon_id'], name=args['name'], description=args['description'], sdate=sdate, edate=edate, budget=args['budget'], visibility=args['visibility'],  flag_status=args['flag_status'])
        db.session.add(campaign)
        db.session.commit()
        return campaign, 201

    @marshal_with(campaign_fields)
    def put(self, id):
        args = campaign_parser.parse_args()
        campaign = Campaign.query.get(id)
        if not campaign:
            return {'message': 'Campaign is not found'}, 404
        if args['spon_id']:
            campaign.spon_id = args['spon_id']
        if args['name']:
            campaign.name = args['name']
        if args['description']:
            campaign.description = args['description']
        if args['sdate']:

            try:
                campaign.sdate = datetime.strptime(args['sdate'], '%Y-%m-%d').date()
            except ValueError:
                return {'message': 'Invalid start date format. Use YYYY-MM-DD.'}, 400

            # campaign.sdate = args['sdate']

        if args['edate']:

            try:
                campaign.edate = datetime.strptime(args['edate'], '%Y-%m-%d').date()
            except ValueError:
                return {'message': 'Invalid end date format. Use YYYY-MM-DD.'}, 400


            # campaign.edate = args['edate']


        if args['budget']:
            campaign.budget = args['budget']
        if args['visibility']:
            campaign.visibility = args['visibility']
        if args['completion_status']:
            campaign.completion_status = args['completion_status']
        if args['flag_status']:
            campaign.flag_status = args['flag_status']
        db.session.commit()
        return campaign
    

    @marshal_with(campaign_fields)
    def delete(self, id):
        campaign = Campaign.query.get(id)
        if not campaign:
            return {'message': 'Campaign is not found'}, 404
        db.session.delete(campaign)
        db.session.commit()
        return '', 204
    




#5. ADREQUEST
class AdreqResource(Resource):
    @auth_required('token')
    @cache.cached(timeout =5)
    @marshal_with(adreq_fields)
    def get(self, id):
        adreq = Adreq.query.get(id)
        if not adreq:
            return {'message': 'Ad request is not found'}, 404
        return adreq

    @marshal_with(adreq_fields)
    def post(self):
        args = adreq_parser.parse_args()
        adreq = Adreq(camp_id=args['camp_id'], inf_id=args['inf_id'], messeges=args['messeges'], requirements=args['requirements'], payment=args['payment'], req_status=args['req_status'], sender=args['sender'])
        db.session.add(adreq)
        db.session.commit()
        return adreq, 201

    @marshal_with(adreq_fields)
    def put(self, id):
        args = adreq_parser.parse_args()
        adreq = Adreq.query.get(id)

        adreq.camp_id = args['camp_id'] if args['camp_id'] is not None else adreq.camp_id
        adreq.inf_id = args['inf_id'] if args['inf_id'] is not None else adreq.inf_id
        # adreq.messeges = args['messeges'] if args['messeges'] is not None else adreq.messeges
        adreq.requirements = args['requirements'] if args['requirements'] is not None else adreq.requirements
        adreq.payment = args['payment'] if args['payment'] is not None else adreq.payment
        adreq.req_status = args['req_status'] if args['req_status'] is not None else adreq.req_status

        # adreq.sender = args['sender'] if args['sender'] is not None else adreq.sender

        # if not adreq:
        #     return {'message': 'Ad request is not found'}, 404
        # if args['camp_id']:
        #     adreq.camp_id = args['camp_id']
        # if args['inf_id']:
        #     adreq.inf_id = args['inf_id']
        # if args['messeges']:
        #     adreq.messeges = args['messeges']
        # if args['requirements']:
        #     adreq.requirements = args['requirements']
        # if args['payment']:
        #     adreq.payment = args['payment']
        # if args['req_status']:
        #     adreq.req_status = args['req_status']
        # # if args['sender']:
        # #     adreq.sender = args['sender']

        # if 'sender' in args and args['sender'] is not None:
        #     adreq.sender = args['sender']
        db.session.commit()
        return adreq


    @marshal_with(adreq_fields)
    def delete(self, id):
        adreq = Adreq.query.get(id)
        if not adreq:
            return {'message': 'Ad request is not found'}, 404
        db.session.delete(adreq)
        db.session.commit()
        return '', 204
    




########################API ENDPOINTS########################
api.add_resource(UserResource, '/user', '/user/<int:id>')
api.add_resource(InfluencerResource, '/influencer', '/influencer/<int:id>')
api.add_resource(SponsorResource, '/sponsor', '/sponsor/<int:id>')
api.add_resource(CampaignResource, '/campaign', '/campaign/<int:id>')
api.add_resource(AdreqResource, '/adrequest', '/adrequest/<int:id>')





# api.add_resource(UserResource, '/user', '/user/<int:id>')
# api.add_resource(InfluencerResource, '/influencer', '/influencer/<int:id>')
# api.add_resource(SponsorResource, '/sponsor', '/sponsor/<int:id>')
# api.add_resource(CampaignResource, '/campaign', '/campaign/<int:id>')
# api.add_resource(AdreqResource, '/adreq', '/adreq/<int:id>')
















# id = db.Column(db.Integer, primary_key=True)
#     camp_id = db.Column(db.Integer, db.ForeignKey("campaign.id"), nullable=False)
#     inf_id = db.Column(db.Integer, db.ForeignKey("influencer.id"), nullable=False)
#     messeges = db.Column(db.Text, default="DEFAULT TEMPLATE")
#     requirements = db.Column(db.Text, nullable=False)
#     payment = db.Column(db.Integer, nullable=False)
#     req_status = db.Column(db.String, default="PENDING")
#     sender = db.Column(db.String, default="WAIT")




# class TestingApi(Resource):
#     def get(self):
#         return {"message":"hello from api"}
    

#     def post(self):
#         pass
    
# api.add_resource(TestingApi,'/testingapi')