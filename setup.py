from setuptools import setup

setup(name='comfortometer',
      version='1.0',
      description='Intelligent.li example application using Flask and OpenShift',
      author='Intelliget.li',
      author_email='support@percepscion.com',
      url='http://www.python.org/sigs/distutils-sig/',
      install_requires=[
          'Flask==0.10.1',
          'Jinja2==2.7.1',
          'MarkupSafe==0.18',
          'Werkzeug==0.9.4',
          'distribute==0.6.31',
          'gevent==0.13.8',
          'gevent-websocket>=0.3.6',
          'greenlet==0.4.1',
          'gunicorn==18.0',
          'itsdangerous==0.23',
          'ws4py==0.3.2',
          'wsgiref==0.1.2',
          'Flask-Sockets==0.1'
          ],
     )
