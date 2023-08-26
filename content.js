console.log("Custom JS Has Been Injected.");

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css?family=Montserrat&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("styles.css");

const footer = document.getElementsByClassName("banner_copyright")[0];

const navbar = document.querySelectorAll('.taboff > a, .tabon > a');
const newNavLinks = ["bwskflib.P_SelDefTerm","bwskfshd.P_CrseSchd","bwskotrn.P_ViewTermTran","bzskvate.P_VateaOccsGoal"];
const newNavNames = ["My Classes", "My Schedule", "My Grades", "Pay Fees"];

for (let i = 0; i < navbar.length; i++) {
  navbar[i].href = newNavLinks[i];
	navbar[i].innerHTML = newNavNames[i];
}


if (window.location.pathname == "/pls/OWA_PROD/twbkwbis.p_idm_logout"){
  window.location.href = "/pls/OWA_PROD/twbkwbis.P_WWWLogin";
}

if (window.location.pathname == "/pls/OWA_PROD/bwskfshd.P_CrseSchd"){
  const calendar = document.querySelectorAll('.ddlabel > a');
  for (let i = 0; i < calendar.length; i++){
    console.log(calendar[i].innerHTML);
    let classDetails = calendar[i].innerHTML.split('<br>');

    let className = classDetails[0].trim();
    let classCode = classDetails[1].trim();
    let classTime = classDetails[2].trim();
    let classLocation = classDetails[3].trim();
    
    let googleCalendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${className}&dates=20230825T183000/20230825T204500&details=${className}&location=${classLocation}`;

    const googleCalendarButton = document.createElement('button');
    googleCalendarButton.textContent = '📅';
    googleCalendarButton.style.display = 'block';
    googleCalendarButton.style.marginTop = '10px';
    googleCalendarButton.addEventListener('click', () => {
        window.open(googleCalendarLink, '_blank');
    });

    calendar[i].after(googleCalendarButton);
  }
}




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

chrome.runtime.onMessage.addListener(function (message) {
  const { variableName, variableValue } = message;
  document.head.appendChild(link);
  localStorage.setItem(`custom-variable-${variableName}`, variableValue);
  document.documentElement.style.setProperty(
    `--${variableName}`,
    variableValue
  );
  
});


