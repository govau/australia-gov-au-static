import json
import requests
import argparse
import os


# TODO consider https://github.com/10mohi6/slack-webhook-python for more advanced webhooks

def _send_slack_data(slack_data):
	print("Sending to slack", slack_data)
	webhook_url = os.environ.get('SLACK_WEBHOOK')

	response = requests.post(
		webhook_url, data=json.dumps(slack_data),
		headers={'Content-Type': 'application/json'}
	)
	if response.status_code != 200:
		raise ValueError(
			'Request to slack returned an error %s, the response is:\n%s'
			% (response.status_code, response.text)
		)


if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('--test', action='store_true')
	parser.add_argument('--new_preview', nargs=1, type=str)
	args = parser.parse_args()
	if args.test:
		slack_data = {'text': "abcd"}
		_send_slack_data(slack_data)
	elif args.new_preview:
		slack_data = {
			'text': "There's a new preview environment deployed at https://{}.apps.y.cld.gov.au/".format(args.new_preview[0])}
		_send_slack_data(slack_data)
	else:
		print("No slack message chosen")
