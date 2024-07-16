let uploads = [];
const form = document.querySelector('form');

const email = sessionStorage.email;
const name = sessionStorage.name;


window.onload = () => {

  fetch('/tg/getallimages', {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      // update html href attribtues
      // console.log('Images data received:', data);


      const uploadsContainer = document.getElementById('uploadsContainer');
      uploadsContainer.innerHTML = '';
      for (const item of data) {

        const box = document.createElement('div');
        box.classList.add('box');

        const image = document.createElement('img');
        image.src = item.imageurl;

        const title = document.createElement('h3');
        title.textContent = item.title;

        const description = document.createElement('p');
        description.textContent = item.description;

        const location = document.createElement('p');
        location.textContent = item.area;


        box.appendChild(image);
        box.appendChild(title);
        box.appendChild(description);
        box.appendChild(location);

        uploadsContainer.appendChild(box);

        // console.log(item);
      }

    })
    .catch(error => {
      console.error('Error receiving image data:', error);
    });
}



form.addEventListener('submit', (e) => {
  e.preventDefault();

  const imageInput = document.getElementById('imageInput');
  const titleInput = document.getElementById('titleInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const locationInput = document.getElementById('locationInput');

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('description', descriptionInput.value);
  formData.append('location', locationInput.value);
  formData.append('persoanlName', name.toString());
  formData.append('persoanlEmail', email.toString());

  fetch('/tg/index-user', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log('Donation uploaded:', data);

      // Reset form or show a success message
      form.reset();
    })
    .catch(error => {
      console.error('Error uploading donation:', error);
    });


});
