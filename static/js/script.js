const szer = 600;
var stopwatch;
var formatedTime = null;
var puzzle = {
    width: 0,
    array: [],
    index: 0,
    waifus: [{name: 'momo', records: [[], [], [], []]}, {name: 'ayanokoji', records: [[], [], [], []]}, {name: 'chika', records: [[], [], [], []]}, {name: 'kirisu', records: [[], [], [], []]}, {name: 'koneko', records: [[], [], [], []]}, {name: 'sakayanagi', records: [[], [], [], []]}, {name: 'yoshino', records: [[], [], [], []]}],
    render: function(){                                                         //Funkcja renderująca układankę co każde przesunięcie pól
        if(document.getElementById('tablica') != null){
            document.getElementById('tablica').remove();
        }
        let tab = document.createElement('div');
        tab.setAttribute('id', 'tablica');
        tab.style.borderStyle = 'solid';
        tab.style.borderColor = 'red';
        tab.style.borderWidth = '2px';
        tab.style.width = szer + 'px';
        tab.style.height = szer + 'px';
        width = szer / this['width'];
        for(let y = 0; y < this['width']; y++){
            for(let x = 0; x < this['width']; x++){
                let div = document.createElement('div');
                div.setAttribute('class', 'klocek');
                div.style.position = 'absolute';
                div.style.top = y * width + 'px';
                div.style.left = x * width + 'px';
                div.style.height = width + 'px';
                div.style.width = width + 'px';
                if(this['array'][y + 1][x + 1][1]){
                    let index = this['index'];
                    if(index == 7){
                        index = 0;
                    }
                    div.style.backgroundImage = `url(gfx/waifu/${this['waifus'][index]['name']}.png)`;
                    div.style.backgroundSize = szer + 'px';
                    div.style.backgroundRepeat = 'no-repeat';
                    div.style.backgroundPositionY = -1 * (this['array'][y + 1][x + 1][2] - 1) * width + 'px';
                    div.style.backgroundPositionX = -1 * (this['array'][y + 1][x + 1][3] - 1) * width + 'px';
                }
                let klik = (e)=>{                                               //wydarzenie odpowiedzialne za zmianę zmiennych przy kliknięciu pola
                    if(this['bezpiecznik']){
                        return;
                    }
                    let p1 = e.target.style.top.split('');
                    let p2 = e.target.style.left.split('');
                    p1.pop();
                    p1.pop();
                    p2.pop();
                    p2.pop();
                    let y = '';
                    let x = '';
                    for(let i = 0; i < p1.length; i++){
                        y += p1[i];
                    }
                    for(let i = 0; i < p2.length; i++){
                        x += p2[i];
                    }
                    y = parseInt(y) / width + 1;
                    x = parseInt(x) / width + 1;
                    if(this['array'][y - 1][x][1] != false && this['array'][y + 1][x][1] != false && this['array'][y][x - 1][1] != false && this['array'][y][x + 1][1] != false){
                        return 0;                                                   //instrukcja sprawdzająca, czy kliknięte pole sąsiaduje z pustym polem
                    }
                    let p;
                    let kierunek1;
                    let kierunek2;
                    switch(false){                                                  //zamiana pustego pola i klikniętego pola miejscami
                        case this['array'][y - 1][x][1]:
                            kierunek1 = true;
                            kierunek2 = true;
                            p = this['array'][y - 1][x];
                            this['array'][y - 1][x] = this['array'][y][x];
                            this['array'][y][x] = p;
                            break;
                        case this['array'][y + 1][x][1]:
                            kierunek1 = true;
                            kierunek2 = false;
                            p = this['array'][y + 1][x];
                            this['array'][y + 1][x] = this['array'][y][x];
                            this['array'][y][x] = p;
                            break;
                        case this['array'][y][x - 1][1]:
                            kierunek1 = false;
                            kierunek2 = true;
                            p = this['array'][y][x - 1];
                            this['array'][y][x - 1] = this['array'][y][x];
                            this['array'][y][x] = p;
                            break;
                        case this['array'][y][x + 1][1]:
                            kierunek1 = false;
                            kierunek2 = false;
                            p = this['array'][y][x + 1];
                            this['array'][y][x + 1] = this['array'][y][x];
                            this['array'][y][x] = p;
                            break;
                    }
                    let status = true;
                    for(let i = 1; i <= this['width']; i++){                                //Warunek zwycięstwa
                        for(let k = 1; k <= this['width']; k++){
                            if(this['array'][i][k][2] != i || this['array'][i][k][3] != k){
                                status = false;
                            }
                        }
                    }
                    let iter = 1;
                    let ruszkloca = setInterval(() => {                                     //Animacja poruszenia się pola - zmienia parametry left i top w cssie
                        this['bezpiecznik'] = true;
                        if(iter <= 20){
                            let ctx = e.target;
                            let wektor = width * iter / 20;
                            if(kierunek1){
                                if(kierunek2){
                                    ctx.style.top = width * y - wektor - width + 'px';
                                }else{
                                    ctx.style.top = width * y + wektor - width + 'px';
                                }
                            }else{
                                if(kierunek2){
                                    ctx.style.left = width * x - wektor - width + 'px';
                                }else{
                                    ctx.style.left = width * x + wektor - width + 'px';
                                }
                            }
                            iter++;
                        }else{
                            clearInterval(ruszkloca);
                            this.render();
                            this['bezpiecznik'] = false;
                            if(status){                                     //Jeśli warunek zwycięstwa został zachowany zatrzymuje timer i powiadamia o zwycięstwie
                                clearInterval(stopwatch);
                                let overlay = document.getElementById('overlay');
                                overlay.style.display = 'block';
                                let div = document.createElement('div')
                                div.setAttribute('id', 'win');
                                let info = `
                                    Gratulacje!
                                    Twój czas to ${formatedTime}
                                `;
                                div.innerText = info;
                                let but = document.createElement('button');
                                but.innerText = 'OK';
                                let f1 = ()=>{
                                    for(let i = 0; i < this['waifus'].length; i++){
                                        let minimum = null;
                                        let index = this['index'];
                                        if(index == 7){
                                            index = 0;
                                        }
                                        let name = this['waifus'][index]['name'];
                                        if(this['waifus'][i]['name'] == name){
                                            let akutalny = formatedTime.split(':');
                                            for(let k = 0; k < 10; k++){
                                                if(this['waifus'][i]['records'][this['width'] - 3][k][1] == '00:00:00.000'){
                                                    minimum = k;
                                                    break;
                                                }else{
                                                    let unformated = this['waifus'][i]['records'][this['width'] - 3][k][1].split(':');
                                                    if(parseInt(unformated[0]) > parseInt(akutalny[0])){
                                                        minimum = k;
                                                        break;
                                                    }else if(parseInt(unformated[0]) == parseInt(akutalny[0])){
                                                        if(parseInt(unformated[1]) > parseInt(akutalny[1])){
                                                            minimum = k;
                                                            break;
                                                        }else if(parseInt(unformated[1]) == parseInt(akutalny[1])){
                                                            if(parseFloat(unformated[2]) >= parseFloat(akutalny[2])){
                                                                minimum = k;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            let nick = document.getElementById('nick').value;
                                            if(minimum != null){
                                                let pom = [];
                                                for(let k = 0; k < 10; k++){
                                                    if(k == minimum){
                                                        pom.push([nick, formatedTime]);
                                                    }
                                                    pom.push(this['waifus'][i]['records'][this['width'] - 3][k]);
                                                }
                                                pom.pop();
                                                this['waifus'][i]['records'][this['width'] - 3] = pom;
                                            }
                                            this.saveCookies();
                                            break;
                                        }
                                    }
                                }
                                but.addEventListener('click', () => {
                                    f1();
                                    div.remove();
                                    overlay.style.display = 'none';
                                });
                                let inp = document.createElement('input');
                                inp.setAttribute('maxlength', '24');
                                inp.setAttribute('id', 'nick');
                                div.append(inp);
                                div.append(but);
                                overlay.append(div);
                                p[1] = true;                                //Odsłonięcie pustego pola
                                this.render();
                            }
                        }
                    }, 8)
                }
                div.addEventListener('click', klik);                //Nadanie klockom wydarzenie - jeśli gracz zwyciężył wydarzenie nie będzie działało, bo nie ma pustych pól
                tab.appendChild(div);
            }
        }
        document.body.appendChild(tab);
        
    },
    liveRender: () => {

    },
    divide: function(){                                           //Funkcja dziłająca przy kliknięciu przycisku do dzielenia układanki
        if(this['bezpiecznik']){
            return;
        }
        console.log('wykonuję się')
        clearInterval(stopwatch);
        if(document.getElementById('timer') != null){
            document.getElementById('timer').remove()
        }
        this['bezpiecznik'] = true;
        this['array'] = [];
        for(let y = 0; y < this['width'] + 2; y++){                 //Tworzenie trójwymiarowej tablicy zawierającej informacje o współrzednych i statusie wszystkich pól
            let p = [];
            for(let x = 0; x < this['width'] + 2; x++){
                if(y == 0 || y == this['width'] + 1 || x == 0 || x == this['width'] + 1){
                    p.push([false, true]);
                }else{
                    p.push([true, true, y, x])
                }
            }
            this['array'].push(p);
        }
        this['array'][puzzle['width']][puzzle['width']][1] = false;         //usunięcie pola w lewym dolnym rogu
        let it = 0;
        let kierunkowa = null;
        let losowanie = setInterval(() => {
            if(it < 100){                                                   //Przesunięcie układanki 100 razy w celu dokładnego wymieszania
                let testowa = true;                                         //edit: teraz działa nie w pętli while, ainterwale zwiększając efektywność
                do{
                    let y;
                    let x;
                    while(true){                                                    //Będzie losowało pole tak, żeby nie było cofań - zawsze będzie iść do przodu lub skręcać
                        y = Math.floor(Math.random() * (this['width'])) + 1;        //Da się to bardziej zoptymalizować, ale trzon kodu pisałem kilka tygodni temu (na czas pisania tego komentarza)
                        x = Math.floor(Math.random() * (this['width'])) + 1;        //i już nie pamiętam do końca, jak to wszystko działa
                        if(this['array'][y - 1][x][1] == false && kierunkowa == 2){
                            continue;
                        }else if(this['array'][y + 1][x][1] == false && kierunkowa == 1){
                            continue;
                        }else if(this['array'][y][x - 1][1] == false && kierunkowa == 4){
                            continue;
                        }else if(this['array'][y][x + 1][1] == false && kierunkowa == 3){
                            continue;
                        }
                        break;
                    }
                    switch(false){
                        case this['array'][y - 1][x][1]:
                            kierunkowa = 1;
                            let p1 = this['array'][y - 1][x];
                            this['array'][y - 1][x] = this['array'][y][x];
                            this['array'][y][x] = p1;
                            it++;
                            testowa = false;
                            break;
                        case this['array'][y + 1][x][1]:
                            kierunkowa = 2;
                            let p2 = this['array'][y + 1][x];
                            this['array'][y + 1][x] = this['array'][y][x];
                            this['array'][y][x] = p2;
                            it++;
                            testowa = false;
                            break;
                        case this['array'][y][x - 1][1]:
                            kierunkowa = 3;
                            let p3 = this['array'][y][x - 1];
                            this['array'][y][x - 1] = this['array'][y][x];
                            this['array'][y][x] = p3;
                            it++;
                            testowa = false;
                            break;
                        case this['array'][y][x + 1][1]:
                            kierunkowa = 4;
                            let p4 = this['array'][y][x + 1];
                            this['array'][y][x + 1] = this['array'][y][x];
                            this['array'][y][x] = p4;
                            it++;
                            testowa = false;
                            break;
                    }
                }while(testowa)
                this.render();
            }else{
                clearInterval(losowanie);
                clearInterval(stopwatch);
                this['bezpiecznik'] = false;
                let startTime = new Date();                     //Zmienna przechowująca czas startowy
                if(document.getElementById('timer') != null){
                    document.getElementById('timer').remove();
                }
                let timer = document.createElement('div');      //Tworznie timera w htmlu
                timer.setAttribute('id', 'timer');
                timer.setAttribute('style', 'display: flex; flex-direction: row;');
                for(let x = 1; x <= 12; x++){
                    let imgName;
                    switch(x){
                        case 3:
                            imgName = 'cyferki/colon.gif';
                            break;
                        case 6:
                            imgName = 'cyferki/colon.gif';
                            break;
                        case 9:
                            imgName = 'cyferki/dot.gif';
                            break;
                        default:
                            imgName = 'cyferki/c0.gif';
                            break;
                    }
                    let img = document.createElement('img');
                    img.setAttribute('src', imgName);
                    img.setAttribute('id', 'id' + x);
                    img.setAttribute('class', 'timer');
                    timer.appendChild(img);
                }
                document.body.appendChild(timer);
                stopwatch = setInterval(() => {                         //interwał odpowiedzialny za upływ czasu
                    let newTime = new Date();                           //Dynamiczne tworzenie nowych zmiennych przechowujących aktualny czas
                    let hour = 0;                                       //Zmienne przechowującu upłynięty czas, docelowo zamieniam je na stringi w celu łatwego dostępu do każdej z cyfr
                    let min = 0;
                    let sec = 0;
                    let mili = 0;
                    let diference = newTime - startTime;                //Sprawdzenie ile czasu upłyneło między startem timera, a teraźniejszą datą
                    if(Math.floor(diference / 3600000) > 0){            //Seria instrukcji warunkowych formatujący zmienne przechowujące czas do stringów
                        hour = Math.floor(diference / 3600000);
                        diference %= 3600000;
                        if(hour < 10){
                            hour = '0' + hour.toString();
                        }else{
                            hour = hour.toString();
                        }
                    }else{
                        hour = '00';
                    }
                    if(Math.floor(diference / 60000) > 0){
                        min = Math.floor(diference / 60000);
                        diference %= 60000;
                        if(min < 10){
                            min = '0' + min.toString();
                        }else{
                            min = min.toString();
                        }
                    }else{
                        min = '00';
                    }
                    if(Math.floor(diference / 1000) > 0){
                        sec = Math.floor(diference / 1000);
                        diference %= 1000;
                        if(sec < 10){
                            sec = '0' + sec.toString();
                        }else{
                            sec = sec.toString();
                        }
                    }else{
                        sec = '00';
                    }
                    mili = diference;
                    if(mili < 10){
                        mili = '00' + mili.toString();
                    }else if(mili < 100){
                        mili = '0' + mili.toString();
                    }else{
                        mili = mili.toString();
                    }
                    document.getElementById('id1').setAttribute('src', `gfx/cyferki/c${hour[0]}.gif`);
                    document.getElementById('id2').setAttribute('src', `gfx/cyferki/c${hour[1]}.gif`);
                    document.getElementById('id4').setAttribute('src', `gfx/cyferki/c${min[0]}.gif`);
                    document.getElementById('id5').setAttribute('src', `gfx/cyferki/c${min[1]}.gif`);
                    document.getElementById('id7').setAttribute('src', `gfx/cyferki/c${sec[0]}.gif`);
                    document.getElementById('id8').setAttribute('src', `gfx/cyferki/c${sec[1]}.gif`);
                    document.getElementById('id10').setAttribute('src', `gfx/cyferki/c${mili[0]}.gif`);
                    document.getElementById('id11').setAttribute('src', `gfx/cyferki/c${mili[1]}.gif`);
                    document.getElementById('id12').setAttribute('src', `gfx/cyferki/c${mili[2]}.gif`);
                    formatedTime = hour + ':' + min + ':' + sec + '.' + mili
                }, 1);
                this.render();
            }
        }, 1)
        
    },
    left: function(){                                               //Funkcje left i right odpowiadają za działanie strzałek obok slidera
        if(puzzle['bezpiecznik']){
            return;
        }
        puzzle['bezpiecznik'] = true;
        if(puzzle['index'] == 0){
            document.getElementById('slider').scrollTo(1400, 0);
            puzzle['index'] = 7
        }
        //document.getElementById('slider_container').style.transform = `translate(${puzzle['index'] * -200}px)`;
        let iter = 1;
        let ruch = setInterval(() => {                  //Interwał odpowiedzialny za płynny ruch slidera
            let wektor = 200 * iter / 80;
            document.getElementById('slider').scrollTo(puzzle['index'] * 200 - wektor, 0);      //Poprzednio slider działał w cssie, ale teraz działa w jsie
            if(iter < 80){
                iter++;
            }else{
                clearInterval(ruch);
                puzzle['index']--;
                let index = puzzle['index'];
                
                let title;
                switch(puzzle['waifus'][index]['name']){
                    case 'ayanokoji':
                        title = 'Kiyotaka Ayanokoji';
                        break;
                    case 'chika':
                        title = 'Chika Fujiwara';
                        break;
                    case 'kirisu':
                        title = 'Mafuyu Kirisu';
                        break;
                    case 'koneko':
                        title = 'Koneko Toujou';
                        break;
                    case 'momo':
                        title = 'Momo Belia Deviluke';
                        break;
                    case 'sakayanagi':
                        title = 'Arisu Sakayanagi';
                        break;
                    case 'yoshino':
                        title = 'Yoshino';
                        break;
                    default:
                        title = 'sprawdź jeszcze raz'
                        break;
                }
                document.getElementById('tytul').textContent = title;
                puzzle['bezpiecznik'] = false;
            }
        }, 5)
    },
    bezpiecznik: false,
    right: function(){
        if(puzzle['bezpiecznik']){
            return;
        }
        puzzle['bezpiecznik'] = true;
        if(puzzle['index'] == 7){
            document.getElementById('slider').scrollTo(0, 0);
            puzzle['index'] = 0
        }
        //document.getElementById('slider_container').style.transform = `translate(${puzzle['index'] * -200}px)`;
        let iter = 1;
        let ruch = setInterval(() => {
            let wektor = 200 * iter / 80;
            document.getElementById('slider').scrollTo(puzzle['index'] * 200 + wektor, 0);
            if(iter < 80){
                iter++;
            }else{
                clearInterval(ruch);
                puzzle['index']++;
                let index = puzzle['index'];
                if(index == 7){
                    index = 0;
                }
                let title;
                switch(puzzle['waifus'][index]['name']){
                    case 'ayanokoji':
                        title = 'Kiyotaka Ayanokoji';
                        break;
                    case 'chika':
                        title = 'Chika Fujiwara';
                        break;
                    case 'kirisu':
                        title = 'Mafuyu Kirisu';
                        break;
                    case 'koneko':
                        title = 'Koneko Toujou';
                        break;
                    case 'momo':
                        title = 'Momo Belia Deviluke';
                        break;
                    case 'sakayanagi':
                        title = 'Arisu Sakayanagi';
                        break;
                    case 'yoshino':
                        title = 'Yoshino';
                        break;
                    default:
                        title = 'sprawdź jeszcze raz'
                        break;
                }
                document.getElementById('tytul').textContent = title;
                puzzle['bezpiecznik'] = false;
            }
        }, 5)
    },
    loadCookies: function(){                                                //Dwie funkcje do ładowania i zapisywania dancyh w ciasteczkach
        let obrazki = document.cookie.split(';');
        for(let i = 0; i < 7; i++){
            let tab1 = obrazki[i].split('=');
            let tryby = tab1[1].split('|');
            for(let k = 0; k < 4; k++){
                let rekordy = tryby[k].split(',');
                for(let l = 0; l < 10; l++){
                    let pom = rekordy[l].split('/');
                    this['waifus'][i]['records'][k].push([decodeURIComponent(pom[0]), pom[1]])
                }
            }
        }
    },
    saveCookies: function(){
        for(let i = 0; i < this['waifus'].length; i++){
            ctx = this['waifus'][i];
            let ciasteczko = ctx['name'] + '=';
            let d = new Date();
            d.setTime(d.getTime()+1000*60*60*24*365*5);
            for(let k = 0; k < 4; k++){
                for(let l = 0; l < 10; l++){
                    ciasteczko += encodeURIComponent(ctx['records'][k][l][0]) + '/' + ctx['records'][k][l][1];
                    if(l < 9){
                        ciasteczko += ',';
                    }
                }
                if(k < 3){
                    ciasteczko += '|'
                }
            }
            ciasteczko += ';expires=' + d.toUTCString() + ';SameSite=Strict';
            document.cookie = ciasteczko;
        }
    },
    leaderboard: function(){                                    //Dwie funkcje do pokazywania tablicy wyników
        let title;
        let index = puzzle['index'];
        if(index == 7){
            index = 0;
        }
        switch(puzzle['waifus'][index]['name']){
            case 'ayanokoji':
                title = 'Kiyotaka Ayanokoji';
                break;
            case 'chika':
                title = 'Chika Fujiwara';
                break;
            case 'kirisu':
                title = 'Mafuyu Kirisu';
                break;
            case 'koneko':
                title = 'Koneko Toujou';
                break;
            case 'momo':
                title = 'Momo Belia Deviluke';
                break;
            case 'sakayanagi':
                title = 'Arisu Sakayanagi';
                break;
            case 'yoshino':
                title = 'Yoshino';
                break;
            default:
                title = 'sprawdź jeszcze raz'
                break;
        }
        let overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
        overlay.style.cursor = 'pointer';
        let div = document.createElement('div')
        div.setAttribute('id', 'leaderboard');
        let span = document.createElement('span');
        span.innerText = title;
        let butcon = document.createElement('div');
        butcon.setAttribute('id', 'buttons2');
        let f1 = () => {
            overlay.style.cursor = 'default';
            overlay.style.display = 'none';
            overlay.removeEventListener('click', f1);
            div.remove();
        }
        overlay.addEventListener('click', f1);
        for(let i = 3; i < 7; i++){
            let but = document.createElement('button');
            but.innerText = i + 'x' + i;
            but.addEventListener('click', ()=>{
                puzzle.setting = i - 3;
                puzzle.showrecords();
            });
            butcon.appendChild(but);
        }
        div.appendChild(span);
        div.appendChild(butcon);
        document.body.appendChild(div);
    },
    setting: 0,
    showrecords: function(){
        if(document.getElementById('records') != null){
            document.getElementById('records').remove();
        }
        let div = document.createElement('div');
        div.setAttribute('id', 'records');
        let index = puzzle['index'];
        if(index == 7){
            index = 0;
        }
        let ctx = puzzle['waifus'][index]['records'][puzzle['setting']];
        for(let i = 0; i < 10; i++){
            let p = document.createElement('p');
            p.innerText = (i + 1) + '. ' + ctx[i][0] + ' - ' + ctx[i][1];
            div.appendChild(p)
        }
        document.getElementById('leaderboard').appendChild(div);
    }
}
if(document.cookie == ''){          //Jeśli nie wykryje żadnych ciasteczek, utworzy nowe z danymmi zapychaczami
    let d = new Date();
    d.setTime(d.getTime()+1000*60*60*24*365*5);
    document.cookie = 'momo=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'ayanokoji=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'chika=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'kirisu=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'koneko=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'sakayanagi=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
    document.cookie = 'yoshino=/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000|/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000,/00:00:00.000;SameSite=Strict;expires=' + d.toUTCString();
}
puzzle.loadCookies();
document.getElementById('slider').scrollTo(0, 0);
document.getElementById('leaderbut').addEventListener('click', puzzle.leaderboard);
for(let x = 3; x < 7; x++){
    let buttons = document.getElementById('buttons');
    let but = document.createElement('button');
    but.innerText = x + ' x ' + x;
    but.addEventListener('click', () => {
        if(puzzle['bezpiecznik']){
            return;
        }
        puzzle['width'] = x;
        puzzle.divide();
    });
    document.getElementById('lewo').addEventListener('click', puzzle.left);
    document.getElementById('prawo').addEventListener('click', puzzle.right);
    buttons.appendChild(but);
}