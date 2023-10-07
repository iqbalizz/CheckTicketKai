import fetch from "node-fetch";

export const sendMessageNotReady = async () => {
    const botToken = '6595827843:AAGfAW2hamNZ5FUuhKPs__NxN1CGsebB6yE';
    const chatId = '-4037923871';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const formattedMessage = `
Ticket belum tersedia dalam satu jam.
`;

    const payload = {
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'HTML',
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

export const sendMessageReady = async () => {
    const botToken = '6595827843:AAGfAW2hamNZ5FUuhKPs__NxN1CGsebB6yE';
    const chatId = '-4037923871';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const formattedMessage = `
    Ticket sudah tersedia. Silahkan Check Di website <pre>https://ayonaik.kcic.co.id/</pre>
`;

    const payload = {
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'HTML',
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}

export const sendTelegramMessagePeriodically = (dataKosong) => {
    if (dataKosong) {
        sendMessageNotReady();
    } else {
        sendMessageReady();
    }
}