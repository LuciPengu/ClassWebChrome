
if(document.querySelectorAll('b').length > 0 && document.querySelectorAll('b')[0].innerHTML == "Sign On to CLASS-Web"){
	const paragraphs = document.querySelectorAll('p');
	const tableBoxes = document.querySelectorAll('.tableboxportal');
	const headers = document.querySelectorAll('h2');
	const body = document.querySelectorAll('tr')[1];
	
	body.style = `
		position: absolute;
	  left: 50%;
	  top: 50%;
	  margin: -60px 0 0 50px;

	  -webkit-transform: translate(-50%, -50%);
	  transform: translate(-50%, -50%);
	`
	
	tableBoxes[1].style = "display:none";
	headers[1].style = "display:none";
	for (paragraph in paragraphs){
		paragraphs[paragraph].style = "display:none";
	}
}

console.log("Custom JS Has Been Injected.");

//styling
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("styles.css");

//font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css?family=Montserrat&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

//updated navbar
const navbar = document.querySelectorAll('.taboff > a, .tabon > a');
const newNavLinks = ["bwskflib.P_SelDefTerm","bwskfshd.P_CrseSchd","bwskotrn.P_ViewTermTran","bzskvate.P_VateaOccsGoal"];
const newNavNames = ["My Classes", "My Schedule", "My Grades", "Pay Fees"];

for (let i = 0; i < navbar.length; i++) {
  	if (i >= newNavLinks.length){
		navbar[i].style = "display:none";
	}
	else{
		navbar[i].href = newNavLinks[i];
		navbar[i].innerHTML = newNavNames[i];
	}
}


//color storage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith("custom-variable-")) {
    const variableName = key.slice("custom-variable-".length);
    const variableValue = localStorage.getItem(key);
    document.documentElement.style.setProperty(
      `--${variableName}`,
      variableValue
    );
  }
}

//popup listener
chrome.runtime.onMessage.addListener(function (message) {
  const { variableName, variableValue } = message;
  document.head.appendChild(link);
  localStorage.setItem(`custom-variable-${variableName}`, variableValue);
  document.documentElement.style.setProperty(
    `--${variableName}`,
    variableValue
  );
});


//logout functionality
if (window.location.pathname == "/pls/OWA_PROD/twbkwbis.p_idm_logout"){
  window.location.href = "/pls/OWA_PROD/twbkwbis.P_WWWLogin";
}

function convertTime(time){
	
	let today = new Date();
	let year = today.getFullYear();   // 4-digit year
	let month = today.getMonth() + 1; // Month (0-11, so adding 1)
	let day = today.getDate();  
	let [hour, min] = time.split(":");
	hour = parseInt(time);
	min = parseInt(min);
	
	hour += (hour != 12 && time.slice(-2) == "pm") ? 12 : 0;
		
	return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}${min.toString().padStart(2, '0')}00`;
}

//calendar functionality
if (window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchd"){
  const calendar = document.querySelectorAll('.ddlabel > a');
  for (let i = 0; i < calendar.length; i++){
    let classDetails = calendar[i].innerHTML.split('<br>');

    let className = classDetails[0].trim();
    let classCode = classDetails[1].trim();
    let classTime = classDetails[2].trim().split("-");
    let classLocation = classDetails[3].trim();
    
	let startTime = convertTime(classTime[0]);
	let endTime = convertTime(classTime[1]);
    let googleCalendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${className}&dates=${startTime}/${endTime}&details=${className}&location=${classLocation}`;

    let googleCalendarButton = document.createElement('button');
    googleCalendarButton.textContent = 'Google 📅';
    googleCalendarButton.style.display = 'block';
    googleCalendarButton.style.marginTop = '10px';
    googleCalendarButton.addEventListener('click', () => {
        window.open(googleCalendarLink, '_blank');
    });

    calendar[i].after(googleCalendarButton);
  }

  let detailedScheduleButton = document.createElement('button');
  detailedScheduleButton.textContent = 'See A More Detailed Schedule With Teachers';
  detailedScheduleButton.style.display = 'block';
  detailedScheduleButton.style.marginTop = '10px';
  detailedScheduleButton.addEventListener('click', () => {
    window.location.href = "bwskfshd.P_CrseSchdDetl"

  });
  let pageDiv = document.querySelectorAll(".pagebodydiv")[0];
  pageDiv.insertBefore(detailedScheduleButton, pageDiv.firstChild);
}


