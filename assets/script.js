
// Making references for the appropriate HTML Elements 
var previousSearches = document.querySelector("#previous-searches");
var searchForm = document.querySelector("#search-form");
var searchBar = document.querySelector("#search-bar");
var streamingServices = document.querySelector("#streaming-services");
var posterDisplay = document.querySelector("#poster-display");
var trailerDisplay = document.querySelector("#trailer-display");
var clearBtn = document.querySelector("#clear-btn")
var movieInfo = document.getElementById("movie-info");
var movieTitle = document.getElementById("movie-title");
var GenMovieInfo = document.getElementById("general-movie-info");
var slideInBtn = document.querySelector(".slidein");
var plot = document.querySelector(".plot-overview");
var testPoster = document.getElementById("test-poster");
var overviewBtn = document.getElementById("overview-btn");


// function for toggling the clear button. It kicks in everytime a movie name is listed in the search history section
var clearBtnToggle = function () {
   clearBtn.classList.toggle("display-toggle-block", "display-toggle-none");
};

// Modal variable declaration
var modal = document.getElementById("myModal");
var modalText = document.getElementById("modal-text");
var closeBtn = document.getElementById("close-btn");

// function for toggling the clear button. It kicks in everytime a movie name is listed in the search history section
var clearBtnToggle = function () {
   clearBtn.classList.toggle("display-toggle-block", "display-toggle-none");
};


// Initializing necessary variables
var currentSearchArr = []; // Array to keep track of user searches.
var streamServiceObj = {}; // Needed for later

// display the streaming service icons
var displayStreamingServices = function (iconUrlArr, serviceLinkArr) {
   console.log(streamServiceObj);
   streamingServices.textContent = "";
   for (var i = 0; i < iconUrlArr.length; i++) {
      // create an anchor element for linkin the icons to the corresponding services
      var serviceAnchore = document.createElement("a");
      serviceAnchore.setAttribute("href", serviceLinkArr[i]);
      serviceAnchore.setAttribute("target", "_blank");
      serviceAnchore.className = "column";
      // create an img element for the icons
      var iconImg = document.createElement("img");
      iconImg.setAttribute("src", iconUrlArr[i]);

      serviceAnchore.appendChild(iconImg);

      streamingServices.appendChild(serviceAnchore);
   };

};

// get the URL for the streaming services icons.
// There is a really nasty nested loop in here. We may have to optimize it later.
// I think it is good enough just for the MVP
var getIconUrls = function (iconIdArr) {
   var serviceIconUrl = [];
   // use fetch to get the necessary source object containing link to the icons
   var apiUrl = "https://api.watchmode.com/v1/sources/?apiKey=B56CG2oDO7zdr9jqLgqqzG28kuvsMfoBfC9hQFFr";
   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            // iterate over the list of icon IDs
            for (var i = 0; i < iconIdArr.length; i++) {
               // for every icon ID (currIconId) from previous loop, match that icons ID with the API Obj
               var currIconId = iconIdArr[i];
               for (var j = 0; j < data.length; j++) {
                  if (currIconId === data[j].id) {
                     serviceIconUrl.push(data[j].logo_100px);
                  };
               }
            }
            streamServiceObj.iconsUrl = serviceIconUrl;
            displayStreamingServices(streamServiceObj.iconsUrl, streamServiceObj.serviceLinks);
         });
      } else {
         showModal();
         modalText.innerHTML = "<h2>Sorry! We could not find any streaming service information!</h2><br><p>(Click outside of this box to exit)</p>"
      }
   });
};

