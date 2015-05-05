import json, random, os
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, jsonify
from app import app
from urllib import quote

current_dir = os.path.dirname(__file__)

JSON_DATA = os.path.join(current_dir,'data','facts.json')
app.config.from_object(__name__)

def import_data():
    f = open(app.config['JSON_DATA'], 'r')
    data = json.load(f)
    factCount = len(json.dumps(data))
    f.close()
    return data

@app.before_request
def before_request():
    g.data = import_data()
    g.count = len(g.data)

@app.route('/')
def index():
	randFact = random.choice(g.data)
	# return render_template('index.html', data=randFact)
	return redirect(url_for('posts',id=randFact['ID']))
	# return jsonify(randFact)

@app.route('/random')
def random_fact():
	randFact = random.choice(g.data)
	#return render_template('index.html', data=randFact)
	# return redirect(url_for('posts',id=randFact['id']))
	# return jsonify(randFact)
	# return render_template(randFact['Template']+'.html',data=randFact)
	return randFact['ID']

@app.route('/api/random')
def api_random():
	randFact = random.choice(g.data)
	return jsonify(randFact)

@app.route('/<id>')
def posts(id):
	# randFact = ''
	# for row in g.data:
	# 	if row['ID'] == id:
	# 		randFact = row

	randFact = filter(lambda f: f['ID'] == id, g.data)
	email = mailto(randFact[0]['FactText'])

   	return render_template('index.html',data=randFact[0],factCount=g.count,factID=randFact[0]['ID'],email=email)

@app.route('/html/<id>')
def post_html(id):
	randFact = ''
	for row in g.data:
		if row['ID'] == id:
			randFact = row

	email = mailto(randFact['FactText'])

   	return render_template(randFact['Template']+'.html',data=randFact,email=email)

def mailto(fact):

	body = """Hi!\n\nI was just flipping through Curious City's Fact Generator and learned this interesting thing about Chicago:\n%s\n\nThey've got more where that came from: """ % fact
	
	subject_parse = quote('Found a neat fact about Chicago for you')
	body_parse = quote(body) 

	email = "mailto:?subject=%s&body=%s" % (subject_parse,body_parse)

	return email

if __name__ == '__main__':
    app.run()