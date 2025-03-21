from flask import current_app as app, jsonify, logging, request, render_template, send_file, send_from_directory, session
from flask_security import auth_required, roles_required
from .models import *
from .sec import datastore
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
# from .tasks import say_hello
import flask_excel as excel
from .tasks import create_user_csv
from celery.result import AsyncResult
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import SQLAlchemyError
from .resources import *


@app.get('/')
def home():
    return render_template("index.html")


##USER LOGIN##
@app.post("/user/login")
def user_login():
    data=request.get_json()
    username=data.get("username")
    if not username:
        return jsonify ({"message": "Usernanme not provided"}), 400
    
    user=datastore.find_user(username=username)
    
    if not user:
        return jsonify({"message":"User Not Found"}), 404
    if check_password_hash(user.password, data.get("password")):
        if not user.active:
            return jsonify({"message":"User account is inactive"}), 403
        #return user.get_auth_token()
        return jsonify({'token': user.get_auth_token(), 'role': user.roles[0].name, 'username': user.username, 'id': user.id}), 200
        
    else:
        return jsonify({"message":"Wrong Password"}), 400
    

user_fields={
    "id": fields.Integer,
    "username":fields.String,
    "active":fields.Boolean
}


##REGISTRATION##
@app.post("/register")
def register():
    data=request.get_json()

    username=data.get('username')
    password=generate_password_hash(data.get('password'))
    role=data.get("role")
    email=data.get("email")

    if not username or not password or not role in ['inf','spon']:
        return jsonify({"message":"invalid input"})
    if datastore.find_user(username=username):
        return jsonify({"message":"user already exists"})

    user=datastore.create_user(username=username, password=password)
    role=datastore.find_or_create_role(name=role)
    datastore.add_role_to_user(user,role)
    db.session.commit()

    if role=="inf":
        full_name=data.get("full_name")
        category=data.get("category")
        niche=data.get("niche","N/A")
        no_of_followers=data.get("no_of_followers")

        influencer=Influencer(
            user_id=user.id,
            email=email,
            full_name=full_name,
            category=category,
            niche=niche,
            no_of_followers=no_of_followers
            )
        user.active=True
        db.session.add(influencer)

    elif role=="spon":
        spon_type=data.get("spon_type")
        full_name = data.get('full_name')
        industry = data.get('industry')
        evaluation = data.get('evaluation')

        sponsor=Sponsor(
            user_id=user.id,
            email=email,
            spon_type=spon_type,
            full_name=full_name,
            industry=industry,
            evaluation=evaluation
                
            )
        user.active = False
        db.session.add(sponsor)
        
    db.session.commit()
    return jsonify({"message": "User registered successfully"})


########################ADMIN########################

##TO SHOW USERS##
@app.get("/users")
@auth_required("token")
@roles_required("admin")
def all_users():
    users=User.query.all()
    if len(users)==0:
        return jsonify({"message":"No User Found"}), 404
    return marshal(users, user_fields)


##TO ACTIVATE SPONSORS##
@app.get('/activate/spon/<int:spon_id>')
@auth_required("token")
@roles_required("admin")
def activate_sponsor(spon_id):
    sponsor=User.query.get(spon_id)
    if not sponsor or "spon" not in sponsor.roles:
        return jsonify({"message":"Sponsor not found"}), 404
    
    sponsor.active=True
    db.session.commit()
    return jsonify({"message":"Sponsor Activated"})


##FOR AdminInfSearch##
# from flask import jsonify, request
# from flask_security import auth_required, roles_required
# from .models import Influencer, db

@app.route('/inflist', methods=['GET'])
@auth_required('token')
@roles_required('admin')  
def get_influencers_admin():
    influencers = Influencer.query.all()
    return jsonify({"influencers": [inf.to_dict() for inf in influencers]}), 200


##FOR AdminSponSearch##
@app.route('/sponlist', methods=['GET'])
@auth_required('token')
@roles_required('admin')
def get_sponsors_admin():
    sponsors = Sponsor.query.all()
    return jsonify({"sponsors": [sponsor.to_dict() for sponsor in sponsors]}), 200


