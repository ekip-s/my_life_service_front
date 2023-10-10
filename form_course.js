const coursList = document.querySelector('.cource_list');
const courseURL = 'http://localhost:8081/api/v1';
const myUUID = 'a1d5ca3c-fdb5-49be-b73c-32dca343c6c7';

window.addEventListener('load', async () => {
   const answer = await getAllCourse();
   if(answer.length != 0) {
      createFormList(answer);
   } 

   createFakeCourseForm(answer);

   createFakeLessonForm(answer);
});

async function createFakeLessonForm(answer) {
   if(answer.length != 0) {
      const lessonList = document.getElementById((answer[answer.length - 1].id)).closest('.course_node').querySelector('.lesson_list')

      const nowDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

      const newLesson = createNewLessonForm('lesson_fake_form', '...', nowDate, '');

      lessonList.append(newLesson);
      /*   addNewLessonPatchEventListener(lesson.id);
         addDoneEventListener(lesson.id);
         console.log('добавление done обработчика')*/
   } 
}

async function createFakeCourseForm(answer) {

   if(answer.length == 0 || (answer.length != 0 && 
      (await getAllLessons(answer[answer.length - 1].id)).length > 0)) {
      const courseForm = createCourseNode('course_fake_form', '');
      coursList.append(courseForm);
      coursePostEventListener('course_fake_form');
   }

}

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

function coursePostEventListener(id) {
   let fakeInput = document.getElementById(id);
   fakeInput.addEventListener('change', async e => {
      let name = e.target.value;
      if (name.trim()) {
         const course = await postCourse(name);
         let newDiv = createNewCourse(course.id, course.courseName);
         const fakeInputForm = fakeInput.closest('.course_node');
         fakeInputForm.before(newDiv);
         coursePatchEventListener(course.id);
         fakeInputForm.remove();         
      }
   })
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

function createFormList(answerJSON) {

   answerJSON.forEach(async course => {
      let newDiv = createCourseNode(course.id, course.courseName);
      
      coursList.append(newDiv);

      if(course.endDate !== null) {
         console.log('есть дата завершения курса')
      }

      coursePatchEventListener(course.id);

      await addCourseLessonsList(course.id);
   })
   
}

async function addCourseLessonsList(courseId) {
   const lessonsList = await getAllLessons(courseId);
   if(lessonsList.length != 0) {
      const lessonListform = document.getElementById(courseId).closest('.course_node').querySelector('.lesson_list');
   
      lessonsList.forEach(async lesson => {
         const newLesson = createNewLessonForm(lesson.id, lesson.lessonNum, lesson.planedStartDate, lesson.lessonName);
         lessonListform.append(newLesson);
         addNewLessonPatchEventListener(lesson.id);
         addDoneEventListener(lesson.id);
         console.log('добавление done обработчика')
      })
   }
}

function addDoneEventListener(lessonId) {
   const lessonCheckbox = document.getElementById(lessonId);

   lessonCheckbox.addEventListener('change', async e => {
      const lessonNode = lessonCheckbox.closest('.lesson_node');
      await doneCourse(lessonId);
      lessonNode.remove();
   }) 

}

function addNewLessonPatchEventListener(lessonId) {
   const lessonInput = document.getElementById(lessonId + '-text-input');

   lessonInput.addEventListener('change', async e => {
      let name = e.target.value;

      if (name.trim()) {
         await patchLesson(lessonId, name);
         lessonInput.value = name;
      }
   })
}

async function patchLesson(lessonId, name) {
   const response = await fetch(courseURL + '/lesson/setName/' + lessonId + `/name/` + name, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          });
   return await response.json(); 
}

function createNewLessonForm(lessonId, lessonNum, lessonDate, lessonName) {
   let newDiv = document.createElement('div');
   newDiv.className = 'lesson_node';
   newDiv.innerHTML =
   `
   <div class="lesson_menu">
      <div class="lesson_checkbox">
         <input id="${lessonId}" type="checkbox">
      </div>
      <div class="lesson_bottom">
         <div class="lesson_meru_top">
            <b>Урок № ${lessonNum}</b>
            <div class="lesson_meru_rigth">
               <p>Дата:</p>
               <p>${createNormDate(lessonDate)}</p>
            </div>
         </div>
         <div class="lesson_meru_left">
            <h3>Название урока:</h3>
            <input id="${lessonId + '-text-input'}" type="text" placeholder="Введи название урока" value="${lessonName}">
         </div>
      </div>
   </div>
   `;
   return newDiv;
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

async function addNewLesson(name, courseId) {

   const response = await fetch(courseURL + '/lesson/person/' + myUUID + `/course/` + courseId + '/name/' + name, {
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

   const response = await fetch(courseURL + '/course/' + myUUID + `/name/` + name, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json();     
}

async function patchCourse(id, name) {

   const response = await fetch(courseURL + '/course/' + id + '/name/' + name, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json(); 
}

async function doneCourse(lessonId) {

   const response = await fetch(courseURL + '/lesson/done/' + lessonId, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json(); 
}

async function getAllCourse() {
   const url = courseURL + '/course/list/' + myUUID;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}

async function getAllLessons(courseId) {
   const url = courseURL + '/lesson/list/' + courseId;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}

async function addNewCourse(name) {
   let newCourse = await postCourse(name);
   let newDiv = createNewCourse(newCourse.id, newCourse.courseName);

   let fakeDiv = document.querySelector('#course_form');
   fakeDiv.before(newDiv);

   coursePatchEventListener(newCourse.id)

   console.log(newDiv.querySelector('#lesson_form'));
}

function createNormDate(date) {
   let newdate = new Date(date);
   return newdate.getDate() + '.' + (newdate.getMonth() + 1) + '.' + newdate.getFullYear();
}