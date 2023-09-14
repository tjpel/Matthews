# Project Setup Guide

## Prerequisites

- **Python**: Required for running the project.
- **Poetry**: For Python dependency management. [Learn more](https://python-poetry.org/)
- **Postgres Database**: Can be local or port-forwarded container for development.
- **Google Cloud OAuth 2.0**: Set up credentials for the application. [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
  - Scopes `auth/userinfo.email` and `auth/userinfo.profile` must be enabled.

## Setup

### Environment File
1. Create a `.env` file, copied from `example.env`.
2. Place it in the `backend` directory if it conflicts with the top-level Next.js project.
   - **Note**: We should probably move the Next.js project into a separate `frontend` directory.

### Google Cloud Credentials

- Set `GOOGLE_CLIENT_*` variables to the matching information from the Google Cloud Console.

### Postgres Database

- Ensure that `POSTGRES_*` variables point to the database you will be using.
- Use Supabase URL for this

### Backend Setup

From within the `backend` directory, execute the following commands:

1. Run `poetry install` to install dependencies.
2. Run `poetry shell` to enter the Python virtual environment.
3. Run `alembic upgrade` to run database migrations.
4. Run `uvicorn app.main:app --reload` to start the development server.

## Troubleshooting

The setup is just from memory, so if anything goes wrong or needs clarification, please message the group chat.

Message us for a proper .env file so everything is consistent
