async function registerPasskey() {
    try {
        const response = await fetch('/register-challenge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const options = await response.json();

        // Convert from base64 to Uint8Array for WebAuthn
        options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
        options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));

        const credential = await navigator.credentials.create({
            publicKey: options,
        });

        const credentialJSON = {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            type: credential.type,
            response: {
                attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
                clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
            },
        };

        const verifyResponse = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentialJSON),
        });

        const verificationResult = await verifyResponse.text();
        document.getElementById('registration-status').textContent = verificationResult;

        if (verifyResponse.ok) {
            // Display the passkey
            document.getElementById('passkey-display').textContent = credential.id;
        }

    } catch (error) {
        console.error('Error during passkey registration:', error);
        document.getElementById('registration-status').textContent = 'Registration failed!';
    }
}

document.getElementById('register-passkey').addEventListener('click', registerPasskey);
