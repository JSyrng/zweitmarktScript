
(function attemptBooking() {
    // Variablen für die Block-IDs und die Event-ID definieren
    const blockIDs = [
            //Sektor 2
            '215ff18c-6aae-4d9b-99fc-57aeffb7d1ba', // H
            '86367fb6-eaa0-436c-9c22-2d850362f75e', // J
            'fd08aeae-a280-4c98-bab7-f18ba06ff82e', // F
	    'b41c3cf3-a09c-4e43-96ff-d732da632ae9', // G
	    '69a52935-a17c-48b9-bfc0-3e691c46e530', // I
	    'cc255da7-9138-468c-9d09-9a043e7a8eae', // E

            //Sektor 4
            '041e36ad-a8b0-4d92-8dab-5a283eeddb10', // X NEU
            'c933d3e4-1997-40af-af58-c45fc20a0296', // Y NEU
            'ebbd0767-2d5e-439a-8b4f-a8963dc8c0f8', // U NEU
            '05936a37-648c-4de5-ac43-5edaa64dc55f', // V NEU
            '667d8836-3923-4fec-bdbf-f30fb3531e1d', // W NEU
            //Sektor 3
            'ffd8c019-fee1-4449-9b68-ca29b1cab8d7', // M NEU
            'd1162ca1-a220-4f38-996d-437d229a0a26', // N NEU
            '89bf06a2-3614-4693-ab8c-4e7fce451fe7', // O NEU
            '65788e19-7903-4ed9-9935-d8ac7039aad2', // P NEU
            '2bed72b7-2f50-43a9-a5ea-944545d39f72', // Q NEU
	    'f0d64c5f-2911-4fc1-beeb-113ed984a770', // R NEU
            '3a8249ec-5245-440e-a40b-15b984da8eb4', // T NEU
            '292f470e-497c-4fc7-b88e-d0488f37847a', // K NEU
            '7e6c6634-0061-4732-96c1-58d7e596d3b0' // S NEU

        ];

   const eventID = 'ba89e68f-08df-4546-b703-87067bc9e814';
    function getCookies() {
        // Abrufen der notwendigen Cookies
        return document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=').map(c => c.trim());
            acc[key] = value;
            return acc;
        }, {});
    }

    function playSuccessSound() {
        const audio = new Audio('https://cdn.freesound.org/previews/668/668888_7395592-lq.mp3'); // Beispiel-Audio-URL
        audio.play();
        audio.onended = function() {
            // Nach 4 Sekunden die Seite neu laden
            setTimeout(function() {
                location.reload();
            }, 4000);
        };
    }

    function bookTicket(blockID) {
        const bookingUrl = `.../SynwayVenue/BookTicket/Veranstaltungen/${eventID}`;
        
        const headers = {
            'Accept': '*/*',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        };

        const bookingData = {
            BlockID: blockID,
            Count: 1,
            id: eventID,
            SubName: 'Veranstaltungen'
        };

        const postData = Object.keys(bookingData)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(bookingData[key]))
            .join('&');

        $.ajax({
            url: bookingUrl,
            method: 'POST',
            headers: headers,
            data: postData,
            success: function(response) {
                if (response.data !== undefined && response.data.NewShoppingCart !== undefined) {
                    console.log(`Ticket erfolgreich gebucht für BlockID: ${blockID}`);
		     playSuccessSound();
                    clearInterval(bookingInterval);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Fehler beim Buchen des Tickets für BlockID: ${blockID}`, error);
            }
        });
    }

    let currentIndex = 0;
    function attemptNextBooking() {
        if (currentIndex < blockIDs.length) {
            const blockID = blockIDs[currentIndex];
            bookTicket(blockID);
            currentIndex++;
        } else {
            currentIndex = 0;
        }
    }

    const bookingInterval = setInterval(attemptNextBooking, 200);
})();
