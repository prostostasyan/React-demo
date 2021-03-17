const keyId = "b8af74b0a4e83b8c71f1deb2c4a36ca9";
let arrSearch;
const urlSearch = `https://api.themoviedb.org/3/search/multi?api_key=${keyId}&language=ru&query=`;
const search = document.getElementById('search');
let main = document.querySelector('.main');
const recommendation = document.querySelector("#recommendation");

let delay = (ms) => new Promise((res) => setTimeout(() => res(), ms));

let films = (obj) => {
    recommendation.innerHTML = '';
    let count = 0;
    arrSearch = obj.results;
    console.log(obj);
    if (arrSearch.length != 0)
        for (let value of obj.results) {
            let imageSrc = null;
            if (value.poster_path !== null && (value.poster_path !== undefined)) {
                imageSrc = 'https://image.tmdb.org/t/p/original' + value.poster_path;
            } else {
                imageSrc = 'img/no_poster.jpg';
            }

            let newDiv = document.createElement("div");
            newDiv.classList.add('blockMovie');


            let br = document.createElement("br");

            let newTitle = document.createElement("span");
            newTitle.classList.add('titleMovie');
            if (value.title != null) {
                newTitle.innerText = value.title;
            } else if (value.name != null) {
                newTitle.innerText = value.name;
            } else {
                newTitle.innerText = value.original_name;
            }


            let newImg = document.createElement("img");
            newImg.setAttribute('src', imageSrc);
            newImg.setAttribute('alt', value.title);
            newImg.classList.add('poster');

            let moreDetails = document.createElement('div');
            let ref = document.createElement('a');
            ref.classList.add('moreDetails');
            ref.setAttribute('data-id', count++);
            ref.setAttribute('data-type', value.media_type);
            ref.setAttribute('data-globalID', value.id);
            ref.setAttribute('data-movie', value.video);


            ref.innerHTML = 'Подробнее';
            moreDetails.append(ref);

            let popup = document.createElement("div");
            popup.classList.add('popup');
            newDiv.append(newImg);
            newDiv.append(br);
            newDiv.append(newTitle);
            newDiv.append(moreDetails);
            newDiv.append(popup);
            main.append(newDiv);
        }
    else {
        main.innerHTML = `<div class="nothingFind"> Извините!<br> Такого здесь нет!</div>`
    }
}

let sent = (event) => {
    event.preventDefault();

    let textInput = document.getElementById('searchInput').value;
    if (textInput.length != 0) {
        main.innerHTML = '';
        request(urlSearch + textInput);
    }
}

let request = (url) => {
    // delay(1000)
    //     .then(() => fetch(url))
    fetch(url)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(value);
            }
            return response.json();
        })
        .then(data => films(data))
}

if (arrSearch == null) {
    document.addEventListener('DOMContentLoaded', () => {

        fetch('https://api.themoviedb.org/3/trending/all/week?api_key=b8af74b0a4e83b8c71f1deb2c4a36ca9&language=ru')
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(value);
                }
                return response.json();
            })
            .then(data => films(data))
            .then(() => recommendation.innerHTML = `Рекомендуем к просмотру`)
    })
}


search.addEventListener('submit', sent);


document.getElementById('title').onclick = function () {
    document.forms.search.reset(); // сбрасываем форму
    location.reload(); // перезагружаем страницу
}


main.onclick = (event) => {
    if (event.target.className == 'moreDetails') {
        let imageSrc;
        let numCell = event.target.getAttribute('data-id');
        let idMovie = event.target.getAttribute('data-globalid');
        let type = event.target.getAttribute('data-type');
        if(arrSearch[numCell].poster_path != null){
            imageSrc = 'https://image.tmdb.org/t/p/original' + arrSearch[numCell].poster_path;
        }else {
            imageSrc = 'img/no_poster.jpg';
        }


        let popup = event.target.parentElement.parentElement.querySelector('.popup');

        popup.style.display = 'block';
        document.getElementById("overlay").style.display = "block";
        popup.innerHTML = '';


        let butPopup = document.createElement("button");
        let textPopup = document.createElement("div");


        let video = document.createElement('div');
        video.classList.add('video');
        fetch(`https://api.themoviedb.org/3/${type}/${idMovie}/videos?api_key=${keyId}&language=ru`)
            .then(response => response.json())
            .then(data => {
                if ( data.results.length != 0){
                    // console.log(data);
                    return `https://www.${data.results[0].site}.com/embed/${data.results[0].key}`
                }else {
                    return 'img/noVideo.jpg'}
            })
            .then(videoSite => video.innerHTML = `<iframe src=${videoSite} frameborder="0" allowfullscreen>`)

        let infoMovie = document.createElement("div");
        infoMovie.classList.add('infoMovie')
        let release_date = arrSearch[numCell].release_date;
        if (release_date == undefined) {
            release_date = "Нам пока неизвестна"
        }
        const vote_average = arrSearch[numCell].vote_average;
        infoMovie.innerHTML = `<div> Дата релиза: ${release_date} </div> <div>Оценка пользователей: ${vote_average}</div>`

        textPopup.classList.add('textPopup');
        butPopup.innerHTML = 'X';
        butPopup.classList.add('btn');

        let newImg = document.createElement("img");
        newImg.setAttribute('src', imageSrc);
        newImg.setAttribute('alt', arrSearch[numCell].title);

        newImg.classList.add('mini-poster');

        if (arrSearch[numCell].overview !== '') {
            textPopup.innerHTML = `<div class = 'descript'>${arrSearch[numCell].overview}</div>`;
        } else {
            textPopup.innerHTML = `<div class = 'descript'>Описание не найдено</div>`;
        }

        popup.append(newImg);
        popup.append(butPopup);
        popup.append(video);
        textPopup.prepend(infoMovie);
        popup.append(textPopup);
    }
    if (event.target.className === 'btn') {
        let popup = event.target.parentElement;
        popup.innerHTML = ""
        popup.style.display = 'none';
        document.getElementById("overlay").style.display = "none";
    }
}
















