document.addEventListener("DOMContentLoaded", function() {
  const applyButton = document.getElementById("apply");
  const variableNameInput = document.getElementById("variable-name");
  const variableValueInput = document.getElementById("variable-value");
  const preloadButtons = document.querySelectorAll(".preload-button");
  const saveButton = document.getElementById("save-button");

  applyButton.addEventListener("click", function() {
    const variableName = variableNameInput.value;
    const variableValue = variableValueInput.value;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { variableName, variableValue });
    });
  });

  preloadButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      const values = JSON.parse(button.getAttribute("data-values"));

      for (const variableName in values) {
        const variableValue = values[variableName];
        variableNameInput.value = variableName;
        variableValueInput.value = variableValue;

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { variableName, variableValue });
        });
      }
    });
  });
});
