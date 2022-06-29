import axios from 'axios';
export function sendSongForVerification(songObject) {
      axios({
        method: 'post',
        url: 'https://localhost:44306/main/verify',
        data: JSON.stringify(songObject),
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

