let usernames = [];
let emails = [];
let currentRotation = 0;

window.onload = function() {
    document.querySelector('input').addEventListener('change', function() {
        var reader = new FileReader();
        reader.onload = function() {
            var arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);
            /* Call XLSX */
            var workbook = XLSX.read(binaryString, {
                type: "binary"
            });

            /* Get first sheet */
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];

            /* Convert to JSON */
            var data = XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            });

            /* Extract usernames and emails */
            usernames = data.map(row => row.username).filter(username => username !== undefined);
            emails = data.map(row => row.email || "No email").filter(email => email !== undefined);

            /* Enable button if usernames are found */
            if (usernames.length > 0) {
                document.getElementById('pickOneBtn').disabled = false;
            } else {
                alert('No usernames found in the file.');
            }
        }
        reader.readAsArrayBuffer(this.files[0]);
    });


    document.getElementById('pickOneBtn').addEventListener('click', function() {
        var letter = document.getElementById('letter');
        var usernameDiv = document.getElementById('username');
        var emailDiv = document.getElementById('email');

        // Clear previous content
        usernameDiv.innerHTML = '';
        emailDiv.innerHTML = '';
        letter.style.display = 'none';

        // Pick a random username and email
        var randomNum = Math.floor(Math.random() * usernames.length);
        var randomUsername = usernames[randomNum];
        var randomEmail = emails[randomNum];

        // Show the letter animation
        letter.style.display = 'block';
        letter.style.animation = 'none'; // Reset animation
        letter.offsetHeight; // Trigger reflow
        letter.style.animation = ''; // Restart animation

        // Show result after animation
        setTimeout(function() {
            var usernameDisp = document.createElement('p');
            usernameDisp.textContent = "Username: " + randomUsername;
            var emailDisp = document.createElement('p');
            emailDisp.textContent = "Email: " + randomEmail;

            // Append to page
            usernameDiv.appendChild(usernameDisp);
            emailDiv.appendChild(emailDisp);
        }, 2000); // Match the delay to the animation duration
    });
}
