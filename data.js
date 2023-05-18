"use strict";

window.addEventListener("load", init);

import Task from "./task.js";

let tasks =
[
    new Task("Ramen maaien"),
    new Task("Dak stofzuigen"),
    new Task("Planten afwassen"),
    new Task("Konijn afstoffen", true, "22-11-1994 12:23:00"),
    new Task("Muismat water geven"),
    new Task("Plakbandautomaat lappen", true, "23-10-2010 23:05:00"),
    new Task("Gras strijken")
];

let toDo = tasks.filter(task => {return !task.completed}); 
let completedToDo = tasks.filter(task => {return task.completed});

function init()
{
    //Display date
    const date = new Date();
    const year = date.getFullYear();
    document.getElementById("currentYear").textContent = year;
    const day = date.getDate();
    const month = date.getMonth()+1;
    document.getElementById("currentDate").textContent = day + " / " + month;

    //add eventlisteners to buttons
    const addTaskButton = document.getElementById("addTask");
    addTaskButton.addEventListener("click", addTask);
    const completeTaskButton = document.getElementById("MarkComplete");
    completeTaskButton.addEventListener("click", markTaskAsCompleted);
    const deleteTaskButton = document.getElementById("deleteTask");
    deleteTaskButton.addEventListener("click", deleteTask);
    const moveUpButton = document.getElementById("moveUp");
    moveUpButton.addEventListener("click", moveTaskUp);
    const moveDownButton = document.getElementById("moveDown");
    moveDownButton.addEventListener("click", moveTaskDown);
    //Fills tasks in correct category & show on screen
    fillTasks();
};

function fillTasks() //Tasks in de juiste categorie plaatsen (div + radiobutton aanmaken per taak, om en om classname toewijzen).
{
    createTasksOnScreen(toDo, false);
    createTasksOnScreen(completedToDo, true);
};

function createTasksOnScreen(taskArray, completedCategory, thisButton, moveUp)
{
    const section = completedCategory ? document.getElementById("contentCompletedElem") : document.getElementById("contentElem");
    let colorTasks = true;
    section.innerHTML = "";
    
    taskArray.map((task, index) => {
    
        //Aanmaken div:
        let newTaskDiv = document.createElement("div"); 
        section.appendChild(newTaskDiv);
        newTaskDiv.textContent = task.title;
        newTaskDiv.className = colorTasks ? "taskItem" : "taskItem colored"; 
        colorTasks = !colorTasks;

        //aanmaken radiobutton:
        let newTaskRadio = document.createElement("input"); 
        newTaskRadio.setAttribute("type", "radio");
        newTaskRadio.name = completedCategory ? "completedTasks" : "uncompletedTasks";
        newTaskRadio.value = index;
        newTaskDiv.appendChild(newTaskRadio);
    });

    // console.log(thisButton); 

    // const uncompletedTasksSection = document.getElementById("contentElem");
    // const uncompletedRadioButtons = uncompletedTasksSection.getElementsByTagName("input");
    // console.log(thisButton);

    // if (thisButton != undefined)
    // {
    //     for (let i = 0; i < uncompletedRadioButtons.length; i++)
    //     {
    //         if (uncompletedRadioButtons[i].value == thisButton.value)
    //         {
    //             moveUp ? uncompletedRadioButtons[i-1].checked = true: uncompletedRadioButtons[i+1].checked = true;
    //         };
    //     };
    // };
    if (thisButton != undefined)
    {
    keepButtonSelected(thisButton, moveUp);
    };
};


function addTask() //Voegt een ingetypte taak toe. --> wat moet het doen, en kun je de functie die dynamisch is gemaakt hergebruiken.
{
    const nameOfNewTask = document.getElementById("taskName"); //invulvak

    if (nameOfNewTask.value != "")
    {
        let alreadyExists = tasks.some((task) => { //Kijken of task al bestaat
            return task.title == nameOfNewTask.value; //geeft true als taak al bestaat
            });
       
        if (!alreadyExists)
        {
            tasks.push(new Task(`${nameOfNewTask.value}`)); //Als taak nog niet bestaat, dan nieuwe taak toevoegen
            toDo = tasks.filter(task => {return !task.completed}); 
            createTasksOnScreen(toDo, false);
        };
    };
    nameOfNewTask.value = ""; //Vakje weer leegmaken
};

