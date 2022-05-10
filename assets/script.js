
// Making references for the appropriate HTML Elements 


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

var saveSearchHistory = function(){

}

