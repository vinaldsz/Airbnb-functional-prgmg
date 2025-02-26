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

## Pure Function in `AirbnbDataHandler.js`

A **pure function** is one that:
- Does not mutate any external state.
- Returns the same output for the same input (deterministic).
- Has no side effects.

In the `AirbnbDataHandler.js` module, the `filterListings` function is an example of a pure function:

```javascript
// Pure function: Filters the listings without mutating the original data.
function filterListings({
  minPrice,
  maxPrice,
  minRooms,
  maxRooms,
  minReview,
  maxReview,
} = {}) {
  _listings = _listings.filter((listing) => {
    if (minPrice !== undefined && listing.price < minPrice) return false;
    if (maxPrice !== undefined && listing.price > maxPrice) return false;
    if (minRooms !== undefined && listing.bedrooms < minRooms) return false;
    if (maxRooms !== undefined && listing.bedrooms > maxRooms) return false;
    if (minReview !== undefined && listing.review_scores_rating < minReview) return false;
    if (maxReview !== undefined && listing.review_scores_rating > maxReview) return false;
    return true;
  });
  return handler; // Return handler to allow chaining
} 
```
### Why is it a Pure Function?

1. **No Mutation of External State**: The function does not modify the original `_listings` array. Instead, it returns a new filtered list based on the provided criteria.
2. **Deterministic Output**: Given the same input data and filter criteria, this function will always return the same output.
3. **No Side Effects**: This function doesn’t cause any observable side effects like modifying variables outside of the function or performing I/O operations.

## Impure Function - Counter Example

```javascript
// Impure function: Filters the listings and mutates the original data.
function filterListingsImpure({
  minPrice,
  maxPrice,
  minRooms,
  maxRooms,
  minReview,
  maxReview,
} = {}) {
  _listings.forEach((listing, index) => {
    if (minPrice !== undefined && listing.price < minPrice) {
      _listings[index].removed = true;  // Mutates original data: marking listings as removed
    } else if (maxPrice !== undefined && listing.price > maxPrice) {
      _listings[index].removed = true;  // Mutates original data: marking listings as removed
    } else {
      _listings[index].removed = false; // Mutates original data: resetting the removed flag
    }
  });
  return handler; // Return handler to allow chaining, but original _listings array is mutated
}
```

# Why is it Impure ?

* Mutates the Original Data: The original _listings array is directly mutated by adding or modifying the removed property. This violates the pure function principle because the function changes external state.
* Side Effects: The modification of the _listings array introduces side effects. Other parts of the code that use _listings may see unintended changes because this function altered the data.
* Non-Deterministic: The result of the function is not predictable because the state of _listings is modified within the function. If the function is called multiple times on the same dataset, the state of _listings will evolve in ways that might not be easy to track or predict.

# Method Chaining in `AirbnbDataHandler.js`

The `filterListings` function returns handler making methods chainable i.e. we would be able to do something like myHandler.filter( ... ).computeStats(). This approach is very concise and readable.

# Method Chaining - Counter Example

```javascript
function filterListings({
  minPrice,
  maxPrice,
  minRooms,
  maxRooms,
  minReview,
  maxReview,
} = {}) {
  // Create a new array to hold the filtered listings
  const filteredListings = _listings.filter((listing) => {
    // We only filter if the user provided a constraint
    if (minPrice !== undefined && listing.price < minPrice) return false;
    if (maxPrice !== undefined && listing.price > maxPrice) return false;
    if (minRooms !== undefined && listing.bedrooms < minRooms)
      return false;
    if (maxRooms !== undefined && listing.bedrooms > maxRooms)
      return false;
    if (minReview !== undefined && listing.review_scores_rating < minReview)
      return false;
    if (maxReview !== undefined && listing.review_scores_rating > maxReview)
      return false;
    return true;
  });

  // Return the filtered listings instead of the handler object
  return filteredListings;
}
```

# Why does it defy method chaining?

* Returns filtered listings and not the handler object.
* It performs only the task that it is intended to do and has less flexibility.

# Creative Addition

High Demand listings are returned based on the availability in last 30 days and the review count

A listing is considered hgh demand if
1. It has less availability i.e. availability_30 < 10
2. It has number_of_reviews >100

