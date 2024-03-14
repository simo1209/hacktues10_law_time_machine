import sys
import json
import codecs

from src.build_newspaper_tree import build_newspaper_tree

if __name__ == "__main__":
    assert len(sys.argv) > 1, "Missing newspaper file to jsonify"

    with codecs.open(sys.argv[1], encoding='utf-8') as newspaper_file:
        newspaper_content = newspaper_file.read()

        newspaper_tree = build_newspaper_tree(newspaper_content)
        newspaper_json = json.dumps(newspaper_tree, indent = 4, ensure_ascii=False)#.encode('utf-8') 
        print(newspaper_json)

