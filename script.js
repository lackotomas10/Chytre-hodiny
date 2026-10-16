var Today = new Date()

function GetToday(){
    var dd = String(Today.getDate());
    var mm = String(Today.getMonth() + 1); //Leden je is 0, proto + 1!
    var yyyy = String(Today.getFullYear());
    Today = dd+"."+mm+"."+yyyy
}

var LastTwoWeeks = []

function GetLastTwoWeeks(){
    GetToday()
    for(var i = 0; i < 14; i++){
            var d = new Date();
            d.setDate(d.getDate() - i);
            var dd = String(d.getDate());
            var mm = String(d.getMonth() + 1); 
            var yyyy = String(d.getFullYear());
            var formattedDate = dd + "." + mm + "." + yyyy;
            LastTwoWeeks.push(formattedDate);
    }
}

GetLastTwoWeeks()


async function GetGithubData(){
    const JménoGithub = "lackotomas10";
    var url = "https://deno.dev" + JménoGithub + "?y=last";
    
    try {
        var odpoved = await fetch(url);
        var data = await odpoved.json();
        console.log(data.contributions);

    } catch (chyba){
        console.error("Nepodařilo se připojit:", chyba);
    }
}
GetGithubData()