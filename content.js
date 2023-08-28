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
  navbar[i].href = newNavLinks[i];
	navbar[i].innerHTML = newNavNames[i];
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

//calendar functionality
if (window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchd"){
  const calendar = document.querySelectorAll('.ddlabel > a');
  for (let i = 0; i < calendar.length; i++){
    let classDetails = calendar[i].innerHTML.split('<br>');

    let className = classDetails[0].trim();
    let classCode = classDetails[1].trim();
    let classTime = classDetails[2].trim();
    let classLocation = classDetails[3].trim();
    
    let googleCalendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${className}&dates=20230825T183000/20230825T204500&details=${className}&location=${classLocation}`;

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
if(window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchdDetl"){

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