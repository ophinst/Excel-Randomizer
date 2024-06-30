let usernames = [];

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
    
            /* Extract usernames */
            usernames = data.map(row => row.username).filter(username => username);
    
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
        if (usernames.length > 0) {
            var randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
            var usernameDiv = document.getElementById('username');
            usernameDiv.innerHTML = ''; // Clear previous content
            var p = document.createElement('p');
            p.textContent = randomUsername;
            usernameDiv.appendChild(p);
        } else {
            alert('No usernames available to pick.');
        }
    });
}