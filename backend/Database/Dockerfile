FROM mysql:8

ENV MYSQL_ROOT_PASSWORD pass
COPY ./init_database.sql /docker-entrypoint-initdb.d/init_database.sql
