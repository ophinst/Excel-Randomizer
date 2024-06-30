let usernames = [];
let emails = [];

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
    
            /* Extract usernames adn email */
            usernames = data.map(row => row.username).filter(username => username);
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
        // Pick random number
        var randomNum = Math.floor(Math.random() * usernames.length);
        var randomUsername = usernames[randomNum];
        var randomEmail = emails[randomNum];
        
        // Get div of username and email
        var usernameDiv = document.getElementById('username');
        var emailDiv = document.getElementById('email');

        // Clear previous content
        usernameDiv.innerHTML = '';
        emailDiv.innerHTML = '';

        // Add new element to display data
        var usernameDisp = document.createElement('p');
        usernameDisp.textContent = "Username: " + randomUsername;
        var emailDisp = document.createElement('p');
        emailDisp.textContent = "Email: " + randomEmail;

        // Append to page
        usernameDiv.appendChild(usernameDisp);
        emailDiv.appendChild(emailDisp);
    });
}