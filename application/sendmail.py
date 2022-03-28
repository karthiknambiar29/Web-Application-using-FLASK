from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from jinja2 import Template
SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "admin@flashcards.com"
SENDER_PASSWORD = ""


def format_message(template_file, data = {}):
    with open(template_file) as file_:
        template = Template(file_.read())
        return template.render(data=data)

def send_mail(to_address, subject, message):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg['To'] = to_address
    msg["Subject"] = subject

    msg.attach(MIMEText(message, "html"))
    s = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()

    return True






