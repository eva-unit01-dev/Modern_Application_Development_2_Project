from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db
from application.models import *
from config import DevelopmentConfig
from application.resources import *
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import pending_reminder, monthly_report
from application.instances import cache



def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security=Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views  # Ensure this import does not cause circular imports

    return app

app = create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
# def send_email(sender, **kwargs):
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=9, minute=13), #USE day_of_month
        pending_reminder.s(), name="Pending Ad Request Reminder"
        )
    sender.add_periodic_task(
        crontab(hour=9, minute=19, day_of_month=12),
        monthly_report.s(), name="Monthly Notification for Sponser"
        )

if __name__ == '__main__':
    app.run(debug=True)
