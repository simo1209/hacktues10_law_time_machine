import re

prefix_regexes = [
    (1, r'^"?§ \d+\. '),
    (2, r'^"?\d+\. '),
    (3, r'^"?Чл+\. '),
    (4, r'^"?\w\) '),
    (5, r'^"?\w\) '),
    (6, r'^"?\(\d+\) '),
]
prefix_regexes_table = dict(prefix_regexes)

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

def parse_header(header_lines):
    law_node = {}

    law_node['ciela'] = header_lines[0]
    law = [ line for line in header_lines if 'ЗАКОН' in line ]
    law_node['line'] = law[0] if len(law) > 0 else 'ЗАКОН'

    law_node['weight'] = 0

    return law_node
    

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
    law_node = parse_header(newspaper_lines[:newspaper_info_starts_at])

    for line in content_lines:
        line['line'] = re.split(prefix_regexes_table[line['weight']], line['line'])[1] if line['weight'] in prefix_regexes_table else line['line']

    newspaper_tree['nodes'] = [law_node] + content_lines
    newspaper_tree['lines'] = [ { 'source': content_lines[line['parent']]['line'] if line['parent'] else law_node['line'], 'target': line['line'] } for line in content_lines ]

    return newspaper_tree
