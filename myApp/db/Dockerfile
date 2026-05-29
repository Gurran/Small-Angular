FROM postgres:latest

# Copy initialization script into docker-entrypoint-initdb.d
COPY ./init-projects.sh /docker-entrypoint-initdb.d/init-projects.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-projects.sh
