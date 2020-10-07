import unittest

from premembers.common import slack_common
from premembers.const.const import CommonConst


class TestConvertCommandSlack(unittest.TestCase):
    def test_convert_command_slack_case_convert_one_mention(self):
        mentions = "@channel"
        desire_response = "<!channel>\n"
        response = slack_common.convert_command_slack(mentions)
        self.assertEqual(response, desire_response)

    def test_convert_command_slack_case_convert_multiple_mention(self):
        mentions = "@channel @here"
        desire_response = "<!channel> <!here>\n"
        response = slack_common.convert_command_slack(mentions)
        self.assertEqual(response, desire_response)

    def test_convert_command_slack_case_convert_mentions_is_none(self):
        mentions = None
        desire_response = CommonConst.BLANK
        response = slack_common.convert_command_slack(mentions)
        self.assertEqual(response, desire_response)

    def test_convert_command_slack_case_convert_mentions_is_blank(self):
        mentions = CommonConst.BLANK
        desire_response = CommonConst.BLANK
        response = slack_common.convert_command_slack(mentions)
        self.assertEqual(response, desire_response)

    def test_convert_command_slack_case_convert_mentions_is_number(self):
        mentions = 1
        desire_response = str(mentions) + CommonConst.NEW_LINE
        response = slack_common.convert_command_slack(mentions)
        self.assertEqual(response, desire_response)