// Function to display general movie information
var displayMovieInfo = function (obj) {
   console.log("Movie Information obj" + obj);
   // clear previous displayed info


   GenMovieInfo.textContent = "";

   movieInfo.classList = "card-content card";
   // set the title for the movie
   movieTitle.className = "card-header-title";
   movieTitle.textContent = obj.title;

   // use a for loop to display other information as list elements
   // make an array with texts to be appended.
   var texts = ["Type: " + obj.type, "Release Date: " + obj.date, "Genre: " + obj.genreArr.toString(), "Content Rating: " + obj.contentRating];
   for (var i = 0; i < texts.length; i++) {
      var infoEl = document.createElement("li");
      infoEl.textContent = texts[i];
      GenMovieInfo.appendChild(infoEl);
   };
   // the last two list items with badges

   // The user rating
   var ratingEl = document.createElement("li");
   ratingEl.textContent = "User Rating: ";
   var ratingTag = document.createElement("span");

   // user rating badge color determine
   ratingTag.textContent = obj.rating;
   if (!obj.rating) {
      ratingTag.textContent = "Unavailable";
      ratingTag.classList = "tag is-white";

   } else {
      if (obj.rating >= 0 && obj.rating < 3) {
         ratingTag.classList = "tag is-danger";
      } else if (obj.rating >= 3 && obj.rating < 7) {
         ratingTag.classList = "tag is-warning";
      } else {
         ratingTag.classList = "tag is-success";
      }
   }
   ratingEl.appendChild(ratingTag);

   // The critic Score
   var scoreEl = document.createElement("li");
   scoreEl.textContent = "Critic Score: ";
   var scoreTag = document.createElement("li");
   scoreTag.textContent = obj.score;

   // critic score badge color determine
   scoreTag.textContent = obj.score;

   if (!obj.score) {
      scoreTag.textContent = "Unavailable";
      scoreTag.classList = "tag is-white";

   } else {
      if (obj.score >= 0 && obj.score < 30) {
         scoreTag.classList = "tag is-danger";
      } else if (obj.score >= 30 && obj.score < 70) {
         scoreTag.classList = "tag is-warning";
      } else {
         scoreTag.classList = "tag is-success";
      }
   }

   scoreEl.appendChild(scoreTag);

   GenMovieInfo.appendChild(ratingEl);
   GenMovieInfo.appendChild(scoreEl);


   movieInfo.classList.add("movieInfo-animation"); //this line is for animation


   // make the slidein button appear
   slideInBtn.style.display = 'block';

};


// Get the information for movie (Streaming service) using the previously obtained ID from GetMovieID function.
var getMovieInfo = function (id) {
   // initialize an array to hold all the streaming services
   var streamServiceArr = [];
   var iconIds = [];
   var serviceLinks = [];

   var apiUrl = "https://api.watchmode.com/v1/title/" + id + "/details/?apiKey=B56CG2oDO7zdr9jqLgqqzG28kuvsMfoBfC9hQFFr&append_to_response=sources";

   // var apiUrl2 = "https://api.watchmode.com/v1/title/" + id +"/sources/?apiKey=B56CG2oDO7zdr9jqLgqqzG28kuvsMfoBfC9hQFFr";

   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            for (var i = 0; i < data.sources.length; i++) {
               if (!streamServiceArr.includes(data.sources[i].name)) {
                  streamServiceArr.push(data.sources[i].name);
                  iconIds.push(data.sources[i].source_id);
                  serviceLinks.push(data.sources[i].web_url);
               }
            };
            // add general movie info
            streamServiceObj.title = data.title;
            streamServiceObj.type = data.type;
            streamServiceObj.date = data.release_date;
            streamServiceObj.genreArr = data.genre_names;
            streamServiceObj.contentRating = data.us_rating;
            streamServiceObj.rating = data.user_rating;
            streamServiceObj.score = data.critic_score;
            // add movie plot 
            streamServiceObj.plot = data.plot_overview;
            // add trailer info
            streamServiceObj.trailerLink = data.trailer;
            streamServiceObj.posterUrl = data.poster;
            // add stream service info
            streamServiceObj.serviceLinks = serviceLinks;
            streamServiceObj.serviceNames = streamServiceArr;
            streamServiceObj.iconsIds = iconIds;
            getIconUrls(streamServiceObj.iconsIds);
            displayTrailer(streamServiceObj);
            displayMovieInfo(streamServiceObj);
         });
      } else {
         showModal();
         modalText.innerHTML = "<h2>Streaming source not found!</h2><br><p>(Click outside of this box to exit)</p>"
      }
   });

};

// display Movie poster
var displayPoster = function (posterUrl) {
   posterDisplay.textContent = "";
   var posterImgEl = document.createElement("img");
   posterImgEl.setAttribute("src", posterUrl);
   posterImgEl.setAttribute("alt", "Movie Poster");
   // animate the appearance start
   posterImgEl.className = "poster-slidein-start";
   requestAnimationFrame(() => {
      posterImgEl.classList.remove("poster-slidein-start");
      posterImgEl.classList.add("poster-slidein-end");
   });
   // animate the apparance end
   posterImgEl.setAttribute("title", "Click to Enlarge");
   posterDisplay.appendChild(posterImgEl);
};

