#!/usr/bin/env python3
"""Builds dist/SICK_CALL_TOOL.html: one self-contained file (CSS + all scripts inlined).
Run from the repo root:  python3 tools/build_single.py"""
import re,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(os.path.join(root,p),encoding='utf-8').read()
h=rd('index.html')
h=h.replace('<link rel="stylesheet" href="style.css">','<style>\n'+rd('style.css')+'</style>')
def inline(m):
    return '<script>\n'+rd(m.group(1))+'</script>'
h=re.sub(r'<script src="([^"]+)"></script>',inline,h)
os.makedirs(os.path.join(root,'dist'),exist_ok=True)
open(os.path.join(root,'dist','SICK_CALL_TOOL.html'),'w',encoding='utf-8').write(h)
print('wrote dist/SICK_CALL_TOOL.html',len(h),'bytes')
