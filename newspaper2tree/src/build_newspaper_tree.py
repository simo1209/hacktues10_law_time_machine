import re

prefix_regexes = [
    (0, r'^"?§ \d+\. '),
    (1, r'^"?\d+\. '),
    (2, r'^"?Чл+\. '),
    (3, r'^"?\w\) '),
    (4, r'^"?\w\) '),
    (5, r'^"?\(\d+\) '),
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
    content_lines = [ {'idx': line_idx, 'line':line, 'weight':find_line_prefix_weight(line)} for line_idx, line in enumerate(lines)]

    return content_lines

def find_parent_idx(content_lines, child_line):

    line_idx = child_line['idx']
    child_prefix = child_line['weight']

    while line_idx >= 0:
        if content_lines[line_idx]['weight'] == None or child_prefix == None:
            # print(content_lines[line_idx], child_line)
            return None

        if content_lines[line_idx]['weight'] < child_prefix:
            return line_idx
        line_idx-=1 


def build_newspaper_tree(newspaper):

    newspaper_lines = [ line.strip() for line in newspaper.split('\n') if line.strip() != '' ]

    newspaper_info_starts_at = find_newspaper_metadata(newspaper_lines)
    assert newspaper_info_starts_at is not None
    
    #TODO find law from metadata. law will be tree root

    # newspaper_info_stops_at = next( idx for idx, line in enumerate(newspaper_lines) if line.startswith('---') and line.endswith('---') )
    footer_separator_line = [ idx for idx, line in enumerate(newspaper_lines) if line.startswith('Законът е приет') or line.startswith('---') and line.endswith('---')]
    newspaper_info_stops_at = footer_separator_line[0] if footer_separator_line != [] else None

    content_lines = prefix_lines(newspaper_lines[newspaper_info_starts_at:newspaper_info_stops_at])
    for content_line in content_lines:
        content_line['parent'] = find_parent_idx(content_lines, content_line)

    # newspaper_tree = {
    #    'law': [ content_line for content_line in content_lines if content_line['parent'] is None  ]
    # }

    # for content_line in content_lines:
    #     newspaper_tree[content_line['line']] = [ child_line for child_line in content_lines if child_line['parent'] == content_line['idx'] ]

    newspaper_tree = {}
    newspaper_tree['nodes'] = content_lines
    newspaper_tree['lines'] = [ { 'source': content_lines[line['parent']]['line'] if line['parent'] else 'law', 'target': line['line'] } for line in content_lines ]

    return newspaper_tree
