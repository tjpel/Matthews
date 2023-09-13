Prerequisites
Python (ofc)
Poetry, for Python dependency management: https://python-poetry.org/
A Postgres database (I used a local port-forwarded container for development)
Set up Google Cloud OAuth 2.0 credentials for the application: https://console.cloud.google.com/apis/dashboard
Scopes auth/userinfo.email and auth/userinfo.profile must be enabled

Setup
Create .env file copied from example.env
Place in backend dir if it conflicts with the top level Next.js project (we should probably move that into a separate frontend directory)
Set GOOGLE_CLIENT_* to the matching information from the Google Cloud Console
Ensure that POSTGRES_* point to the database you will be using
From within the backend directory:
Run poetry install to install dependencies
Run poetry shell to enter python venv
Run alembic upgrade to run database migrations
Run uvicorn app.main:app --reload to start the development server

The setup is just from memory, so tell me if anything goes wrong or needs clarification. 
Also, if by "set up backend" you meant deploying it, I can look into that as well.