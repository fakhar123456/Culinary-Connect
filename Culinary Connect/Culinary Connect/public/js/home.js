const greeting = document.querySelector('.greeting');
const email = document.querySelector('.email');
const newEmail = document.querySelector('.email');
const newDonation = document.querySelector('.donations');



window.onload = () => {





        if (!sessionStorage.name) {
            location.href = '/login';
        } else {
            greeting.innerHTML = `Name : ${sessionStorage.name} `;
            email.innerHTML = `Email : ${sessionStorage.email}`;

        }



        fetch('/getthenudonations', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const dt = data.toString();
                const liveUpdate = document.querySelector('.liveDonations');
                const donars = document.querySelector('.donars');
                liveUpdate.textContent = dt;
                donars.textContent = dt;
                console.log(dt);
            })
            .catch(error => {
                console.error('Error receiving image data:', error);
            });

        
        
            const data = { email: sessionStorage.email };
            console.log(data);

            fetch('/getting-user-donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Server response:', data['numberdonation']);
                    const dta = "Donations Done : " + data['numberdonation'].toString();
                    newDonation.textContent = dta;
                })
                .catch(error => {
                    console.error('Error sending data:', error);
                });



}


const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.href = '/login';
    

}






