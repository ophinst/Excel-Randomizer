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

            /* Enable buttons if usernames are found */
            if (usernames.length > 0 && emails.length > 0) {
                document.getElementById('spinBtn').disabled = false;
                document.getElementById('generate100Btn').disabled = false;
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
            resultDiv.textContent = "Winner username: " + usernames[index];
            resultEmailDiv.textContent = "Winner e-mail: " + emails[index];
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
    
    document.getElementById('generate100Btn').addEventListener('click', function() {
        // Show the results container
        var resultsDiv = document.getElementById('results100');
        resultsDiv.classList.remove('hidden');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = ''; // Clear previous results
        let winners = new Set();
        let interval;
        let animationIndex = 0;

        // Animation function
        function animateGeneration() {
            if (animationIndex >= usernames.length) {
                animationIndex = 0;
            }
            resultsDiv.innerHTML = `${usernames[animationIndex]} - ${emails[animationIndex]}`;
            animationIndex++;
        }

        // Start the animation
        interval = setInterval(animateGeneration, 100);

        // Stop the animation and generate 100 winners
        setTimeout(function() {
            clearInterval(interval);

            while (winners.size < 100 && winners.size < usernames.length) {
                let randomIndex = Math.floor(Math.random() * usernames.length);
                let winner = `${usernames[randomIndex]} - ${emails[randomIndex]}`;
                winners.add(winner);
            }

            resultsDiv.innerHTML = ''; // Clear the animation text

            winners.forEach(winner => {
                let p = document.createElement('p');
                p.textContent = winner;
                resultsDiv.appendChild(p);
            });

        }, 3000); // Run animation for 3 seconds
    });
}
