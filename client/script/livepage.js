function Time() {
    var log = new Date()


    // Adding time elements to the div
    document.getElementById("digital-clock").innerText = "Last logged at: \n"+log.toLocaleString();

    // Set Timer to 1 sec (1000 ms)
    // setTimeout(Time, 1000);


}



Time();