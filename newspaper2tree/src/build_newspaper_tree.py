import re

prefix_regexes = list(enumerate([r'^§ \d+\. ']))

def find_newspaper_metadata(newspaper_lines):
    for line_idx, line in enumerate(newspaper_lines):
        if any(re.search(prefix_reg, line) for _, prefix_reg in prefix_regexes):
           return line_idx


def find_line_prefix(line):
    for reg_idx, prefix_reg in prefix_regexes:
        if re.search(prefix_reg, line):
            return reg_idx

def section_split(content):

    section_prefix_reg_idx = find_line_prefix(content)

    sections = re.split(prefix_regexes[section_prefix_reg_idx][1], content, flags=re.MULTILINE)

    return sections

    

def build_newspaper_tree(newspaper):

    newspaper_lines = newspaper.split('\n')

    newspaper_info_starts_at = find_newspaper_metadata(newspaper_lines)
    assert newspaper_info_starts_at is not None
    
    newspaper_content = ''.join(newspaper_lines[newspaper_info_starts_at:])
    sections = section_split(newspaper_content)

