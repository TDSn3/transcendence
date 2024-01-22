# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tda-silv <tda-silv@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/08/14 16:32:49 by tda-silv          #+#    #+#              #
#    Updated: 2024/01/22 11:02:38 by tda-silv         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:
	@docker-compose -f ./docker-compose.yml up -d --build

ps:
	docker image ls
	@echo ""
	docker ps
	@echo ""
	docker volume ls	

start:
	@docker-compose -f ./docker-compose.yml start

stop: 
	@docker-compose -f ./docker-compose.yml stop

down: 
	@docker-compose -f ./docker-compose.yml down --rmi all --volumes

# **************************************************************************** #
#                                                                              #
#   Manual     														           #
#																			   #
#   example:																   #
#		make setup build_backend run_d_backend	 							   #
#                                                                              #
# **************************************************************************** #

setup:
	@docker network create transcendence_network

# **************************************************************************** #
#                                                                              #
#   backend     													           #
#                                                                              #
# **************************************************************************** #

build_backend:
	@docker build -t backend ./backend

run_d_backend:
	@docker run							\
		-d								\
		--name backend					\
		-p 5000:5000					\
		--network transcendence_network	\
		--restart unless-stopped		\
		backend

run_it_backend:
	@docker run							\
		-it								\
		--name backend					\
		-p 5000:5000					\
		--network transcendence_network	\
		--restart unless-stopped		\
		backend							\
		bash

it_backend:
	@docker exec -it $$(docker ps --filter name=backend --format "{{.ID}}") bash

ps_backend:
	@docker exec -it $$(docker ps --filter name=backend --format "{{.ID}}") ps aux

kill_backend:
	@docker kill $$(docker ps --filter name=backend --format "{{.ID}}")

# **************************************************************************** #
#                                                                              #
#   frontend     													           #
#                                                                              #
# **************************************************************************** #

build_frontend:
	@docker build -t frontend ./frontend

run_d_backend:
	@docker run							\
		-d								\
		--name frontend					\
		-p 5000:5000					\
		--network transcendence_network	\
		--restart unless-stopped		\
		frontend

run_it_frontend:
	@docker run							\
		-it								\
		--name frontend					\
		-p 5000:5000					\
		--network transcendence_network	\
		--restart unless-stopped		\
		frontend						\
		bash

it_backend:
	@docker exec -it $$(docker ps --filter name=frontend --format "{{.ID}}") bash

ps_backend:
	@docker exec -it $$(docker ps --filter name=frontend --format "{{.ID}}") ps aux

kill_backend:
	@docker kill $$(docker ps --filter name=frontend --format "{{.ID}}")

# **************************************************************************** #

clean: down
	@if [ $$(docker ps -a -q | wc -l) -gt 0 ]; then	\
		docker rm -f $$(docker ps -a -q);			\
	fi
	@if [ $$(docker images -a -q | wc -l) -gt 0 ]; then	\
		docker rmi -f $$(docker images -a -q);			\
	fi

# **************************************************************************** #
#                                                                              #
#   WARNING: `fclean` deletes ALL system containers and the cache              #
#                                                                              #
# **************************************************************************** #

fclean:
	@docker-compose -f ./docker-compose.yml kill
	@echo ""
	@docker system prune -a -f
	@if [ $$(docker volume ls -q | wc -l) -gt 0 ]; then	\
		docker volume rm $$(docker volume ls -q);		\
	fi

re: down all

.PHONY: all ps start stop down clean fclean re
