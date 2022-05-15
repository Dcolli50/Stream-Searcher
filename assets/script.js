
// Making references for the appropriate HTML Elements 
var previousSearches = document.querySelector("#previous-searches");
var searchForm = document.querySelector("#search-form");
var searchBar = document.querySelector("#search-bar");
var streamingServices = document.querySelector("#streaming-services");
var posterDisplay = document.querySelector("#poster-display");
var trailerDisplay = document.querySelector("#trailer-display");
var playIcon = document.querySelector("#play-icon");
var clearBtn = document.querySelector("#clear-btn")

// function for toggling the play button. It kicks in everytime a trailer is displayed. See displayTrailer() function
var playIconToggle = function(){
   playIcon.classList.toggle("display-toggle-block", "display-toggle-none");
};

// function for toggling the clear button. It kicks in everytime a movie name is listed in the search history section
var clearBtnToggle = function(){
   clearBtn.classList.toggle("display-toggle-block", "display-toggle-none");
};


// Initializing necessary variables
var currentSearchArr = []; // Array to keep track of user searches.
var streamServiceObj = {}; // Needed for later

// display the streaming service icons
var displayStreamingServices = function(iconUrlArr, serviceLinkArr){
   console.log(streamServiceObj);
   streamingServices.textContent = "";
   for (var i=0;i<iconUrlArr.length;i++){
      // create an anchore element for linkin the icons to the corresponding services
      var serviceAnchore = document.createElement("a");
      serviceAnchore.setAttribute("href", serviceLinkArr[i]);
      serviceAnchore.setAttribute("target", "_blank");
      serviceAnchore.className = "column";
      // create an img element for the icons
      var iconImg = document.createElement("img");
      iconImg.setAttribute("src",iconUrlArr[i]);

      serviceAnchore.appendChild(iconImg);

      streamingServices.appendChild(serviceAnchore);
   };
   
};

// get the URL for the streaming services icons.
// There is a really nasty nested loop in here. We may have to optimize it later.
// I think it is good enough just for the MVP
var getIconUrls = function(iconIdArr){
   var serviceIconUrl = [];
   // use fetch to get the necessary source object containing link to the icons
   var apiUrl="https://api.watchmode.com/v1/sources/?apiKey=ntfiTPIROJRnm1mIwd13rp7RXDCL6n3OeIxphmHt";
   fetch(apiUrl).then(function(response){
      if(response.ok){
         response.json().then(function(data){
            // iterate over the list of icon IDs
            for (var i=0;i<iconIdArr.length;i++){
               // for every icon ID (currIconId) from previous loop, match that icons ID with the API Obj
               var currIconId = iconIdArr[i];
               for (var j=0;j<data.length;j++){
                  if (currIconId === data[j].id) {
                     serviceIconUrl.push(data[j].logo_100px);
                  };
               }
            }
            streamServiceObj.iconsUrl = serviceIconUrl;
            displayStreamingServices(streamServiceObj.iconsUrl, streamServiceObj.serviceLinks);
         });
      } else {
         alert("Could not get the stream service information!")
      }
   });
};

// Get the information for movie (Streaming service) using the previously obtained ID from GetMovieID function.
var getMovieInfo = function(id){ 
   // initialize an array to hold all the streaming services
   var streamServiceArr = [];
   var iconIds = [];
   var serviceLinks = [];

   var apiUrl = "https://api.watchmode.com/v1/title/" + id +"/details/?apiKey=ntfiTPIROJRnm1mIwd13rp7RXDCL6n3OeIxphmHt&append_to_response=sources";

   // var apiUrl2 = "https://api.watchmode.com/v1/title/" + id +"/sources/?apiKey=ntfiTPIROJRnm1mIwd13rp7RXDCL6n3OeIxphmHt";

   fetch(apiUrl).then(function(response){
      if(response.ok){
         response.json().then(function(data){
            for(var i=0;i<data.sources.length; i++){
               if (!streamServiceArr.includes(data.sources[i].name)){
                  streamServiceArr.push(data.sources[i].name);
                  iconIds.push(data.sources[i].source_id);
                  serviceLinks.push(data.sources[i].web_url);
               }
            };
            streamServiceObj.title = data.title;
            streamServiceObj.trailerLink = data.trailer;
            streamServiceObj.trailerThumbnail = data.trailer_thumbnail;
            streamServiceObj.serviceLinks = serviceLinks;
            streamServiceObj.serviceNames = streamServiceArr;
            streamServiceObj.iconsIds = iconIds;
            getIconUrls(streamServiceObj.iconsIds);
            displayTrailer(streamServiceObj);
         });
      } else {
         // this will be replace with modals later 
         alert("Streaming Source not Found!");
      }
   });
   
};

// display Movie poster
var displayPoster = function(posterUrl) {
   posterDisplay.textContent = "";
   var posterImgEl = document.createElement("img");
   posterImgEl.setAttribute("src",posterUrl);
   posterImgEl.setAttribute("alt", "Movie Poster");
   posterDisplay.appendChild(posterImgEl);
};

