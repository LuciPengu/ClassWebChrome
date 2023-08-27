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
}



//teacher functionality
if(window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchdDetl"){
  var parseFile = function(text)
  {
    var parseLine = function(line)
    {
      var newLine = "";
      var add = true;
      for(var i = 0; i < line.length; i++)
      {
        if(add)
        {
          if(line[i] == '<')
            add = false;
          else
            newLine += line[i];
        }
        else if(line[i] == '>')
        {
          add = true;
        }
      }
      
      return newLine;
    }

    var classes = [];
    var lines = text.split("\n");

    var classNum = 0;
    //console.log("start");
    for(var i = 0; i < lines.length; i++)
    {
      if(lines[i].includes('<table class="datadisplaytable" summary="This layout table is used to present the schedule course detail"><caption class="captiontext">')) // class start
      
      {
        var className = parseLine(lines[i]);
        console.log("" + className);
        
        var classTimes = [];
        var classDays = [];
        var classBuilding = [];
        var classRoom = [];
        while (i < lines.length && !lines[i].includes('<table class="datadisplaytable" summary="This layout table is used to present schedule notes">'))
        {
          if(lines[i].includes('<td class="dddefault">Class</td>)') || lines[i].includes('<td class="dddefault">Lab</td>')) {
            classTimes.push(parseLine(lines[i+1]));
            classDays.push(parseLine(lines[i+2]));
            
            console.log("time: " + parseLine(lines[i+1]));
            console.log("day: " + parseLine(lines[i+2]));
            
            var bldroom = parseLine(lines[i+3]);
            console.log(bldroom);
            
            if(bldroom == "LTBA ONLINE")
            {
              classBuilding.push("ONLINE");
              classRoom.push("ONLINE");
            }
            else
            {
              var space = 0;
              while(bldroom[space] != ' ' && space < bldroom.length) space++;
              
              classBuilding.push(bldroom.substring(0, space));
              classRoom.push(bldroom.substring(space+1));
            }
            
            i+=7;
            }
          else
          {						
            i++;
          }
        }
        
        classes[classNum] = {
          name: className,
          times: classTimes,
          days: classDays,
          bldg: classBuilding,
          room: classRoom
        };
        
        classNum++;
      }

    }
    return classes;
  }

  document.cookie = "username=John; expires=" + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

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

  const classData = JSON.stringify(parseFile(document.documentElement.outerHTML));
  console.log(classData);
  
}

