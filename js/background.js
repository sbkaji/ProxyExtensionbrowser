onload = function() {
    authcheck()
    clientcheck()
    ipcheck();
    remainingDays()
    chrome.storage.sync.get('value', function(texts) {
            if (!texts != null) {
                var checkbox = document.getElementById('checkbox');
                console.log(texts.value);
                if (texts.value == "on") {
                    document.getElementById("checkbox").checked = true;

                } else {
                    document.getElementById("checkbox").checked = false;

                }
            }
        }) //codecheck()



    var checkbox = document.getElementById('checkbox');
    checkbox.onclick = function() {
        clientcheck()
        var config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: "proxy ip",
                    port: 2083
                },
                bypassList: ["google.com"]
            }
        };
        if (checkbox.checked) {
            remainingDays()
            console.log('Checked');
            ipcheck();
            clientcheck()
            chrome.storage.sync.set({ 'value': "on" }, function() {

            });
            chrome.proxy.settings.set({ value: config, scope: 'regular' },
                function() {});

        } else {
            console.log('unchecked');
            ipcheck();
            clientcheck()
            chrome.storage.sync.set({ 'value': "off" }, function() {});
            chrome.proxy.settings.clear({ scope: 'regular' },
                function() {});


        }
    }

    function authcheck() {
        document.getElementById('authButton').onclick = function() {
            var input = document.getElementById('authCode').value;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "your api to check authcode" + input);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function() {
                var response = JSON.parse(xhr.responseText);
                if (response.status == "pass") {
                    chrome.storage.sync.set({ 'value': "off" }, function() {});
                    chrome.proxy.settings.clear({ scope: 'regular' },
                        function() {});

                    chrome.storage.sync.set({ 'authcode': input }, function() {});
                    document.getElementById('auth').style.display = "none";
                    document.getElementById('buttonch').style.display = "block";
                    document.getElementById('countryname').style.display = "block";
                } else {
                    chrome.storage.sync.set({ 'authcode': null }, function() {});
                    document.getElementById("authLabel").innerHTML = "You entered wrong Code";
                }
            }
            xhr.send();
        }
    }

    function ipcheck() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.country.is");
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (response.country == "NP") {
                document.getElementById("country").innerHTML = "Nepal";
            } else {
                document.getElementById("country").innerHTML = "India";
            }
        }
        xhr.send();
    }

    function clientcheck() {
        remainingDays()
        chrome.storage.sync.get('authcode', function(texts) {
            if (texts.authcode != null) {
                var authcode = texts.authcode;
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "your api to check authcode" + authcode);
                xhr.onload = function() {
                    var response = JSON.parse(xhr.responseText);
                    if (response.status == "pass") {
                        var response = JSON.parse(xhr.responseText);
                        document.getElementById('auth').style.display = "none";
                        document.getElementById('buttonch').style.display = "block";
                        document.getElementById('countryname').style.display = "block";
                        document.getElementById("name").innerHTML = response.name;
                        document.getElementById("expire").innerHTML = response.exp;

                    } else {
                        remainingDays()
                        chrome.storage.sync.set({ 'value': "off" }, function() {});
                        chrome.proxy.settings.clear({ scope: 'regular' },
                            function() {});
                        chrome.storage.sync.set({ 'authcode': null }, function() {});
                        document.getElementById('auth').style.display = "block";
                        document.getElementById('buttonch').style.display = "none";
                        document.getElementById('countryname').style.display = "none";
                        document.getElementById("name").innerHTML = "Invalid Auth Code";
                        document.getElementById("expire").innerHTML = "Invalid Auth Code";
                    }

                }
                xhr.send();
            }
        })
    }

    function remainingDays() {
        chrome.storage.sync.get('authcode', function(texts) {
            if (texts.authcode != null) {
                var authcode = texts.authcode;
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "your api to check authcode" + authcode);
                xhr.onload = function() {
                    var response = JSON.parse(xhr.responseText);
                    var remain = response.exp;
                    let date_1 = new Date(remain);
                    let date_2 = new Date();
                    const days = (date_1, date_2) => {
                        let difference = date_1.getTime() - date_2.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return TotalDays;
                    }
                    document.getElementById("left").innerHTML = days(date_1, date_2) + " ";
                    if (days(date_1, date_2) < 1) {
                        document.getElementById("left").innerHTML = "Expired";
                        chrome.storage.sync.set({ 'authcode': null }, function() {});
                        chrome.storage.sync.set({ 'value': "off" }, function() {});
                        chrome.proxy.settings.clear({ scope: 'regular' },
                            function() {});
                        document.getElementById('auth').style.display = "block";
                        document.getElementById('buttonch').style.display = "none";
                        document.getElementById('countryname').style.display = "none";
                        document.getElementById("name").innerHTML = "Invalid Auth Code";
                        document.getElementById("expire").innerHTML = "Invalid Auth Code";
                        document.getElementById("authLabel").innerHTML = "Code is expired please renew your code";
                    }
                }
                xhr.send();
            }
        })
    }
}