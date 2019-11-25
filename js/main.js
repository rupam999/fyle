var query = "";
var data = [];
var currData = [];
var pageLimit = 10;
var firstPage = 1;
var currPage = 0;
var maxPage = 10
var totalItems = 10;

const compute = () => {
    totalItems = currData.length;
    maxPage = Math.ceil(totalItems / pageLimit);
    if(maxPage === 0){
        maxPage = 1;
    }
}

const handlePageLimitChange = (e) => {
    if(e === pageLimit){

    } else {
        pageLimit = e;
        currPage = 0;
        compute();
        viewCurrPage();
        repopulate();
    }
}

const place = "MUMBAI";

window.onload = async () => {
    waitForData();
    await getData(place);
    dataRecieved();
}

const waitForData = () => {
    console.log("recieving data");
    document.getElementById("myTextBox").disabled = true;
    document.getElementById("pageSize").disabled = true;
    document.getElementById("contents").innerHTML = "Waiting for data";
}

const getData = async (place) => {
    console.log(place)
    const url = `https://vast-shore-74260.herokuapp.com/banks?city=`+place
    let storageData = JSON.parse(sessionStorage.getItem(url));
    // console.log("storageData", storageData)
    if (storageData === null) {
        console.log("not in cache");
        let fetch = await axios.get(url)
        sessionStorage.setItem(url, JSON.stringify(fetch.data));
    } else {
        console.log("in cache")
    }
    data = JSON.parse(sessionStorage.getItem(url));  
    currData = data;
}

const dataRecieved = () => {
    // console.log("recieved data");
    document.getElementById("pageSize").disabled = false;
    document.getElementById("myTextBox").disabled = false;    
    populate(data);
}

const populate = () => {
    compute(); 
    viewCurrPage();
    let html = "";
    if(currData.length === 0){
        html = `Relevant Items Not Found`
        document.getElementById("contents").innerHTML = html
    }
    else {
        repopulate();
    }
}

const repopulate = () => {  
    // console.log("session storage");     
    let html = "";
    let counter = currPage * pageLimit
    for(let i = counter; i < counter + pageLimit && i < totalItems; i++){
        html += createHTML(currData[i])
    }
    document.getElementById("contents").innerHTML = html;
}


const countSize = (data) => {
    return data.length;
}
var bankIFSE = [];
const createHTML = (bankObj) => {
    let ifsc = bankObj.ifsc;
    let val = sessionStorage.getItem(ifsc);
    let fav = "";
    if(val === null){
        fav = "Favourite";
    } else if(val === "true"){
        fav = "Unfavourite";
        bankIFSE.push(ifsc);
    } else {
        fav = "Favourite";
    }
    var html =`
    <div class="card">
        <div class="card-body">
        <div class=row>
            <div class="col-md-12">
                <span class="w3-large"><b> ${bankObj.bank_name}</b></span><br>
                <span class=spanHeadingText>IFSC: </span><span class=spanDetails>${bankObj.ifsc}</span><br>
                <span class=spanHeadingText>Address: </span><span class=spanDetails>${bankObj.address}</span><br>
                <span class=spanHeadingText>Branch: </span><span class=spanDetails>${bankObj.branch}</span><br>
                <span class=spanHeadingText>District: </span><span class=spanDetails>${bankObj.district}</span><br>        
                <span class=spanHeadingText> State: </span><span class=spanDetails>${bankObj.state}</span><br>
            </div>
            <div class="col-md-10"><input type="button" ifsc=${bankObj.ifsc} class="fav btnArea" value="${fav}" onClick="handleFav(event)"></div>
        </div>
        </div>
    </div>
    `
    return html;
}

const handleFav = (e) => {
    const ifsc = e.target.getAttribute('ifsc')
    const fav =  e.target.value;
    // console.log(e.target.value)
    if(fav === "Favourite"){        
        e.target.value = 'Unfavourite'       
        sessionStorage.setItem(ifsc, true)
        // console.log("is session", sessionStorage.getItem(ifsc));
    } else {
        e.target.value = "Favourite" 
        sessionStorage.setItem(ifsc, false);
        // console.log("is session", sessionStorage.getItem(ifsc));        
    }
} 

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


var citySearch = debounce(function() {
    let searchCityValue = document.getElementById("cityFilter").value;
    searchCityValue = searchCityValue.toUpperCase();
    document.getElementById("pageSize").disabled = true;
    // console.log('again data');
    getData(searchCityValue);
    dataRecieved();
}, 1000);


var citySearchMain = debounce(function(searchName) {
    console.log(searchName);
    // let searchCityValue = document.getElementById("cityFilter").value;
    searchName = searchName.toUpperCase();
    document.getElementById("pageSize").disabled = true;
    // console.log('again data button');
    getData(searchName);
    dataRecieved();
}, 1000);



var inpFunc = debounce(function() { 
    currPage = 0;
    let searchValue = document.getElementById("myTextBox").value;
    searchValue = searchValue.toUpperCase();
    findInData(searchValue)
    populate(currData)
}, 1000);

const findInData = (searchValue) => {
    console.log(searchValue);
    let bankData = searchValue;
    currData = []
    for(obj of data){       
        let found = 0;
        for(keys in obj){
            if(typeof obj[keys] === "string"){
                let pos = obj[keys].indexOf(searchValue);
                if(pos !== -1){
                    found = 1;
                }
            }            
        }       
        if(found === 1){
            let newObj = obj; 
            currData[currData.length] = newObj;
        }
    }
}

const viewCurrPage = () => {
    document.getElementById("currPage").innerHTML = `${currPage+1} / ${maxPage}`;
}

const increment = () => {
    if(currPage >= maxPage - 1){

    } else {
        currPage++;
        viewCurrPage();
        repopulate();
    }    
}

const decrement = () => {
    if(currPage <= 0){
        
    }
    else {
        currPage--;
        viewCurrPage();
        repopulate();
    }    
}