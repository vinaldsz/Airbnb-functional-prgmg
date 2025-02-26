# Airbnb-functional-prgmg

## Submitted by Vinal Dalcy Dsouza

Functional programming demonstration that uses Airbnb data to analyze various metrics using `map`, `filter`, and other functions.

## Overview

The **AirBnBDataHandler** module provides a factory function that allows loading, filtering, and analyzing Airbnb listings from a CSV file. It includes methods to compute statistics, analyze host data, and export results to a JSON file.

## Features

- **CSV Parsing**: Reads Airbnb listings from a CSV file and converts them into structured objects.
- **Filtering**: Filter listings based on price, number of rooms, and review scores.
- **Statistics Computation**: Calculate the count of listings and the average price per room.
- **Host Analysis**: Determine the number of listings per host and rank them.
- **Export Results**: Save filtered listings or statistics as a JSON file.
- **Chainable Methods**: Enables method chaining for ease of use.

## How to Run the Project

Clone the repository:

```sh
git clone https://github.com/vinaldsz/Airbnb-functional-prgmg.git
cd Airbnb-functional-prgmg
```
Install dependencies:

``` npm install ```

Start Server:

``` npm start ```

# Usage

src folder includes cli.js which gives interactive console based prompt

Run the file using

``` node ../src/cli.js ```


