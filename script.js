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

            /* Extract usernames and emails */
            usernames = data.map(row => row.username).filter(username => username !== undefined);
            emails = data.map(row => row.email || "No email").filter(email => email !== undefined);

            /* Enable button if usernames are found */
            if (usernames.length > 0 && emails.length > 0) {
                document.getElementById('spinBtn').disabled = false;
            } else {
                alert('No usernames or emails found in the file.');
            }
        }
        reader.readAsArrayBuffer(this.files[0]);
    });

    document.getElementById('spinBtn').addEventListener('click', function() {
        var resultDiv = document.getElementById('result');
        var resultEmailDiv = document.getElementById('result-email');
        var spinBtn = document.getElementById('spinBtn');

        // Disable the button during the spin
        spinBtn.disabled = true;

        // Start the rapid text change animation
        var index = 0;
        var interval = setInterval(function() {
            resultDiv.textContent = usernames[index];
            resultEmailDiv.textContent = emails[index];
            index = (index + 1) % usernames.length;
        }, 100); // Change text every 100ms

        // Stop the animation after 3 seconds
        setTimeout(function() {
            clearInterval(interval);
            var randomIndex = Math.floor(Math.random() * usernames.length);
            resultDiv.textContent = "Winner username: " + usernames[randomIndex];
            resultEmailDiv.textContent = "Winner e-mail: " + emails[randomIndex];

            // Re-enable the button after stopping
            spinBtn.disabled = false;
        }, 3000); // Run animation for 3 seconds
    });
}