// display Movie trailer
var displayTrailer = function (obj) {

   trailerDisplay.textContent = '';

   if (!obj.trailerLink) {
      var anchoreEl = document.createElement("a");
      anchoreEl.setAttribute("target", "_blank");
      anchoreEl.setAttribute("href", 'https://www.youtube.com/results?search_query=' + obj.title + ' trailer');
      var badThumbnail = document.createElement("img");
      badThumbnail.setAttribute("src", "./assets/images/error.jpg");
      badThumbnail.setAttribute("title", "No Trailer found. Click here to search on YouTube!");
      badThumbnail.style.width = "60%"; //setting the size of error image
      anchoreEl.appendChild(badThumbnail);
      trailerDisplay.appendChild(anchoreEl);
   } else {
      var anchoreEl = document.createElement("iframe");
      anchoreEl.setAttribute("framborder", '0');
      var trailerLink = obj.trailerLink;
      trailerLink = trailerLink.replace("watch?v=", "embed/");
      anchoreEl.setAttribute("src", trailerLink);
      trailerDisplay.appendChild(anchoreEl);
   }

};


// Get the WatchMode ID for the movie through this function
var getMovieId = function (movieName) {
   var movieObjArr = [];
   var apiUrl =
      "https://api.watchmode.com/v1/autocomplete-search/?apiKey=B56CG2oDO7zdr9jqLgqqzG28kuvsMfoBfC9hQFFr&search_value=" + movieName + "&search_type=2";


   // var apiUrl2 = "https://api.watchmode.com/v1/search/?apiKey=B56CG2oDO7zdr9jqLgqqzG28kuvsMfoBfC9hQFFr&search_field=name&search_value=" + movieName;

   fetch(apiUrl).then(function (response) {
      // check if the response is ok
      if (response.ok) {
         response.json().then(function (data) {

            // if there are multiple titles containing the movie name. Use a loop to show it all.
            for (var i = 0; i < data.results.length; i++) {
               var movieObj = {
                  id: data.results[i].id,
                  name: data.results[i].name,
                  imgUrl: data.results[i].image_url
               }

               if (!movieObjArr.filter(obj => obj.name === data.results[i].name).length > 0) {
                  /* movieObjArr does not contain the element we're looking for */
                  movieObjArr.push(movieObj);
               }
            };


            if (movieObjArr.length === 1) {
               var movieId = movieObjArr[0].id;
               var poster = movieObjArr[0].imgUrl;
               displayPoster(poster);
               getMovieInfo(movieId);

            } else if (movieObjArr.length === 0) {
               showModal();
               modalText.innerHTML = "<h2> 😔 </br> Sorry! We could not find this movie. Please check your spelling.</h2><br><p>(Click outside of this box to exit)</p>"
            } else {
               showModal();
               modalText.innerHTML = "";
               modalText.innerHTML = "<h2 class='modal-header'> Did you mean? </h2>";
               for (var i = 0; i < movieObjArr.length; i++) {
                  var text = "<li class='modal-content-movie list-item box' data-image='" + movieObjArr[i].imgUrl + "' id='" + movieObjArr[i].id + "'>" + movieObjArr[i].name + "</li>";
                  modalText.innerHTML += text;
               };

               document.querySelector('.modal').addEventListener('click', function (event) {
                  var clickedClass = event.target;
                  if (clickedClass.classList.contains("modal-content-movie")) {
                     var movieId = clickedClass.getAttribute("id");
                     var poster = clickedClass.getAttribute("data-image");
                     displayPoster(poster);
                     getMovieInfo(movieId);
                     var movieTitleSearched = clickedClass.textContent;
                     if (!currentSearchArr.includes(movieTitleSearched.toUpperCase())) {
                        displaySearchedMovie(movieTitleSearched);
                     };
                     modal.style.display = 'none';
                  }
               });
            }
         });
      } else {
         showModal();
         modalText.innerHTML = "<h2>Something went wrong!<br>(Click outside of this box to exit)</h2>";
      }
   });
};

// Display movie's name in the search history. This function will be called in two different places:
// When a movie name is searched by the user
// When movie search history is loaded from localStorage (See: loadSearchHistory function)
var displaySearchedMovie = function (movieName) {
   clearBtnToggle();
   var movieNameItem = document.createElement("li");
   movieNameItem.classList = "list-item box";
   movieName = movieName.toUpperCase();
   movieNameItem.textContent = movieName;
   // Add the name to the currentSearchArr
   currentSearchArr.push(movieName);
   // Add in the local Storage
   saveSearchHistory(currentSearchArr);
   previousSearches.appendChild(movieNameItem);
};




