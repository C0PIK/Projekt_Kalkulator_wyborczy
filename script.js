const formularz = document.getElementById('formularz');
const nazwaKomitetu = document.getElementById('nazwaKomitetu');
const czyKoalicja = document.getElementById('czyKoalicja');
const liczbaGlosow = document.getElementById('liczbaGlosow');
const przyciskDodaj = document.getElementById('dodajKomitet');
const przyciskWynik = document.getElementById('pokazWyniki');
const tabelaKomitetow = document.getElementById('listaKomitetow').getElementsByTagName('tbody')[0];
const tabelaWynikow = document.getElementById('tabelaWynikow').getElementsByTagName('tbody')[0];
const bladNazwa = document.getElementById('bladNazwa');
const bladGlosy = document.getElementById('bladGlosy');

let komitety = [];

przyciskDodaj.addEventListener('click', function() {
    if (sprawdzFormularz()) {
        dodajKomitet();
        wyczyscFormularz();
        pokazKomitety();
    }
});

przyciskWynik.addEventListener('click', function() {
    if (komitety.length === 0) {
            alert('Najpierw dodaj komitet!');
            return;
        } 
        obliczWyniki();
        pokazWyniki(); });

function sprawdzFormularz() {
    let poprawny = true;
    bladNazwa.textContent = '';
    bladGlosy.textContent = '';

    if (!nazwaKomitetu.value.trim()) {
        bladNazwa.textContent = 'Wpisz nazwę komitetu';
        poprawny = false;
    }

    const glosy = Number(liczbaGlosow.value);
    if (glosy <= 0) {
        bladGlosy.textContent = 'Podaj liczbę głosów większą niż 0';
        poprawny = false;
    }


    return poprawny; }

function dodajKomitet() {
    const komitet = {
        nazwa: nazwaKomitetu.value.trim(),
        koalicja: czyKoalicja.checked,
        glosy: Number(liczbaGlosow.value),
        prog: czyKoalicja.checked ? 8 : 5,
        procent: 0, przeszedl: false,
        finalnyProcent: 0 };
        komitety.push(komitet);
    }

function wyczyscFormularz() {
    nazwaKomitetu.value = '';
    czyKoalicja.checked = false;
    liczbaGlosow.value = ''; 
}

function pokazKomitety() {
    tabelaKomitetow.innerHTML = '';
    let lp = 1;

    for (const komitet of komitety) {
        const wiersz = tabelaKomitetow.insertRow();
        wiersz.innerHTML = `
            <td>${lp}</td>
            <td>${komitet.nazwa}</td>
            <td>${komitet.koalicja ? 'Tak' : 'Nie'}</td>
            <td>${komitet.glosy}</td>
        `;
        lp++;
    }
    
}

function obliczWyniki() {
    let suma = 0;
    for (const komitet of komitety) {
        suma += komitet.glosy;
    }

    let wazneGlosy = 0;
    for (const komitet of komitety) {
        komitet.procent = (komitet.glosy / suma) * 100;
        komitet.przeszedl = komitet.procent >= komitet.prog;
        if (komitet.przeszedl) {
            wazneGlosy += komitet.glosy;
        } 
    }

    for (const komitet of komitety) {
        if (komitet.przeszedl) {
            komitet.finalnyProcent = (komitet.glosy / wazneGlosy) * 100;
        }
    }
}

function pokazWyniki() {
    tabelaWynikow.innerHTML = '';
    let lp = 1;

    for (const komitet of komitety) {
        const kolor = komitet.przeszedl ? 'green' : 'red';
        const opis = komitet.przeszedl ? 'Przekroczono próg' : 'Poniżej progu';
    
        const wiersz = tabelaWynikow.insertRow();
        wiersz.innerHTML = `
            <td>${lp}</td>
            <td>${komitet.nazwa}</td>
            <td>${komitet.prog}%</td>
            <td>${komitet.glosy}</td>
            <td style="color: ${kolor};">
                ${komitet.procent.toFixed(2)}% (${opis})
            </td>
        `;
        lp++;
    }
    
}