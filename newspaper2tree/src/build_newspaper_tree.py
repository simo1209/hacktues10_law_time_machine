import re

prefix_regexes = [
    (0, r'^§ \d+\. '),
    (1, r'^\d+\. '),
    (2, r'^"?\w\) '),
    (3, r'^"?\(\d+\) '),
]

def find_newspaper_metadata(newspaper_lines):
    for line_idx, line in enumerate(newspaper_lines):
        if any(re.search(prefix_reg, line) for _, prefix_reg in prefix_regexes):
           return line_idx


def find_line_prefix_weight(line):
    for reg_weight, prefix_reg in prefix_regexes:
        if re.search(prefix_reg, line):
            return reg_weight 

def prefix_lines(lines):
    nonempty_lines = [ line for line in lines if line.strip() != '' ]
    content_lines = [ {'idx': line_idx, 'line':line, 'weight':find_line_prefix_weight(line)} for line_idx, line in enumerate(nonempty_lines)]

    return content_lines

def find_parent_idx(content_lines, child_line):

    line_idx = child_line['idx']
    child_prefix = child_line['weight']

    while line_idx >= 0:
        if content_lines[line_idx]['weight'] < child_prefix:
            return line_idx
        line_idx-=1 


def build_newspaper_tree(newspaper):

    newspaper_lines = newspaper.split('\n')

    newspaper_info_starts_at = find_newspaper_metadata(newspaper_lines)
    assert newspaper_info_starts_at is not None
    
    #TODO find law from metadata. law will be tree root

    content_lines = prefix_lines(newspaper_lines[newspaper_info_starts_at:])
    for content_line in content_lines:
        content_line['parent'] = find_parent_idx(content_lines, content_line)

    newspaper_tree = {
        'law': [ content_line for content_line in content_lines if content_line['parent'] is None  ]
    }

    for content_line in content_lines:
        newspaper_tree[content_line['line']] = [ child_line for child_line in content_lines if child_line['parent'] == content_line['idx'] ]

    return newspaper_tree
