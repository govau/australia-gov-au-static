#!/usr/bin/python3
import json
import os.path
from bs4 import BeautifulSoup
import validators
import urllib.request
import urllib.error

checked_links = []
if os.path.exists("checked_links.json"):
	checked_links = json.load(open("checked_links.json", "r"))


def _check_url(address):
	if address in checked_links:
		return
	if "linkedin.com" in address:
		# Gets HTTP Error 999: Request denied from detected scrapers
		return
	try:
		req = urllib.request.Request(url=address,
																 data=None,
																 headers={
																	 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
																 }
																 )
		resp = urllib.request.urlopen(req)
		if resp.status in [301, 302, 400, 404, 403, 408, 409, 501, 502, 503]:
			raise Exception(resp.status + "-" + resp.reason + "-->" + address)
		else:
			print("no problem in link --> " + address)
			checked_links.append(address)
			json.dump(checked_links, open("checked_links.json", "w"))
	except urllib.error.HTTPError as e:
		raise Exception(address + " --> " + str(e) + str(e.headers))


def _has_data_props(tag):
	return tag.has_attr('data-props')


def check_html_file(file_path):
	print("Checking: " + file_path)
	global checked_links
	file_root = "./site/public/"
	soup = BeautifulSoup(open(os.path.join(file_root, file_path)), features="html.parser")

	carousels_count = 0
	for tag in soup.find_all(_has_data_props):
		carousels_count += 1
		carousel_name = tag.parent.find('h2').text
		print(carousel_name)
		slides = json.loads(tag['data-props']).get('slides', [])
		if len(slides) == 0:
			raise Exception("Empty carousel:", carousel_name)
		print(len(slides), "items in carousel:", carousel_name)
		print(slides)
		for slide in slides:
			if 'imgUrl' in slide:
				if not os.path.isfile(os.path.join(file_root, slide.get('imgUrl'))):
					raise Exception("File", slide.get('imgUrl'), "does not exist in carousel:", carousel_name)
			if 'linkUrl' in slide:
				validUrl = validators.url(slide.get('linkUrl'))
				if not validUrl:
					print(validUrl)
					raise Exception("Link", slide.get('linkUrl'), "is invalid in carousel:", carousel_name)
				_check_url(slide.get('linkUrl'))
	link_count = 0
	for link in soup.find_all('a'):
		if "http" in link['href']:
			link_count += 1
			_check_url(link['href'])
	print(str(link_count) + " external links in: " + file_path)


if __name__ == "__main__":
	files_to_check = [
		'index.html',
		'archive/index.html'
	]
	for file_path in files_to_check:
		check_html_file(file_path)
