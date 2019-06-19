import webapp2
import jinja2
import os
from google.appengine.api import users
from google.appengine.ext import ndb

the_jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class FRUser(ndb.Model):
  first_name = ndb.StringProperty()
  last_name = ndb.StringProperty()
  email = ndb.StringProperty()

class MainHandler(webapp2.RequestHandler):
  def get(self):
    main_template = the_jinja_env.get_template('templates/page1.html')
    self.response.write(main_template.render())
    user = users.get_current_user()
    if user:
        self.response.write("You're logged in!")
    else:
        self.response.write("You're not logged in - please do so.")

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        login_template = the_jinja_env.get_template('templates/page4.html')
        self.response.write(login_template.render())
        user = users.get_current_user()
        if user:
            user = users.get_current_user()
            email_address = user.nickname()
            signout_link_html = '<a href="%s"><b>Sign out</b></a>' % (users.create_logout_url('/'))
            email_address = user.nickname()
            cssi_user = FRUser.query().filter(FRUser.email == email_address).get()
            if cssi_user:
              self.response.write('''
            Welcome %s %s (%s)! <br> %s <br>''' % (
              cssi_user.first_name,
              cssi_user.last_name,
              email_address,
              signout_link_html))
            else:
              # Registration form for a first-time visitor:
              self.response.write('''
                  Welcome to our site, %s!  Please sign up! <br>
                  <form method="post" action="/page4">
                  <input type="text" name="first_name" placeholder="First Name">
                  <input type="text" name="last_name" placeholder="Last Name">
                  <input type="submit">
                  </form><br> %s <br>
                  ''' % (email_address, signout_link_html))
        else:
          # The else block only runs if the user isn't logged in.
            login_url = users.create_login_url('/page4')
            login_html_element = '<a href="%s"><b>Sign in</b></a>' % login_url
            self.response.write('Please log in.<br>' + login_html_element)

    def post(self):
        user = users.get_current_user()
        cssi_user = FRUser(
            first_name=self.request.get('first_name'),
            last_name=self.request.get('last_name'),
            email=user.nickname())
        # Store that Entity in Datastore.
        cssi_user.put()
        # Show confirmation to the user. Include a link back to the index.
        self.response.write('Thanks for signing up, %s! <br><a href="/">Home</a>' %
            cssi_user.first_name)



app = webapp2.WSGIApplication([
  ('/', MainHandler),
  ('/page4', LoginHandler)
], debug=True)
