
// Making references for the appropriate HTML Elements 
var previousSearches = document.querySelector("#previous-searches");


// Initializing necessary variables
var currentSearchArr = []; // Array to keep track of user searches.

// Get the information for movie (Streaming service, release date etc) using the previously obtained ID from GetMovieID function.
var getMovieInfo = function(id){ 
   // initialize an array to hold all the streaming services
   var streamServiceArr = [];
   var apiUrl = "https://api.watchmode.com/v1/title/" + id +"/sources/?apiKey=aLmqepfkqFpg8Bt9eHTBrVrvxQChgOYWAAUXD2io";

   fetch(apiUrl).then(function(response){
      if(response.ok){
         response.json().then(function(data){
            for(var i=0;i<data.length; i++){
               if (!streamServiceArr.includes(data[i].name)){
                  streamServiceArr.push(data[i].name);
               }
            };
         });
      } else {
         // this will be replace with modals later 
         alert("Streaming Source not Found!");
      }
   })
   console.log(streamServiceArr);
};

// Get the WathMode ID for the movie through this function
var getMovieId = function(movieName){
   var apiUrl = "https://api.watchmode.com/v1/search/?apiKey=aLmqepfkqFpg8Bt9eHTBrVrvxQChgOYWAAUXD2io&search_field=name&search_value=" + movieName;

   fetch(apiUrl).then(function(response){
      // check if the response is ok
      if(response.ok){
         response.json().then(function(data){
            // if there are multiple titles containing the movie name. Use a loop to show it all.
            console.log(data.title_results[0].id);
            var movieId =  data.title_results[0].id;
            getMovieInfo(movieId);
            
         });
      } else {
         // This will be replaced with modal
         alert("Something went wrong!");
      }
   });
};

// Display movies name in the search history. This function will be called in two different places:
// When a movie name is searched by the user
// When movie search history is loaded from localStorage (See: loadSearchHistory function)
var displaySearchedMovie = function(movieName){
      var movieNameItem = document.createElement("li");
      movieNameItem.classList = "list-item box";
      movieNameItem.textContent = movieName;
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
      currentSearchArr = [];
   } else {
      // If there is previous data, then append them in the currSearchArr;
      currentSearchArr = currentSearchArr.concat(storedSearchArr);
   }
   // append all the movie names stored in the list through a for loop
   for (var i=0;i<currentSearchArr.length;i++){
      displaySearchedMovie(currentSearchArr[i]);
   };
};

loadSearchHistory();