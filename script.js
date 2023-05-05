const tableContainer = document.querySelector('table');
const maleTableContainer = document.querySelector('.male-table');
let inputElement = document.getElementById('search-bar');
const searchBtn = document.querySelector('.search-btn');
const tableBody = document.createElement('tbody');
const maleTableBody = document.createElement('tbody');
function formatPassing(flag) {
    return flag == true ? 'Passing' : 'Failed';
}
function displayTableData(studentsData) {
    studentsData.forEach(element => {
        const tableRow = document.createElement('tr');
        
        tableRow.innerHTML = `<td>${element.id}</td>
                              <td class="std-name">
                                 <img src="${element.img_src}" alt="">
                                 <p>${element.first_name + ' ' + element.last_name}</p>
                               </td>
                               <td>${element.gender}</td>
                               <td>${element.class}</td>
                               <td>${element.marks}</td>
                               <td>${formatPassing(element.passing)}</td>
                               <td>${element.email}</td>`;
        tableBody.append(tableRow);
        tableContainer.append(tableBody);
    });
}
async function loadTableData() {
    const JsonFile = 'MOCK_DATA.json';
    const response = await fetch(JsonFile);
    const data = await response.json();
    return data;
}

//When document loaded
document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadTableData();
    displayTableData(data);
});

function debounce(searchStudent, delay) {
    let timerId;
    return () => {
        clearTimeout(timerId);
        timerId=setTimeout(() => {
            searchStudent(inputElement.value);
        },delay)
    }
}

//function to display the list of options to the user under search bar
function popUpoUser(studentDetails) {
    studentDetails.forEach(item => {
    })
}

//filter the data based on search string
function filterData(searchString,data) {
    const result=data.filter(item => {
        const studentName = item.first_name + ' ' + item.last_name;
        const email = item.email;
        return studentName.toLowerCase().includes(searchString.toLowerCase()) || email.toLowerCase().includes(searchString.toLowerCase());
    });
    return result;
}


//Search student based on given string
async function searchStudent(searchString) {
    const dataListItems = document.getElementById('browser');
    dataListItems.innerHTML = '';
    const t = tableBody.children;
    let data = [];
    for (let i = 0; i < t.length; i++){
        data.push(t[i].children);
    }

    data.forEach(item => {
        const [first_name,last_name]=item[1].textContent.trim().split(' ');
        const optionNameItem = document.createElement('option');
        const optionEmailItem = document.createElement('option');
        optionNameItem.value = first_name + ' ' + last_name;
        optionEmailItem.value = item[6].textContent;
        dataListItems.append(optionNameItem);
        dataListItems.append(optionEmailItem);
    })
}
const search = debounce(searchStudent, 300);
inputElement.addEventListener('keyup', search)


//when search input is empty display all users data
inputElement.addEventListener('input', async () => {
    if (inputElement.value === '') {
        tableBody.innerHTML = '';
        const data = await loadTableData();
        displayTableData(data);
    }
    displayMaleAndFemaleTitle();
})


//Display user data when user click on search button
searchBtn.addEventListener('click', async () => {
    displayMaleAndFemaleTitle();
    const inputValue = inputElement.value;
    const t = tableBody.children;
    let data = [];
    for (let i = 0; i < t.length; i++){
        data.push(t[i].children);
    }
    
    const filteredData=data.filter(item => {
        const [first_name,last_name]=item[1].textContent.trim().split(' ');
        const email = item[6].textContent;
        const studentName = first_name + ' ' + last_name;
        return studentName.toLowerCase().includes(inputValue.toLowerCase()) || email.toLowerCase().includes(inputValue.toLowerCase());
    });
    const res = filteredData[0];
    const [first_name,last_name]=res[1].children[1].textContent.trim().split(' ');
    tableBody.innerHTML = '';
    const row = document.createElement('tr');
    row.innerHTML = `<td>${res[0].textContent}</td>
                   <td class="std-name">
                     <img src="${res[1].children[0].currentSrc}" alt="">
                     <p>${first_name + ' ' + last_name}</p>
                   </td>
                   <td>${res[2].textContent}</td>
                   <td>${res[3].textContent}</td>
                   <td>${res[4].textContent}</td>
                   <td>${res[5].textContent}</td>
                   <td>${res[6].textContent}</td>`;
    
    tableBody.append(row);
    tableContainer.append(tableBody);
})


