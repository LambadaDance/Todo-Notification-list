updateResult()

const time = document.querySelector('.time');
const message = document.querySelector('.message');
const btn = document.querySelector('.submit');

btn.addEventListener('click', function(e){
        if(!time.value || !message.value){
            document.querySelector('.error').textContent = "Укажите время и введите сообщение";
            document.querySelector('.error').style.opacity = 1;
            setTimeout(() => {
                document.querySelector('.error').style.opacity = 0;
            }, 3000);
            setTimeout(() => {
                document.querySelector('.error').textContent = "";
            }, 4500);
        }
        if(time.value && message.value){
            localStorage.setItem(time.value, JSON.stringify([message.value, 'white']) )
            time.value = "";
            message.value = "";
            updateResult();
        }
})

document.querySelector('.delete__all_btn').addEventListener('click', function(){
    let askDelete = confirm("Удалить все запланированные дела?")
    if(askDelete){
        localStorage.clear();
        document.querySelector('.result__items').innerHTML = "";
        updateResult();
    }
})

document.querySelector('.todo').addEventListener('click', function(e){
    let parent = e.target.closest('.result__item')

    for(let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        const array = JSON.parse(localStorage.getItem(key))
        if(e.target.tagName != 'BUTTON') return;
        if(e.target.classList.contains('delete') && parent.dataset.key == key){
            parent.remove();
            localStorage.removeItem(key);
            updateResult();
        }
        if(e.target.classList.contains('yes') && parent.dataset.key == key){
            if(parent.classList.contains('green')){
                parent.className = 'result__item white'
                array[1] = 'white';
                localStorage.setItem(key, JSON.stringify(array));
            }else{ 
                parent.className = 'result__item green'
                array[1] = 'green';
                localStorage.setItem(key, JSON.stringify(array));
            }
        }

        if(e.target.classList.contains('no') && parent.dataset.key == key){
            if(parent.classList.contains('red')){
                parent.className = 'result__item white'
                array[1] = 'white';
                localStorage.setItem(key, JSON.stringify(array));
            }else{
                parent.className = 'result__item red'
                array[1] = 'red';
                localStorage.setItem(key, JSON.stringify(array));
            }
        }
    }
})


function updateResult(){
    let todoList = document.querySelector('.todo');
    if(!localStorage.length) {
        todoList.querySelectorAll('*').forEach((element) => element.hidden = true);
        return;
    }
    todoList.querySelectorAll('*').forEach((element) => element.hidden = false);
        
    const array = [];

    for(let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        const valueFromLocal = JSON.parse(localStorage.getItem(key));
        array.push([localStorage.key(i), valueFromLocal[0], valueFromLocal[1]]);
    }

    array.sort((a, b) => a[0].replace(":", "") - b[0].replace(":", ""))
    document.querySelector('.result__items').innerHTML = "";

    for(let i = 0; i < array.length; i++){
        document.querySelector('.result__items').insertAdjacentHTML('beforeend', `
        <div data-key="${array[i][0]}" class="result__item ${array[i][2]}">
            <div class="result__time">${array[i][0]}</div>
            <div class="result__text">${array[i][1]}</div>
            <div class="result__status">
                <button class="yes">&#9989;</button>
                <button class="no">&#10062;</button>
                <button class="delete">&#128465;</button>
            </div>
        </div>
        `
        )

        let date = new Date();
        let currentHour = String(date.getHours()).padStart(2, '0');
        let currentMinute= String(date.getMinutes()).padStart(2, '0');
        let currentSeconds = String(date.getSeconds()).padStart(2, '0');
        
        let currentMili = currentHour * 3600000 + currentMinute * 60000;
        let notTime = String(array[i][0]).split(":");
        
        let notMili = notTime[0] * 3600000 + notTime[1] * 60000;
        let notTimeout = notMili - currentMili - currentSeconds * 1000;
        
        if(notTimeout < -60000) continue;
        
        if(notTimeout < 0) notTimeout = 0;
        
        setTimeout(() => {
            document.querySelector(`[data-key*="${array[i][0]}"]`).classList.add('notification');
            document.querySelector(`[data-key*="${array[i][0]}"]`).insertAdjacentHTML('beforeend', `
            <audio data-not="${notTime[0]}${notTime[1]}" loop><source src="./source/Notification.mp3" type="audio/mpeg"></audio>
            `);
            document.querySelector('audio').play();

            if(document.querySelector('.notification')){
                setTimeout(() => {
                    document.querySelector('.notification').classList.remove('notification');
                    document.querySelector('audio').remove();
                }, 15000);
            }
        }, notTimeout);
    }
}

document.querySelector('body').addEventListener('click', function(e){
    if(document.querySelector('.notification')){
        document.querySelector('audio').pause();
        document.querySelector('audio').remove();
        document.querySelector('.notification').classList.remove('notification');  
    }
})


