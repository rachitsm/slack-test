//Main Javascript file for LightBox
//Global variables used
var apiKey = '136a3eb317aef4ae90d43404504adbe7';
var tags = "nature";
var photosPerPage,lbWrapper,lb,response,tagsTxt;

//Function executed when DOM is loaded
function init(){
    tagsTxt = document.getElementById("tags");
    tagsTxt.value = "";
    console.log("current tag="+tags);
}

//Main Function to fetch images from Flickr using API
function getPhotos(){
    lbWrapper = document.getElementById("lbWrapper");
    lb = document.getElementById("lb");
    if(tagsTxt.value)
    {
        tags = tagsTxt.value;
        console.log("entered tag="+tags);
    }
    photosPerPage = 10;

    //HTTP call to fetch JSON from Flickr
    var xmlhttp = new XMLHttpRequest();
    var url =  "https://api.flickr.com/services/rest/?method=flickr.photos.search"+
        "&api_key="+apiKey+"&tags="+tags+"&per_page="+photosPerPage+"&format=json&nojsoncallback=1";
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            response = JSON.parse(xmlhttp.response);
            var photos = response.photos;
            var i,out="",src="";
            for(i = 0; i < photos.photo.length; i++) {
                src="https://farm"+photos.photo[i].farm+".staticflickr.com/"+photos.photo[i].server+"/"+photos.photo[i].id+
                    "_"+photos.photo[i].secret+"_q.jpg";
                out += '<img src="' + src + '" onclick="display(this)" title="'+photos.photo[i].title+'">';
            }
            document.getElementById("images").innerHTML = out;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Function to perform LightBox operation and display images with medium size
function display(img){
    //function local variables
    var currImgSrc = img.src;
    var currImgTitle = img.title;
    var photos = response.photos;
    var i,src=[],title=[];
    var newSrc = currImgSrc.replace("_q","_c");
    lb.innerHTML = '<img src="'+newSrc+'"><div id="caption"></div>';
    var caption = document.getElementById("caption");
    if(currImgTitle.title!=""){
        console.log(currImgTitle);
        caption.innerHTML = currImgTitle;
    }
    else{
        caption.innerHTML = "No Title"
    }
    lbWrapper.style.display = "block";
    for(i = 0; i < photos.photo.length; i++) {
        src.push("https://farm"+photos.photo[i].farm+".staticflickr.com/"+photos.photo[i].server+"/"+photos.photo[i].id+
            "_"+photos.photo[i].secret+"_q.jpg");
        title.push(photos.photo[i].title);
    }

//Function to display next image after clicking on right side/arrow
    document.getElementById("right").onclick = function(){
        for(i = 0; i < src.length; i++){
            if(src[i]==currImgSrc){
                break;
            }
            else{
                continue;
            }
        }
        if(i<src.length-1){
            newSrc = src[i+1].replace("_q","_c");
            lb.innerHTML = '<img src="'+newSrc+'"><div id="caption"></div>';
            var caption = document.getElementById("caption");
            currImgTitle = title[i+1];
            if(currImgTitle.title!=""){
                caption.innerHTML = currImgTitle;
            }
            else{
                caption.innerHTML = "No Title"
            }
            currImgSrc = src[i+1];
            currImgTitle = title[i+1];
        }
    };

//Function to display next image after clicking on right side/arrow
    document.getElementById("left").onclick = function(){

        for(i = src.length; i > 0; i--){
            if(src[i]==currImgSrc){
                break;
            }
            else{
                continue;
            }
        }
        if(i>0){
            newSrc = src[i-1].replace("_q","_c");
            lb.innerHTML = '<img src="'+newSrc+'"><div id="caption"></div>';
            var caption = document.getElementById("caption");
            currImgTitle = title[i-1];
            if(currImgTitle.title!=""){
                caption.innerHTML = currImgTitle;
            }
            else{
                caption.innerHTML = "No Title"
            }
            currImgSrc = src[i-1];
            currImgTitle = title[i-1];
        }
    };

//Function for closing
    document.getElementById("close").onclick = function(){
        lbWrapper.style.display = "none";
    };
}
