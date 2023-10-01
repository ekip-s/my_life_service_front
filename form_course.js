const coursList = document.querySelector('.cource_list');
const courseURL = 'http://localhost:8081/api/v1';
const myUUID = 'a1d5ca3c-fdb5-49be-b73c-32dca343c6c7';

window.addEventListener('load', async () => {
   const answer = await getAllCourse();
   if(answer.length != 0) {
      createFormList(answer);
   } 

   createLessonForm(answer);
   createCourseForm(answer);
   
});

function createFormList(answerJSON) {
   answerJSON.forEach(course => {
      let newDiv = document.createElement('div');
      newDiv.className = 'course_node';
      newDiv.innerHTML =
      `
      <div class="course_top_meru">
         <div class="course_meru_left">
            <h3>Название курса:</h3>
            <input id="${course.id}" type="text" placeholder="Введи название курса" value="${course.courseName}">
         </div>
      </div>
      <hr>
      <div class="lesson_list">
         
      </div>
      `;
      coursList.append(newDiv);

      if(course.endDate !== null) {
         console.log('есть дата завершения курса')
      }

      if(course.lessonList !== null) {
         console.log('есть лист с уроками')
      }
   })
   









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
   let newCourse = await postCourse(name);

   let newDiv = document.createElement('div');
   newDiv.className = 'course_node';
   newDiv.innerHTML = 
   `
   <div class="course_top_meru">
      <div class="course_meru_left">
      <h3>Название курса:</h3>
      <input id="${newCourse.id}" type="text" placeholder="Введи название курса" value="${name}">
      </div>
   </div>
   <hr>
   <div class="lesson_list">
      <div id="lesson_form" class="lesson_node">
         <div class="lesson_menu">
            <div class="lesson_checkbox">
               <input id="lesson_checkbox" type="checkbox">
            </div>
            <div class="lesson_bottom">
               <div class="lesson_meru_top">
                  <b>Урок № ...</b>
               </div>
               <div class="lesson_meru_left">
                  <h3>Название урока:</h3>
                  <input id="lesson_text_input" type="text" placeholder="Введи название урока">
               </div>
            </div>
      </div>
   </div>`;

   

   let fakeDiv = document.querySelector('#course_form');
   fakeDiv.before(newDiv);

   let fakeInput = document.getElementById(newCourse.id);
   console.log(fakeInput);

   

   fakeInput.addEventListener('change', async e => {
      console.log('patch maping');
   });

   let fakeLessonDiv = document.querySelector('#lesson_form input[type=text]');

   fakeLessonDiv.addEventListener('change', async e => {
      console.log('обрабочик под форму');
   });
}

async function postCourse(name) {
   const requestBody = {
      courseName: `${name}`
   };

   const response = await fetch(courseURL + `/course/` + myUUID, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
          });
   let newCourse = await response.json();     
   return newCourse;
}

async function patchCourse(id, name) {
   const requestBody = {
      courseName: `${name}`
   };

   const response = await fetch(courseURL + `/course/` + myUUID + `/` + id, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
          });
   let newCourse = await response.json();     
   return newCourse;
}

async function getAllCourse() {
   const url = courseURL + `/course/` + myUUID;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}