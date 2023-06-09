from asyncore import write
import requests
import csv
from bs4 import BeautifulSoup

url = 'https://store.optum.com/shop/category/medication-treatment/stomach-digestive/'
response = requests.get(url)

with open("optum_stomach_digestive.html", "r") as f_in:
    data = f_in.read()

soup = BeautifulSoup(data, 'html.parser')

# Find the title of the page
title = soup.find('title').text
print('Title:', title, '\n\n')

# Find all the links on the page

products = []
links = soup.find_all('img')
for link in links:
    product = []

    product.append(link.get('alt')) # Title
    product.append(link.get('alt').replace(" ", "-")) # Handle
    product.append("active") # Status
    product.append("GeissMed") # Vendor
    product.append("Health Care") # Product Category
    product.append("Product") # Type
    product.append("box") # Unit Type
    product.append("pills") # Tags
    product.append("TRUE") # Published
    product.append("") # Variant Grams
    product.append("24.99") # Variant Price
    product.append("FALSE") # Variant Requires Shipping
    product.append("manual") # Variant Fulfillment Service
    product.append("FALSE") # Variant Taxable
    product.append(link.get('src')) # Image Src
    product.append('1') # Image Position
    product.append(link.get('alt')) # Image Alt Text
    product.append(link.get('alt')) # SEO Title

    products.append(product)


with open('products_stomach_and_digestive.csv', 'w', newline='') as file:
     writer = csv.writer(file)
     header = ["Title", "Handle", "Status", "Vendor", "Product Category", "Type", "Unit Type", "Tags", "Published", "Variant Grams", "Variant Price", "Variant Requires Shipping", "Variant Fulfillment Service","Variant Taxable", "Image Src", "Image Position", "Image Alt Text", "SEO Title"]
     writer.writerow(header)
   
     for product in products:
         writer.writerow(product)