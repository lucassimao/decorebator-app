npx sequelize-cli --url postgres://postgres:112358132134@localhost:5432/decorebator-dev  db:migrate


pg_dump -s  -d  decorebator-dev -U postgres -h localhost -W > migrations/init.sql