// This function will take the currentSearchArr and save it in the local storage.
// We will call this function every time the currentSearchArr updates. In other words:
// Every time the user makes a search using the form.

var saveSearchHistory = function (currentSearchArr) {
   localStorage.setItem("Current-Searches", JSON.stringify(currentSearchArr));
};


// Load the saved search history from the localStorage. This function is going to be called
// as soon as the page is loaded.
var loadSearchHistory = function () {
   // save the list of searches in a temporary variable storedSearchArr;
   var storedSearchArr = JSON.parse(localStorage.getItem("Current-Searches"));
   // if no previous data is saved in the local storage, just initialize an emtpy list for current searches.
   if (!storedSearchArr) {
      storedSearchArr = [];

   }

   // append all the movie names stored in the list through a for loop
   for (var i = 0; i < storedSearchArr.length; i++) {
      displaySearchedMovie(storedSearchArr[i]);
   };

};

// Search for the movie with this function. 
// This function will call the 'fetch' functions and initiate the search for finding the streaming services
// Specifically, the getMovieId() function will be called. It will call the getMovieInfo() function
// It will also add the searched movie into the currentSearchArr global array. This array is saved in the
// local storage (see the function saveSearchHistory).
var searchFormHandler = function (event) {
   // stop the page from refreshing
   event.preventDefault();
   var movieTitleSearched = searchBar.value.trim(); //get the searched movie title

   if (movieTitleSearched) {
      getMovieId(movieTitleSearched);
      // display the movie name in the search history if it doesn't exist already
      // use conditionals

      // if (!currentSearchArr.includes(movieTitleSearched.toUpperCase())){

      //    displaySearchedMovie(movieTitleSearched);

      // };
   } else {
      showModal();
      modalText.innerHTML = "<h2>Please enter a title!</h2><br><p>(Click outside of this box to exit)</p>";
   }
};

function showModal() {
   //----------START MODAL SECTION----------//
   modal.style.display = "block";
   window.onclick = function (event) {
      if (event.target.getAttribute("class") === "modal") {
         modal.style.display = "none";
         var modalContainer = document.querySelector(".modal-content");
         modalContainer.classList.remove("transparent-modal");
      };
   }
};
//-----------END MODAL SECTION-----------//


// The function that displays movie info if their names are clicked in the Search History
var previousSearchClickHandler = function (event) {
   var clickedElName = event.target.textContent;
   movieInfo.classList.remove("movieInfo-animation"); // this line is for animation
   getMovieId(clickedElName);
};

// function that clears the search history and the current displayed movie information
var clear = function (event) {
   if (event.target.textContent === "Clear History") {
      // update the currentSearchArr
      currentSearchArr = [];
      saveSearchHistory(currentSearchArr);
      // refresh the page
      // window.location.reload();
      previousSearches.textContent = "";
   }
};

// function for showing the plot overview
var showPlotOverview = function (obj) {
   if (plot.style.display === 'block') {
      plot.style.display = 'none';
   } else {
      plot.style.display = 'block';
      plot.textContent = "";
   }
   var plotText = document.createElement("p");
   plotText.textContent = obj.plot;
   plot.appendChild(plotText);
};


loadSearchHistory();
// adding the event listener and handler for showing plot overview for the movies
slideInBtn.addEventListener("click", function () {
   // slideInBtn.classList.toggle("rotate180");
   showPlotOverview(streamServiceObj);
   overviewBtn.classList.toggle("rotate180");
});

// adding the event listener and handler to search-form for searching movie by titles
searchForm.addEventListener("submit", searchFormHandler); // calling the searchedFormHandler function when the form is submitted.

// adding the event listener and handler for search history section. Clicking on the movie names will display
// the information about the movie.
previousSearches.addEventListener("click", previousSearchClickHandler);

// adding the event listener and handler for the clear button. It will call the clear function
clearBtn.addEventListener("click", clear);

// adding the event listener for poster clicking
posterDisplay.addEventListener('click', (event) => {
   showModal();
   modalText.innerHTML = "<img class='poster-in-modal fade-out' src=" + streamServiceObj.posterUrl + ">";
   // modalText.innerHTML = "<img class='poster-in-modal fade-out' src='./assets/images/test-poster.jpg'>"

   requestAnimationFrame(() => {
      var posterInModal = document.querySelector(".poster-in-modal");
      posterInModal.classList.remove("fade-out");
   });

   var modalContainer = document.querySelector(".modal-content");
   console.log(modalContainer);
   modalContainer.classList.add("transparent-modal");

});
