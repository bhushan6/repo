import React, { useState } from "react";
import "./style.css";

import axios from "axios";

const filmsEndpointURL = "http://localhost:8000/api/assessments/films";

//Your API token. This is needed to successfully authenticate when calling the films endpoint.
//This needs to be added to the Authorization header (using the Bearer authentication scheme) in the request you send to the films endpoint.
const apiToken = "8c5996d5-fb89-46c9-8821-7063cfbc18b1";

const config = {
  headers: { Authorization: `Bearer ${apiToken}` },
};

const Films = () => {
  const [filmData, setFilmData] = useState({
    bestRatedFilm: "N/A",
    longestFilm: "N/A",
    avgRating: "N/A",
    shortestDiffInFilm: "N/A",
  });
  /**
   * Retrieves the name of the best rated film from the given list of films.
   * If the given list of films is empty, this method should return "N/A".
   */
  const getBestRatedFilm = (films = []) => {
    if (!films || films.length === 0) return "N/A";
    let rating = 0;
    let bestRatedMovie = "N/A";

    films?.forEach((film) => {
      if (rating < Number(film.rating)) {
        rating = film.rating;
        bestRatedMovie = film.name;
      }
    });

    return bestRatedMovie;
  };

  /**
   * Retrieves the length of the film which has the longest running time from the given list of films.
   * If the given list of films is empty, this method should return "N/A".
   *
   * The return value from this function should be in the form "{length} mins"
   * For example, if the duration of the longest film is 120, this function should return "120 mins".
   */
  const getLongestFilm = (films = []) => {
    if (!films || films.length === 0) return "N/A";

    let length = 0;
    let longestMovie = "N/A";

    films?.forEach((film) => {
      if (length < Number(film.length)) {
        length = film.length;
        longestMovie = film.name;
      }
    });

    return longestMovie;
  };

  /**
   * Retrieves the average rating for the films from the given list of films, rounded to 1 decimal place.
   * If the given list of films is empty, this method should return 0.
   */
  const getAverageRating = (films = []) => {
    if (!films || films.length === 0) return 0;

    let totalRating = 0;
    films?.forEach((film) => {
      totalRating += Number(film.rating);
    });

    return (totalRating / films.length || 1).toFixed(2);
  };

  /**
   * Retrieves the shortest number of days between any two film releases from the given list of films.
   *
   * If the given list of films is empty, this method should return "N/A".
   * If the given list contains only one film, this method should return 0.
   * Note that no director released more than one film on any given day.
   *
   * For example, if the given list is composed of the following 3 entries
   *
   * {
   *    "name": "Batman Begins",
   *    "length": 140,
   *
   *    "rating": 8.2,
   *    "releaseDate": "2006-06-16",
   *    "directorName": "Christopher Nolan"
   * },
   * {
   *    "name": "Interstellar",
   *    "length": 169,
   *    "rating": 8.6,
   *    "releaseDate": "2014-11-07",
   *    "directorName": "Christopher Nolan"
   * },
   * {
   *   "name": "Prestige",
   *   "length": 130,
   *   "rating": 8.5,
   *   "releaseDate": "2006-11-10",
   *   "directorName": "Christopher Nolan"
   * }
   *
   * then this method should return 147, as Prestige was released 147 days after Batman Begins.
   */
  const getShortestNumberOfDaysBetweenFilmReleases = (films) => {
    const sortedByDates = films.sort(function (a, b) {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    });

    let minDifference = "N/A";

    for (let index = 0; index < sortedByDates.length; index++) {
      const current = sortedByDates[index];
      const nextMovie = sortedByDates[index + 1];

      if (nextMovie) {
        const date1 = new Date(current.releaseDate);
        const date2 = new Date(nextMovie.releaseDate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log(diffDays);

        if (minDifference === "N/A" || minDifference > diffDays) {
          minDifference = diffDays;
        }
      }
    }

    return minDifference;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `${filmsEndpointURL}/?directorName=${e.target[0].value}`,
      config
    );

    const bestRatedFilm = getBestRatedFilm(data);
    const longestFilm = getLongestFilm(data);
    const avgRating = getAverageRating(data);
    const shortestDiffInFilm = getShortestNumberOfDaysBetweenFilmReleases(data);

    setFilmData({
      bestRatedFilm,
      longestFilm,
      avgRating,
      shortestDiffInFilm,
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} id="input-form">
        <input id="input-box" />
        <button type="submit" className="submit-button">
          Submit
        </button>
        <div>
          <h2>Best Rated Film</h2>
          <p>{filmData.bestRatedFilm}</p>
        </div>

        <div>
          <h2>Longest Film Duration</h2>
          <p>{filmData.longestFilm}</p>
        </div>

        <div>
          <h2>Average Rating</h2>
          <p>{filmData.avgRating}</p>
        </div>

        <div>
          <h2>shortest Days between release</h2>
          <p>{filmData.shortestDiffInFilm}</p>
        </div>
      </form>
    </>
  );
};

export default Films;
