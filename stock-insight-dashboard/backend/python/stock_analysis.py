import matplotlib
# 
matplotlib.use("Agg")

# for loading yahoo finance api we use this yfinance
import yfinance as yf
# Provides plotting functions
import matplotlib.pyplot as plt
import os
import sys

try:
    symbol = sys.argv[1].upper()
except IndexError:
    print("Usage: python stock_analysis.py SYMBOL")
    sys.exit(1)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "output", symbol)
os.makedirs(OUTPUT_DIR, exist_ok=True)

price_path = os.path.join(OUTPUT_DIR, "price.png")
volume_path = os. path.join(OUTPUT_DIR, "volume.png")

#it's downloading data from yfinance library which is base on NSE stock data  
data = yf.download(symbol + ".NS", period="3mo", interval="5d")

if data.empty:
    print("No data found")
    # it's basically python built-in function to exit the program
    #  that's protect to crash the program when no data found
    sys.exit(1)

data_path = os.path.join(OUTPUT_DIR, f"{symbol}_data.csv")
data.to_csv(data_path)

print("Data saved successfully")

x = range(len(data))
# x-axis dates formatting with a string format and proper indexing
dates = data.index.strftime('%Y-%m-%d')

# PRICE CHART
'''it;s create a new figuare by sizing of 10*5 inches'''
plt.figure(figsize=(10,5)) # first width then height
# it's basically matplotlib function which is used to plot line  graph
# and it's plot closing price of stock with label close price
plt.plot(x, data['Close'].values, label='Close Price',marker='o')
plt.xticks(x, dates, rotation=35)
plt.title(f'{symbol} Close Price')
plt.xlabel('Date')
plt.ylabel('Price')
plt.legend()
plt.tight_layout()
plt.savefig(price_path)
plt.close()

# ✅ VOLUME AS LINE (NO BAR = NO CRASH)
plt.figure(figsize=(10,5))
plt.plot(x, data['Volume'].values, label='Volume',marker='o')
plt.xticks(x, dates, rotation=45)
plt.title(f'{symbol} Volume')
plt.xlabel('Date')
plt.ylabel('Volume')
plt.legend()
plt.tight_layout()
plt.savefig(volume_path)
plt.close()

print("Analysis complete")
