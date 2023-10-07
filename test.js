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

// Membangun string parameter filter
const filterParams = `filter[date][$gte]=${year}-${month}-${day}T00:00:00.000Z&filter[date][$lte]=${futureDates[2]}T23:59:59.999Z`;

console.log(`Hari ini adalah ${day}-${month}-${year}`);
console.log('Tanggal 3 hari ke depan:', futureDates);

const startDate = `${year}-${month}-${day}`
const firstTanggal = futureDates[0];
const secondTanggal = futureDates[1];
const thirdTanggal = futureDates[2]

console.log(startDate)
console.log(firstTanggal)
console.log(secondTanggal)
console.log(thirdTanggal)

// let resultTanggal;

// for (let i = 0; i < futureDates.length; i++) {
//     resultTanggal = futureDates[i];
// }
// console.log(resultTanggal)
// console.log('Parameter filter:', filterParams);