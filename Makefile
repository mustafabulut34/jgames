SHELL := /bin/bash

docker_up:
	docker-compose up -d

docker_down:
	docker-compose down

docker_makemigrations:
	docker-compose run --rm backend python manage.py makemigrations

docker_migrate:
	docker-compose run --rm backend python manage.py migrate

docker_create_users:
	docker-compose run --rm backend python manage.py create_test_users