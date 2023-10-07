import axios from "axios";
import readlineSync from "readline-sync";
import moment from "moment";
import chalk from "chalk";
import { Banner } from "./src/banner.js";
import { sendMessageNotReady, sendMessageReady, sendTelegramMessagePeriodically } from "./src/botTele.js";

const getJurusanKereta = async () => {
    try {
        const linkUrl = `https://ayonaik.kcic.co.id/assets/index-f01c6d81.js`;
        const getData = await axios.get(linkUrl)
        return getData.data;
    } catch (error) {
        console.error(error)
    }
}

const getCheckReady = async (jurusan, startDate, endDate) => {
    try {
        const linkUrl = `https://apicomtest.kcic.co.id/public/routes?filter[route]=${jurusan}&filter[date][$gte]=${startDate}&filter[date][$lte]=${endDate}`;

        const getData = await axios.get(linkUrl);
        return getData.data;
    } catch (error) {
        console.error(error);
    }
}

//!FUNCTION GETBETWEEN
function getBetween(string, start, end) {
    string = " " + string;
    let ini = string.indexOf(start);
    if (ini === -1) return "";
    ini += start.length;
    let len = string.indexOf(end, ini) - ini;
    return string.substr(ini, len);
};


(async () => {
    console.log(Banner().banner1);
    const resultJurusanKereta = await getJurusanKereta();

    const regex = /{code:"([^"]+)",name:"([^"]+)"}/g;
    let match;
    const codes = [];
    const names = [];

    while ((match = regex.exec(resultJurusanKereta)) !== null) {
        const code = match[1];
        const name = match[2];
        codes.push(code);
        names.push(name);
    }

    console.log(`[!] ${chalk.yellow(`Daftar Jurusan Kereta:`)}`);
    for (let i = 0; i < names.length; i++) {
        const nameJurusan = names[i];
        console.log(`[${i + 1}] ${nameJurusan}`);
    }

    console.log();

    let jurusan;
    while (!jurusan) {
        const chooseService = parseInt(readlineSync.question('[?] Masukkan nomor pilihan jurusan: '));

        if (chooseService >= 1 && chooseService <= codes.length) {
            jurusan = codes[chooseService - 1];
            console.log(`[!] Memilih Service ${jurusan}!`);
            console.log();
        } else {
            console.log(`[!] Tidak ada pilihan yang valid. Silakan pilih nomor yang sesuai.`);
        }
    }
    //!SETTING TANGGAL IN HERE!
    // Mendapatkan tanggal dan waktu saat ini dalam format UTC
    const now = new Date();

    // Mendapatkan tahun, bulan, dan tanggal saat ini
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // Ditambah 1 karena bulan dimulai dari 0
    const day = now.getUTCDate().toString().padStart(2, '0');

    // Mendapatkan tanggal 3 hari ke depan
    const futureDates = [];
    for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(now);
        futureDate.setUTCDate(now.getUTCDate() + i);
        const futureYear = futureDate.getUTCFullYear();
        const futureMonth = (futureDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const futureDay = futureDate.getUTCDate().toString().padStart(2, '0');
        futureDates.push(`${futureYear}-${futureMonth}-${futureDay}`);
    }

    //!Fungsi untuk mengirim pesan setiap 1 jam
    const sendTelegramMessagePeriodically = () => {
        if (dataKosong) {
            sendMessageNotReady();
        } else {
            sendMessageReady();
        }
    };

    setInterval(sendTelegramMessagePeriodically, 12000);

    // Loop untuk memeriksa data yang sesuai
    let dataKosong = true;
    while (dataKosong) {
        for (let i = 0; i < futureDates.length; i++) {
            const startDate = i === 0 ? `${year}-${month}-${day}T00:00:00.000Z` : `${futureDates[i - 1]}T00:00:00.000Z`;
            const endDate = `${futureDates[i]}T23:59:59.999Z`;

            const result = await getCheckReady(jurusan, startDate, endDate);
            console.log(`[ ${chalk.green(moment().format('HH:mm:ss'))} ] ${chalk.yellow(`PROCCESS CHECKING TICKET!`)}`)
            // console.log(`===================================`)
            console.log(`[ ${chalk.green(moment().format('HH:mm:ss'))} ] Check Ticket Tanngal ${futureDates[i]}`)
            console.log(`[ ${chalk.green(moment().format('HH:mm:ss'))} ] Ticketnya belum tersedia!`);
            console.log(`===================================`)
            // console.log(`Data untuk periode ${startDate} hingga ${endDate}:`);
            // console.log(result);

            // Cek apakah data tidak kosong dan available_quota bukan 0
            if (result.data.length > 0 && result.data[0].available_quota !== 0) {
                console.log(`[ ${chalk.green(moment().format('HH:mm:ss'))} ] Check Ticket Tanngal ${futureDates[i]}`)
                console.log(`[ ${chalk.green(moment().format(`HH:mm:ss`))} ] Ticket Tersedia`)
                dataKosong = false;
                break;
            }
        }
        console.log()
        // Jeda sebelum iterasi berikutnya (untuk menghindari overloading API)
        await new Promise(resolve => setTimeout(resolve, 6000)); // Menunggu 60 detik (1 menit) sebelum mencoba lagi
    }
    console.log("Data ditemukan! Looping selesai.");
})();