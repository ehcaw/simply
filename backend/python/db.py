import pandas as pd
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

# Load environment variables from .env.local
load_dotenv('.env.local')

# Retrieve the environment variables
db_host = os.getenv('AWS_HOST')
db_user = os.getenv('AWS_USER')
db_password = os.getenv('AWS_PASSWORD')
db_database = os.getenv('AWS_DATABASE')

# Construct the database URL
db_url = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_database}"

# Create the SQLAlchemy engine
engine = create_engine(db_url)

# Use the engine to read the SQL tables into pandas DataFrames
drinks_data = pd.read_sql("SELECT * FROM drinks", engine)
ingredients_data = pd.read_sql("SELECT * FROM ingredients", engine)
drink_ingredients_data = pd.read_sql("SELECT * FROM drink_ingredients", engine)
sales_data = pd.read_sql("SELECT * FROM sales", engine)
supplies_ordered_data = pd.read_sql("SELECT * FROM supplies_ordered", engine)
