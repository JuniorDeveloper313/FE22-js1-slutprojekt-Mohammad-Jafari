const api_key = "700e1835a54565194f255c589ba55c7c";
const searchbtn = document.querySelector("#search");

//Event listener for the search button
searchbtn.addEventListener("click", getimage);

//Main function that gets called when the search button is clicked
function getimage(event) {
  event.preventDefault();

  //get the user input values
  const textinput = document.querySelector("#textinput");
  const searchTerm  = textinput.value.toLowerCase();
  const numimage = document.querySelector("#numinput");
  const amountimages = numimage.value;

  //check if the user input is empty
  if (searchTerm  === "") {
    alert("Please enter a text in the input fields!");
    location.reload();
    return;
  }

  textinput.value = "";
  numimage.value = "";

  //get the user's sort order selection
  const sort = document.querySelector("#sorted");
  const valuesort = sort.value;

  //show the loading animation
  document.querySelector("#loading").style.display = "block";
  anime
    .timeline({
      targets: "#loading h1",
      easing: "easeOutInCubic",
      loop: true,
      scale: 2,
      duration: 100,
      direction: "alternate",
    })
    .add({
      color: `hsl(0, 100%, 50%)`,
    })
    .add({
      color: `hsl(60, 100%, 50%)`,
    })
    .add({
      color: `hsl(120, 100%, 50%)`,
    })
    .add({
      color: `hsl(180, 100%, 50%)`,
    })
    .add({
      color: `hsl(240, 100%, 50%)`,
    })
    .add({
      color: `hsl(300, 100%, 50%)`,
    });
  
  //fetch the images from the Flickr API
  fetchimage(searchTerm , amountimages, valuesort);

  //clear the image display
  document.querySelector("#image-display").innerHTML = "";
}

//function to fetch the images from the API
function fetchimage(searchTerm , amountimages, valuesort) {

  //check if the amount of images is not specified or is 0
  if (amountimages === "" || amountimages==="0") {
    amountimages = 1;
  }

  //URL for the API call
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&text=${searchTerm}&sort=${valuesort}&per_page=${amountimages}&format=json&nojsoncallback=1`;

  fetch(url)
    .then(function (response) {

      //check if the response is successful
      if (response.status >= 200 && response.status < 300) {
        console.log(response);
        return response.json();
      } else {
        throw "Something went wrong.";
      }
    })

    .then(function (imagedata) {

      //check if the data is valid
      if (!imagedata || !imagedata.photos || !imagedata.photos.photo) {
        alert('Something went wrong!!!')
        location.reload();
      }
      setTimeout(() => {
        //loop through the number of images specified
        for (let i = 0; i < amountimages; i++) {
          geturlimage(imagedata.photos.photo[i]);
          //hide the loading animation
          document.querySelector("#loading").style.display = "none";
        }
      }, 1000);
    })
    .catch(function (error) {
      //show an error message
      alert("Something went wrong!!!");
      location.reload();
    });
}

//function to get the image URLs
function geturlimage(data) {

  //check if the data is valid
  if (!data || !data.server || !data.id || !data.secret) {
    alert('There is no image with this name');
    location.reload();
  }
  const image = data;

  //get the user's image size selection
  const imageSizeSelect  = document.querySelector("#size");
  const valuesize = imageSizeSelect .value;

  //construct the image URL
  const imageurl = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_${valuesize}.jpg`;
  displayimage(imageurl);
  console.log(imageurl);
}

//function to display the images on the page
function displayimage(element) {
  const img = document.createElement("img");
  img.src = element;

  img.addEventListener("click", function () {
    img.requestFullscreen();
  });

  //animation for the images
  anime.timeline({
    targets: img,
    translateX: ['-100%', '0%'],
    easing: 'easeOutExpo',
    duration: 1000,
  })
    .add({
      scale: [0, 2],
      easing: 'easeOutExpo',
      duration: 1000,
    })
    .add({
      rotate: '1turn',
      easing: 'easeOutExpo',
      duration: 1000,
    });

  document.querySelector("#image-display").append(img);
};


document.body.addEventListener('keyup', event => {
  if (!window.screenTop && !window.screenY) {
    if (event.key === ' ') {
      console.log('right', document.exitFullscreen)
      document.exitFullscreen();
    }
  }
});