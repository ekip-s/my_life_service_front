const coursList = document.querySelector('.cource_list');
const courseURL = 'http://localhost:8081/api/v1';
const myUUID = 'a1d5ca3c-fdb5-49be-b73c-32dca343c6c7';

//прогрузка эл-тов при открытии страницы
window.addEventListener('load', async () => {
   const answer = await getAllCourse();
   if(answer.length != 0) {
      createFormList(answer);
   } 

   await createFakeCourseForm(answer);

   await createFakeLessonForm(answer);
});

//создает форму урока в конце последнего курса
async function createFakeLessonForm(answer) {
   if(answer.length != 0) {
      const courceId = answer[answer.length - 1].id;
      const newLesson = createNewLessonForm('lesson_fake_form', '...', '', '');

      const lessonListForm = document.getElementById(courceId).querySelector('.lesson_list');
      lessonListForm.append(newLesson);
      addNewLessonPostEventListener(courceId);
   } 
}

//обработчик для формы создания новых уроков
function addNewLessonPostEventListener(courceId) {
   const fakeFormInput = document.getElementById('lesson_fake_form-text-input');
   const fakeForm = document.getElementById('lesson_fake_form');

   fakeFormInput.addEventListener('change', async e => {
      let name = e.target.value;

      if (name.trim()) {
         const lesson = await postLesson(courceId, name);
         const lessonForm = createNewLessonForm(lesson.id, lesson.lessonNum, lesson.planedStartDate, name);
         fakeForm.before(lessonForm);
         fakeFormInput.value = '';
         addNewLessonPatchEventListener(lesson.id);
         addDoneEventListener(lesson.id, courceId);
         if (lesson.lessonNum === 1) {
            createFakeCourseForm(await getAllCourse()); 
         }
      }
   })


}

//создает пустую форму для нового курса
async function createFakeCourseForm(answer) {

   if(answer.length == 0 || (answer.length != 0 && 
      (await getAllLessons(answer[answer.length - 1].id)).length > 0)) {
      const courseForm = createCourseNode('course_fake_form', '');
      coursList.append(courseForm);
      coursePostEventListener('course_fake_form');
   }

}

//создает PATCH обработчик для курса
function coursePatchEventListener(id) {
   let fakeInput = document.getElementById(id + '-input');
   fakeInput.addEventListener('change', async e => {
      let name = e.target.value;
      if (name.trim()) {
         patchCourse(id, name);
         fakeInput.value = name;
      }      
   });
}

//post обработчик для формы курсов
function coursePostEventListener(id) {
   let fakeInput = document.getElementById(id + '-input');
   fakeInput.addEventListener('change', async e => {
      let name = e.target.value;
      if (name.trim()) {
         const course = await postCourse(name);
         let newDiv = createCourseNode(course.id, course.courseName);
         const fakeInputForm = document.getElementById(id);

         const lastFakeLessonForm = document.getElementById('lesson_fake_form');
         if(lastFakeLessonForm !== null) {
            lastFakeLessonForm.remove();
         }

         fakeInputForm.before(newDiv);
         coursePatchEventListener(course.id);
         fakeInputForm.remove();      
         createFakeLessonForm(await getAllCourse());   
      }
   })
}

// создает формы при загрузке страницы;
function createFormList(answerJSON) {

   answerJSON.forEach(async course => {
      let newDiv = createCourseNode(course.id, course.courseName);
      
      coursList.append(newDiv);

      if(course.endDate !== null) {
         const courseMenu = document.getElementById(course.id).querySelector('.course_meru_left');
         let newDateDiv = createDateDiv(course.startDate, course.endDate);
         courseMenu.after(newDateDiv);
      }

      coursePatchEventListener(course.id);

      await addCourseLessonsList(course.id);
   })
   
}

