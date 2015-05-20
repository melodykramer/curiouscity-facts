from PIL import ImageFont, Image, ImageDraw, ImageColor
import textwrap, os, json
from random import randint

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),".."))
JSON_DATA = os.path.join(ROOT,'app','data','facts.json')

font = ImageFont.truetype(os.path.join(ROOT,'app','static','fonts','PTSans.ttf'),72)
colors = ['#3584A2','#4cbde7','#64b278','#77b23e','#e7764c','#f0aa8f','#774ce7','#aa8ff0']
strip_color = ImageColor.getrgb('#333')
bottom=Image.new("RGB", (1600,20),strip_color)

fact_logo = Image.open(os.path.join(ROOT,'app','static','FACTGENERATORcircle.png'))
fact_resize = fact_logo.resize((160, 160), Image.ANTIALIAS)
cc_logo = Image.open(os.path.join(ROOT,'app','static','cclogo3.png'))
cc_ratio = 404/float(225)
cc_resize = cc_logo.resize((int(160*cc_ratio),160), Image.ANTIALIAS)

with open(JSON_DATA) as data:
	facts = json.load(data)
	for fact in facts:
		newColor = colors[randint(0,len(colors)-1)];
		color = ImageColor.getrgb(newColor)
		img=Image.new("RGB", (1600,900),color)
		img.paste(fact_resize,(40,60),fact_resize)
		img.paste(cc_resize,(220,60),cc_resize)
		img.paste(bottom,(0,880))
		img.paste(bottom,(0,0))
		draw = ImageDraw.Draw(img)
		margin = 60
		offset = 240
		text = fact['FactText']
		wrap = textwrap.wrap(text, width=45)

		for line in wrap:
			draw.text((margin, offset), line, font=font, fill="#fff")
			#offset += font.getsize(line)[1]
			offset += 106

		path = os.path.join(ROOT,'app','static','share_images/%s.png') % fact['ID']

		img.save(path)