nginx: nginx -c `pwd`/config/nginx.conf -g "daemon off; master_process off; pid `pwd`/tmp/nginx.pid;"
web: DEBUG=acclamation supervisor --watch "bower_components,config,src" --extensions "js" ./bin/www
redis: redis-server --port 6379
grunt: grunt watch:javascript_dev
grunt: grunt watch:stylesheets_dev
