import subprocess
import json
import os

prefixes = [
	'preview-ausgov-'
]


def unprefixed_entity(entities):
	for entity in entities:
		entity = entity.strip()

		for prefix in prefixes:
			if entity.startswith(prefix):
				yield entity.replace(prefix, '', 1)


def feature_branches():
	return subprocess.run(
		['git', 'ls-remote', '--heads', os.environ.get('CIRCLE_REPOSITORY_URL')],
		encoding='utf-8',
		capture_output=True
	).stdout.splitlines()


def deployed_features():
	apps_json = subprocess.run(
		['cf', 'curl', '/v2/spaces/{}/apps'.format(os.environ.get('CF_SPACE_ID'))],
		encoding='utf-8',
		capture_output=True
	).stdout
	apps = json.loads(apps_json)
	if 'resources' not in apps:
		print("No apps found in specified space ID, you may be logged into the wrong cloud environment!")
	return [x['entity']['name'] for x in apps['resources']]


if __name__ == '__main__':
	deployed = set(unprefixed_entity(deployed_features()))
	branches = set(feature_branches())

	for entity in deployed - branches:
		print("undeploying preview of branch: ", entity)
		subprocess.run(['cf', 'delete', 'preview-ausgov-{}'.format(entity), '-f'])
