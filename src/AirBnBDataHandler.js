/**
 * @module AirBnBDataHandler
 * This module provides a factory function that returns methods
 * to load and process AirBnB listings data.
 */

import { readFile, writeFile } from 'node:fs/promises';
import csv from 'csv-parser';
import { createReadStream } from 'node:fs';

/**
 * @typedef {Object} Listing
 * @property {number} price - Price of the listing.
 * @property {number} number_of_rooms - Number of rooms.
 * @property {number} review_score - Review score.
 * @property {string} host_id - Host identifier or host name.
 * // Add or adjust fields as per your CSV columns
 */

/**
 * Parses a CSV string into an array of objects.
 * @param {string} csvData - The CSV file content as a string.
 * @returns {Listing[]} Array of listing objects.
 */
export async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
  
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const price = Number(row.price.replace(/[^0-9.]/g, ''));
            row.price = price; // Store price as a number
            results.push(row);
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

/**
 * A factory function that creates an AirBnBDataHandler object with chainable methods.
 * @param {Listing[]} [initialListings=[]] - Optional initial listings array.
 * @returns {Object} An object containing data handling methods.
 */
function createAirBnBDataHandler(initialListings = []) {
  // The data we will process (make sure it is only mutated in pure ways, or replaced).
  let _listings = [...initialListings];

  /**
   * Filters the listings based on price, number_of_rooms, and/or review_score.
   * @param {Object} filterCriteria
   * @param {number} [filterCriteria.minPrice] - Minimum price.
   * @param {number} [filterCriteria.maxPrice] - Maximum price.
   * @param {number} [filterCriteria.minRooms] - Minimum number of rooms.
   * @param {number} [filterCriteria.maxRooms] - Maximum number of rooms.
   * @param {number} [filterCriteria.minReview] - Minimum review score.
   * @param {number} [filterCriteria.maxReview] - Maximum review score.
   * @returns {Object} The handler itself (for chaining).
   */
  function filterListings({
    minPrice,
    maxPrice,
    minRooms,
    maxRooms,
    minReview,
    maxReview,
  } = {}) {
    _listings = _listings.filter((listing) => {
        //const price = Number(listing.price.replace(/[^0-9.]/g, '')); 
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
    return handler; // Return the handler object to enable chaining
  }
  function getListings() {
    return _listings;
}
  /**
   * Computes statistics based on current filtered listings:
   * 1. How many listings match the filter.
   * 2. Average price per number of rooms.
   * @returns {{ count: number, averagePricePerRoom: number }} Stats object.
   */
  function computeStats() {
    const count = _listings.length;
    let averagePricePerRoom = 0;
    if (count > 0) {
      // For example: total price / total rooms
      const totalPrice = _listings.reduce((sum, l) => sum + l.price, 0);
      const totalRooms = _listings.reduce((sum, l) => sum + Number(l.bedrooms), 0);
      averagePricePerRoom = totalRooms === 0 ? 0 : totalPrice / totalRooms;
    }

    return {
      count,
      averagePricePerRoom,
    };
  }

  /**
   * Computes how many listings are there per host, and returns a ranking (descending).
   * @returns {Array<{ host_id: string, count: number }>} Array of objects sorted by count desc.
   */
  function computeListingsByHost() {
    const hostMap = _listings.reduce((acc, listing) => {
      const hostKey = listing.host_id || 'unknown';
      acc[hostKey] = (acc[hostKey] || 0) + 1;
      return acc;
    }, {});

    const ranking = Object.entries(hostMap)
      .map(([host_id, count]) => ({ host_id, count }))
      .sort((a, b) => b.count - a.count);

    return ranking;
  }

  /**
   * Exports the current listings array (or a stats object) to a user-specified file.
   * @param {string} outputPath - Where to save the JSON file of results.
   * @param {Object} data - The data you want to export; can be stats or filtered listings.
   * @returns {Promise<void>} A promise that resolves when file is written.
   */
  async function exportResults(outputPath, data) {
    const jsonString = JSON.stringify(data, null, 2);
    await writeFile(outputPath, jsonString, 'utf-8');
  }

  // We store all methods in a single object for convenience
  const handler = {
    filterListings,
    computeStats,
    computeListingsByHost,
    exportResults,
    getListings
  };

  return handler;
}

/**
 * Loads the CSV file, parses its content, and returns a new AirBnBDataHandler.
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Object>} A promise that resolves to the created handler with data loaded.
 */
export async function loadAirBnBData(filePath) {
    try {
        const parsedListings = await parseCSV(filePath);
        return createAirBnBDataHandler(parsedListings);
    } catch (error) {
        console.error('Error loading Airbnb data:', error.message);
        throw error; // Rethrow error for handling
    }
}