// function removeOldTasks(taskArray, completedCategory) //Verwijderen van div's met taken. --> ook weer vorige functie aanroepen met parameter meegeven voor welke array. Misschien conditioneel maken voor het verwijderen?
// {
//     //Removes divs from given category
//     const section = completedCategory ? document.getElementById("contentCompletedElem") : document.getElementById("contentElem");

//     section.innerHTML = "";
// };

function markTaskAsCompleted() //controleert welke radio button aangevinkt is, zet completed op true en zet de complete date op vandaag. 
{
    const radioButtons = document.getElementsByName("uncompletedTasks");
    for (let i = 0; i < radioButtons.length; i++)
    {
        if (radioButtons[i].checked)
        {
            let completeThis = tasks.findIndex(element => element == toDo[i]);

            tasks[completeThis].completed = true; 
            
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
            tasks[completeThis].completeDate = `${day}`+"-"+`${month}`+"-"+`${year}`;

            //Reset both arrays
            toDo = tasks.filter(task => {return !task.completed}); 
            completedToDo = tasks.filter(task => {return task.completed});
            createTasksOnScreen(toDo, false);
            createTasksOnScreen(completedToDo, true);
        };
    };
};

function deleteTask() //Verwijderknop voor één taak.
{
    const completedTasksSection = document.getElementById("contentCompletedElem");
    const completedRadioButtons = completedTasksSection.getElementsByTagName("input");

    for (let i = 0; i < completedRadioButtons.length; i++)
    {
        if (completedRadioButtons[i].checked) //Oorspronkelijke index uit de tasks array pakken en die gebruiken.
        {
            let deleteThis = tasks.findIndex(element => element == completedToDo[i]); //indexnummer opvragen van item in hoofdarray tasks.
            if (deleteThis != -1) tasks.splice(deleteThis,1);            
        };
    };
    completedToDo = tasks.filter(task => {return task.completed});
    createTasksOnScreen(completedToDo, true);
};

function moveTaskUp() 
{
    const uncompletedTasksSection = document.getElementById("contentElem");
    const uncompletedRadioButtons = uncompletedTasksSection.getElementsByTagName("input");
    let selectedButton;

    //Loop through all the radiobuttons, if it's checked --> change sequence in tasks array
    for (let i = 1; i < uncompletedRadioButtons.length; i++)
    {
        if (uncompletedRadioButtons[i].checked)
        {
            selectedButton = uncompletedRadioButtons[i]; //Save which radiobutton is selected
            
            let moveThis = tasks.findIndex(element => element == toDo[i]);              
            let removedItems = tasks.splice(moveThis,1);
            let newIndex = moveThis;
            do {
                newIndex--;
            }
            while(tasks[newIndex].completed);
            tasks.splice(newIndex,0,...removedItems); //(waar, hoeveel weg, met wat vervangen)
        }; 
    };
    
    toDo = tasks.filter(task => {return !task.completed});
    createTasksOnScreen(toDo, false, selectedButton, true);
};

function moveTaskDown()
{
    const uncompletedTasksSection = document.getElementById("contentElem");
    const uncompletedRadioButtons = uncompletedTasksSection.getElementsByTagName("input");
    let selectedButton;

    //Loop through all the radiobuttons, if it's checked --> change sequence in tasks array
    for (let i = 0; i < uncompletedRadioButtons.length-1; i++)
    {
        if (uncompletedRadioButtons[i].checked)
        {
            selectedButton = uncompletedRadioButtons[i];
            //originele index in tasks opvragen, verwijderen item dat omlaag moet, originele index +1
            let moveThis = tasks.findIndex(element => element == toDo[i]);        
            let removedItems = tasks.splice(moveThis,1);
            let newIndex = moveThis + 1; //+1, want splice voegt de items ervoor toe.
            
            if(tasks[moveThis].completed)//if true, move task one more down
            {
                newIndex++;
            }
            //          (waar, hoeveel weg, met wat vervangen) --> Hij voegt ze ervoor toe.
            tasks.splice(newIndex,0,...removedItems); 
        }; 
    };
    toDo = tasks.filter(task => {return !task.completed});
    createTasksOnScreen(toDo, false, selectedButton, false);
};