//создает div с датами курса;
function createDateDiv(startDate, endDate) {
   let newDateDiv = document.createElement('div');
   newDateDiv.className = 'course_meru_rigth';
   newDateDiv.innerHTML = 
   `
   <div clacc="course_top_meru_dt">
      Дата начала курса: ${createNormDate(startDate)}
      <br>
      Дата завершения курса: ${createNormDate(endDate)}
   </div>   
   `;
   return newDateDiv;
}

//создает уроки внутри курса; 
async function addCourseLessonsList(courseId) {
   const lessonsList = await getAllLessons(courseId);
   if(lessonsList.length != 0) {
      const lessonListform = document.getElementById(courseId).querySelector('.lesson_list');
   
      lessonsList.forEach(async lesson => {
         const newLesson = createNewLessonForm(lesson.id, lesson.lessonNum, lesson.planedStartDate, lesson.lessonName);
         lessonListform.append(newLesson);
         addNewLessonPatchEventListener(lesson.id);
         addDoneEventListener(lesson.id, courseId);
      })
   }
}

//Обращение к бэку для завершения урока
function addDoneEventListener(lessonId, courseId) { //добавить в переменные
   const lessonCheckbox = document.getElementById(lessonId + '-checkbox');

   lessonCheckbox.addEventListener('change', async e => {
      const lessonNode = lessonCheckbox.closest('.lesson_node');
      await doneLesson(lessonId);
      lessonNode.remove();
      await checkCourseDone(courseId);
   }) 
}

async function checkCourseDone(courseId) {
   const lessonCount = (await getAllLessons(courseId)).length;
   if(lessonCount === 0) {
      const course = document.getElementById(courseId); 
      await doneCourse(courseId);
      course.remove(); 
   }
}

//patch обработчик для урока
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


//обращение к бэку для обновления названия
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

//создает форму уроков по шаблону; 
function createNewLessonForm(lessonId, lessonNum, lessonDate, lessonName) {
   let newDiv = document.createElement('div');
   newDiv.className = 'lesson_node';
   newDiv.id = lessonId;
   newDiv.innerHTML =
   `
   <div class="lesson_menu">
      <div class="lesson_checkbox">
         <input id="${lessonId + '-checkbox'}" type="checkbox">
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

//создает форму курса из шаблона;
function createCourseNode(id, courseName) {
   let newDiv = document.createElement('div');
   newDiv.className = 'course_node';
   newDiv.id = id;
   newDiv.innerHTML =
      `
      <div class="course_top_meru">
         <div class="course_meru_left">
            <h3>Название курса:</h3>
            <input id="${id + '-input'}" type="text" placeholder="Введи название курса" value="${courseName}">
         </div>
      </div>
      <hr>
      <div class="lesson_list">
         
      </div>
      `;

   return newDiv;
}

//обращение к бэку для создания нового урока
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

//обращение к бэку для создания нового курса
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

//обращение к бэку для создания урока, внутри курса
async function postLesson(courseId, lessonName) {
   const response = await fetch(courseURL + '/lesson/person/' + myUUID + '/course/' + courseId + '/name/' + lessonName, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json();
}

// обращение к бэку для обновления названия курса;
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

// обращение к бэку для выполнения урока
async function doneLesson(lessonId) {

   const response = await fetch(courseURL + '/lesson/done/' + lessonId, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json(); 
}

// обращение к бэку для выполнения курса 
async function doneCourse(courseId) {
   const response = await fetch(courseURL + '/course/' + courseId + '/done', {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors'
          });
   return await response.json(); 
}

//обращение к бэку для получения листа курсов
async function getAllCourse() {
   const url = courseURL + '/course/list/' + myUUID;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}

// обращается к бэку за листом курсов;
async function getAllLessons(courseId) {
   const url = courseURL + '/lesson/list/' + courseId;
   const response = await fetch(url);
   const answer = await response.json();
   return answer;
}

//создает читаемую дату
function createNormDate(date) {
   let newdate;
   if(date.trim()) {
      newdate = new Date(date);
   } else {
      newdate = new Date();
   }
   return newdate.getDate() + '.' + (newdate.getMonth() + 1) + '.' + newdate.getFullYear();
}