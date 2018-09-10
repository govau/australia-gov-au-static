#!/usr/bin/env python3
import glob
from bs4 import BeautifulSoup
import urllib
import os
import requests
import sys

# TODO figure out the right new hostname
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
            if href != None and href.startswith('http://www.australia.gov.au'):
                r = requests.get(href, timeout=REQUESTS_TIMEOUT)
                if not r.url.startswith('https://www.australia.gov.au'):
                    print('Replacing %s with %s' % (href, r.url))
                    anchor['href'] = r.url
                    self.filechanged = True

    def __check_absolute_links(self):
        print('checking absolute links to self')
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

        with open(self.filename, 'r', encoding='utf-8') as file:
            filecontents = file.read()
        self.soup = BeautifulSoup(filecontents, features='html.parser')

        self.filechanged = False

        self.__check_redirects()
        # disabling this until fixed
        #self.__check_absolute_links()

        if self.filechanged:
            print('Writing out changed %s' % self.filename)
            with open(self.filename, 'w', encoding='utf-8') as file:
                file.write(str(self.soup))
        else:
            print('No changes in %s' % self.filename)

            # document = soup.get_text(
            # print(document)
        # f=open(filename, 'r', 'utf-8')

        # print(document)

def process_recursively(directory):
    for filename in glob.iglob(directory+'/**/*.html', recursive=True):
        processHtml(filename)
    for filename in glob.iglob(directory+'/**/*.css', recursive=True):
        processCss(filename)


def processHtml(filename):

    # wget seems to unnecessarily add the html extension to some fonts/icons
    # which messes with our processing, so we'll just rename them to remove the
    # html
    root, extension = os.path.splitext(filename)
    if '.eot?' in filename or \
            '.ttf?' in filename or \
            '.woff?' in filename:
        # Rename to remove the extension
        print("Renaming %s to %s" % (filename, root))
        os.rename(filename, root)
        return
        page = HtmlFile(filename)
        page.process()

def processCss(filename):
    print(filename)
    # Read in the file
    with open(filename, 'r', encoding='utf-8') as file:
        filecontents = file.read()

    filecontents = filecontents.replace( \
        'ausgov.woff%3F92168388.html', \
        'ausgov.woff%3F92168388')

    with open(filename, 'w', encoding='utf-8') as file:
        file.write(filecontents)

def process(filename):
    root, extension = os.path.splitext(filename)
    if extension == '.html':
        processHtml(filename)
    elif extension == '.css':
        processCss(filename)

if __name__ == '__main__':
    try:
        arg = sys.argv[1]
        if os.path.isdir(arg):
            process_recursively(arg)
        else:
            process(arg)
    except IndexError:
        print("Please specify file or directory to scan")
        exit(1)
