from slackclient import SlackClient
import os
import distutils.util
import logging

# Logger
logger = logging.getLogger()
log_level = os.getenv('LOG_LEVEL', default='INFO')
logger.setLevel(log_level)

# Slack
slack_token = os.environ["SLACK_TOKEN"]
slack_client = None
slack_channel = os.getenv('SLACK_CHANNEL', "#build_information")

# dryrun
dry_run = bool(distutils.util.strtobool(os.getenv("dry_run", "False")))


def lambda_handler(event, context):
    global slack_client
    global dry_run
    if not slack_client:
        slack_client = SlackClient(slack_token)
    if "message" in event:
        message = event['message']
        logger.info("message is {}".format(message))
    else:
        message = None
        logger.warning("message is empty.")
    if "attachments" in event:
        attachments = event['attachments']
        logger.info("attachments is {}".format(attachments))
    else:
        attachment = None 
        logger.warning("message is empty.")
    if not dry_run:
        if message or attachment:
            slack_client.api_call(
                "chat.postMessage",
                channel=slack_channel,
                attachments=attachments,
                text=message)
        else:
            logger.warning("send message & attachment is not set")
            