//teacher functionality
if(window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchdDetl" && document.querySelectorAll('h2')[0].innerHTML == "Student Detail Schedule"){
	
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const labels = document.querySelectorAll('.ddlabel');
  for (let i = 0; i < labels.length; i++){
    if(labels[i].innerHTML == "Assigned Instructor:"){
      let teacherName = labels[i].nextElementSibling.innerHTML.split(",")[0].split(" ");
      let firstName = capitalizeFirstLetter(teacherName[0].trim());
      let lastName = capitalizeFirstLetter(teacherName[teacherName.length -1].trim());

      let rateMyProfessorLink = `https://www.ratemyprofessors.com/search/professors/2352?q=${firstName}%20${lastName}`;

      let rateMyProfessorButton = document.createElement('button');
      rateMyProfessorButton.textContent = 'Rate My Professor';
      rateMyProfessorButton.style.display = 'block';
      rateMyProfessorButton.style.marginTop = '10px';
      rateMyProfessorButton.addEventListener('click', () => {
          window.open(rateMyProfessorLink, '_blank');
      });
  
      labels[i].nextElementSibling.append(rateMyProfessorButton);
    }
  }

  const captions = document.querySelectorAll(".captiontext");
  let classes = [];
  for (let i = 0; i < captions.length-1; i+=2){

    let classInfo = captions[i+1].nextElementSibling.querySelectorAll("tr");
    let oneClass = {
      "name": captions[i].innerHTML,
      "times": [],
      "days": [],
      "bldg": [],
      "room": []
    }
    console.log(classInfo)
    for (let j = 1; j < classInfo.length; j+=1){
      let tableRowData = classInfo[j].querySelectorAll(".dddefault")
      
      let time = tableRowData[1].innerHTML;
      if (time == '<abbr title="To Be Announced">TBA</abbr>')
        oneClass["times"].push("TBA");
      else
        oneClass["times"].push(tableRowData[1].innerHTML);
      
      let day = tableRowData[2].innerHTML;
      if (day != "&nbsp;")
        oneClass["days"].push(day);
      
      let location = tableRowData[3].innerHTML.split(" ");
      oneClass["bldg"].push(location[0]);
      oneClass["room"].push(location[location.length-1]);

    }
    classes.push(oneClass);
  }
  console.log(classes);
  let jsonString = JSON.stringify(classes);
  let encodedJson = encodeURIComponent(jsonString);

  let konradMapLink = `https://clientsidedullparentheses.hydrabeans.repl.co?c=${encodedJson}`;

  let konradMapButton = document.createElement('button');
  konradMapButton.textContent = 'See Where My Classes Are On A Map!';
  konradMapButton.style.display = 'block';
  konradMapButton.style.marginBottom = '10px';
  konradMapButton.addEventListener('click', () => {
      window.open(konradMapLink, '_blank');
  });
  let pageDiv = document.querySelectorAll(".pagebodydiv")[0];
  pageDiv.insertBefore(konradMapButton, pageDiv.firstChild);

}

//Hassieb's Grade viewer






// Create a new <div> element to serve as the container
const container = document.createElement('div');

// Set the ID attribute of the container (if needed)
container.id = 'my-table-container';

// Append the container to the document body or another element on the page
document.body.appendChild(container); // You can replace document.body with another element if necessary

// Now, proceed with extracting data and displaying it in the container

window.onload = function() {
  // Select the table by its class
  const table = document.querySelector('.datadisplaytable');

  if (table) {
    // Create a new HTML table to display the data
    const newTable = document.createElement('table');

    // Initialize a flag to track whether the notice has been displayed
    let noticeDisplayed = false;

    // Iterate through the rows in the table
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      // Check if this is the notice row and skip it
      if (!noticeDisplayed && row.textContent.includes('Transcript type:')) {
        noticeDisplayed = true;
        return;
      }

      // Create a new row in the new table
      const newRow = newTable.insertRow();

      // Iterate through the cells in the row
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        // Determine the cell type (header or data)
        const cellType = cell.tagName.toLowerCase();

        // Create a cell in the new table
        const newCell = cellType === 'th' ? document.createElement('th') : document.createElement('td');
        newCell.textContent = cell.textContent;

        // Append the new cell to the new row
        newRow.appendChild(newCell);
      });
    });

    // Append the new table to the container element
    container.appendChild(newTable);

    // Hide the old table
    table.style.display = 'none';
  } else {
    console.log('Table with class .datadisplaytable not found.');
  }
};












