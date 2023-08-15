# docker up 
docker-compose -f docker-compose.yml up -d;
  
# secure installation of mariaDb
 ## manual task

# initial setup of Db
sleep 5;
docker cp ./initialSetUp.sql mariadb_container:/initialSetUp.sql
sleep 20;
docker exec -it mariadb_container sh -c "mariadb -u root -p < /initialSetUp.sql";
