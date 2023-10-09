// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  /* var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat); */
  var currentDate = dayjs();
  function setDate(input) {
    //sets the shown date to the date inputed
    currentDate = dayjs(input);
    console.log("currentDay: ", currentDate);
    $("#currentDay").text(currentDate.format("ddd, D MMM YYYY"));
  }

  function compareTime() {
    //compares each time block to current hour and sets apropriate classes
    var currentHour = dayjs();
    console.log("currentHour: ", currentHour.format("h"));
    $(".time-block").each(function () {
      $(this).removeClass("past present future");
      var hour = $(this).attr("id");
      hour = Number(hour.substring(hour.length - 2));
      if (dayjs(currentDate).hour(hour).isBefore(currentHour, "hour")) {
        $(this).addClass("past");
      } else if (dayjs(currentDate).hour(hour).isAfter(currentHour, "hour")) {
        $(this).addClass("future");
      } else {
        $(this).addClass("present");
      }
    });
  }

  function save() {
    //saves text from the textbox to local storage for chosen date and time
    var hour = $(this).parent().attr("id");
    var text = $(this).siblings(".description").val();
    var saveDate = dayjs(currentDate).format("DD/MM/YYYY");
    var calendar = JSON.parse(localStorage.getItem("calendar")) || {};
    if (!(saveDate in calendar)) {
      calendar[saveDate] = {};
    }
    console.log(calendar);
    var savedText = calendar[saveDate];
    savedText[hour] = text;
    console.log("Saved: ", savedText, " Calendar: ", calendar);
    localStorage.setItem("calendar", JSON.stringify(calendar));
  }

  function getSaved() {
    // gets stored events for the selected date at each time from local storage
    var saveDate = dayjs(currentDate).format("DD/MM/YYYY");
    var calendar = JSON.parse(localStorage.getItem("calendar")) || {};
    if (saveDate in calendar) {
      var events = calendar[saveDate];
      console.log("Events: ", events);
      $(".description").each(function () {
        var hour = $(this).parent().attr("id");
        $(this).val(events[hour]);
      });
    } else {
      $(".description").each(function () {
        //clears text boxes
        $(this).val("");
      });
    }
  }

  setDate();
  compareTime();
  getSaved();
  setInterval(compareTime, 600000); //checks time every 10 mins
  $("#selectDate").on("change", function () {
    //when the date in the selectDate input changes runs setDate and compareTime with new input
    var selected = $(this).val();
    setDate(selected);
    compareTime();
    getSaved();
  });
  $(".saveBtn").click(save);
});
