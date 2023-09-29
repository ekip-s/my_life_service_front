const addNewLineBtn = document.querySelector('#add_new_line');
const fieldsetList = document.querySelector('#fieldset_course_list');
let formNum = 1;

addNewLineBtn.addEventListener('click', async e => {
   formNum = formNum + 1;
   const content = document.createElement('div');
   content.id = `${formNum}`

   content.innerHTML = 
   `
   <h4>Урок №${formNum}</h4>
   <label for="lesson_name_${formNum}">Название урока:</label>
   <input id="lesson_name${formNum}"><br>
   `
   fieldsetList.appendChild(content);
});