/*
document.querySelectorAll(".ddtitle")[0].remove();
document.querySelectorAll(".whitespace1")[0].remove();
document.querySelectorAll(".ddseparator")[0].remove();
document.querySelectorAll(".plaintable")[0].remove();
console.log(document.querySelectorAll(".pagebodydiv")[0]);
console.log(document.querySelectorAll(".datadisplaytable")[0]);
document.querySelectorAll(".ddseparator")[0].remove();
*/
// Select all the rows in the table

/*
const rows = document.querySelectorAll("tr");

// Create an array to store the extracted semester data
const semesters = [];

// Initialize variables to keep track of the current semester and course
let currentSemester = null;
let currentCourse = null;

// Loop through all the rows in the table
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const cells = row.querySelectorAll("td, th");
  
  // Check if this row contains semester-related data
  if (cells.length === 1) {
    const semesterLabel = cells[0].querySelector(".fieldOrangetextbold");
    if (semesterLabel) {
      const termLabel = semesterLabel.textContent.trim();
      
      // Create an object to store the extracted semester data
      const semesterInfo = {
        termLabel,
        courses: [], // Initialize an array to store course data within this semester
      };
      
      semesters.push(semesterInfo); // Add semester data to the array
      currentSemester = semesterInfo; // Update the current semester
    }
  }
  
  // Check if this row contains course data
  if (cells.length === 13 && currentSemester) {
    const subject = cells[0].textContent.trim();
    const courseNumber = cells[1].textContent.trim();
    const campus = cells[2].textContent.trim();
    const grade = cells[6].textContent.trim();
    const creditUnits = cells[8].querySelector("p").textContent.trim();
    const gradePoints = cells[10].querySelector("p").textContent.trim();
    
    // Create an object to store the extracted course data
    const courseInfo = {
      subject,
      courseNumber,
      campus,
      grade,
      creditUnits,
      gradePoints,
    };
    
    currentCourse = courseInfo; // Update the current course
    currentSemester.courses.push(courseInfo); // Add course data to the current semester
  }
}

// Now, the 'semesters' array contains all the extracted semester data, each with course-specific data
console.log(semesters);

// ... (your existing code for data extraction)

// Remove the old table
const oldTable = document.querySelectorAll(".datadisplaytable")[0];
if (oldTable) {
  oldTable.remove();
}

// Create a container div to hold the data
const dataContainer = document.createElement("div");

// Loop through the semesters array and create a section for each semester
for (const semester of semesters) {
  // Create a div for the semester data
  const semesterDiv = document.createElement("div");
  semesterDiv.className = "semester"; // Add a class for styling (optional)

  // Add the term label for the semester
  const termLabel = document.createElement("h2");
  termLabel.textContent = semester.termLabel;
  semesterDiv.appendChild(termLabel);

  // Create a table for the courses within the semester
  const courseTable = document.createElement("table");

  // Create a table header row
  const tableHeader = document.createElement("tr");

  // Add table header cells for each course attribute (subject, course number, etc.)
  const headers = ["Subject", "Course Number", "Campus", "Grade", "Credit Units", "Grade Points"];
  for (const headerText of headers) {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    tableHeader.appendChild(headerCell);
  }

  courseTable.appendChild(tableHeader);

  // Loop through the courses and create rows for course data
  for (const course of semester.courses) {
    const courseRow = document.createElement("tr");

    // Create table data cells for each course attribute
    const subjectCell = document.createElement("td");
    subjectCell.textContent = course.subject;
    courseRow.appendChild(subjectCell);

    const courseNumberCell = document.createElement("td");
    courseNumberCell.textContent = course.courseNumber;
    courseRow.appendChild(courseNumberCell);

    const campusCell = document.createElement("td");
    campusCell.textContent = course.campus;
    courseRow.appendChild(campusCell);

    const gradeCell = document.createElement("td");
    gradeCell.textContent = course.grade;
    courseRow.appendChild(gradeCell);

    const creditUnitsCell = document.createElement("td");
    creditUnitsCell.textContent = course.creditUnits;
    courseRow.appendChild(creditUnitsCell);

    const gradePointsCell = document.createElement("td");
    gradePointsCell.textContent = course.gradePoints;
    courseRow.appendChild(gradePointsCell);

    courseTable.appendChild(courseRow);
  }

  semesterDiv.appendChild(courseTable);

  // Append the semester div to the data container
  dataContainer.appendChild(semesterDiv);
}

// Append the data container to the document's body or a specific element
document.body.appendChild(dataContainer);
*/





