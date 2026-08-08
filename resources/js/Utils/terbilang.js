export function terbilang(n) {
    const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    const num = parseInt(n, 10);
    if (isNaN(num) || num <= 0) return "";
    if (num < 12) return angka[num];
    if (num < 20) return terbilang(num - 10) + " Belas";
    if (num < 100) return (terbilang(Math.floor(num / 10)) + " Puluh " + terbilang(num % 10)).trim();
    if (num < 200) return ("Seratus " + terbilang(num - 100)).trim();
    if (num < 1000) return (terbilang(Math.floor(num / 100)) + " Ratus " + terbilang(num % 100)).trim();
    return num.toString();
}
