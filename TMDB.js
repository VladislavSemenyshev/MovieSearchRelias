//JS for TMDB Website
//Calling API with user input query, switching between pages of results, and being able to run query over and over
//July 19th, 2022
//By Vladislav Semenyshev

const APIKEY = "df6d26d906f1b224b2d8e6b189ceb558";
const BASEURL = "https://api.themoviedb.org/3/";
const IMAGEURL = "https://image.tmdb.org/t/p/w154";
const colNum = 4;
let movieData;
let userSearch;
           
//Click listener for button, gets search field value, runs query from API
document.getElementById("searchMovie").addEventListener("click", ()  =>
{
    userSearch = document.getElementById("searchField").value;
    movieData = "";
    let url = ''.concat(BASEURL, 'search/movie?api_key=', APIKEY, '&query=', userSearch);
    fetchMovieData(url);
});
            
//enter key listener, triggers click listener
document.getElementById("searchField").addEventListener("keyup", function(event) 
{
    if (event.keyCode === 13) 
    {
        event.preventDefault();
        document.getElementById("searchMovie").click();
    }
});
           
//next page button listener, apends query with next page if it exists, reloads content
document.getElementById("nextPage").addEventListener("click", ()  =>
{
    if(movieData.page !== movieData.total_pages)
    {
        let newPage = movieData.page + 1;
        let url = ''.concat(BASEURL, 'search/movie?api_key=', APIKEY, '&query=', userSearch, "&page=", newPage);
        fetchMovieData(url);
        document.getElementById('currentPage').innerHTML = newPage;
    }
 });
            
 //previous page listener, apends query with last page if it exists, reloads content
 document.getElementById("prevPage").addEventListener("click", ()  =>
 {
    if(movieData.page !== 1)
    {
        let newPage = movieData.page - 1;
        let url = ''.concat(BASEURL, 'search/movie?api_key=', APIKEY, '&query=', userSearch, "&page=", newPage);
        fetchMovieData(url);
        document.getElementById('currentPage').innerHTML = newPage;
    }
});
            
//function to print data gathered from API query
function printPage(movieData)
{
    //enabling navigation buttons and page display
    document.getElementById('nav').style.display = "block";
    for(let i = 1; i <= colNum; i++)
    {
        document.getElementById('column' + i).innerHTML = "";
    }
               
    //disables button press if buttons are on outer edges of data
    document.getElementById("prevPage").disabled = (movieData.page === 1);
    document.getElementById("nextPage").disabled = (movieData.page === movieData.total_pages);
                
    //printing data split evenly into columns, columns decided based on HTML and global colNum variable
    for (let pos = 0, i = 1; i <= colNum; pos += movieData.results.length / colNum, i++)
    {
        currColumn = ''.concat('column', i);
        columnPrint(pos, pos + (movieData.results.length / colNum), currColumn);
    }

}
            
//function to fetch movie data from API, with url variable dependant on what last called the function
function fetchMovieData(url)
{
    fetch(url)
   .then(result=>result.json())
   .then((pulledData)=>
   {
        movieData = pulledData;
                    
        //printing no results if no data is found
        if(movieData.results.length === 0)
        {
            for(let i = 1; i <= colNum; i++)
            {
                document.getElementById('column' + i).innerHTML += "No Results! :(";
            }
        }
                    
        //if data found, call page print function
        else
        {
            printPage(movieData);
        }                   
    });
 }
            
//column printing function, does bulk of print logic
function columnPrint(start, end, column)
{
    //start and end set by user, spliting data between sections of the "results" array returned by API call
    for(let i = start; i < end; i++)
    {   
    document.getElementById(column).innerHTML += '<br><a href="https://www.themoviedb.org/movie/' + movieData.results[i].id + '">'
        + movieData.results[i].title + '</a>'
        + '<br>Release Date: ' + movieData.results[i].release_date 
        + '<br>' 
                                
        //printing either poster if fond, or blank no poster image if no poster file is returned on API call
        if(movieData.results[i].poster_path !== null)
        {
            document.getElementById(column).innerHTML += '<img src="' + IMAGEURL + movieData.results[i].poster_path + '"/><br>';
        }
        else
        {
            document.getElementById(column).innerHTML += '<img src="noposter.png"/><br>';
        }                        
    }
}