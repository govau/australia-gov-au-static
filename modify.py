#!/usr/bin/env python3
import glob
from bs4 import BeautifulSoup
import urllib
import os
import requests
import sys

NEW_HOSTNAME='foo.apps.y.cld.gov.au'
REQUESTS_TIMEOUT=2

class HtmlFile(object):
    filename = None
    filecontents = None
    filechanged = None
    soup = None
    def __init__(self, filename):
        self.filename = filename

    def __check_redirects(self):
        print('checking for redirects')
        # Check all <a>'s to ausgov for redirects. Replace them with the final redirect
        # destination
        for anchor in self.soup.find_all('a'):
            href = anchor.get('href')
            if href.startswith('http://www.australia.gov.au'):
                r = requests.get(href, timeout=REQUESTS_TIMEOUT)
                if not r.url.startswith('https://www.australia.gov.au'):
                    print('Replacing %s with %s' % (href, r.url))
                    anchor['href'] = r.url
                    self.filechanged = True

    def __check_absolute_links(self):
        print('checking absolute links to self')
        # Make sure absolute links
        # Replace absolute links to www.australia.gov.au within <link> elements
        # with our new hostname
        for link in self.soup.find_all('link'):
            href = link.get('href')
            o = urllib.parse.urlparse(href)
            if o.netloc == 'www.australia.gov.au':
                link['href'] = link['href'].replace('www.australia.gov.au', NEW_HOSTNAME)
                self.filechanged = True

    def process(self):
        print(self.filename)
        # for line in fileinput.input([filename], inplace=True):
            # Replace all https://www.australia.gov.au to https://www.australia.gov.au
            # print(line.replace('http://www.australia.gov.au', 'https://www.australia.gov.au'), end='')
        # with open(filename, 'rb') as file:
        #     filedata = file.read()
        #
        # # Replace the target string
        # filedata = filedata.replace('http://www.australia.gov.au', 'https://www.australia.gov.au')
        #
        # # Write the file out again
        # with open('filename', 'wb') as file:
        #     file.write(filedata)

        # There's badly encoded text in these files. Replace it with a hack.
        # http://python-notes.curiousefficiency.org/en/latest/python3/text_file_processing.html#files-in-an-ascii-compatible-encoding-minimise-risk-of-data-corruption
        # with open(filename, 'r', encoding='ascii', errors='surrogateescape') as file:
        #     filecontents = file.read()
        # filecontents = filecontents.replace('&#8217;', '\'')
        # with open(filename, 'w', encoding='ascii',errors='surrogateescape') as file:
        #     file.write(filecontents)

        with open(self.filename, 'r', encoding='utf-8') as file:
            filecontents = file.read()
        self.soup = BeautifulSoup(filecontents, features='html.parser')

        self.filechanged = False

        # self.__check_redirects()
        self.__check_absolute_links()

        if self.filechanged:
            print('Writing out changed %s' % self.filename)
            with open(self.filename, 'w', encoding='utf-8') as file:
                file.write(str(soup))
        else:
            print('No changes in %s' % self.filename)

            # document = soup.get_text(
            # print(document)
        # f=open(filename, 'r', 'utf-8')

        # print(document)

def process_recursively(directory):
    for filename in glob.iglob(directory+'/**/*.html', recursive=True):
        process(filename)

def process(filename):
    page = HtmlFile(filename)
    page.process()

if __name__ == '__main__':
    try:
        arg = sys.argv[1]
        if os.path.isdir(arg):
            process_recursively(arg)
        else:
            process(arg)
    except IndexError:
        print("Please specify file or directory to modify")
        exit(1)
