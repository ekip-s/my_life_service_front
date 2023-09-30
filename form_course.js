const coursList = document.querySelector('.cource_list');

window.addEventListener('load', async () => {

   checkCourse();
   
/*
   coursList.forEach(course => {
      course.addEventListener('change', e => {
         console.log(e.target.value);
         console.log(
            (((e.target).parentNode).parentNode).parentNode
            .document.querySelector('.course_id'));
      });
   });
*/
});

async function checkCourse() {
   const url = `http://localhost:8081/api/v1/course/1`;
   const response = await fetch(url);
   const answer = await response.json();
   if(answer.length == 0) {
      addForm();
   } else {
      console.log('не пустой json')
   }
}

async function addForm() {
   let fakeDiv = document.createElement('div');
   fakeDiv.className = 'course_node';
   fakeDiv.innerHTML = 
   `
   <p class="course_id" hidden>not_id</p>
   <div class="course_top_meru">
      <div class="course_meru_left">
         <h3>Название курса:</h3>
         <input type="text" placeholder="Введи название курса">
      </div>
   </div>
   <hr>
   <div class="lesson_list">
   </div>
   `; 
   coursList.append(fakeDiv)

   fakeDiv.addEventListener('change', e => {
      console.log(e.target.value)
   });
}

