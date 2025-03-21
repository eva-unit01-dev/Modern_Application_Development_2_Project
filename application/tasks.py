import os
from celery import shared_task
from flask import jsonify
from flask_login import current_user
from .models import *
import flask_excel as excel
from .mail_service import send_message
from .models import User
from jinja2 import Environment, FileSystemLoader, Template
from flask_security import auth_required, roles_required



#############################################################

# @shared_task(ignore_result=False)  ##THIS RESULTS SHALL NOT BE STORED ON THE BACKEND
# def say_hello():
#     return "Say Hello"


#############################################################

@shared_task(ignore_result=False)
# @auth_required('token')
# @roles_required('spon')
def create_user_csv(user_id):
    sponsor = Sponsor.query.filter_by(user_id=user_id).first()
    if not sponsor:
        return jsonify({"message": "Sponsor not found"}), 404
    campaigns=Campaign.query.filter_by(spon_id=sponsor.id).all()
    # user_det=User.query.with_entities(User.username, User.active).all()
    # csv_output=excel.make_response_from_query_sets(user_det, ['username','active'], "csv" )
    report_csv=excel.make_response_from_query_sets(campaigns, ['id','spon_id', 'name','description','sdate','edate','budget','visibility','completion_status','flag_status'], "csv")     
    filename="campaign_report.csv"
    # filepath = os.path.join("/tmp", filename)

    
    with open(filename, 'wb') as f:
        f.write(report_csv.data)

    return filename
    # return filepath

# @shared_task(ignore_result=False)
# def create_user_csv(user_id):
#     sponsor=Sponsor.query.filter_by(user_id=user_id).first()
#     if not sponsor:
#         return jsonify({"message": "Sponsor not found"}), 404
#     campaigns=Campaign.query.filter_by(spon_id=sponsor.id).all()
#     camp_rep=campaigns.query.filter_by(campaigns.id, campaigns)
    


#############################################################
# @shared_task(ignore_result=False)
# def daily_remiander(message):
#     return message

#############################################################
# @shared_task(ignore_result=True)
# def daily_remiander(to, subject):
#     send_message(to, subject, "Hello")
#     return "OK"

#############################################################
#this has to be changed so that a mail goes only to a particular kind of user
#USE THE FILTER METHOD TO MAKE SURE THAT EVERY TYPE OF USER
#RECEIVES THEIR OWN MAIL


#  @shared_task(ignore_result=True)
#  def daily_remiander(to, subject):
#      users=User.query.filter(User.roles.any(name=='inf)).all()
#     for user in users:
#         with open('test.html','r') as f:
#             template=Template(f.read())
#             send_message(user.email, subject, template.render(email=user.email))
#      return "OK"





###################//////////PENDING REMINDER FOR INFLUENCER//////////###################
@shared_task(ignore_result=True)
def pending_reminder():
    inf_pend=Influencer.query.join(Adreq).filter(Adreq.inf_id==Influencer.id, Adreq.req_status=='PENDING', Adreq.sender=='S').all()
    for infs in inf_pend:
        send_message(infs.email, 'Your Ad-Requests are Pending', 'Hello Influencer, you have pending Ad-Requests. Kindly visit SyncIt')
    return "Influencer has been alerted"


###################//////////MONTHLY REPORT FOR INFLUENCER//////////###################
@shared_task(ignore_result=True)
def monthly_report():

    env = Environment(loader=FileSystemLoader('templates'))
    template=env.get_template('monthlyreport.html')
    sponsors=Sponsor.query.join(User).filter(User.id==Sponsor.user_id, User.active==True).all()
    for spon in sponsors:
        camps=Campaign.query.filter_by(spon_id=spon.id).all()
        # total=sum([camp.budget for camp in camps])
        # a_ad_req=sum([Adreq.query.filter_by(camp_id=camp.id, req_status="Accepted").count for camp in camps])
        # r_ad_req=sum([Adreq.query.filter_by(camp_id=camp.id, req_status="Rejected").count for camp in camps])
        # p_ad_req=sum([Adreq.query.filter_by(camp_id=camp.id, req_status="Pending").count for camp in camps])
        total=sum(camp.budget for camp in camps)
        a_ad_req=sum(Adreq.query.filter_by(camp_id=camp.id, req_status="Accepted").count() for camp in camps)
        r_ad_req=sum(Adreq.query.filter_by(camp_id=camp.id, req_status="Rejected").count() for camp in camps)
        p_ad_req=sum(Adreq.query.filter_by(camp_id=camp.id, req_status="PENDING").count() for camp in camps)

        content_body=template.render(Total_campaign_Budget=total, Accepted_Ad_Request=a_ad_req, Rejected_Ad_Request=r_ad_req, Pending_Ad_Request=p_ad_req)
        # send_message(spon.email, "Monthly Report", content_body)
        send_message(spon.email, "Monthly Report", content_body)
        # with open('/templates/monthlyreport.html','r') as f:
        #     template=Template(f.read())
        #     send_message(spon.email, "Monthly Report", template.render(Total_campaign_Budget=total, Accepted_Ad_Request=a_ad_req, Rejected_Ad_Request=r_ad_req, Pending_Ad_Request=p_ad_req))
    
    return "Monthly Notification Has Been Sent"


    #######################caching#######################
    