build:
	docker compose build

up:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up
