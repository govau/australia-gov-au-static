#!/usr/bin/python3
import json
from bs4 import BeautifulSoup

# pip3 install BeautifulSoup4
soup = BeautifulSoup(open('./site/public/index.html'), features="html.parser")


def has_data_props(tag):
	return tag.has_attr('data-props')

carousels_count = 0
for tag in soup.find_all(has_data_props):
	carousels_count += 1
	print(tag.parent.find('h2').text)
	slides = json.loads(tag['data-props']).get('slides', [])
	if len(slides) == 0:
		raise Exception("Empty carousel")
	print(len(slides), "items in carousel")
	print(slides)
if carousels_count == 0:
	raise Exception("No carousels")