##FOR AdminCamp##
@app.route('/camplist',methods=['GET'])
@auth_required('token')
@roles_required('admin')
def get_campaigns_admin():
    campaigns = Campaign.query.all()
    return jsonify({"campaigns": [campaign.to_dict() for campaign in campaigns]}), 200


##FOR AdminAr##
@app.route('/adlist',methods=['GET'])
@auth_required('token')
@roles_required('admin')
def adlist():
    ad_requests = Adreq.query.all()
    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##FOR INF STATS##
@app.route("/admin_inf_stats", methods=['GET'])
@auth_required('token')
@roles_required('admin')
def admin_inf_stats():
    influencers = Influencer.query.all()
    ad_requests = Adreq.query.all()

    names = [inf.full_name for inf in influencers]
    followers = [inf.no_of_followers for inf in influencers]
    categories = [inf.category for inf in influencers]

    payments = [req.payment for req in ad_requests]
    
    total_influencers = len(influencers)
    avg_followers = sum(followers) / total_influencers if total_influencers > 0 else 0
    category_counts = {category: categories.count(category) for category in set(categories)}
    
    highest_followers = max(followers) if followers else 0
    lowest_followers = min(followers) if followers else 0
    highest_payment = max(payments) if payments else 0
    lowest_payment = min(payments) if payments else 0
    avg_payment = sum(payments) / len(payments) if payments else 0

    data = {
        'names': names,
        'followers': followers,
        'categories': categories,
        'total_influencers': total_influencers,
        'avg_followers': avg_followers,
        'category_counts': category_counts,
        'highest_followers': highest_followers,
        'lowest_followers': lowest_followers,
        'highest_payment': highest_payment,
        'lowest_payment': lowest_payment,
        'avg_payment': avg_payment
    }

    return jsonify(data)


##FOR SPON STAT##
@app.route("/admin_spon_stats", methods=['GET'])
@auth_required('token')
@roles_required('admin')
def admin_spon_stats():
    sponsors = Sponsor.query.all()
    total_sponsors = len(sponsors)
    avg_evaluation = sum([s.evaluation for s in sponsors]) / total_sponsors if total_sponsors > 0 else 0
    highest_evaluation = max([s.evaluation for s in sponsors], default=0)
    lowest_evaluation = min([s.evaluation for s in sponsors], default=0)
    highest_budget = max([c.budget for s in sponsors for c in s.campaigns], default=0)
    lowest_budget = min([c.budget for s in sponsors for c in s.campaigns], default=0)
    avg_budget = sum([c.budget for s in sponsors for c in s.campaigns]) / (len([c.budget for s in sponsors for c in s.campaigns]) or 1)
    industry_counts = {industry: sum([1 for s in sponsors if s.industry == industry]) for industry in set(s.industry for s in sponsors)}
    
    ad_requests = Adreq.query.all()
    total_ad_requests = len(ad_requests)
    accepted_ad_requests = sum(1 for r in ad_requests if r.req_status == "Accepted")
    rejected_ad_requests = sum(1 for r in ad_requests if r.req_status == "Rejected")
    ad_requests_by_sponsors = sum(1 for r in ad_requests if r.sender == "S")
    ad_requests_by_influencers = sum(1 for r in ad_requests if r.sender == "I")

    data = {
        "total_sponsors": total_sponsors,
        "avg_evaluation": avg_evaluation,
        "highest_evaluation": highest_evaluation,
        "lowest_evaluation": lowest_evaluation,
        "highest_budget": highest_budget,
        "lowest_budget": lowest_budget,
        "avg_budget": avg_budget,
        "industry_counts": industry_counts,
        "total_ad_requests": total_ad_requests,
        "accepted_ad_requests": accepted_ad_requests,
        "rejected_ad_requests": rejected_ad_requests,
        "ad_requests_by_sponsors": ad_requests_by_sponsors,
        "ad_requests_by_influencers": ad_requests_by_influencers,
        "names": [s.full_name for s in sponsors],
        "budgets": [sum([c.budget for c in s.campaigns]) for s in sponsors]
    }
    return jsonify(data)




# @app.route('/api/influencer/<int:id>', methods=['PUT'])
# @auth_required('token')
# @roles_required('admin')  
# def update_influencer(id):
#     influencer = Influencer.query.get_or_404(id)
#     data = request.json

