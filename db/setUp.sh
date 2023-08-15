# docker up 
 docker-compose -f docker-compose.yml up -d;
  
# secure installation of mariaDb
 ## manual task

# initial setup of Db
docker cp ./initialSetUp.sql mariadb_container:/initialSetUp.sql
docker exec -it mariadb_container sh -c "mariadb -u "root"< /initialSetUp.sql";
