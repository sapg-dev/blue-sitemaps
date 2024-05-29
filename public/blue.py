import csv
from pymongo import MongoClient
import urllib.parse

# MongoDB connection details
username = urllib.parse.quote_plus('blue-sitemaps')
password = urllib.parse.quote_plus('h72f4X9OnN396p2P')
cluster = 'blue.hgntyje.mongodb.net'

# CSV file path
csv_file_path = '/Users/pacifictrout/Documents/blue-sitemaps/public/sitemap.csv'

# Connect to MongoDB with SSL certificate verification disabled
connection_string = f'mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true'
client = MongoClient(connection_string)

db = client['blue-sitemaps']
collection = db['data']

# Read CSV and insert into MongoDB
def csv_to_mongodb(csv_file_path):
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)

            for row in csv_reader:
                print(row)  # Print the current row
                collection.insert_one(row)
        print("Data insertion completed.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Execute the insertion
csv_to_mongodb(csv_file_path)