#     if 'flag_status' in data:
#         influencer.flag_status = data['flag_status']

#     db.session.commit()
#     return jsonify(influencer.to_dict()), 200




#######################CELERY#######################

##CREATING END-POINT##

# @app.get("/say-hello")
# def say_hello_view():
#     t=say_hello.delay()
#     return jsonify({"task-id":t.id})


@app.get("/download-csv")
# @auth_required('token')
# @roles_required('spon')
def download_csv():
    user_id=current_user.id
    task=create_user_csv.delay(user_id)
    return jsonify({"task_id":task.id}), 200
    # return send_from_directory("",f'campaign_report.csv')


@app.get("/get-csv/<task_id>")
# @auth_required('token')
# @roles_required('spon')
def get_csv(task_id):
    res=AsyncResult(task_id)
    if res.ready():
        filename=res.result
    
        return send_file(filename, as_attachment=True, download_name='campaign_report.csv')
    else:
        return jsonify({"message":"TASK PENDING"}),404

# @app.get("/get-csv-status/<task_id>")
# @auth_required('token')
# @roles_required('spon')
# def get_csv_status(task_id):
#     res = AsyncResult(task_id)
    
#     if res.ready():
#         return jsonify({
#             "status": "ready",
#             "download_url": f"/get-csv/{task_id}"  # URL for downloading the file
#         }), 200
#     else:
#         return jsonify({"status": "pending"}), 404




#####################################SPONSOR######################################

# ##TO SEE THE DETAILS OF THE SPONSOR ON DASHBOARD
# @app.route('/api/sponsor/details', methods=['GET'])
# def get_sponsor_details():
#     # Assuming the sponsor ID is stored in the session after login
#     sponsor_id = session.get('id')

#     if not sponsor_id:
#         return jsonify({'error': 'User not logged in'}), 401

#     sponsor = SponsorResource(id)  # Fetch the sponsor details from the database

#     if not sponsor:
#         return jsonify({'error': 'Sponsor not found'}), 404

#     # Assuming sponsor is a dictionary or object with these attributes
#     return jsonify({
#         'username': sponsor.username,
#         'email': sponsor.email,
#         'full_name': sponsor.full_name,
#         'spon_type': sponsor.spon_type,
#         'industry': sponsor.industry,
#         'evaluation': sponsor.evaluation
#     })


# @app.route('/sponsor/profile', methods = ['GET'])
# @roles_required('Sponsor')
# @auth_required('token')
# def sponsor_profile():
#     sponsor = Sponsor.query.filter_by(user_id = current_user.id).first()

#     return jsonify({"sponsor": sponsor.to_dict()}), 200

