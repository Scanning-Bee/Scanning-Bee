FROM mysql:8

ENV MYSQL_ROOT_PASSWORD pass
COPY ./init_database.sql /docker-entrypoint-initdb.d/init_database.sql
COPY ./insert_data_to_content.sql /docker-entrypoint-initdb.d/insert_data_to_content.sql