// display Movie trailer
var displayTrailer = function(obj){
   trailerDisplay.textContent = '';


   if (!obj.trailerLink){
      var anchoreEl = document.createElement("a");
      anchoreEl.setAttribute("target","_blank");
      anchoreEl.setAttribute("href", 'https://www.youtube.com/results?search_query='+obj.title + ' trailer');
      var badThumbnail = document.createElement("img");
      badThumbnail.setAttribute("src", "./assets/images/error.jpg");
      badThumbnail.setAttribute("title", "No Trailer found. Click here to search on YouTube!");
      anchoreEl.appendChild(badThumbnail);
      trailerDisplay.appendChild(anchoreEl);
      playIconToggle();
   } else {
      var anchoreEl = document.createElement("a");
      anchoreEl.setAttribute("target","_blank");
      anchoreEl.setAttribute("href", obj.trailerLink);
      var thumbnail = document.createElement("img");
      thumbnail.setAttribute("src", obj.trailerThumbnail);
      anchoreEl.appendChild(thumbnail);
      trailerDisplay.appendChild(anchoreEl);
      playIconToggle();
   }
   

   var anchoreEl = document.createElement("a");
   anchoreEl.setAttribute("target","_blank");
   anchoreEl.setAttribute("href", trailerLink);
   var thumbnail = document.createElement("img");
   thumbnail.setAttribute("src", trailerThumb);
   anchoreEl.appendChild(thumbnail);
   trailerDisplay.appendChild(anchoreEl);
   playIconToggle();

   // trailerDisplay.textContent = '';
   // var anchoreEl = document.createElement("a");
   // anchoreEl.setAttribute("target","_blank");
   // anchoreEl.setAttribute("href", trailerLink);
   // var thumbnail = document.createElement("img");
   // thumbnail.setAttribute("src", trailerThumb);
   // anchoreEl.appendChild(thumbnail);
   // trailerDisplay.appendChild(anchoreEl);

   // playIconToggle();

   trailerDisplay.textContent = '';
   var anchoreEl = document.createElement("iframe");
   anchoreEl.setAttribute("framborder", '0');
   trailerLink = trailerLink.replace("watch?v=", "embed/");
   anchoreEl.setAttribute("src", trailerLink);
   trailerDisplay.appendChild(anchoreEl);

};


// Get the WatchMode ID for the movie through this function
var getMovieId = function(movieName){
   var apiUrl = 
   "https://api.watchmode.com/v1/autocomplete-search/?apiKey=ntfiTPIROJRnm1mIwd13rp7RXDCL6n3OeIxphmHt&search_value=" + movieName +"&search_type=2";

   // var apiUrl2 = "https://api.watchmode.com/v1/search/?apiKey=ntfiTPIROJRnm1mIwd13rp7RXDCL6n3OeIxphmHt&search_field=name&search_value=" + movieName;

   fetch(apiUrl).then(function(response){
      // check if the response is ok
      if(response.ok){
         response.json().then(function(data){
            // if there are multiple titles containing the movie name. Use a loop to show it all.
            console.log(data.results[0].id);
            var movieId = data.results[0].id;
            var poster = data.results[0].image_url;
            displayPoster(poster);
            getMovieInfo(movieId);
            
         });
      } else {
         // This will be replaced with modal
         alert("Something went wrong!");
      }
   });
};

// Display movie's name in the search history. This function will be called in two different places:
// When a movie name is searched by the user
// When movie search history is loaded from localStorage (See: loadSearchHistory function)
var displaySearchedMovie = function(movieName){
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
// We will call this function everytime the currentSearchArr updates. In other words:
// Everytime the user makes a search using the form.

var saveSearchHistory = function(currentSearchArr){
   localStorage.setItem("Current-Searches", JSON.stringify(currentSearchArr));
};


// Load the saved search history from the localStorage. This function is going to be called
// as soon as the page is loaded.
var loadSearchHistory = function(){
   // save the list of searches in a temporary variable storedSearchArr;
   var storedSearchArr = JSON.parse(localStorage.getItem("Current-Searches"));
   // if no previous data is saved in the local storage, just initialize an emtpy list for current searches.
   if (!storedSearchArr) {
      storedSearchArr = [];
      
   }
   
   // append all the movie names stored in the list through a for loop
   for (var i=0;i<storedSearchArr.length;i++){
      displaySearchedMovie(storedSearchArr[i]);
   };
   
};

// Search for the movie with this function. 
// This function will call the 'fetch' functions and initiate the search for finding the streaming services
// Specifically, the getMovieId() function will be called. It will call the getMovieInfo() function
// It will also add the searched movie into the currentSearchArr global array. This array is saved in the
// local stroage (see the function saveSearchHistory).
var searchFormHandler = function(event){
   // stop the page from refreshing
   event.preventDefault();
   var movieTitleSearched = searchBar.value.trim(); //get the searched movie title
   
   if (movieTitleSearched){
      getMovieId(movieTitleSearched);
      // display the movie name in the search history if it doesn't exist already
      // use conditionals
      
      if (!currentSearchArr.includes(movieTitleSearched.toUpperCase())){
         
         displaySearchedMovie(movieTitleSearched);
       
      };
   } else {
      // will be replaced with modal later 
      alert("Please enter a movie name")
   }


};

// The function that displays movie info if their names are clicked in the Search History
var previousSearchClickHandler = function(event){
   var clickedElName = event.target.textContent;
   getMovieId(clickedElName);
};

// function that clears the search history and the current displayed movie information
var clear = function(event){
   if (event.target.textContent === "Clear History"){
      // update the currentSearchArr
      currentSearchArr = [];
      saveSearchHistory(currentSearchArr);
      // refresh the page
      // window.location.reload();
      previousSearches.textContent = "";
      
   }
   
};

loadSearchHistory();
// adding the event listener and handler to search-form for searching movie by titles
searchForm.addEventListener("submit", searchFormHandler); // calling the searchedFormHandler function when the form is submitted.

// adding the event listener and handler for search history section. Clicking on the movie names will display
// the information about the movie.
previousSearches.addEventListener("click", previousSearchClickHandler);

// adding the event listener and handler for the clear button. It will call the clear function
clearBtn.addEventListener("click", clear);