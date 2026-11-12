"""Compose screenshot drafts from unaltered responsive production captures.
These are web UI captures, not native iOS release screenshots.
Usage: python scripts/compose-store-screenshots.py
Requires Pillow and build/CormorantGaramond-Light.ttf.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
root = Path(__file__).resolve().parents[1]
base = root / 'screenshots/app-store'
fontpath = root / 'build/CormorantGaramond-Light.ttf'
scenes = [
    ('scribe', 'Write Scripture.', 'One verse at a time.', 'A quiet space to pause and reflect.'),
    ('books', 'Follow the Word.', 'At your own pace.', 'Choose a book. Begin a chapter.'),
    ('bookmarks', 'Keep a verse.', 'Return to its meaning.', 'Save passages for another quiet moment.'),
]
for device, (w,h,shotw,y) in {'iphone':(1206,2622,900,580)}.items():
    for i,(key,line1,line2,sub) in enumerate(scenes,1):
        canvas = Image.new('RGB',(w,h))
        pix=canvas.load()
        for row in range(h):
            t=row/h
            color=tuple(round(a+(b-a)*t) for a,b in zip((30,26,20),(12,11,10)))
            for col in range(w): pix[col,row]=color
        d=ImageDraw.Draw(canvas)
        scale=1 if device=='iphone' else 1.12
        title=ImageFont.truetype(str(fontpath),round(100*scale))
        small=ImageFont.truetype(str(fontpath),round(36*scale))
        label=ImageFont.truetype(str(fontpath),round(38*scale))
        def center(text,y,font,fill):
            d.text((w/2,y),text,font=font,fill=fill,anchor='mt')
        center('S E L A H',65,label,'#c9a96e')
        center(line1,155,title,'#e8e0d4')
        center(line2,255 if device=='iphone' else 265,title,'#e8e0d4')
        center(sub,405 if device=='iphone' else 395,small,'#b4a894')
        shot=Image.open(base/device/f'raw-{key}.jpg').convert('RGB')
        sh=round(shot.height*shotw/shot.width)
        shot=shot.resize((shotw,sh),Image.Resampling.LANCZOS)
        x=(w-shotw)//2
        shadow=Image.new('RGBA',(w,h))
        sd=ImageDraw.Draw(shadow)
        sd.rectangle((x-5,y+10,x+shotw+5,y+sh+18),fill=(0,0,0,200))
        canvas=Image.alpha_composite(canvas.convert('RGBA'),shadow.filter(ImageFilter.GaussianBlur(24))).convert('RGB')
        canvas.paste(shot,(x,y))
        d=ImageDraw.Draw(canvas)
        d.rectangle((x-2,y-2,x+shotw+1,y+sh+1),outline='#695b42',width=2)
        assert y+sh<h-20
        canvas.save(base/device/f'{i:02d}-{key}.png')
# Compact preview of the three mobile designs.
preview=Image.new('RGB',(1290,770),'#ede7dc')
d=ImageDraw.Draw(preview)
label=ImageFont.truetype(str(fontpath),30)
d.text((35,18),'SELAH  /  SCREENSHOT DESIGNS',font=label,fill='#403729')
for row,device in enumerate(('iphone',)):
    for col,(key,*_) in enumerate(scenes):
        im=Image.open(base/device/f'{col+1:02d}-{key}.png')
        im.thumbnail((400,650),Image.Resampling.LANCZOS)
        x=20+col*425+(400-im.width)//2
        preview.paste(im,(x,80+row*700))
preview.save(base/'contact-sheet.jpg',quality=94)
print('Created 3 RGB screenshot drafts and contact sheet')
