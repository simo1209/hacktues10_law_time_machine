import re

prefix_regexes = [r'^§ \d+\.(.*)']

def find_newspaper_metadata(newspaper_lines):
    for line_idx, line in enumerate(newspaper_lines):
        if any(re.search(prefix_re, line) for prefix_re in prefix_regexes):
           return line_idx

def build_newspaper_tree(newspaper):
    pass
    

