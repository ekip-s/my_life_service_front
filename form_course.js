const coursList = document.querySelector('.cource_list');
const courseURL = 'http://localhost:8081/api/v1';
const myUUID = 'a1d5ca3c-fdb5-49be-b73c-32dca343c6c7';

window.addEventListener('load', async () => {
   const answer = await getAllCourse();
   if(answer.length != 0) {
      //createFormList(answer);
   } else {
      addFakeDiv() //нужно создать пустую форму с обработчиком; 
   }
});

function createCourseForm(answerJSON) {
   let fakeDiv = createFakeDiv();
   coursList.append(fakeDiv);

}


function addFakeDiv() {
   let fakeDiv = createFakeDiv();
   coursList.append(fakeDiv);
   addFakeDivEventListener(fakeDiv)
}

function addFakeDivEventListener(fakeDiv) {
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
   let newDiv = createNewCourse(newCourse.id, newCourse.courseName);

   let fakeDiv = document.querySelector('#course_form');
   fakeDiv.before(newDiv);

   coursePatchEventListener(newCourse.id)

   console.log(newDiv.querySelector('#lesson_form'));

   
/*
   let fakeLessonDiv = document.querySelector('#lesson_form input[type=text]');

   fakeLessonDiv.addEventListener('change', async e => {
      console.log('обрабочик под форму');
      let lesson = await addNewLesson(e.target.value, e.target.closest('.course_node').querySelector('.course_meru_left input').id);
      console.log(lesson);

   });
   */
}

function coursePatchEventListener(id) {
   let fakeInput = document.getElementById(id);
   fakeInput.addEventListener('change', async e => {
      let name = e.target.value;
      if (name.trim()) {
         patchCourse(id, name);
         fakeInput.value = name;
      }      
   });
}


function createNewCourse(id, name) {
   let newDiv = document.createElement('div');
   newDiv.className = 'course_node';
   newDiv.innerHTML = 
   `
   <div class="course_top_meru">
      <div class="course_meru_left">
      <h3>Название курса:</h3>
      <input id="${id}" type="text" placeholder="Введи название курса" value="${name}">
      </div>
   </div>
   <hr>
   <div class="lesson_list">
      
   </div>`;
   return newDiv;
}



/*
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
*/













function createFormList(answerJSON) {
   answerJSON.forEach(course => {
      let newDiv = createCourseNode(course.id, course.courseName);
      
      coursList.append(newDiv);

      if(course.endDate !== null) {
         console.log('есть дата завершения курса')
      }

      if(course['id'] === answerJSON[(answerJSON.length - 1)]['id']) {
         console.log(document.getElementById(course['id']).closest('.course_node').querySelector('.lesson_list'));

         let fakeDivLesson = createFakeLesson();

         document.getElementById(course['id']).closest('.course_node').querySelector('.lesson_list').append(fakeDivLesson);

         console.log('нужно добавить обработчик для fakeDivLesson');

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



function createFakeDiv() {
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
   return fakeDiv;
}

function addNewLessonForm(lesson) {
   let lessonForm = document.querySelector('.lesson_form');

}

async function addNewLesson(name, courseId) {
   const requestBody = {
      lessonName: `${name}`
   };

   const response = await fetch(courseURL + '/' + myUUID + `/lesson/` + courseId, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          body: JSON.stringify(requestBody)
          });
   let newLesson = await response.json();     
   return newLesson; 
}

async function postCourse(name) {
   const requestBody = {
      courseName: `${name}`
   };

   const response = await fetch(courseURL + '/' + myUUID + `/course`, {
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

   const response = await fetch(courseURL + '/' + myUUID + `/course/` + id, {
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
   const url = courseURL + '/' + myUUID + `/course`;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}

function createFakeLesson() {
   let fakeDivLesson = document.createElement('div');
   fakeDivLesson.id = 'lesson_form'
   fakeDivLesson.className = 'lesson_node';
   fakeDivLesson.innerHTML =
         `
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
         `;

   return fakeDivLesson;
}

function createCourseNode(id, courseName) {
   let newDiv = document.createElement('div');
   newDiv.className = 'course_node';
   newDiv.innerHTML =
      `
      <div class="course_top_meru">
         <div class="course_meru_left">
            <h3>Название курса:</h3>
            <input id="${id}" type="text" placeholder="Введи название курса" value="${courseName}">
         </div>
      </div>
      <hr>
      <div class="lesson_list">
         
      </div>
      `;

   return newDiv;
}

function addNewLessonPatchEventListener() {

}