function keepButtonSelected(thisButton, moveUp)
{
    const uncompletedTasksSection = document.getElementById("contentElem");
    const uncompletedRadioButtons = uncompletedTasksSection.getElementsByTagName("input");
    
    //Loop through radiobuttons, if it's the same radiobutton as the selected one, remain checked.
    //ternary operator: moveUp true is i-1, moveUp false is i+1.
    for (let i = 0; i < uncompletedRadioButtons.length; i++)
    {
        if (uncompletedRadioButtons[i].value == thisButton.value)
        {
            moveUp ? uncompletedRadioButtons[i-1].checked = true: uncompletedRadioButtons[i+1].checked = true;
        };
    };
};




//Up: createTasksOnScreen(toDo, false, selectedButton, true);
//Down: createTasksOnScreen(toDo, false, selectedButton, false);

// function createTasksOnScreen(taskArray, completedCategory, thisButton, moveUp)
// {
//     const section = completedCategory ? document.getElementById("contentCompletedElem") : document.getElementById("contentElem");
//     let colorTasks = true;
//     section.innerHTML = "";
    
//     taskArray.map((task, index) => {
    
//         //Aanmaken div:
//         let newTaskDiv = document.createElement("div"); 
//         section.appendChild(newTaskDiv);
//         newTaskDiv.textContent = task.title;
//         newTaskDiv.className = colorTasks ? "taskItem" : "taskItem colored"; 
//         colorTasks = !colorTasks;

//         //aanmaken radiobutton:
//         let newTaskRadio = document.createElement("input"); 
//         newTaskRadio.setAttribute("type", "radio");
//         newTaskRadio.name = completedCategory ? "completedTasks" : "uncompletedTasks";
//         newTaskRadio.value = index;
//         newTaskDiv.appendChild(newTaskRadio);
//     });
//     console.log(thisButton); 

//     const uncompletedTasksSection = document.getElementById("contentElem");
//     const uncompletedRadioButtons = uncompletedTasksSection.getElementsByTagName("input");
//     console.log(thisButton);

//     if (thisButton != undefined)
//     {
//         for (let i = 0; i < uncompletedRadioButtons.length; i++)
//         {
//             if (uncompletedRadioButtons[i].value == thisButton.value)
//             {
//                 moveUp ? uncompletedRadioButtons[i-1].checked = true: uncompletedRadioButtons[i+1].checked = true;
//             };
//         };
//     };
// };






//functie toevoegen om radio button geselecteerd (checked = true) te houden, doorgeven van welke taak geselecteerd moet blijven.

//functie movedown maken, proberen om dezelfde code van moveup ook voor movedown te gebruiken, het zou nog mooier zijn als exact dezelfde code voor allebei gebruikt kan worden.


    //Welke radiobutton van de toDo is geselecteerd 
    //Waar in de tasks array staat deze taak = indexnummer in tasks 
//1 omhoog indien bovenstaande taak uncompleted, 2 omhoog indien bovenstaande taak completed
    //Todo array resetten/initialiseren --> filter
    //Todo array on screen zetten --> createtasksonscreen (mét parameters).


//Bovenste move-uppen = error




//this oefening:

// class Person {
//     constructor(name) {
//         this.firstName = name;
//     }

//     showname() {
//         return 'My firstname is ' + this.firstName;
//     }
// }

// class Student extends Person {
//     constructor(name,course) {
//         super(name);
//         this.course = course;
//     }

//     show() {
//         return this.showname() + " and I study " + this.course;
//     }

//     showThis() {
//         console.log(this);
//     }
//     showThis1 = ()=> {
//         console.log(this);
//     }
// }

// const myStudent = new Student("John", "ES6");
// myStudent.showThis();


// window.addEventListener("load",  myStudent.showThis);

// const objectLiteralArrow = {
//     showThis: () => console.log( "arrow function: " + this)
// };

// const objectLiteral = {
//     showThis() { console.log( "normal function: " + this );}
// };

// objectLiteralArrow.showThis();
// objectLiteral.showThis();