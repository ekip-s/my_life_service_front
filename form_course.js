const coursList = document.querySelector('.cource_list');
const courseURL = 'http://localhost:8081/api/v1';

window.addEventListener('load', async () => {
   const url = courseURL + `/course/1`;
   const response = await fetch(url);
   const answer = await response.json();
   if(answer.length != 0) {
      createFormList(answer);
   }

   createLessonForm(answer);
   
   createCourseForm(answer);
});

function createFormList(answerJSON) {
   console.log('createFormList')
}

function createLessonForm(answerJSON) {
   if(answerJSON.length != 0) {
      console.log('createLessonForm')
   }
}

function createCourseForm(answerJSON) {
   if(answerJSON.length == 0) {
      addFakeDiv()
   } else {
      console.log('createCourseForm')
   }
}

function addFakeDiv() {
   let fakeDiv = document.createElement('div');
   fakeDiv.id = 'course_form'
   fakeDiv.className = 'course_node';
   fakeDiv.innerHTML = 
   `
   <div class="course_top_meru">
      <div class="course_meru_left">
         <h3>Название курса:</h3>
         <input id="course_form_id" type="text" placeholder="Введи название курса">
      </div>
   </div>
   <hr>
   <div class="lesson_list">
   </div>
   `; 

   coursList.append(fakeDiv);

   fakeDiv.addEventListener('change', async e => {
      let name = e.target.value;
      if (name.trim()) {
         await addNewCourse(name);
         let courseForm = document.querySelector('#course_form');
         courseForm.remove();      
      } 
   });


}

async function addNewCourse(name) {
   let requestBody = {
      courseName: `${name}`
   };
   await fetch(courseURL + `/course/1`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
          });

   let newDiv = document.createElement('div');
   newDiv.className = 'course_node';
   newDiv.innerHTML = 
   `
   <p class="course_id" hidden>not_id</p>
   <div class="course_top_meru">
      <div class="course_meru_left">
      <h3>Название курса:</h3>
      <input id="course_form" type="text" placeholder="Введи название курса" value="${name}">
      </div>
   </div>
   <hr>
   <div class="lesson_list">
      <div id="lesson_form" class="lesson_node">
         <div class="lesson_menu">
            <div class="lesson_checkbox">
               <input type="checkbox">
            </div>
            <div class="lesson_bottom">
               <div class="lesson_meru_top">
                  <b>Урок № ...</b>
               </div>
               <div class="lesson_meru_left">
                  <h3>Название урока:</h3>
                  <input type="text" placeholder="Введи название урока">
               </div>
            </div>
      </div>
   </div>`;

   

   let fakeDiv = document.querySelector('#course_form');
   fakeDiv.before(newDiv);

   let fakeInput = document.querySelector('.course_node input[type="text"]');
   console.log(fakeInput);

   

   fakeInput.addEventListener('change', async e => {
      console.log('patch maring');
   });

   let fakeLessonDiv = document.querySelector('#lesson_form');

   fakeLessonDiv.addEventListener('change', async e => {
      console.log('обрабочик под форму');
   });
}