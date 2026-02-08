
import re

def fix_box_block(lines):
    if not lines:
        return []
    
    # Identify indentation
    indent_match = re.match(r'^(\s*)', lines[0])
    indent = indent_match.group(1) if indent_match else ""
    
    # Check if top border is basically just dashes/pluses
    if not re.match(r'^\s*[+\-]+\s*$', lines[0]):
        return lines

    # Find max content length
    max_content_len = 0
    content_lines_data = [] # list of internal string
    
    # Check content lines
    # We expect | content |
    for line in lines[1:-1]:
        stripped = line.strip()
        # Regex to capture content inside outer pipes
        # ^\|(.*)\|$
        m = re.match(r'^\|(.*)\|$', stripped)
        if m:
            inner = m.group(1)
            content_lines_data.append(inner)
            if len(inner) > max_content_len:
                max_content_len = len(inner)
        else:
            return lines # Abort fixing this box if structure is unexpected
    
    if max_content_len == 0:
        return lines

    # Rebuild
    width = max_content_len + 2
    border_str = indent + '-' * width
    
    new_lines = []
    
    # Top border
    new_lines.append(border_str)
    
    for item in content_lines_data:
        # Pad inner
        inner = item
        padding = max_content_len - len(inner)
        new_inner = inner + ' ' * padding
        new_lines.append(indent + '|' + new_inner + '|')
            
    # Bottom border
    new_lines.append(border_str)
    
    return new_lines


def process_diagram(text):
    lines = text.split('\n')
    new_lines = []
    
    current_box = []
    in_box = False
    
    for line in lines:
        # Check for border line: only dashes/pluses, ignore if it has multiple segments
        is_border = bool(re.match(r'^\s*[+\-]+\s*$', line))
        
        if is_border:
            if in_box:
                # Closing content
                current_box.append(line)
                fixed = fix_box_block(current_box)
                new_lines.extend(fixed)
                current_box = []
                in_box = False
            else:
                current_box.append(line)
                in_box = True
        else:
            if in_box:
                stripped = line.strip()
                if stripped.startswith('|') and stripped.endswith('|'):
                    current_box.append(line)
                else:
                    # Not a content line. Flush.
                    new_lines.extend(current_box)
                    current_box = []
                    in_box = False
                    new_lines.append(line)
            else:
                new_lines.append(line)
                
    if current_box:
        new_lines.extend(current_box)
        
    return '\n'.join(new_lines)

path = r'c:\Users\diino\Desktop\Portfolio-2.0\lib\architecture-diagrams.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_callback(match):
    diag_id = match.group(1)
    diag_text = match.group(2)
    
    fixed_text = process_diagram(diag_text)
    if fixed_text != diag_text:
        print(f"Fixed diagram {diag_id}")
    else:
        print(f"No changes for diagram {diag_id}")
        
    return f'{diag_id}: `{fixed_text}`'

new_content = re.sub(r'(\d+):\s*`([^`]+)`', replace_callback, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
