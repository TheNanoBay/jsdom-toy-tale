let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  loadToys();
  createFormListener();
  createLikeListener();



  function loadToys(){
    const toyUrl = "http://localhost:3000/toys"
    fetch(toyUrl)
    .then(resp => resp.json())
    .then(json => {
      result = Object.values(json);
      addToys(result);
    })
  }


  function addToys(toyInfo){
    let toysCollection = document.querySelector('#toy-collection');
    //parse through JSON data to get elements we want 

   toyInfo.forEach //keys[name] key[image] key [likes]

   for (let i = 0; i < toyInfo.length; i++){
     let toyId = toyInfo[i].id
     let toyName = toyInfo[i].name
     let toyImage = toyInfo[i].image
     let toyLikes = toyInfo[i].likes

     let newCardEl = document.createElement('div');
     newCardEl.className = "card";
     newCardEl.id = toyId;
     toysCollection.appendChild(newCardEl);
     newCardEl.innerHTML = `<h2>${toyName}</h2><img src=${toyImage} class="toy-avatar" /><p> ${toyLikes} </p><button data-id=${toyId} class= "like-btn">Like <3</button>`
   }

  }

  function createFormListener(){
    const form = document.querySelector(".add-toy-form");
    form.addEventListener('submit', function(e){
      e.preventDefault();

      //creating a new toy object** to the back end + use to update the front end 
      const newToy = {   //target right now respresents the form node as the 'responding event' 
        name: e.target['name'].value,   //['name'] refers to the field in form that gets user input for name
        image: e.target['image'].value, // ['image'] refrs to the field in form that gets user input for image
      }

      //UPDATE BACKEND PT.1 
      const reqObj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newToy)
      }

      //UPDATR BACKEND PT.2
      fetch("http://localhost:3000/toys", reqObj)
      .then((resp) => resp.json())
      .then(toy => {
        form.reset(); 
        addToys(toy)  //call to UPDATE FRONTEND w/ new return from backend (notice it is toy NOT newToy from abov)
        location.reload (); //refreshing the page once new toy is added to front end HTML 
      })
    })
  }

  function createLikeListener(){
    const toyContainer = document.querySelector('#toy-collection')
    toyContainer.addEventListener('click', function(e){
      if (e.target.className === 'like-btn'){
        const id = e.target.dataset.id   //don't know if this works 
        const pTag = e.target.previousElementSibling
        const currentLikes = parseInt(pTag.innerText.split(' ')[0])
        const addedLike = currentLikes + 1 

        const reqObj = {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({likes: addedLike})
        }

        console.log(id)
        console.log(reqObj)

        fetch(`http://localhost:3000/toys/${id}`, reqObj)
        .then(resp => resp.json())
        .then(data => {
          pTag.innerText = `${addedLike} likes`;
          console.log("we added the like")
          //debugger
        })


      }
    })
 
  }






});
