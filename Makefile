# Makefile with Colored Help

# Set the default target as 'help'
.DEFAULT_GOAL := help

# Define the colors to be used in the help text
ifndef fish
    YELLOW := $(shell tput -Txterm setaf 3)
    GREEN := $(shell tput -Txterm setaf 2)
    RESET := $(shell tput -Txterm sgr0)
else
    set -x YELLOW (set_color yellow)
    set -x GREEN (set_color green)
    set -x RESET (set_color normal)
endif

# Define the targets and their commands
.PHONY: help
help:
	@echo "$(YELLOW)Usage:$(RESET)"
	@echo "  make $(GREEN)<target>$(RESET)"
	@echo ""
	@echo "$(YELLOW)Targets:$(RESET)"
	@echo "  $(GREEN)predeploy$(RESET)       Run 'npm run build'"
	@echo "  $(GREEN)deploy$(RESET)         Deploy to gh-pages with 'gh-pages -d dist'"
	@echo "  $(GREEN)dev$(RESET)            Run 'vite'"
	@echo "  $(GREEN)build$(RESET)          Run 'vite build'"
	@echo "  $(GREEN)lint$(RESET)           Run ESLint on src"
	@echo "  $(GREEN)preview$(RESET)        Run 'vite preview'"

.PHONY: deploy
deploy:
	@npm run predeploy
	@npm run deploy

.PHONY: dev
dev:
	@npm run dev

.PHONY: build
build:
	@nmp run build

.PHONY: lint
lint:
	@npm run lint

.PHONY: preview
preview:
	@npm run preview