// Sort by ascending order

function compareFullName(a, b) {
    const fullNameA = a.first_name + ' ' + a.last_name;
    const fullNameB = b.first_name + ' ' + b.last_name;
  
    if (fullNameA < fullNameB) {
      return -1;
    }
    if (fullNameA > fullNameB) {
      return 1;
    }
    return 0;
}

function compareFullNameDescending(a, b) {
    const fullNameA = a.first_name + ' ' + a.last_name;
    const fullNameB = b.first_name + ' ' + b.last_name;
  
    if (fullNameA > fullNameB) {
      return -1;
    }
    if (fullNameA < fullNameB) {
      return 1;
    }
    return 0;
}

function compareMarksAscending(a, b) {
    if (a.marks < b.marks) {
      return -1;
    }
    if (a.marks > b.marks) {
      return 1;
    }
    return 0;
}
  
function compareClassAscending(a,b) {
    if (a.class < b.class) {
        return -1;
      }
      if (a.class > b.class) {
        return 1;
      }
      return 0;
}
document.querySelector('.sort-asec').addEventListener('click', async () => {
    const response = await loadTableData();
    const sortedList = response.sort(compareFullName);
    tableBody.innerHTML = '';
    displayTableData(sortedList);
    displayMaleAndFemaleTitle();
})

document.querySelector('.sort-desc').addEventListener('click', async () => {
    const response = await loadTableData();
    const sortedList = response.sort(compareFullNameDescending);
    tableBody.innerHTML = '';
    displayTableData(sortedList);
    displayMaleAndFemaleTitle();
})

document.querySelector('.sort-marks').addEventListener('click', async () => {
    const response = await loadTableData();
    const sortedList = response.sort(compareMarksAscending);
    tableBody.innerHTML = '';
    displayTableData(sortedList);
    displayMaleAndFemaleTitle();
})

document.querySelector('.sort-pass').addEventListener('click', async () => {
    const response = await loadTableData();
    const sortedList = response.filter(item => {
        return item.passing == true;
    })
    tableBody.innerHTML = '';
    displayTableData(sortedList);
    displayMaleAndFemaleTitle();
})

document.querySelector('.sort-class').addEventListener('click', async () => {
    const response = await loadTableData();
    const sortedList = response.sort(compareClassAscending);
    tableBody.innerHTML = '';
    displayTableData(sortedList);
    displayMaleAndFemaleTitle();
})


function displayMaleTableData(maleList) {
    maleTableContainer.style.display = 'inline-table';
    maleList.forEach(element => {
        const tableRow = document.createElement('tr');
        
        tableRow.innerHTML = `<td>${element.id}</td>
                              <td class="std-name">
                                 <img src="${element.img_src}" alt="">
                                 <p>${element.first_name + ' ' + element.last_name}</p>
                               </td>
                               <td>${element.gender}</td>
                               <td>${element.class}</td>
                               <td>${element.marks}</td>
                               <td>${formatPassing(element.passing)}</td>
                               <td>${element.email}</td>`;
        maleTableBody.append(tableRow);
        maleTableContainer.append(maleTableBody);
    });
}
// Sort By Gender Functionality
function displayMaleAndFemaleTitle(flag=false) {
    const genderTitle = document.querySelectorAll('.gender');
    if (flag) {
        genderTitle.forEach(item => {
            item.style.display = 'block';
        })
    } else {
        genderTitle.forEach(item => {
            item.style.display = 'none';
        })
        maleTableBody.innerHTML = '';
        maleTableContainer.style.display = 'none';
    }
}
function seperateMaleAndFemale(dataList) {
    tableBody.innerHTML = '';
    const femaleList = dataList.filter(item => {
        return item.gender.toLowerCase() === 'female';
    })
    const maleList = dataList.filter(item => {
        return item.gender.toLowerCase() === 'male';
    })
    displayTableData(femaleList);
    displayMaleTableData(maleList);
    
    displayMaleAndFemaleTitle(true);
}
document.querySelector('.sort-gender').addEventListener('click', async () => {
    const data = await loadTableData();
    seperateMaleAndFemale(data);
})