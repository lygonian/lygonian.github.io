# E_commerce Customers 
In this project I will generate new features, analyse the data and train a linear regression model. Further i will determine the highest contributing feature to the target variable "Yearly Amount Spent".

![Alt text](https://github.com/lygonian/e_commerce_customers/blob/master/images/summary.png?raw=true)

## Goal
This dataset has data of customers who buys clothes online. The store offers in-store style and clothing advice sessions. Customers come in to the store, have sessions/meetings with a personal stylist, then they can go home and order either on a mobile app or website for the clothes they want.
The company is trying to decide whether to focus their efforts on their mobile app experience or their website.

## About the Data
We work with a company’s e-commerce customer CSV file. This file contains customer information such as email, address, and a colored avatar. Additionally, there are the following columns with numerical variables:”
* Avg. Session Length: average length of in-store style advice sessions in minutes
* Time on App: average time spent on the app in minutes
* Time on Website: average time spent on the website in minutes
* Length of Membership: how many years the customer has been a member
* Yearly Amount Spent: the average yearly amount spent by the customer in dollars

## Notebook  
View notebook [here](https://nbviewer.org/github/lygonian/e_commerce_customers/blob/master/notebooks/ecommerce_customers.ipynb)  
File saved [here](Notebooks/ecommerce_customers.ipynb)  
The notebook includes:
1. Data preparation
2. Feature engineering:  
- extracting state from "Address"
- extracting e-mail provider from "Email"
- extracting recipient from address
3. Data preprocessing
- scaling and winsorizing
4. Linear regression model


## Future Implications 
The linear Regression model showed that the length of the membership is the most important feature, but it can't be actively changed. Therefore the company should spend it's recources in developing the app, because this one is the next highest contributor to the amount spend yearly, while the time spent on the website only have a minimal effect.


## Autor
- Samet Kurt - github: lygonian

