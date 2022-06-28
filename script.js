 // navigation for month.. if 0 is january, december is (nav-1) <--example only, you'll see in the next line
 let nav = 0;
 let clicked = null;
 let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
 
 //Global Variable
 const calendar = document.getElementById('calendar');
 const newEventModal = document.getElementById('newEventModal');
 const deleteEventModal = document.getElementById('deleteEventModal');
 const backDrop = document.getElementById('modalBackDrop');
 const eventTitleInput = document.getElementById('eventTitleInput');
 const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 
 // when user click at the date and the pop up to add text event box will display
 function openModal(date) {
   clicked = date;
 
   const eventForDay = events.find(e => e.date === clicked);
 
   if (eventForDay) {
     document.getElementById('eventText').innerText = eventForDay.title;
     deleteEventModal.style.display = 'block';
   } else {
     newEventModal.style.display = 'block';
   }
 
   backDrop.style.display = 'block';
 }
 
 
 //for actual date based pn realtime 
 function load() {
   const dt = new Date();
 
   if (nav !== 0) {
     dt.setMonth(new Date().getMonth() + nav);
   }
 //Inner variable
   const day = dt.getDate();
   const month = dt.getMonth();
   const year = dt.getFullYear();
 
   const firstDayOfMonth = new Date(year, month, 1);
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   
  // for en-gb is Malaysia Format, en-us is for US
   const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
     weekday: 'long',
     year: 'numeric',
     month: 'numeric',
     day: 'numeric',
   });
 
   //paddingDays mena it will not include last month days in the current month
   const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
   
   //display months text
   document.getElementById('monthDisplay').innerText = 
     `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
 
   //Document Object Model (DOM) that allows Javascript code to manipulate a website being displayed
   calendar.innerHTML = '';
 
   for(let i = 1; i <= paddingDays + daysInMonth; i++) {
     const daySquare = document.createElement('div');
     daySquare.classList.add('day');
 
     const dayString = `${month + 1}/${i - paddingDays}/${year}`;
 
     if (i > paddingDays) {
       daySquare.innerText = i - paddingDays;
       const eventForDay = events.find(e => e.date === dayString);
 
       if (i - paddingDays === day && nav === 0) {
         daySquare.id = 'currentDay';
       }
 
       if (eventForDay) {
         const eventDiv = document.createElement('div');
         eventDiv.classList.add('event');
         eventDiv.innerText = eventForDay.title;
         daySquare.appendChild(eventDiv);
       }
 
       daySquare.addEventListener('click', () => openModal(dayString));
     } else {
       daySquare.classList.add('padding');
     }
 
     calendar.appendChild(daySquare);    
   }
 }
 // part where we closed event after press button
 function closeModal() {
   eventTitleInput.classList.remove('error');
   newEventModal.style.display = 'none';
   deleteEventModal.style.display = 'none';
   backDrop.style.display = 'none';
   eventTitleInput.value = '';
   clicked = null;
   load();
 }
 
 //function saving event
 function saveEvent() {
   if (eventTitleInput.value) {
     eventTitleInput.classList.remove('error');
 
     events.push({
       date: clicked,
       title: eventTitleInput.value,
     });
 
     localStorage.setItem('events', JSON.stringify(events));
     closeModal();
   } else {
     eventTitleInput.classList.add('error');
   }
 }
 
 // delete event button after event is added on the slot
 function deleteEvent() {
   events = events.filter(e => e.date !== clicked);
   localStorage.setItem('events', JSON.stringify(events));
   closeModal();
 }
 
 // for all button
 function initButtons() {
   document.getElementById('nextButton').addEventListener('click', () => {
     nav++;
     load();
   });
 
   document.getElementById('backButton').addEventListener('click', () => {
     nav--;
     load();
   });
 
   document.getElementById('saveButton').addEventListener('click', saveEvent);
   document.getElementById('cancelButton').addEventListener('click', closeModal);
   document.getElementById('deleteButton').addEventListener('click', deleteEvent);
   document.getElementById('closeButton').addEventListener('click', closeModal);
 }
 
 initButtons();
 load();
 