@app.route('/sponsor/profile', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def sponsor_profile():
    
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        
        return jsonify({"message": "Sponsor not found"}), 404
    
    return jsonify({"sponsor": sponsor.to_dict()}), 200




# @app.route('/api/sponsor/<int:id>', methods=['PUT'])
# @auth_required('token')
# @roles_required('spon')
# def update_sponsor(id):
#     sponsor = Sponsor.query.get(id)
#     if not sponsor:
#         return jsonify({'message': 'Sponsor not found'}), 404
    
#     data = request.get_json()
#     if 'full_name' in data:
#         sponsor.full_name = data['full_name']
#     if 'email' in data:
#         sponsor.email = data['email']
#     if 'industry' in data:
#         sponsor.industry = data['industry']
#     if 'evaluation' in data:
#         sponsor.evaluation = data['evaluation']
#     if 'flag_status' in data:
#         sponsor.flag_status = data['flag_status']
#     if 'spon_type' in data:
#         sponsor.spon_type = data['spon_type']
    
#     db.session.commit()
#     return jsonify(sponsor.to_dict()), 200

##TO SHOW THE LIST OF CAMPAIGNS FOR A PARTICULAR USER
@app.route('/sponsor/campaigns', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def sponsor_campaigns():
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404

    campaigns = Campaign.query.filter_by(spon_id=sponsor.id).all()
    if not campaigns:
        return jsonify({"message": "No campaigns found"}), 404

    return jsonify({"campaigns": [campaign.to_dict() for campaign in campaigns]}), 200


##TO SHOW THE LIST OF INFLUENCERS DURING CREATING AD REQUEST FOR A PARTICULAR CAMPAIGN

@app.route('/influencers-drop', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def get_influencers():
    influencers = Influencer.query.filter_by(flag_status='Unflagged').all()
    if not influencers:
        return jsonify({"message": "No influencers found"}), 404
    
    return jsonify({"influencers": [influencer.to_dict() for influencer in influencers]}), 200


##TO SHOW THE LIST OF AD REQUESTS IN REQUESTS SENT
@app.route('/sponsor/adrequests', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def get_sponsor_ad_requests():
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404
    ad_requests = Adreq.query.join(Campaign).filter(Campaign.spon_id==sponsor.id, Adreq.req_status=='PENDING', Adreq.sender=='S').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404
    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##TO SHOW THE REQUEST STATUS FOR SPONSOR
@app.route('/sponsor/adrequests/status', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def get_sponsor_ad_requests_status():
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404

    # ad_requests = Adreq.query.filter_by(sender='S').all()
    ad_requests = Adreq.query.join(Campaign).filter(Campaign.spon_id==sponsor.id, Adreq.sender=='S').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404

    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##RECEIVED REQUEST FOR SPON
@app.route('/adrequests-for-spon', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def adrequest_for_spon():
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404
    ad_requests = Adreq.query.join(Campaign).filter(Campaign.spon_id==sponsor.id, Adreq.req_status=='PENDING', Adreq.sender=='I').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404
    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##INFLUENCERS AT WORK##
@app.route('/sponsor/influencers-at-work', methods=['GET'])
@auth_required('token')
@roles_required('spon')
def get_influencers_at_work():
    sponsor = Sponsor.query.filter_by(user_id=current_user.id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404

    accepted_influencers = (
        db.session.query(Influencer)
        .join(Adreq, Adreq.inf_id == Influencer.id)
        .join(Campaign, Campaign.id == Adreq.camp_id)
        .filter(
            Campaign.spon_id == sponsor.id,
            Adreq.req_status == 'Accepted',
            Adreq.sender == 'S',
            Campaign.flag_status == 'Unflagged'
        )
        .all()
    )

    if not accepted_influencers:
        return jsonify({"message": "No influencers found"}), 404

    return jsonify({"influencers": [influencer.to_dict() for influencer in accepted_influencers]}), 200









#####################################Influencer######################################

##TO SEE THEIR PROFILE AND EDIT IF NECESSARY##
@app.route('/influencer/profile', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_influencer_profile():
    
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404
    
    return jsonify({"influencer": influencer.to_dict()}), 200

##TO FIND CAMPAIGNS AND CREATING AD REQUEST FOR THEM
@app.route('/campaigns/unflagged', methods=['GET'])
@auth_required('token')
@roles_required('inf')  
def get_unflagged_campaigns():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404

    campaigns = Campaign.query.filter_by(flag_status='Unflagged').all()
    if not campaigns:
        return jsonify({"campaigns": []}), 200

    return jsonify({"campaigns": [campaign.to_dict() for campaign in campaigns]}), 200




@app.route('/api/campaigns', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_campaigns():
    search_term = request.args.get('searchTerm', '')
    min_evaluation = request.args.get('minEvaluation', type=int, default=0)
    max_evaluation = request.args.get('maxEvaluation', type=int, default=1000000)

    # Query the campaigns based on the filter criteria
    campaigns_query = Campaign.query.filter(
        Campaign.flag_status == 'Unflagged',
        Campaign.budget >= min_evaluation,
        Campaign.budget <= max_evaluation,
        Campaign.name.ilike(f'%{search_term}%')
    ).all()

    if not campaigns_query:
        return jsonify({"message": "No campaigns found"}), 404

    return jsonify({"campaigns": [campaign.to_dict() for campaign in campaigns_query]}), 200


# @app.route('/campaign-drop', methods=['GET'])
# @auth_required('token')
# @roles_required('inf') 
# def campaign_drop():
#     campaigns = Campaign.query.filter_by(flag_status='Unflagged').all()
#     if not campaigns:
#         return jsonify({"message": "No unflagged campaigns found"}), 404

#     return jsonify({"campaigns": [campaign.to_dict() for campaign in campaigns]}), 200
# @app.route('/campaigns-drop', methods=['GET'])
# @auth_required('token')
# @roles_required('inf') 
# def get_unflagged_campaigns():
#     campaigns = Campaign.query.filter_by(flag_status="Unflagged").all()
#     if not campaigns:
#         return jsonify({"message": "No unflagged campaigns found"}), 404

#     campaign_list = []
#     for campaign in campaigns:
#         sponsor = Sponsor.query.get(campaign.spon_id)
#         if sponsor and sponsor.flag_status == "Unflagged":
#             campaign_data = campaign.to_dict()
#             campaign_data['sponsor'] = sponsor.to_dict()
#             campaign_list.append(campaign_data)

#     return jsonify({"campaigns": campaign_list}), 200



@app.route('/campaigns-drop', methods=['GET'])
@auth_required('token')
@roles_required('inf') 
def campaign_drop():
    campaigns = Campaign.query.filter_by(flag_status='Unflagged', visibility='public').all()
    sponsors = Sponsor.query.filter(Sponsor.id.in_([c.spon_id for c in campaigns])).all()
    
    if not campaigns:
        return jsonify({"message": "No unflagged campaigns found"}), 404

    sponsors_data = {sponsor.id: sponsor.to_dict() for sponsor in sponsors}
    
    campaigns_data = []
    for campaign in campaigns:
        campaign_dict = campaign.to_dict()
        campaign_dict['sponsor'] = sponsors_data[campaign.spon_id]
        campaigns_data.append(campaign_dict)
    
    return jsonify({
        "campaigns": campaigns_data,
    }), 200


# @app.route('/current-influencer', methods=['GET'])
# @auth_required('token')
# @roles_required('inf')
# def get_current_influencer():
#     influencer = Influencer.query.filter_by(user_id=current_user.id).first()
#     if not influencer:
#         return jsonify({"message": "Influencer not found"}), 404
#     return jsonify({"influencer": influencer.to_dict()}), 200



@app.route('/current-influencer-id', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_current_influencer_id():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404
    return jsonify({"influencer_id": influencer.id}), 200



##TO SHOW THE LIST OF AD REQUESTS SENT
##TO SHOW THE LIST OF AD REQUESTS IN REQUESTS SENT
@app.route('/influencer/adrequests', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_influencer_ad_requests():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404
    ad_requests = Adreq.query.filter_by(inf_id=influencer.id, req_status='PENDING', sender='I').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404
    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##TO SHOW THE REQUEST STATUS OF AD REQ SENT BY INFLUENCER
@app.route('/influencer/adrequests/status', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_influencer_ad_requests_status():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404

    # ad_requests = Adreq.query.filter_by(sender='S').all()
    ad_requests = Adreq.query.filter_by(inf_id=influencer.id, sender='I').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404

    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200


##TO REJECT OR ACCEPT
@app.route('/adrequests-for-inf', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def adrequests_for_inf():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404

    # ad_requests = Adreq.query.filter_by(sender='S').all()
    ad_requests = Adreq.query.filter_by(inf_id=influencer.id, sender='S').all()
    if not ad_requests:
        return jsonify({"message": "No ad requests found"}), 404

    return jsonify({"adRequests": [ad_request.to_dict() for ad_request in ad_requests]}), 200

##MY CAMPAIGNS FOR INFLUENCER##
@app.route('/influencer/my-campaigns', methods=['GET'])
@auth_required('token')
@roles_required('inf')
def get_my_campaigns():
    influencer = Influencer.query.filter_by(user_id=current_user.id).first()
    if not influencer:
        return jsonify({"message": "Influencer not found"}), 404
    
    accepted_campaigns = (
        db.session.query(Campaign)
        .join(Adreq, Adreq.camp_id == Campaign.id)
        .filter(
            Adreq.inf_id == influencer.id,
            Adreq.req_status == 'Accepted',
            Adreq.sender == 'S',
            Campaign.flag_status == 'Unflagged'
        )
        .all()
    )
    
    if not accepted_campaigns:
        return jsonify({"message": "No campaigns found"}), 404
    
    return jsonify({"campaigns": [campaign.to_dict() for campaign in accepted_campaigns]}), 200
