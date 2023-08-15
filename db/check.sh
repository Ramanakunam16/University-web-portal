# check
docker cp ./check.sql mariadb_container:/check.sql
docker exec -it mariadb_container sh -c "mariadb -u root -p < /check.sql";